<template>
  <Modal>
    <template v-slot:title></template>
    <template v-slot:content>
      <div class="detail-wrapper">
        <div v-for="detail in details">
          <h2 class="modal-title">{{ detail.TITLE ? detail.TITLE : '住院實支醫療費' }}</h2>
          <!-- Info-->
          <div class="data-horizontal-info">
            <div class="columns">
              <div class="column is-7">
                <span class="field">住院期間</span>
                <span class="data">{{ getROCDate(detail.HOSP_STR_DATE) }} ~ {{ getROCDate(detail.HOSP_END_DATE) }}</span>
              </div>
              <div class="column is-5">
                <span class="field">社保身份</span>
                <span class="data">
                  <img v-if="detail.IS_SOC_INSU === 'Y'" src="/src/assets/images/checkbox-checked-light.svg" alt="CHECKMARK" />
                </span>
              </div>
            </div>
            <div class="columns">
              <div class="column is-7">
                <span class="field">醫院名稱</span>
                <span class="data">{{ detail.HOSP_NAME }}</span>
              </div>
              <div class="column is-5">
                <span class="field">收據種類</span>
                <span class="data">{{ handleRepKindChinese(detail.RCPT_KIND) }}</span>
              </div>
            </div>
          </div>

          <!-- Table -->
          <div class="data-horizontal-table mb-5">
            <!-- Table Head -->
            <div class="columns thead">
              <div class="column is-half p-0">
                <div class="columns">
                  <div class="column is-2 hor-center">
                    <span class="field mr-none">序號</span>
                  </div>
                  <div class="column is-7">
                    <span class="field">項目</span>
                  </div>
                  <div class="column is-3 hor-right">
                    <span class="field">金額</span>
                  </div>
                </div>
              </div>
              <div class="column is-half p-0">
                <div class="columns">
                  <div class="column is-2 hor-center">
                    <span class="field mr-none">序號</span>
                  </div>
                  <div class="column is-7">
                    <span class="field">項目</span>
                  </div>
                  <div class="column is-3 hor-right">
                    <span class="field">金額</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Table Body -->
            <div class="columns is-multiline tbody">
              <!-- Column -->
              <div class="column p-0 is-12" v-for="group in detail.groupItems">
                <div class="columns">
                  <!-- 資料 -->
                  <div class="column is-half border-right p-0" v-for="item in group">
                    <div class="columns">
                      <div class="column is-2 hor-center">
                        <span class="data">{{ item.RCPT_SER_NO }}</span>
                      </div>
                      <div class="column is-7">
                        <span class="data">{{ item.PAY_RCPT_NAME }}</span>
                      </div>
                      <div class="column is-3 hor-right">
                        <span class="data" :class="{ 'has-text-danger': item.I_RCPT_AMT_COLOR === 'R' }">
                          {{ item.I_RCPT_AMT }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Total Column -->
              <div class="column is-12 total">
                <span class="field">合計</span>
                <span class="data">{{ detail.totalAmount.toLocaleString('en-US') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p class="total-amounts">總金額: {{ totalAmounts.toLocaleString('en-US') }}</p>
    </template>
    <template v-slot:buttons>
      <button class="button is-light close-modal" @click="props.close">返回</button>
    </template>
  </Modal>
</template>

<script setup>
  import { toSafeInteger } from 'lodash-es';
  import Modal from '~/components/Modal.vue';
  import useMoment from '~/composables/useMoment';
  import useSwal from '~/composables/useSwal';
  import { useAccountingStore } from '~/stores/accounting';
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

  const details = ref([]);
  const { getROCDate } = useMoment();
  const { $swal } = useSwal();
  const accountingStore = useAccountingStore();
  const totalAmounts = ref(0);

  try {
    accountingStore.showLoading();
    // props要帶資料 { applyNo, clamAmtCode, sysNo }
    const RTN_EXP_DETAIL = await accountingStore.getExpenseDetails(props.data);
    for (let detail of RTN_EXP_DETAIL) {
      let groupItems = [];
      let totalAmount = 0;
      for (let i = 0; i < detail.ITEMS.length; i += 2) {
        groupItems.push(detail.ITEMS.slice(i, i + 2));
      }
      console.log(groupItems);
      totalAmount = detail.ITEMS.reduce((a, b) => a + toSafeInteger(b.I_RCPT_AMT.replaceAll(',', '')), 0);
      totalAmounts.value += totalAmount;
      details.value.push({
        groupItems,
        totalAmount,
        ...detail
      });
    }
  } catch (e) {
    $swal.fail(e);
  } finally {
    accountingStore.hideLoading();
  }

  const handleRepKindChinese = (kind) => {
    switch (kind) {
      case '1':
        return '門診收據';
      case '2':
        return '住院收據';
      case '3':
        return '門診收據合計';
      case '4':
        return '團險特殊門診收據';
      default:
        return '';
    }
  };
</script>

<style lang="scss" scoped>
  .detail-wrapper {
    overflow: auto;
    max-height: 65vh;
  }
  .total-amounts {
    text-align: center;
    margin-top: 15px;
    font-size: 18px;
  }
</style>
