<template>
  <div class="block table-block">
    <div class="block-title-outside scroll-fix">
      <div class="table-title-tab">
        <div class="has-text-weight-normal mr-3">
          {{ activeCancelPolicyTitle }}<span>({{ getTotalCount }})</span>
        </div>
        <div
          :class="{ 'is-active': currentCancelPolicyType === CaseTablesType.CancelPolicy.Decd }"
          @click="switchTab(CaseTablesType.CancelPolicy.Decd)"
        >
          <cathay-translate code="Component_CancelPolicyTable_002" />
          <span>({{ cancelPolicyData.cnclDecd_mapList.length }})</span>
        </div>
        <div
          :class="{ 'is-active': currentCancelPolicyType === CaseTablesType.CancelPolicy.End }"
          @click="switchTab(CaseTablesType.CancelPolicy.End)"
        >
          <cathay-translate code="Component_CancelPolicyTable_003" />
          <span>({{ cancelPolicyData.cnclAprv_mapList.length }})</span>
        </div>
      </div>
    </div>
    <div class="block-content">
      <keep-alive>
        <component :is="activeCancelPolicyTable" v-bind="cancelPolicyData"></component>
      </keep-alive>
    </div>
  </div>
</template>
<script setup>
  // 解除契約表格
  import { storeToRefs } from 'pinia';
  import { CaseTablesType, UserRoleEnum } from '~/common/utils/enum';
  import EndTable from './CancelPolicy/EndTable.vue';
  import DecdTable from './CancelPolicy/DecdTable.vue';
  import useCaseTable from '~/composables/useCaseTable';
  import { useHomeStore } from '~/stores/home';
  import { useLanguageStore } from '~/stores/language';
  const homeStore = useHomeStore();
  const language = useLanguageStore();
  const { userRole } = storeToRefs(homeStore);
  // 使用者選擇的解除契約類型
  const currentCancelPolicyType = ref(CaseTablesType.CancelPolicy.Decd);

  const activeCancelPolicyTitle = computed(() => {
    if ((userRole.value = UserRoleEnum.Decd)) {
      return language.translate('Component_CancelPolicyTable_004');
    } else if ((userRole.value = UserRoleEnum.Aprv)) {
      return language.translate('Component_CancelPolicyTable_001');
    }
  });

  // 根據使用者選擇的渲染不同Table
  const activeCancelPolicyTable = computed(() => {
    switch (currentCancelPolicyType.value) {
      case CaseTablesType.CancelPolicy.Decd:
        return DecdTable;
      case CaseTablesType.CancelPolicy.End:
        return EndTable;
      default:
        break;
    }
  });

  // 切換頁籤
  const switchTab = (type) => {
    currentCancelPolicyType.value = type;
  };

  // 呼叫API取得資料
  const data = await useCaseTable();
  const cancelPolicyData = reactive(data);

  // 解除契約總數量
  const getTotalCount = computed(() => cancelPolicyData.cnclDecd_mapList.length + cancelPolicyData.cnclAprv_mapList.length);
</script>
