<template>
  <Layout class="search-notpay">
    <section id="mainSection">
      <h2>不給付紀錄查詢</h2>

      <!-- Search Input Container -->
      <div class="container search-input" v-if="searchObject.type !== 4">
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
              ></RadioGroup>
            </div>
            <div class="column is-narrow">
              <RadioGroup v-model="searchObject" label="受理編號" name="radioSearchType" :value="3"></RadioGroup>
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
        <div class="card mb-5" v-if="searchObject.type === 4">
          <div class="columns">
            <div class="column is-narrow">
              <span class="field">事故人ID</span><span class="data mr-90">{{ searchObject.fieldValue.split(',')[0] }}</span>
            </div>
            <div class="column is-narrow">
              <span class="field">保單號碼</span><span class="data mr-90">{{ searchObject.fieldValue.split(',')[1] }}</span>
            </div>
          </div>
        </div>

        <!-- Table -->
        <table class="table is-striped-odd is-fullwidth" v-if="hasData">
          <thead>
            <tr>
              <th class="has-text-centered">序號</th>
              <th>受理編號</th>
              <th>事故人 ID</th>
              <th>事故人姓名</th>
              <th>保單號碼</th>
              <th>險別代號</th>
              <th>理賠項目</th>
              <th class="has-text-centered">疾病代碼</th>
              <th>事故日期</th>
              <th>覆核日期</th>
              <th>退件代碼</th>
              <th>核賠科別/人員</th>
              <th>送件單位/送件人ID</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(record, index) in currentData" :key="record.APLY_NO">
              <td class="has-text-centered">{{ index + currentPageIndex.start }}</td>
              <td class="w-160">
                <!-- <a
                  :href="`/AAWeb/servlet/HttpDispatcher/AAE0_0500/prompt?LINK_PARAM=${record.APLY_NO_SHOW}&OPEN_IMG=Y`"
                  target="_blank"
                  class="is-secondary"
                  v-if="record.APLY_NO_LINK === 'Y'"
                  >{{ record.APLY_NO_SHOW }}</a
                > -->
                
                <a href="#" target="_blank" class="is-secondary" v-if="record.APLY_NO_LINK === 'Y'" @click.stop.prevent="onClickApplyNo(record.APLY_NO, record.CARE_EMP_NAME)">
                  {{ record.APLY_NO_SHOW }}
                </a>
                <span v-else>{{ record.APLY_NO_SHOW }}</span>
              </td>
              <td>{{ record.OCR_ID }}</td>
              <td>{{ record.OCR_NAME }}</td>
              <td>{{ record.POLICY_NO }}</td>
              <td>{{ record.PROD_ID }} {{ record.PROD_NAME }}</td>
              <td>{{ record.CLAM_AMT_NAME }}</td>
              <td class="has-text-centered">
                <EllipseTippy
                  v-for="icd in record.ICD_LIST"
                  :key="Object.keys(icd)[0]"
                  :content="Object.values(icd)[0]"
                  disableEllipse
                >
                  <p>{{ Object.keys(icd)[0] }}</p>
                </EllipseTippy>
              </td>
              <td>{{ getROCDate(record.OCR_DATE) }}</td>
              <td>{{ getROCDate(record.APRV_DATE) }}</td>
              <td>
                <EllipseTippy :content="record.RJCT_RESN_MEMO" disableEllipse>
                  {{ record.RJCT_RESN }}
                </EllipseTippy>
              </td>
              <td>
                <EllipseTippy :content="`${record.CLAM_DIV_NAME}#${record.CLAM_ID_EXT}`" disableEllipse>
                  {{ record.CLAM_DIV_NO }}/{{ record.CLAM_NAME }}
                </EllipseTippy>
              </td>
              <td>
                {{ record.TRN_DIV_NO }}/<br />
                {{ record.TRN_ID }}
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
import { apiQueryNotGiveBenefitRecords } from '~/common/api';
import EllipseTippy from '~/components/EllipseTippy.vue';
import Pagination from '~/components/Pagination.vue';
import useMoment from '~/composables/useMoment';
import usePagination from '~/composables/usePagination';
import useSwal from '~/composables/useSwal';
import Layout from './components/Layout.vue';
import RadioGroup from './components/RadioGroup.vue';
  const { getROCDate } = useMoment();
  const { $swal } = useSwal();
  const isLoading = ref(false);
  let pageTitle = '國泰理賠核心系統-不給付紀錄查詢';
  // 分頁相關
  const { totalCounts, pageSize, currentData, currentPage, currentPageIndex, hasData, onPageChanged, setPageData } =
    usePagination();

  const searchObject = reactive({
    type: 2,
    fieldValue: ''
  });

  const onClickSearch = async () => {
    console.log(searchObject);
    // 檢核
    if (isEmpty(searchObject.fieldValue)) {
      $swal.fail('請輸入查詢條件');
      return;
    } else if (searchObject.type == 4 && !searchObject.fieldValue.includes(',')) {
      $swal.fail('請輸入事故人ID及保單號碼');
      return;
    }
    isLoading.value = true;

    /**
     * 1 => 事故人ID
     * 2 => 保單號碼
     * 3 => 受理編號
     * 4 => 事故人ID + 保單號碼
     */
    const paramMapping = [
      ['', searchObject.fieldValue, '', ''],
      [searchObject.fieldValue, '', '', ''],
      ['', '', searchObject.fieldValue, ''],
      [searchObject.fieldValue.split(',')[1], searchObject.fieldValue.split(',')[0], '', '']
    ];
    let params = paramMapping[searchObject.type - 1];
    // console.log(params);
    // params[0] = 'ERROR'; // 測試Error用
    const response = await apiQueryNotGiveBenefitRecords(params);
    const result = response.data.result;
    if (result.IS_SUCCESS && result.RTN_CODE == '0') {
      // 設定分頁資料
      setPageData([]);
      setPageData(result.DATA);
      // TODO: 設定title
      // document.title = searchObject.fieldValue + pageTitle;
    } else {
      setPageData([]);
      $swal.fail(result.RTN_MSG);
    }
    isLoading.value = false;
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

  // 受理編號開啟連結
  const router = useRouter(); 
  const onClickApplyNo = (applyNo, careEmpName) => {
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
      // location.href = `/AAWeb/servlet/HttpDispatcher/AAA0_0800/prompt?LINK_PARAM=${applyNo}`;
      // location.href = `/AAWeb/servlet/HttpDispatcher/AAE0_0500/prompt?LINK_PARAM=${applyNo}&OPEN_IMG=Y`;
      window.open(`/servlet/HttpDispatcher/AAE0_0500/prompt?LINK_PARAM=${applyNo}&OPEN_IMG=Y`, '_blank');
    }
  };
</script>
