<template>
  <nav class="pagination is-centered is-small is-primary" role="navigation" aria-label="pagination" v-if="pages > 1">
    <ul class="pagination-list">
      <li @click="changePage(false)">
        <a href="javascript:void(0)" :class="{ 'pagination-previous': true, disabled: currentPage === 1 }"> <cathay-translate code="Component_Pagination_001" /> </a>
      </li>
      <li v-for="page in pageList" :key="page" @click="changePage(page)">
        <a href="javascript:void(0)" :class="{ 'pagination-link': true, 'is-current': currentPage === page }"> {{ page }} </a>
      </li>
      <li @click="changePage(true)">
        <a href="javascript:void(0)" :class="{ 'pagination-next': true, disabled: currentPage === pages }"> <cathay-translate code="Component_Pagination_002" /> </a>
      </li>
    </ul>
  </nav>
</template>
<script setup>
  const emit = defineEmits(['onPageChanged']);
  const props = defineProps({
    total: {
      type: Number,
      default: 80
    },
    pageSize: {
      type: Number,
      default: 10
    },
    currentPage: {
      type: Number,
      default: 1
    }
  });

  // 當前頁面
  const currentPage = ref(props.currentPage);
  // console.log(currentPage);
  // 計算總頁數
  const pages = computed(() => Math.ceil(props.total / props.pageSize));
  // console.log(pages);
  // 頁碼顯示
  const pageList = computed(() => {
    const result = [];
    for (let i = 1; i <= pages.value; i++) {
      result.push(i);
    }
    return result;
  });

  const changePage = (type) => {
    // 上一頁
    if (type === false) {
      if (currentPage.value <= 1) return;
      currentPage.value -= 1;
    } else if (type === true) {
      // 下一頁
      if (currentPage.value >= pages.value) return;
      currentPage.value += 1;
    } else {
      // 點擊頁碼
      currentPage.value = type;
    }
    // emit to parent
    emit('onPageChanged', currentPage.value);
  };

  watch(
    () => props.currentPage,
    () => {
      if (currentPage.value !== props.currentPage) {
        currentPage.value = props.currentPage;
      }
    }
  );
</script>
<style lang="scss"></style>
