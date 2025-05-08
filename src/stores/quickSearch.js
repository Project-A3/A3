import { isEmpty } from 'lodash-es';
import { defineStore } from 'pinia';
import { apiCancelPinMemo, apiDeleteMemo, apiInsertMemo, apiPinMemo, apiQuickSearch, apiUpdateMemo } from '~/common/api';
import { QuickSearchStatus, QuickSearchType } from '~/common/utils/enum';
import { useLanguageStore } from '~/stores/language';

const language = useLanguageStore();

export const useQuickSearchStore = defineStore('quickSearch', {
  state: () => ({
    // 目前快捷專區搜尋內容
    currentSearchValue: '',
    // 目前快捷專區搜尋類型
    currentSearchType: QuickSearchType.ApplyNo,
    // 快捷專區下拉選單
    dropdownOptions: [
      {
        langKey: 'Stores_QuickSearch_001', // 受理編號
        name: language.translate('Stores_QuickSearch_001'), // 受理編號
        value: '0',
        selected: true
      },
      {
        langKey: 'Stores_QuickSearch_002', // 事故人身分證
        name: language.translate('Stores_QuickSearch_002'), // 事故人身分證
        value: '1'
      },
      {
        langKey: 'Stores_QuickSearch_003', // 事故人出生證
        name: language.translate('Stores_QuickSearch_003'), // 事故人出生證
        value: '2'
      },
      {
        langKey: 'Stores_QuickSearch_004', // 事故人護照
        name: language.translate('Stores_QuickSearch_004'), // 事故人護照
        value: '3'
      },
      {
        langKey: 'Stores_QuickSearch_005', // 事故人軍人證
        name: language.translate('Stores_QuickSearch_005'), // 事故人軍人證
        value: '4'
      }
    ],
    // 目前快捷專區狀態
    currentQuickSearchStatus: QuickSearchStatus.Default,
    // 目前快捷專區的搜尋案件詳細
    currentQuickSearchCaseDetail: {},
    isLoading: false,
    hasTransition: true,
    // 目前案件的OCR ID
    currentOcrId: '',
    // 刷新用
    caseResultKey: 0
  }),
  getters: {
    // 輸入框的placeholder
    inputPlaceHolder(state) {
      let selectOption = state.dropdownOptions.find((e) => e.hasOwnProperty('selected') && e.selected);
      if (isEmpty(selectOption)) selectOption = state.dropdownOptions[0];
      return language.translate('Stores_QuickSearch_006') + ` ${selectOption.name}`; // 請輸入
    },
    // 現在搜尋的案件(回傳是一個Array，這邊直接取第一筆，查詢結果為唯一的時候方便取用)
    caseDetail(state) {
      return state.currentQuickSearchCaseDetail?.queryClaimCaseRecords?.[0];
    },
    memoOptions() {
      return [
        {
          name: language.translate('Stores_QuickSearch_007'), // 請選擇類型
          value: '',
          selected: true
        },
        {
          name: language.translate('Common_NOTE_TYPE_001'), // 案件處理
          value: '1'
        },
        {
          name: language.translate('Common_NOTE_TYPE_002'), // 電聯經手人/客戶
          value: '2'
        },
        {
          name: language.translate('Common_NOTE_TYPE_003'), // 待會醫鑑
          value: '3'
        },
        {
          name: language.translate('Common_NOTE_TYPE_004'), // 寄送文件
          value: '4'
        },
        {
          name: language.translate('Common_NOTE_TYPE_005'), // NAP待回復
          value: '5'
        },
        {
          name: language.translate('Common_NOTE_TYPE_006'), // 其他
          value: '0'
        }
      ];
    },
    getRecordsCount(state) {
      return {
        countClaimRecords: state.currentQuickSearchCaseDetail?.countClaimRecords,
        countNotGiveBenefitRecords: state.currentQuickSearchCaseDetail?.countNotGiveBenefitRecords,
        countReleaseRecordCount: state.currentQuickSearchCaseDetail?.countReleaseRecordCount,
        countSpecialRecord: state.currentQuickSearchCaseDetail?.countSpecialRecord,
        countCompletionRecords: state.currentQuickSearchCaseDetail?.countCompletionRecords,
        countInspectRecords: state.currentQuickSearchCaseDetail?.countInspectRecords,
        countNoteRecords: state.currentQuickSearchCaseDetail?.countNoteRecords
      };
    }
  },
  actions: {
    /**
     * 快捷專區搜尋
     * @param {String} searchType 搜尋類型
     * @param {String} searchValue 搜尋值
     */
    async quickSearch(searchType, searchValue) {
      this.showLoading();
      const response = await apiQuickSearch([searchType, searchValue]);
      this.hideLoading();
      this.caseResultKey += 1;
      return response.data.result;
    },
    /**
     *
     * @param {String} applNo 受理編號
     * @param {MemoType} memoType 備註類型
     * @param {String} memo 備註
     */
    async insertMemo(applNo, memoType, memo) {
      this.showLoading();
      const response = await apiInsertMemo([applNo, memoType, memo]);
      this.hideLoading();
      return response.data.result;
    },

    // 重新搜尋一次(做資料更新)
    async refreshCaseDetail() {
      const response = await apiQuickSearch([searchType, searchValue]);
      currentQuickSearchCaseDetail = response;
    },

    async updateMemo(applyNo, memoNo, memoType, memo) {
      this.showLoading();
      const response = await apiUpdateMemo([applyNo, memoNo, memoType, memo]);
      this.hideLoading();
      return response.data.result;
    },

    async deleteMemo(applyNo, memoNo) {
      this.showLoading();
      const response = await apiDeleteMemo([applyNo, memoNo]);
      this.hideLoading();
      return response.data.result;
    },

    async pinMemo(applyNo, memoNo) {
      const response = await apiPinMemo([applyNo, memoNo]);
      return response.data.result;
    },

    async cancelPinMemo(applNo, memoNo) {
      const response = await apiCancelPinMemo([applNo, memoNo]);
      return response.data.result;
    }
  }
});
