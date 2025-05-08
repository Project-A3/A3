<template>
  <div :class="[`page-${currentActiveTab.toLowerCase()}`]">
    <Header :currentActiveTab="currentActiveTab"></Header>
    <main>
      <section id="mainSection" :class="{ 'cursor-not-allowed': isReadonly }">
        <div :class="{ 'is-readonly': isReadonly }">
          <component :is="activeComponent" v-bind="sendToProps"></component>
          <MainFooter :readonly="isReadonly"></MainFooter>
        </div>
        <div class="button-scroll-to-top"><cathay-translate code="Common_GO_TOP" /></div>
      </section>
      <aside
        class="overflow-auto"
        draggable="false"
        :style="asideState === AsideState.QuickSearch ? 'padding: 17px 12px 88px 18px;' : ''"
      >
        <QuickSearchWrapper
          v-if="asideState === AsideState.QuickSearch"
          :onExitCallback="onExitSearchCallback"
        ></QuickSearchWrapper>
        <DecisionWrapper v-show="asideState === AsideState.Decision"></DecisionWrapper>
      </aside>
      <div class="button-scroll-to-top is-in-aside">回到頂部</div>
      <div class="button-drag decision-dragger">
        <img src="/src/assets/images/btn-drag.svg" alt="DRAG" />
      </div>
    </main>
    <AsideFooter></AsideFooter>
    <ModalContainer></ModalContainer>
  </div>
</template>
<script setup>
  import Header from '~/components/Header/Header.vue';
  import Overview from './components/Overview/index.vue';
  import Apply from './components/Apply/index.vue';
  import Accounting from './components/Accounting/index.vue';
  import Beneficiary from './components/Beneficiary/index.vue';
  import { isEmpty, toUpper } from 'lodash-es';
  import ModalContainer from '~/components/ModalContainer.vue';
  import AsideFooter from '~/components/Footer/AsideFooter.vue';
  import MainFooter from '~/components/Footer/MainFooter.vue';
  import QuickSearchWrapper from '~/components/QuickSearch/QuickSearchWrapper.vue';
  import { AsideState } from '~/common/utils/enum';
  import initMasterUI from '../../common/ui/master';
  import DecisionWrapper from '~/components/Decision/DecisionWrapper.vue';
  import { useApplyStore } from '~/stores/apply';
  import useSwal from '~/composables/useSwal';
  import { useFooterStore } from '~/stores/footer';
  import { useQuickSearchStore } from '~/stores/quickSearch';
  import { useDecisionStore } from '~/stores/decision';

  const { $swal } = useSwal();
  const applyStore = useApplyStore();
  const footerStore = useFooterStore();
  const decisionStore = useDecisionStore();
  console.log('in the page component');
  // reset quicksearchStore，以免首頁有搜尋過
  useQuickSearchStore().$reset();
  onActivated(() => {
    initMasterUI();
  });

  const activeComponent = shallowRef(null);
  const router = useRouter();
  const route = useRoute();
  // 目前是哪一頁
  let page = route.params.page;
  // 是否readonly
  const isReadonly = ref(false);
  // 查詢的受理編號
  const applyNo = route.query?.q;
  // 將受理編號傳進component
  const sendToProps = { applyNo };
  console.log(page);
  console.log(applyNo);
  if (isEmpty(applyNo)) {
    console.error('網址錯誤，沒有受理編號!');
    router.push({ name: 'all' });
    // throw '網址錯誤，沒有受理編號!';
  }
  const changeComponent = (p) => {
    switch (p) {
      case 'overview':
        activeComponent.value = Overview;
        break;
      case 'apply':
        activeComponent.value = Apply;
        break;
      case 'accounting':
        activeComponent.value = Accounting;
        break;
      case 'beneficiary':
        activeComponent.value = Beneficiary;
        break;
      default:
        router.push({ name: 'all' });
        break;
    }
  };
  const currentActiveTab = ref(toUpper(page));
  const asideState = ref(AsideState.Decision);

  provide('AsideState', asideState);
  provide('ApplyNo', applyNo);
  provide('IsReadonly', isReadonly);

  // 取得儲存時間
  footerStore.getSaveTime(applyNo);

  const isLoading = inject('isLoading');

  try {
    isLoading.value = true;
    // 取得登入者是否為覆核人員 or 主管
    let reviewerInfo = await footerStore.getReviewerInfo(applyNo);
    applyStore.reviewerInfo = reviewerInfo;
    // 呼叫API取得申請資料
    let { errorMessage, warningMessage } = await applyStore.getAllData(applyNo);
    if (!isEmpty(errorMessage.trim())) throw message;
    else if (!isEmpty(warningMessage)) $swal.warning(warningMessage);
    isLoading.value = false;
    // 如果不能編輯，把readonly設true
    isReadonly.value = reviewerInfo.isReviewer;

    // 如果STEP_STS是2，要開啟核算結果
    if (reviewerInfo.STEP_STS === '2') {
      currentActiveTab.value = 'ACCOUNTING';
      page = 'accounting';
      router.replace({
        params: { page: 'accounting' },
        query: { q: applyNo, readonly: reviewerInfo.STEP_STS }
      });
    }
  } catch (e) {
    $swal.fail(e);
    // 失敗返回個人化首頁
    router.replace({ name: 'home' });
  } finally {
    isLoading.value = false;
  }

  // 置換Component
  changeComponent(page);

  // 監聽路由變化切換tab
  watch(
    () => route.params.page,
    async (params) => {
      if (route.name === 'master-page') {
        console.log(params);
        console.log(page);
        if (page !== params) {
          changeComponent(params);
          page = params;
          currentActiveTab.value = toUpper(page);
        }
      }
    }
  );

  // 監聽是否disable整頁
  // watch(
  //   () => route.query?.readonly,
  //   async (readonly) => {
  //     isReadonly.value = readonly >= 0;
  //   }
  //   // { immediate: true }
  // );

  const onExitSearchCallback = () => {
    asideState.value = AsideState.Decision;
  };

  // 於覆核如擬後立即關閉視窗卡控提示訊息
  const onBeforeUnload = (event) => {
    if(decisionStore.enableBeforeunload) {
      event.preventDefault()      
      event.returnValue = ''    
    }  
  };

  onMounted(() => {
    window.addEventListener('beforeunload', onBeforeUnload) 
  });

  onBeforeUnmount(() => {
    window.removeEventListener('beforeunload', onBeforeUnload);
  });
</script>
<style lang="scss"></style>
