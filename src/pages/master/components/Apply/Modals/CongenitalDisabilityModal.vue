<template>
  <Modal>
    <template v-slot:title>先天性重大殘缺</template>
    <template v-slot:content>
      <!-- 資料列表 -->
      <div class="modal-table">
        <table class="table is-fullwidth tr-can-click">
          <thead class="is-sticky">
            <tr>
              <th>序號</th>
              <th class="has-text-centered">殘缺代碼</th>
              <th class="has-text-centered">先天性重大殘缺項目</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(con, index) in conList"
              @click="onClickItem(con.CON_CODE, con.CON_NAME)"
            >
              <td class="pl-5">{{ index + 1 }}</td>
              <td class="has-text-centered">{{ con.CON_CODE }}</td>
              <td class="has-text-centered font-eudc">{{ con.CON_NAME }}</td>
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
  const conList = ref([]);
  const getList = async () => {
    try {
      applyStore.showLoading();
      conList.value = await applyStore.getSpecialDisease('CON');
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
