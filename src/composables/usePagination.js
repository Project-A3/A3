import { chunk } from 'lodash-es';

export default function usePagination() {
  // 總共幾筆
  const totalCounts = ref(0);
  // 一頁幾筆
  const pageSize = ref(10);
  // 目前頁面上顯示的資料
  const currentData = ref([]);
  // 全部的資料
  const fullData = ref([]);
  // 分頁完的資料
  const chunkData = ref([]);
  // 目前是第幾頁
  const currentPage = ref(1);
  // 目前是第幾筆到第幾筆
  const currentPageIndex = computed(() => ({
    start: (currentPage.value - 1) * pageSize.value + 1,
    end: currentPage.value * pageSize.value > totalCounts.value ? totalCounts.value : currentPage.value * pageSize.value
  }));

  // 有沒有資料
  const hasData = computed(() => totalCounts.value > 0);

  const onPageChanged = (page) => {
    console.log(page);
    if (page !== currentPage.value) {
      currentData.value = chunkData.value[page - 1];
      currentPage.value = page;
      // console.log(currentData.value);
    }
  };

  const setPageData = (data) => {
    // console.log(result.DATA);
    fullData.value = data;
    totalCounts.value = data.length;
    // 分頁
    chunkData.value = chunk(data, pageSize.value);
    // console.log(chunkData.value);
    currentData.value = chunkData.value.length > 0 ? chunkData.value[0] : [];
    currentPage.value = 1;
  };

  // 重新分組資料
  const reChunkData = (page = null) => {
    chunkData.value = chunk(fullData.value, pageSize.value);
    currentData.value = chunkData.value.length > 0 ? chunkData.value[page ?? currentPage.value - 1] : [];
  };

  return {
    totalCounts,
    pageSize,
    currentData,
    chunkData,
    currentPage,
    currentPageIndex,
    hasData,
    fullData,
    onPageChanged,
    setPageData,
    reChunkData
  };
}
