<template>
  <table class="table is-striped-odd is-fullwidth" id="dataTable">
    <StickyThead>
      <tr class="scroll-fix">
        <SortingThead sortKey="APLY_NO" :currentSortKey="sortName" :isSortDesc="isSortDesc" :onClickSort="setSort">
          <cathay-translate code="Component_SignNoteCommentTable_001" />
        </SortingThead>
        <SortingThead sortKey="NOTE_NUM" :currentSortKey="sortName" :isSortDesc="isSortDesc" :onClickSort="setSort">
          <cathay-translate code="Component_SignNoteCommentTable_002" />
        </SortingThead>
        <SortingThead sortKey="NOTE_DATE" :currentSortKey="sortName" :isSortDesc="isSortDesc" :onClickSort="setSort">
          <cathay-translate code="Component_SignNoteCommentTable_003" />
        </SortingThead>
        <th><cathay-translate code="Component_SignNoteCommentTable_004" /></th>
        <th><cathay-translate code="Component_SignNoteCommentTable_005" /></th>
        <SortingThead sortKey="NOTE_DIV_SHORT_NAME" :currentSortKey="sortName" :isSortDesc="isSortDesc" :onClickSort="setSort">
          <cathay-translate code="Component_SignNoteCommentTable_006" />
        </SortingThead>
        <SortingThead sortKey="NOTE_REPLY_EMP_NAME" :currentSortKey="sortName" :isSortDesc="isSortDesc" :onClickSort="setSort">
          <cathay-translate code="Component_SignNoteCommentTable_007" />
        </SortingThead>
        <SortingThead sortKey="NOTE_REPLY_DATE" :currentSortKey="sortName" :isSortDesc="isSortDesc" :onClickSort="setSort">
          <cathay-translate code="Component_SignNoteCommentTable_008" />
        </SortingThead>
      </tr>
    </StickyThead>
    <tbody>
      <tr v-for="notes in notesData" :key="notes.NOTE_NUM">
        <td style="width: 80px">
          {{ notes.APLY_NO }}
          <br />
          {{ language.translate('Common_Service_Center') + ':' + notes.ACCEPT_DIV_NAME }}
        </td>
        <td width="135">
          {{ notes.NOTE_NUM }}
        </td>
        <td width="135">
          {{ getVNDate(notes.NOTE_DATE) }}
        </td>
        <td width="150">
          {{ notes.NOTE_EMP_NAME }}
        </td>
        <td width="400">
          <a href="#" @click.stop.prevent="onClickNoteTitle(notes)">
            {{ notes.NOTE_TITLE }}
          </a>
        </td>
        <td width="200">
          {{ notes.NOTE_DIV_SHORT_NAME }}
        </td>
        <td width="135">
          {{ notes.NOTE_REPLY_EMP_NAME }}
        </td>
        <td width="135">
          {{ getVNDate(notes.NOTE_REPLY_DATE) }}
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script setup>
  // 照會意見 照會覆核
  import SortingThead from '~/components/SortingThead.vue';
  import useMoment from '~/composables/useMoment';
  import StickyThead from '../../StickyThead.vue';
  import { useLanguageStore } from '~/stores/language';
  
  const language = useLanguageStore();
  const props = defineProps({
    signNotes_mapList: {
      type: Array,
      required: true,
      default: []
    }
  });

  const notesData = reactive(props.signNotes_mapList);

  const { getVNDate } = useMoment();

  const onClickNoteTitle = (notes) => {
    window.open(`/servlet/HttpDispatcher/AAB4_0401/prompt?PROCESS_NUM=${notes.APLY_NO}&NOTE_NUM=${notes.NOTE_NUM}`);
  };
</script>
