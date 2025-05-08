<template>
  <ModalWrapper id="paymentDetailsTemplate">
    <Modal disableOverflow>
      <template v-slot:title>給付明細說明輸入</template>
      <template v-slot:content>
        <div class="columns search-area">
          <div class="column is-12 ver-center">
            <p>關鍵字</p>
            <input v-model="keyword" class="input search-input font-eudc" type="search" @keyup.enter="onClickSearchKeyword" />
            <button class="button is-primary search-btn" @click="onClickSearchKeyword">查詢</button>
          </div>
        </div>
        <p class="modal-subtitle">受理編號 {{ props.data.applyNo }}</p>
        <div class="modal-table">
          <table class="table is-fullwidth is-striped-odd tr-can-click">
            <thead>
              <tr>
                <th class="has-text-centered">序號</th>
                <th>注意事項內容</th>
                <th class="has-text-centered">選擇</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(content, index) in currentData"
                :class="{ checked: selectedContent.serNo === content.SER_NO }"
                @click="onClickTemplate(content)"
              >
                <td class="has-text-centered has-border-right w-7">{{ index + 1 }}</td>
                <td class="w-84 font-eudc">
                  {{ content.CONTENT }}
                </td>
                <td class="has-text-centered">
                  <div class="radio-group">
                    <input type="radio" class="radio-input" :checked="selectedContent.serNo === content.SER_NO" />
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
  import { useAccountingStore } from '~/stores/accounting';
  import useSwal from '~/composables/useSwal';
  import usePagination from '~/composables/usePagination';
  import Pagination from '~/components/Pagination.vue';
  import ModalWrapper from '~/components/ModalWrapper.vue';
  import { isEmpty } from 'lodash-es';
  import { onDeactivated } from 'vue';
  const { $swal } = useSwal();
  const accountingStore = useAccountingStore();
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
  const notices = ref([]);

  // 分頁相關
  const { totalCounts, pageSize, currentData, currentPage, currentPageIndex, hasData, onPageChanged, setPageData } =
    usePagination();

  try {
    accountingStore.showLoading();
    notices.value = await accountingStore.getNotice(props.data.applyNo);
    setPageData(notices.value);
  } catch (e) {
    $swal.fail(e);
  } finally {
    accountingStore.hideLoading();
  }

  // 最後選擇的內容模板
  const selectedContent = reactive({ serNo: '', acptId: '', content: '', javaClass: '' });

  // 點擊表格內的模板
  const onClickTemplate = ({ SER_NO, ACPT_ID, CONTENT, javaClass }) => {
    selectedContent.serNo = SER_NO;
    selectedContent.acptId = ACPT_ID;
    selectedContent.content = CONTENT;
    selectedContent.javaClass = javaClass;
  };

  // 查詢關鍵字
  const onClickSearchKeyword = () => {
    if (keyword.value) {
      setPageData(notices.value.filter((notice) => notice.CONTENT.includes(keyword.value)));
      clearSelectedContent();
    } else {
      setPageData(notices.value);
    }
  };

  const isConfirmDisabled = computed(() => isEmpty(selectedContent.serNo) || isEmpty(selectedContent.content));
  const emit = defineEmits(['onClickConfirm']);
  const onClickConfirm = () => {
    emit('onClickConfirm', selectedContent);
  };

  const clearSelectedContent = () => {
    selectedContent.serNo = '';
    selectedContent.acptId = '';
    selectedContent.content = '';
    selectedContent.javaClass = '';
  };

  onDeactivated(() => {
    clearSelectedContent();
  });
</script>
<style lang="scss"></style>
