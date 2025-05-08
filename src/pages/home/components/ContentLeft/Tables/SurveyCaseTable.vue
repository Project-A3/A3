<template>
  <div class="block table-block">
    <div class="block-title-outside scroll-fix">
      <div class="table-title-tab">
        <div class="has-text-weight-normal mr-3">
          <cathay-translate code="Component_SurveyCaseTable_001" /> <span>({{ getTotalCount }})</span>
        </div>
        <div
          :class="{ 'is-active': currentSurveyCaseForType === CaseTablesType.SurveyCase.AprvInvs }"
          @click="switchTab(CaseTablesType.SurveyCase.AprvInvs)"
        >
          <cathay-translate code="Component_SurveyCaseTable_002" /> <span>({{ getCounts.AprvInvs }})</span>
        </div>
        <div
          :class="{ 'is-active': currentSurveyCaseForType === CaseTablesType.SurveyCase.SignInvs }"
          @click="switchTab(CaseTablesType.SurveyCase.SignInvs)"
        >
          <cathay-translate code="Component_SurveyCaseTable_003" /> <span>({{ getCounts.SignInvs }})</span>
        </div>
      </div>
    </div>
    <div class="block-content">
      <keep-alive>
        <component :is="activecurrentSurveyCaseForTable" v-bind="toSurveyCaseData"></component>
      </keep-alive>
    </div>
  </div>
</template>
<script setup>
  import AprvInvsTable from './Survey/AprvInvsTable.vue';
  import SignInvsTable from './Survey/SignInvsTable.vue';
  import { CaseTablesType } from '~/common/utils/enum';
  import useCaseTable from '~/composables/useCaseTable';
  import { useHomeStore } from '~/stores/home';
  import { storeToRefs } from 'pinia';
  import { onDeactivated } from 'vue';

  // 使用者選擇的待簽收類型
  const { currentSurveyCaseForType } = storeToRefs(useHomeStore());

  // 根據使用者選擇的渲染不同Table
  const activecurrentSurveyCaseForTable = computed(() => {
    switch (currentSurveyCaseForType.value) {
      case CaseTablesType.SurveyCase.AprvInvs:
        return AprvInvsTable;
      case CaseTablesType.SurveyCase.SignInvs:
        return SignInvsTable;
      default:
        break;
    }
  });

  // 切換頁籤
  const switchTab = (type) => {
    currentSurveyCaseForType.value = type;
  };

  // 呼叫API取得資料
  const toSurveyCaseData = await useCaseTable();
  // 待簽收個別的數量
  const getCounts = reactive({
    AprvInvs: toSurveyCaseData.aprvInvs_mapList.length,
    SignInvs: toSurveyCaseData.signInvs_mapList.length
  });

  // 待簽收總數量
  const getTotalCount = computed(() => getCounts.AprvInvs + getCounts.SignInvs);

  onDeactivated(() => {
    // 還原為預設值
    currentSurveyCaseForType.value = CaseTablesType.SurveyCase.AprvInvs;
  });
</script>
