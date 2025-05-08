<template>
  <footer>
    <div class="quick-footer">
      <div class="columns">
        <div class="column ver-center p-0">
          <h6>快捷功能</h6>
          <button class="button footer-btn" @click="onClickQuickSearch">快捷專區</button>
          <div class="dropdown is-outline footer-btn is-up is-primary">
            <div class="dropdown-trigger">
              <button class="button apply-btn footer-btn" aria-haspopup="true" aria-controls="dropdown-menu">
                <span>輸入</span>
                <img src="/src/assets/images/icon-arrow-down-black.svg" alt="ARROW" />
              </button>
            </div>
            <div class="dropdown-menu" role="menu">
              <div class="dropdown-content">
                <a href="javasript:void(0)" @click.stop.prevent="onClickReceiveInspection" class="dropdown-item">
                  交查
                  <LinkCheckSvg v-if="isInvs"></LinkCheckSvg>
                </a>
                <a href="javasript:void(0)" @click.stop.prevent="onClickCompletionRecords" class="dropdown-item">
                  補全
                  <LinkCheckSvg v-if="isRep"></LinkCheckSvg>
                </a>
                <a href="javasript:void(0)" @click.stop.prevent="onClickApprsLink" class="dropdown-item">
                  醫鑑
                  <LinkCheckSvg v-if="isApprs"></LinkCheckSvg>
                </a>
              </div>
            </div>
          </div>
          <button class="button footer-btn" @click="onClickAndLogClaimRecords">理賠紀錄</button>
          <button class="button footer-btn" @click.prevent="onClickAndLogSpecialRecords">特殊紀錄</button>
          <button class="button footer-btn" @click="onClickAndLogNotPayRecords">不給付紀錄</button>
          <button class="button footer-btn" @click="onClickIndexRecords">索引紀錄</button>
          <button class="button footer-btn" @click="onClickAAA8_0100">實物服務紀錄</button>
        </div>
        <div class="column ver-center hor-right p-0">
          <div class="footer-time">
            <span>{{ format(saveTime.trial, 'YYYY-MM-DD HH:mm:ss') }}</span>
            <!-- <span>11:37</span> -->
          </div>
          <button
            class="button is-primary"
            v-if="footerStore.pageKey !== 'overview'"
            :disabled="props.readonly"
            @click.prevent="footerStore.submitPageData"
          >
            儲存審理進度
          </button>
        </div>
      </div>
    </div>
  </footer>
</template>
<script setup>
  import { storeToRefs } from 'pinia';
  import { AsideState, QuickSearchType } from '~/common/utils/enum';
  import useMoment from '~/composables/useMoment';
  import useQuickSearch from '~/composables/useQuickSearch';
  import useSwal from '~/composables/useSwal';
  import { useApplyStore } from '~/stores/apply';
  import { useFooterStore } from '~/stores/footer.js';
  import useQuickLink from '../../composables/useQuickLink';
  import LinkCheckSvg from './LinkCheckSvg.vue';

  const props = defineProps({
    readonly: {
      type: Boolean,
      required: false,
      default: false
    }
  });

  const { $swal } = useSwal();
  const footerStore = useFooterStore();
  const applyStore = useApplyStore();
  const { quickSearch } = useQuickSearch();
  const { format } = useMoment();

  const { applyNo, ocrId, ocrName, lifeGropClfy } = storeToRefs(footerStore);
  // 取得按鈕事件
  const { onClickSpecialRecords, onClickIndexRecords, onClickAAA8_0100 } = useQuickLink(QuickSearchType.ApplyNo, {
    applyNo,
    ocrId,
    ocrName,
    lifeGropClfy
  });

  // 有點擊特殊紀錄按鈕要記錄下來
  const onClickAndLogSpecialRecords = async () => {
    try {
      // 需為核賠人員版才要記錄
      if (!applyStore.isManager) {
        footerStore.showLoading();
        const result = await footerStore.recordButtonClicked('SPECIAL');
        if (!result.IS_SUCCESS) throw result.RTN_MSG;
      }
      onClickSpecialRecords();
    } catch (e) {
      $swal.fail(e);
    } finally {
      footerStore.hideLoading();
    }
  };

  // 理賠紀錄、不給付紀錄用事故人ID查詢
  const { onClickClaimRecords, onClickNotGiveRecords } = useQuickLink(QuickSearchType.OcrNo, {
    applyNo,
    ocrId,
    ocrName,
    lifeGropClfy
  });

  // 有點擊理賠紀錄要記錄下來
  const onClickAndLogClaimRecords = async () => {
    try {
      // 需為核賠人員版才要記錄
      if (!applyStore.isManager) {
        footerStore.showLoading();
        const result = await footerStore.recordButtonClicked('CLAIM');
        if (!result.IS_SUCCESS) throw result.RTN_MSG;
      }
      onClickClaimRecords();
    } catch (e) {
      $swal.fail(e);
    } finally {
      footerStore.hideLoading();
    }
  };

  // 有點擊不給付紀錄要記錄下來
  const onClickAndLogNotPayRecords = async () => {
    try {
      // 需為核賠人員版才要記錄
      if (!applyStore.isManager) {
        footerStore.showLoading();
        const result = await footerStore.recordButtonClicked('NOTPAY');
        if (!result.IS_SUCCESS) throw result.RTN_MSG;
      }
      onClickNotGiveRecords();
    } catch (e) {
      $swal.fail(e);
    } finally {
      footerStore.hideLoading();
    }
  };

  const doInsertAHLogic = async (ahType) => {
    try {
      footerStore.showLoading();
      const result = await footerStore.doInsertAH(ahType);
      if (!result.IS_SUCCESS) throw result.RTN_MSG;
      if (result.RTN_MSG) $swal.success(result.RTN_MSG);
      const openLink =
        ahType === '1'
          ? `/AHWeb/servlet/HttpDispatcher/AHA0_0100/query?APLY_NO=${applyNo.value}`
          : `/AHWeb/servlet/HttpDispatcher/AHE0_0100/query?APLY_NO=${applyNo.value}`;
      window.open(openLink);
    } catch (e) {
      $swal.fail(e);
    } finally {
      footerStore.hideLoading();
    }
  };

  // 交查
  const onClickReceiveInspection = () => {
    doInsertAHLogic('1');
  };
  // 補全
  const onClickCompletionRecords = () => {
    window.open(`/html/AA/J0/AAJ0_0010/AAJ00010.jsp?APLY_NO=${applyNo.value}&CLOSE_WIN=Y`);
  };
  // 醫鑑
  const onClickApprsLink = () => {
    doInsertAHLogic('2');
  };

  const isInvs = applyStore?.basicData?.IS_INVS === 'Y';
  const isRep = applyStore?.basicData?.IS_REP === 'Y';
  const isApprs = applyStore?.basicData?.IS_APPRS === 'Y';

  // 取得目前右側顯示什麼
  let asideState = inject('AsideState');
  // 取得儲存時間
  const { saveTime } = storeToRefs(footerStore);
  // 點擊快捷專區
  const onClickQuickSearch = async () => {
    asideState.value = AsideState.QuickSearch;
    await quickSearch(QuickSearchType.ApplyNo, footerStore.applyNo);
  };
</script>
<style lang="scss" scoped>
  .dropdown-item {
    display: flex;
    align-items: center;
  }
</style>
