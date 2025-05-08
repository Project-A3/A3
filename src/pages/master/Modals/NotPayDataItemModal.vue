<template>
  <ModalWrapper id="notPayLawTemplate">
    <Modal disableOverflow>
      <template v-slot:title>{{props.data.modalItemType === 'A' ? '抬頭樣式選擇':'主張依據選擇'}}</template>
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
                <th class="has-text-centered">序號</th>
                <th>{{props.data.modalItemType === 'A' ? '抬頭樣式':'主張依據'}}</th>
                <th class="has-text-centered">選擇</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in currentData"
                :class="{ checked: selectedItem.cont === item.CONT }"
                @click="onClickTemplate(item)"
              >
                <td class="has-text-centered has-border-right w-7">{{ index + 1 }}</td>
                <td class="font-eudc">
                  {{ item.CONT }}
                </td>
                <td class="has-text-centered">
                  <div class="radio-group">
                    <input type="radio" class="radio-input" :checked="selectedItem.cont === item.CONT" />
                    <label for="21" class="radio-label is-dark">
                      <span class="radio-button"></span>
                    </label>
                  </div>
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
  // 項目
  const items = ref([]);

  // 分頁相關
  const { totalCounts, pageSize, currentData, currentPage, currentPageIndex, hasData, onPageChanged, setPageData } =
    usePagination();

  try {
    decisionStore.showLoading();
    items.value = await decisionStore.getNotPayTitleSelectList(props.data.title, props.data.subTitle, props.data.modalItemType);
    setPageData(items.value);
  } catch (e) {
    $swal.fail(e);
  } finally {
    decisionStore.hideLoading();
  }

  // 最後選擇的項目
  const selectedItem = reactive({});

  // 點擊表格內的模板
  const onClickTemplate = (item) => {
    selectedItem.cont = item.CONT;
    selectedItem.type = props.data.modalItemType;
  };

  // 查詢關鍵字
  const onClickSearchKeyword = () => {
    if (keyword.value) {
      setPageData(items.value.filter((item) => item.CONT.includes(keyword.value)));
      clearSelectedContent();
    } else {
      setPageData(items.value);
    }
  };

  const isConfirmDisabled = computed(() => isEmpty(selectedItem.cont));
  const emit = defineEmits(['onClickConfirm']);
  const onClickConfirm = () => {
    emit('onClickConfirm', selectedItem);
  };

  const clearSelectedContent = () => {
    selectedItem.value = {};
  };

  onDeactivated(() => {
    clearSelectedContent();
  });
</script>
<style lang="scss"></style>
