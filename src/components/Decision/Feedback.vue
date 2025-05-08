<template>
  <div class="card feedback-card" ref="feedbackArea">
    <!-- 展開/收合 Button -->
    <button class="card-toggle-btn is-blue expand"></button>

    <div class="card-title">
      <h3>意見回饋</h3>

      <!-- <div class="dropdown is-secondary is-solid height-limit is-up">
        <div class="dropdown-trigger">
          <button class="button" aria-haspopup="true" aria-controls="dropdown-menu">
            <span>請選擇模板</span>
            <img src="/src/assets/images/icon-arrow-down-light.svg" alt="ARROW" />
          </button>
        </div>
        <div class="dropdown-menu" id="dropdown-menu" role="menu">
          <div class="dropdown-content">
            <a href="#" class="dropdown-item open-modal" data-target="dealAfterCaseModal">
              <span>請承辦於結案後處理</span>
              <img src="/src/assets/images/icon-add-secondary.svg" alt="ADD" />
            </a>
            <a class="dropdown-item">一般身故先行給付，意外部份查後再議</a>
            <a class="dropdown-item">交查求診病歷後再議</a>
            <a class="dropdown-item">本件可先付後查</a>
            <a class="dropdown-item">試與保戶合意解除</a>
            <a class="dropdown-item">逕發函解除</a>
            <a class="dropdown-item">待其他交查病歷回覆後再評估</a>
            <a class="dropdown-item">照會國泰醫院醫師意見後再議</a>
            <a class="dropdown-item">手術選碼 / 等級錯誤</a>
            <a class="dropdown-item">手術次數有誤</a>
            <a class="dropdown-item">系統重複試算</a>
            <a class="dropdown-item">符理賠政策性融通</a>
          </div>
        </div>
      </div> -->
    </div>
    <!-- 收合時 Hidden 區塊-->
    <div class="hidden-parts">
      <div class="button-area is-flex is-justify-content-space-between my-4">
        <button class="button is-secondary p-5" @click="openPayDatailModal" :disabled="signInitData.IS_PAY_DETAIL === 'N'">
          給付明細輸入
          <img
            class="ml-2"
            v-if="signInitData.IS_PAY_DETAIL === 'Y'"
            src="/src/assets/images/icon-check-light.svg"
            alt="CHECKMARK"
          />
        </button>
        <button class="button is-secondary p-5" @click="onClickNeedPay" :disabled="signInitData.IS_NPAY === 'N'">
          不給付函檢視
          <img class="ml-2" v-if="signInitData.IS_NPAY === 'Y'" src="/src/assets/images/icon-check-light.svg" alt="CHECKMARK" />
        </button>
        <button class="button is-secondary p-5" @click="openRelieveRemarkModal" :disabled="signInitData.IS_CANCEL_RMK === 'N'">
          解除註記
          <img
            class="ml-2"
            v-if="signInitData.IS_CANCEL_RMK === 'Y'"
            src="/src/assets/images/icon-check-light.svg"
            alt="CHECKMARK"
          />
        </button>
      </div>
      <div class="dropdown-area">
        <BaseDropdown
          class="is-secondary is-solid height-limit is-up width-limit"
          :options="feedbackOptions"
          :onSelected="onDropdownSelected"
        ></BaseDropdown>
        <SignLevelDropdown class="is-secondary"></SignLevelDropdown>
      </div>
      <span v-if="applyStore.isLifeGroup || applyStore.isLifeSchool" style="color: red;">
        若為2年內事故，請自行確認分層負責表，簽至對應簽核層級</span>

      <textarea
        class="resize-vertical is-secondary font-eudc"
        placeholder="請由下拉選單新增意見回饋"
        rows="1"
        v-model="feedbackText"
      ></textarea>
      <!-- Button Group -->
      <div class="feedback-card-btn-group">
        <button class="is-thirdly" @click="onClickFeedbackButton('doBack')">
          <img src="/src/assets/images/icon-leave-dark.svg" alt="LEAVE" />
          退回
        </button>
        <button class="is-secondary ml-10" @click="onClickFeedbackButton('doAcceptAndEndCase')">
          如擬
          <img src="/src/assets/images/icon-arrow-right.svg" alt="RIGHT" />
        </button>
        <button
          class="is-secondary ml-10"
          :disabled="applyStore.basicData.APLY_STS == '47'"
          @click="onClickFeedbackButton('doSign')"
        >
          擬如擬
          <img src="/src/assets/images/icon-arrow-right.svg" alt="RIGHT" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { isEmpty } from 'lodash-es';
