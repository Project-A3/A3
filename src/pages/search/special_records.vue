<template>
  <Layout class="search-special">
    <section id="mainSection">
      <h2>特殊紀錄查詢</h2>

      <!-- Search Input Container -->
      <div class="container search-input">
        <div class="card">
          <div class="columns">
            <div class="column is-narrow">
              <span class="field">被保人ID</span>
              <input
                v-model="insuredId"
                type="search"
                class="w-250"
                placeholder="請輸入被保人ID"
                @input="(val) => (insuredId = insuredId.toUpperCase())"
              />
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
              <th>檔案號碼</th>
              <th>受理編號</th>
              <th style="width: 350px">特殊紀錄</th>
              <SortingThead
                class="has-text-centered"
                sortKey="THERAPY_BEGDT"
                :currentSortKey="sortName"
                :isSortDesc="isSortDesc"
                :onClickSort="onClickSort"
                >入院日期
              </SortingThead>
              <SortingThead
                class="has-text-centered"
                sortKey="THERAPY_ENDDT"
                :currentSortKey="sortName"
                :isSortDesc="isSortDesc"
                :onClickSort="onClickSort"
                >出院日期
              </SortingThead>
              <th class="has-text-centered">是否手術</th>
              <th>求診醫院</th>
              <SortingThead
                class="has-text-centered"
                sortKey="UPDATE_DATE"
                :currentSortKey="sortName"
                :isSortDesc="isSortDesc"
                :onClickSort="onClickSort"
                >建檔日期
              </SortingThead>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(record, index) in fullData">
              <td class="has-text-centered">{{ index + currentPageIndex.start }}</td>
              <td class="w-160">
                <a :href="record.FILE_NO_LINK" target="_blank" class="is-secondary">{{ record.REFUSE_FILENO }}</a>
              </td>
              <td class="w-160">
                <!-- <a :href="record.APLY_NO_LINK" target="_blank" class="is-secondary">{{ record.APPLY_NO }}</a> -->
                
                <a href="#" target="_blank" class="is-secondary" @click.stop.prevent="onClickApplyNo(record.APPLY_NO, record.APLY_NO_2, record.CARE_EMP_NAME, record.APLY_NO_LINK)">
                  {{ record.APPLY_NO }}
                </a>

              </td>
              <td class="font-eudc">
                <p v-for="special in record.RECORD_LIST">{{ special }}</p>
              </td>
              <td class="has-text-centered">{{ getROCDate(record.THERAPY_BEGDT) }}</td>
              <td class="has-text-centered">{{ getROCDate(record.THERAPY_ENDDT) }}</td>
              <td class="has-text-centered">{{ record.SURGERY === 'Y' ? '是' : '否' }}</td>
              <td>{{ record.HOSPITAL_NAME }}</td>
              <td class="has-text-centered">{{ getROCDate(record.UPDATE_DATE) }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination & Info  -->
        <div class="number-of-data-info" v-if="hasData">
          共<span>{{ totalCounts }}</span
          >則
        </div>
        <!-- <Pagination
          :total="totalCounts"
          :pageSize="pageSize"
          :currentPage="currentPage"
          @onPageChanged="onPageChanged"
        ></Pagination> -->
      </div>
      <div class="button-scroll-to-top">回到頂部</div>
    </section>
  </Layout>
  <Loading :active="isLoading" :can-cancel="false" :is-full-page="true" color="#6fba2a"></Loading>
</template>
<script setup>
  import { isEmpty } from 'lodash-es';
import Loading from 'vue-loading-overlay';
import { apiQuerySpecialRecord } from '~/common/api';
import SortingThead from '~/components/SortingThead.vue';
import useMoment from '~/composables/useMoment';
import usePagination from '~/composables/usePagination';
import useSwal from '~/composables/useSwal';
import useTableSort from '~/composables/useTableSort';
import Layout from './components/Layout.vue';
  let pageTitle = '國泰理賠核心系統-特殊紀錄查詢';
  const { $swal } = useSwal();
  const isLoading = ref(false);
  const { getROCDate } = useMoment();

  // 查詢的被保人ID
  const insuredId = ref('');

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

  // 點擊查詢
  const onClickSearch = async () => {
    // 檢核
    if (isEmpty(insuredId.value)) {
      $swal.fail('請輸入被保人ID');
      return;
    }
    isLoading.value = true;

    // call api search
    const response = await apiQuerySpecialRecord([insuredId.value]);
    const result = response.data.result;
    console.log(result);
    if (result.IS_SUCCESS && result.RTN_CODE == '0') {
      // 設定分頁資料
      setPageData([]);
      setPageData(result.DATA);
    } else {
      setPageData([]);
      $swal.fail(result.RTN_MSG);
    }
    isLoading.value = false;
  };

  // 如果網址有帶查詢條件，要先執行一次查詢
  const route = useRoute();
  let q = route.query?.q; // q => 查詢值
  // 有帶查詢值才做查詢
  if (q) {
    insuredId.value = q.toUpperCase();
    onClickSearch();
  }

  onMounted(() => {
    // TODO: 設定title
    document.title = pageTitle;
  });

   // 受理編號開啟連結 
   const router = useRouter(); 
   const onClickApplyNo = (applyNo, applyNo2, careEmpName, aplyNoLink) => {
    if (applyNo2 === 'OL' || applyNo2 === 'DA') {
      window.open(aplyNoLink,'_blank');
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
        window.open(`/servlet/HttpDispatcher/AAZ3_0100/prompt?APLY_NO=${applyNo}`, '_blank'); // 開影像
      } else {
        // location.href = `/AAWeb/servlet/HttpDispatcher/AAA0_0800/prompt?LINK_PARAM=${applyNo}`;
        // location.href = `/AAWeb/servlet/HttpDispatcher/AAE0_0500/prompt?LINK_PARAM=${applyNo}&OPEN_IMG=Y`;
        window.open(`/servlet/HttpDispatcher/AAE0_0500/prompt?LINK_PARAM=${applyNo}&OPEN_IMG=Y`, '_blank');
      }
    } 
  };
</script>
