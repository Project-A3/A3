<template>
  <table class="table is-striped-odd is-fullwidth" id="dataTable">
    <StickyThead>
      <tr class="scroll-fix">
        <SortingThead sortKey="INPUT_DATE" :currentSortKey="sortName" :isSortDesc="isSortDesc" :onClickSort="setSort"
          >受理日期
        </SortingThead>
        <th>專案編號</th>
        <th>案件編號</th>
        <th>案件說明</th>
        <th class="has-text-centered">處理</th>
      </tr>
    </StickyThead>
    <tbody>
      <tr v-for="noAprv in noAprvData" :key="noAprv.CASE_NO">
        <td width="115">{{ getROCDate(noAprv.INPUT_DATE) }}</td>
        <td width="165">
          <a href="javascript:void(0)" @click.stop.prevent="onClickLink(noAprv)">{{ noAprv.PROJ_NO }}</a>
        </td>
        <td class="limit-width w-105" width="105">{{ noAprv.CASE_NO }}</td>
        <td class="limit-width w-330">
          <EllipseTippy v-if="noAprv.PIN_MEMO != ''" :content="noAprv.PIN_MEMO">
            <p class="note font-eudc">
              {{ noAprv.PIN_MEMO }}
            </p>
          </EllipseTippy>
        </td>
        <td class="has-text-centered" width="85">
          <button @click.stop.prevent="onClickLink(noAprv)">
            <img src="/src/assets/images/icon-handle.svg" alt="HANDLE" />
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script setup>
  // 查核件表格
  import EllipseTippy from '~/components/EllipseTippy.vue';
import SortingThead from '~/components/SortingThead.vue';
import useMoment from '~/composables/useMoment';
import useTableSort from '~/composables/useTableSort';
import StickyThead from '../../StickyThead.vue';
  const props = defineProps({
    checkNoAprv_mapList: {
      type: Array,
      required: true,
      default: []
    }
  });

  const noAprvData = reactive(props.checkNoAprv_mapList);
  const { sortName, isSortDesc, setSort } = useTableSort(noAprvData);
  const { getROCDate } = useMoment();

  const onClickLink = (noAprv) => {
    location.href = `/servlet/HttpDispatcher/AAQ0_0201/query?PROJ_NO=${noAprv.PROJ_NO}&CASE_NO=${noAprv.CASE_NO}`;
    // window.open(`/AAWeb/servlet/HttpDispatcher/AAQ0_0201/query?PROJ_NO=${noAprv.PROJ_NO}&CASE_NO=${noAprv.CASE_NO}`);
  };
</script>
<style lang="scss"></style>
