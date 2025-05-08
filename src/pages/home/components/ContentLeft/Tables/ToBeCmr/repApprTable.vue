<template>
    <table class="table is-striped-odd is-fullwidth" id="dataTable">
      <StickyThead>
        <tr class="scroll-fix has-text-centered">
          <th>
            <cathay-translate code="Component_repApprTable_001" />
          </th>
          <SortingThead sortKey="APLY_NO" :currentSortKey="sortName" :isSortDesc="isSortDesc" :onClickSort="setSort">
            <cathay-translate code="Component_repApprTable_002" />
          </SortingThead>
          <th>
            <cathay-translate code="Component_repApprTable_003" />
          </th>
          <th>
            <cathay-translate code="Component_repApprTable_004" />
          </th>
          <th>
            <cathay-translate code="Component_repApprTable_005" />
          </th>
          <SortingThead sortKey="RESOLVE_STATUS" :currentSortKey="sortName" :isSortDesc="isSortDesc" :onClickSort="setSort">
            <cathay-translate code="Component_repApprTable_006" />
          </SortingThead>
        </tr>
      </StickyThead>
      <tbody>
        <tr v-for="(theData, index) in cathayData" :key="index">
          <td>
            {{ index + 1 }}
          </td>
          <td>
            <a href="#" @click.stop.prevent="onClickApplyNo(theData)">
              {{ theData.APLY_NO }}
            </a>
          </td>
          <td>
            <EllipseTippy :content="theData.OCR_NAME" class="font-eudc" displayBlock>
              {{ theData.OCR_ID + ' | ' + theData.OCR_NAME }}
            </EllipseTippy>
          </td>
          <td class="has-text-centered">
            {{ theData.INPUT_EMP_NM + '/ ' + theData.DECD_EMP_NAME }}
            <br />
            <cathay-translate code="Component_repApprTable_007" /> {{ ': ' + getVNDate(theData.CATHAY_RECEIVER_DATE) }}
          </td>
          <td class="has-text-centered">
            {{ theData.STATUS }}
            <br />
            {{ theData.CLAIM_STATUS }}
          </td>
          <td class="has-text-centered">
            {{ theData.NEWEST_STATUS }}
          </td>
        </tr>
      </tbody>
    </table>
</template>
<script setup>
  // CMR件-待補全
  import EllipseTippy from '~/components/EllipseTippy.vue';
  import SortingThead from '~/components/SortingThead.vue';
  import useTableSort from '~/composables/useTableSort';
  import useMoment from '~/composables/useMoment';
  import StickyThead from '../../StickyThead.vue';

  const { getVNDate } = useMoment();
  const props = defineProps({
    cmrRep_mapList: {
      type: Array,
      required: true,
      default: []
    }
  });

  const cathayData = reactive(props.cmrRep_mapList);
  const { sortName, isSortDesc, setSort } = useTableSort(cathayData);

  const onClickApplyNo = (data) => {
    window.open(`/servlet/HttpDispatcher/AAA1_3000/prompt?newTxRequest=true&FLAG=0&PROCESS_NUM=${data.APLY_NO}`);
  };
</script>