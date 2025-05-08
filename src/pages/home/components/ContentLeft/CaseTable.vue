<template>
  <component :is="activeCaseTable"></component>
</template>

<script setup>
  import CancelPolicyTable from './Tables/CancelPolicyTable.vue';
  import TempEndCase from './Tables/TempEndCaseTable.vue';
  import EndCaseTable from './Tables/EndCaseTable.vue';
  import SigningTable from './Tables/SigningTable.vue';
  import ToBeAprvPayTable from './Tables/ToBeAprvPayTable.vue';
  import ToBeSignedForTable from './Tables/ToBeSignedForTable.vue';
  import WaitApproveTable from './Tables/WaitApproveTable.vue';
  import ReviewerAprvTable from './Tables/ReviewerAprvTable.vue';
  import SurveyCaseTable from './Tables/SurveyCaseTable.vue';
  import NoteCommentTable from './Tables/NoteCommentTable.vue';
  import ToBeCmrTable from './Tables/ToBeCmrTable.vue';
  import { debouncedWatch } from '@vueuse/core';
  import { storeToRefs } from 'pinia';
  import { CaseTablesType, UserRoleEnum, WaitApproveType } from '~/common/utils/enum';
  import useCaseTable from '~/composables/useCaseTable';
  import { useHomeStore } from '~/stores/home';
  import BankReturnTable from './Tables/BankReturnTable.vue';
  import RepCaseTable from './Tables/RepCaseTable.vue';

  const homeStore = useHomeStore();
  const { userRole, currentWaitApproveType, currentCaseTablesType, pauseTableWatch, hasDefaultCaseTable} =
    storeToRefs(homeStore);

  // 根據使用者點選的類型顯示不同Table
  const activeCaseTable = computed(() => {
    // console.log(currentCaseTablesType.value);
    if (currentWaitApproveType.value === WaitApproveType.ToBeCmr.All){ // CMR件
      return ToBeCmrTable;
    }

    switch (currentCaseTablesType.value) {
      case CaseTablesType.WaitApprove:
        return WaitApproveTable;
      case CaseTablesType.ToBeAprvPay: // 待核付
        return ToBeAprvPayTable;
      case CaseTablesType.ToBeSignedFor.All: // 待簽收(全部)
        return ToBeSignedForTable;
      case CaseTablesType.Signing: // 簽擬中
        return SigningTable;
      case CaseTablesType.EndCase: // 已結案
        return EndCaseTable;
      case CaseTablesType.TempEndCase: // 暫時結案
        return TempEndCase;
      case CaseTablesType.CancelPolicy.All: // 解除契約
        return CancelPolicyTable;
      case CaseTablesType.BankReTurn: //銀行退款件
        return BankReturnTable;
      case CaseTablesType.Review: // 待審件
        return ReviewerAprvTable;
      case CaseTablesType.SurveyCase.All: // 調查件
        return SurveyCaseTable;
      case CaseTablesType.NoteComment.All: // 照會意見
        return NoteCommentTable;
      case CaseTablesType.RepCase.All: //補全件
        return RepCaseTable;
      default:
        return null;
    }
  });

  const refreshTable = async () => {
    if (
      (userRole.value === UserRoleEnum.Decd && currentCaseTablesType.value === CaseTablesType.WaitApprove) ||
      (userRole.value === UserRoleEnum.Aprv && currentCaseTablesType.value === CaseTablesType.ToBeAprvPay)
    ) {
      const response = await useCaseTable('decdList_mapList');
      // 通知畫面更新
      homeStore.currentWaitTableData = response;
    }
  };

  // 監聽如果核賠人員選擇待核定/覆核人員選擇待簽擬其他類型，要呼叫API重新Render data(因為共用Table)
  // 其他類型的Table在各自組件內呼叫API(有各自的Table)
  debouncedWatch(
    currentWaitApproveType,
    async () => {
      if (!pauseTableWatch.value) {
        await refreshTable();
      } else {
        // 切換代理人時，不用再次呼叫API，切換完畢後將pause改為false
        homeStore.$patch({
          pauseTableWatch: false
        });
        // 如果重覆切換代理人後選擇新類型(預設會回到全部)，就可以直接呼叫API
        if (currentWaitApproveType.value !== WaitApproveType.All) {
          await refreshTable();
        }
      }
      // console.log('changed type!');
    },
    { debounce: 100, immediate: hasDefaultCaseTable.value }
  );
</script>
