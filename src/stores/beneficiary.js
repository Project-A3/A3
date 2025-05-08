import { cloneDeep } from 'lodash-es';
import { defineStore } from 'pinia';
import { apiDeleteBeneInfo, apiGetBeneChgResn, apiGetBeneInfo, apiGetPaymentAllocation, apiSaveClamData, apiReadBasicData, apiGetPolicyBeneList } from '~/common/api';
import { useApplyStore } from './apply';
import useSwal from '~/composables/useSwal';

export const useBeneficiaryStore = defineStore('beneficiary', {
  state: () => ({
    paymentAllocationsData: {
      DATA: []
    },
    beneChangeReasons: [],
    beneficiaries: [],
    beforeSaveData: [],
    isChkBeneficiary: 'N'
  }),
  getters: {
    paymentAllocations: (state) => state.paymentAllocationsData.DATA
  },
  actions: {
    /**
     * 取得受益人分配頁面需要的資料
     * @param {String} applyNo 受理編號
     * @param {String} isCalFee 是否重算延滯息(從簽呈預覽導過來)
     */
    async getAllData(applyNo, isCalFee) {
      const { $swal } = useSwal();
      const responses = await Promise.all([
        apiGetPaymentAllocation([applyNo, isCalFee]),
        apiGetBeneChgResn(),
        apiGetBeneInfo([applyNo]),
        apiReadBasicData([applyNo])
      ]);
      const getPaymentAllocationResult = responses[0].data.result;
      const getBeneChgResnResult = responses[1].data.result;
      const getBeneInfoResult = responses[2].data.result;
      let errorMessage = '';

      // LICXS-627重新取得基本資料並更新標籤
      const applyStore = useApplyStore();
      let basicDataResult = responses[3].data.result;
      let basicDataObj = basicDataResult.IS_SUCCESS ? basicDataResult : {};

      if (basicDataObj != {}) {
        applyStore.basicData.CASE_TAG = basicDataObj.CASE_TAG;
        applyStore.basicData.AGE = basicDataObj.AGE;
      }
     
      if (getPaymentAllocationResult.IS_SUCCESS) {
        this.paymentAllocationsData = getPaymentAllocationResult;

        console.log(this.paymentAllocationsData);
        this.setUIData();
        // 剛進來時，儲存前資料
        this.beforeSaveData = cloneDeep(getPaymentAllocationResult.DATA);

        if (getPaymentAllocationResult.RTN_CODE === '1') {
          if (getPaymentAllocationResult.RTN_MSG) {
            $swal.warning(getPaymentAllocationResult.RTN_MSG);
          }
        }
      } else {
        errorMessage += getPaymentAllocationResult.RTN_MSG + '\n';
      }

      if (getBeneChgResnResult.IS_SUCCESS) {
        this.beneChangeReasons = getBeneChgResnResult.DATA;
      } else {
        errorMessage += getBeneChgResnResult.RTN_MSG + '\n';
      }

      if (getBeneInfoResult.IS_SUCCESS) {
        this.beneficiaries = getBeneInfoResult.DATA;
      } else {
        errorMessage += getBeneInfoResult.RTN_MSG;
      }

      return errorMessage;
    },

    setUIData() {
      for (const allocation of this.paymentAllocationsData.DATA) {
        for (const claim of allocation.claimCatInfo) {
          for (const bene of claim.beneInfo) {
            bene.IS_CURR_INS = false;
            // 備份原本的比例和受益人ID
            bene.ORI_PAY_RATO = bene.PAY_RATO;
            bene.ORI_BENE_ID = bene.BENE_ID;
          }
        }
      }
    },
    /**
     * 刪除受益人分配資料
     * @param {Object} beneficiary 受益人物件
     */
    async deleteBeneInfo(beneficiary) {
      try {
        const response = await apiDeleteBeneInfo(beneficiary);
        const result = response.data.result;
        if (!result.IS_SUCCESS) throw result.RTN_MSG;
        return true;
      } catch (e) {
        throw e;
      }
    },

    /**
     * 取得所有受益人
     * @param {String} applyNo 受理編號
     */
    async getBeneInfo(applyNo) {
      try {
        const response = await apiGetBeneInfo([applyNo]);
        const result = response.data.result;
        if (!result.IS_SUCCESS) throw result.RTN_MSG;
        return result.DATA;
      } catch (e) {
        throw e;
      }
    },

    isPageChanged() {
      return JSON.stringify(this.beforeSaveData) !== JSON.stringify(toRaw(this.paymentAllocations));
    },

    generatePageData(applyNo) {
      // 補上javaClass
      this.paymentAllocations.forEach((e) => {
        e.javaClass = 'java.util.Map';
        e?.claimCatInfo.forEach((c) => {
          c.javaClass = 'java.util.Map';
          c.beneInfo.forEach((b) => (b.javaClass = 'com.cathay.aa.b3.bo.AA_B3Z300_bo1'));
        });
      });
      return [
        applyNo,
        'AAB3Z320',
        // 比對資料是否有變更過
        this.isPageChanged() ? 'Y' : 'N',
        'N',
        [],
        [
          {
            javaClass: 'java.util.Map',
            DATA: this.paymentAllocations
          }
        ],
        'X',
        'X',
        []
      ];
    },

    /**
     * 儲存受益人分配資料
     */
    async savePageData(applyNo) {
      const response = await apiSaveClamData(this.generatePageData(applyNo));
      const result = response.data.result;
      return result;
    },

    /**
     * 取得保單受益人清單
     */
    async getPolicyBeneList(policyNo) {
      const response = await apiGetPolicyBeneList([policyNo]);
      const result = response.data.result;
      return result;
    },
  }
});
