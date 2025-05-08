import { useQuickSearchStore } from '~/stores/quickSearch';
import { QuickSearchStatus, QuickSearchType } from '~/common/utils/enum';
import useSwal from '~/composables/useSwal';
export default function useQuickSearch() {
  const quickSearchStore = useQuickSearchStore();
  const { $swal } = useSwal();
  // 快捷搜尋
  const quickSearch = async (quickSearchType, value, dataNotFoundErrorMsg = '查無資料!') => {
    const response = await quickSearchStore.quickSearch(quickSearchType, value);
    // 查無資料
    if (response?.queryClaimCaseRecords.length === 0) {
      $swal.fail(dataNotFoundErrorMsg);
      return;
    }

    // 用編號查詢
    quickSearchStore.$patch({
      currentQuickSearchCaseDetail: response,
      currentQuickSearchStatus:
        quickSearchType === QuickSearchType.ApplyNo ? QuickSearchStatus.CaseDetailFromNo : QuickSearchStatus.SearchIDResult,
      currentSearchValue: value,
      currentSearchType: quickSearchType,
      hasTransition: false
    });

    // 如果快捷專區沒展開，將其展開
    const mainTarget = document.querySelector('main.hide-right');
    if (mainTarget) {
      mainTarget.classList.remove('hide-right');
    }
  };
  return {
    quickSearch
  };
}
