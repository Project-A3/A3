<template>
  <BaseDropdown
    ref="refDropdown"
    class="height-limit is-outline sign-level"
    :options="options"
    :onSelected="onDropdownSelected"
  ></BaseDropdown>
</template>

<script setup>
  import { useAccountingStore } from '~/stores/accounting';
  import { useDecisionStore } from '~/stores/decision';
  import BaseDropdown from '~/components/BaseDropdown.vue';
  import useSwal from '~/composables/useSwal';
  import { SignLevel } from '~/common/utils/enum';
  const { $swal } = useSwal();
  const decisionStore = useDecisionStore();
  const refDropdown = ref(null);
  // 預設SIGN_LVL
  decisionStore.currentSelectedSignLevel = decisionStore.signInitData.SIGN_LVL;
  // 副總經理(含)以上的層級檢核僅提示訊息
  if (decisionStore.signInitData.SYS_SIGN_LVL_ORI > '3') {
    $swal.info(`本件案件簽呈至少需至【${SignLevel.getChinese(decisionStore.signInitData.SYS_SIGN_LVL_ORI)}】，請確認是否上簽電子公文。`);
  }
  const options = reactive(
    decisionStore.signInitData.SIGN_LVL_LIST.map((e) => ({
      name: e.SIGN_LVL_NAME,
      value: e.SIGN_LVL_CODE,
      selected: decisionStore.signInitData.SIGN_LVL === e.SIGN_LVL_CODE
    }))
  );
  options.unshift({
    name: '請選擇簽核層級',
    value: '',
    disabled: true,
    selected: !decisionStore.signInitData.SIGN_LVL
  });

  const onDropdownSelected = (value) => {
    // 若SYS_SIGN_LVL有值，須檢核簽核層級選擇不可低於SYS_SIGN_LVL，ex. SYS_SIGN_LVL = 3，但畫面簽核層級選擇1 or 2，跳出訊息：”本件案件簽呈至少需至【協理】。
    if (decisionStore.signInitData.SYS_SIGN_LVL && value < decisionStore.signInitData.SYS_SIGN_LVL) {
      if (decisionStore.signInitData.SYS_SIGN_LVL_ORI > '3') {
        $swal.info(`本件案件簽呈至少需至【${SignLevel.getChinese(decisionStore.signInitData.SYS_SIGN_LVL_ORI)}】，請確認是否上簽電子公文。系統應簽呈至【協理】。`  );
      }else{
        $swal.info(`本件案件簽呈至少需至【${SignLevel.getChinese(decisionStore.signInitData.SYS_SIGN_LVL_ORI)}】`  );
      }
    }
    decisionStore.currentSelectedSignLevel = value;
  };
</script>

<style lang="scss" scoped></style>
