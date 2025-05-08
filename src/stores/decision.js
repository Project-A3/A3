import { cloneDeep } from 'lodash';
import { defineStore } from 'pinia';
import {
  apiGetDCNT,
  apiGetRiskOpinion,
  apiGetRiskTags,
  apiGetRFACATandSCATList,
  apiGetRFACONT,
  apiGetNotPayInput,
  apiGetNotPayTitleAndContent,
  apiGetNotPayLaw,
  apiDoSignPreview,
  apiSaveDcntRiskData,
  apiSaveDCNT,
  apiChkLmtExptNo,
  apiDoSignSend,
  apiGetSignData,
  apiGetSignInit,
  apiDoBack,
  apiDoAcceptAndEndCase,
  apiDoAcceptAndEndCaseAsync,
  apiGetRiskTags3,
  apiDoConfirm,
  apiDoSign,
  apiSaveMangSign,
  apiSaveNotPayInput,
  apiPrintNotPayInput,
  apiGetNotPayTitleSelectList,
  apiCheckIsNew
} from '~/common/api';
import useMoment from '~/composables/useMoment';
import { useAccountingStore } from './accounting';
import { useApplyStore } from './apply';
import { useBeneficiaryStore } from './beneficiary';
import { useFooterStore } from './footer';
import { useOverviewStore } from './overview';
import useSwal from '~/composables/useSwal';
import { SignLevel } from '~/common/utils/enum';
export const useDecisionStore = defineStore('decision', {
  state: () => ({
    // 風險標籤
    riskTags: [],
    // 風險評分
    riskScore: {},
    // 風險作業資料
    riskInfo: { INS_RISK_INFO: [], AGT_RISK_INFO: [], HOSP_RISK_INFO: [], DIS_RISK_INFO: [], IsValid: true },
    // 是否有決策引導
    isDCNTEnable: false,
    // 決策引導資料
    DCNTData: {
      STATUS: null,
      QUESTIONS: [],
      RFA_CANS: [],
      REASON: ''
    },
    //主管簽呈內容	
    MANG_SIGN: [],
    RFAList: null,
    previewData: null,
    // getAllData API是否呼叫完畢且成功
    isAPIReady: false,
    // 作業風險 API是否呼叫完畢且成功
    isRiskTagReady: false,
    isRiskInfoReady: false,
    // 決策引導 API是否呼叫完畢且成功
    isDecisionReady: false,
    // 簽呈歷程 API是否呼叫完畢且成功
    isSignedHistoryReady: false,
    // 意見回饋 API是否呼叫完畢且成功
    isFeedbackReady: false,
    // 錯誤訊息
    errorMsg: '',
    // 目前畫面上的問題
    currentQuestions: [],
    // 頁面是否有異動
    isModified: false,
    // decision component key: 刷新用
    decisionKey: 1,
    // 是否為預覽
    isPreview: false,
    // 簽呈歷程資料
    signData: [],
    // 簽呈初始化資料
    signInitData: null,
    // 選擇的簽呈層級
    currentSelectedSignLevel: '',
    // 是否顯示意見回饋主管區塊
    isFeedbackShow: false,
    // 意見回饋內容
    feedbackText:'',
    // disable簽呈預覽按鈕
    disablePreviewBtn: false,
    // disable送出簽呈按鈕
    disableSignSendBtn: false,
    // 是否啟用beforeunload event
    enableBeforeunload: false,
  }),
  getters: {
    // 作業風險總數量
    riskCounts: (state) =>
      state.riskInfo.INS_RISK_INFO.length +
      state.riskInfo.AGT_RISK_INFO.length +
      state.riskInfo.HOSP_RISK_INFO.length +
      state.riskInfo.DIS_RISK_INFO.length,
    // 是否可編輯簽呈
    isReadonly: (state) => state.isPreview || state.DCNTData.STATUS === '2' || useApplyStore().isManager,
    // 是否為主管、覆核查看簽呈
    isReview: (state) => !state.isPreview && (state.DCNTData.STATUS === '2' || useApplyStore().isManager),
    // 是否已結案
    isEndCase: (state) => useApplyStore().reviewerInfo?.STEP_STS === '3'
  },
  actions: {
    /**
     * 取得決策引導所有需要的資料
     */
    async getAllData(applyNo) {
      // let message = '';
      const { $swal } = useSwal();
      const applyStore = useApplyStore();
      const beneficiaryStore = useBeneficiaryStore();
      const applyKind = applyStore.claimData?.APLY_KIND;
      const ocrId = applyStore.basicData?.OCR_ID;
      console.log(applyKind);
      console.log(ocrId);
      this.errorMsg = '';

      // 作業風險標籤
      apiGetRiskTags([applyNo])
        .then((resp) => {
          if (resp.data.result.IS_SUCCESS) {
            this.riskTags = resp.data.result.TAGS;
            this.riskScore = resp.data.result.RISK_INFO;
          } else this.errorMsg += `getRiskTags error: ${resp.data.result.RTN_MSG}`;

        })
        .catch((e) => {
          this.errorMsg += e;
        })
        .finally(() => this.isRiskTagReady = true);

      // 作業風險
      apiGetRiskOpinion([applyNo])
        .then((resp) => {
          if (resp.data.result.IS_SUCCESS) {
            const opinions = resp.data.result.RTN_RiskInfo_Opinion;
            this.riskInfo = opinions;
            this.riskInfo.IsValid = true;
          } else this.errorMsg += ` getRiskInfo_Opinion error: ${resp.data.result.RTN_MSG}`;
        })
        .catch((e) => {
          this.errorMsg += e;
        })
        .finally(() => this.isRiskInfoReady = true);

      // 決策引導
      apiGetDCNT([applyNo])
        .then((resp) => {
          if (resp.data.result.IS_SUCCESS) {
            // 是否啟用決策引導
            this.isDCNTEnable = resp.data.result?.RTN_DCNT_OBJ?.IS_DCNT === 'Y';
            // 決策引導資料組合包
            this.DCNTData = resp.data.result.RTN_DCNT_OBJ;
            //主管簽呈內容	
            this.MANG_SIGN = resp.data.result.MANG_SIGN;
          } else this.errorMsg += ` getDCNT error: ${resp.data.result.RTN_MSG}`;
        })
        .catch((e) => {
          this.errorMsg += e;
        })
        .finally(() => this.isDecisionReady = true);

      // 簽呈歷程
      apiGetSignData([applyNo])
        .then((resp) => {
          if (resp.data.result.IS_SUCCESS) {
            this.signData = resp.data.result.SIGN_DATA_LS;
          } else this.errorMsg += ` getSignData error: ${resp.data.result.RTN_MSG}`;
        })
        .catch((e) => {
          this.errorMsg += e;
        })
        .finally(() => this.isSignedHistoryReady = true);

      this.previewData = null;
      
      beneficiaryStore.isChkBeneficiary = 'N';
      // 主管、覆核資料
      // 20221004_個人化首頁_慈蓮_Q1
      if (
        this.isReview &&
        applyStore.reviewerInfo?.STEP_STS === '2' &&
        (applyStore.reviewerInfo?.IS_ASSIGNED === 'Y' || applyStore.reviewerInfo?.IS_ASSIGNED_BA === 'Y')
      ) {
        // 意見回饋
        apiGetSignInit([applyNo])
          .then((resp) => {
            if (resp.data.result.IS_SUCCESS) {
              this.signInitData = resp.data.result;
              // 多加欄位給畫面使用
              if (this.signInitData?.END_ITEM_LIST) {
                this.signInitData?.END_ITEM_LIST.forEach((item) => {
                  item.INPUT_VALUE = '';
                  item.IS_CHECKED = false;
    
                  let selecedtItem = this.signInitData.sEND_ITEM_LIST.find((selecedtItem) => selecedtItem.END_ITEM_CODE === item.END_ITEM_CODE);
                  if (selecedtItem) {
                    item.INPUT_VALUE = selecedtItem.END_ITEM_OTHER;
                    item.IS_CHECKED = true;
                  }
                });
              }
              this.feedbackText = this.signInitData.MANG_SIGN;
              this.isFeedbackShow = true;
    
              if (this.signInitData.RTN_MSG) {
                $swal.success(this.signInitData.RTN_MSG);
              }
            } else {
              this.isFeedbackShow = false;
              this.errorMsg += `${resp.data.result.RTN_MSG}`;
            }
          })
          .catch((e) => {
            this.errorMsg += e;
          })
          .finally(() => this.isFeedbackReady = true);
      } else {
        this.isFeedbackShow = false;
        this.isFeedbackReady = true;
      }

      return true;
    },

    setRiskInfo(data) {
      this.riskInfo = {
        ...this.riskInfo,
        ...data
      };
    },
    setDCNTData(data) {
      this.DCNTData = {
        ...this.DCNTData,
        ...data
      };
      nextTick();
      // refresh
      this.currentQuestions = [];
      this.decisionKey++;
    },
    // 關閉決策引導，開啟空白簽呈
    closeDecision() {
      this.isDCNTEnable = false;
      this.currentQuestions = [];
      this.DCNTData.RFA_CANS = [];
    },
    refreshDecision(data) {
      if(data) {
        this.DCNTData = data;
        nextTick();
        // refresh
        this.currentQuestions = [];
        this.isDCNTEnable = data.IS_DCNT === 'Y';
        this.decisionKey++;
      }
    },
    refreshRiskinfo(data) {
      if(data) {
        this.riskInfo = data;
        this.riskInfo.IsValid = true;
      }
    },
    async getDCNTData(applyNo) {
      const dcntResponse = await apiGetDCNT([applyNo]);
      const dcntResult = dcntResponse.data.result;
      return dcntResult;
    },

    /**
     * 取得RFA大小類
     */
    async getAllRFAs() {
      if (this.RFAList) return this.RFAList;
      try {
        const response = await apiGetRFACATandSCATList();
        const result = response.data.result;
        if (!result.IS_SUCCESS) throw result.RTN_MSG;
        this.RFAList = result.RTN_RFA_CATS;
        return result.RTN_RFA_CATS;
      } catch (e) {
        console.error('apiGetRFACATandSCATList error' + e);
      }
    },
    // 取得簽呈小類罐頭簽呈內容
    async getRFACONT(RFA_SCAT_ID) {
      try {
        const response = await apiGetRFACONT([RFA_SCAT_ID]);
        const result = response.data.result;
        if (!result.IS_SUCCESS) throw result.RTN_MSG;
        return result.RTN_RFA_OBJ;
      } catch (e) {
        console.error('apigetRFACONT error' + e);
        throw e;
      }
    },

    // 新增簽呈罐頭
    async AddRfaCan(RFA_CAN) {
      this.DCNTData.RFA_CANS.push(RFA_CAN);
      this.markModified();
    },

    // 檢核邏輯
    validateRiskInfo(risk) {
      if (!risk.OPINION || (risk.OPINION === 'N' && !risk.DSAG_RESN)) {
        risk.ERROR = '內容不得為空';
        this.riskInfo.IsValid = false;
      } else if (risk.OPINION === 'N' && risk.DSAG_RESN.length > 150) {
        risk.ERROR = `已超過限制字數 (${risk.DSAG_RESN.length}/150)`;
        this.riskInfo.IsValid = false;
      } else {
        risk.ERROR = '';
      }
    },

    // 檢核作業風險
    validateRisk() {
      this.riskInfo.IsValid = true;
      this.riskInfo.INS_RISK_INFO.forEach(this.validateRiskInfo);
      this.riskInfo.AGT_RISK_INFO.forEach(this.validateRiskInfo);
      this.riskInfo.HOSP_RISK_INFO.forEach(this.validateRiskInfo);
      this.riskInfo.DIS_RISK_INFO.forEach(this.validateRiskInfo);
      return this.riskInfo.IsValid;
    },

    // 不給付通知函輸入
    async getNotPayInput(applyNo) {
      const response = await apiGetNotPayInput([applyNo]);
      const result = response.data.result;
      return result;
    },

    // 取得不給付通知函輸入抬頭資訊
    async getNotPayTitleAndContent(applyNo) {
      const response = await apiGetNotPayTitleAndContent([applyNo]);
      const result = response.data.result;

      if (!result.IS_SUCCESS) throw result.RTN_MSG;
      
      return result.DATA;
    },

    // 取得不給付條款選擇項目
    async getNotPayLaw(sysNo, prodId) {
      const response = await apiGetNotPayLaw([sysNo, prodId]);
      const result = response.data.result;
      return result.DATA;
    },

    // 取得不給付通知函抬頭樣式、主張依據
    async getNotPayTitleSelectList(titleCode, subTitleCode, type) {
      const response = await apiGetNotPayTitleSelectList([titleCode, subTitleCode, type]);
      const result = response.data.result;
      return result.DATA;
    },

    // 簽核預覽處理
    async doSignPreview(applyNo, callback) {
      try {
        // 儲存引導
        let saveDcntResult = await this.saveData(applyNo);
        if (!saveDcntResult.IS_SUCCESS) throw saveDcntResult.RTN_MSG;

        // 儲存左邊停留頁籤資料
        const footerStore = useFooterStore();
        footerStore.submitPageData(async (isSuccess) => {
          this.showLoading();
          console.log(isSuccess);
          if (isSuccess) {
            // 簽核預覽
            const template = [applyNo, 'AAB3Z330'];
            const response = await apiDoSignPreview(template);
            const result = response.data.result;
            this.previewData = result;
            callback(result);
          } else {
            this.disablePreviewBtn = false;
            this.hideLoading();
          }
        });
      } catch (e) {
        console.error('doSignPreview error' + e);
        throw e;
      }
    },

    // 簽呈送出
    async doSignSend(applyNo) {
      try {
        const response = await apiDoSignSend([applyNo]);
        const result = response.data.result;
        return result;
      } catch (e) {
        console.error('apidoSignSend error' + e);
        throw e;
      }
    },

    async markModified(isModified = true) {
      this.isModified = true;
    },

    generateDecisionData(applyNo) {
      const { now } = useMoment();
      let dcntData = cloneDeep(this.DCNTData);
      dcntData.STATUS = '1';
      dcntData.PROC_DT = now('YYYY-MM-DD HH:mm:ss');
      // 將畫面上的問題結果更新回儲存的資料
      for (let i = 0; i < this.currentQuestions.length; i++) {
        for (let j = 0; j < dcntData.QUESTIONS.length; j++) {
          if (this.currentQuestions[i].QUE_SER_NO === dcntData.QUESTIONS[j].QUE_SER_NO) {
            dcntData.QUESTIONS[j] = this.currentQuestions[i];
            break;
          }
        }
      }
      return [applyNo, 'AAB3Z230', this.isModified ? 'Y' : 'N', this.riskInfo, dcntData];
    },

    // 儲存決策引導
    async saveData(applyNo) {
      let requestData = this.generateDecisionData(applyNo);
      const response = await apiSaveDcntRiskData(requestData);
      const result = response.data.result;
      // 成功更新資料
      if (result.IS_SUCCESS) {
        this.DCNTData.STATUS = requestData[4].STATUS;
        this.DCNTData.PROC_DT = requestData[4].PROC_DT;
        this.isModified = false;
      }
      return result;
    },

    // 儲存決策引導作答軌跡
    async saveDCNT(requestData) {
      const response = await apiSaveDCNT([requestData]);
      const result = response.data.result;
      return result;
    },

    // 檢核是否有包含給付已超過上限項目
    async chkLmtExptNo(applyNo) {
      const response = await apiChkLmtExptNo([applyNo]);
      const result = response.data.result;
      return result;
    },

    async getRiskTags3(applyNo,CRSS3_HIGH_ALERT) {
      try {
        const response = await apiGetRiskTags3([applyNo,CRSS3_HIGH_ALERT]);
        const result = response.data.result;

        if (!result.IS_SUCCESS) throw result.RTN_MSG;
        
        return result;
      } catch (e) {
        console.error('apiGetRiskTags3 error' + e);
        throw e;
      }
    },

    async doConfirm(saveData) {
      try {
        const response = await apiDoConfirm([saveData]);
        const result = response.data.result;

        if (!result.IS_SUCCESS) throw result.RTN_MSG;

        return result;
      } catch (e) {
        console.error('apiDoConfirm error' + e);
        throw e;
      }
    },

    /**
     * 退回、如擬、擬如擬
     */
    async doFeedback(type, applyNo, QUES_TYPE = 'X', QUES_ANSWER = 'X') {
      const applyStore = useApplyStore();
      const accountingStore = useAccountingStore();
      let response = null;
      try {
        switch (type) {
          // 退回
          case 'doBack':
            response = await apiDoBack([
              applyNo,
              applyStore.basicData.APLY_STS,
              this.signInitData.SYS_SIGN_LVL,
              this.currentSelectedSignLevel,
              this.feedbackText
            ]);
            break;
          // 如擬
          case 'doAcceptAndEndCase':
            let params = [
              applyNo,
              applyStore.basicData.APLY_STS,
              this.signInitData.SYS_SIGN_LVL,
              this.currentSelectedSignLevel,
              this.feedbackText,
              this.signInitData.END_ITEM_LIST.filter((item) => item.IS_CHECKED).map((m) => ({
                javaClass: 'java.util.Map',
                END_ITEM_CODE: m.END_ITEM_CODE,
                END_ITEM_OTHER: m.INPUT_VALUE ? m.INPUT_VALUE : null
              })),
              QUES_TYPE,
              QUES_ANSWER
            ];

            this.enableBeforeunload = true;
            response = await apiDoAcceptAndEndCase(params);

            let result = response.data.result
            if(result.IS_SUCCESS) {
              apiDoAcceptAndEndCaseAsync(params);
            }
            this.enableBeforeunload = false;

            break;
          // 擬如擬
          case 'doSign':
            response = await apiDoSign([
              applyNo,
              applyStore.basicData.APLY_STS,
              this.signInitData.SYS_SIGN_LVL,
              this.currentSelectedSignLevel,
              this.feedbackText,
              this.signInitData.END_ITEM_LIST.filter((item) => item.IS_CHECKED).map((m) => ({
                javaClass: 'java.util.Map',
                END_ITEM_CODE: m.END_ITEM_CODE,
                END_ITEM_OTHER: m.INPUT_VALUE ? m.INPUT_VALUE : null
              }))
            ]);
            break;
          // 暫存主管簽呈內容
          case 'saveMangSign':
            response = await apiSaveMangSign([
              applyNo,
              applyStore.basicData.APLY_STS,
              this.feedbackText,
              this.signInitData.END_ITEM_LIST.filter((item) => item.IS_CHECKED).map((m) => ({
                javaClass: 'java.util.Map',
                END_ITEM_CODE: m.END_ITEM_CODE,
                END_ITEM_OTHER: m.INPUT_VALUE ? m.INPUT_VALUE : null
              }))
            ]);
            break;
          default:
            throw '無此動作';
        }
        return response.data.result;
      } catch (e) {
        throw e;
      }
    },
    // 儲存不給付通知函輸入
    async saveNotPayInput(notPayData, notPayDataDetails) {
      notPayData.javaClass = 'java.util.Map'
      notPayData.RJCT_RESN_MEMO.forEach((e) => (e.javaClass = 'java.util.Map'));
      delete notPayData.returnMessage;
      notPayDataDetails.forEach((e) => (e.javaClass = 'java.util.Map'));
      const response = await apiSaveNotPayInput([notPayData, notPayDataDetails]);
      const result = response.data.result;
      return result;
    },
    // 預覽不給付通知函輸入
    async printNotPayInput(aplyNo) {
      const response = await apiPrintNotPayInput([aplyNo]);
      const result = response.data.result;
      return result;
    },
    // 預覽不給付通知函輸入
    async checkIsNew(aplyNo) {
      const response = await apiCheckIsNew([aplyNo]);
      const result = response.data.result;
      return result;
    }
  }
});
