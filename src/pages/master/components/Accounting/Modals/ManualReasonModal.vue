<template>
  <ModalWrapper id="manualApprovedEditReason">
    <Modal disableOverflow>
      <template v-slot:title>修改原因</template>
      <template v-slot:content>
        <BaseDropdown :options="reasonTypes" :onSelected="onTypeSelected"></BaseDropdown>
        <div class="columns search-area">
          <div class="column is-12 ver-center">
            <p>關鍵字</p>
            <input v-model="keyword" class="input search-input font-eudc" type="search" @keyup.enter="onClickSearchKeyword" />
            <button class="button is-primary search-btn" @click="onClickSearchKeyword">查詢</button>
          </div>
        </div>
        <div class="modal-table">
          <table class="table is-striped-odd is-fullwidth tr-can-click">
            <thead class="is-sticky">
              <tr>
                <th class="has-text-centered ver-middle">序號</th>
                <th class="ver-middle">拒賠原因</th>
                <th class="has-text-centered ver-middle">拒賠原因代碼</th>
                <th></th>
              </tr>
            </thead>
            <tbody v-if="hasData">
              <tr
                v-for="(reason, index) in currentData"
                :class="{ checked: reason.RJCT_RESN_CODE === selectedReason.code }"
                @click="onClickReason(reason.RJCT_RESN_CODE, reason.RJCT_RESN_NAME)"
              >
                <td class="has-text-centered w-5">{{ index + currentPageIndex.start }}</td>
                <td class="has-border-right font-eudc" style="width: 80%">{{ reason.RJCT_RESN_NAME }}</td>
                <td class="has-text-centered">{{ reason.RJCT_RESN_CODE }}</td>
                <td class="has-text-centered">
                  <div class="radio-group">
                    <input type="radio" class="radio-input" id="4" :checked="reason.RJCT_RESN_CODE === selectedReason.code" />
                    <label for="4" class="radio-label is-dark" @click.stop.prevent="onClickReason(reason.RJCT_RESN_CODE, reason.RJCT_RESN_NAME)">
                      <span class="radio-button"></span>
                    </label>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
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
  import BaseDropdown from '~/components/BaseDropdown.vue';
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

  // 事故分類下拉選單選項
  const reasonTypes = reactive([
    {
      name: '請選擇原因分類',
      value: '',
      selected: true,
      disabled: true
    }
  ]);

  // 取得事故分類下拉選單選項
  accountingStore
    .getReasonList()
    .then((list) => {
      reasonTypes.push(
          ...list.map((m) => ({
            name: m.key,
            value: m.value
          }))
        );
    })
    .catch((e) => $swal.fail(e));

  // 搜尋的關鍵字
  const keyword = ref('');
  // 模板資料
  const reasons = ref([]);

  // 分頁相關
  const { totalCounts, pageSize, currentData, currentPage, currentPageIndex, hasData, onPageChanged, setPageData } =
    usePagination();

  const clearSelectedContent = () => {
    selectedReason.code = '';
    selectedReason.name = '';
  };

  // 下拉選單選擇時Call API
  const onTypeSelected = async (value) => {
    if (value != '') {
      try {
        clearSelectedContent();
        accountingStore.showLoading();
        reasons.value = await accountingStore.queryRejectReason(value);
        keyword.value = '';
        setPageData(reasons.value);
      } catch (e) {
        $swal.fail(e);
      } finally {
        accountingStore.hideLoading();
      }
    }
  };

  // 查詢關鍵字
  const onClickSearchKeyword = () => {
    if (keyword.value) {
      setPageData(reasons.value.filter((reason) => reason.RJCT_RESN_NAME.includes(keyword.value)));
      clearSelectedContent();
    } else {
      setPageData(reasons.value);
    }
  };

  // 最後選擇的事故原因
  const selectedReason = reactive({ code: '', name: '' });

  // 點擊表格內的原因
  const onClickReason = (resn, resnName) => {
    selectedReason.code = resn;
    selectedReason.name = resnName;
  };

  const isConfirmDisabled = computed(() => isEmpty(selectedReason.code) || isEmpty(selectedReason.name));
  const emit = defineEmits(['onClickConfirm']);
  const onClickConfirm = () => {
    emit('onClickConfirm', selectedReason);
  };

  onDeactivated(() => {
    clearSelectedContent();
  });
</script>
<style lang="scss"></style>
