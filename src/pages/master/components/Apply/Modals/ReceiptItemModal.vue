<!-- 索賠類別彈窗 -->
<template>
  <Modal>
    <template v-slot:title>新增收據項目</template>
    <template v-slot:content>
      <!-- 查詢 -->
      <div class="columns pr-6 pl-1 is-justify-content-center">
        <div>
          <input class="font-eudc" v-model="inputReceiptItem" type="search" size="40" placeholder="請輸入收據項目" @keyup.enter="onClickSearch" />
        </div>
        <div class="ml-4">
          <SearchIconButton @click.native="onClickSearch"></SearchIconButton>
        </div>
      </div>
      <div class="item-wrapper">
        <div class="columns is-multiline mt-4">
          <div v-for="receiptItem in searchedItems" class="column is-6" :key="receiptItem.RCPT_SER_NO">
            <label>
              <input type="checkbox" :value="receiptItem" v-model="checkItems" />
              <span class="font-eudc">{{ receiptItem.RCPT_SER_NO }}({{ receiptItem.PAY_RCPT_NAME }})</span>
            </label>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:buttons>
      <button class="button is-light" @click="props.close">取消</button>
      <button class="button is-primary" @click.prevent="onSubmit">新增</button>
    </template>
  </Modal>
</template>
<script setup>
  import Modal from '~/components/Modal.vue';
  import { useApplyStore } from '~/stores/apply';
  import useSwal from '~/composables/useSwal';
  import SearchIconButton from '~/components/SearchIconButton.vue';

  const { $swal } = useSwal();
  const applyStore = useApplyStore();
  const props = defineProps({
    data: {
      type: Object,
      required: true,
      default: {}
    },
    close: {
      type: Function,
      required: false,
      default: () => console.log('close modal!')
    }
  });
  // 所有收據項目
  const allReceiptItems = ref([]);
  // 搜尋的文字
  const inputReceiptItem = ref('');
  // 搜尋的收據項目
  const searchedItems = ref([]);
  // 勾選的收據項目
  const checkItems = ref([]);

  console.log(props.data);

  try {
    applyStore.showLoading();
    const result = await applyStore.getReceiptItems(props.data.hospitalCode, props.data.kind, props.data.isSchool);
    if (!result.IS_SUCCESS) throw result.RTN_MSG;
    allReceiptItems.value = searchedItems.value = result.RCPT_ITEM_DATA;
  } catch (e) {
    $swal.fail(e);
  } finally {
    applyStore.hideLoading();
  }

  const onClickSearch = () => {
    if (!inputReceiptItem.value) {
      searchedItems.value = allReceiptItems.value;
      return;
    }
    searchedItems.value = allReceiptItems.value.filter(
      (item) => item.RCPT_SER_NO.includes(inputReceiptItem.value) || item.PAY_RCPT_NAME.includes(inputReceiptItem.value)
    );
    if (searchedItems.value.length <= 0) $swal.info('查無收據項目');
  };

  const emitEvent = props.data.emitEvents;
  const onSubmit = () => {
    emitEvent.insertReceiptItems(checkItems.value);
    // 因為要檢核，所以留給外面檢核完再關閉
    // props.close();
  };
</script>
<style lang="scss" scoped>
  .item-wrapper {
    max-height: 400px;
    overflow: auto;
  }
</style>
