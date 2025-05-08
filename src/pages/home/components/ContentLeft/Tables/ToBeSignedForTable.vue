<template>
  <div class="block table-block">
    <div class="block-title-outside scroll-fix">
      <div class="table-title-tab">
        <div class="has-text-weight-normal mr-3">
          <cathay-translate code="Component_ToBeSignedForTable_001" /> <span>({{ getTotalCount }})</span>
        </div>
        <div
          :class="{ 'is-active': currentToBeSignedForType === CaseTablesType.ToBeSignedFor.Rep }"
          @click="switchTab(CaseTablesType.ToBeSignedFor.Rep)"
        >
          <cathay-translate code="Component_ToBeSignedForTable_002" /> <span>({{ getCounts.rep }})</span>
        </div>
        <div
          :class="{ 'is-active': currentToBeSignedForType === CaseTablesType.ToBeSignedFor.Invs }"
          @click="switchTab(CaseTablesType.ToBeSignedFor.Invs)"
        >
          <cathay-translate code="Component_ToBeSignedForTable_003" /> <span>({{ getCounts.invs }})</span>
        </div>
        <div
          :class="{ 'is-active': currentToBeSignedForType === CaseTablesType.ToBeSignedFor.Notes }"
          @click="switchTab(CaseTablesType.ToBeSignedFor.Notes)"
        >
          <cathay-translate code="Component_ToBeSignedForTable_004" /> <span>({{ getCounts.notes }})</span>
        </div>
      </div>
    </div>
    <div class="block-content">
      <keep-alive>
        <component :is="activeToBeSignedForTable" v-bind="toBeSignedForData"></component>
      </keep-alive>
    </div>
  </div>
</template>
<script setup>
  import RepTable from './ToBeSignedFor/RepTable.vue';
  import InvsTable from './ToBeSignedFor/InvsTable.vue';
  import { CaseTablesType } from '~/common/utils/enum';
  import useCaseTable from '~/composables/useCaseTable';
  import { useHomeStore } from '~/stores/home';
  import { storeToRefs } from 'pinia';
  import { onDeactivated } from 'vue';
  import NotesTable from './ToBeSignedFor/NotesTable.vue';

  // 使用者選擇的待簽收類型
  const { currentToBeSignedForType } = storeToRefs(useHomeStore());

  // 根據使用者選擇的渲染不同Table
  const activeToBeSignedForTable = computed(() => {
    switch (currentToBeSignedForType.value) {
      case CaseTablesType.ToBeSignedFor.Rep:
        return RepTable;
      case CaseTablesType.ToBeSignedFor.Invs:
        return InvsTable;
      case CaseTablesType.ToBeSignedFor.Notes:
        return NotesTable;
      default:
        break;
    }
  });

  // 切換頁籤
  const switchTab = (type) => {
    currentToBeSignedForType.value = type;
  };

  // 呼叫API取得資料
  const toBeSignedForData = await useCaseTable();
  // 待簽收個別的數量
  const getCounts = reactive({
    rep: toBeSignedForData.signRep_mapList.length,
    invs: toBeSignedForData.signInvs_mapList.length,
    notes: toBeSignedForData.signNotes_mapList.length
  });

  // 待簽收總數量
  const getTotalCount = computed(() => getCounts.rep + getCounts.invs + getCounts.notes);

  onDeactivated(() => {
    // 還原為預設值
    currentToBeSignedForType.value = CaseTablesType.ToBeSignedFor.Rep;
  });
</script>
