<template>
    <table class="table is-striped-odd is-fullwidth" id="dataTable">
        <StickyThead>
            <tr class="scroll-fix">
                <SortingThead sortKey="INPUT_DATE" :currentSortKey="sortName" :isSortDesc="isSortDesc"
                    :onClickSort="setSort">受理日期
                </SortingThead>
                <th>專案編號</th>
                <th>案件編號</th>
                <th>案件說明</th>
                <th class="has-text-centered">處理</th>
            </tr>
        </StickyThead>
        <tbody>
            <tr v-for="autoClam in autoClamData" :key="autoClam.CASE_NO">
                <td width="115">{{ getROCDate(autoClam.INPUT_DATE) }}</td>
                <td width="165">
                    <a href="#" @click.stop.prevent="onClickLink(autoClam)">{{ autoClam.PROJ_NO }}</a>
                </td>
                <td class="limit-width w-105" width="105">{{ autoClam.CASE_NO }}</td>
                <td class="limit-width w-330">
                    <EllipseTippy v-if="autoClam.PIN_MEMO != ''" :content="autoClam.PIN_MEMO">
                        <p class="note font-eudc">
                            {{ autoClam.PIN_MEMO }}
                        </p>
                    </EllipseTippy>
                </td>
                <td class="has-text-centered" width="85">
                    <button @click.stop.prevent="onClickLink(autoClam)">
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
    checkAutoClam_mapList: {
        type: Array,
        required: true,
        default: []
    }
});
const autoClamData = reactive(props.checkAutoClam_mapList);
const { sortName, isSortDesc, setSort } = useTableSort(autoClamData);
const { getROCDate } = useMoment();
const onClickLink = (autoClam) => {
    location.href = `/servlet/HttpDispatcher/AAQ0_0201/query?PROJ_NO=${autoClam.PROJ_NO}&CASE_NO=${autoClam.CASE_NO}`;
    // window.open(`/AAWeb/servlet/HttpDispatcher/AAQ0_0201/query?PROJ_NO=${autoClam.PROJ_NO}&CASE_NO=${autoClam.CASE_NO}`);
};
</script>
<style lang="scss"></style>
