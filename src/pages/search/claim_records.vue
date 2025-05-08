<template>
  <Layout>
    <section id="mainSection" class="claim-records">
      <h2>理賠紀錄查詢</h2>

      <!-- Search Input Container -->
      <div class="container search-input">
        <div class="card">
          <div class="columns">
            <div class="column is-narrow p-0">
              <RadioGroup v-model="searchObject" label="事故人ID" name="radioSearchType" :value="1"></RadioGroup>
            </div>
            <div class="column is-narrow">
              <RadioGroup 
                v-model="searchObject"
                label="保單號碼"
                name="radioSearchType"
                :value="2"
                tippy="僅可查詢送件保單"
                :onInputBlur="onPolicyNoChange"
                v-on:change="onPolicyNoChange($event.target.closest('.radio-group').nextElementSibling.value)"
              ></RadioGroup>
              <BaseDropdown
                class="w-200"
                :onSelected="onDropdownSelected"
                :options="dropdownOptions"
                :isLoading="isDropdownLoading"
              ></BaseDropdown>
            </div>
            <div class="column is-narrow">
              <RadioGroup v-model="searchObject" label="受理編號" name="radioSearchType" :value="3"></RadioGroup>
            </div>
            <div class="column is-narrow">
              <span class="field">給付期間</span>
              <input type="date" ref="pickerRef" />
              <BaseDropdown
                class="is-primary is-outline w-200"
                :options="lastYearsOptions"
                :onSelected="onLastYearsDropdownSelected"
                :onCleared="onLastYearsDropdownCleared"
              ></BaseDropdown>
            </div>
            <!-- <div class="column is-narrow">
              <RadioGroup v-model="searchObject" label="員工ID" name="radioSearchType" :value="4" tippy="限團險"></RadioGroup>
            </div> -->
          </div>
        </div>

        <div class="columns mt-3">
          <div class="column hor-center">
            <button class="button is-primary big-btn" @click="onClickSearch">查詢</button>
          </div>
        </div>
      </div>

      <!-- Search Result Container -->
      <div class="container search-result">
        <div class="ocr-info" v-if="!isEmpty(ocrInfo)">
          <h3>事故人資料</h3>
          <div class="card">
            <div class="columns">
              <div class="column is-narrow">
                <span class="field">ID</span>
                <span class="data mr-90">{{ ocrInfo.OCR_ID }}</span>
              </div>
              <div class="column is-narrow">
                <span class="field">姓名</span>
                <span class="data mr-90 font-eudc">{{ ocrInfo.OCR_NAME }}</span>
              </div>
              <div class="column is-narrow">
                <span class="field">出生日期</span>
                <span class="data mr-90">{{ getROCDate(ocrInfo.OCR_BRDY) }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="payment-item" v-if="paymentItems.length > 0">
          <h4>給付項目</h4>
          <!-- Table -->
          <div class="data-horizontal-table">
            <!-- Table Head -->
            <div class="columns thead">
              <div class="column is-half p-0">
                <div class="columns">
                  <div class="column is-1 hor-center">
                    <span class="field">序號</span>
                  </div>
                  <div class="column">
                    <span class="field">保單號碼</span>
                  </div>
                  <div class="column is-fixed-width">
                    <span class="field">醫療合併</span>
                  </div>
                  <div class="column is-fixed-width">
                    <span class="field">壽險不給付項目</span>
                  </div>
                  <div class="column is-fixed-width">
                    <span class="field">溢付未結案紀錄</span>
                  </div>
                </div>
              </div>
              <div class="column is-half p-0">
                <div class="columns">
                  <div class="column is-1 hor-center">
                    <span class="field">序號</span>
                  </div>
                  <div class="column">
                    <span class="field">保單號碼</span>
                  </div>
                  <div class="column is-fixed-width">
                    <span class="field">醫療合併</span>
                  </div>
                  <div class="column is-fixed-width">
                    <span class="field">壽險不給付項目</span>
                  </div>
                  <div class="column is-fixed-width">
                    <span class="field">溢付未結案紀錄</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Table Body -->
            <div class="columns is-multiline tbody">
              <!-- First Column -->
              <div class="column p-0 is-12">
                <div class="columns is-flex-wrap-wrap">
                  <!-- 表格資料 -->
                  <div class="column is-half border-right p-0" v-for="(payment, index) in paymentItems" :key="payment.POLICY_NO">
                    <div class="columns">
                      <div class="column is-1 hor-center">
                        <span class="data">{{ index + 1 }}</span>
                      </div>
                      <div class="column">
                        <span class="data">{{ payment.POLICY_NO }}</span>
                      </div>
                      <div class="column is-fixed-width">
                        <span class="data"
                          ><a href="javascript:void(0)" @click.stop="onClickMergeCount(payment.POLICY_NO)"
                            >{{ payment.count1 }}件</a
                          ></span
                        >
                      </div>
                      <div class="column is-fixed-width">
                        <span class="data"
                          ><a href="javascript:void(0)" @click.stop="onClickNotGiveCount(payment.POLICY_NO, payment.ocrId)"
                            >{{ payment.count2 }}件</a
                          ></span
                        >
                      </div>
                      <div class="column is-fixed-width">
                        <span class="data"
                          ><a href="javascript:void(0)" @click.stop="onClickOverflowCount(payment.POLICY_NO)"
                            >{{ payment.count3 }}件</a
                          ></span
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <Tabs v-if="medicalMpRecords.length > 0 || notMedicalMpRecords.length > 0" @onTabClick="onTabChanged" :key="tabsKey">
          <Tab :title="`醫療紀錄(${medicalMpRecords.length})`" :isActive="true">
            <table class="table is-striped-odd is-fullwidth" v-if="currentTabIndex === 0">
              <thead>
                <tr>
                  <th class="has-text-centered">序號</th>
                  <th>受理編號</th>
                  <SortingThead sortKey="OCR_ID" :currentSortKey="sortName" :isSortDesc="isSortDesc" :onClickSort="onClickSort"
                    >事故人 ID
                  </SortingThead>
                  <th>申請對象</th>
                  <th>給付險別</th>
                  <SortingThead
                    sortKey="CLAM_AMT_CODE"
                    :currentSortKey="sortName"
                    :isSortDesc="isSortDesc"
                    :onClickSort="onClickSort"
                    >給付項目
                  </SortingThead>
                  <th class="has-text-right">保額</th>
                  <th>保單號碼</th>
                  <SortingThead
                    sortKey="ACNT_DATE.$date"
                    :currentSortKey="sortName"
                    :isSortDesc="isSortDesc"
                    :onClickSort="onClickSort"
                    >給付日期
                  </SortingThead>
                  <SortingThead
                    sortKey="NEW_OCR_DATE.$date"
                    :currentSortKey="sortName"
                    :isSortDesc="isSortDesc"
                    :onClickSort="onClickSort"
                    >住/出院(門診)日
                  </SortingThead>
                  <th>事故原因</th>
                  <th>門診/核定次數</th>
                  <th>住院/核定日數</th>
                  <th class="has-text-right">給付金額</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(medicalRecord, index) in currentData"
                  :key="index + currentPageIndex.start"
                  :class="{ 'has-danger-text': medicalRecord.SPEC_RED === 'Y' }"
                >
                  <td class="has-text-centered">{{ index + currentPageIndex.start }}</td>
                  <td class="w-160">
                   <!-- <a :href="medicalRecord.APLY_NO_LINK" target="_blank" class="is-secondary">{{
                      medicalRecord.APLY_NO_SHOW
                    }}</a> -->

                    <a href="#" target="_blank" class="is-secondary" @click.stop.prevent="onClickApplyNo(medicalRecord.APLY_NO, medicalRecord.APLY_NO_2, medicalRecord.CARE_EMP_NAME, medicalRecord.APLY_NO_LINK)">
                      {{ medicalRecord.APLY_NO_SHOW }}
                    </a>
                  </td>
                  <td>{{ medicalRecord.OCR_ID }}</td>
                  <td>{{ medicalRecord.ROLE_SHOW }}</td>
                  <td>{{ medicalRecord.PROD_ID }} {{ medicalRecord.PROD_ID_NAME }}</td>
                  <td>{{ medicalRecord.CLAM_AMT_NAME }}</td>
                  <td class="has-text-right">{{ medicalRecord.FACE_AMT }}單位</td>
                  <td>{{ medicalRecord.POLICY_NO }}</td>
                  <td>{{ handleSdate(medicalRecord.ACNT_DATE) }}</td>
                  <td>
                    <a
                      v-if="medicalRecord.HP_LINK === 'Y'"
                      href="javascript:void(0)"
                      @click.stop="openMedicalDaysModal(medicalRecord)"
                    >
                      {{ getROCDate(medicalRecord.HP_STR_DATE) }}/{{ getROCDate(medicalRecord.HP_END_DATE) }}
                    </a>
                    <span v-else>{{ getROCDate(medicalRecord.HP_STR_DATE) }}/{{ getROCDate(medicalRecord.HP_END_DATE) }}</span>
                  </td>
                  <td>
                    <EllipseTippy :content="medicalRecord.ICD_NAME" :disableEllipse="true">
                      {{ medicalRecord.ICD_CODE }}
                    </EllipseTippy>
                  </td>
                  <td>{{ medicalRecord.MED_APLY_DAY }}/{{ medicalRecord.MED_PAY_DAY }}</td>
                  <td>{{ medicalRecord.HSP_APLY_DAY }}/{{ medicalRecord.HSP_PAY_DAY }}</td>
                  <td class="has-text-right">{{ toCurrency(parseFloat(medicalRecord.PAY_AMT)) }}</td>
                </tr>
              </tbody>
            </table>
            <!-- 當使用保單編號 + 險別搜尋時才顯示 -->
            <div class="table-total" v-if="isAmountAreaShow">
              <div class="tile-content">
                <div class="tile is-ancestor">
                  <div class="tile is-parent">
                    <span class="title">{{ searchProdName === '請選擇' ? '' : searchProdName }}</span>
                  </div>
                  <div class="tile is-parent is-vertical pr-0">
                    <div class="tile is-child">
                      <span class="field">已理賠金額</span>
                      <span class="amount">{{ toCurrency(amountObject.medical.TOT_AMT, '') }}</span>
                      <span class="field dollar">元</span>
                    </div>
                    <div class="tile is-child hidden-info">
                      <span class="field">帳戶餘額</span>
                      <span class="amount">{{ toCurrency(amountObject.medical.ACC_AMT, '') }}</span>
                      <span class="field dollar">元</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Tab>
          <Tab :title="`死殘紀錄(${notMedicalMpRecords.length})`">
            <table class="table is-striped-odd is-fullwidth" v-if="currentTabIndex === 1">
              <thead>
                <tr>
                  <th class="has-text-centered">序號</th>
                  <th>受理編號</th>
                  <SortingThead sortKey="OCR_ID" :currentSortKey="sortName" :isSortDesc="isSortDesc" :onClickSort="onClickSort"
                    >事故人 ID
                  </SortingThead>
                  <th>申請對象</th>
                  <th>給付險別</th>
                  <SortingThead
                    sortKey="CLAM_AMT_CODE"
                    :currentSortKey="sortName"
                    :isSortDesc="isSortDesc"
                    :onClickSort="onClickSort"
                    >給付項目
                  </SortingThead>
                  <th>失能等級(表)</th>
                  <th>項次(比例)</th>
                  <th>保單號碼</th>
                  <SortingThead sortKey="ICD_CODE" :currentSortKey="sortName" :isSortDesc="isSortDesc" :onClickSort="onClickSort"
                    >事故原因
                  </SortingThead>
                  <th>死殘核定日</th>
                  <th>給付日期</th>
                  <th class="has-text-right">給付金額</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(notMedicalMpRecord, index) in currentData"
                  :key="index + currentPageIndex.start"
                  :class="{ 'has-danger-text': notMedicalMpRecord.SPEC_RED === 'Y' }"
                >
                  <td class="has-text-centered">{{ index + currentPageIndex.start }}</td>
                  <td class="w-160">
                   <!-- <a :href="notMedicalMpRecord.APLY_NO_LINK" target="_blank" class="is-secondary">{{
                      notMedicalMpRecord.APLY_NO_SHOW
                    }}</a> -->

                    <a href="#" target="_blank" class="is-secondary" @click.stop.prevent="onClickApplyNo(notMedicalMpRecord.APLY_NO, notMedicalMpRecord.APLY_NO_2, notMedicalMpRecord.CARE_EMP_NAME, notMedicalMpRecord.APLY_NO_LINK)">
                      {{ notMedicalMpRecord.APLY_NO_SHOW }}
                    </a>
                  </td>
                  <td>{{ notMedicalMpRecord.OCR_ID }}</td>
                  <td>{{ notMedicalMpRecord.ROLE_SHOW }}</td>
                  <td>{{ notMedicalMpRecord.PROD_ID }} {{ notMedicalMpRecord.PROD_ID_NAME }}</td>
                  <td>{{ notMedicalMpRecord.CLAM_AMT_NAME }}</td>
                  <td class="has-border-left">{{ notMedicalMpRecord.DISB_GRAD_NAME }}</td>
                  <td class="has-border-right">{{ notMedicalMpRecord.DISB_INFO }}</td>
                  <td>{{ notMedicalMpRecord.POLICY_NO }}</td>
                  <td>
                    <EllipseTippy :content="notMedicalMpRecord.ICD_NAME" disableEllipse>
                      {{ notMedicalMpRecord.ICD_CODE }}
                    </EllipseTippy>
                  </td>
                  <td>{{ handleSdate(notMedicalMpRecord.NEW_OCR_DATE) }}</td>
                  <td>{{ handleSdate(notMedicalMpRecord.ACNT_DATE) }}</td>
                  <td class="has-text-right">{{ toCurrency(parseFloat(notMedicalMpRecord.PAY_AMT)) }}</td>
                </tr>
              </tbody>
            </table>
            <!-- 當使用保單編號 + 險別搜尋時才顯示 -->
            <div class="table-total" v-if="isAmountAreaShow">
              <div class="tile-content">
                <div class="tile is-ancestor">
                  <div class="tile is-parent">
                    <span class="title">{{ searchProdName === '請選擇' ? '' : searchProdName }}</span>
                  </div>
                  <div class="tile is-parent is-vertical pr-0">
                    <div class="tile is-child">
                      <span class="field">已理賠金額</span>
                      <span class="amount">{{ toCurrency(amountObject.notMedical.TOT_AMT, '') }}</span>
                      <span class="field dollar">元</span>
                    </div>
                    <div class="tile is-child hidden-info">
                      <span class="field">帳戶餘額</span>
                      <span class="amount">{{ toCurrency(amountObject.notMedical.ACC_AMT, '') }}</span>
                      <span class="field dollar">元</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Tab>
        </Tabs>

        <!-- Pagination & Info  -->
        <div class="number-of-data-info" v-if="hasData">
          顯示<span>{{ currentPageIndex.start }}</span
          >-<span>{{ currentPageIndex.end }}</span
          >則內容，共<span>{{ totalCounts }}</span
          >則
        </div>
        <Pagination
          :total="totalCounts"
          :pageSize="pageSize"
          :currentPage="currentPage"
          @onPageChanged="onPageChanged"
        ></Pagination>
      </div>
      <div class="button-scroll-to-top">回到頂部</div>
    </section>
  </Layout>
  <Loading :active="isLoading" :can-cancel="false" :is-full-page="true" color="#6fba2a"></Loading>
</template>
<script setup>
  import { isEmpty } from 'lodash-es';
import Loading from 'vue-loading-overlay';
import {
  apiCountMergeRecords,
  apiCountNotGiveBenefitRecords,
  apiCountOverflowPaymentRecords,
  apiQueryClaimRecords,
  apiQueryMedicalDayDetail,
  apiQueryPaymentItemsPolicyNo,
  apiQueryProdIdAndProdName
} from '~/common/api';
import { toCurrency } from '~/common/utils';
import Pagination from '~/components/Pagination.vue';
import SortingThead from '~/components/SortingThead.vue';
import useDatetimePicker from '~/composables/useDatetimePicker';
import useMoment from '~/composables/useMoment';
import usePagination from '~/composables/usePagination';
import useSwal from '~/composables/useSwal';
import useTableSort from '~/composables/useTableSort';
import BaseDropdown from '../../components/BaseDropdown.vue';
import EllipseTippy from '../../components/EllipseTippy.vue';
import Tab from '../../components/Tabs/Tab.vue';
import Tabs from '../../components/Tabs/Tabs.vue';
import useModal from '../../composables/useModal';
import Layout from './components/Layout.vue';
import MedicalDaysRecordModal from './components/Modals/MedicalDaysRecordModal.vue';
import RadioGroup from './components/RadioGroup.vue';

  const { $m } = useModal();

  let pageTitle = '國泰理賠核心系統-理賠紀錄查詢';

  const { getROCDate, now, add, isValidDate } = useMoment();
  const { $swal } = useSwal();
  const isLoading = ref(false);
  // 分頁相關
  const {
    totalCounts,
    pageSize,
    currentData,
    currentPage,
    currentPageIndex,
    hasData,
    onPageChanged,
    setPageData,
    fullData,
    reChunkData
  } = usePagination();

  // 排序相關
  const { sortName, isSortDesc, setSort } = useTableSort(fullData);

  const onClickSort = (key) => {
    setSort(key);
    reChunkData();
  };

  // 查詢條件(不包含險別)
  const searchObject = reactive({
    type: 1,
    fieldValue: ''
  });

  // 選擇的險別代碼(查詢保單號碼時才會送)
  const selectedProdId = ref('');
  // 險別名稱: 查完結果才會改變，只用在金額區塊內的險別名稱
  const searchProdName = ref('');
  const isDropdownLoading = ref(false);

  // 險別下拉選單資料
  // 下拉選單資料是撈取API來的，預設只給請選擇

  const dropdownOptions = ref([
    {
      name: '請選擇',
      value: '',
      selected: true
    }
  ]);

  const cleanOptions = () => {
    dropdownOptions.value = [
      {
        name: '請選擇',
        value: '',
        selected: true
      }
    ];
  };

  const onDropdownSelected = (value) => {
    selectedProdId.value = value;
  };

  watch(searchObject, (oldValue, newValue) => {
    cleanOptions();
    selectedProdId.value = '';
  });

  // 查詢區間 [start, end]
  const searchDateRange = ref([]);

  // 小日曆相關
  const pickerRef = ref(null);
  const datetimePickerRef = ref(null);
  onMounted(() => {
    // 日期區間
    let pOption = { showClearButton: true, isRange: true, placeholder: '請選擇日期區間', closeOnSelect: true, maxDate: now('YYYY-MM-DD') };
    const { datetimePicker } = useDatetimePicker(pickerRef.value, pOption);

    datetimePicker.onSave = async (CEDate, ROCDate) => {
      clearYearsDropdownCleared();
      searchDateRange.value = CEDate;
    };

    datetimePicker.onInputChange = (startDate, endDate) => {
      clearYearsDropdownCleared();
      searchDateRange.value = [startDate, endDate];
    };

    datetimePicker.onClear = () => {
      clearYearsDropdownCleared();
      clearSearchDateRange();
    };

    datetimePickerRef.value = datetimePicker;
  });

  // 給付期間下拉選單選項
  const lastYearsOptions = ref([
    { name: '請選擇',
      value: '',
      selected: true
    },
    {
      name: '近一年',
      value: '-1'
    },
    {
      name: '近兩年',
      value: '-2'
    },
    {
      name: '近三年',
      value: '-3'
    },
    {
      name: '近四年',
      value: '-4'
    },
    {
      name: '近五年',
      value: '-5'
    }
  ]);

  // 給付期間下拉選單選項選擇event
  const onLastYearsDropdownSelected = (value) => {
    if(value){
      let endDate = now('YYYY-MM-DD');
      let startDate = add(endDate, value,'year');
      
      datetimePickerRef.value.value(`${startDate} ~ ${endDate}`);
      searchDateRange.value = [startDate, endDate];
    } else {
      clearSearchDateRange();
    }
  };

  // 給付期間下拉選單選項清除event
  const onLastYearsDropdownCleared = () => {
    clearYearsDropdownCleared();
    clearSearchDateRange();
  };

  // 清除給付期間下拉選單選
  const clearYearsDropdownCleared = () => {
    lastYearsOptions.value[0].selected = true;
  }

  // 清除給付期間
  const clearSearchDateRange = () => {
    datetimePickerRef.value.clear();
    searchDateRange.value = [];
  }

  // 保單號碼blur時
  const onPolicyNoChange = async (value) => {
    isDropdownLoading.value = true;
    selectedProdId.value = '';
    const response = await apiQueryProdIdAndProdName([value]);
    const result = response.data.result;
    if (result.IS_SUCCESS) {
      cleanOptions();
      result.DATA.forEach((e) => {
        dropdownOptions.value.push({
          name: e.PROD_ID_NAME,
          value: e.PROD_ID
        });
      });
    }
    isDropdownLoading.value = false;
  };

  // 事故人資料
  const ocrInfo = ref(null);
  // 給付項目
  const paymentItems = ref([]);
  // 醫療紀錄
  const medicalMpRecords = ref([]);
  // 死殘紀錄
  const notMedicalMpRecords = ref([]);
  // 金額
  const amountObject = reactive({
    medical: {
      ACC_AMT: 0,
      TOT_AMT: 0
    },
    notMedical: {
      ACC_AMT: 0,
      TOT_AMT: 0
    }
  });
  // 是否顯示金額區塊
  const isAmountAreaShow = ref(false);

  // 頁籤的Key, 用來刷新component
  let tabsKey = ref(0);
  // 目前停留在哪個頁籤
  let currentTabIndex = ref(0);

  // 驗證查詢區間
  const validSearchDates = (searchDates) => {
    if (isEmpty(searchDates)) {
      return true;
    }

    if (searchDates.includes('~')) {
      let rangeDates = searchDates.split('~');
      if (!((isValidDate(rangeDates[0], 'YY-MM-DD', true) || isValidDate(rangeDates[0], 'YYY-MM-DD', true)) &&
          (isValidDate(rangeDates[1], 'YY-MM-DD', true) || isValidDate(rangeDates[1], 'YYY-MM-DD', true)))) {
        return false;
      }
    } else {
      return false;
    }

    return true;
  }
  // 點擊查詢
  const onClickSearch = async () => {
    // 檢核
    if (isEmpty(searchObject.fieldValue)) {
      $swal.fail('請輸入查詢條件');
      return;
    }

    if (!validSearchDates(datetimePickerRef.value?.userInput.value)) {
      $swal.fail(`給付期間格式錯誤，格式為\nyyy-mm-dd~yyy-mm-dd：\n${datetimePickerRef.value?.userInput.value}`);
      return;
    }

    isLoading.value = true;

    /**
     * 1 => 事故人ID map 4
     * 2 => 保單號碼 map 1
     * 3 => 受理編號 map 3
     * 4 => 員工ID map 5
     */
    const paramMapping = [
      ['', '', '', searchObject.fieldValue, ''],
      [searchObject.fieldValue, selectedProdId.value, '', '', ''], // 下拉選單選擇時要放進險別
      ['', '', searchObject.fieldValue, '', ''],
      ['', '', '', '', searchObject.fieldValue]
    ];
    let params = paramMapping[searchObject.type - 1];
    console.log(params);
    let params1 = [...params];
    let params2 = [...params];

    params1.push(searchDateRange.value[0]);
    params1.push(searchDateRange.value[1]);
    // params[0] = 'ERROR'; //測試Error用
    // call api search
    const responses = await Promise.all([apiQueryClaimRecords(params1), apiQueryPaymentItemsPolicyNo(params2)]);
    // 查詢結果
    await handleResult('SEARCH', responses[0].data.result);
    // 給付項目結果(故意不await 避免UI卡在這)
    handleResult('PAYMENT', responses[1].data.result, ocrInfo.value?.OCR_ID);

    isLoading.value = false;
  };

  // 處理API的回傳結果
  const handleResult = async (type, result, ocrId = '') => {
    if (type === 'SEARCH') {
      console.log(result);
      if (result.IS_SUCCESS && result.RTN_CODE == '0') {
        // 事故人資料
        ocrInfo.value = result?.OCR_INFO;

        // 將頁籤資料存起來
        medicalMpRecords.value = result.MEDICAL_MP.DATA ?? [];
        notMedicalMpRecords.value = result.NOTMEDICAL_MP.DATA ?? [];

        // 金額資料
        amountObject.medical.ACC_AMT = result?.MEDICAL_MP.ACC_AMT;
        amountObject.medical.TOT_AMT = result?.MEDICAL_MP.TOT_AMT;
        amountObject.notMedical.ACC_AMT = result?.NOTMEDICAL_MP.ACC_AMT;
        amountObject.notMedical.TOT_AMT = result?.NOTMEDICAL_MP.TOT_AMT;
        // 險別名稱
        searchProdName.value = dropdownOptions.value.find((e) => e.selected === true).name;
        // 當使用保單編號 + 險別搜尋時才顯示金額區塊
        // isAmountAreaShow.value = searchObject.type === 2 && !isEmpty(selectedProdId.value);
        isAmountAreaShow.value = true; // 調整成固定出現

        // 設定分頁資料(預設醫療紀錄)
        onTabChanged(0);

        tabsKey.value++;
      } else {
        medicalMpRecords.value = [];
        notMedicalMpRecords.value = [];
        setPageData([]);
        $swal.fail(result.RTN_MSG);
      }
    } else if (type === 'PAYMENT') {
      const paymentsResult = result;
      if (paymentsResult.IS_SUCCESS) {
        console.log(paymentsResult);

        //LICXS-661，保單號碼查詢，查無資料，放入輸入的保單號碼做後續查詢處理
        if(paymentsResult.ERR_CODE == '-101' && searchObject.type == '2'){
          paymentsResult.DATA = [searchObject.fieldValue]
        }

        paymentItems.value = [];
        for (const policyNo of paymentsResult.DATA) {
          let item = {
            POLICY_NO: policyNo,
            count1: 0,
            count2: 0,
            count3: 0,
            ocrId
          };
          let countResponse = await Promise.all([
            apiCountMergeRecords([policyNo]),
            apiCountNotGiveBenefitRecords([policyNo, ocrId, '', '']),
            apiCountOverflowPaymentRecords([policyNo, ocrId])
          ]);

          item.count1 = countResponse[0].data.result;
          item.count2 = countResponse[1].data.result;
          item.count3 = countResponse[2].data.result;
          paymentItems.value.push(item);
        }
      }
    }
  };

  // 點擊醫療合併紀錄件數連結
  const onClickMergeCount = (policyNo) => {
    window.open(`/servlet/HttpDispatcher/AAE0_0800/query?POLICY_NO=${policyNo}&LINK_FROM=AAE00600`);
  };

  // 點擊不給付紀錄件數連結
  const router = useRouter();
  const onClickNotGiveCount = (policyNo, ocrId = '') => {
    let query = { t: 2, q: policyNo };
    if (ocrId) {
      query.t = 4;
      query.q = `${ocrId},${policyNo}`;
    }
    let routeData = router.resolve({
      path: '/search/not_give_benefit_records',
      query
    });
    window.open(routeData.href);
  };

  // 點擊未結案溢付紀錄件數連結
  const onClickOverflowCount = (policyNo) => {
    window.open(`/servlet/HttpDispatcher/AAY1_0200/query?newTxRequest=false&syscode=AA&subcode=AAE0&POLICY_NO=${policyNo}`);
  };

  // 頁籤切換時Trigger
  const onTabChanged = (index, id) => {
    // console.log('tab change');
    currentTabIndex.value = index;
    index == 0 ? setPageData(medicalMpRecords.value) : setPageData(notMedicalMpRecords.value);
  };

  // 打開醫療天數Modal
  const openMedicalDaysModal = async (record) => {
    isLoading.value = true;
    console.log(record);
    // 呼叫API
    let response = await apiQueryMedicalDayDetail([
      record.POLICY_NO,
      record.APLY_NO,
      record.CLAM_CAT,
      record.PROD_ID,
      record.OCR_ID,
      record.CLAM_AMT_CODE,
      record.SER_NO,
      record.PROD_ID_NAME,
      record.CLAM_AMT_NAME
    ]);
    let result = response.data.result;
    if (result.IS_SUCCESS && isEmpty(result.ERR_CODE)) {
      $m.show({ component: MedicalDaysRecordModal, id: 'medicalDaysRecord', data: result });
    } else {
      $swal.fail(`${result.ERR_CODE}:${result.RTN_MSG}`);
    }
    isLoading.value = false;
  };

  // 受理編號開啟連結
  const onClickApplyNo = (applyNo, applyNo2, careEmpName, aplyNoLink) => {
    if (applyNo2 === 'OL' || applyNo2 === 'DA') {
      window.open(aplyNoLink,'_blank','noopener, noreferrer');
    } else {
      if (careEmpName === 'WRA3') {
        // 開在同一視窗 router.push
        // router.push({ name: 'master-page', params: { page: 'apply' }, query: { q: applyNo } }); 
        
        // 另開視窗 router.resolve
        let queryObject =  { q: applyNo };     
        let routeData = router.resolve({
          path: '/master/apply',
          query: queryObject
        });
        
        window.open(routeData.href, '_blank'); // 開案件
        window.open(`/servlet/HttpDispatcher/AAZ3_0100/prompt?APLY_NO=${applyNo}`,'_blank'); // 開影像
      } else {
        // location.href = `/AAWeb/servlet/HttpDispatcher/AAE0_0500/prompt?LINK_PARAM=${applyNo}&OPEN_IMG=Y`;
        // location.href = `/AAWeb/servlet/HttpDispatcher/AAA0_0800/prompt?LINK_PARAM=${applyNo}`;
        window.open(`/servlet/HttpDispatcher/AAE0_0500/prompt?LINK_PARAM=${applyNo}&OPEN_IMG=Y`, '_blank');
       }
    } 
  };

  const handleSdate = (dateObj) => {
    let date = dateObj ? getROCDate(dateObj.$date) : '';
    return date;
  };

  // 如果網址有帶查詢條件，要先執行一次查詢
  const route = useRoute();
  let t = route.query?.t; // t => 查詢類型
  let q = route.query?.q; // q => 查詢文字
  // 兩個都有帶才做查詢
  if (t && q) {
    searchObject.type = parseInt(t);
    searchObject.fieldValue = q.toUpperCase();
    onClickSearch();
  }
  onMounted(() => {
    // TODO: 設定title
    document.title = pageTitle;
  });
</script>
