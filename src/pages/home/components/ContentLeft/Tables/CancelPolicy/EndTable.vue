<template>
  <table class="table is-striped-odd is-fullwidth" id="dataTable">
    <StickyThead>
      <tr class="scroll-fix">
        <SortingThead sortKey="APLY_NO" :currentSortKey="sortName" :isSortDesc="isSortDesc" :onClickSort="setSort">
          <cathay-translate code="Component_EndTable_001" />
        </SortingThead>
        <SortingThead sortKey="POL_NUM" :currentSortKey="sortName" :isSortDesc="isSortDesc" :onClickSort="setSort">
          <cathay-translate code="Component_EndTable_002" />
        </SortingThead>
        <th><cathay-translate code="Component_EndTable_003" /></th>
        <SortingThead sortKey="CLOSE_DATE" :currentSortKey="sortName" :isSortDesc="isSortDesc" :onClickSort="setSort">
          <cathay-translate code="Component_EndTable_004" />
        </SortingThead>
        <SortingThead sortKey="END_DATE" :currentSortKey="sortName" :isSortDesc="isSortDesc" :onClickSort="setSort">
          <cathay-translate code="Component_EndTable_005" />
        </SortingThead>
        <th><cathay-translate code="Component_EndTable_006" /></th>
      </tr>
    </StickyThead>
    <tbody>
      <tr v-for="end in endData" :key="end.APLY_NO">
        <td style="width: 80px">
          <a href="#" @click.stop.prevent="onClickApplyNo(end.APLY_NO)">{{ end.APLY_NO }}</a>
          <br />
          {{ language.translate('Common_Service_Center') + ':' + end.ACCEPT_DIV_NAME }}
        </td>
        <td class="limit-width" width="115">
          <EllipseTippy :content="end.POL_NUM" class="font-eudc" displayBlock>{{ end.POL_NUM }}</EllipseTippy>
        </td>
        <td width="106" class="limit-width w-105">
          <EllipseTippy :content="end.INSUR_TYPE" class="font-eudc" displayBlock>{{ end.INSUR_TYPE }}</EllipseTippy>
        </td>
        <td width="125">{{ getVNDate(end.CLOSE_DATE) }}</td>
        <td width="125">{{ getVNDate(end.END_DATE) }}</td>
        <td class="has-left-border limit-width" width="154" style="max-width: 154px">
          <EllipseTippy v-if="end.PIN_MEMO != ''" :content="end.PIN_MEMO">
            <p class="note font-eudc">
              {{ end.PIN_MEMO }}
            </p>
          </EllipseTippy>
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script setup>
  // 解除契約-待結案
  import EllipseTippy from '~/components/EllipseTippy.vue';
  import SortingThead from '~/components/SortingThead.vue';
  import useMoment from '~/composables/useMoment';
  import useTableSort from '~/composables/useTableSort';
  import StickyThead from '../../StickyThead.vue';
  import { useLanguageStore } from '~/stores/language';

  const language = useLanguageStore();
  const props = defineProps({
    cnclAprv_mapList: {
      type: Array,
      required: true,
      default: []
    }
  });

  const endData = reactive(props.cnclAprv_mapList);
  const { sortName, isSortDesc, setSort } = useTableSort(endData);
  const { getVNDate } = useMoment();

  const onClickApplyNo = (applyNo) => {
    window.open(`/servlet/HttpDispatcher/AAB4_0205/prompt?PROCESS_NUM=${applyNo}`);
  };
</script>
<style></style>
