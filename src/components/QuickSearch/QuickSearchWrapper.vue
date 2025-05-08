<template>
  <QuickSearch :onExitCallback="onExitCallback"></QuickSearch>
  <transition :name="transitionName" mode="out-in">
    <CaseResult v-if="currentQuickSearchStatus === QuickSearchStatus.CaseDetailFromID"></CaseResult>
  </transition>
  <transition :name="transitionName" mode="out-in">
    <QuickNote v-if="currentQuickSearchStatus > QuickSearchStatus.SearchIDResult"></QuickNote>
  </transition>
  <transition :name="transitionName" mode="out-in">
    <ProgressArea v-if="currentQuickSearchStatus > QuickSearchStatus.SearchIDResult"></ProgressArea>
  </transition>
</template>
<script setup>
  import QuickSearch from '~/components/QuickSearch/QuickSearch.vue';
  import { QuickSearchStatus } from '~/common/utils/enum';
  import { useQuickSearchStore } from '~/stores/quickSearch';
  import { storeToRefs } from 'pinia';
  const quickSearchStore = useQuickSearchStore();
  const QuickNote = defineAsyncComponent(() => import('~/components/QuickSearch/QuickNote.vue'));
  const ProgressArea = defineAsyncComponent(() => import('~/components/QuickSearch/ProgressArea.vue'));
  const CaseResult = defineAsyncComponent(() => import('~/components/QuickSearch/CaseResult.vue'));
  const { currentQuickSearchStatus, hasTransition } = storeToRefs(quickSearchStore);
  const transitionName = computed(() => (hasTransition.value ? 'slide-fade-delay' : ''));
  const props = defineProps({
    onExitCallback: {
      type: Function,
      required: false,
      default: () => console.log('exit quick search!')
    }
  });
</script>
<style>
  .slide-fade-delay-enter-active {
    transition: all 0.5s ease-in-out;
    transition-delay: 0.4s;
  }

  .slide-fade-delay-leave-active {
    /* display: none; */
    /* transition: none; */
    /* transition-delay: 10s; */
  }

  .slide-fade-delay-enter-from {
    transform: translateX(500px);
    transition: all 0.5s ease-in-out;
    transition-delay: 0.4s;
  }

  .slide-fade-delay-leave-to {
    /* transform: translateX(-380px); */
    /* transition: none; */
    /* display: none; */
  }
</style>