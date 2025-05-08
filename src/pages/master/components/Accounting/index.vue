<template>
  <LifeCycleHook :onKeydownSave="saveData">
    <!-- 基本資料 -->
    <BasicInfo :basicData="basicData" :applyNo="props.applyNo"></BasicInfo>

    <!-- 核付項目 -->
    <PayItemArea :payItems="payItemsData"></PayItemArea>

    <!-- 爭議案件 -->
    <DisputedCasesArea :applyNo="props.applyNo"></DisputedCasesArea>

    <!-- 試算訊息 -->
    <CalculateMessageArea :messages="calcMesgsData.MESSAGES" :applyNo="props.applyNo"></CalculateMessageArea>

    <!-- 暖心服務話術 -->
    <!-- <WarmServiceWordArea></WarmServiceWordArea> -->
  </LifeCycleHook>
</template>
<script>
  export default {
    name: 'Accounting',
    inheritAttrs: false,
    customOptions: {}
  };
</script>
<script setup>
  import { storeToRefs } from 'pinia';
  import BasicInfo from '~/components/BasicInfo.vue';
  import { useApplyStore } from '~/stores/apply';
  import LifeCycleHook from '~/components/LifeCycleHook.vue';
  import { useFooterStore } from '~/stores/footer';
  import { useAccountingStore } from '~/stores/accounting';
  import PayItemArea from './PayItemArea.vue';
  import CalculateMessageArea from './CalculateMessageArea.vue';
  import WarmServiceWordArea from './WarmServiceWordArea.vue';
  import DisputedCasesArea from './DisputedCases.vue';
  import useSwal from '~/composables/useSwal';
  import { pausableWatch, watchOnce } from '@vueuse/core';

  const props = defineProps({
    applyNo: {
      type: String,
      required: true
    }
  });

  const { $swal } = useSwal();
  const applyStore = useApplyStore();
  const { basicData } = storeToRefs(applyStore);
  const footerStore = useFooterStore();
  // 設定Footer資料
  footerStore.setFooterData({
    applyNo: props.applyNo,
    ocrId: basicData.value.OCR_ID,
    ocrName: basicData.value.OCR_NAME,
    lifeGropClfy: basicData.value.LIFE_GROP_CLFY,
    pageKey: 'accounting'
  });

  // 取得核算結果資料
  const accountingStore = useAccountingStore();
  accountingStore.showLoading();

  accountingStore
    .getAllData(props.applyNo)
    .then((resp) => {
      if (resp.message.trim() !== '') {
        resp.isSuccess ? $swal.warning(resp.message) : $swal.fail(resp.message);
      }
      accountingStore.hideLoading();
    })
    .catch((e) => {
      $swal.fail(e);
      accountingStore.hideLoading();
    });

  const { payItemsData, calcMesgsData, sprData, isPageChanged, isDispChanged } = storeToRefs(accountingStore);
 
  //#region 儲存相關
  // 監聽頁面是否變更過
  const { stop, pause, resume } = pausableWatch(
    [payItemsData, sprData],
    (v) => {
      isPageChanged.value = true;
      pause();
    },
    { deep: true }
  );
  
  // 儲存資料
  const saveData = async (hasCallback) => {
    if (accountingStore.totalAmount.payResult < 0) {
       $swal.warning('總給付金額不得為負項，請調整試算');
      return false;
    }

    if (accountingStore.isTopLimit) {
       $swal.warning(accountingStore.topLimitMsg);
      return false;
    }

    // 暫時只show console log
    console.log('click save button!');
    try {
      accountingStore.showLoading();
      const saveResult = await accountingStore.savePageData(props.applyNo);
      console.log(saveResult);
      if (!saveResult.IS_SUCCESS) throw saveResult.RTN_MSG;
      if (!hasCallback) $swal.success(saveResult.RTN_MSG);
      // 更新儲存時間
      footerStore.setSaveTime({ trial: saveResult.CASE_FLOW_BTN_DT });
      isPageChanged.value = false;
      isDispChanged.value = false;
      resume();
      return true;
    } catch (e) {
      $swal.fail(e);
      console.error(e);
      return false;
    } finally {
      accountingStore.hideLoading();
    }
  };
  //#endregion
</script>

<style lang="scss" scoped></style>
