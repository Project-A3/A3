import { defineStore } from 'pinia';
import { apiDoInsertAH, apiGetReviewerInfo, apiGetSaveTime, apiUpdRecIdx } from '~/common/api';
import { useApplyStore } from './apply';

export const useFooterStore = defineStore('footer', {
  state: () => ({
    // 受理編號
    applyNo: '',
    // 事故人ID
    ocrId: '',
    // 事故者姓名
    ocrName: '',
    // 壽團險分類
    lifeGropClfy: '',
    // 目前是哪個頁面
    pageKey: '',
    // 儲存時間
    saveTime: {
      trial: '', // 審理進度
      decision: '', // 決策引導
      sign: '' // 儲存主管回饋意見
    }
  }),
  getters: {},
  actions: {
    setFooterData({ applyNo, ocrId, ocrName, lifeGropClfy, pageKey }) {
      this.applyNo = applyNo;
      this.ocrId = ocrId;
      this.ocrName = ocrName;
      this.lifeGropClfy = lifeGropClfy;
      this.pageKey = pageKey;
    },
    /**
     * 取得儲存時間
     * @param {String} applyNo 受理編號
     */
    getSaveTime(applyNo) {
      // 使用then避免頁面堵塞在這
      apiGetSaveTime([applyNo]).then((saveTimeResponse) => {
        const saveTimeResult = saveTimeResponse.data.result;
        if (saveTimeResult.IS_SUCCESS) {
          this.saveTime.trial = saveTimeResult.CASE_FLOW_BTN_DT;
          this.saveTime.decision = saveTimeResult.DCNT_BTN_DT;
          this.saveTime.sign = saveTimeResult.SIGN_BTN_DT;
        }
      });
    },

    /**
     * 取得是否為覆核人員
     * @param {String} applyNo 受理編號
     * @return {Boolean} true or false
     */
    async getReviewerInfo(applyNo) {
      try {
        const response = await apiGetReviewerInfo([applyNo]);
        const result = response.data.result;
        if (!result.IS_SUCCESS) throw result.RTN_MSG;

        const applyStore = useApplyStore();
        // 20220825_保單概況_建男_01
        const isReviewer = !(result.STEP_STS === '1' && (result.IS_ASSIGNED === 'Y' || result.IS_ASSIGNED_BA === 'Y'));
        // 放進applyStore, 之後皆從此處抓取
        applyStore.isManager = isReviewer;
        result.isReviewer = isReviewer;
        return result;
      } catch (e) {
        console.error(e);
        throw e;
      }
    },

    setSaveTime({ trial = null, decision = null, sign = null }) {
      if (trial) {
        this.saveTime.trial = trial;
      }
      if (decision) {
        this.saveTime.decision = decision;
      }
      if (sign) {
        this.saveTime.sign = sign;
      }
    },
    async doInsertAH(ahType, applyNo = null) {
      let reqApplyNo = applyNo ?? this.applyNo;
      const response = await apiDoInsertAH([reqApplyNo, ahType]);
      const result = response.data.result;
      return result;
    },

    /**
     * 點選理賠紀錄、特殊紀錄註記
     * @param {*} applyNo
     * @param {*} whichButton
     */
    async recordButtonClicked(whichButton, applyNo = null) {
      let req = [];
      let reqApplyNo = applyNo ?? this.applyNo;
      switch (whichButton) {
        case 'CLAIM':
          req = [reqApplyNo, 'Y', 'N', 'N'];
          break;
        case 'SPECIAL':
          req = [reqApplyNo, 'N', 'Y', 'N'];
          break;
        case 'NOTPAY':
          req = [reqApplyNo, 'N', 'N', 'Y'];
          break;
        default:
          throw '無此按鈕';
          break;
      }
      const response = await apiUpdRecIdx(req);
      const result = response.data.result;
      return result;
    },

    // hacky,給頁面按下儲存按鈕用,在頁面各自的component Subscribing to actions
    submitPageData: async (payload) => true
  }
});
