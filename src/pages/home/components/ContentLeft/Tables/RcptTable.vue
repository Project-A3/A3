<template>
  <div class="block table-block">
    <p class="block-title-outside scroll-fix">
      待補正件 <span>({{ correctionData.length }})</span>
    </p>
    <div class="block-content">
      <table class="table is-striped-odd is-fullwidth" id="dataTable">
        <StickyThead>
          <tr class="scroll-fix">
            <SortingThead sortKey="APLY_DATE" :currentSortKey="sortName" :isSortDesc="isSortDesc" :onClickSort="setSort"
              >受理日期
            </SortingThead>
            <SortingThead sortKey="APLY_NO" :currentSortKey="sortName" :isSortDesc="isSortDesc" :onClickSort="setSort"
              >受理編號
            </SortingThead>
            <SortingThead sortKey="CLAM_CAT" :currentSortKey="sortName" :isSortDesc="isSortDesc" :onClickSort="setSort"
              >索賠類別
            </SortingThead>
            <th>事故人姓名</th>
            <SortingThead sortKey="DECD_EMP_NAME" :currentSortKey="sortName" :isSortDesc="isSortDesc" :onClickSort="setSort"
              >核賠人員
            </SortingThead>
            <th>釘選備註</th>
            <th class="has-text-centered">收據補正</th>
          </tr>
        </StickyThead>
        <tbody>
          <tr v-for="rcpt in correctionData" :key="rcpt.APLY_NO">
            <td width="115">{{ getROCDate(rcpt.APLY_DATE) }}</td>
            <td width="165">
              <a href="#" @click.stop.prevent="onClickApplyNo(rcpt.APLY_NO)">{{ rcpt.APLY_NO }}</a>
            </td>
            <td class="limit-width w-105" width="105">
              <EllipseTippy :disableEllipse="true" :content="handleClamCatText(rcpt.CLAM_CAT, rcpt.CLAM_CAT_NAME)">
                <span class="w-50 is-block">{{ rcpt.CLAM_CAT }}</span>
              </EllipseTippy>
            </td>
            <td width="106" class="limit-width w-105">
              <EllipseTippy :content="rcpt.OCR_NAME" class="font-eudc" displayBlock>{{ rcpt.OCR_NAME }}</EllipseTippy>
            </td>
            <td width="106" class="limit-width w-105">
              <EllipseTippy :content="rcpt.DECD_EMP_NAME" class="font-eudc" displayBlock>{{ rcpt.DECD_EMP_NAME }}</EllipseTippy>
            </td>
            <td class="limit-width w-330">
              <EllipseTippy v-if="rcpt.PIN_MEMO != ''" :content="rcpt.PIN_MEMO">
                <p class="note font-eudc">
                  {{ rcpt.PIN_MEMO }}
                </p>
              </EllipseTippy>
            </td>
            <td class="has-text-centered" width="105">
              <button @click.stop.prevent="onClickApplyNo(rcpt.APLY_NO)">
                <img src="/src/assets/images/icon-paper.svg" alt="PAPER" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script setup>
  import { handleClamCatText } from '~/common/utils';
import EllipseTippy from '~/components/EllipseTippy.vue';
  // 補正件表格
  import SortingThead from '~/components/SortingThead.vue';
import useCaseTable from '~/composables/useCaseTable';
import useMoment from '~/composables/useMoment';
import useTableSort from '~/composables/useTableSort';
import StickyThead from '../StickyThead.vue';
  const correctionData = await useCaseTable('rcptList_mapList');
  const { sortName, isSortDesc, setSort } = useTableSort(correctionData);
  const { getROCDate } = useMoment();
  const onClickApplyNo = (applyNo) => {
    location.href = `/servlet/HttpDispatcher/AAB0_0300/prompt?LINK_PARAM=${applyNo}`;
    // window.open(`/AAWeb/servlet/HttpDispatcher/AAB0_0300/prompt?LINK_PARAM=${applyNo}`);
  };
</script>
<style lang="scss"></style>
