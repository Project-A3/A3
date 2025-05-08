<template>
  <Modal disableOverflow>
    <template v-slot:title>選擇險別</template>
    <template v-slot:content>
      <!-- 查詢 -->
      <div class="columns pr-6 pl-1 is-justify-content-center">
        <div>
          <input class="font-eudc" v-model="inputProd" type="search" size="40" placeholder="請輸入險別名稱" @keyup.enter="onClickSearch" />
        </div>
        <div class="ml-4">
          <SearchIconButton @click.native="onClickSearch"></SearchIconButton>
        </div>
      </div>

      <!-- 資料列表 -->
      <div class="modal-table" v-if="searchedResults.length > 0">
        <table class="table is-fullwidth apply-table tr-can-click">
          <thead>
            <tr>
              <th class="pl-1">險別名稱</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="prod in searchedResults" @click="onClickProd(prod.OP_PROD_KEY, prod.OP_PROD_VALUE)">
              <td class="font-eudc">{{ prod.OP_PROD_VALUE }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
    <template v-slot:buttons>
      <button class="button is-light" @click="props.close">取消</button>
      <a href="#" class="clear-modal" @click.stop.prevent="emitEvent.clearValue">清除</a>
    </template>
  </Modal>
</template>
<script setup>
  import { isEmpty } from 'lodash-es';
  import Modal from '~/components/Modal.vue';
  import useSwal from '~/composables/useSwal';
  import { useApplyStore } from '~/stores/apply';
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

  // API取得所有險別
  const allProds = ref([]);
  // 搜尋結果
  const searchedResults = ref([]);
  // 輸入搜尋的醫院名稱
  const inputProd = ref('');
  // 最後選擇的醫院
  const selectedProd = reactive({ key: '', value: '' });

  //#region 取得手術險別
  const getOpProds = async (opCode) => {
    try {
      if (!opCode) {
        $swal.warning('請先選擇手術代碼');
        // 關閉Modal
        props.close();
        return [];
      }
      applyStore.showLoading();
      let prods = await applyStore.getOPProdOrGrad('PROD', opCode);
      return prods;
    } catch (e) {
      console.error(e);
      return [];
    } finally {
      applyStore.hideLoading();
    }
  };
  allProds.value = searchedResults.value = await getOpProds(props.data.opCode);
  //#endregion
  // 查詢
  const onClickSearch = async () => {
    if (isEmpty(inputProd.value)) {
      searchedResults.value = allProds.value;
      return;
    }
    try {
      // 清除選擇的險別
      selectedProd.key = '';
      selectedProd.value = '';
      searchedResults.value = allProds.value.filter((p) => p.OP_PROD_VALUE.includes(inputProd.value));
      if (searchedResults.value.length <= 0) $swal.info('查無險別');
    } catch (e) {
      $swal.fail(e);
    } finally {
    }
  };

  // 點擊table選擇醫院
  const onClickProd = (code, name) => {
    selectedProd.key = code;
    selectedProd.value = name;
    onClickConfirm();
  };

  // 選擇完後點擊確認
  const emitEvent = props.data.emitEvents;
  const onClickConfirm = () => {
    if (isEmpty(selectedProd.key) || isEmpty(selectedProd.value)) {
      $swal.warning('請選擇險別');
      return;
    }
    // 更新資料
    emitEvent.updateValue(selectedProd.key);
    emitEvent.updateText(selectedProd.value);
    // 關閉Modal
    props.close();
  };
</script>
<style lang="scss"></style>
