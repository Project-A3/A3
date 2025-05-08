import { toSafeInteger } from 'lodash';
import { cloneDeep, isArray, isEmpty, merge, remove } from 'lodash-es';
import { defineStore } from 'pinia';
import {
  apiDoClamConfirm,
  apiDoManual,
  apiDoManualDisb,
  apiDoPayDecision,
  apiGetCalcMesgs,
  apiGetClamItemOpts,
  apiGetCreatManualPayItem,
  apiGetDiagKindList,
  apiGetDisbTable,
  apiGetExpenseDetail,
  apiGetInsuranceDetail,
  apiGetNotice,
  apiGetOpGradeList,
  apiGetPayDetail,
  apiGetPayDetailReview,
  apiGetPayItems,
  apiGetPayItemsReadOnly,
  apiGetPolicies,
  apiGetReCalPayItems,
  apiClearCalculate,
  apiGetRelieveRmk,
  apiIsCurrentPassDay,
  apiQueryRjctResnList,
  apiGetReasonList,
  apiSaveClamData,
  apiSaveExptNo,
  apiSavePayDetail,
  apiSaveRelieveRmk,
  apiReadBasicData,
  apiGetDisputedCases,
  apiDoAlertDisputedCases,
  apiGetDisputedCasesAplyNO,
  apiCheckMultAcptRule
} from '~/common/api';
import { PayItemStatus } from '~/common/utils/enum';
import { useApplyStore } from './apply';