import { storeToRefs } from 'pinia';
import { nextTick } from 'vue';
import { useRouter } from 'vue-router';
import addIcon from '~/assets/images/icon-add-secondary.svg';
import { toggleCard } from '~/common/utils';
import { CaseTablesType, WaitApproveType } from '~/common/utils/enum';
import useModal from '~/composables/useModal';
import useSwal from '~/composables/useSwal';
import PayDetailModal from '~/pages/master/components/Accounting/Modals/PayDetailModal.vue';
import RelieveRemarkModal from '~/pages/master/components/Accounting/Modals/RelieveRemarkModal.vue';
import { useAccountingStore } from '~/stores/accounting.js';
import { useApplyStore } from '~/stores/apply';
import { useBeneficiaryStore } from '~/stores/beneficiary';
import { useDecisionStore } from '~/stores/decision';
import { useHomeStore } from '~/stores/home';
import BaseDropdown from '../BaseDropdown.vue';
import AfterEndCaseModal from './Modals/AfterEndCaseModal.vue';
import SignLevelDropdown from './SignLevelDropdown.vue';

  const { $swal } = useSwal();
  const { $m } = useModal();
  const decisionStore = useDecisionStore();
  const applyStore = useApplyStore();
  const beneficiaryStore = useBeneficiaryStore();
  const homeStore = useHomeStore();
  const applyNo = inject('ApplyNo');
  const accountingStore = useAccountingStore();

  // 取得簽呈初始化資料
  const { signInitData, feedbackText } = storeToRefs(decisionStore);
  const { currentWaitApproveType, currentCaseTablesType } = storeToRefs(homeStore);

  // 使用者輸入的意見回饋
  //const feedbackText = ref('');

  // const afterCaseItem = computed(() => signInitData.value.END_ITEM_LIST.filter(item => item.IS_CHECKED));

  // 意見回饋模板下拉選單選項
  const feedbackOptions = reactive([
    {
      name: '請選擇意見回饋',
      value: '',
      selected: true,
      disabled: true
    }
  ]);

  // 取得下拉選單選項
  if (signInitData.value?.SIGN_CAN_LIST) {
    feedbackOptions.push(
      ...signInitData.value.SIGN_CAN_LIST.map((s) => ({
        name: s.SIGN_CAN_NAME + (s.SIGN_CAN_CODE === '1' ? `<img src="${addIcon}" class="add-icon" />` : ''),
        value: s.SIGN_CAN_CODE,
        isCreate: s.SIGN_CAN_CODE === '1'
      }))
    );
  }

  // 選擇下拉選單選項時
  const onDropdownSelected = (value) => {
    console.log(value);
    // 結案後處理
    if (value === '1') {
      // 跳Modal，Modal內會直接操作END_ITEM_LIST
      $m.show({
        component: AfterEndCaseModal,
        id: 'dealAfterCaseModal',
        data: {
          emitEvent: {
            submit: (endItemList) => {
              console.log(endItemList);
              if (feedbackText.value) feedbackText.value += '\n';
              feedbackText.value += '請承辦於結案後處理：' + endItemList.map((e) => e.END_ITEM_NAME + e.INPUT_VALUE).join('、');
            }
          }
        }
      });
    } else {
      feedbackText.value += (feedbackText.value ? '、' : '') + feedbackOptions.find((option) => option.value === value)?.name;
    }
  };

  const router = useRouter();

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

  // 不給付通知函檢視
  const onClickNeedPay = async() => {
    try{
      let result = await decisionStore.checkIsNew(applyNo);

      if (!result.IS_SUCCESS) throw result.RTN_MSG;

      let isNew = result.IS_NEW === 'Y';

      if(isNew){
        if (import.meta.env.DEV) {
          let routeData = router.resolve({
            path: '/master/no_payment_letter_input',
            query: { applyNo }
          });
          window.open(routeData.href, '_blank');
        } else {
          window.open('/servlet/HttpDispatcher/AAB3_1000/prompt#/master/no_payment_letter_input?applyNo=' + applyNo);
        }
      } else {
        window.open(`/servlet/HttpDispatcher/AABA_0600/query?APLY_NO=${applyNo}&isfrom0402=Z`);
      }
    } catch (e) {
      $swal.fail(e);
    }
  };

  // 點擊下方三顆按鈕
  const onClickFeedbackButton = async (type) => {
    if ((type === 'doSign' || type === 'doAcceptAndEndCase') &&
        (applyStore.reviewerInfo?.STEP_STS === '2' && decisionStore.signInitData?.IS_BENE_CHG === 'Y' && beneficiaryStore.isChkBeneficiary === 'N')) {
      $swal.warning('本件受益人分配有調整異動，請確認內容正確');
      return;
    }

    if (!feedbackText.value) {
      $swal.warning('請填寫內容');
      return;
    } //else if (
      //decisionStore.signInitData.SYS_SIGN_LVL &&
      //decisionStore.currentSelectedSignLevel < decisionStore.signInitData.SYS_SIGN_LVL
    //) {
    //  $swal.info(`本件案件簽呈至少需至【${SignLevel.getChinese(decisionStore.signInitData.SYS_SIGN_LVL)}】。`);
      //return;
    //}
    // 覆核或主管希望按下退回跟如擬時，跳出確認訊息
    else if (type === 'doBack' || type === 'doAcceptAndEndCase') {
      let prompt = await $swal.confirmAsync(`確定要${type === 'doBack' ? '退回' : '如擬'}嗎？`);
      if (!prompt.isConfirmed) return;
    }

    // 檢核是否有包含給付已超過上限項目
    if (type === 'doAcceptAndEndCase' || type === 'doSign') {
      const chkResult = await decisionStore.chkLmtExptNo(applyNo);
        if (chkResult.IS_SUCCESS) {
          if (chkResult.IS_SHOW_MSG === 'Y') {
            let r = await $swal.confirmAsync(
            chkResult.SHOW_MSG,
            '確認',
            '若要繼續，請按確認，若不繼續，請按取消',
            '取消'
            );

          if (r.isConfirmed) {
            console.log('chkLmtExptNo confirmed');
          } else {
            return;
          }
          }
        }

      // 提示爭議案件
      const disputedCasesMsg = await accountingStore.alertDisputedCasesMsg(applyNo);
      if (disputedCasesMsg) {
          let r = await $swal.confirmAsync(
          disputedCasesMsg,
          '確認',
          '若要繼續，請按確認，若不繼續，請按取消',
          '取消'
          );

        if (r.isConfirmed) {
          console.log('disputedCasesMsg confirmed');
        } else {
          return;
        }
      }
    }

    try {
      if(type === 'doAcceptAndEndCase'){
        decisionStore.showLoading();
        const result = await decisionStore.doFeedback(type, applyNo);

        // 成功
        if (result.IS_SUCCESS) {
          $swal.success(result.RTN_MSG);
          // 成功返回個人化首頁
          // 20221221 如果是學團險，要回學團險清單
          if (applyStore.isLifeGroup || applyStore.isLifeSchool) {
            router.push({ name: 'home', query: { schoolGroup: 'true' } });
          } else if(currentWaitApproveType.value === WaitApproveType.WaitEnd) {
            // 回待結案頁
            router.push({ name: 'home', query: { waitEnd: 'true' } });
          } else if(currentCaseTablesType.value === CaseTablesType.ToBeSigned & isEmpty(currentWaitApproveType.value)) {
            // 回待簽擬頁
            router.push({ name: 'home', query: { toBeSigned: 'true' } });
          } else {
            router.push({ name: 'home' });
          }
          await nextTick();
          useHomeStore().resetAllStores();
        } else {
          // 失敗
          if (result.ERR_CODE !== '-301') throw result.RTN_MSG;
          decisionStore.hideLoading();
        }

        // 失敗，但需跳確認視窗確認 "ERR_CODE":"-301"
        // 若 QUES_TYPE 非 X，則表示要先跳出的訊息視窗，可以選擇是 or 否
        if (result.QUES_TYPE !== 'X' && result.QUES_MSG) {
          let promptTitle = '請確認';
          switch (result.QUES_TYPE) {
            case 'A':
              promptTitle = '非即時匯撥時間提醒';
              break;
            default:
              break;
          }
          
          let prompt = await $swal.confirmAsync(promptTitle, '確定', result.QUES_MSG);
          decisionStore.showLoading();

          const saveAgainResult = await decisionStore.doFeedback(type, applyNo, result.QUES_TYPE, prompt.isConfirmed ? 'Y' : 'N' );
          if (!saveAgainResult.IS_SUCCESS) throw saveAgainResult.RTN_MSG;
          $swal.success(saveAgainResult.RTN_MSG);
          // 成功返回個人化首頁
          router.push({ name: 'home' });
          await nextTick();
          useHomeStore().resetAllStores();
        }
      } else {
        decisionStore.showLoading();
        const result = await decisionStore.doFeedback(type, applyNo);
        if (!result.IS_SUCCESS) throw result.RTN_MSG;
        $swal.success(result.RTN_MSG);
        // 成功返回個人化首頁
        // 20221221 如果是學團險，要回學團險清單
        if (applyStore.isLifeGroup || applyStore.isLifeSchool) {
          router.push({ name: 'home', query: { schoolGroup: 'true' } });
        } else {
          router.push({ name: 'home' });
        }
        await nextTick();
        useHomeStore().resetAllStores();
      }
    } catch (e) {
      $swal.fail(e);
    } finally {
      decisionStore.hideLoading();
    }
  };

  const feedbackArea = ref(null);
  onMounted(() => {
    toggleCard(feedbackArea.value);
  });
</script>

<style lang="scss" scoped>
  .button-area .is-secondary {
    background-color: #4f8ec9;
    max-width: 33%;
  }
</style>
