<template>
  <table class="table is-striped-odd is-fullwidth" id="dataTable">
    <StickyThead>
      <tr class="scroll-fix">
        <SortingThead sortKey="APLY_DATE" :currentSortKey="sortName" :isSortDesc="isSortDesc" :onClickSort="setSort">
          <cathay-translate code="Component_DecdTable_001" />
        </SortingThead>
        <SortingThead sortKey="APLY_NO" :currentSortKey="sortName" :isSortDesc="isSortDesc" :onClickSort="setSort">
          <cathay-translate code="Component_DecdTable_002" />
        </SortingThead>
        <SortingThead sortKey="CLAM_CAT" :currentSortKey="sortName" :isSortDesc="isSortDesc" :onClickSort="setSort">
          <cathay-translate code="Component_DecdTable_003" />
        </SortingThead>
        <th><cathay-translate code="Component_DecdTable_004" /></th>
        <SortingThead sortKey="APLY_STS_NAME" :currentSortKey="sortName" :isSortDesc="isSortDesc" :onClickSort="setSort">
          <cathay-translate code="Component_DecdTable_005" />
        </SortingThead>
        <SortingThead sortKey="DECD_EMP_NAME" :currentSortKey="sortName" :isSortDesc="isSortDesc" :onClickSort="setSort">
          <cathay-translate code="Component_DecdTable_006" />
        </SortingThead>
        <th><cathay-translate code="Component_DecdTable_007" /></th>
        <th class="has-text-centered"><cathay-translate code="Component_DecdTable_008" /></th>
        <th class="has-text-centered"><cathay-translate code="Component_DecdTable_009" /></th>
      </tr>
    </StickyThead>

    <tbody>
      <tr v-for="decd in decdData" :key="decd.APLY_NO">
        <td width="120px" style="min-width: 120px">{{ getVNDate(decd.APLY_DATE) }}</td>
        <td style="width: 80px">
          <a href="#" @click.stop.prevent="onClickApplyNo(decd)">{{ decd.APLY_NO }}</a>
          <br />
          {{ language.translate('Common_Service_Center') + ':' + decd.ACCEPT_DIV_NAME }}
        </td>
        <td class="limit-width" width="115">
          <EllipseTippy
            :disableEllipse="true"
            :content="handleClamCatText(decd.CLAM_CAT, language.translate('Common_CLAIM_CAT_' + decd.CLAM_CAT))"
            :manual-refresh="true"
          >
            <span class="w-50 is-block">{{ decd.CLAM_CAT }}</span>
          </EllipseTippy>
        </td>
        <td width="106" class="limit-width w-105">
          <EllipseTippy :content="decd.OCR_NAME" class="font-eudc" displayBlock>{{ decd.OCR_NAME }}</EllipseTippy>
        </td>
        <td width="115">
          <span class="w-50 is-block">{{ language.translate('Common_CLAIM_STATUS_' + decd.APLY_STS) }}</span>
          <EllipseTippy v-if="decd.IS_BACK === 'Y'">
            <span :class="{ 'has-text-danger': true }"><cathay-translate code="Component_DecdTable_010" /></span>
          </EllipseTippy>
        </td>
        <td width="125" class="has-left-border has-text-lefted">{{ decd.DECD_EMP_NAME }}</td>
        <td width="330" class="has-left-border limit-width w-330">
          <EllipseTippy displayBlock>
            <div class="tag-container limit-width w-300">
              <span v-for="tag in decd.CASE_TAG" :class="homeStore.getTagColorClass(tag.TAG_COLOR)">
                {{ tag.TAG_NAME }}
              </span>
            </div>
          </EllipseTippy>
          <EllipseTippy v-if="decd.PIN_MEMO != ''" :content="decd.PIN_MEMO">
            <p class="note font-eudc">
              {{ decd.PIN_MEMO }}
            </p>
          </EllipseTippy>
        </td>
        <td width="50" class="has-text-centered">
          <button @click="onClickQuickSearch(decd.APLY_NO)">
            <img src="/src/assets/images/icon-note.svg" alt="NOTELINK" />
          </button>
        </td>
        <td width="50" class="has-text-centered">
          <PinButton :isPin="decd.IS_PIN === 'Y'" @click.native="onClickPin(decd.APLY_NO)"></PinButton>
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script setup>
  import { throttle } from 'lodash-es';
  import { handleClamCatText } from '~/common/utils';
  import EllipseTippy from '~/components/EllipseTippy.vue';
  import SortingThead from '~/components/SortingThead.vue';
  import useMoment from '~/composables/useMoment';
  import useTableSort from '~/composables/useTableSort';
  import StickyThead from '../../StickyThead.vue';
  import PinButton from '../../PinButton.vue';
  import { useHomeStore } from '~/stores/home';
  import { useLanguageStore } from '~/stores/language';
  import useQuickSearch from '~/composables/useQuickSearch';
  import { QuickSearchType } from '~/common/utils/enum';

  const language = useLanguageStore();
  const homeStore = useHomeStore();

  const { quickSearch } = useQuickSearch();
  // 解除契約-待核付
  const props = defineProps({
    cnclDecd_mapList: {
      type: Array,
      required: true,
      default: []
    }
  });

  const decdData = reactive(props.cnclDecd_mapList);
  homeStore.currentWaitTableData = ref(props.cnclDecd_mapList);

  const { sortName, isSortDesc, setSort, reSort } = useTableSort(decdData, {
    preSort: { key: 'IS_PIN', method: 'desc' }
    // defaultSort: { key: 'APLY_DATE', method: 'desc' }
  });
  const { getVNDate } = useMoment();

  const onClickApplyNo = (data) => {
    let flag = 'FLAG=0';

    if (data.APLY_STS == '20' || data.APLY_STS == '40' || data.APLY_STS == '45' || data.APLY_STS == '50') {
      flag += '&LINK_STATUS=' + data.APLY_STS;
    }
    window.open(`/servlet/HttpDispatcher/AAA4_0100/prompt?newTxRequest=true&${flag}&PROCESS_NUM=${data.APLY_NO}`);
  };

  // 點擊快捷專區
  const onClickQuickSearch = async (applyNo) => {
    await quickSearch(QuickSearchType.ApplyNo, applyNo, language.translate('Common_DATA_NOT_FOUND'));
  };

  // 點擊釘選
  const onClickPin = throttle(async (applyNo) => {
    // alert(`click ${applyNo}`);
    // 找出那一筆
    let currentClickCase = decdData.find((e) => e.APLY_NO === applyNo);
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
</script>
