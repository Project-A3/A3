<template>
  <div class="button-group columns">
    <div class="column ver-center">
      <button
        class="button is-primary"
        :disabled="payItemsData.IS_PAY_DOC !== 'Y'"
        @click="openDocPath(payItemsData.PAY_DOC_PATH)"
      >
        給付明細列印
      </button>
      <button class="button is-primary" :disabled="payItemsData.ANN_FLAG !== 'Y'" @click="openRelieveRemarkModal">
        解除註記
      </button>
      <button
        class="button is-primary"
        :disabled="payItemsData.IS_NOPAY_DOC !== 'Y'"
        @click="openDocPath(payItemsData.NOPAY_DOC_PATH)"
      >
        不給付通知函檢視
      </button>
      <button
        class="button is-primary"
        :disabled="payItemsData.IS_CASE_DOC !== 'Y'"
        @click="openDocPath(payItemsData.CASE_DOC_PATH)"
      >
        案件列印
      </button>
    </div>
  </div>
</template>

<script setup>
  import { storeToRefs } from 'pinia';
import useModal from '~/composables/useModal';
import { useAccountingStore } from '~/stores/accounting';
import RelieveRemarkModal from './Modals/RelieveRemarkModal.vue';

  const accountingStore = useAccountingStore();
  const { payItemsData } = storeToRefs(accountingStore);
  const applyNo = inject('ApplyNo');
  const { $m } = useModal();

  // 開啟文件、列印
  const openDocPath = (docPath) => {
    window.open(`/servlet/HttpDispatcher/AAB3_1000/openPdf?pdfFilePath=${docPath}`);
    // window.open(docPath);
  };

  // 解除註記
  const openRelieveRemarkModal = () => {
    $m.show({
      component: RelieveRemarkModal,
      id: 'unannotate',
      data: { applyNo }
    });
  };
</script>

<style lang="scss" scoped></style>
