<template>
  <div class="block table-block">
    <p class="block-title-outside scroll-fix">
      待覆核案件 <span>({{ aprvData.length }})</span>
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
            <SortingThead sortKey="APLY_STS_NAME" :currentSortKey="sortName" :isSortDesc="isSortDesc" :onClickSort="setSort">
              理賠進度
            </SortingThead>
            <th>釘選備註</th>
            <th class="has-text-centered">快捷</th>
          </tr>
        </StickyThead>
        <tbody>
          <tr v-for="aprv in aprvData" :key="aprv.APLY_NO">
            <td width="125">{{ getROCDate(aprv.APLY_DATE) }}</td>
            <td width="175">
              <a href="#" @click.stop.prevent="onClickApplyNo(aprv.APLY_NO)">{{ aprv.APLY_NO }}</a>
            </td>
            <td width="115" class="limit-width w-105">
              <EllipseTippy :disableEllipse="true" :content="handleClamCatText(aprv.CLAM_CAT, aprv.CLAM_CAT_NAME)">
                <span class="w-50 is-block">{{ aprv.CLAM_CAT }}</span>
              </EllipseTippy>
            </td>
            <td width="106" class="limit-width w-105">
              <EllipseTippy :content="aprv.OCR_NAME" class="font-eudc" displayBlock>{{ aprv.OCR_NAME }}</EllipseTippy>
            </td>
            <td width="160" class="limit-width">
              <span class="w-50 is-block">{{ aprv.APLY_STS_NAME }}</span>
              <EllipseTippy v-if="aprv.IS_BACK === 'Y'">
                <span :class="{ 'has-text-danger': true }">曾被退回</span>
              </EllipseTippy>
            </td>
            <td class="limit-width w-330">
              <EllipseTippy displayBlock>
                <div class="tag-container limit-width w-300">
                  <span v-for="tag in aprv.CASE_TAG" :class="homeStore.getTagColorClass(tag.TAG_COLOR)">
                    {{ tag.TAG_NAME }}
                  </span>
                </div>
              </EllipseTippy>
              <EllipseTippy v-if="aprv.PIN_MEMO != ''" :content="aprv.PIN_MEMO">
                <p class="note font-eudc">
                  {{ aprv.PIN_MEMO }}
                </p>
              </EllipseTippy>
            </td>
            <td width="110" class="has-text-centered">
              <button @click="onClickQuickSearch(aprv.APLY_NO)">
                <img src="/src/assets/images/icon-note.svg" alt="NOTELINK" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script setup>
  // 承辦人員-待覆核表格
  import { handleClamCatText } from '~/common/utils';
import { QuickSearchType } from '~/common/utils/enum';
import EllipseTippy from '~/components/EllipseTippy.vue';
import SortingThead from '~/components/SortingThead.vue';
import useCaseTable from '~/composables/useCaseTable';
import useMoment from '~/composables/useMoment';
import useQuickSearch from '~/composables/useQuickSearch';
import useTableSort from '~/composables/useTableSort';
import { useHomeStore } from '~/stores/home';
import StickyThead from '../StickyThead.vue';

  const homeStore = useHomeStore();
  const aprvData = await useCaseTable('aprvList_mapList');
  const { sortName, isSortDesc, setSort, reSort } = useTableSort(aprvData, {
    preSort: { key: 'IS_PIN', method: 'desc' }
    // defaultSort: { key: 'APLY_DATE', method: 'desc' }
  });
  const { getROCDate } = useMoment();
  const { quickSearch } = useQuickSearch();

  // 點擊快捷
  const onClickQuickSearch = async (applyNo) => {
    await quickSearch(QuickSearchType.ApplyNo, applyNo);
  };

  const router = useRouter();
  const onClickApplyNo = (applyNo) => {
    location.href = `/servlet/HttpDispatcher/AAB1_0100/prompt?LINK_PARAM=${applyNo}&MENU=Y`;
  };
</script>
<style lang="scss"></style>
