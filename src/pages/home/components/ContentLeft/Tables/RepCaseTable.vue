<template>
  <div class="block table-block">
    <div class="block-title-outside scroll-fix">
      <div class="table-title-tab">
        <div class="has-text-weight-normal mr-3">
          <cathay-translate code="Component_RepCaseTable_001" /> <span>({{ getTotalCount }})</span>
        </div>
        <div
          :class="{ 'is-active': currentRepCaseForType === CaseTablesType.RepCase.SignRep }"
          @click="switchTab(CaseTablesType.RepCase.SignRep)"
        >
          <cathay-translate code="Component_RepCaseTable_002" /> <span>({{ getCounts.SignRep }})</span>
        </div>
      </div>
    </div>
    <div class="block-content">
      <keep-alive>
        <component :is="activecurrentRepCaseForTable" v-bind="toRepCasetData"></component>
      </keep-alive>
    </div>
  </div>
</template>
<script setup>
  import SignRepTable from './RepCase/SignRepTable.vue';
  import { CaseTablesType } from '~/common/utils/enum';
  import useCaseTable from '~/composables/useCaseTable';
  import { useHomeStore } from '~/stores/home';
  import { storeToRefs } from 'pinia';
  import { onDeactivated } from 'vue';

  // 使用者選擇的待簽收類型
  const { currentRepCaseForType } = storeToRefs(useHomeStore());

  // 根據使用者選擇的渲染不同Table
  const activecurrentRepCaseForTable = computed(() => {
    switch (currentRepCaseForType.value) {
      case CaseTablesType.RepCase.SignRep:
        return SignRepTable;
      default:
        break;
    }
  });

  // 切換頁籤
  const switchTab = (type) => {
    currentRepCaseForType.value = type;
  };

  // 呼叫API取得資料
  const toRepCasetData = await useCaseTable();
  // 待簽收個別的數量
  const getCounts = reactive({
    SignRep: toRepCasetData.signRep_mapList.length
  });

  // 待簽收總數量
  const getTotalCount = computed(() => getCounts.SignRep);

  onDeactivated(() => {
    // 還原為預設值
    currentRepCaseForType.value = CaseTablesType.RepCase.SignRep;
  });
</script>
