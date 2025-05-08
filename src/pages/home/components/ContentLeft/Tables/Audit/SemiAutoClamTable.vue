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
      <tr v-for="semiAutoClam in semiAutoClamData" :key="semiAutoClam.CASE_NO">
        <td width="115">{{ getROCDate(semiAutoClam.INPUT_DATE) }}</td>
        <td width="165">
          <a href="#" @click.stop.prevent="onClickLink(semiAutoClam)">{{ semiAutoClam.PROJ_NO }}</a>
        </td>
        <td class="limit-width w-105" width="105">{{ semiAutoClam.CASE_NO }}</td>
        <td class="limit-width w-330">
          <EllipseTippy v-if="semiAutoClam.PIN_MEMO != ''" :content="semiAutoClam.PIN_MEMO">
            <p class="note font-eudc">
              {{ semiAutoClam.PIN_MEMO }}
            </p>
          </EllipseTippy>
        </td>
        <td class="has-text-centered" width="85">
          <button @click.stop.prevent="onClickLink(semiAutoClam)">
            <img src="/src/assets/images/icon-handle.svg" alt="HANDLE" />
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script setup>
  // 查核件表格-全自動核賠查核件
  import EllipseTippy from '~/components/EllipseTippy.vue';
import SortingThead from '~/components/SortingThead.vue';
import useMoment from '~/composables/useMoment';
import useTableSort from '~/composables/useTableSort';
import StickyThead from '../../StickyThead.vue';
  const props = defineProps({
    checkSemiAutoClam_mapList: {
      type: Array,
      required: true,
      default: []
    }
  });
  const semiAutoClamData = reactive(props.checkSemiAutoClam_mapList);
  const { sortName, isSortDesc, setSort } = useTableSort(semiAutoClamData);
  const { getROCDate } = useMoment();
  const onClickLink = (semiAutoClam) => {
    location.href = `/servlet/HttpDispatcher/AAQ0_0201/query?PROJ_NO=${semiAutoClam.PROJ_NO}&CASE_NO=${semiAutoClam.CASE_NO}`;

  };
</script>
<style lang="scss"></style>
