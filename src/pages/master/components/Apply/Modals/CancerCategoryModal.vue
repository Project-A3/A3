<template>
  <Modal>
    <template v-slot:title>癌症分類</template>
    <template v-slot:content>
      <!-- 資料列表 -->
      <div class="modal-table">
        <table class="table is-fullwidth tr-can-click">
          <thead class="is-sticky">
            <tr>
              <th>序號</th>
              <th class="has-text-centered">癌症編號</th>
              <th class="has-text-centered">癌症名稱</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(cancer, index) in cancerCategories" @click="onClickItem(cancer.CANCER_CAT, cancer.CANCER_CAT_NAME)">
              <td class="pl-5">{{ index + 1 }}</td>
              <td class="has-text-centered">{{ cancer.CANCER_CAT }}</td>
              <td class="has-text-centered font-eudc">{{ cancer.CANCER_CAT_NAME }}</td>
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
  import useSwal from '~/composables/useSwal';
  import Modal from '~/components/Modal.vue';
  import { useApplyStore } from '~/stores/apply';
  import { orderBy } from 'lodash-es';
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

  const cancerCategories = ref([]);
  try {
    applyStore.showLoading();
    cancerCategories.value = await applyStore.getCancerCategories();
    cancerCategories.value = orderBy(cancerCategories.value, ['CANCER_CAT'], ['asc']);
  } catch (e) {
    $swal.fail(e);
  } finally {
    applyStore.hideLoading();
  }

  const selectedItem = reactive({ code: '', name: '' });
  const onClickItem = (code, name) => {
    selectedItem.code = code;
    selectedItem.name = name;
    onClickConfirm();
  };

  const isConfirmDisabled = computed(() => selectedItem.code === '' || selectedItem.name === '');

  const emitEvent = props.data.emitEvents;
  const onClickConfirm = () => {
    emitEvent.updateValue(selectedItem.code);
    emitEvent.updateText(selectedItem.name);
    props.close();
  };
</script>
<style lang="scss"></style>
