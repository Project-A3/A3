<template>
  <div class="block shortcut-block">
    <div class="block-content">
      <div class="block-title-inside">
        <div class="title-with-icon">
          <cathay-translate code="Component_QuickSearch_001" /><img src="/src/assets/images/icon-note.svg" alt="NOTE" />
        </div>
        <div class="title-tool-button">
          <div v-if="currentQuickSearchStatus === QuickSearchStatus.Default">
            <button class="primary-button-light" @click="onClickDashboard">
              <cathay-translate code="Component_QuickSearch_002" />
            </button>
            <button class="primary-button-light" @click="onClickReassignment">
              <cathay-translate code="Component_QuickSearch_003" />
            </button>
          </div>
        </div>
      </div>
      <div class="search-widget">
        <BaseDropdown :options="dropdownOptions" :onSelected="onDropdownSelected" class="is-primary"></BaseDropdown>
        <input
          v-model="currentSearchValue"
          style="height: 54px"
          type="search"
          :placeholder="inputPlaceHolder"
          @input="(val) => (currentSearchValue = currentSearchValue.toUpperCase())"
        />
        <button class="button search-button is-primary" style="height: 54px" @click="onClickSearch">
          <svg width="24" height="21" xmlns="http://www.w3.org/2000/svg">
            <g
              transform="translate(2 2)"
              stroke="#FFF"
              stroke-width="2.5"
              fill="none"
              fill-rule="evenodd"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="7.5" cy="7.5" r="7.5" />
              <path d="m14.5 12.5 6 5" />
            </g>
          </svg>
        </button>
      </div>
      <div class="search-invalid-message m-2 has-text-danger">
        {{ invalidMessage }}
      </div>
      <!--這邊如果加mode dev和serve會不一樣 還不知道為什麼 -->
      <transition :name="transitionName" :mode="transitionMode">
        <QuickSearchResult
          :key="quickSearchStore.caseResultKey"
          v-if="currentQuickSearchStatus >= QuickSearchStatus.SearchIDResult"
          :searchResult="result"
        ></QuickSearchResult>
      </transition>
    </div>
  </div>
  <ExitQuickSearchButton
    @click.native="onClickExit"
    v-if="currentQuickSearchStatus >= QuickSearchStatus.SearchIDResult"
  ></ExitQuickSearchButton>
</template>
<script setup>
  import { isEmpty } from 'lodash-es';
  import { storeToRefs } from 'pinia';
  import { QuickSearchStatus, QuickSearchType } from '~/common/utils/enum';
  import BaseDropdown from '~/components/BaseDropdown.vue';
  import useSwal from '~/composables/useSwal';
  import { useLanguageStore } from '~/stores/language';
  import { useQuickSearchStore } from '~/stores/quickSearch';
  import ExitQuickSearchButton from './ExitQuickSearchButton.vue';
  import QuickSearchResult from './QuickSearchResult.vue';
  import { computed, watch } from 'vue';

  const transitionMode = import.meta.env.PROD ? 'out-in' : '';

  const props = defineProps({
    onExitCallback: {
      type: Function,
      required: false,
      default: () => console.log('exit quick search!')
    }
  });

  const { $swal } = useSwal();
  const quickSearchStore = useQuickSearchStore();
  const {
    // 搜尋的內容文字
    currentSearchValue,
    // 搜尋類型
    currentSearchType,
    dropdownOptions,
    currentQuickSearchStatus,
    currentQuickSearchCaseDetail,
    inputPlaceHolder,
    hasTransition
  } = storeToRefs(quickSearchStore);

  const transitionName = computed(() => {
    hasTransition.value ? 'slide-fade' : '';
  });

  const language = useLanguageStore();

  watch(
    () => language.languages,
    async (newValue, oldValue) => {
      if (newValue !== oldValue) {
        dropdownOptions.value.forEach((option) => {
          option.name = language.translate(option.langKey);
        });
      }
    }
  );
  // 搜尋結果
  const result = ref([]);

  // 下拉選單選擇
  const onDropdownSelected = (value) => {
    currentSearchType.value = value;
    dropdownOptions.value.forEach((element) => {
      if (element.value === value) {
        element.selected = true;
      } else {
        element.selected = false;
      }
    });
    // let idx = dropdownOptions.value.findIndex((e) => e.value === value);
    // dropdownOptions.value[idx].selected = true;
    // placeHolder.value = `請輸入${dropdownOptions.value.find((e) => e.value === value).name}`;
  };

  // 錯誤訊息
  const invalidMessage = ref('');
  // 點擊搜尋
  const onClickSearch = async () => {
    const searchValue = currentSearchValue.value.trim();
    const searchType = currentSearchType.value;
    invalidMessage.value = '';
    // 輸入檢核
    if (isEmpty(searchValue)) {
      invalidMessage.value = language.translate('Component_QuickSearch_004'); // 不能為空白
    } else if (searchType == 1 && (searchValue.length < 9 || searchValue.length > 13)) {
      invalidMessage.value = '身分證須介於9~13碼';
    } else if (searchValue.length < 7) {

      if (searchType == '2') {
        invalidMessage.value = '出生證';
      } else if (searchType == '3') {
        errorMessage = '護照';
      } else if (searchType == '4') {
        errorMessage = '軍人證';
      }

      invalidMessage.value += '須大於7碼';
    }

    if (!isEmpty(invalidMessage.value)) {
      return;
    }

    const response = await quickSearchStore.quickSearch(currentSearchType.value, currentSearchValue.value);
    // console.log(response);
    // 將結果放入result component
    if (response.IS_SUCCESS) {
      // TODO: 查無資料
      if (response?.queryClaimCaseRecords.length === 0) {
        $swal.fail(language.translate('Common_DATA_NOT_FOUND')); // 查無資料!
        return;
      }
      result.value = response;
      if (currentSearchType.value === QuickSearchType.ApplyNo) {
        // 用編號查詢
        currentQuickSearchCaseDetail.value = response;
        hasTransition.value = false;
        currentQuickSearchStatus.value = QuickSearchStatus.CaseDetailFromNo;
      } else {
        // 用事故人ID查詢
        hasTransition.value = true;
        currentQuickSearchStatus.value = QuickSearchStatus.SearchIDResult;
      }
    } else {
      // handle error
      $swal.fail(response.RTN_MSG);
    }
  };

  // 點擊離開快捷
  const onClickExit = () => {
    // 這邊可以看要不要清掉
    currentSearchValue.value = '';
    // 清除搜尋結果
    quickSearchStore.$patch({
      currentQuickSearchStatus: QuickSearchStatus.Default,
      currentQuickSearchCaseDetail: {}
    });

    props.onExitCallback();
  };

  // 點擊改派
  const onClickReassignment = () => {
    window.open('/servlet/HttpDispatcher/AAD0_0300/prompt');
  };

  // 點擊儀表板
  const onClickDashboard = () => {
    window.open('/servlet/HttpDispatcher/AAK0_0100/prompt?newTxRequest=true');
  };
</script>

<style>
  /* Enter and leave animations can use different */
  /* durations and timing functions.              */
  .slide-fade-enter-active,
  .slide-fade-leave-active {
    transition: all 0.5s ease-in-out;
  }

  .slide-fade-leave-active {
    transition: all 0.5s ease-in-out;
  }

  .slide-fade-enter-from {
    transform: translateX(150px);
    opacity: 0;
  }

  .slide-fade-leave-to {
    transform: translateX(-150px);
    opacity: 0;
  }
</style>
