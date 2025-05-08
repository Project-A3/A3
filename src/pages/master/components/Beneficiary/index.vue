<template>
  <LifeCycleHook :onKeydownSave="saveData">
    <!-- First-Card (Case)-->
    <!-- 基本資料 -->
    <BasicInfo :basicData="basicData" :applyNo="props.applyNo"></BasicInfo>

    <!-- 受益人分配資料區塊 -->
    <PaymentAllocationArea></PaymentAllocationArea>

    <!-- 實支金額按鈕 -->
    <ActualAmountButton></ActualAmountButton>
  </LifeCycleHook>
</template>
<script>
  export default {
    name: 'Beneficiary',
    inheritAttrs: false,
    customOptions: {}
  };
</script>
<script setup>
  import LifeCycleHook from '~/components/LifeCycleHook.vue';
  import { storeToRefs } from 'pinia';
  import { useApplyStore } from '~/stores/apply';
  import { useFooterStore } from '~/stores/footer';
  import BasicInfo from '~/components/BasicInfo.vue';
  import ActualAmountButton from './ActualAmountButton.vue';
  import PaymentAllocationArea from './PaymentAllocationArea.vue';
  import useSwal from '~/composables/useSwal';
  import { cloneDeep, isEmpty } from 'lodash-es';
  import { useBeneficiaryStore } from '~/stores/beneficiary';

  const props = defineProps({
    applyNo: {
      type: String,
      required: true
    }
  });
  const { basicData } = storeToRefs(useApplyStore());
  const footerStore = useFooterStore();
  // 設定Footer資料
  footerStore.setFooterData({
    applyNo: props.applyNo,
    ocrId: basicData.value.OCR_ID,
    ocrName: basicData.value.OCR_NAME,
    lifeGropClfy: basicData.value.LIFE_GROP_CLFY,
    pageKey: 'beneficiary'
  });
  const { $swal } = useSwal();
  const beneficiaryStore = useBeneficiaryStore();
  beneficiaryStore.showLoading();
  const isReadonly = inject('IsReadonly');

  //STEP_STS === '1' && (IS_ASSIGNED === 'Y' || IS_ASSIGNED_BA === 'Y')
  //=>成立參數帶Y
  //=>否則參數帶N
  let message = await beneficiaryStore.getAllData(props.applyNo, !isReadonly.value ? 'Y' : 'N');
  beneficiaryStore.hideLoading();
  if (!isEmpty(message.trim())) $swal.fail(message);

  beneficiaryStore.isChkBeneficiary = 'Y';
  //#region 儲存相關
  // 儲存資料
  const saveData = async (hasCallback) => {
    // 檢核畫面上是否有錯誤，hacky先判斷有沒有error class
    const mainSection = document.getElementById('mainSection');
    if (mainSection.querySelector('img.error-message')) {
      $swal.warning('資料有誤，請確認資料無誤後再次送出');
      return false;
    }

    // 暫時只show console log
    console.log('click save button!');
    try {
      beneficiaryStore.showLoading();
      const saveResult = await beneficiaryStore.savePageData(props.applyNo);
      console.log(saveResult);
      if (!saveResult.IS_SUCCESS) throw saveResult.RTN_MSG;
      if (!hasCallback) {
        if(saveResult.RTN_CODE == '0') {
          $swal.success(saveResult.RTN_MSG);
        }
      }

      if (saveResult.RTN_CODE == '1') {
          beneficiaryStore.hideLoading();

          await $swal.getInstance().fire({
            icon: 'warning',
            title: saveResult.RTN_MSG,
            text: '',
            confirmButtonColor: '#6fba2a',
            confirmButtonText: '確定'
          });
      }
      // 更新儲存時間
      footerStore.setSaveTime({ trial: saveResult.CASE_FLOW_BTN_DT });
      // 更新原始資料
      beneficiaryStore.setUIData();
      beneficiaryStore.beforeSaveData = cloneDeep(beneficiaryStore.paymentAllocations);
      return true;
    } catch (e) {
      $swal.fail(e);
      console.error(e);
      return false;
    } finally {
      beneficiaryStore.hideLoading();
    }
  };
  //#endregion
</script>

<style lang="scss" scoped></style>
