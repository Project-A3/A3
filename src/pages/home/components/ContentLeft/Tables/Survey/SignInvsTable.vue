<template>
  <table class="table is-striped-odd is-fullwidth" id="dataTable">
    <StickyThead>
      <tr class="scroll-fix">
        <SortingThead sortKey="APLY_NO" :currentSortKey="sortName" :isSortDesc="isSortDesc" :onClickSort="setSort">
          <cathay-translate code="Component_SignInvsTable_001" />
        </SortingThead>
        <th><cathay-translate code="Component_SignInvsTable_002" /></th>
        <th><cathay-translate code="Component_SignInvsTable_003" /></th>
        <SortingThead sortKey="OCR_NAME" :currentSortKey="sortName" :isSortDesc="isSortDesc" :onClickSort="setSort">
          <cathay-translate code="Component_SignInvsTable_004" />
        </SortingThead>
        <SortingThead sortKey="CASE_DATE" :currentSortKey="sortName" :isSortDesc="isSortDesc" :onClickSort="setSort">
          <cathay-translate code="Component_SignInvsTable_005" />
        </SortingThead>
      </tr>
    </StickyThead>
    <tbody>
      <tr v-for="decd in decdData" :key="decd.APLY_NO">
        <td style="width: 80px">
          <a href="#" @click.stop.prevent="onClickApplyNo(decd.APLY_NO)"> {{ decd.APLY_NO }} </a>
          <br />
          {{ language.translate('Common_Service_Center') + ':' + decd.ACCEPT_DIV_NAME }}
        </td>
        <td width="125" class="has-left-border has-text-lefted">{{ language.translate('Common_SYS_NO_' + decd.SYS_NO) }}</td>
        <td width="330" class="has-left-border limit-width w-330">{{ (decd.REASON_CODE ? language.translate('Common_' + decd.REASON_CODE) : '')}}</td>
        <td width="106" class="limit-width w-105 pr-4">
          <EllipseTippy :content="decd.OCR_NAME" class="font-eudc" displayBlock>
            {{ decd.OCR_NAME }}
          </EllipseTippy>
        </td>
        <td width="120px" style="min-width: 120px">{{ getVNDate(decd.CASE_DATE) }}</td>
      </tr>
    </tbody>
  </table>
</template>
<script setup>
  // 調查件 交查覆核
  import EllipseTippy from '~/components/EllipseTippy.vue';
  import SortingThead from '~/components/SortingThead.vue';
  import useMoment from '~/composables/useMoment';
  import useTableSort from '~/composables/useTableSort';
  import StickyThead from '../../StickyThead.vue';
  import { useLanguageStore } from '~/stores/language';

  const language = useLanguageStore();
  const props = defineProps({
    signInvs_mapList: {
      type: Array,
      required: true,
      default: []
    }
  });

  const decdData = reactive(props.signInvs_mapList);

  const { getVNDate } = useMoment();

  const { sortName, isSortDesc, setSort } = useTableSort(decdData);
  const onClickApplyNo = (applyNo) => {
    window.open(`/servlet/HttpDispatcher/AHD0_2001/prompt?PROCESS_NUM=${applyNo}`);
  };
</script>
