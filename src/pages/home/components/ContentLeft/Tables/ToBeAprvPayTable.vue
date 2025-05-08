<template>
  <div class="block table-block" ref="toBeSignedTable">
    <p class="block-title-outside scroll-fix">
      <cathay-translate :code="waitTableTypeString" /> <span>({{ signData.length }})</span>
    </p>
    <div class="block-content">
      <table class="table is-striped-odd is-fullwidth" id="dataTable">
        <StickyThead>
          <tr class="scroll-fix">
            <SortingThead sortKey="APLY_DATE" :currentSortKey="sortName" :isSortDesc="isSortDesc" :onClickSort="setSort">
              <cathay-translate code="Component_ToBeAprvPayTable_001" />
            </SortingThead>
            <SortingThead sortKey="APLY_NO" :currentSortKey="sortName" :isSortDesc="isSortDesc" :onClickSort="setSort"
              ><cathay-translate code="Component_ToBeAprvPayTable_002" />
            </SortingThead>
            <SortingThead sortKey="CLAM_CAT" :currentSortKey="sortName" :isSortDesc="isSortDesc" :onClickSort="setSort"
              ><cathay-translate code="Component_ToBeAprvPayTable_003" />
            </SortingThead>
            <th><cathay-translate code="Component_ToBeAprvPayTable_004" /></th>
            <SortingThead sortKey="APLY_STS_NAME" :currentSortKey="sortName" :isSortDesc="isSortDesc" :onClickSort="setSort">
              <cathay-translate code="Component_ToBeAprvPayTable_005" />
            </SortingThead>
            <SortingThead sortKey="DECD_EMP_NAME" :currentSortKey="sortName" :isSortDesc="isSortDesc" :onClickSort="setSort"
              ><cathay-translate code="Component_ToBeAprvPayTable_006" />
            </SortingThead>
            <th><cathay-translate code="Component_ToBeAprvPayTable_007" /></th>
            <th class="has-text-centered"><cathay-translate code="Component_ToBeAprvPayTable_008" /></th>
            <th class="has-text-centered"><cathay-translate code="Component_ToBeAprvPayTable_009" /></th>
          </tr>
        </StickyThead>
        <tbody>
          <template v-for="sign in signData" :key="sign.APLY_NO">
            <tr :class="{ selected: sign.EXC_STR_DT }">
              <td width="120px" style="min-width: 120px">{{ getVNDate(sign.APLY_DATE) }}</td>
              <td style="width: 80px">
                <div class="case-status">
                  <div class="status-row">
                    <div class="status-cell">
                      <div class="status-mark" :class="getStatusClass(sign.STATUS)"></div>
                    </div>
                    <div class="status-cell">
                      <a href="#" @click.stop.prevent="onClickApplyNo(sign)">{{ sign.APLY_NO }}</a>
                      <br />
                      {{ language.translate('Common_Service_Center') + ':' + sign.ACCEPT_DIV_NAME }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="limit-width w-105" width="105">
                <EllipseTippy
                  :disableEllipse="true"
                  :content="handleClamCatText(sign.CLAM_CAT, language.translate('Common_CLAIM_CAT_' + sign.CLAM_CAT))"
                  :manual-refresh="true"
                >
                  <span class="w-50 is-block">{{ sign.CLAM_CAT }}</span>
                </EllipseTippy>
              </td>
              <td width="106" class="limit-width w-105">
                <EllipseTippy :content="sign.OCR_NAME" class="font-eudc" displayBlock>{{ sign.OCR_NAME }}</EllipseTippy>
              </td>
              <td width="130">
                <span class="w-50 is-block">{{ language.translate('Common_CLAIM_STATUS_' + sign.APLY_STS) }}</span>
                <EllipseTippy v-if="sign.IS_BACK === 'Y'">
                  <span :class="{ 'has-text-danger': true }"><cathay-translate code="Component_ToBeAprvPayTable_010" /></span>
                </EllipseTippy>
              </td>
              <td width="111" class="limit-width w-105">
                <EllipseTippy :content="sign.DECD_EMP_NAME" class="font-eudc" displayBlock>{{ sign.DECD_EMP_NAME }}</EllipseTippy>
              </td>
              <td class="has-left-border limit-width w-330">
                <EllipseTippy displayBlock>
                  <div class="tag-container limit-width w-300">
                    <span v-for="tag in sign.CASE_TAG" :class="homeStore.getTagColorClass(tag.TAG_COLOR)">
                      {{ tag.TAG_NAME }}
                    </span>
                  </div>
                </EllipseTippy>
                <EllipseTippy v-if="sign.PIN_MEMO != ''" :content="sign.PIN_MEMO">
                  <p class="note font-eudc">
                    {{ sign.PIN_MEMO }}
                  </p>
                </EllipseTippy>
              </td>
              <td width="50" class="has-text-centered">
                <button @click="onClickQuickSearch(sign.APLY_NO)">
                  <img src="/src/assets/images/icon-note.svg" alt="NOTELINK" />
                </button>
              </td>
              <td width="50" class="has-text-centered">
                <PinButton :isPin="sign.IS_PIN === 'Y'" @click.native="onClickPin(sign.APLY_NO)"></PinButton>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script setup>
  // 待核付表格
  import { throttle } from 'lodash-es';
  import { storeToRefs } from 'pinia';
  import { handleClamCatText } from '~/common/utils';
  import { QuickSearchStatus, QuickSearchType, WaitApproveType } from '~/common/utils/enum';
  import EllipseTippy from '~/components/EllipseTippy.vue';
  import SortingThead from '~/components/SortingThead.vue';
  import useMoment from '~/composables/useMoment';
  import useSwal from '~/composables/useSwal';
  import useTableSort from '~/composables/useTableSort';
  import { useHomeStore } from '~/stores/home';
  import { useQuickSearchStore } from '~/stores/quickSearch';
  import PinButton from '../PinButton.vue';
  import StickyThead from '../StickyThead.vue';
  import { useLanguageStore } from '~/stores/language';

  const language = useLanguageStore();
  const { $swal } = useSwal();
  const { getVNDate } = useMoment();
  const homeStore = useHomeStore();
  const quickSearchStore = useQuickSearchStore();
  const { currentWaitTableData, currentWaitApproveType } = storeToRefs(homeStore);

  // 覆核人員
  const signData = currentWaitTableData;
  const waitTableTypeString = computed(() => {
    switch (currentWaitApproveType.value) {
      case WaitApproveType.FiveDays:
        return 'Component_ToBeAprvPayTable_011'; // 5日內
      case WaitApproveType.SixTo15Days:
        return 'Component_ToBeAprvPayTable_012'; // 6-15日
      case WaitApproveType.SixteenTo30Days:
        return 'Component_ToBeAprvPayTable_013'; // 16-30日
      case WaitApproveType.Over30Days:
        return 'Component_ToBeAprvPayTable_014'; // 30日以上
      case WaitApproveType.All:
        return 'Component_ToBeAprvPayTable_015'; // 全部案件
      case WaitApproveType.Restart:
        return 'Component_ToBeAprvPayTable_016'; // 重啟件
      case WaitApproveType.CancelPolicy:
        return 'Component_ToBeAprvPayTable_017'; // 解除契約
      default:
        break;
    }
  });

  // 點擊釘選
  const onClickPin = throttle(async (applyNo) => {
    // alert(`click ${applyNo}`);
    // 找出那一筆
    let currentClickCase = signData.value
      ? signData.value.find((e) => e.APLY_NO === applyNo)
      : signData.find((e) => e.APLY_NO === applyNo);
    // 判斷是要釘選還是取消釘選
    const needPin = currentClickCase.IS_PIN !== 'Y';
    // 將釘選 => IS_PIN = Y 否則相反
    currentClickCase.IS_PIN = needPin ? 'Y' : 'N';
    reSort();
    // 呼叫釘選API
    const result = await homeStore.pinOrUnpinCase(applyNo, needPin);
    // console.log(result);
    if (!result.IS_SUCCESS) {
      // error, undo
      currentClickCase.IS_PIN = needPin ? 'N' : 'Y';
      reSort();
    }

    // 重新執行排序
  }, 200);

  // 點擊快捷
  const onClickQuickSearch = async (applyNo) => {
    const response = await quickSearchStore.quickSearch(QuickSearchType.ApplyNo, applyNo);
    // TODO: 查無資料
    if (response?.queryClaimCaseRecords.length === 0) {
      $swal.fail(language.translate('Common_DATA_NOT_FOUND')); // 查無資料!
      return;
    }
    // 用編號查詢
    quickSearchStore.$patch({
      currentQuickSearchCaseDetail: response,
      currentQuickSearchStatus: QuickSearchStatus.CaseDetailFromNo,
      currentSearchValue: applyNo,
      currentSearchType: QuickSearchType.ApplyNo,
      hasTransition: false
    });

    // 如果快捷專區沒展開，將其展開
    const mainTarget = document.querySelector('main.hide-right');
    if (mainTarget) {
      mainTarget.classList.remove('hide-right');
    }
  };
  const router = useRouter();
  const onClickApplyNo = (data) => {
    let flag = 'FLAG=0';

    if (data.APLY_STS == '20' || data.APLY_STS == '40' || data.APLY_STS == '45' || data.APLY_STS == '50' ) {
      flag += '&LINK_STATUS=' + data.APLY_STS;
    }
    window.open(`/servlet/HttpDispatcher/AAA4_0100/prompt?newTxRequest=true&${flag}&PROCESS_NUM=${data.APLY_NO}`);
  };

  const { sortName, isSortDesc, setSort, reSort } = useTableSort(signData, {
    preSort: { key: 'IS_PIN', method: 'desc' }
    // defaultSort: { key: 'APLY_DATE', method: 'desc' }
  });

  // UI JS
  const toBeSignedTable = ref(null);
  let toggleMsgDetail = (e) => {
    let toggleButton = e.target.closest('.button.toggle');
    if (toggleButton) {
      let hiddenInfo = toggleButton.closest('tr').nextElementSibling;
      if (hiddenInfo && hiddenInfo.classList.contains('hidden-info')) {
        toggleButton.closest('tr').classList.toggle('selected');
        toggleButton.classList.toggle('expand');
        hiddenInfo.classList.toggle('is-hidden');
      }
    }
  };
  onMounted(() => {
    toBeSignedTable.value.addEventListener('click', toggleMsgDetail);
  });

  onBeforeUnmount(() => {
    toBeSignedTable.value.removeEventListener('click', toggleMsgDetail);
  });

  const getStatusClass = (status) => {
    return {
      status0: status === '0',
      status2: status === '2',
      status: status === ''
    };
  };
</script>
<style lang="scss"></style>
