<template>
  <!-- Second Card -->
  <div class="card is-full second-card" id="paymentItemCard" ref="paymentItemCard">
    <div class="columns card-title sticky-basic-info">
      <div class="column p-0">
        <h3>核付項目</h3>
      </div>
    </div>

    <div class="table-content">
      <table class="table is-fullwidth">
        <thead>
          <tr class="scroll-fix">
            <th>險別</th>
            <th class="has-text-centered" v-if="showRoleName">關係</th>
            <th v-show="applyStore.isManager">除外</th>
            <th class="has-text-right">保額</th>
            <th class="has-text-left">單位</th>
            <th>給付狀態</th>
            <th class="has-text-right">天數</th>
            <th style="width: 15%;">理賠項目</th>
            <th></th>
            <th class="has-text-right">試算金額</th>
            <th class="has-text-right" :style="{ borderTopRightRadius: applyStore.isManager ? '15px' : '0' }">給付金額</th>
            <th class="has-text-centered w-006" v-show="!applyStore.isManager">
              <label class="is-light">
                <input type="checkbox" class="select-all" :checked="isCheckAll" @change="onCheckAllChanged" v-if="!isReadonly" />
                <span>處理</span>
              </label>
            </th>
            <th class="has-text-centered w-006" v-show="!applyStore.isManager">刪除</th>
          </tr>
        </thead>

        <tbody class="part" v-for="payItem in showPayItems" :key="payItem.POLICY_NO">
          <tr>
            <td colspan="12" class="table-title-inside">
              保單號碼
              <template v-if="applyStore.isManager"
                ><a class="" :href="`${payItem?.POLICY_NO_LINK}`" target="_blank">{{ payItem.POLICY_NO }}</a></template
              >
              <template v-else>{{ payItem.POLICY_NO }}</template>
              <span style="color:red" v-if="payItem.IS_BENE_CHANGE === 'Y'">&nbsp;受益人變更</span>
            </td>
          </tr>
          <template v-for="(prod, index) in payItem.PROD_ID_GROUP" :key="index">
            <tr>
              <td>
                <span class="font-eudc" v-if="index === 0 || prod.PROD_ID != payItem.PROD_ID_GROUP[index - 1].PROD_ID">
                  {{ prod.PROD_ID }} {{ prod.PROD_ID_NAME }}
                </span>
              </td>
              <td class="has-text-centered" v-if="showRoleName">{{ prod.CLAM_ITEM.ROLE_NAME }}</td>
              <td v-show="applyStore.isManager">
                <a class="has-text-danger" :href="prod?.CLAM_ITEM?.EXCL_CODE_LINK" target="_blank">
                  {{ prod?.CLAM_ITEM?.EXCL_CODE }}
                </a>
              </td>
              <td class="has-text-right">{{ prod.CLAM_ITEM.FACE_AMT }}</td>
              <td class="has-text-left">{{ prod.CLAM_ITEM.FACE_AMT_UNIT_NAME }}</td>
              <td class="">{{ PayItemStatus.getChineseStatus(prod.CLAM_ITEM.PAY_STS) }}</td>
              <td class="has-text-right">{{ prod.CLAM_ITEM.PAY_DAY }}</td>
              <td class="font-eudc">{{ prod.CLAM_ITEM.CLAM_AMT_NAME }}<label style="color:red" v-if="prod.CLAM_ITEM.EXTRA_INFO?.indexOf('FROM_DTAAB020') >= 0">(前案餘額)</label></td>
              <td class="has-text-centered">
                <button
                  class="button icon open"
                  v-if="prod.CLAM_ITEM.OPEN_FLAG === 'Y'"
                  @click="openExpenseModal(prod.CLAM_ITEM.APLY_NO, prod.CLAM_ITEM.CLAM_AMT_CODE, prod.CLAM_ITEM.SYS_NO)"
                ></button>
                <button class="button icon toggle" v-else-if="prod.CLAM_ITEM.PLUS_FLAG === 'Y'"></button>
              </td>
              <td class="has-text-right">{{ toCurrency(prod.CLAM_ITEM.TRIL_CALC_AMT) }}</td>
              <td class="has-text-right">
                <span :class="{ 'has-text-danger': prod.CLAM_ITEM.TRIL_CALC_AMT != prod.CLAM_ITEM.PAY_AMT }">
                  {{ toCurrency(prod.CLAM_ITEM.PAY_AMT) }}
                </span>
              </td>
              <td class="has-text-centered" v-show="!applyStore.isManager">
                <label class="is-dark" v-if="!isReadonly & prod.CLAM_ITEM.CHECKBOX_DISABLE != 'Y'">
                  <input type="checkbox" v-model="prod.CLAM_ITEM.IS_CHECKED" true-value="Y" false-value="N" />
                  <span></span>
                </label>
              </td>
              <td class="has-text-centered" v-show="!applyStore.isManager">
                <button
                  v-if="prod.CLAM_ITEM.MAN_ISRT_IND === 'Y'"
                  class="button icon trash"
                  @click="deletePayItem(prod.CLAM_ITEM)"
                  :disabled="isReadonly"
                ></button>
              </td>
            </tr>
            <tr class="hidden-info is-hidden">
              <td></td>
              <td colspan="10">
                <div class="columns is-multiline">
                  <div class="column is-4" v-if="!prod.CLAM_ITEM?.DATE_DTLS || prod.CLAM_ITEM?.DATE_DTLS.length === 0">
                    <template v-if="prod.CLAM_ITEM.EVT_END_DATE">
                      <span class="field">起始/終止日</span>
                      <span class="data">
                        {{
                          prod.CLAM_ITEM.EVT_STR_DATE == prod.CLAM_ITEM.EVT_END_DATE
                            ? getROCDate(prod.CLAM_ITEM.EVT_STR_DATE)
                            : `${getROCDate(prod.CLAM_ITEM.EVT_STR_DATE)}/${getROCDate(prod.CLAM_ITEM.EVT_END_DATE)}`
                        }}
                      </span>
                    </template>
                    <template v-else>
                      <span class="field">計息起日</span>
                      <span class="data">
                        {{ getROCDate(prod.CLAM_ITEM.EVT_STR_DATE) }}
                      </span>
                    </template>
                  </div>
                  <template v-if="prod.CLAM_ITEM.CLAM_AMT_CODE !== 'DCZ1'">
                    <div class="column is-4 is-flex is-align-items-center">
                      <span class="field" style="min-width: 65px">手術代碼</span>
                      <span class="data is-flex">
                        <span class="mr-1" v-if="prod.CLAM_ITEM.OP_CODE">{{ prod.CLAM_ITEM.OP_CODE }}</span>
                        <template v-if="prod.CLAM_ITEM.OP_NAME">
                          <template v-if="prod.CLAM_ITEM.OP_NAME.length <= 10">
                            {{ prod.CLAM_ITEM.OP_NAME }}
                          </template>
                          <div v-else class="limit-width" style="display: inline-block; max-width: 175px">
                            <EllipseTippy
                              :disableEllipse="true"
                              :content="`${prod.CLAM_ITEM.OP_CODE ?? ''} ${prod.CLAM_ITEM.OP_NAME}`"
                            >
                              {{ prod.CLAM_ITEM.OP_NAME }}
                            </EllipseTippy>
                          </div>
                        </template>
                      </span>
                    </div>
                    <div class="column is-4">
                      <span class="field">骨折代碼</span>
                      <span class="data">{{ prod.CLAM_ITEM.BONE_CODE }} {{ prod.CLAM_ITEM.BONE_NAME }}</span>
                    </div>
                    <div class="column is-4">
                      <span class="field">手術等級</span>
                      <span class="data">{{ prod.CLAM_ITEM.OP_GRAD_NAME }}&nbsp;</span>
                    </div>
                    <div class="column is-4">
                      <span class="field">手術倍數</span>
                      <span class="data">{{ prod.CLAM_ITEM.OP_RATIO }}&nbsp;</span>
                    </div>
                    <div class="column is-12 p-0">
                      <div class="columns" v-if="prod.CLAM_ITEM.DATE_DTLS && prod.CLAM_ITEM.DATE_DTLS.length > 0">
                        <div class="column is-narrow pt-2">
                          <span class="field">起始/終止日</span>
                        </div>
                        <div class="column p-0">
                          <div class="columns inner-second is-multiline">
                            <div class="column is-4" v-for="date in prod.CLAM_ITEM.DATE_DTLS" :key="date">
                              <span class="data" v-if="prod.CLAM_ITEM.IS_EMGY_ITEM === 'Y'">{{
                                handleEmgyDatetimeText(date)
                              }}</span>
                              <span class="data" v-else>{{ getROCDate(date) }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
              </td>
            </tr>
            <!-- 核定原因 -->
            <tr v-if="prod?.CLAM_ITEM?.CHG_MEMO || prod?.CLAM_ITEM?.CHG_RESN">
              <td colspan="2"></td>
              <td colspan="8" class="has-border-bot">
                <div class="reason font-eudc">
                  <p class="reason-code" :style="prod?.CLAM_ITEM?.IS_CODE_RED === 'Y' ? 'color: red' : ''">{{ prod?.CLAM_ITEM?.CHG_RESN }}</p>
                  {{ prod?.CLAM_ITEM?.CHG_MEMO }}
                </div>
              </td>
            </tr>
          </template>
        </tbody>

        <tfoot class="table-footer">
          <tr>
            <td colspan="6">
              <div class="columns" v-if="!applyStore.isManager">
                <div class="column">
                  <button class="button is-primary is-outline" @click="onClickAddPayItem" :disabled="isReadonly || !accountingStore.calcFlag">新增</button>
                  <button
                    class="button is-primary is-outline"
                    :disabled="checkedPayItems.length <= 0"
                    @click="onClickManualApprove"
                  >
                    人工核定
                  </button>
                  <button
                    class="button is-primary is-outline"
                    :disabled="checkedPayItems.length <= 0"
                    @click="openPayDecisionModal('協議給付', PayItemStatus.AgreementPay)"
                  >
                    協議給付
                  </button>
                  <button
                    class="button is-primary is-outline"
                    :disabled="checkedPayItems.length <= 0"
                    @click="openPayDecisionModal('不給付', PayItemStatus.ReturnNotPay)"
                  >
                    不給付
                  </button>
                  <button
                    class="button is-primary is-outline"
                    :disabled="checkedPayItems.length <= 0"
                    @click="openPayDecisionModal('暫不處理', PayItemStatus.Bypass)"
                  >
                    暫不處理
                  </button>
                </div>
              </div>
            </td>
            <!-- 審核人員 -->
            <td class="has-text-centered" v-if="!applyStore.isManager"><span>總金額</span></td>
            <td class="has-text-right total" v-if="!applyStore.isManager">{{ totalAmount.calResult.toLocaleString('en-US') }}</td>
            <td class="has-text-right total" v-if="!applyStore.isManager">{{ totalAmount.payResult.toLocaleString('en-US') }}</td>
            <td v-if="!applyStore.isManager"></td>
            <td v-if="!applyStore.isManager"></td>
            <!-- 覆核人員 -->
            <td colspan="2" class="has-text-centered" v-if="applyStore.isManager"><span>總金額</span></td>
            <td class="has-text-right total" v-if="applyStore.isManager">{{ totalAmount.calResult.toLocaleString('en-US') }}</td>
            <td class="has-text-right total" v-if="applyStore.isManager">{{ totalAmount.payResult.toLocaleString('en-US') }}</td>         
          </tr>
        </tfoot>
      </table>
    </div>
  </div>

  <PayDetailReview v-if="applyStore.isManager"></PayDetailReview>
  <EndCaseButtons v-if="applyStore.isManager"></EndCaseButtons>

  <div class="button-group columns">
    <div class="column p-0 ver-center">
      <button class="button is-primary" @click="onClickRestore" v-if="!applyStore.isManager" :disabled="isReadonly || !accountingStore.calcFlag">
        回復預設試算
      </button>
      <button class="button is-primary" @click="onClickClearCalculate" v-if="!applyStore.isManager" :disabled="isReadonly">
        清除試算結果
      </button>
      <button
        class="button is-primary"
        @click="onClickDoConfirm"
        v-if="!applyStore.isManager"
        :disabled="isReadonly || disableDoConfirm"
      >
        試算調整確認
      </button>
      <button class="button is-primary" @click="openPayDatailModal" v-if="!applyStore.isManager">
        給付明細說明輸入
        <img v-if="props?.payItems?.PAYMENT_FLAG === 'Y'" src="/src/assets/images/icon-check-light.svg" alt="CHECKMARK" />
      </button>
      <button class="button is-primary" v-if="!applyStore.isManager" @click="openRelieveRemarkModal">
        解除註記
        <img v-if="props?.payItems?.ANN_FLAG === 'Y'" src="/src/assets/images/icon-check-light.svg" alt="CHECKMARK" />
      </button>
    </div>
    <div class="column p-0 is-3 hor-right ver-center" v-if="!applyStore.isManager">
      <span class="field mb-0 bold color-is-title">例外授權碼</span>
      <input type="text" placeholder="請輸入" v-model="exptNo" :disabled="isReadonly" />
    </div>
  </div>

  <!-- 分期明細 -->
  <div class="card is-full installment-card is-expanded" v-if="showSprDetails.length > 0">
    <!-- 展開/收合 Button -->
    <button class="card-toggle-btn expand"></button>

    <div class="columns card-title">
      <div class="column p-0"><h3>分期明細</h3></div>
    </div>

    <div class="hidden-parts">
      <div class="table-content">
        <table class="table is-fullwidth">
          <thead class="no-wrap-title">
            <tr>
              <th>保單號碼</th>
              <th>受益人 ID</th>
              <th>保險金給付名稱</th>
              <th class="has-text-right w-006">給付金額</th>
              <th class="has-text-right">預計給付金額</th>
            </tr>
          </thead>
          <tbody v-for="detail in showSprDetails">
            <tr>
              <td>{{ detail.POLICY_NO }}</td>
              <td>{{ detail.BEN_ID }}</td>
              <td>{{ detail.PAY_PERIOD === '0' ? '身故保險金(一次給付)' : '分期定期保險金('+detail.PAY_PERIOD+')' }}</td>
              <td class="has-text-right">{{ toCurrency(parseFloat(detail.CAL_PAY_AMT)) }}</td>
              <td class="has-text-right">{{ toCurrency(parseFloat(detail.REAL_PAY_AMT)) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

</template>

<script setup>
  import { cloneDeep, orderBy, pull, uniqBy } from 'lodash-es';
import { storeToRefs } from 'pinia';
import { toCurrency } from '~/common/utils';
import { PayItemStatus } from '~/common/utils/enum';
import EllipseTippy from '~/components/EllipseTippy.vue';
import useModal from '~/composables/useModal';
import useMoment from '~/composables/useMoment';
import useSwal from '~/composables/useSwal';
import { useAccountingStore } from '~/stores/accounting';
import { useApplyStore } from '~/stores/apply';
import { useDecisionStore } from '~/stores/decision';
import EndCaseButtons from './EndCaseButtons.vue';
import AddPayItemModal from './Modals/AddPayItemModal.vue';
import DoDecisionModal from './Modals/DoDecisionModal.vue';
import ManualApproveModal from './Modals/ManualApproveModal.vue';
import PayDetailModal from './Modals/PayDetailModal.vue';
import RelieveRemarkModal from './Modals/RelieveRemarkModal.vue';
import PayDetailReview from './PayDetailReview.vue';

  const { $m } = useModal();
  const { $swal } = useSwal();
  const { getROCDate } = useMoment();
  const applyStore = useApplyStore();
  const accountingStore = useAccountingStore();
  const decisionStore = useDecisionStore();
  const applyNo = inject('ApplyNo');
  const isReadonly = inject('IsReadonly');
  const props = defineProps({
    payItems: {
      type: Object,
      required: false,
      default: { DATA: [] }
    }
  });

  const router = useRouter();

  const payItems = computed(() => (props?.payItems?.DATA ? props.payItems.DATA : accountingStore.payItemsData.DATA));

  const showRoleName = computed(() => (applyStore.isLifeGroup && (applyStore.reviewerInfo?.STEP_STS === '1' || applyStore.reviewerInfo?.STEP_STS === '2')));
  
  console.log(payItems.value);
 
  // 例外授權碼
  // 預設帶隨便一筆內的exptNo
  const exptNo = ref(payItems.value.length > 0 ? payItems.value[0].EXPT_NO : '');

  const showPayItems = computed(() => {
    let mapPayItems = payItems.value.map((p) => ({
      POLICY_NO: p.POLICY_NO,
      POLICY_NO_LINK: p?.POLICY_NO_LINK ?? '',
      MAN_ISRT_IND: p.MAN_ISRT_IND,
      PROD_ID_GROUP: [],
      IS_BENE_CHANGE: p.IS_BENE_CHANGE
    }));

    const resultArray = uniqBy(mapPayItems, (v) => v.POLICY_NO + v.MAN_ISRT_IND);
    console.log(resultArray);
    for (const payItem of payItems.value) {
      let findPolicy = resultArray.find((p) => p.POLICY_NO === payItem.POLICY_NO && p.MAN_ISRT_IND === payItem.MAN_ISRT_IND);
      if (findPolicy) {
        findPolicy.PROD_ID_GROUP.push({
          POLICY_NO: payItem.POLICY_NO,
          PROD_ID: payItem.PROD_ID,
          PROD_ID_NAME: payItem.PROD_ID_NAME,
          SER_NO: payItem.SER_NO,
          CLAM_ITEM: payItem,
          EXTRA_INFO: payItem.EXTRA_INFO
        });
      }
    }
    return orderBy(resultArray, ['POLICY_NO', 'MAN_ISRT_IND'], ['asc', 'asc']);
  });

  console.log(showPayItems.value);

  const showSprDetails = computed(() => accountingStore.sprData.DTAAB032List??[]);

  // 試算調整一開始不能點
  // 總額計算
  const { totalAmount, disableDoConfirm } = storeToRefs(accountingStore);

  // 新增
  const onClickAddPayItem = () => {
    $m.show({
      component: AddPayItemModal,
      id: 'addPaymentItem',
      data: { applyNo, manualPayItems: payItems.value.filter((p) => p.MAN_ISRT_IND === 'Y') }
    });
  };

  // 勾選要處理的核付項目
  const checkedPayItems = computed(() => {
    const results = [];
    for (const showPayItem of showPayItems.value) {
      for (const group of showPayItem.PROD_ID_GROUP) {
        if (group?.CLAM_ITEM?.IS_CHECKED === 'Y') {
          results.push(group);
        }
      }
    }
    return results;
  });

  // 人工核定
  const onClickManualApprove = () => {
    if (checkedPayItems.value.length !== 1) {
      $swal.warning('一次只能進行一筆人工核定');
      return;
    }
    const checkedItem = cloneDeep(checkedPayItems.value[0]);
    checkedItem.APLY_NO = applyNo;
    checkedItem.OCR_ID = applyStore.basicData.OCR_ID;
    checkedItem.OCR_DATE = applyStore.basicData.OCR_DATE;
    const passData = { policy: checkedItem, disbItems: [] };
    // 如果有失能程度就要帶入
    if (checkedItem.CLAM_ITEM.CLAM_CAT === 'B') {
      console.log(checkedItem);
      // APLY_NO + POLICY_NO + PROD_ID + CLAM_CAT + CLAM_AMT_CODE
      passData.disbItems = props.payItems.DATA_006.filter(
        (e) =>
          e.APLY_NO === applyNo &&
          e.POLICY_NO === checkedItem.POLICY_NO &&
          e.PROD_ID === checkedItem.PROD_ID &&
          e.CLAM_CAT === checkedItem.CLAM_ITEM.CLAM_CAT &&
          e.CLAM_AMT_CODE === checkedItem.CLAM_ITEM.CLAM_AMT_CODE
      );
    }
    $m.show({ component: ManualApproveModal, id: 'manualApproved', data: passData });
  };

  // 協議給付、不給付、暫不處理
  const openPayDecisionModal = (title, status) => {
    $m.show({
      component: DoDecisionModal,
      id: 'manualApprovedCompromise',
      data: {
        title,
        status,
        applyNo,
        ocrId: applyStore.basicData.OCR_ID,
        policies: checkedPayItems.value
      }
    });
  };

  // 給付明細輸入
  const openPayDatailModal = () => {
    $m.show({ component: PayDetailModal, id: 'paymentDetails', data: { applyNo } });
  };

  // 解除註記
  const openRelieveRemarkModal = () => {
    $m.show({
      component: RelieveRemarkModal,
      id: 'unannotate',
      data: { applyNo }
    });
  };

  // 全選判斷
  const isCheckAll = computed(() => payItems.value.every((p) => p.IS_CHECKED === 'Y'));

  // 全選處理
  const onCheckAllChanged = (e) => {
    for (const payItem of props.payItems.DATA) {
      payItem.IS_CHECKED = e.target.checked ? 'Y' : 'N';
    }
  };

  // 住院實支明細
  const openExpenseModal = (applyNo, clamAmtCode, sysNo) => {
    // $m.show({
    //   component: ExpenseDetailModal,
    //   id: 'claimItems',
    //   data: { applyNo, clamAmtCode, sysNo }
    // });
    // 20230210改成開新分頁
    if (import.meta.env.DEV) {
      let routeData = router.resolve({
        path: '/master/expense_detail',
        query: { applyNo, clamAmtCode, sysNo }
      });
      window.open(routeData.href, '_blank');
    } else {
      window.open('/servlet/HttpDispatcher/AAB3_1000/prompt#/master/expense_detail?applyNo=' + applyNo + '&clamAmtCode=' + clamAmtCode + '&sysNo=' + sysNo);
    }
  };

  // 刪除人工新增的給付項目
  const deletePayItem = (payItem) => {
    $swal.confirm('確定要刪除嗎?', () => {
      pull(payItems.value, payItem);
      // 刪除項目要觸發試算調整確認能點
      disableDoConfirm.value = false;
    });
  };

  // 試算調整確認
  const onClickDoConfirm = async () => {

    if (accountingStore.totalAmount.payResult < 0) {
      $swal.warning('總給付金額不得為負項，請調整試算');
      return false;
    }
    
    try {
      accountingStore.showLoading();
      const result = await accountingStore.doClamConfirm(applyNo, exptNo.value);
      accountingStore.isTopLimit = 'Y' === result.IS_TOP_LIMIT;
      accountingStore.topLimitMsg = result.RTN_MSG;

      if (!result.IS_SUCCESS) {
        if (accountingStore.isTopLimit) {
          accountingStore.hideLoading();
          
          const swalWithButtons = $swal.getInstance().mixin({
            customClass: {
              confirmButton: 'button swal-primary',
              cancelButton: 'button swal-light'
            },
            buttonsStyling: false
          });

          let prompt = await  swalWithButtons.fire({
            icon: 'warning',
            title: `<span>${accountingStore.topLimitMsg}</span>`,
            text: '',
            showCancelButton: true,
            cancelButtonText: '取消',
            confirmButtonText: '確定',
            reverseButtons: true
          });

          if (prompt.isConfirmed) {
            window.open(
              '/AIWeb/servlet/HttpDispatcher/AIF0_0100/prompt?TxRequest=true'
            );
          }
        }
      }

      if (result.IS_SUCCESS) {
        $swal.success(result.RTN_MSG ? result.RTN_MSG : '檢核成功');
      }
    } catch (e) {
      $swal.fail(e);
    } finally {
      accountingStore.hideLoading();
    }
  };

  // 回復預設試算
  const onClickRestore = async () => {
    try {
      accountingStore.showLoading();
      const result = await accountingStore.getReCalPayItems(applyNo);
      if (!result.isSuccess) throw result.message;
      // // 清除已選擇的Item 改成用IS_CHECKED判斷
      // checkedPayItems.value = [];
      $swal.success(result.message ? result.message : '操作成功');
    } catch (e) {
      $swal.fail(e);
    } finally {
      accountingStore.hideLoading();
    }
  };

  // 清除試算結果
  const onClickClearCalculate = async () => {
    try {
      accountingStore.showLoading();
      const result = await accountingStore.getClearCalculate(applyNo);
      if (!result.isSuccess) throw result.message;
      $swal.success(result.message ? result.message : '操作成功');
      disableDoConfirm.value = true;
    } catch (e) {
      $swal.fail(e);
    } finally {
      accountingStore.hideLoading();
    }
  };

  // 不給付通知函檢視
  const onClickNeedPay = () => {
    window.open(`/servlet/HttpDispatcher/AABA_0600/query?APLY_NO=${applyNo}&isfrom0402=Z`);
  };

  const handleEmgyDatetimeText = (text) => {
    var datetimeSplit = text.split('_');
    var startDate = getROCDate(`${datetimeSplit[0]} ${datetimeSplit[1]}`, 'MM-DD HH:mm');
    var endDate = getROCDate(`${datetimeSplit[2]} ${datetimeSplit[3]}`, 'MM-DD HH:mm');
    return `${startDate}/${endDate}`;
  };

  // For 覆核、主管判斷用
  // const signInitData = computed(() => decisionStore.signInitData);

  // UI JS
  const paymentItemCard = ref(null);
  let togglePayItem = (e) => {
    let toggleButton = e.target.closest('.button.toggle');
    if (toggleButton) {
      let hiddenInfo = toggleButton.closest('tr').nextElementSibling;
      if (hiddenInfo && hiddenInfo.classList.contains('hidden-info')) {
        toggleButton.closest('tr').classList.toggle('selected');
        toggleButton.classList.toggle('expand');
        hiddenInfo.classList.toggle('is-hidden');
      }
    }
  };
  onMounted(() => {
    paymentItemCard.value.addEventListener('click', togglePayItem);
    if (applyStore.isManager) {
      let page = document.querySelector('.page-accounting');
      if (page && !page.classList.contains('accounting-review')) {
        page.classList.add('accounting-review');
      }
    }
  });

  onBeforeUnmount(() => {
    paymentItemCard.value.removeEventListener('click', togglePayItem);
  });
</script>

<style lang="scss" scoped></style>
