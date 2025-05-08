<template>
  <div>
    <div class="case">
      <div class="case-tool-button">
        <div class="is-flex is-justify-content-space-between">
          <button class="primary-button-light" :disabled="!(searchResult.countClaimRecords > 0)" @click="onClickClaimRecords">
            <cathay-translate code="Component_QuickSearchIdResult_001" />
          </button>
          <button
            class="primary-button-light"
            :disabled="!(searchResult.countNotGiveBenefitRecords > 0)"
            @click="onClickNotGiveRecords"
          >
            <cathay-translate code="Component_QuickSearchIdResult_002" />
          </button>
          <button
            class="primary-button-light"
            :disabled="!(searchResult.countReleaseRecordCount > 0)"
            @click="onClickReleaseRecords"
          >
            <cathay-translate code="Component_QuickSearchIdResult_003" />
          </button>
          <button class="primary-button-light" :disabled="!(searchResult.countSpecialRecord > 0)" @click="onClickSpecialRecords">
            <cathay-translate code="Component_QuickSearchIdResult_004" />
          </button>
        </div>
        <div class="is-flex is-justify-content-space-between">
          <button class="primary-button-light" @click="onClickIndexRecords">
            <cathay-translate code="Component_QuickSearchIdResult_005" />
          </button>
          <button
            class="primary-button-light"
            :disabled="!(searchResult.countCompletionRecords > 0)"
            @click="onClickCompletionRecords"
          >
            <cathay-translate code="Component_QuickSearchIdResult_006" />
          </button>
          <button
            class="primary-button-light"
            :disabled="!(searchResult.countInspectRecords > 0)"
            @click="onClickReceiveInspection"
          >
            <cathay-translate code="Component_QuickSearchIdResult_007" />
          </button>
          <button class="primary-button-light" :disabled="!(searchResult.countNoteRecords > 0)" @click="onClickNoteLink">
            <cathay-translate code="Component_QuickSearchIdResult_008" />
          </button>
        </div>
      </div>
    </div>
    <div class="case-list">
      <div
        class="block"
        v-for="caseRecord in claimCaseRecords"
        :key="caseRecord.APLY_NO"
        @click="onClickCase(caseRecord.APLY_NO)"
      >
        <div class="block-content">
          <div class="left">
            <div class="first-row">
              <a @click.stop.prevent="onClickApplyNo(caseRecord.APLY_NO)">{{ caseRecord.APLY_NO }}</a>
              <span>{{ getVNDate(caseRecord.APLY_DATE) }}</span>
              <span><cathay-translate code="Component_QuickSearchIdResult_009" /></span>
            </div>
            <div class="second-row">
              <span class="font-eudc">{{ caseRecord.OCR_NAME }}</span>
              <span>{{ caseRecord.OCR_ID }}</span>
            </div>
            <div class="thrid-row">
              <span><cathay-translate code="Component_QuickSearchIdResult_010" /></span>
              <span>{{ caseRecord.CLAM_CAT }}</span>
            </div>
          </div>
          <div class="right">
            <div class="first-row">
              <span><cathay-translate code="Component_QuickSearchIdResult_011" /></span>
              <EllipseTippy :disableEllipse="true" :content="`${caseRecord.DECD_EMP_UNIT}#${caseRecord.DECD_EMP_EXT}`">
                <span class="font-eudc">{{ caseRecord.DECD_EMP_NAME }}</span>
              </EllipseTippy>
            </div>
            <div class="second-row">
              <p>{{ language.translate('Common_CLAIM_STATUS_' + caseRecord.APLY_STS) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="view-all-case" v-if="total > 3 && claimCaseRecords.length != total">
      <a class="has-text-primary" href="#" @click.stop="onClickAllCase">{{ moreText }}</a>
    </div>
  </div>
</template>
<script setup>
  import { cloneDeep, isEmpty } from 'lodash-es';
  import { useQuickSearchStore } from '~/stores/quickSearch';
  import { QuickSearchStatus, QuickSearchType } from '~/common/utils/enum';
  import { storeToRefs } from 'pinia';
  import useMoment from '~/composables/useMoment';
  import useQuickLink from '~/composables/useQuickLink';
  import EllipseTippy from '../EllipseTippy.vue';
  import { useLanguageStore } from '~/stores/language';

  const { getVNDate } = useMoment();
  const quickSearchStore = useQuickSearchStore();
  const language = useLanguageStore();
  const { currentSearchType } = storeToRefs(quickSearchStore);
  const props = defineProps({
    searchResult: {
      type: Object,
      required: true,
      default: {}
    }
  });
  // console.log(props.searchResult);
  const searchResult = toRef(props, 'searchResult');
  if (isEmpty(searchResult.value)) {
    searchResult.value.queryClaimCaseRecords = [];
  }

  // alert(searchResult.value.queryClaimCaseRecords.length);

  // 點擊案件進入詳細案件頁
  const onClickCase = async (applyNo) => {
    // 呼叫API搜尋受理編號
    const response = await quickSearchStore.quickSearch(QuickSearchType.ApplyNo, applyNo);
    if (response.IS_SUCCESS) {
      quickSearchStore.$patch({
        currentQuickSearchCaseDetail: response,
        currentQuickSearchStatus: QuickSearchStatus.CaseDetailFromID
      });
      // currentQuickSearchStatus.value = QuickSearchStatus.CaseDetailFromID;
    }
  };

  const paginate = (arr, size) => {
    return arr.reduce((acc, val, i) => {
      let idx = Math.floor(i / size);
      let page = acc[idx] || (acc[idx] = []);
      page.push(val);

      return acc;
    }, []);
  };
  let count = 0;
  let perLoadCount = 10; // 一頁幾筆
  let caseRecords = cloneDeep(searchResult.value.queryClaimCaseRecords);
  // console.log(caseRecords.length);
  let total = ref(caseRecords.length);
  let pageRecords = caseRecords.splice(3, caseRecords.length);
  let pages = paginate(pageRecords, perLoadCount);

  const moreText = ref(language.translate('Component_QuickSearchIdResult_012'));
  const claimCaseRecords = reactive(caseRecords.splice(0, 3));
  // console.log(pages);
  // console.log(total);
  // 點擊全部案件
  const onClickAllCase = () => {
    claimCaseRecords.push(...pages[count]);
    count++;
    moreText.value = language.translate('Component_QuickSearchIdResult_013');
  };

  // console.log(searchResult.value);
  // console.log(isEmpty(searchResult.value));

  // 點擊受理編號
  const onClickApplyNo = (applyNo) => {
    console.log(`click ${applyNo}`);
  };

  //#region  至查詢頁面搜尋事故人ID相關按鈕
  // 取得按鈕事件
  const {
    onClickClaimRecords,
    onClickNotGiveRecords,
    onClickReleaseRecords,
    onClickSpecialRecords,
    onClickIndexRecords,
    onClickReceiveInspection,
    onClickCompletionRecords,
    onClickNoteLink
  } = useQuickLink(currentSearchType, {
    applyNo: '',
    ocrId: claimCaseRecords[0].OCR_ID,
    ocrName: claimCaseRecords[0].OCR_NAME,
    lifeGropClfy: claimCaseRecords[0].LIFE_GROP_CLFY
  });

  //#endregion
</script>
<style lang="scss" scoped>
  .second-row span + span,
  .thrid-row span + span {
    margin-left: 6px;
  }
</style>
