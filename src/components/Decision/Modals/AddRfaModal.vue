<template>
  <Modal>
    <template v-slot:title>新增簽呈-{{ props.data.RFA_SCAT_NAME }}</template>
    <template v-slot:content>
      <div class="modal-table">
        <table class="table is-fullwidth tr-can-click">
          <thead class="is-sticky">
            <tr>
              <th class="has-text-centered">序號</th>
              <th>內容</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr
              :class="{ selected: checkedItem?.RFA_CAN_ID === rfaCan.RFA_CAN_ID }"
              v-for="(rfaCan, index) in rfaCanList"
              :key="rfaCan.RFA_CAN_ID"
              @click="checkedItem = rfaCan"
            >
              <td class="has-text-centered">{{ index + 1 }}</td>
              <td>{{ rfaCan.RFA_CAN_CONT }}</td>
              <td class="has-text-centered">
                <div class="radio-group">
                  <input :id="`rb${rfaCan.RFA_CAN_ID}`" type="radio" class="radio-input" :value="rfaCan" v-model="checkedItem" />
                  <label :for="`rb${rfaCan.RFA_CAN_ID}`" class="radio-label">
                    <span class="radio-button"></span>
                  </label>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
    <template v-slot:buttons>
      <button class="button is-light close-modal" @click="props.close">取消新增</button>
      <button class="button is-light close-modal" @click="onClickNotUse">不使用</button>
      <button class="button is-primary close-modal" :disabled="!checkedItem" @click="onClickInsert">確認新增</button>
    </template>
  </Modal>
</template>

<script setup>
  import { uuid } from '~/common/utils';
  import Modal from '~/components/Modal.vue';
  import useSwal from '~/composables/useSwal';
  import { useDecisionStore } from '~/stores/decision';

  const { $swal } = useSwal();
  const decisionStore = useDecisionStore();
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

  const rfaCanList = ref([]);
  const emptyRfaCan = ref(null);
  // 選擇的項目
  const checkedItem = ref('');

  try {
    decisionStore.showLoading();
    const allRfaCans = await decisionStore.getRFACONT(props.data.RFA_SCAT_ID);
    rfaCanList.value = allRfaCans.filter((r) => r.RFA_TYPE !== '2');
    emptyRfaCan.value = allRfaCans.find((r) => r.RFA_TYPE === '2');
    if(!emptyRfaCan.value) throw '無空白簽呈模板(RFA_TYPE = 2)'
  } catch (e) {
    $swal.fail(e);
  } finally {
    decisionStore.hideLoading();
  }

  const onClickNotUse = () => {
    emptyRfaCan.value.UUID = uuid();
    emptyRfaCan.value.ERROR = '內容不得為空';
    decisionStore.AddRfaCan(emptyRfaCan.value);
    props.close();
  };

  const onClickInsert = () => {
    checkedItem.value.UUID = uuid();
    decisionStore.AddRfaCan(checkedItem.value);
    props.close();
  };
</script>

<style lang="scss" scoped></style>
