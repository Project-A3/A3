<template>
  <ModalWrapper id="notPayLawTemplate">
    <Modal disableOverflow>
      <template v-slot:title>不給付條款選擇</template>
      <template v-slot:content>
        <div class="columns search-area">
          <div class="column is-12 ver-center">
            <p>關鍵字</p>
            <input v-model="keyword" class="input search-input font-eudc" type="search" @keyup.enter="onClickSearchKeyword" />
            <button class="button is-primary search-btn" @click="onClickSearchKeyword">查詢</button>
          </div>
        </div>
        <p class="modal-subtitle"></p>
        <div class="modal-table">
          <table class="table is-fullwidth is-striped-odd tr-can-click">
            <thead>
              <tr>
                <th class="has-text-centered">條號</th>
                <th class="w-10-percent">條款抬頭</th>
                <th>條款內容</th>
                <th class="w-10-percent has-text-centered">選擇</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(content, index) in currentData" :class="{ checked: checkedItems.includes(content.KEY) }">
                <td class="has-text-centered has-border-right w-7">{{ content.LAW_NO }}</td>
                <td class="font-eudc">
                  {{ content.TITLE }}
                </td>
                <td class="font-eudc">
                  {{ content.CONTENT }}
                </td>
                <td class="has-text-centered">
                  <label>
                    <input type="checkbox" :value="content.KEY" v-model="checkedItems" />
                    <span></span>
                  </label>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

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
      </template>
      <template v-slot:buttons>
        <button class="button is-light" @click="props.close">取消</button>
        <button class="button is-primary" :disabled="isConfirmDisabled" @click="onClickConfirm">確認</button>
      </template>
    </Modal>
  </ModalWrapper>
</template>
<script setup>
  import Modal from '~/components/Modal.vue';
  import { useDecisionStore } from '~/stores/decision';
  import useSwal from '~/composables/useSwal';
  import usePagination from '~/composables/usePagination';
  import Pagination from '~/components/Pagination.vue';
  import ModalWrapper from '~/components/ModalWrapper.vue';
  import { isEmpty } from 'lodash-es';
  import { onDeactivated } from 'vue';
  const { $swal } = useSwal();
  const decisionStore = useDecisionStore();
  const props = defineProps({
    data: {
      type: Object,
      required: false,
      default: {}
    },
    close: {
      type: Function,
      required: false,
      default: () => console.log('close modal!')
    }
  });

  // 搜尋的關鍵字
  const keyword = ref('');
  // 模板資料
  const laws = ref([]);

  const checkedItems = ref([]);

  // 分頁相關
  const { totalCounts, pageSize, currentData, currentPage, currentPageIndex, hasData, onPageChanged, setPageData } =
    usePagination();

  try {
    decisionStore.showLoading();
    laws.value = await decisionStore.getNotPayLaw(props.data.sysNo, props.data.prodId);
    setPageData(laws.value);
  } catch (e) {
    $swal.fail(e);
  } finally {
    decisionStore.hideLoading();
  }

  // 查詢關鍵字
  const onClickSearchKeyword = () => {
    if (keyword.value) {
      setPageData(laws.value.filter((notice) => notice.CONTENT.includes(keyword.value)));
      clearSelectedContent();
    } else {
      setPageData(laws.value);
    }
  };

  const isConfirmDisabled = computed(() => isEmpty(checkedItems.value));
  const emit = defineEmits(['onClickConfirm']);
  const onClickConfirm = () => {
    let selectedItems = laws.value
      .filter((e) => checkedItems.value.includes(e.KEY))
      .map((m) => ({
        TITLE: m.TITLE,
        CONTENT: m.CONTENT
      }));
    emit('onClickConfirm', selectedItems);
  };

  const clearSelectedContent = () => {
    checkedItems.value = [];
  };

  onDeactivated(() => {
    clearSelectedContent();
  });
</script>
<style lang="scss"></style>
