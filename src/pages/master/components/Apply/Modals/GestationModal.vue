<template>
  <Modal>
    <template v-slot:title>妊娠期併發症</template>
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
              v-for="(grav, index) in gravList"
              :class="{ selected: selectedItem.code === grav.GRAV_CODE }"
              @click="onClickItem(grav.GRAV_CODE, grav.GRAV_NAME)"
            >
              <td class="pl-5">{{ index + 1 }}</td>
              <td class="has-text-centered">{{ grav.GRAV_CODE }}</td>
              <td class="has-text-centered font-eudc">{{ grav.GRAV_NAME }}</td>
              <td class="has-text-centered">{{ grav.GRAV_RATIO }}</td>
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
  const gravList = ref([]);
  const getList = async () => {
    try {
      applyStore.showLoading();
      gravList.value = await applyStore.getSpecialDisease('GRAV');
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
