<template>
  <div class="block table-block">
    <div class="block-title-outside scroll-fix">
      <div class="table-title-tab">
        <div class="has-text-weight-normal mr-3">
          <cathay-translate code="Component_ToBeCmrTable_001" /> <span>({{ getTotalCount }})</span>
        </div>
        <div
          :class="{ 'is-active': currentToBeCrmType === WaitApproveType.ToBeCmr.Cathay }"
          @click="switchTab(WaitApproveType.ToBeCmr.Cathay)"
        >
          <cathay-translate code="Component_ToBeCmrTable_002" /> <span>({{ getCounts.cathay }})</span>
        </div>
        <div
          :class="{ 'is-active': currentToBeCrmType === WaitApproveType.ToBeCmr.Pcv }"
          @click="switchTab(WaitApproveType.ToBeCmr.Pcv)"
        >
          <cathay-translate code="Component_ToBeCmrTable_003" /> <span>({{ getCounts.pcv }})</span>
        </div>
        <div
          :class="{ 'is-active': currentToBeCrmType === WaitApproveType.ToBeCmr.Rep }"
          @click="switchTab(WaitApproveType.ToBeCmr.Rep)"
        >
          <cathay-translate code="Component_ToBeCmrTable_004" /> <span>({{ getCounts.rep }})</span>
        </div>
      </div>
    </div>
    <div class="block-content">
      <keep-alive>
        <component :is="activeToBeCmrTable" v-bind="cmrData"></component>
      </keep-alive>
    </div>
  </div>
</template>
<script setup>
  import cathayApprTable from './ToBeCmr/cathayApprTable.vue';
  import pcvApprTable from './ToBeCmr/pcvApprTable.vue';
  import repApprTable from './ToBeCmr/repApprTable.vue';
  import useCaseTable from '~/composables/useCaseTable';
  import { WaitApproveType } from '~/common/utils/enum';
  import { useHomeStore } from '~/stores/home';
  import { storeToRefs } from 'pinia';
  import { onDeactivated } from 'vue';

  // 使用者選擇的CMR件類型
  const { currentToBeCrmType } = storeToRefs(useHomeStore());

  // 根據使用者選擇的渲染不同Table
  const activeToBeCmrTable = computed(() => {
    switch (currentToBeCrmType.value) {
      case WaitApproveType.ToBeCmr.Cathay:
        return cathayApprTable;
      case WaitApproveType.ToBeCmr.Pcv:
        return pcvApprTable;
      case WaitApproveType.ToBeCmr.Rep:
        return repApprTable;
      default:
        break;
    }
  });

  // 切換頁籤
  const switchTab = (type) => {
    currentToBeCrmType.value = type;
  };

  // 呼叫API取得資料
  const cmrData = await useCaseTable();

  // 待CMR件個別的數量
  const getCounts = reactive({
    cathay: cmrData.cmrCathay_mapList.length,
    pcv: cmrData.cmrPcv_mapList.length,
    rep: cmrData.cmrRep_mapList.length
  });

  // CMR件總數量
  const getTotalCount = computed(() => getCounts.cathay + getCounts.pcv + getCounts.rep);

  // 還原為預設值
  onDeactivated(() => {
    currentToBeCrmType.value = WaitApproveType.ToBeCmr.Cathay;
  }
);
</script>
