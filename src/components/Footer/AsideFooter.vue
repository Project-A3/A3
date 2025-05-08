<template>
  <footer class="quick-footer decision-footer">
    <div class="columns">
      <div class="column ver-center hor-right p-0">
        <div class="footer-time">
          <span v-if="!isShowFeedBack">{{ format(saveTime.decision, 'YYYY-MM-DD HH:mm:ss') }}</span>
          <span v-if="isShowFeedBack">{{ format(saveTime.sign, 'YYYY-MM-DD HH:mm:ss') }}</span>
          <!-- <span>11:37</span> -->
        </div>
        <button class="button is-secondary" v-if="!isShowFeedBack" :disabled="decisionStore.isReadonly" @click="onClickSave">儲存引導</button>
        <button class="button is-secondary" v-if="isShowFeedBack" @click="onClickSaveFeedBack">儲存</button>
      </div>
    </div>
  </footer>
</template>
<script setup>
  import { storeToRefs } from 'pinia';
  import { useDecisionStore } from '~/stores/decision';
  import { useFooterStore } from '~/stores/footer';
  import useMoment from '~/composables/useMoment';
  import useSwal from '~/composables/useSwal';
  import { nextTick } from 'vue';
  const { $swal } = useSwal();
  const footerStore = useFooterStore();
  const decisionStore = useDecisionStore();
  const { format } = useMoment();
  // 取得儲存時間
  const { saveTime } = storeToRefs(footerStore);

  // 意見回饋區塊是否有顯示
  const isShowFeedBack = computed(() => decisionStore.isReview && !decisionStore.isEndCase && decisionStore.isAPIReady && decisionStore.isFeedbackShow);

  const onClickSave = async () => {
    try {
      // 檢核作業風險
      let isRiskValid = decisionStore.validateRisk();
      await nextTick();
      // 檢核畫面上是否有錯誤，hacky先判斷有沒有error class
      const asideSection = document.querySelector('.decision-aside');
      if (!isRiskValid || asideSection.querySelector('img.error-message')) {
        $swal.warning('資料有誤，請再次確認', '請確認資料無誤後再次送出');
        return;
      }
      decisionStore.showLoading();
      const result = await decisionStore.saveData(footerStore.applyNo);
      if (!result.IS_SUCCESS) throw result.RTN_MSG;
      $swal.success(result.RTN_MSG);
      footerStore.setSaveTime({ trial: result.CASE_FLOW_BTN_DT, decision: result.DCNT_BTN_DT });
    } catch (e) {
      $swal.fail(e);
    } finally {
      decisionStore.hideLoading();
    }
  };

  const onClickSaveFeedBack = async () => {
    if (!decisionStore.feedbackText) {
      $swal.warning('請填寫內容');
      return;
    } 

    try {
      decisionStore.showLoading();
      const result = await decisionStore.doFeedback('saveMangSign', footerStore.applyNo);
      if (!result.IS_SUCCESS) throw result.RTN_MSG;
      $swal.success(result.RTN_MSG);
      footerStore.setSaveTime({ sign: result.SIGN_BTN_DT });
    } catch (e) {
      $swal.fail(e);
    } finally {
      decisionStore.hideLoading();
    }
  };
</script>
<style lang="scss"></style>
