<template>
  <div>
    <Loading :can-cancel="false" :is-full-page="false" color="#6fba2a" :active="!(isRiskTagReady && isRiskInfoReady && isDecisionReady && isSignedHistoryReady && isFeedbackReady)"></Loading>
    <div class="decision-aside">
      <!-- 作業風險 Card -->
      <RiskInfo v-if="isRiskTagReady && isRiskInfoReady"></RiskInfo>
      <!-- 決策引導 Card -->
      <Decision v-if="isDecisionReady" :key="decisionStore.decisionKey"></Decision>
      <!-- 簽呈歷程 Card -->
      <SignedHistory v-if="decisionStore.signData && decisionStore.signData.length > 0 && isSignedHistoryReady"></SignedHistory>
      <!-- 意見回饋 Card -->
      <Feedback
        v-if="decisionStore.isReview && !decisionStore.isEndCase && isFeedbackReady && decisionStore.isFeedbackShow"
      ></Feedback>
    </div>
  </div>
</template>

<script setup>
  import { storeToRefs } from 'pinia';
  import RiskInfo from './RiskInfo.vue';
  import Decision from './Decision.vue';
  import SignedHistory from './SignedHistory.vue';
  import Feedback from './Feedback.vue';
  import { useDecisionStore } from '~/stores/decision';
  import useSwal from '~/composables/useSwal';
  // Import component
  import Loading from 'vue-loading-overlay';
  // Import stylesheet
  import 'vue-loading-overlay/dist/vue-loading.css';
  import { isEmpty } from 'lodash-es';

  const { $swal } = useSwal();
  const decisionStore = useDecisionStore();
  const aplyNo = inject('ApplyNo');
  // mounted 再呼叫，避免UI Freezed
  const { isAPIReady, isRiskTagReady, isRiskInfoReady, isDecisionReady, isSignedHistoryReady, isFeedbackReady, errorMsg } = storeToRefs(decisionStore);

  watch(
    [isRiskTagReady, isRiskInfoReady, isDecisionReady, isSignedHistoryReady, isFeedbackReady, errorMsg], 
    async (
      [newVal1,newVal2,newVal3,newVal4,newVal5,newVal6],
      [oldVal1,oldVal2,oldVal3,oldVal4,oldVal5,oldVal6]) => {
        // console.log('isRiskTagReady：',newVal1,oldVal1);
        // console.log('isRiskInfoReady',newVal2,oldVal2);
        // console.log('isDecisionReady',newVal3,oldVal3);
        // console.log('isSignedHistoryReady',newVal4,oldVal4);
        // console.log('isFeedbackReady',newVal5,oldVal5);
        // console.log('errorMsg',newVal6,oldVal6);
        let isAllReady = newVal1 && newVal2 && newVal3 && newVal4 && newVal5;
        let message = newVal6;
        if (isAllReady && !isEmpty(message)) {
          console.error(`決策引導錯誤:\n${message}`);
          $swal.fail(message);
        }

        isAPIReady.value = isAllReady;
    }
  );

  onMounted(async () => {
    await decisionStore.getAllData(aplyNo);
  });
</script>

<style lang="scss" scoped></style>
