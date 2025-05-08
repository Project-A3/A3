<template>
  <div class="block progress-block">
    <div class="block-content">
      <!--<div class="block-title-inside">
        <p><cathay-translate code="Component_ProgressArea_001" /></p>
        <a href="#" aria-haspopup="true" @click.stop.prevent="openProgressModal"
          ><cathay-translate code="Component_ProgressArea_002"
        /></a>
      </div>
      <div class="progress">
        <ul class="progress-list">
          <li v-for="progressTrain in progressTrains">
            <span>{{ getVNDate(progressTrain.NODE_DATE) }}</span>
            <span class="font-eudc">{{ progressTrain.NODE_MEMO }}</span>
          </li>-->
          <!-- <li><span>110-08-14</span>完成理賠受理</li> -->
        <!--</ul>
      </div>-->
      <div class="note-history">
        <p class="note-history-title"><cathay-translate code="Component_ProgressArea_003" /></p>
        <ul class="history-list">
          <li v-for="memoHistory in memoHistories" :key="memoHistory.MEMO_NO" :class="{ pinned: memoHistory.IS_PIN === 'Y' }">
            <div class="image-flag">
              <img v-if="memoHistory.IS_PIN === 'Y'" src="/src/assets/images/icon-flag.svg" alt="FLAG" />
            </div>
            <span class="datetime">{{ getVNDate(memoHistory.MEMO_DATE, 'DD-MM-YYYY MM-DD HH:mm') }}</span>
            <span class="title">{{ getMemoName(memoHistory.MEMO_TYPE) }}</span>
            <span class="content font-eudc">{{ memoHistory.MEMO_CONTENT }}</span>

            <Tippy trigger="click" :arrow="false" v-if="isPrincipal">
              <button class="button edit-note">
                <svg width="30" height="30" xmlns="http://www.w3.org/2000/svg">
                  <g
                    stroke="#57A786"
                    stroke-width="1.5"
                    fill="none"
                    fill-rule="evenodd"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path
                      d="M10.5 19.5h2.227l6.312-6.311a1.575 1.575 0 0 0-2.228-2.228L10.5 17.273V19.5zM15.697 12.075l2.228 2.228"
                    />
                  </g>
                </svg>
              </button>

              <template #content>
                <ul class="tippy-dropdown-menu">
                  <li class="tippy-dropdown-item" v-if="memoHistory.IS_PIN === 'Y'" @click="cancelPinMemo(memoHistory)">
                    <cathay-translate code="Component_ProgressArea_004" />
                  </li>
                  <li class="tippy-dropdown-item" v-else @click="pinMemo(memoHistory)">
                    <cathay-translate code="Component_ProgressArea_005" />
                  </li>
                  <li class="tippy-dropdown-item" @click="openEditNoteModal(memoHistory)">
                    <cathay-translate code="Component_ProgressArea_006" />
                  </li>
                  <li class="tippy-dropdown-item" @click="onClickDeleteMemo(memoHistory)">
                    <cathay-translate code="Component_ProgressArea_007" />
                  </li>
                </ul>
              </template>
            </Tippy>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { useThrottleFn } from '@vueuse/core';
  import { orderBy, take, cloneDeep } from 'lodash-es';
  import { storeToRefs } from 'pinia';
  import { Tippy } from 'vue-tippy';
  import useModal from '~/composables/useModal';
  import useMoment from '~/composables/useMoment';
  import useSwal from '~/composables/useSwal';
  import { useHomeStore } from '~/stores/home';
  import { useLanguageStore } from '~/stores/language';
  import { useQuickSearchStore } from '~/stores/quickSearch';
  import EditNoteModal from './Modals/EditNoteModal.vue';
  import ProgressModal from './Modals/ProgressModal.vue';

  const quickSearchStore = useQuickSearchStore();
  const homeStore = useHomeStore();
  const { currentQuickSearchCaseDetail, caseDetail } = storeToRefs(quickSearchStore);
  const dropdownOptions = ref(cloneDeep(quickSearchStore.memoOptions));
  const { getVNDate } = useMoment();
  const { $m } = useModal();
  const { $swal } = useSwal();
  const route = useRoute();
  // 是否為負責人，不是負責人不能編輯、釘選
  // console.log(caseDetail.value);
  const isPrincipal = computed(() => caseDetail.value.MOD_MEMO === 'Y');
  // console.log(currentQuickSearchCaseDetail.value);
  // 進度列車(僅先顯示前兩筆)
  const progressTrains = computed(() =>
    take(orderBy(currentQuickSearchCaseDetail.value.clamProcess_mapList, ['NODE_DATE'], ['desc']), 2)
  );
  // 備註歷程
  const memoHistories = computed(() =>
    orderBy(currentQuickSearchCaseDetail.value.memo_mapList, ['IS_PIN', 'MEMO_DATE'], ['desc', 'desc'])
  );

  const language = useLanguageStore();

  watch(
    () => language.languages,
    async (newValue, oldValue) => {
      if (newValue !== oldValue) {
        dropdownOptions.value = cloneDeep(quickSearchStore.memoOptions);
        ref(cloneDeep(quickSearchStore.memoOptions));
      }
    }
  );
  // 開啟進度列車Modal
  const openProgressModal = () => {
    $m.show({
      component: ProgressModal,
      id: 'progressModal',
      data: orderBy(currentQuickSearchCaseDetail.value.clamProcess_mapList, ['NODE_DATE'], ['desc'])
    });
  };

  // 開啟修改備註Modal
  const openEditNoteModal = (memo) => {
    $m.show({
      component: EditNoteModal,
      id: '#editNoteModal',
      data: {
        applyNo: memo.APLY_NO,
        memo
      }
    });
  };

  const onClickDeleteMemo = (memo) => {
    $swal.confirm(
      language.translate('Component_ProgressArea_008'), // 您確定要刪除這筆資料嗎？
      async () => {
        const isPinning = memo.IS_PIN === 'Y';
        const result = await quickSearchStore.deleteMemo(memo.APLY_NO, memo.MEMO_NO);
        if (result.IS_SUCCESS) {
          // debugger;
          // 將畫面上的備註更新
          currentQuickSearchCaseDetail.value.memo_mapList = result.memo_mapList;
          // 如果刪除的是釘選備註，個人化首頁Table要更新
          if (route.name === 'home' && isPinning) {
            if (homeStore.currentWaitApproveType === '') {
              homeStore.reloadCaseTable();
            } else {
              let caseInTable = homeStore.currentWaitTableData.find((e) => e.APLY_NO === memo.APLY_NO);
              if (caseInTable) caseInTable.PIN_MEMO = '';
            }
          }
        }
      },
      language.translate('Component_ProgressArea_007')
    );
  };

  // 釘選備註
  const pinMemo = useThrottleFn(async (memo) => {
    let currentPinMemo = currentQuickSearchCaseDetail.value.memo_mapList.find((e) => e.IS_PIN === 'Y');
    if (currentPinMemo) currentPinMemo.IS_PIN = 'N';
    memo.IS_PIN = 'Y';
    const result = await quickSearchStore.pinMemo(memo.APLY_NO, memo.MEMO_NO);
    // console.log(homeStore.currentWaitTableData);
    console.log(memo);

    // API如回傳失敗將UI還原
    if (!result.IS_SUCCESS) {
      if (currentPinMemo) currentPinMemo.IS_PIN = 'Y';
      memo.IS_PIN = 'N';
      $swal.fail(result.RTN_MSG);
    } else {
      // 如果個人化首頁左側table有相同的案件，要更新備註
      if (route.name === 'home' && homeStore.currentWaitApproveType === '') {
        homeStore.reloadCaseTable();
      } else {
        let caseInTable = homeStore.currentWaitTableData.find((e) => e.APLY_NO === memo.APLY_NO);
        if (caseInTable) {
          caseInTable.PIN_MEMO = memo.MEMO_CONTENT;
        }
      }
    }
  }, 140);

  // 取消釘選備註
  const cancelPinMemo = useThrottleFn(async (memo) => {
    memo.IS_PIN = 'N';
    const result = await quickSearchStore.cancelPinMemo(memo.APLY_NO, memo.MEMO_NO);
    // console.log(homeStore.currentWaitTableData);
    console.log(memo);

    // API如回傳失敗將UI還原
    if (!result.IS_SUCCESS) {
      $swal.fail(result.RTN_MSG);
      memo.IS_PIN = 'Y';
    } else {
      // 如果個人化首頁左側table有相同的案件，要更新備註
      if (route.name === 'home' && homeStore.currentWaitApproveType === '') {
        homeStore.reloadCaseTable();
      } else {
        let caseInTable = homeStore.currentWaitTableData.find((e) => e.APLY_NO === memo.APLY_NO);
        if (caseInTable) {
          caseInTable.PIN_MEMO = '';
        }
      }
    }
  }, 140);

  const getMemoName = (memoType) => {
    return dropdownOptions.value.find((option) => option.value === memoType).name;
  };
</script>
<style lang="scss" scoped>
  .page-index main aside .block.progress-block .block-content .note-history .history-list li span.datetime {
    flex-basis: 80px;
  }
  .tippy-dropdown-item {
    text-align: center;
  }
</style>
