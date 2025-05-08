<template>
  <Modal>
    <template v-slot:title>骨折換算</template>
    <template v-slot:content>
      <!-- 資料列表 -->
      <div class="modal-table">
        <table class="table is-striped-odd is-fullwidth mt-0">
          <thead class="is-sticky">
            <tr>
              <th class="has-text-centered has-border-right ver-middle" rowspan="2">骨折<br />代碼</th>
              <th class="has-text-centered has-border-right ver-middle" rowspan="2">受傷部位</th>
              <th class="has-text-centered ver-middle" colspan="3">骨折換算天數</th>
            </tr>
            <tr class="second-tr">
              <th class="has-text-centered">A：骨折</th>
              <th class="has-text-centered">B：不完全骨折(脫臼)</th>
              <th class="has-text-centered">C：龜裂(半脫臼)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="bone in boneDays">
              <td class="has-text-centered has-border-right w-5">{{ bone.BONE_GROUP }}</td>
              <td class="has-text-centered has-border-right font-eudc">{{ bone.BONE_NAME }}</td>
              <td class="has-text-centered">
                <span v-if="getBoneDay(bone, 'A') === '-'">-</span>
                <a v-else class="bone-link" @click="onClickItem(getBoneCode(bone, 'A'), bone.BONE_NAME)">{{ getBoneDay(bone, 'A') }}</a>
              </td>
              <td class="has-text-centered">
                <span v-if="getBoneDay(bone, 'B') === '-'">-</span>
                <a v-else class="bone-link" @click="onClickItem(getBoneCode(bone, 'B'), bone.BONE_NAME)">{{ getBoneDay(bone, 'B') }}</a>
              </td>
              <td class="has-text-centered">
                <span v-if="getBoneDay(bone, 'C') === '-'">-</span>
                <a v-else class="bone-link" @click="onClickItem(getBoneCode(bone, 'C'), bone.BONE_NAME)">{{ getBoneDay(bone, 'C') }}</a>
              </td>
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
  import { useApplyStore } from '../../../../../stores/apply';
  const applyStore = useApplyStore();
  const { $swal } = useSwal();
  const boneDays = ref([]);
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

  try {
    applyStore.showLoading();
    boneDays.value = await applyStore.getBoneDays();
  } catch (e) {
    $swal.fail(e);
  } finally {
    applyStore.hideLoading();
  }

  const getBoneDay = (bone, degree) => {
    let findBoneDay = bone.DAY_INFO.find((e) => e.BONE_DEGREE === degree)?.BONE_DAY;
    return findBoneDay ? findBoneDay : '-';
  };

  const getBoneCode = (bone, degree) => {
    let findBoneCode = bone.DAY_INFO.find((e) => e.BONE_DEGREE === degree)?.BONE_CODE;
    return findBoneCode ? findBoneCode : '';
  };

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
<style lang="scss" scope>
  .second-tr {
    th {
      border-radius: 0 !important;
      padding: 15px 0;
      padding-right: 0 !important;
      vertical-align: middle;
    }
  }
  .bone-link {
    text-decoration: underline !important;
    color: #2372bc !important;
    cursor: pointer !important;
  }
</style>
