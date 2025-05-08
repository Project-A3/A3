<template>
  <div class="block table-block">
    <div class="block-title-outside scroll-fix">
      <div class="table-title-tab">
        <div class="has-text-weight-normal mr-3">
          <cathay-translate code="Component_NoteCommentTable_001" /> <span>({{ getTotalCount }})</span>
        </div>
        <div
          :class="{ 'is-active': currentNoteCommentForType === CaseTablesType.NoteComment.AprvNotes }"
          @click="switchTab(CaseTablesType.NoteComment.AprvNotes)"
        >
          <cathay-translate code="Component_NoteCommentTable_002" /> <span>({{ getCounts.AprvNotes }})</span>
        </div>
        <div
          :class="{ 'is-active': currentNoteCommentForType === CaseTablesType.NoteComment.SignNotes }"
          @click="switchTab( CaseTablesType.NoteComment.SignNotes)"
        >
          <cathay-translate code="Component_NoteCommentTable_003" /> <span>({{ getCounts.SignNotes }})</span>
        </div>
      </div>
    </div>
    <div class="block-content">
      <keep-alive>
        <component :is="activecurrentSurveyCaseForTable" v-bind="toNoteCommentData"></component>
      </keep-alive>
    </div>
  </div>
</template>
<script setup>
  import AprvNoteCommentTable from './NoteComment/AprvNoteCommentTable.vue';
  import SingNoteCommentTable from './NoteComment/SignNoteCommentTable.vue';
  import { CaseTablesType } from '~/common/utils/enum';
  import useCaseTable from '~/composables/useCaseTable';
  import { useHomeStore } from '~/stores/home';
  import { storeToRefs } from 'pinia';
  import { onDeactivated } from 'vue';

  // 使用者選擇的待簽收類型
  const { currentNoteCommentForType } = storeToRefs(useHomeStore());

  // 根據使用者選擇的渲染不同Table
  const activecurrentSurveyCaseForTable = computed(() => {
    switch (currentNoteCommentForType.value) {
      case CaseTablesType.NoteComment.AprvNotes:
        return AprvNoteCommentTable;
      case CaseTablesType.NoteComment.SignNotes:
        return SingNoteCommentTable;
      default:
        break;
    }
  });

  // 切換頁籤
  const switchTab = (type) => {
    currentNoteCommentForType.value = type;
  };

  // 呼叫API取得資料
  const toNoteCommentData = await useCaseTable();
  // 待簽收個別的數量
  const getCounts = reactive({
    AprvNotes: toNoteCommentData.aprvNotes_mapList.length,
    SignNotes: toNoteCommentData.signNotes_mapList.length
  });

  // 待簽收總數量
  const getTotalCount = computed(() => getCounts.AprvNotes + getCounts.SignNotes);

  onDeactivated(() => {
    // 還原為預設值
    currentNoteCommentForType.value = CaseTablesType.NoteComment.AprvNotes;
  });
</script>
