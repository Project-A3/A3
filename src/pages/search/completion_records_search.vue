<template>
  <Layout class="search-completion completion-search">
    <section id="mainSection">
      <h2>補全案件</h2>

      <!-- Function Switch -->
      <div class="container function-switch">
        <a href="#">輸入功能</a>
        <a href="#" class="is-active">查詢功能</a>
      </div>

      <!-- Search Input Container -->
      <div class="container search-input">
        <div class="card">
          <div class="columns">
            <div class="column is-narrow">
              <RadioGroup v-model="searchObject" label="事故人ID" name="radioSearchType" :value="1"></RadioGroup>
            </div>
            <div class="column is-narrow">
              <RadioGroup v-model="searchObject" label="受理編號" name="radioSearchType" :value="2"></RadioGroup>
            </div>
            <div class="column is-narrow">
              <RadioGroup v-model="searchObject" label="送件人ID" name="radioSearchType" :value="3"></RadioGroup>
            </div>
            <div class="column is-narrow">
              <RadioGroup v-model="searchObject" label="輸入人員ID" name="radioSearchType" :value="4"></RadioGroup>
            </div>
          </div>
          <div class="columns second-columns">
            <div class="column is-narrow">
              <span class="field">補全輸入日區間</span>
              <input type="date" ref="pickerRef" />
            </div>
            <div class="column is-narrow ml-24">
              <span class="field">狀態</span>
              <BaseDropdown
                class="is-primary is-outline w-200"
                :options="canInputOptions"
                :onSelected="onDropdownSelected"
              ></BaseDropdown>
            </div>
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
        <!-- Table -->
        <table class="table is-striped-odd is-fullwidth" v-if="hasData">
          <thead>
            <tr>
              <th class="has-text-centered">序號</th>
              <th>受理編號</th>
              <th>事故人姓名</th>
              <th>送件人姓名</th>
              <th class="w-25percent">補件訊息</th>
              <th>自調病例醫院</th>
              <th>補全輸入日</th>
              <th>補全銷件日</th>
              <th>補全輸入單位</th>
              <th>補全輸入人員</th>
              <th>狀態</th>
              <th class="has-text-centered">事故人自助補全</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(record, index) in currentData" :key="record.APLY_NO">
              <td class="has-text-centered">{{ index + currentPageIndex.start }}</td>
              <td>{{ record.APLY_NO }}</td>
              <td>{{ record.OCR_NAME }}</td>
              <td>{{ record.TRAN_NAME }}</td>
              <td>
                  <template v-if="record.FU_IND === '3' && record.HOSP_CODE != null">{{ record.HOSP_NAME }}</template>
                  <template v-if="record.SER_NO_J011 === null">{{ record.TAIN_MSG }}</template>
                  <template v-if="record.SER_NO_J011 != null">
                    <a @click.stop.prevent="openAAJ0_0102(record.APLY_NO, record.REP_DOC_CODE, record.SER_NO_J011)">{{record.TAIN_MSG}}--{{record.PARAM_1}}</a>
                  </template>
                  <template v-if="record.CAN_INPUT_TIME === null || record.CAN_INPUT_TIME.$date === ''">
                    <template v-if="record.FU_IND === '3' && record.HOSP_CODE != null">
                      <br>
                      <button class="button is-primary is-outline" @click="downloadFile(record.EXAMPLE_FILE_PATH, record.EXAMPLE_FILE_MESSAGE, record.EXAMPLE_FILE_NAME)">範本</button>
                      <template v-if="record.REP_FILE_PATH === null || record.REP_FILE_PATH === ''">
                        <button class="button is-primary is-outline" @click="downloadFile(record.BLANK_FILE_PATH1, record.BLANK_FILE1_MESSAGE, record.BLANK_FILE_NAME1)">空白文件</button>
                      </template>
                      <template v-else>
                        <button class="button is-primary is-outline" @click="downloadFile(record.DOWNLOAD_FILE_PATH, record.DOWNLOAD_FILE_MESSAGE, record.DOWNLOAD_FILE_NAME)">下載文件</button>
                      </template>
                    </template>
                    <template v-if="record.FU_IND === '2'">
                      <template v-if="record.REP_FILE_PATH === null || record.REP_FILE_PATH === ''">
                        <button class="button is-primary is-outline" @click="downloadFile(record.BLANK_FILE_PATH2, record.BLANK_FILE2_MESSAGE, record.BLANK_FILE_NAME2)">空白文件</button>
                      </template>
                      <template v-else>
                        <button class="button is-primary is-outline" @click="downloadFile(record.DOWNLOAD_FILE_PATH, record.DOWNLOAD_FILE_MESSAGE, record.DOWNLOAD_FILE_NAME)">下載文件</button>
                      </template>
                    </template>
                    <template v-if="record.REP_DOC_CODE === '310044' && record.REP_FILE_PATH != null && record.REP_FILE_PATH != ''">
                      <button class="button is-primary is-outline" @click="downloadFile(record.DOWNLOAD_FILE_PATH, record.DOWNLOAD_FILE_MESSAGE, record.DOWNLOAD_FILE_NAME)">下載文件</button>
                    </template>
                  </template>
                  <template v-if="record.SEQ_NO_J020  != null"><br>{{ record.strOutput }}</template>
                  <template v-if="record.REP_DOC_CODE === '310071'">
                    <br> 
                    <span class="radio-group">
                      <input type="radio" class="radio-input" :id="`rb${record.APLY_NO}_${index}_1`" :name="`rb_name_${record.APLY_NO}_${index}_a`" :checked="record.STUDENT_IND == '1'" disabled>
                      <label :for="`rb${record.APLY_NO}_${index}_1`" class="radio-label is-dark has-option">
                        <span class="radio-button"></span> 是 
                      </label>
                    </span>
 
                    <span class="radio-group">
                      <input type="radio" class="radio-input" :id="`rb${record.APLY_NO}_${index}_2`" :name="`rb_name_${record.APLY_NO}_${index}_a`" :checked="record.STUDENT_IND == '0'" disabled>
                      <label :for="`rb${record.APLY_NO}_${index}_2`" class="radio-label is-dark has-option">
                        <span class="radio-button"></span> 否 被保險人確係本校學生並已參加學生團體保險
                      </label>
                    </span>

                    <br>
                    <template v-if="record.IS_APPLY === '1'">
                      <span class="radio-group">
                        <input type="radio" class="radio-input" :id="`rb${record.APLY_NO}_${index}_3`" :name="`rb_name_${record.APLY_NO}_${index}_b`" :checked="record.PROJ_IND == '1'" disabled>
                        <label :for="`rb${record.APLY_NO}_${index}_3`" class="radio-label is-dark has-option">
                          <span class="radio-button"></span> 符合 
                        </label>
                      </span>
  
                      <span class="radio-group">
                        <input type="radio" class="radio-input" :id="`rb${record.APLY_NO}_${index}_4`" :name="`rb_name_${record.APLY_NO}_${index}_b`" :checked="record.PROJ_IND == '0'" disabled>
                        <label :for="`rb${record.APLY_NO}_${index}_4`" class="radio-label is-dark has-option">
                          <span class="radio-button"></span> 不符合 高中以下學生暨幼兒園幼兒，符合保單條款第11條補助身分，申請專案補助重大手術保險金(符合免繳生身分)。
                        </label>
                      </span>                     
                    </template>
                  </template>
              </td>
              <td>{{ record.HOSP_NAME }}</td>
              <td>{{ record.KEYIN_TIME ? getROCDate(record.KEYIN_TIME.$date) : '' }}</td>
              <td>{{ record.CAN_INPUT_TIME ? getROCDate(record.CAN_INPUT_TIME.$date) : '' }}</td>
              <td>{{ record.KEYIN_DIV_NAME }}</td>
              <td>{{ record.KEYIN_NAME }}</td>
              <td>{{ record.CANCEL_IND === 'Y' ? '已取消' : '' }}</td>
              <td class="has-text-centered">
                <img
                  src="/src/assets/images/icon-complete-dark.svg"
                  alt="CHECKMARK"
                  v-if="(record.REP_STS_MI20 == '10' || record.REP_STS_MI20 == 'W') && record.COME_FROM == 'MML'"
                />
              </td>
            </tr>
          </tbody>
        </table>

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
import { apiQueryCompletionRecords } from '~/common/api';
import Pagination from '~/components/Pagination.vue';
import useDatetimePicker from '~/composables/useDatetimePicker';
import useMoment from '~/composables/useMoment';
import usePagination from '~/composables/usePagination';
import useSwal from '~/composables/useSwal';
import BaseDropdown from '../../components/BaseDropdown.vue';
import Layout from './components/Layout.vue';
import RadioGroup from './components/RadioGroup.vue';

  let pageTitle = '國泰理賠核心系統-補全查詢';

  const { getROCDate, diff } = useMoment();
  const { $swal } = useSwal();
  const isLoading = ref(false);

  // 查詢條件(不包含日期起迄、狀態)
  const searchObject = reactive({
    type: 1,
    fieldValue: ''
  });
  // 選擇查詢的狀態 預設全部
  const searchCanInput = ref('ALL');
  // 查詢區間 [start, end]
  const searchDateRange = ref(null);

  // 小日曆相關
  const pickerRef = ref(null);
  onMounted(() => {
    // 日期區間
    const { datetimePicker } = useDatetimePicker(pickerRef.value, { isRange: true, showClearButton: true, readonly: true });
    datetimePicker.onSave = async (CEDate, ROCDate) => {
      searchDateRange.value = CEDate;
    };
    datetimePicker.onClear = () => {
      datetimePicker.userInput.value = '';
      searchDateRange.value = null;
    };
  });

  // 分頁相關
  const { totalCounts, pageSize, currentData, currentPage, currentPageIndex, hasData, onPageChanged, setPageData } =
    usePagination();

  // 狀態下拉選單選項
  const canInputOptions = [
    {
      name: '全部狀態',
      value: 'ALL',
      selected: true
    },
    {
      name: '未銷件',
      value: 'N'
    },
    {
      name: '已銷件',
      value: 'Y'
    }
  ];

  const onDropdownSelected = (value) => {
    searchCanInput.value = value;
  };

  // 點擊查詢
  const onClickSearch = async () => {
    console.log(searchObject);

    // 檢核
    if (isEmpty(searchObject.fieldValue)) {
      $swal.fail('請輸入查詢條件');
      return;
    }
    if (searchDateRange.value && Math.abs(diff(searchDateRange.value[0], searchDateRange.value[1])) >= 7) {
      $swal.fail('補全輸入日區間最多選擇7天');
      return;
    }

    // show loading
    isLoading.value = true;

    /**
     * 1 => 事故人ID
     * 2 => 受理編號
     * 3 => 送件人ID
     * 4 => 輸入人員ID
     */
    const params = ['', '', '', '', '', '', '', ''];
    params[searchObject.type - 1] = searchObject.fieldValue;
    // 如果有輸入日期區間和狀態，params要加上區間和狀態
    params[4] = searchCanInput.value;
    if (searchDateRange.value) {
      params[6] = searchDateRange.value[0];
      params[7] = searchDateRange.value[1];
    }
    console.log(params);
    // params[0] = 'ERROR'; // 測試Error用
    const response = await apiQueryCompletionRecords(params);
    const result = response.data.result;
    if (result.IS_SUCCESS && result.RTN_CODE == '0') {
      // 設定分頁資料
      setPageData(result.DATA);
    } else {
      $swal.fail(result.RTN_MSG);
    }
    isLoading.value = false;
  };

  const openAAJ0_0102 = (APLY_NO, REP_DOC_CODE, SER_NO_J011) => {
    window.open(`/servlet/HttpDispatcher/AAJ0_0102/prompt?APLY_NO=${APLY_NO}&REP_DOC_CODE=${REP_DOC_CODE}&SER_NO_J011=${SER_NO_J011}&SRC=AAJ00400`);
  };

  const downloadFile = (FILE_PATH, FILE_MESSAGE, FILE_NAME) => {
    if(FILE_MESSAGE != null && FILE_MESSAGE != '') {
      $swal.warning(FILE_MESSAGE);
      return;
    }
    postWindowOpen('/servlet/HttpDispatcher/AAB3_1000/download',`downloadFilePath,${FILE_PATH},alterFileName,${FILE_NAME}`);
  };

  function postWindowOpen(url, data) {
    console.log('postWindowOpen url='+url);
    console.log('postWindowOpen data='+data);

    // input的key,value,key,value...
    var dataAry = data.split(',');
	  console.log('dataAry='+ dataAry.length);

    // 產生一個暫存的form
    var tempForm = document.createElement("form");
    tempForm.id = "tempForm1";
    tempForm.method = "get";
    tempForm.action = url;
    tempForm.target = '_self';
    tempForm.accept="BIG5";
    tempForm.acceptCharset="BIG5";

    // 產生hidden Input
    for(let i=0 ; i<dataAry.length ; i=i+2){
    	var hideInput = document.createElement("input");
      hideInput.type = "hidden";
      hideInput.name = dataAry[i];
      hideInput.value = dataAry[i+1];
     	// 把Input 放進 form
    	tempForm.appendChild(hideInput);
	  } 

    document.body.appendChild(tempForm);
    tempForm.submit();
    document.body.removeChild(tempForm);
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
