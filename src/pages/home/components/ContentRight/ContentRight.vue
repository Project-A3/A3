<template>
  <aside class="overflow-auto">
    <QuickSearchWrapper></QuickSearchWrapper>
    <Calendar v-show="currentQuickSearchStatus === QuickSearchStatus.Default"></Calendar>
    <TodayTodo v-if="currentQuickSearchStatus === QuickSearchStatus.Default"></TodayTodo>
  </aside>
  <div class="button-scroll-to-top is-in-aside"><cathay-translate code="Common_GO_TOP" /></div>
</template>
<script setup>
  import { storeToRefs } from 'pinia';
  import { bindScrollToTop } from '~/common/utils';
  import { QuickSearchStatus } from '~/common/utils/enum';
  import QuickSearchWrapper from '~/components/QuickSearch/QuickSearchWrapper.vue';
  import { useQuickSearchStore } from '~/stores/quickSearch';
  import Calendar from './Calendar.vue';
  import TodayTodo from './TodayTodo.vue';

  const quickSearchStore = useQuickSearchStore();
  const { currentQuickSearchStatus } = storeToRefs(quickSearchStore);




  onMounted(() => {
    bindScrollToTop('main > aside', '.is-in-aside.button-scroll-to-top');
  });
</script>
<style scoped>
  .button-scroll-to-top.is-in-aside {
    bottom: 10px;
  }
</style>
