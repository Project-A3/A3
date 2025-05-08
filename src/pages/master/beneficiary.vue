<template>
  <div class='page-beneficiary'>
    <main>
      <section id="mainSection" :class="{ 'cursor-not-allowed': isReadonly }" style="width: 100%">
        <div :class="{ 'is-readonly': isReadonly }">
          <!-- 基本資料 -->
          <BasicInfo :basicData="basicData" :applyNo="applyNo"></BasicInfo>
          <!-- 受益人分配資料區塊 -->
          <PaymentAllocationArea></PaymentAllocationArea>
        </div>
        <div class="button-scroll-to-top" style="left: 50%">回到頂部</div>
      </section>
    </main>
  </div>
</template>
<script setup>
  import initialUI from '~/common/ui/initial';
  import initMasterUI from '../../common/ui/master';
  import useSwal from '~/composables/useSwal';
  import BasicInfo from '~/components/BasicInfo.vue';
  import PaymentAllocationArea from './components/Beneficiary/PaymentAllocationArea.vue';
  import { isEmpty } from 'lodash-es';
  import { storeToRefs } from 'pinia';
  import { useApplyStore } from '~/stores/apply';
  import { useFooterStore } from '~/stores/footer';
  import { useBeneficiaryStore } from '~/stores/beneficiary';

  const { $swal } = useSwal();
  const applyStore = useApplyStore();
  const footerStore = useFooterStore();
  const beneficiaryStore = useBeneficiaryStore();
  const router = useRouter();
  const route = useRoute();
  const { basicData } = storeToRefs(applyStore);

  onActivated(() => {
    initialUI();
    initMasterUI();
  });

  // 是否readonly
  const isReadonly = ref(false);
  // 查詢的受理編號
  const applyNo = route.query?.q;

  console.log(applyNo);
  if (isEmpty(applyNo)) {
    console.error('網址錯誤，沒有受理編號!');
    router.push({ name: 'all' });
    // throw '網址錯誤，沒有受理編號!';
  }

  provide('ApplyNo', applyNo);
  provide('IsReadonly', isReadonly);

  const isLoading = inject('isLoading');

  try {
    isLoading.value = true;

    // 取得登入者是否為覆核人員 or 主管
    let reviewerInfo = await footerStore.getReviewerInfo(applyNo);
    applyStore.reviewerInfo = reviewerInfo;
    // 如果不能編輯，把readonly設true
    isReadonly.value = reviewerInfo.isReviewer;

    // 呼叫API取得申請資料
    let { errorMessage, warningMessage } = await applyStore.getAllData(applyNo);
    if (!isEmpty(errorMessage.trim())) throw errorMessage;
    else if (!isEmpty(warningMessage)) $swal.warning(warningMessage);

    //STEP_STS === '1' && (IS_ASSIGNED === 'Y' || IS_ASSIGNED_BA === 'Y')
    //=>成立參數帶Y
    //=>否則參數帶N
    let message = await beneficiaryStore.getAllData(applyNo, !isReadonly.value ? 'Y' : 'N');
    if (!isEmpty(message.trim())) $swal.fail(message);
    
    isLoading.value = false;

    router.replace({
      params: { page: 'beneficiary' },
      query: { q: applyNo, readonly: reviewerInfo.STEP_STS }
    });
  } catch (e) {
    $swal.fail(e);
    // 失敗返回個人化首頁
    router.replace({ name: 'home' });
  } finally {
    isLoading.value = false;
  }
</script>
<style lang="scss"></style>
