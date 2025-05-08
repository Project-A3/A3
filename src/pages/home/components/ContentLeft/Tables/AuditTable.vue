<template>
  <div class="block table-block">
    <div class="block-title-outside scroll-fix">
      <div class="table-title-tab">
        <div class="has-text-weight-normal mr-3">
          待查核件 <span>({{ getTotalCount }})</span>
        </div>
        <div
          :class="{ 'is-active': currentAuditType === CaseTablesType.Audit.NoAprv }"
          @click="switchTab(CaseTablesType.Audit.NoAprv)"
        >
          案件免覆核查核件 <span>({{ getCounts.noAprv }})</span>
        </div>
        <div
          :class="{ 'is-active': currentAuditType === CaseTablesType.Audit.AutoClam }"
          @click="switchTab(CaseTablesType.Audit.AutoClam)"
        >
          全自動核賠查核件 <span>({{ getCounts.autoClam }})</span>
        </div>
        <div
          :class="{ 'is-active': currentAuditType === CaseTablesType.Audit.SemiAutoClam }"
          @click="switchTab(CaseTablesType.Audit.SemiAutoClam)"
        >
          擬人自動核賠案件 <span>({{ getCounts.semiAutoClam }})</span>
        </div>
      </div>
    </div>
    <div class="block-content">
      <keep-alive>
        <component :is="activeAuditTable" v-bind="auditData"></component>
      </keep-alive>
    </div>
  </div>
</template>
<script setup>
  // 查核件表格
  import { CaseTablesType } from '~/common/utils/enum';
  import AutoClamTable from './Audit/AutoClamTable.vue';
  import NoAprvTable from './Audit/NoAprvTable.vue';
  import useCaseTable from '~/composables/useCaseTable';
  import SemiAutoClamTable from './Audit/SemiAutoClamTable.vue';

  // 使用者選擇的查核件類型
  const currentAuditType = ref(CaseTablesType.Audit.NoAprv);

  // 根據使用者選擇的渲染不同Table
  const activeAuditTable = computed(() => {
    console.log(currentAuditType.value);
    switch (currentAuditType.value) {
      case CaseTablesType.Audit.NoAprv:
        return NoAprvTable;
      case CaseTablesType.Audit.AutoClam:
        return AutoClamTable;
      case CaseTablesType.Audit.SemiAutoClam:
        return SemiAutoClamTable;
      default:
        break;
    }
  });

  // 切換頁籤
  const switchTab = (type) => {
    currentAuditType.value = type;
  };

  // 呼叫API取得資料
  const auditData = await useCaseTable();
  // console.log(auditData);
  // 解除契約個別的數量
  const getCounts = reactive({
    noAprv: auditData.checkNoAprv_mapList.length,
    autoClam: auditData.checkAutoClam_mapList.length,
    semiAutoClam: auditData.checkSemiAutoClam_mapList.length
  });

  // 解除契約總數量
  const getTotalCount = computed(() => getCounts.noAprv + getCounts.autoClam + getCounts.semiAutoClam);
</script>
<style lang="scss"></style>
