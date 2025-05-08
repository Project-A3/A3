<template>
  <div class="block other-block">
    <p class="block-title-outside">{{ blockTitle }}</p>
    <div class="block-content">
      <template v-if="userRole === UserRoleEnum.Decd">
        <FilterButton
          text="Component_OtherFilter_002"
          :count="dataCnt.decdCnt_map.SIGN_TODO_CNT"
          :caseTablesType="CaseTablesType.ToBeSignedFor.All"
          :isSelected="handleSelected(CaseTablesType.ToBeSignedFor.All)"
        ></FilterButton>
        <FilterButton
          text="Component_OtherFilter_003"
          :count="dataCnt.decdCnt_map.CLAM_MANAGER_SIGN_CNT"
          :caseTablesType="CaseTablesType.Signing"
          :isSelected="handleSelected(CaseTablesType.Signing)"
        ></FilterButton>
        <FilterButton
          text="Component_OtherFilter_004"
          :count="dataCnt.decdCnt_map.CLAM_TEMP_END_CASE_CNT"
          :caseTablesType="CaseTablesType.TempEndCase"
          :isSelected="handleSelected(CaseTablesType.TempEndCase)"
        ></FilterButton>
        <FilterButton
          text="Component_OtherFilter_005"
          :count="dataCnt.decdCnt_map.CLAM_END_CASE_CNT"
          :caseTablesType="CaseTablesType.EndCase"
          :isSelected="handleSelected(CaseTablesType.EndCase)"
        ></FilterButton>
        <FilterButton
          text="Component_OtherFilter_006"
          :count="dataCnt.decdCnt_map.CNCL_POLICY_CNT"
          :caseTablesType="CaseTablesType.CancelPolicy.All"
          :isSelected="handleSelected(CaseTablesType.CancelPolicy.All)"
        ></FilterButton>
        <FilterButton
          text="Component_OtherFilter_007"
          :count="dataCnt.decdCnt_map.CLAM_BANK_RETURN_CNT"
          :caseTablesType="CaseTablesType.BankReTurn"
          :isSelected="handleSelected(CaseTablesType.BankReTurn)"
        ></FilterButton>
      </template>
      <template v-else>
        <FilterButton
          text="Component_OtherFilter_008"
          :count="dataCnt.aprvCnt_map.APRV_CLAM_CNT"
          :caseTablesType="CaseTablesType.Review"
          :isSelected="handleSelected(CaseTablesType.Review)"
        ></FilterButton>
        <FilterButton
          text="Component_OtherFilter_009"
          :count="dataCnt.aprvCnt_map.APRV_CLAM_SURVEY_CASE_CNT"
          :caseTablesType="CaseTablesType.SurveyCase.All"
          :isSelected="handleSelected(CaseTablesType.SurveyCase.All)"
        ></FilterButton>
        <FilterButton
          text="Component_OtherFilter_010"
          :count="dataCnt.aprvCnt_map.APRV_CLAM_NOTE_COMMENT_CNT"
          :caseTablesType="CaseTablesType.NoteComment.All"
          :isSelected="handleSelected(CaseTablesType.NoteComment.All)"
        ></FilterButton>
        <FilterButton
          text="Component_OtherFilter_011"
          :count="dataCnt.aprvCnt_map.APRV_REP_CASE_CNT"
          :caseTablesType="CaseTablesType.RepCase.All"
          :isSelected="handleSelected(CaseTablesType.RepCase.All)"
        ></FilterButton>
        <FilterButton
          text="Component_OtherFilter_007"
          :count="dataCnt.aprvCnt_map.CLAM_BANK_RETURN_CNT"
          :caseTablesType="CaseTablesType.BankReTurn"
          :isSelected="handleSelected(CaseTablesType.BankReTurn)"
        ></FilterButton>
      </template>
    </div>
  </div>
</template>
<script setup>
  import { isEmpty } from 'lodash-es';
  import { storeToRefs } from 'pinia';
  import { CaseTablesType, UserRoleEnum } from '~/common/utils/enum';
  import { useHomeStore } from '~/stores/home';
  import { useLanguageStore } from '~/stores/language';
  import FilterButton from './FilterButton.vue';

  const homeStore = useHomeStore();
  const { data, dataCnt, userRole, currentWaitApproveType, currentCaseTablesType } = storeToRefs(homeStore);
  const handleSelected = (type) => isEmpty(currentWaitApproveType.value) && currentCaseTablesType.value === type;
  const language = useLanguageStore();
  const blockTitle = computed(() => {
    return language.translate('Component_OtherFilter_001'); // 其他
  });

  defineExpose({
    data,
    dataCnt,
    userRole,
    currentCaseTablesType,
    UserRoleEnum,
    CaseTablesType,
    handleSelected
  });
</script>
