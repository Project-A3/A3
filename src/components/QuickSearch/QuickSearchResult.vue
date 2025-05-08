<template>
  <!-- 搜尋 ID 結果區塊-->
  <div class="search-result">
    <transition :name="transitionName" mode="out-in">
      <keep-alive>
        <QuickSearchIdResult
          v-if="currentQuickSearchStatus === QuickSearchStatus.SearchIDResult"
          :searchResult="props.searchResult"
        ></QuickSearchIdResult>
      </keep-alive>
    </transition>
    <CaseDetail :key="quickSearchStore.caseResultKey" v-if="currentQuickSearchStatus === QuickSearchStatus.CaseDetailFromNo"></CaseDetail>
  </div>
</template>
<script setup>
  import { QuickSearchStatus } from '~/common/utils/enum';
  import QuickSearchIdResult from './QuickSearchIdResult.vue';
  import { useQuickSearchStore } from '~/stores/quickSearch';
  import { storeToRefs } from 'pinia';
  import CaseDetail from './CaseDetail.vue';
  const quickSearchStore = useQuickSearchStore();
  const { currentQuickSearchStatus, hasTransition } = storeToRefs(quickSearchStore);
  const props = defineProps({
    searchResult: {
      type: Object,
      required: true,
      default: {}
    }
  });

  const transitionName = computed(() => (hasTransition.value ? 'slide-fade' : ''));
</script>
