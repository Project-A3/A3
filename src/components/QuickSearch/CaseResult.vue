<template>
  <div class="search-case-result">
    <a class="back-to-search text-button" @click="onClickBackResult">
      <img src="/src/assets/images/icon-arrow-left.svg" alt="ARROW" /><cathay-translate code="Component_CaseResult_001" />
    </a>
    <CaseDetail></CaseDetail>
  </div>
</template>
<script setup>
  import CaseDetail from './CaseDetail.vue';
  import { useQuickSearchStore } from '~/stores/quickSearch';
  import { storeToRefs } from 'pinia';
  import { QuickSearchStatus } from '~/common/utils/enum';

  const quickSearchStore = useQuickSearchStore();
  const { currentQuickSearchStatus } = storeToRefs(quickSearchStore);

  const onClickBackResult = () => {
    currentQuickSearchStatus.value = QuickSearchStatus.SearchIDResult;
  };
</script>
