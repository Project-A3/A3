<template>
  <div class="case result">
    <div class="case-info">
      <div class="first-line">
        <p class="first-line-left">
          <span
            >{{ caseDetail.APLY_NO }}
            <p v-if="caseDetail.ORI_APLY_NO">({{ caseDetail.ORI_APLY_NO }})</p></span
          >
          <span>{{ getVNDate(caseDetail.APLY_DATE) }}</span>
          <span><cathay-translate code="Component_CaseDetail_001" /></span>
        </p>
        <p class="first-line-right">
          <span class="no-wrap"><cathay-translate code="Component_CaseDetail_002" /></span>
          <EllipseTippy :disableEllipse="true" :content="`${caseDetail.DECD_EMP_UNIT}#${caseDetail.DECD_EMP_EXT}`">
            <span class="font-eudc">{{ caseDetail.DECD_EMP_NAME }}</span>
          </EllipseTippy>
        </p>
        <p class="first-line-right" v-if="caseDetail.TRN_NAME">
          <span class="no-wrap"><cathay-translate code="Component_CaseDetail_003" /></span>
          <EllipseTippy :disableEllipse="true" :content="`${caseDetail.TRN_DIV_NAME}#${caseDetail.TRN_MOBILE}`">
            <span class="font-eudc">{{ caseDetail.TRN_NAME }}</span>
          </EllipseTippy>
        </p>
      </div>
      <div class="second-line">
        <p class="second-line-left">
          <span class="font-eudc" style="display: block;">{{ caseDetail.OCR_NAME }}</span>
          <span>{{ caseDetail.OCR_ID }}</span>
        </p>
        <p class="second-line-right">
          <span>{{ language.translate('Common_CLAIM_STATUS_' + caseDetail.APLY_STS) }}</span>
        </p>
      </div>
    </div>
    <button class="button button-enter-case" @click="onClickEnterCaseFlow(caseDetail.APLY_NO)">
      <cathay-translate code="Component_CaseDetail_004" />
    </button>
    <div class="case-tool-button">
      <div class="is-flex is-justify-content-space-between">
        <button class="primary-button-light" :disabled="!(getRecordsCount.countClaimRecords > 0)" @click="onClickClaimRecords">
          <cathay-translate code="Component_CaseDetail_005" />
        </button>
        <button
          class="primary-button-light"
          :disabled="!(getRecordsCount.countNotGiveBenefitRecords > 0)"
          @click="onClickNotGiveRecords"
        >
          <cathay-translate code="Component_CaseDetail_006" />
        </button>
        <button
          class="primary-button-light"
          :disabled="!(getRecordsCount.countReleaseRecordCount > 0)"
          @click="onClickReleaseRecords"
        >
          <cathay-translate code="Component_CaseDetail_007" />
        </button>
        <button class="primary-button-light" :disabled="!(getRecordsCount.countSpecialRecord > 0)" @click="onClickSpecialRecords">
          <cathay-translate code="Component_CaseDetail_008" />
        </button>
      </div>
      <div class="is-flex is-justify-content-space-between">
        <button class="primary-button-light" @click="onClickIndexRecords">
          <cathay-translate code="Component_CaseDetail_009" />
        </button>
        <button
          class="primary-button-light"
          :disabled="!(getRecordsCount.countCompletionRecords > 0)"
          @click="onClickCompletionRecords"
        >
          <cathay-translate code="Component_CaseDetail_010" />
        </button>
        <button
          class="primary-button-light"
          :disabled="!(getRecordsCount.countInspectRecords > 0)"
          @click="onClickReceiveInspection"
        >
          <cathay-translate code="Component_CaseDetail_011" />
        </button>
        <button class="primary-button-light" :disabled="!(getRecordsCount.countNoteRecords > 0)" @click="onClickNoteLink">
          <cathay-translate code="Component_CaseDetail_012" />
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { storeToRefs } from 'pinia';
  import { QuickSearchType } from '~/common/utils/enum';
  import useMoment from '~/composables/useMoment';
  import useQuickLink from '~/composables/useQuickLink';
  import { useLanguageStore } from '~/stores/language';
  import { useQuickSearchStore } from '~/stores/quickSearch';
  import EllipseTippy from '../EllipseTippy.vue';
  const language = useLanguageStore();
  const { getVNDate } = useMoment();
  const quickSearchStore = useQuickSearchStore();
  const { caseDetail, getRecordsCount } = storeToRefs(quickSearchStore);
  if (caseDetail.value === undefined) {
    throw language.translate('Component_CaseDetail_013'); // 無案件詳細資料
  }

  //#region  至查詢頁面搜尋受理編號相關按鈕

  const dynamicOcrId = computed(() => caseDetail.value.OCR_ID);
  const dynamicOcrName = computed(() => caseDetail.value.OCR_NAME);
  const dynamicLifeGropClfy = computed(() => caseDetail.value.LIFE_GROP_CLFY);
  const dynamicApplyNo = computed(() => caseDetail.value.APLY_NO);
  const dynamicInsuredCertiType = computed(() => caseDetail.value.INSURED_CERTI_TYPE);

  const onClickEnterCaseFlow = (applyNo) => {
    window.open(`/servlet/HttpDispatcher/AAA4_0100/prompt?FLAG=1&PROCESS_NUM=${applyNo}`);
  };

  // 取得按鈕事件
  const {
    onClickClaimRecords,
    onClickNotGiveRecords,
    onClickReleaseRecords,
    onClickReceiveInspection,
    onClickCompletionRecords,
    onClickNoteLink
  } = useQuickLink(QuickSearchType.ApplyNo, {
    applyNo: dynamicApplyNo,
    ocrId: dynamicOcrId,
    ocrName: dynamicOcrName,
    lifeGropClfy: dynamicLifeGropClfy
  });

  const { onClickSpecialRecords, onClickIndexRecords } = useQuickLink(dynamicInsuredCertiType, {
    applyNo: dynamicApplyNo,
    ocrId: dynamicOcrId,
    ocrName: dynamicOcrName,
    lifeGropClfy: dynamicLifeGropClfy
  });
  //#endregion
</script>
<style lang=""></style>
