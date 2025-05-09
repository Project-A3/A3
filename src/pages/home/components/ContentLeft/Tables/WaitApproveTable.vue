<template>
  <div class="block table-block">
    <p class="block-title-outside scroll-fix">
      <cathay-translate :code="waitTableTypeString" /> <span>({{ currentWaitTableData.length }})</span>
    </p>
    <div class="block-content">
      <table class="table is-striped-odd is-fullwidth" id="dataTable">
        <StickyThead>
          <tr class="scroll-fix">
            <SortingThead sortKey="APLY_DATE" :currentSortKey="sortName" :isSortDesc="isSortDesc" :onClickSort="setSort">
              <cathay-translate code="Component_WaitApproveTable_001" />
            </SortingThead>
            <SortingThead sortKey="APLY_NO" :currentSortKey="sortName" :isSortDesc="isSortDesc" :onClickSort="setSort">
              <cathay-translate code="Component_WaitApproveTable_002" />
            </SortingThead>
            <SortingThead sortKey="CLAM_CAT" :currentSortKey="sortName" :isSortDesc="isSortDesc" :onClickSort="setSort">
              <cathay-translate code="Component_WaitApproveTable_003" />
            </SortingThead>
            <th><cathay-translate code="Component_WaitApproveTable_004" /></th>
            <SortingThead sortKey="APLY_STS_NAME" :currentSortKey="sortName" :isSortDesc="isSortDesc" :onClickSort="setSort">
              <cathay-translate code="Component_WaitApproveTable_005" />
            </SortingThead>
            <SortingThead sortKey="INVS_BUBBLE" :currentSortKey="sortName" :isSortDesc="isSortDesc" :onClickSort="setSort">
              <cathay-translate code="Component_WaitApproveTable_006" />
            </SortingThead>
            <SortingThead sortKey="REP_BUBBLE" :currentSortKey="sortName" :isSortDesc="isSortDesc" :onClickSort="setSort">
              <cathay-translate code="Component_WaitApproveTable_007" />
            </SortingThead>
            <SortingThead sortKey="NOTE_BUBBLE" :currentSortKey="sortName" :isSortDesc="isSortDesc" :onClickSort="setSort">
              <cathay-translate code="Component_WaitApproveTable_008" />
            </SortingThead>
            <SortingThead sortKey="APLY_DAY" :currentSortKey="sortName" :isSortDesc="isSortDesc" :onClickSort="setSort">
              <cathay-translate code="Component_WaitApproveTable_020" />
            </SortingThead>
            <SortingThead sortKey="DECD_EMP_NAME" :currentSortKey="sortName" :isSortDesc="isSortDesc" :onClickSort="setSort">
              <cathay-translate code="Component_WaitApproveTable_021" />
            </SortingThead>
            <th><cathay-translate code="Component_WaitApproveTable_009" /></th>
            <th class="has-text-centered"><cathay-translate code="Component_WaitApproveTable_010" /></th>
            <th class="has-text-centered"><cathay-translate code="Component_WaitApproveTable_011" /></th>
          </tr>
        </StickyThead>
        <tbody>
          <tr v-for="waitApprove in currentWaitTableData" :key="waitApprove.APLY_NO">
            <td width="120px" style="min-width: 120px">{{ getVNDate(waitApprove.APLY_DATE) }}</td>
            <td style="width: 80px">
              <a href="#" @click.stop.prevent="onClickApplyNo(waitApprove)">
                {{ waitApprove.APLY_NO }}
              </a>
              <br />
              {{ language.translate('Common_Service_Center') + ':' + waitApprove.ACCEPT_DIV_NAME }}
            </td>
            <td class="limit-width" width="100">
              <EllipseTippy
                :disableEllipse="true"
                :content="handleClamCatText(waitApprove.CLAM_CAT, language.translate('Common_CLAIM_CAT_' + waitApprove.CLAM_CAT))"
                :manual-refresh="true"
              >
                <span class="w-50 is-block">{{ waitApprove.CLAM_CAT }}</span>
              </EllipseTippy>
            </td>
            <td width="106" class="limit-width w-105 pr-4">
              <EllipseTippy :content="waitApprove.OCR_NAME" class="font-eudc" displayBlock>
                {{ waitApprove.OCR_NAME }}
              </EllipseTippy>
            </td>
            <td width="130">
              <span class="w-50 is-block">{{ language.translate('Common_CLAIM_STATUS_' + waitApprove.APLY_STS) }}</span>
              <EllipseTippy v-if="waitApprove.IS_BACK === 'Y'">
                <span :class="{ 'has-text-danger': true }"><cathay-translate code="Component_WaitApproveTable_012" /></span>
              </EllipseTippy>
            </td>
            <td width="56" class="has-left-border has-text-centered">
              <EllipseTippy
                :disableEllipse="true"
                :content="waitApprove.INVS_BUBBLE ? getVNDate(waitApprove.INVS_BUBBLE) : ''"
                v-if="waitApprove.IS_INVS === 'Y'"
              >
                <img :src="getIcon(waitApprove.INVS_TYPE)" alt="CHECKMARK" />
              </EllipseTippy>
            </td>
            <td width="56" class="has-text-centered">
              <EllipseTippy
                :disableEllipse="true"
                :content="waitApprove.REP_BUBBLE ? getVNDate(waitApprove.REP_BUBBLE) : ''"
                v-if="waitApprove.IS_REP === 'Y' && waitApprove.REP_TYPE"
              >
                <img :src="getIcon(waitApprove.REP_TYPE)" alt="CHECKMARK" />
              </EllipseTippy>
            </td>
            <td width="56" class="has-text-centered">
              <EllipseTippy
                :disableEllipse="true"
                :content="waitApprove.NOTE_BUBBLE ? getVNDate(waitApprove.NOTE_BUBBLE) : ''"
                v-if="waitApprove.IS_NOTE === 'Y'"
              >
                <img :src="getIcon(waitApprove.NOTE_TYPE)" alt="CHECKMARK" />
              </EllipseTippy>
            </td>
            <td width="125" class="has-left-border has-text-lefted">{{ waitApprove.APLY_DAY }}</td>
            <td width="125" class="has-left-border has-text-lefted">{{ waitApprove.DECD_EMP_NAME }}</td>
            <td width="330" class="has-left-border limit-width w-330">
              <EllipseTippy displayBlock>
                <div class="tag-container limit-width w-300">
                  <span v-for="tag in waitApprove.CASE_TAG" :class="homeStore.getTagColorClass(tag.TAG_COLOR)" v-bind:key="tag.TAG_NAME">
                    {{ tag.TAG_NAME }}
                  </span>
                </div>
              </EllipseTippy>
              <EllipseTippy v-if="waitApprove.PIN_MEMO != ''" :content="waitApprove.PIN_MEMO">
                <p class="note font-eudc">
                  {{ waitApprove.PIN_MEMO }}
                </p>
              </EllipseTippy>
            </td>
            <td width="50" class="has-text-centered">
              <button @click="onClickQuickSearch(waitApprove.APLY_NO)">
                <img src="/src/assets/images/icon-note.svg" alt="NOTELINK" />
              </button>
            </td>
            <td width="50" class="has-text-centered">
              <PinButton :isPin="waitApprove.IS_PIN === 'Y'" @click.native="onClickPin(waitApprove.APLY_NO)"></PinButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script setup>
  // 預設全部案件表格(待核定)
  import { throttle } from 'lodash-es';
  import { storeToRefs } from 'pinia';
  import { useRouter } from 'vue-router';
  import iconCheck1 from '~/assets/images/icon-checkmark-check.svg';
  import iconCheck2 from '~/assets/images/checkbox-checked-green.svg';
  import { handleClamCatText } from '~/common/utils';
  import { QuickSearchType, WaitApproveType } from '~/common/utils/enum';
  import EllipseTippy from '~/components/EllipseTippy.vue';
  import SortingThead from '~/components/SortingThead.vue';
  import useMoment from '~/composables/useMoment';
  import useQuickSearch from '~/composables/useQuickSearch';
  import useTableSort from '~/composables/useTableSort';
  import { useHomeStore } from '~/stores/home';
  import PinButton from '../PinButton.vue';
  import StickyThead from '../StickyThead.vue';
  import { useLanguageStore } from '~/stores/language';

  const homeStore = useHomeStore();
  const language = useLanguageStore();

  // 資料由Store統一控管，監聽切換在Parent: CaseTable.vue
  const { currentWaitTableData, currentWaitApproveType } = storeToRefs(homeStore);
  const { getVNDate } = useMoment();
  const { quickSearch } = useQuickSearch();

  const waitTableTypeString = computed(() => {
    switch (currentWaitApproveType.value) {
      case WaitApproveType.FiveDays:
        return 'Component_WaitApproveTable_013'; // 5日內
      case WaitApproveType.SixTo15Days:
        return 'Component_WaitApproveTable_014'; // 6-15日
      case WaitApproveType.SixteenTo30Days:
        return 'Component_WaitApproveTable_015'; // 16-30日
      case WaitApproveType.Over30Days:
        return 'Component_WaitApproveTable_016'; // 30日以上
      case WaitApproveType.All:
        return 'Component_WaitApproveTable_017'; // 全部案件
      case WaitApproveType.Restart:
        return 'Component_WaitApproveTable_018'; // 重啟件
      case WaitApproveType.ToBeCmr.All:
        return 'Component_WaitApproveTable_019'; // CMR件
      case WaitApproveType.Return:
        return 'Component_WaitApproveTable_022'; //退回件
      default:
        break;
    }
  });

  // 點擊釘選
  const onClickPin = throttle(async (applyNo) => {
    // alert(`click ${applyNo}`);
    // 找出那一筆
    let currentClickCase = currentWaitTableData.value.find((e) => e.APLY_NO === applyNo);
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
    await quickSearch(QuickSearchType.ApplyNo, applyNo, language.translate('Common_DATA_NOT_FOUND'));
  };

  const { sortName, isSortDesc, setSort, reSort } = useTableSort(currentWaitTableData, {
    preSort: { key: 'IS_PIN', method: 'desc' }
    // defaultSort: { key: 'APLY_DATE', method: 'desc' }
  });

  const router = useRouter();
  const onClickApplyNo = (data) => {
    let flag = 'FLAG=0';

    if (data.APLY_STS == '20' || data.APLY_STS == '40' || data.APLY_STS == '45' || data.APLY_STS == '50') {
      flag += '&LINK_STATUS=' + data.APLY_STS;
    }
    window.open(`/servlet/HttpDispatcher/AAA4_0100/prompt?newTxRequest=true&${flag}&PROCESS_NUM=${data.APLY_NO}`);
  };

  // 取得ICON
  const getIcon = (type) => {
    switch (type) {
      case '1':
        return iconCheck1;
      case '2':
        return iconCheck2;
      default:
        return iconCheck1;
    }
  };
</script>
