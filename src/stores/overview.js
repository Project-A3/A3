import { cloneDeep, extend, isEqual, orderBy, remove } from 'lodash-es';
import { defineStore } from 'pinia';
import { PayType } from '~/common/utils/enum';
import useSwal from '~/composables/useSwal';
import {
  apiReadBasicData,
  apiIsAutoConfirmPolicy,
  apiAutoConfirmPolicy,
  apiGetPolicyInfoBySysDate,
  apiGetPolicyInfoByOcrDate,
  apiGetPolicyTerms,
  apiGetBeneficiary,
  apiSavePageDataCheck,
  apiSavePageData,
  apiGetIndicator,
  apiGetFISC,
  apiGetOneAccount,
  apiGetOiuOneAccount,
  apiCheckSavePolicyInfo,
  apiSavePolicyInfo,
  apiCheckSaveBeneInfo,
  apiSaveBeneInfo,
  apiSaveClamData,
  apiGetResnNoAndName
} from '../common/api';
import { useApplyStore } from './apply';

export const useOverviewStore = defineStore('overview', {
  state: () => ({
    basicData: {},
    policiesData: {},
    beneficiariesData: {},
    needEditBeneficiary: [],
    isPageChanged: false,
    currentPayType: '',
    policiesDataOcr: {}
  }),
  getters: {
    policies(state) {
      let data = state.policiesData?.DATA;
      return data ?? [];
    },
    selectedPolicies(state) {
      return (sortKey, isSortDesc) => {
        let result = state.policies.filter((policy) => policy.SELECT === 'Y');
        if (sortKey) {
          result = orderBy(result, [sortKey, 'POLICY_NO'], [isSortDesc ? 'desc' : 'asc', 'asc']);
        }
        return result;
      };
    },
    unselectedPolicies(state) {
      return (sortKey, isSortDesc) => {
        let result = state.policies.filter((policy) => policy.SELECT !== 'Y');
        if (sortKey) {
          result = orderBy(result, [sortKey, 'POLICY_NO'], [isSortDesc ? 'desc' : 'asc', 'asc']);
        }
        return result;
      };
    },
    disableSegmentationButton(state) {
      return state.policiesData?.POLICY_SEGMENTATION_BTN_DISABLE !== 'N';
    },
    disablePrepaymentButton(state) {
      return state.policiesData?.PREPAYMENT_BTN_DISABLE !== 'N';
    },
    beneficiaries(state) {
      let beneficiaries = state.beneficiariesData?.DATA ?? [];
      return beneficiaries;
    },
    getBeneficiaries: (state) => {
      return (payType) =>
        payType === '0' ? state.beneficiaries : state.beneficiaries.filter((beneficiary) => beneficiary.PAY_TYPE === payType);
    },
    isGroupInsurance(state) {
      return state.basicData?.IS_BG === 'Y' || state.basicData?.IS_BGH === 'Y';
    },
    deadDate(state) {
      return state.policiesData?.DEAD_DATE;
    },
    polCfmTime(state) {
      return state.policiesData?.POL_CFM_TIME_STR;
    },
    policiesOcr(state) {
      let data = state.policiesDataOcr?.DATA;

      if (!state.policiesDataOcr.IS_SUCCESS) {
        throw state.policiesDataOcr.RTN_MSG;
      } 

      console.log('點輯輯保單按鈕結果');
      console.log(state.policiesDataOcr.IS_SUCCESS);
      console.log(state.policiesDataOcr.RTN_CODE);   
      console.log(state.policiesDataOcr.RTN_MSG);   
      console.log('點輯輯保單按鈕結果');
      
      return data ?? [];
    }
  },
  actions: {
    /**
     * 進頁面時呼叫，取得保單概況頁面所有資料
     * @param {受理編號} applyNo
     */
    async getAllData(applyNo) {
      try {
      const responses = await Promise.all([
        apiReadBasicData([applyNo]),
        apiGetBeneficiary([applyNo]),
        this.getPolicyInfo(applyNo)
      ]);

      let basicDataResult = responses[0].data.result;
      let beneficariesResult = responses[1].data.result;
      let policyInfoResponses = responses[2];

      let policyInfoBySysDateResult = policyInfoResponses[0].data.result;
      let policyInfoByOcrDateResult = policyInfoResponses[1].data.result;

      this.basicData = basicDataResult.IS_SUCCESS ? basicDataResult : {};
      this.policiesData = policyInfoBySysDateResult.IS_SUCCESS ? policyInfoBySysDateResult : {};
      this.beneficiariesData = beneficariesResult.IS_SUCCESS ? beneficariesResult : {};
      this.isPageChanged = false;
      this.policiesDataOcr = policyInfoByOcrDateResult.IS_SUCCESS ? policyInfoByOcrDateResult : {};

      // 預設給付類型
      this.currentPayType = basicDataResult.PAY_TYPE;

      let errorMessage = '';
      if (basicDataResult.RTN_CODE < 0) errorMessage += basicDataResult.RTN_MSG + '\n';
      if (policyInfoBySysDateResult.RTN_CODE < 0) errorMessage += policyInfoBySysDateResult.RTN_MSG + '\n';
      if (beneficariesResult.RTN_CODE < 0) errorMessage += beneficariesResult.RTN_MSG;

      var warningMessage = '';

      if (basicDataResult.RTN_CODE == '1') warningMessage += basicDataResult.RTN_MSG + '\n';
      if (policyInfoBySysDateResult.RTN_CODE == '1') warningMessage += policyInfoBySysDateResult.RTN_MSG + '\n';
      if (beneficariesResult.RTN_CODE == '1') warningMessage += beneficariesResult.RTN_MSG;

      return { errorMessage, warningMessage };
      } catch (e) {
        console.log('[' + applyNo + ']getAllData 異常' + e);
      }
    },

    /**
     * 呼叫API刷新受益人資料
     * @param {String} applyNo 受理編號
     */
    async reloadBeneficiaryData(applyNo) {
      try {
        const response = await apiGetBeneficiary([applyNo]);
        const result = response.data.result;
        if (!result.IS_SUCCESS) throw result.RTN_MSG;
        if (this.beneficiariesData?.DATA) {
          // 處理驚嘆號
          for (const oriBene of this.beneficiariesData.DATA) {
            for (const newBene of result.DATA) {
              if (oriBene.BENE_ID === newBene.BENE_ID) {
                newBene.PAY_TYPE_CHANGE = oriBene.PAY_TYPE_CHANGE;
                break;
              }
            }
          }
          this.beneficiariesData = result;
          this.isPageChanged = true;
        }
      } catch (e) {
        throw 'reload fail: ' + e;
      }
    },

    /**
     * 呼叫API刷新保單資料
     * @param {String} applyNo 受理編號
     */
    async reloadPolicyInfoData(applyNo, ocrDate = '') {
      try {
        // const result = await this.getEffPolicyInfoByCase(applyNo, ocrDate);
        // if (!result.IS_SUCCESS) throw result.RTN_MSG;
        // this.policiesData = result;
        
        const policyInfoResponses = await this.getPolicyInfo(applyNo);
        let policyInfoBySysDateResult = policyInfoResponses[0].data.result;
        let policyInfoByOcrDateResult = policyInfoResponses[1].data.result;

        this.policiesData = {};
        this.policiesData = (policyInfoBySysDateResult.RTN_CODE === '0') ? policyInfoBySysDateResult : {};
        this.policiesDataOcr = {};
        this.policiesDataOcr = (policyInfoByOcrDateResult.RTN_CODE === '0') ? policyInfoByOcrDateResult : {};
        this.isPageChanged = true;

        console.log('--- reload policiesData -----------');
        console.log(this.policiesData);
        console.log('--- reload policiesDataOcr -----------');
        console.log(this.policiesDataOcr);
        console.log('--------------');

      } catch (e) {
        console.log('[' + applyNo + ']reloadPolicyInfoData 異常' + e);
        throw 'reload fail: ' + e;
      }
    },

    /**
     * 取得險別下載連結
     * @param {保單物件} policy
     * @returns {String} link 連結
     */
    async getPolicyTermsLink(policy) {
      let link = '';
      const response = await apiGetPolicyTerms([
        policy.PROD_ID,
        policy.PROD_CAT,
        policy.ISSUE_DATE,
        policy.ACCESS_DATE,
        policy.FACE_AMT,
        policy.POLICY_NO
      ]);

      const result = response.data.result;
      if (result.IS_SUCCESS) {
        link = result.FILE_PATH;
      }
      return link;
    },

    /**
     * 刪除受益人
     * @param {String} applyNo 受理編號
     * @param {String} beneficiary 受益人物件
     */
    async deleteBeneficiary(applyNo, beneficiary) {
      let instance = cloneDeep(beneficiary);
      // 清掉給付類型
      instance.PAY_TYPE = '';

      const result = await this.saveBeneInfoProcess(applyNo, false, 'D', this.currentPayType, [instance]);
      if (!result.isUpdated) return null;
      // 從畫面刪除 => 改成呼叫API Reload
      // let d = remove(this.beneficiaries, (b) => {
      //   return isEqual(b, beneficiary);
      // });
      // if (d.length !== 1) console.error('前端無該受益人');
      await this.reloadBeneficiaryData(applyNo);
      return true;
    },
    /**
     * 新增受益人
     * @param {Object}} beneficiary 只需放要新增的受益人欄位
     */
    async addBeneficiary(beneficiary, applyNo) {
      try {
        const defaultObject = {
          ACNM: '',
          ACNT_NO: '',
          ACPT_ID: '',
          ACPT_NAME: '',
          ACPT_RLAT: '',
          APLY_DIV_NO: '',
          APLY_SER_NO: '',
          BANK_NO: '',
          BENE_ID: '',
          BENE_NAME: '',
          CNCL_LINE_CTX_TEXT: '',
          CNCL_LINE_IDX: '',
          CRS_FLAG: '',
          DLY_INT_TAX: 0,
          FATCA_FLAG: '',
          FEE: 0,
          IS_PAY3_RTN: '',
          ONE_ACC: '',
          PAY_AMT: 0,
          PAY_AMT_AFTER: 0,
          PAY_DESC: '',
          PAY_RATO: '',
          PAY_TYPE: '',
          PAY_UNIT: '',
          RISK_LEVEL: '',
          RMT_MOD_RSN: '',
          RMT_RIGHT_NOW: '',
          UN_BACK_CTX_TEXT: '',
          UN_BACK_IDX: '',
          ORI_BENE_ID: '',
          ID_TYPE: '',
          ACPT_BIRTH: '',
          ACPT_COUNTRY: '',
          ACPT_EN_NAME: '',
          BANK_NAME: '',
          
          javaClass: 'com.cathay.aa.b3.bo.AA_B3Z300_bo1'
        };
        let pushObject = {
          ...defaultObject,
          ...beneficiary
        };
        // Call API
        const result = await this.saveBeneInfoProcess(applyNo, false, 'C', this.currentPayType, [pushObject]);
        if (!result.isUpdated) return null;
        console.log('新增受益人:');
        console.log(pushObject);
        // 改成呼叫API重整
        // this.beneficiaries.push(pushObject);

        // return pushObject;
        return result;
      } catch (e) {
        throw e;
      }
    },

    /**
     * 編輯受益人
     * @param {Object} 帶入該筆受益人以及有改動的欄位
     */
    async editBeneficiary(editingBeneficiary, editingFields, applyNo) {
      try {
        let b = this.beneficiaries.find((beneficiary) => beneficiary === editingBeneficiary);
        if (!b) throw '該受益人不在清單中';
        // 使用lodash extend覆蓋變動的欄位
        var editingObj = extend({}, b, editingFields);
        const result = await this.saveBeneInfoProcess(applyNo, false, 'U', this.currentPayType, [editingObj]);
        if (!result.isUpdated) return null;
        console.log('編輯受益人:');
        console.log(editingObj);
        // 改成呼叫API重整
        // extend(b, editingFields);
        // return b;
        return result;
      } catch (e) {
        throw e;
      }
    },
    /**
     * 改變多筆受益人的給付方式
     */
    async changeBeneficiariesPayType(applyNo, payType, payTypeName, beneficiaries) {
      // const instances = cloneDeep(beneficiaries);
      const instances = beneficiaries.map((b) => ({
        ...b,
        PAY_TYPE: payType,
        PAY_DESC: payTypeName,
        //給付方式變更，警示(紅色三角型ICON)的觸發機制 變更成支票，不顯示警示(例：現金轉支轉、匯撥轉支票都不顯示警示) 變更成現金、匯撥，顯示警示
        PAY_TYPE_CHANGE: payType !== PayType.Cheque
      }));
      // Call API
      const result = await this.saveBeneInfoProcess(applyNo, true, 'U', payType, instances);
      if (!result.isUpdated) return false;
      // 更新畫面上的受益人
      this.beneficiariesData.DATA = instances;
      this.needEditBeneficiary = instances;
      // 更新基本資料的給付方式
      this.basicData.PAY_TYPE = payType;
      const applyStore = useApplyStore();
      applyStore.basicData.PAY_TYPE = payType;
      return true;
    },

    /**
     * 取得風險以及與受益人關係
     * @param {String} acptId
     * @param {String} acptName
     */
    async getIndicator(acptId, acptName) {
      // this.showLoading();
      const response = await apiGetIndicator([acptId, acptName]);
      const result = response.data.result;
      // this.hideLoading();
      if (!result.IS_SUCCESS) throw 'getIndicator Error: 取得風險指標和關係失敗';
      return result;
    },

    /**
     * 取得行庫行號網址
     */
    async getFISCLink() {
      this.showLoading();
      const response = await apiGetFISC();
      const result = response.data.result;
      this.hideLoading();
      return result.IS_SUCCESS ? result.FISC_URL : '';
    },

    async getOneAccount(acceptId) {
      this.showLoading();
      const response = await apiGetOneAccount([acceptId]);
      const result = response.data.result;
      this.hideLoading();
      return result;
    },

    async getOiuOneAccount(acceptId, countryCode) {
      this.showLoading();
      const response = await apiGetOiuOneAccount([acceptId, countryCode]);
      const result = response.data.result;
      this.hideLoading();
      return result;
    },
    
    /**
     * 取得支票訊息
     * @param {String} applySerialNo 票據記載事項變更申請書編號
     */
    async getResnNoAndName(applySerialNo) {
      // this.showLoading();
      const response = await apiGetResnNoAndName([applySerialNo]);
      const result = response.data.result;
      // this.hideLoading();
      if (!result.IS_SUCCESS) throw result.RTN_MSG;
      return result.DATA;
    },

    /**
     * 呼叫API確認可不可以儲存
     */
    async savePageDataCheck(isPageChanged) {
      let isCheckSuccess = false;
      let message = '';
      const response = await apiSavePageDataCheck({
        PAGE_KEY: '保單概況',
        // PAGE_KEY: 'N', // 填N for測試用
        PAGE_EDIT: isPageChanged ? 'Y' : 'N', // 填Y或N表示頁面有沒有異動
        POLICY_INFO: this.policies,
        BENE_INFO: this.getBeneficiaries('0')
      });
      const result = response.data.result;
      isCheckSuccess = result.IS_SUCCESS;
      message = result.RTN_CODE == '0' ? '' : result.RTN_MSG;

      return { isCheckSuccess, message };
    },

    generatePageData(applyNo) {
      return [
        applyNo,
        'AAB3Z300',
        this.isPageChanged ? 'Y' : 'N',
        'N',
        [],
        [
          {
            javaClass: 'java.util.Map'
          }
        ],
        'X',
        'X',
        []
      ];
    },

    /**
     * 儲存保單概況資料
     */
    async savePageData(applyNo) {
      const response = await apiSaveClamData(this.generatePageData(applyNo));
      const result = response.data.result;
      return result;
    },

    /**
     * 儲存保單確認
     * @param {受理編號} applyNo
     * @param {保單} policies
     */
    async savePolicyInfoCheck(applyNo, policies) {
      const response = await apiCheckSavePolicyInfo([applyNo, policies]);
      const result = response.data.result;
      return result;
    },
    /**
     * 儲存保單
     * @param {受理編號} applyNo
     * @param {保單} policies
     */
    async savePolicyInfo(applyNo, policies) {
      const response = await apiSavePolicyInfo([applyNo, policies]);
      const result = response.data.result;
      return result;
    },

    setPolicies(policies) {
      this.policiesData.DATA = policies;
    },

    /**
     * 新增/編輯受益人確認
     * @param {受理編號} applyNo
     * @param {保單} policies
     * @param {受益人} beneficiaries
     * @param {動作} action 新增=C、修改=U、刪除=D、變更給付方式=U
     */
    async saveBeneInfoCheck(applyNo, isMultiple, action, payType, beneficiaries) {
      const response = await apiCheckSaveBeneInfo([applyNo, isMultiple ? 'Y' : 'N', action, payType, beneficiaries]);
      const result = response.data.result;
      const { $swal } = useSwal();

      if (result.RTN_CODE == '1') {
        $swal.success(result.RTN_MSG);
      } 

      return result;
    },
    /**
     * 儲存受益人
     * @param {受理編號} applyNo
     * @param {保單} policies
     */
    async saveBeneInfo(applyNo, isMultiple, action, payType, beneficiaries) {
      const response = await apiSaveBeneInfo([applyNo, isMultiple ? 'Y' : 'N', action, payType, beneficiaries]);
      const result = response.data.result;
      this.isPageChanged = true;
      return result;
    },

    /**
     * 新增/編輯受益人完整流程
     */
    async saveBeneInfoProcess(applyNo, isMultiple, action, payType, beneficiaries) {
      const { $swal } = useSwal();
      let isUpdated = false;
      let message;
      let checkResult = await this.saveBeneInfoCheck(applyNo, isMultiple, action, payType, beneficiaries);
      if (checkResult.IS_SUCCESS) {
        // 檢核通過，直接儲存
        if (checkResult.RTN_CODE == '0') {
          let saveResult = await this.saveBeneInfo(applyNo, isMultiple, action, payType, beneficiaries);
          if (!saveResult.IS_SUCCESS) throw saveResult.RTN_MSG;
          isUpdated = true;
          message = saveResult.RTN_MSG;
          console.log(">>saveResult.RTN_CODE=" + saveResult.RTN_CODE + " saveResult.RTN_MSG=" + saveResult.RTN_MSG);
          if (saveResult.RTN_CODE == '1') {
            $swal.success(message);
          } 
        } else {
          this.hideLoading();
          // 檢核通過，需再確認是否儲存 
          let prompt;

          if (checkResult.RTN_CODE == '1') {
            prompt = await $swal.confirmAsync('提示', '繼續', checkResult.RTN_MSG, '取消');
          } else {
            prompt = await $swal.confirmAsync(checkResult.RTN_MSG);
          }  
         
          if (prompt.isConfirmed) {
            this.showLoading();
            let saveResult = await this.saveBeneInfo(applyNo, isMultiple, action, payType, beneficiaries);
            if (!saveResult.IS_SUCCESS) throw saveResult.RTN_MSG;
            isUpdated = true;
            message = saveResult.RTN_MSG;
          }
        }
        //return isUpdated;
        return { isUpdated: isUpdated, message: message };
      } else {
        throw checkResult.RTN_MSG;
      }
    },
      
    /**
      * 取得保單概況資料
      */
    async getPolicyInfo(applyNo) {
      // 是否可自動保單確認
      var isAutoConfirm = 'N';
      var isEndCase = 'N';

      try {
        const isAutoConfirmResponse = await apiIsAutoConfirmPolicy([applyNo]);
        const isAutoConfirmResult = isAutoConfirmResponse.data.result;
        isAutoConfirm = isAutoConfirmResult.AUTO_CONFIRM_POLICY;
        isEndCase = isAutoConfirmResult.IS_END_CASE;
      } catch (e) {
        console.log('是否可自動保單確認(IsAutoConfirmPolicy)異常' + e);
      }

      console.log('是否可自動保單確認(isAutoConfirm)=' + isAutoConfirm);

      // 自動保單確認
      if (isAutoConfirm === 'Y') {
        try {
          const autoConfirmResponse = await apiAutoConfirmPolicy([applyNo]);
          const autoConfirmResult = autoConfirmResponse.data.result;
          console.log('自動保單確認(AutoConfirmPolicy)，rs=' + autoConfirmResult.RTN_CODE + ' msg=' + autoConfirmResult.RTN_MSG);
        } catch (e) {
          console.log('自動保單確認(AutoConfirmPolicy)異常' + e);
        }
      }

      // 讀取已選保單/未選保單
      try {
        // 未結案件讀取『已選未選保單資訊』+『編輯保單按鈕』，已結案件讀取『已選未選保單資訊』
        if (isEndCase === 'N') {
          const policyInfoResponses = await Promise.all([
            apiGetPolicyInfoBySysDate([applyNo]),
            apiGetPolicyInfoByOcrDate([applyNo])
          ]);

          return policyInfoResponses
        } else {
          const policyInfoResponses = await Promise.all([
            apiGetPolicyInfoBySysDate([applyNo])        
          ]);

          return policyInfoResponses
        }
      } catch (e) {
        console.log('[' + applyNo + ']讀取已選保單/未選保單 異常' + e);
        throw e;
      }
    }
  }
});
