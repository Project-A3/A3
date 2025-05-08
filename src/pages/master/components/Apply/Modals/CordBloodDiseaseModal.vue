<template>
  <Modal>
    <template v-slot:title>臍帶血幹細胞適應症</template>
    <template v-slot:content>
      <!-- 資料列表 -->
      <div class="modal-table">
        <table class="table is-fullwidth tr-can-click">
          <thead class="is-sticky">
            <tr>
              <th>序號</th>
              <th class="has-text-centered">代號</th>
              <th class="has-text-centered">疾病項目</th>
              <th class="has-text-centered">給付比例</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(stem, index) in stemList"
              :class="{ selected: selectedItem.code === stem.STEM_CODE }"
              @click="onClickItem(stem.STEM_CODE, stem.STEM_NAME)"
            >
              <td class="pl-5">{{ index + 1 }}</td>
              <td class="has-text-centered">{{ stem.STEM_CODE }}</td>
              <td class="has-text-centered font-eudc">{{ stem.STEM_NAME }}</td>
              <td class="has-text-centered">{{ stem.STEM_RATIO }}</td>
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
  import Modal from '~/components/Modal.vue';
  import { useApplyStore } from '~/stores/apply';
  import useSwal from '../../../../../composables/useSwal';
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
  const stemList = ref([]);
  const getList = async () => {
    try {
      applyStore.showLoading();
      stemList.value = await applyStore.getSpecialDisease('STEM');
    } catch (e) {
      $swal.fail(e);
    } finally {
      applyStore.hideLoading();
    }
  };
  getList();
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
