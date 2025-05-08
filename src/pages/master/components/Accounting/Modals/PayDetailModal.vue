<template>
  <Modal minify="給付明細說明輸入">
    <template v-slot:title>給付明細說明輸入</template>
    <template v-slot:content>
      <p class="modal-subtitle">受理編號 {{ props.data.applyNo }}</p>
      <div class="modal-table">
        <table class="table is-fullwidth">
          <thead>
            <tr>
              <th class="has-text-centered">序號</th>
              <th>內容模板</th>
              <th>注意事項內容</th>
              <th class="has-text-centered" v-if="!applyStore.isManager">刪除</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(payDetail, index) in payDetails" :key="payDetail.SER_NO">
              <td class="has-text-centered has-border-right">{{ index + 1 }}</td>
              <td class="w-13 pl-3">
                <div class="dropdown open-modal-input">
                  <div class="dropdown-trigger">
                    <button
                      class="button"
                      @click="openTemplateModal(payDetail.SER_NO)"
                      :disabled="isReadonly"
                    >
                      <span>{{ payDetail.ACPT_ID }}</span>
                      <img src="/src/assets/images/icon-add.svg" alt="ADD" />
                    </button>
                  </div>
                </div>
                <FieldErrorMessage v-if="!payDetail.ACPT_ID">不能為空白</FieldErrorMessage>
              </td>
              <td class="has-text-centered">
                <textarea
                  v-model="payDetail.CONTENT"
                  cols="46"
                  rows="3"
                  class="is-light resize-vertical font-eudc"
                  :disabled="isReadonly"
                ></textarea>
              </td>
              <td class="has-text-centered">
                <button class="button icon trash" @click="onClickDelete(payDetail.SER_NO)" :disabled="isReadonly"></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="columns">
        <div class="column hor-right p-0">
          <button class="button is-primary has-icon-back has-icon-back-add" @click="onClickInsert" :disabled="isReadonly">
            新增
          </button>
        </div>
      </div>
    </template>
    <template v-slot:buttons>
      <button class="button is-light close-modal" @click="props.close">取消</button>
      <button class="button is-primary close-modal" @click="onSubmit" :disabled="isReadonly">
        儲存
      </button>
    </template>
  </Modal>
  <ContentTemplateModal
    v-if="isTemplateModalShow"
    :data="{ applyNo: props.data.applyNo }"
    :close="
      () => {
        isTemplateModalShow = false;
      }
    "
    @onClickConfirm="onTemplateChoosed"
  ></ContentTemplateModal>
</template>

<script setup>
  import { maxBy, remove, toSafeInteger } from 'lodash-es';
  import FieldErrorMessage from '~/components/Form/FieldErrorMessage.vue';
  import Modal from '~/components/Modal.vue';
  import useSwal from '~/composables/useSwal';
  import { useAccountingStore } from '~/stores/accounting';
  import { useApplyStore } from '~/stores/apply';
  import ContentTemplateModal from './ContentTemplateModal.vue';
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

  const { $swal } = useSwal();
  const applyStore = useApplyStore();
  const accountingStore = useAccountingStore();
  const payDetails = ref([]);
  const isTemplateModalShow = ref(false);
  const apiApplyNo = ref(null);
  let currentEditingTemplateSerNo = '';
  const isReadonly = inject('IsReadonly').value && !applyStore.isManager;
  try {
    accountingStore.showLoading();
    let result = await accountingStore.getPayDetail(props.data.applyNo);
    payDetails.value = result.details;
    apiApplyNo.value = result.applyNo;
  } catch (e) {
    $swal.fail(e);
  } finally {
    accountingStore.hideLoading();
  }

  const openTemplateModal = (serNo) => {
    currentEditingTemplateSerNo = serNo;
    isTemplateModalShow.value = true;
  };

  const onTemplateChoosed = (template) => {
    console.log(template);
    if (template) {
      const payDatail = payDetails.value.find((p) => p.SER_NO === currentEditingTemplateSerNo);
      if (payDatail) {
        payDatail.ACPT_ID = template.acptId;
        payDatail.CONTENT = payDatail.CONTENT ? payDatail.CONTENT : template.content;
        if (template.javaClass) payDatail.javaClass = template.javaClass;
      }
      isTemplateModalShow.value = false;
    }
  };

  const onClickDelete = (serNo) => {
    remove(payDetails.value, (p) => p.SER_NO === serNo);
  };

  const onClickInsert = () => {
    let currentSerNo = payDetails.value.length > 0 ? maxBy(payDetails.value, (p) => toSafeInteger(p.SER_NO)).SER_NO : '0';
    // alert(currentSerNo);
    payDetails.value.push({
      ACPT_ID: '',
      CONTENT: '',
      SER_NO: (toSafeInteger(currentSerNo) + 1).toString(),
      javaClass: 'com.cathay.com.aa.b3.bo.AA_B3Z100_bo2',
      APLY_NO: props.data.applyNo
    });
  };

  const onSubmit = async () => {
    try {
      if (payDetails.value.some((e) => !e.ACPT_ID)) {
        $swal.warning('請確認欄位都有正確填寫');
        return;
      }

      accountingStore.showLoading();
      let successMessage = await accountingStore.savePayDetail(payDetails.value, apiApplyNo.value ?? props.data.applyNo);
      $swal.success(successMessage ? successMessage : '儲存成功');
      props.close();
    } catch (e) {
      $swal.fail(e);
    } finally {
      accountingStore.hideLoading();
    }
  };
</script>

<style lang="scss" scoped></style>
