<template>
  <div class="block table-block">
    <p class="block-title-outside scroll-fix">
      待核付案件 <span>({{ aprvPayData.length }})</span>
    </p>
    <div class="block-content">
      <table class="table is-striped-odd is-fullwidth" id="dataTable">
        <StickyThead>
          <tr class="scroll-fix">
            <SortingThead sortKey="APLY_DATE" :currentSortKey="sortName" :isSortDesc="isSortDesc" :onClickSort="setSort"
              >受理日期
            </SortingThead>
            <SortingThead sortKey="APLY_NO" :currentSortKey="sortName" :isSortDesc="isSortDesc" :onClickSort="setSort">
              受理編號
            </SortingThead>
            <SortingThead sortKey="CLAM_CAT" :currentSortKey="sortName" :isSortDesc="isSortDesc" :onClickSort="setSort">
              索賠類別
            </SortingThead>
            <th>事故人姓名</th>
            <SortingThead sortKey="APLY_STS_NAME" :currentSortKey="sortName" :isSortDesc="isSortDesc" :onClickSort="setSort">
              理賠進度
            </SortingThead>
            <th class="has-text-centered">交查</th>
            <th class="has-text-centered">補全</th>
            <th class="has-text-centered">醫鑑</th>
            <th>釘選備註</th>
          </tr>
        </StickyThead>
        <tbody>
          <tr v-for="caseData in aprvPayData" :key="caseData.APLY_NO">
            <td width="175">{{ getROCDate(caseData.APLY_DATE) }}</td>
            <td width="165">
              <a href="#" @click.stop.prevent="onClickApplyNo(caseData.APLY_NO)">{{ caseData.APLY_NO }}</a>
            </td>
            <td class="limit-width w-105" width="115">
              <EllipseTippy :disableEllipse="true" :content="handleClamCatText(caseData.CLAM_CAT, caseData.CLAM_CAT_NAME)">
                <span class="w-50 is-block">{{ caseData.CLAM_CAT }}</span>
              </EllipseTippy>
            </td>
            <td width="106" class="limit-width w-105">
              <EllipseTippy :content="caseData.OCR_NAME" class="font-eudc" displayBlock>{{ caseData.OCR_NAME }}</EllipseTippy>
            </td>
            <td width="126">
              <span class="w-50 is-block">{{ caseData.APLY_STS_NAME }}</span>
              <EllipseTippy v-if="caseData.IS_BACK === 'Y'">
                <span :class="{ 'has-text-danger': true }">曾被退回</span>
              </EllipseTippy>
            </td>
            <td width="56" class="has-left-border has-text-centered">
              <EllipseTippy
                :disableEllipse="true"
                :content="caseData.INVS_BUBBLE ? getROCDate(caseData.INVS_BUBBLE) : ''"
                v-if="caseData.IS_INVS === 'Y'"
              >
                <img src="/src/assets/images/icon-checkmark-check.svg" alt="CHECKMARK" />
              </EllipseTippy>
            </td>
            <td width="56" class="has-text-centered">
              <EllipseTippy
                :disableEllipse="true"
                :content="caseData.REP_BUBBLE ? caseData.REP_BUBBLE : ''"
                v-if="caseData.IS_REP === 'Y' && caseData.REP_TYPE"
              >
                <img :src="getRepIcon(caseData.REP_TYPE)" alt="CHECKMARK" />
              </EllipseTippy>
            </td>
            <td width="56" class="has-text-centered">
              <EllipseTippy
                :disableEllipse="true"
                :content="caseData.APPRS_BUBBLE ? getROCDate(caseData.APPRS_BUBBLE) : ''"
                v-if="caseData.IS_APPRS === 'Y'"
              >
                <img src="/src/assets/images/icon-checkmark-check.svg" alt="CHECKMARK" />
              </EllipseTippy>
            </td>
            <td class="has-left-border limit-width w-330">
              <EllipseTippy displayBlock>
                <div class="tag-container limit-width w-300">
                  <span v-for="tag in caseData.CASE_TAG" :class="homeStore.getTagColorClass(tag.TAG_COLOR)">
                    {{ tag.TAG_NAME }}
                  </span>
                </div>
              </EllipseTippy>
              <EllipseTippy v-if="caseData.PIN_MEMO != ''" :content="caseData.PIN_MEMO">
                <p class="note font-eudc">
                  {{ caseData.PIN_MEMO }}
                </p>
              </EllipseTippy>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script setup>
  import iconRep3Check from '~/assets/images/icon-checkmark-check-double.svg';
  import iconRep1Check from '~/assets/images/icon-checkmark-check-light.svg';
  import iconRep2Check from '~/assets/images/icon-checkmark-check.svg';
  import { handleClamCatText } from '~/common/utils';
  import EllipseTippy from '~/components/EllipseTippy.vue';
  import SortingThead from '~/components/SortingThead.vue';
  import useCaseTable from '~/composables/useCaseTable';
  import useMoment from '~/composables/useMoment';
  import useTableSort from '~/composables/useTableSort';
  import { useHomeStore } from '~/stores/home';
  import StickyThead from '../StickyThead.vue';

  const homeStore = useHomeStore();
  const { getROCDate } = useMoment();
  const aprvPayData = await useCaseTable('decdList_mapList');
  const { sortName, isSortDesc, setSort } = useTableSort(aprvPayData);
  const router = useRouter();

  const onClickApplyNo = (applyNo) => {
    location.href = `/servlet/HttpDispatcher/AAB1_0800/prompt?APLY_NO=${applyNo}&gotoAAB10800=${applyNo}`;
  };
  // 取得補全ICON
  const getRepIcon = (type) => {
    switch (type) {
      // 服中輸入
      case '1':
        return iconRep1Check;
      // 理賠科輸入
      case '2':
        return iconRep2Check;
      // 服中+理賠科
      case '3':
        return iconRep3Check;
      default:
        return iconRep2Check;
    }
  };
</script>
<style lang="scss"></style>
