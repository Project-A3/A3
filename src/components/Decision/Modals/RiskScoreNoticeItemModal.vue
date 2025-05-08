<template>
  <ModalWrapper id="riskScoreNoticeItemModal">
  <Modal disableOverflow>
    <template v-slot:title>回饋注意事項</template>
    <template v-slot:content>
      <div class="modal-table">
        <table class="table is-striped-odd is-fullwidth">
            <thead class="is-sticky">
              <tr>
                <th class="has-text-centered">序號</th>
                <th class="has-text-centered">注意內容</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="has-text-centered" width="45">1</td>
                <td class="has-text-left">此POC的風險定義為<span style="color:red">實質不給付</span>(即高風險代表該案件實質不給付機率高)，實質不給付代碼包含(A06、A07、A08、A09、A16、A17、A24、A25、A27、A28、B01、B05、B08、B11、B12、B13、B17、B18、B19、B25、B31、E11)，同一受編只要有一張保單為實質不給付即算高風險案件。</td>
              </tr>
              <tr>
                <td class="has-text-centered">2</td>
                <td class="has-text-left">請針對<span style="color:red">高風險警示內容認同度</span>進行回饋。如果案件最後給付，但認為提醒內容屬實，依然可以按認同;反之，雖然案件實質不給付，但提醒內容並非高風險原因，則可按不認同。</td>
              </tr>
              <tr>
                <td class="has-text-centered">3</td>
                <td class="has-text-left"><span style="color:red">除外(A08、A09)為實質不給付!!!</span></td>
              </tr>
            </tbody>
          </table>
      </div>
    </template>
    <template v-slot:buttons>
      <button class="button is-primary" @click="props.close">關閉</button>
    </template>
  </Modal>
  </ModalWrapper>
</template>
<script setup>
  import Modal from '~/components/Modal.vue';
  import ModalWrapper from '~/components/ModalWrapper.vue';

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
</script>
<style lang="scss" scoped></style>