export const useAccountingStore = defineStore('accounting', {
  state: () => ({
    payItemsData: {
      DATA: [],
      DATA_006: []
    },
    calcMesgsData: {
      MESSAGES: []
    },
    payDetailReviewData: {
      BENE_INFO: []
    },
    sprData: {
      DTAAB032List: [],
      DTAAB019List: []
    },
    isPageChanged: false,
    isTopLimit: false,
    topLimitMsg: '',
    // 類別下拉選單選項
    diagKindList: null,
    disbTableData: null,
    // 試算調整按鈕是否disable
    disableDoConfirm: true,
    // 試算異常識別
    calcFlag: true,
    // 分期識別
    sprFlag: false,
    //爭議案件
    DisputedData: null,
    DisputedCasesData:{
      type1_checked : false,
      type2_checked : false,
      type3_checked : false,
      type1_AMT : '',
      type2_AMT : '',
      type3_AMT : '',
      IS_ALL_NTD : '',
      CURR_EN:''
    },
    isDispChanged: false
  }),
  getters: {
    currentSerNo: (state) => {
      let serNo = 1;
      for (const payItem of state.payItemsData?.DATA) {
        if (toSafeInteger(payItem.SER_NO) > serNo) {
          serNo = toSafeInteger(payItem.SER_NO);
        }
      }
      return serNo;
    },
    totalAmount: (state) => {
      let calResult = 0;
      let payResult = 0;
      for (const payItem of state.payItemsData?.DATA) {
        calResult += parseFloat(payItem.TRIL_CALC_AMT.replaceAll(',', ''));
        payResult += parseFloat(payItem.PAY_AMT.replaceAll(',', ''));
      }
      return { calResult, payResult };
    }
  },
  actions: {
    /**
     * 取得核算結果頁面要的資料
     * @param {String} applyNo 受理編號
     */
    async getAllData(applyNo) {
      const applyStore = useApplyStore();
      const result = {
        isSuccess: false,
        message: ''
      };

      // LICXS-627重新取得基本資料並更新標籤
      const readBasicResp = await Promise.all([apiReadBasicData([applyNo])]);
      let basicDataResult = readBasicResp[0].data.result;
      let basicDataObj = basicDataResult.IS_SUCCESS ? basicDataResult : {};
      
      if (basicDataObj != {}) {
        applyStore.basicData.CASE_TAG = basicDataObj.CASE_TAG;
        applyStore.basicData.AGE = basicDataObj.AGE;
      }

      // 這個『10.試算結果，API：getPayItems』CALL成功，得到試算結果後，需接著CALL『15.讀取試算訊息，API：getCalcMesgs』。
      const response = !applyStore.isManager ? await apiGetPayItems([applyNo]) : await apiGetPayItemsReadOnly([applyNo]);
    
      const getPayItemsResult = response.data.result;
      result.isSuccess = getPayItemsResult.IS_SUCCESS;
      result.message = getPayItemsResult.RTN_MSG;

      if (!result.isSuccess) {
        if (getPayItemsResult.ERROR_CODE === '-1') {
          this.calcFlag = false;
        } else {
          this.calcFlag = true;
        }

        this.payItemsData.DATA = [];
        this.calcMesgsData.MESSAGES = [];
        this.sprData.DTAAB032List = [];
        this.sprData.DTAAB019List = [];
        return result;
      }

      this.calcFlag = true;
      this.payItemsData = getPayItemsResult;

      // NEED_SPR是否需做保單分期設定(Y/N)，"Y" => 試算調整確認btn改為須點選狀態，且必點才能換頁籤
      this.disableDoConfirm = getPayItemsResult.NEED_SPR != 'Y';
      this.sprFlag = getPayItemsResult.NEED_SPR === 'Y';
      this.sprData.DTAAB019List = getPayItemsResult.DTAAB019List ?? [];
      this.sprData.DTAAB032List = getPayItemsResult.DTAAB032List ?? [];
      
      if (applyStore.isManager) {
        const response2 = await apiGetCalcMesgs([applyNo, 'Y']);
        const getCalcMesgsResult = response2.data.result;
        result.isSuccess = getCalcMesgsResult.IS_SUCCESS;
        result.message = getCalcMesgsResult.RTN_MSG;
        if (!result.isSuccess) return result;
        this.calcMesgsData = getCalcMesgsResult;
        console.log(this.calcMesgsData);

        const response3 = await apiGetPayDetailReview([applyNo]);
        const payDetailResult = response3.data.result;
        result.isSuccess = payDetailResult.IS_SUCCESS;
        result.message = payDetailResult.RTN_MSG;
        if (!result.isSuccess) return result;
        this.payDetailReviewData = payDetailResult;
        console.log(this.payDetailReviewData);

        // 加上延滯息自動更新資訊
        console.log('>>>getPayItemsResult.RTN_MSG=' + getPayItemsResult.RTN_MSG);
        console.log('>>>result.message=' + result.message);
        if (getPayItemsResult.RTN_MSG != '' && getPayItemsResult.RTN_MSG != undefined && getPayItemsResult.RTN_MSG != null) {
          if (result.message === '') {
            result.message = getPayItemsResult.RTN_MSG
          } else {
            result.message = result.message + '\n' + getPayItemsResult.RTN_MSG
          }
        }
      } else {
        this.calcMesgsData.MESSAGES = getPayItemsResult.DATA_012;
      }

      //幣別代號查詢
       if (this.payItemsData.DATA.length > 0){
          this.DisputedCasesData.CURR_EN = this.payItemsData.DATA[0].CURR;
          this.DisputedCasesData.IS_ALL_NTD = this.payItemsData.IS_ALL_NTD;
          if(this.DisputedCasesData.IS_ALL_NTD === 'Y') {
            this.DisputedCasesData.type1_AMT = this.DisputedCasesData.type1_AMT
            ? this.DisputedCasesData.type1_AMT.split('.')[0]
            : '';
          this.DisputedCasesData.type2_AMT = this.DisputedCasesData.type2_AMT
            ? this.DisputedCasesData.type2_AMT.split('.')[0]
            : '';
          this.DisputedCasesData.type3_AMT = this.DisputedCasesData.type3_AMT
            ? this.DisputedCasesData.type3_AMT.split('.')[0]
            : '';
          }
        }

      this.isPageChanged = false;
      return result;
    },

    /**
     * 回復試算
     * @param {String} applyNo
     */
    async getReCalPayItems(applyNo) {
      const response = await apiGetReCalPayItems([applyNo]);
      const result = response.data.result;
      if (result.IS_SUCCESS) {
        this.payItemsData = result;
        if (result.DATA_012) {
          this.calcMesgsData.MESSAGES = result.DATA_012;
        }
        this.sprData.DTAAB032List = [];
        this.sprData.DTAAB019List = [];
        this.disableDoConfirm = result.NEED_SPR != 'Y';
      }
      return { isSuccess: result.IS_SUCCESS, message: result.RTN_MSG };
    },

    /**
     * 清除試算結果
     * @param {String} applyNo
     */
    async getClearCalculate(applyNo) {
      const response = await apiClearCalculate([applyNo]);
      const result = response.data.result;
      if (result.IS_SUCCESS) {
        this.payItemsData.DATA = [];
        this.calcMesgsData.MESSAGES = [];
        this.sprData.DTAAB032List = [];
        this.sprData.DTAAB019List = [];
      }
      return { isSuccess: result.IS_SUCCESS, message: result.RTN_MSG };
    },

    async getCalcMessages(applyNo, isChecked) {
      try {
        const response = await apiGetCalcMesgs([applyNo, isChecked ? 'Y' : 'N']);
        const getCalcMesgsResult = response.data.result;
        if (!getCalcMesgsResult.IS_SUCCESS) throw getCalcMesgsResult.RTN_MSG;
        this.calcMesgsData = getCalcMesgsResult;
        return getCalcMesgsResult.MESSAGES;
      } catch (e) {
        throw e;
      }
    },

    /**
     * 取得投保明細
    //  * @param {String} ocrId 事故人ID
    //  * @param {String} ocrDate 事故日期
     * @param {String} applyNo 受理編號
     */
    async getInsuranceDetail(applyNo) {
      try {
        const response = await apiGetInsuranceDetail([applyNo]);
        const result = response.data.result;
        if (!result.IS_SUCCESS) throw result.RTN_MSG;
        result.POLICY_INFO.forEach((e) => (e.javaClass = 'java.util.Map'));
        return { POLICY_INFO: result.POLICY_INFO, CLAM_CAT_INFO: result.CLAM_CAT_INFO };
      } catch (e) {
        throw e;
      }
    },
    /**
     * 取得理賠項目資料
     * @param {String} prodId 險別
     * @param {String} clamCat 索賠類別
     */
    async getClaimAmts(prodId, clamCat) {
      try {
        const response = await apiGetClamItemOpts([prodId, clamCat]);
        const result = response.data.result;
        if (!result.IS_SUCCESS) throw result.RTN_MSG;
        return result.CLAM_AMT_INFO;
      } catch (e) {
        throw e;
      }
    },
    /**
     * 新增核付項目
     * @param {String} applyNo 受理編號
     * @param {String} policies 要新增的保單核付項目
     */
    async creatManualPayItem(applyNo, policies) {
      try {
        const instances = cloneDeep(policies);
        let nextSerNo = this.currentSerNo + 1;
        console.log(instances);
        instances.forEach((policy) => {
          policy.PROD_NAME = policy.PROD_ID_NAME;
          policy.PROD_KIND_NAME = policy.PROD_KIND === '1' ? '主' : '附';
          // 設為人工新增
          policy.MAN_ISRT_IND = 'Y';
          // 設為該次新增
          policy.INS_CTL_FLAG = 'Y';
          policy.IS_CHECKED = 'N';
          policy.APLY_NO = applyNo;
          policy.SER_NO = nextSerNo.toString();
          policy.javaClass = 'com.cathay.aa.b3.bo.AA_B3Z310_bo';
          nextSerNo++;
          // policy.CLAM_AMT_NAME = policy.CLAM_AMT_OPTIONS.find((o) => o.selected)?.name; // 已改成畫面新增時就放入
          // default value: 0
          // policy.TRIL_CALC_AMT = policy.TRIL_CALC_AMT ? policy.TRIL_CALC_AMT : '0';
          // policy.PAY_AMT = policy.PAY_AMT ? policy.PAY_AMT : '0';

          // 刪除不要的屬性
          delete policy.CLAM_CAT_INFO;
          delete policy.CLAM_CAT_OPTIONS;
          delete policy.CLAM_AMT_OPTIONS;
          delete policy.CLAM_AMT_LOADING;
          delete policy.UUID;
        });
        console.log(instances);
        // 呼叫API儲存 => 要帶整個核算結果資料(包含新增的)
        const clonePayItemsData = cloneDeep(this.payItemsData.DATA);
        for (const instance of instances) {
          clonePayItemsData.push(instance);
        }
        const response = await apiGetCreatManualPayItem([clonePayItemsData]);
        const result = response.data.result;
        if (!result.IS_SUCCESS) throw result.RTN_MSG;

        // API會回傳所有資料回來
        this.payItemsData.DATA = result.DATA;

        // 處理覆蓋問題，回復多受益人分配設定異動
        for (const updPayItem of clonePayItemsData) {
          this.setPayItemsDataAfterAction(updPayItem);
        }

        this.disableDoConfirm = false;

        return true;
      } catch (e) {
        console.error(e);
        throw e;
      }
    },
    /**
     * 更改核付項目狀態
     * @param {Object} 物件
     */
    async doPayDecision({ applyNo, ocrId, status, reson, memo, policies }) {
      try {
        if (!reson) throw '請選擇修改原因';
        const clonePayItems = cloneDeep(this.payItemsData.DATA);
        const instances = policies.map((p, index) => ({
          ...p.CLAM_ITEM,
          CHG_RESN: reson,
          CHG_MEMO: memo,
          PAY_STS: status,
          PAY_STS_NAME: PayItemStatus.getChineseStatus(status),
          PAY_AMT: status === PayItemStatus.ReturnNotPay || status === PayItemStatus.Bypass ? '0' : p.CLAM_ITEM.PAY_AMT
        }));

        console.log(instances);

        // 更改畫面上的狀態
        for (const p of instances) {
          const findItem = clonePayItems.find((g) => g.POLICY_NO === p.POLICY_NO && g.SER_NO === p.SER_NO);
          if (findItem) {
            Object.assign(findItem, p);
          } else {
            throw `資料錯誤，查無核付項目SER_NO=${p.SER_NO}`;
            break;
          }
        }

        // 0825 呼叫API改成帶全部
        const response = await apiDoPayDecision([clonePayItems]);
        const result = response.data.result;
        if (!result.IS_SUCCESS) throw result.RTN_MSG;
        // 成功後更新資料(API會回傳)
        this.payItemsData.DATA = result.DATA;

         // 處理覆蓋問題，回復多受益人分配設定異動
         for (const updPayItem of clonePayItems) {
           this.setPayItemsDataAfterAction(updPayItem);
         }

        // 選擇的資料，清空多受益人欄位
        for (const p of instances) {
          const findItem = this.payItemsData.DATA.find((g) => g.POLICY_NO === p.POLICY_NO && g.SER_NO === p.SER_NO);
          if (findItem) {
            findItem.IS_MULT_ACPT = 'N';
            findItem.MULT_APCT_AMT = '0';
          }
        }

        this.disableDoConfirm = false;

        return true;
      } catch (e) {
        console.error(e);
        throw e;
      }
    },

    /**
     * 查詢解除註記資料
     * @param {String} applyNo 受理編號
     */
    async getRelieveRemarks(applyNo) {
      try {
        const response = await apiGetRelieveRmk([applyNo]);
        const result = response.data.result;
        if (!result.IS_SUCCESS) throw result.RTN_MSG;
        return result;
      } catch (e) {
        throw e;
      }
    },

    /**
     * 解除註記時，依據事故者ID查詢投保保單
     * @param {String} applyNo 受理編號
     */
    async getPolicies(applyNo) {
      try {
        const response = await apiGetPolicies([applyNo]);
        const result = response.data.result;
        if (!result.IS_SUCCESS) throw result.RTN_MSG;
        return result.DATA;
      } catch (e) {
        throw e;
      }
    },

    /**
     * 儲存解除註記資料
     * @param {Array} relieveRemarks
     */
    async saveRelieveRemarks(relieveRemarks, applyNo) {
      try {
        const requestData = cloneDeep(relieveRemarks);
        requestData.forEach((r) => delete r.policyOptions);
        const response = await apiSaveRelieveRmk([requestData, applyNo]);
        const result = response.data.result;
        if (!result.IS_SUCCESS) throw result.RTN_MSG;
        // 輸入後有值，點選儲存後，需將ANN_FLAG 欄位值改為Y
        if (relieveRemarks.length > 0) {
          this.payItemsData.ANN_FLAG = 'Y';
        } else {
          this.payItemsData.ANN_FLAG = 'N';
        }
        return result.RTN_MSG;
      } catch (e) {
        throw e;
      }
    },

    /**
     * 取得給付明細
     * @param {String} applyNo 受理編號
     */
    async getPayDetail(applyNo) {
      try {
        const response = await apiGetPayDetail([applyNo]);
        const result = response.data.result;
        if (!result.IS_SUCCESS) throw result.RTN_MSG;
        return { details: result.PAY_DETAIL, applyNo: result.APLY_NO };
      } catch (e) {
        throw e;
      }
    },

    /**
     * 取得內容模板罐頭
     * @param {String} applyNo 受理編號
     */
    async getNotice(applyNo) {
      try {
        const response = await apiGetNotice([applyNo]);
        const result = response.data.result;
        if (!result.IS_SUCCESS) throw result.RTN_MSG;
        return result.DATA;
      } catch (e) {
        throw e;
      }
    },

    /**
     * 儲存給付明細
     * @param {Array} details 給付明細
     */
    async savePayDetail(details, applyNo) {
      try {
        const response = await apiSavePayDetail([details, applyNo]);
        const result = response.data.result;
        if (!result.IS_SUCCESS) throw result.RTN_MSG;
        // 輸入後有值，點選儲存後，需將PAYMENT_FLAG 欄位值改為Y
        if (details.length > 0) {
          this.payItemsData.PAYMENT_FLAG = 'Y';
        }
        // 沒值的話要將PAYMENT_FLAG改為N
        else {
          this.payItemsData.PAYMENT_FLAG = 'N';
        }
        return result.RTN_MSG;
      } catch (e) {
        throw e;
      }
    },

    /**
     * 人工核定一般
     * @param {Object} payItem 核付項目
     * @param {Array} disbItems 失能程度項目
     */
    async doManual(payItem, disbItems) {
      console.log(payItem);
      try {
        // 產出要帶入API的資料(0825改成帶全部核算結果資料)
        // 複製一份避免失敗無法還原
        let clonePayItems = cloneDeep(this.payItemsData.DATA);
        // 找出要更新的資料
        let findItem = clonePayItems.find((g) => g.POLICY_NO === payItem.POLICY_NO && g.SER_NO === payItem.SER_NO);
        if (findItem) {
          // 覆蓋新的物件進去
          Object.assign(findItem, payItem);
          console.log(clonePayItems);
          // 呼叫API
          const response = await apiDoManual([clonePayItems]);
          const result = response.data.result;
          if (!result.IS_SUCCESS) throw result.RTN_MSG;
          // 成功後更新畫面上資料(API會回傳)
          this.payItemsData.DATA = result.DATA;

          // 處理覆蓋問題，回復多受益人分配設定異動
          for (const updPayItem of clonePayItems) {
            this.setPayItemsDataAfterAction(updPayItem);
          }
          
          // 都成功後更新失能程度項目
          // 先刪掉原本的，再push進去
          if (this.payItemsData.DATA_006) {
            this.payItemsData.DATA_006 = this.payItemsData.DATA_006.filter(
              (e) =>
                !(
                  e.APLY_NO === payItem.APLY_NO &&
                  e.POLICY_NO === payItem.POLICY_NO &&
                  e.PROD_ID === payItem.PROD_ID &&
                  e.CLAM_CAT === payItem.CLAM_CAT &&
                  e.CLAM_AMT_CODE === payItem.CLAM_AMT_CODE
                )
            );
            this.payItemsData.DATA_006.push(...disbItems);
          }
          this.disableDoConfirm = false;
          return result;
        } else {
          throw `資料錯誤，查無核付項目SER_NO=${p.SER_NO}`;
        }
      } catch (e) {
        throw e;
      }
    },

    /**
     * 人工核定失能 => 已廢棄不用
     * @param {Object} payItem 核付項目
     */
    async doManualDisb(payItem) {
      const template = {
        javaClass: 'com.cathay.aa.bo.AA_B3Z310_bo',
        APLY_NO: '',
        SER_NO: '',
        POLICY_NO: '',
        CLAM_CAT: '',
        PROD_ID: '',
        CLAM_AMT_CODE: '',
        CLAM_AMT_NAME: '',
        OCR_ID: '',
        FACE_AMT: '',
        FACE_AMT_UNIT: '',
        PAY_STS: '',
        PAY_DAY: '',
        TRIL_CALC_AMT: '',
        PAY_AMT: '',
        CHG_RESN: '',
        CHG_MEMO: '',
        DISB_INFO: [
          {
            javaClass: 'com.cathay.aa.bo.DTAAB006',
            DISB_ITEM: '',
            DISB_TBLE: '',
            DISB_LVL: '',
            DISB_PRCT: '',
            DISB_LVL_DESC: ''
          }
        ]
      };

      try {
        const response = await apiDoManualDisb(template);
        const result = response.data.result;
        if (!result.IS_SUCCESS) throw result.RTN_MSG;
        // TODO: 修改畫面上資料
        return true;
      } catch (e) {
        throw e;
      }
    },
    /**
     * 儲存例外授權碼
     * @param {Array} detail 給付明細
     */
    async saveExptNo(applyNo, exptNo) {
      try {
        const response = await apiSaveExptNo([applyNo, exptNo]);
        const result = response.data.result;
        if (!result.IS_SUCCESS) throw result.RTN_MSG;
        return true;
      } catch (e) {
        throw e;
      }
    },

    /**
     * 取得實支費用明細
     * @param {String} applyNo 受理編號
     * @param {String} clamAmtCode 理賠保險金代碼
     * @param {String} sysNo 業務別
     */
    async getExpenseDetails({ applyNo, clamAmtCode, sysNo }) {
      try {
        const response = await apiGetExpenseDetail([applyNo, clamAmtCode, sysNo]);
        const result = response.data.result;
        if (!result.IS_SUCCESS) throw result.RTN_MSG;
        return result.RTN_EXP_DETAIL;
      } catch (e) {
        throw e;
      }
    },

    /**
     * 取得人工核定原因資料
     * @param {String} code 拒賠原因分類代碼
     */
    async queryRejectReason(code) {
      try {
        const response = await apiQueryRjctResnList([code]);
        const result = response.data.result;
        if (!result.IS_SUCCESS) throw result.RTN_MSG;
        return result.RJCT_RESN_LIST;
      } catch (e) {
        throw e;
      }
    },

    /**
     * 取得事故分類下拉選單選項
     */
    async getReasonList(code) {
      try {
        const response = await apiGetReasonList();
        const result = response.data.result;
        if (!result.IS_SUCCESS) throw result.RTN_MSG;
        return result.REASON_TYPE_LIST;
      } catch (e) {
        throw e;
      }
    },
    

    /**
     * 試算調整確認
     * @param {String} applyNo 受理編號
     * @param {String} exptNo 例外授權碼
     */
    async doClamConfirm(applyNo, exptNo) {
      try {
        let clonePayItems = cloneDeep(this.payItemsData.DATA);
        const response = await apiDoClamConfirm([applyNo, exptNo, this.payItemsData.DATA]);
        const result = response.data.result;
        if (!result.IS_SUCCESS) {
          if ('Y' === result.IS_TOP_LIMIT) {
            return result;
          } else {
            throw result.RTN_MSG;
          }
        }

        // 試算調整確認RTN_CODE=0的時候要將回傳的資料重新刷新頁面
        if (result.RTN_CODE === '0') {
          // (API會回傳)
          this.payItemsData.DATA = result.DATA_ARRAY;

          this.sprData.DTAAB019List = result.DTAAB019List;
          this.sprData.DTAAB032List = result.DTAAB032List;

          // 處理覆蓋問題，回復多受益人分配設定異動
          for (const updPayItem of clonePayItems) {
            this.setPayItemsDataAfterAction(updPayItem);
          }
        }
        // 試算完直接存檔
        const saveResult = await this.savePageData(applyNo);
        if (!saveResult.IS_SUCCESS) throw saveResult.RTN_MSG;
        this.disableDoConfirm = true;
        
        // 試算調整確認完會連帶儲存爭議案件區塊
        this.isDispChanged = false;

        if(!isEmpty(saveResult.RTN_MSG)) {
          result.RTN_MSG = (result.RTN_MSG + '\n' + saveResult.RTN_MSG);
        }
        
        return result;
      } catch (e) {
        throw e;
      }
    },
    generatePageData(applyNo) {
      const applyStore = useApplyStore();
      // 補上javaClass
      let DTAAB001_bo,
        DTAAB012_bo,
        DTAAB006_bo,
        DTAAB019_bo,
        DTAAB032_bo = [];

      if (this.payItemsData?.DATA) DTAAB001_bo = cloneDeep(this.payItemsData.DATA);
      if (this.calcMesgsData?.MESSAGES) DTAAB012_bo = cloneDeep(this.calcMesgsData.MESSAGES);
      if (this.payItemsData?.DATA_006) DTAAB006_bo = cloneDeep(this.payItemsData.DATA_006);

      DTAAB019_bo = cloneDeep(this.sprData.DTAAB019List);
      DTAAB032_bo = cloneDeep(this.sprData.DTAAB032List);

      // DTAAB001_bo.forEach((e) => (e.javaClass = 'com.cathay.aa.bo.DTAAB001')); 0830: javaClass改成由後端回傳
      // DTAAB012_bo.forEach((e) => (e.javaClass = 'com.cathay.aa.bo.DTAAB012')); 0825: javaClass改成由後端回傳
      DTAAB006_bo.forEach((e) => (e.javaClass = 'com.cathay.aa.bo.DTAAB006'));
      DTAAB019_bo.forEach((e) => (e.javaClass = 'com.cathay.aa.bo.DTAAB019'));
      DTAAB032_bo.forEach((e) => (e.javaClass = 'com.cathay.aa.bo.DTAAB032'));

      const accCkBox = [this.DisputedCasesData.type1_checked,this.DisputedCasesData.type2_checked,this.DisputedCasesData.type3_checked];
      const accInput = [this.DisputedCasesData.type1_AMT || "0",this.DisputedCasesData.type2_AMT || "0", this.DisputedCasesData.type3_AMT || "0"]
      return [
        applyNo,
        'AAB3Z310',
        this.isPageChanged ? 'Y' : 'N',
        'N',
        [],
        this.payItemsData?.DATA
          ? [
              {
                javaClass: 'java.util.Map',
                PAY_AMT: this.totalAmount.payResult, // 給付金額(總金額)
                CLAM_AMT: this.totalAmount.calResult, // 試算金額(總金額)
                APLY_STS: applyStore.basicData.APLY_STS, // 受理進度(AA_A0Z100.getBasicData取得)
                DECD_EMP_ID: applyStore.basicData.DECD_EMP_ID, // 核賠人員(AA_A0Z100.getBasicData取得)
                DTAAB001_bo, // 核付項目區塊資料
                DTAAB012_bo, // 試算訊息區塊資料
                DTAAB006_bo, // 失能程度資料
                DTAAB019_bo, //多受益人分配資料for保單分期
                DTAAB032_bo  //保單分期資料
              }
            ]
          : null,
        'X',
        'X',
        [{
          javaClass: 'java.util.Map',
          accCkBox: accCkBox,
          accInput: accInput,
          OCR_ID: applyStore.basicData.OCR_ID,
          CURR: this.DisputedCasesData.CURR_EN
        }]
        
      ];
    },
    /**
     * 儲存核算結果資料
     */
    async savePageData(applyNo) {
      const response = await apiSaveClamData(this.generatePageData(applyNo));
      const result = response.data.result;
      return result;
    },
    async getDiagKindList() {
      if (this.diagKindList && this.diagKindList.length > 0) return this.diagKindList;
      try {
        const response = await apiGetDiagKindList();
        const result = response.data.result;
        if (!result.IS_SUCCESS) throw result.RTN_MSG;
        this.diagKindList = result.DIAG_KIND_INFO;
        return result.DIAG_KIND_INFO;
      } catch (e) {
        throw e;
      }
    },
    async getOpGradeList(PROD_ID) {
      try {
        const response = await apiGetOpGradeList([PROD_ID]);
        const result = response.data.result;
        if (!result.IS_SUCCESS) throw result.RTN_MSG;
        return result.OP_GRADE_LIST;
      } catch (e) {
        throw e;
      }
    },
    async getDisbTable() {
      try {
        if (this.disbTableData) return this.disbTableData;
        const response = await apiGetDisbTable();
        const result = response.data.result;
        if (!result.IS_SUCCESS) throw result.RTN_MSG;
        this.diagKindList = result.DATA;
        return result.DATA;
      } catch (e) {
        throw e;
      }
    },

    async getPayDetailReview(applyNo) {
      try {
        const response = await apiGetPayDetailReview([applyNo]);
        const result = response.data.result;
        if (!result.IS_SUCCESS) throw result.RTN_MSG;
        return result.BENE_INFO;
      } catch (e) {
        throw e;
      }
    },
    async getCurrentPassDay(applyNo, date) {
      try {
        const applyStore = useApplyStore();
        const response = await apiIsCurrentPassDay([date, applyNo, applyStore.basicData?.APLY_DIV_NO]);
        const result = response.data.result;
        if (!result.IS_SUCCESS) throw result.RTN_MSG;
        return result.DCZ1_PAY_DAY;
      } catch (e) {
        throw e;
      }
    },
    /**
    * 儲存保單確認
    */
   async checkMultAcptRule(updPayItem) {
    let clonePayItems = cloneDeep(this.payItemsData.DATA);
    // 找出要更新的資料
    let payItem = clonePayItems.find((g) => g.POLICY_NO === updPayItem.POLICY_NO && g.SER_NO === updPayItem.SER_NO);
    if (payItem) {
      // 覆蓋新的物件進去
      Object.assign(payItem, updPayItem);
    }
     const response = await apiCheckMultAcptRule([payItem]);
     const result = response.data.result;
     return result;
   },
    /**
    * 於前一個request後設定核付項目資料(處理資料覆蓋問題)，是否為連動項目=='N'才回復前端操作
    */
   setPayItemsDataAfterAction(payItem) {
    let updPayItem = this.payItemsData.DATA.find((g) => g.POLICY_NO === payItem.POLICY_NO && g.SER_NO === payItem.SER_NO && g.IS_GEAR_ITEM === 'N');
    if (updPayItem) {
      updPayItem.IS_MULT_ACPT = payItem.IS_MULT_ACPT;
      updPayItem.MULT_APCT_AMT = payItem.MULT_APCT_AMT;
    }
    },
    /**
     * 取得爭議案件
     */
    async getDisputedCases(APLY_NO, OCR_ID) {
      if (this.DisputedData && this.DisputedData.length > 0) return this.DisputedData;

      try {
        const response = await apiGetDisputedCases([APLY_NO, OCR_ID]);
        const result = response.data.result.RTN_LIST;
        this.DisputedData = result;
        return result;
      } catch (error) {
        console.error('獲取爭議案件數據時發生錯誤:', error);
        this.DisputedData = []; 
      }
    },
    /**
     * 提示爭議案件
     */
    async alertDisputedCasesMsg(APLY_NO) {
      try {       
        const response = await apiDoAlertDisputedCases([APLY_NO, isEmpty(this.DisputedData)?'N':'Y']);
        return response.data.result.DIS_MSG
      } catch (e) {
        throw e;
      }
    },
    /**
     * 取得查詢爭議案件
     */
   async getDisputedCasesAplyNO(applyNo) {
      const response4 = await apiGetDisputedCasesAplyNO([applyNo]);
      const getDisputedCaseResult = response4.data.result;
      const RTN_LIST = getDisputedCaseResult.RTN_LIST;
      const resultMsg = {
        isSuccess: false,
        message: ''
      };
      resultMsg.isSuccess = getDisputedCaseResult.IS_SUCCESS;
      if (!resultMsg.isSuccess) {
        if (getDisputedCaseResult.RTN_MSG) {
          if (resultMsg.message === '') {
            result.message = getDisputedCaseResult.RTN_MSG;
          } else {
            resultMsg.message = resultMsg.message + '\n' + getDisputedCaseResult.RTN_MSG;
          }
        }
        return resultMsg;
      }
      let disputedResult = {};
      for(let item of RTN_LIST){
          disputedResult[item.TYPE]=item.AMT;
      }
      this.DisputedCasesData.type1_checked = !!this.DisputedCasesData.type1_AMT;
      this.DisputedCasesData.type2_checked = !!this.DisputedCasesData.type2_AMT;
      this.DisputedCasesData.type3_checked = !!this.DisputedCasesData.type3_AMT;
      this.DisputedCasesData.type1_AMT = disputedResult[ 1 ];
      this.DisputedCasesData.type2_AMT = disputedResult[ 2 ];
      this.DisputedCasesData.type3_AMT= disputedResult[ 3 ];
   }
  }
});
