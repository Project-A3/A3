<template>
  <div class="block wait-approve-block">
    <p class="block-title-outside">{{ blockTitle }}</p>
    <div class="block-content">
      <FilterButton
        text="Component_WaitApprove_005"
        :count="waitApproveCondition.allCount"
        :waitApproveType="WaitApproveType.All"
        :caseTablesType="bindCaseTablesType"
        :isSelected="handleSelected(WaitApproveType.All)"
      ></FilterButton>
      <FilterButton
        text="Component_WaitApprove_001"
        :count="waitApproveCondition.fiveDaysCount"
        :waitApproveType="WaitApproveType.FiveDays"
        :caseTablesType="bindCaseTablesType"
        :isSelected="handleSelected(WaitApproveType.FiveDays)"
      ></FilterButton>
      <FilterButton
        text="Component_WaitApprove_002"
        :count="waitApproveCondition.sixTo15DaysCount"
        :waitApproveType="WaitApproveType.SixTo15Days"
        :caseTablesType="bindCaseTablesType"
        :isSelected="handleSelected(WaitApproveType.SixTo15Days)"
      ></FilterButton>
      <FilterButton
        text="Component_WaitApprove_003"
        :count="waitApproveCondition.sixteenTo30DaysCount"
        :waitApproveType="WaitApproveType.SixteenTo30Days"
        :caseTablesType="bindCaseTablesType"
        :isSelected="handleSelected(WaitApproveType.SixteenTo30Days)"
      ></FilterButton>
      <FilterButton
        text="Component_WaitApprove_004"
        :count="waitApproveCondition.over30DaysCount"
        :waitApproveType="WaitApproveType.Over30Days"
        :caseTablesType="bindCaseTablesType"
        :isSelected="handleSelected(WaitApproveType.Over30Days)"
      ></FilterButton>
      <template v-if="isUnderTaker">
        <FilterButton
          text="Component_WaitApprove_006"
          :count="waitApproveCondition.returnCount"
          :waitApproveType="WaitApproveType.Return"
          :caseTablesType="bindCaseTablesType"
          :isSelected="handleSelected(WaitApproveType.Return)"
        ></FilterButton>
      </template>
      <FilterButton
        text="Component_WaitApprove_007"
        :count="waitApproveCondition.restartCount"
        :waitApproveType="WaitApproveType.Restart"
        :caseTablesType="bindCaseTablesType"
        :isSelected="handleSelected(WaitApproveType.Restart)"
      ></FilterButton>
      <FilterButton
        text="Component_WaitApprove_008"
        :count="waitApproveCondition.cmrCount"
        :waitApproveType="WaitApproveType.ToBeCmr.All"
        :caseTablesType="bindCaseTablesType"
        :isSelected="handleSelected(WaitApproveType.ToBeCmr.All)"
      ></FilterButton>
      <template v-if="!isUnderTaker">
        <FilterButton
          text="Component_WaitApprove_009"
          :count="waitApproveCondition.cancelCount"
          :waitApproveType="WaitApproveType.CancelPolicy"
          :caseTablesType="CaseTablesType.CancelPolicy.All"
          :isSelected="handleSelected(CaseTablesType.CancelPolicy.All)"
        ></FilterButton>
      </template>
    </div>
  </div>
</template>
<script setup>
  import { storeToRefs } from 'pinia';
  import { CaseTablesType, UserRoleEnum, WaitApproveType } from '~/common/utils/enum';
  import { useHomeStore } from '~/stores/home';
  import { useLanguageStore } from '~/stores/language';
  import FilterButton from './FilterButton.vue';

  const homeStore = useHomeStore();
  const language = useLanguageStore();
  // 讀取目前篩選的條件
  const { waitApproveCondition, currentWaitApproveType, currentCaseTablesType, userRole } = storeToRefs(homeStore);
  // 是否為核賠人員(非覆核人員)
  const isUnderTaker = ref(userRole.value === UserRoleEnum.Decd);

  const blockTitle = computed(() => {
    return isUnderTaker.value ? language.translate('Component_WaitApprove_010') : language.translate('Component_WaitApprove_011'); // 待審核 : 待覆核
  });
  const bindCaseTablesType = isUnderTaker.value ? CaseTablesType.WaitApprove : CaseTablesType.ToBeAprvPay;

  const handleSelected = (waitApproveType, caseTablesType = bindCaseTablesType) =>
    currentWaitApproveType.value === waitApproveType && currentCaseTablesType.value === caseTablesType;

  defineExpose({
    isUnderTaker,
    blockTitle,
    waitApproveCondition,
    CaseTablesType,
    bindCaseTablesType,
    handleSelected
  });
</script>
