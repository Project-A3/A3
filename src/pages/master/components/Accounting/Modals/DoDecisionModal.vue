<template>
  <Modal>
    <template v-slot:title>人工核定-{{ props.data?.title }}</template>
    <template v-slot:content>
      <!-- Title-->
      <div class="columns title">
        <h3>保單明細</h3>
        <label class="is-16px">
          <input class="show-all-message" type="checkbox" @change="onShowAllChanged" :checked="isShowAll" />
          <span>顯示全部內容</span>
        </label>
      </div>

      <!-- Table-->
      <div class="manual-approved-table">
        <!-- Insurance 1 -->
        <div class="table-part" v-for="(policies, policyNo, pIndex) in groupPolicies">
          <div class="columns table-title">
            <div class="column">保單號碼 {{ policyNo }}</div>
          </div>
          <!-- Insurance Type 1-1 -->
          <div class="columns table-num" v-for="(policy, index) in policies">
            <div class="column is-narrow ver-center">
              <div class="number">{{ index + 1 }}</div>
            </div>
            <div class="column">
              <div class="columns data-status">
                <div class="column is-9">
                  <div class="columns is-multiline">
                    <div class="column is-5">
                      <span class="field mr-57">險別</span>
                      <span class="data">{{ policy.PROD_ID }} {{ policy.PROD_ID_NAME }}</span>
                    </div>
                    <div class="column is-4">
                      <span class="field">理賠項目</span>
                      <span class="data">{{ policy.CLAM_ITEM.CLAM_AMT_NAME }}</span>
                    </div>
                    <div class="column is-3">
                      <span class="field mr-57">保額</span>
                      <span class="data">{{ policy.CLAM_ITEM.FACE_AMT }}{{ policy.CLAM_ITEM.FACE_AMT_UNIT_NAME }}</span>
                    </div>
                    <template v-if="isShowAll">
                      <div class="column is-5 hidden-info">
                        <span class="field">給付天數</span>
                        <span class="data">{{ policy.CLAM_ITEM.PAY_DAY }}天</span>
                      </div>
                      <div class="column is-4 hidden-info">
                        <span class="field">試算金額</span>
                        <span class="data">{{ policy.CLAM_ITEM.TRIL_CALC_AMT }}元</span>
                      </div>
                      <div class="column is-3 hidden-info">
                        <span class="field">給付金額</span>
                        <span class="data">{{ policy.CLAM_ITEM.PAY_AMT }}元</span>
                      </div>
                    </template>
                  </div>
                </div>
                <div class="column is-4 ver-center">
                  <span class="field mr-20">給付狀態</span>
                  <span class="data">
                    <div class="dropdown status disabled">
                      <div class="dropdown-trigger">
                        <button class="button" aria-haspopup="true" aria-controls="dropdown-menu">
                          <span>{{ PayItemStatus.getChineseStatus(policy.CLAM_ITEM.PAY_STS) }}</span>
                          <img src="/src/assets/images/icon-arrow-down-disabled.svg" alt="ARROW" />
                        </button>
                      </div>
                    </div>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Title-->
      <div class="columns title">
        <h3>修改原因</h3>
      </div>
      <div class="dropdown edit-reason">
        <div class="dropdown-trigger">
          <button class="button" @click="openReasonModal">
            <span>{{ reasonCode ? reasonCode : '請選擇' }}</span>
            <img src="/src/assets/images/icon-add.svg" alt="ADD" />
          </button>
        </div>
      </div>
      <textarea
        class="font-eudc"
        cols="30"
        rows="10"
        placeholder="請輸入修改原因。注意不可輸入:(){}'&quot;；8 種字元，且限 300 字。"
        v-model="reasonMemo"
      ></textarea>
    </template>
    <template v-slot:buttons>
      <button class="button is-light close-modal" @click="props.close">取消</button>
      <button class="button is-primary close-modal" @click="onSubmit">確認</button>
    </template>
  </Modal>
  <ManualReasonModal
    v-if="isReasonModalShow"
    :data="{ reasonCode }"
    :close="
      () => {
        isReasonModalShow = false;
      }
    "
    @onClickConfirm="onReasonChoosed"
  ></ManualReasonModal>
</template>

<script setup>
  import { cloneDeep, groupBy, toSafeInteger } from 'lodash-es';
  import { PayItemStatus } from '~/common/utils/enum';
  import Modal from '~/components/Modal.vue';
  import useSwal from '~/composables/useSwal';
  import { useAccountingStore } from '~/stores/accounting';
  import ManualReasonModal from './ManualReasonModal.vue';
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
  const accountingStore = useAccountingStore();
  // 複製一份更改狀態
  const editStatusPolicies = cloneDeep(props.data.policies);
  editStatusPolicies.forEach((policy) => (policy.CLAM_ITEM.PAY_STS = props.data.status));
  console.log(editStatusPolicies);
  const groupPolicies = ref(groupBy(editStatusPolicies, (p) => p.POLICY_NO));

  console.log(groupPolicies);

  const isShowAll = ref(props.data.status === PayItemStatus.AgreementPay);

  // 帶入第一筆修改原因
  const reasonCode = ref(editStatusPolicies[0]?.CLAM_ITEM?.CHG_RESN);
  const reasonMemo = ref(editStatusPolicies[0]?.CLAM_ITEM?.CHG_MEMO);

  const onShowAllChanged = (e) => {
    isShowAll.value = e.target.checked;
  };

  const onSubmit = async () => {
    try {
      accountingStore.showLoading();
      await accountingStore.doPayDecision({
        reson: reasonCode.value,
        memo: reasonMemo.value,
        ...props.data
      });
      $swal.success('操作成功');
      props.close();
    } catch (e) {
      $swal.fail(e);
    } finally {
      accountingStore.hideLoading();
    }
  };

  const isReasonModalShow = ref(false);
  const openReasonModal = () => {
    isReasonModalShow.value = true;
  };
  const onReasonChoosed = (reason) => {
    console.log(reason);
    reasonCode.value = reason.code;
    reasonMemo.value = reason.name;
    isReasonModalShow.value = false;
    // selectedReason.content = reason.name;
  };
</script>

<style lang="scss" scoped>
  .manual-approved-table {
    .is-multiline {
      .column {
        display: flex;
        align-items: center;
        .field {
          white-space: nowrap;
        }
        .data {
          padding-right: 5px;
        }
      }
    }
  }
</style>
