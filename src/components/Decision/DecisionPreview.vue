<!-- 簽呈預覽區塊 -->
<template>
  <div :class="['part', { 'border-none': index === 0 }]" v-for="(rfa, index) in previewRFAs" :key="rfa.RFA.id">
    <div class="part-title font-eudc">
      <h3>{{ rfa.RFA.name }}</h3>
    </div>
    <div class="classification font-eudc" v-for="subRfa in rfa.SUBRFAS" :key="subRfa.id">
      <h6>{{ subRfa.name }}</h6>
      <p v-for="(rfaContent, index) in subRfa.subRfas">
        <span>{{ index + 1 }}.</span>{{ rfaContent.ALT_CONT ? rfaContent.ALT_CONT : rfaContent.RFA_CONT }}
      </p>
    </div>
  </div>
  <!-- 不是reviewer的話表示為簽呈預覽中，才有這些按鈕 -->
  <template v-if="!isReview">
    <div class="part case-officer first-case-officer">
      <div class="officer">
        <p>
          {{ submitUser?.EMP_NAME }}<span>{{ submitTime }}</span>
        </p>
      </div>
    </div>
    <div class="part">
      <div class="columns is-multiline preview-btn-group">
        <div class="column is-12">
          <button class="button is-secondary is-outline is-6" @click="onClickBack">
            <img src="/src/assets/images/icon-leave-dark.svg" alt="leave" />返回修改
          </button>
          <button class="button is-secondary is-6" v-if="isNeedNoPay === 'Y'" @click="onClickNeedPay">
            不給付通知函輸入
            <img v-if="isInputNoPay === 'Y'" class="ml-1" src="/src/assets/images/icon-check-has-bg.svg" alt="COMPLETE" />
          </button>
        </div>
        <div class="column is-12">
          <button class="button is-secondary" :disabled="disableSignSendBtn" @click="onClickSubmit">
            送出簽呈<img class="ml-10" src="/src/assets/images/icon-arrow-right.svg" alt="submit" />
          </button>
        </div>
      </div>
    </div>
  </template>
  <template v-else>
    <div class="part case-officer p-0">
      <div class="officer">
        <p>
          {{ submitUser }}<span>{{ submitTime }}</span>
        </p>
      </div>
    </div>
    <div class="part case-officer" v-for="managerRfa in managerRfas">
      <div class="opinion font-eudc">
        <p>{{ managerRfa?.SIGN_CTX }}</p>
      </div>
      <div class="officer">
        <p>
          {{ managerRfa?.SIGN_NAME
          }}<span>{{ getROCDate(managerRfa?.SIGN_TIME || managerRfa?.SING_TIME, 'MM-DD HH:mm:ss') }}</span>
        </p>
      </div>
    </div>
  </template>
</template>

<script setup>
  import { storeToRefs } from 'pinia';
import { inject } from 'vue';
import { useRouter } from 'vue-router';
import useModal from '~/composables/useModal';
import useMoment from '~/composables/useMoment';
import useSwal from '~/composables/useSwal';
import { useAccountingStore } from '~/stores/accounting.js';
import { useApplyStore } from '~/stores/apply';
import { useDecisionStore } from '~/stores/decision';
import { useHomeStore } from '~/stores/home';
import { apiCheckDecision } from '../../../src/common/api/index.js';

  const accountingStore = useAccountingStore();
  const homeStore = useHomeStore();
  const applyStore = useApplyStore();
  const { $m } = useModal();
  const { $swal } = useSwal();
  const decisionStore = useDecisionStore();
  const { isPreview, disablePreviewBtn, disableSignSendBtn } = storeToRefs(decisionStore);
  const { now, getROCDate } = useMoment();
  const props = defineProps({
    currentRFAs: {
      type: Array,
      required: true,
      default: []
    },
    isReview: {
      type: Boolean,
      required: true,
      default: false
    },
    procData: {
      type: Object,
      required: false,
      default: {}
    },
    managerRfas: {
      type: Array,
      required: false,
      default: []
    }
  });
  const applyNo = inject('ApplyNo');
  const OCR_ID = applyStore.basicData.OCR_ID;
  const isReadonly = inject('IsReadonly');
  // 點擊返回按鈕
  const emit = defineEmits(['onClickBack']);
  const router = useRouter();
  const onClickBack = () => {
    // 關閉預覽模式
    isPreview.value = false;
    disablePreviewBtn.value = false;
    // 左邊把readonly模式關閉
    router.replace({ query: { q: applyNo, readonly: -1 } });
    isReadonly.value = false;

    emit('onClickBack');
  };
  // 整理簽呈預覽內容
  const previewRFAs = computed(() => {
    const finalRFAs = [];
    for (let rfa of props.currentRFAs) {
      const subRFAs = [];
      for (let subRfa of rfa.rfas) {
        // 在簽呈預覽時要以ALT_SCAT_NAME為主
        const findSubRfa = subRFAs.find((r) => {
          if (subRfa.ALT_SCAT_NAME) return r.name === subRfa.ALT_SCAT_NAME;
          else return r.name === subRfa.RFA_SCAT_NAME;
        });
        if (findSubRfa) {
          findSubRfa.subRfas.push(subRfa);
        } else {
          subRFAs.push({
            id: subRfa.ALT_SCAT_ID ? subRfa.ALT_SCAT_ID : subRfa.RFA_SCAT_ID,
            name: subRfa.ALT_SCAT_NAME ? subRfa.ALT_SCAT_NAME : subRfa.RFA_SCAT_NAME,
            subRfas: [subRfa]
          });
        }
      }
      finalRFAs.push({ RFA: { id: rfa.categoryId, name: rfa.categoryName }, SUBRFAS: subRFAs });
    }
    console.log(finalRFAs);
    return finalRFAs;
  });

  // 點擊送出
  const onClickSubmit = async () => {
    let isValid = decisionStore.validateRisk();
    if (!isValid) {
      $swal.fail('資料有誤，請再次確認', '請確認資料無誤後再次送出。');
      return;
    }
    
    // 檢查爭議案件簽核卡控
    try {
        let response = await apiCheckDecision([applyNo, OCR_ID]);
        if (response.data.result.RTN_RS === 'N') {
          $swal.fail(response.data.result.RTN_MSG);
          return;
        }
    } catch (e) {
      $swal.fail(response.data.result.RTN_MSG);
    }

    // 呼叫送出API
    try {
      disableSignSendBtn.value = true;
      decisionStore.showLoading();
      let result = await decisionStore.doSignSend(applyNo);
      if (!result.IS_SUCCESS) {
        if (result.ERR_CODE !== '-301') throw result.RTN_MSG;

        decisionStore.hideLoading();
        // 失敗，但需跳確認視窗確認 "ERR_CODE":"-301"
        // 若 QUES_TYPE 為A，則表示要先跳出的訊息視窗，可以選擇是 or 否
        if (result.QUES_TYPE === 'A' && result.QUES_MSG) {
          let prompt = await $swal.confirmAsync('請確認', '確定', result.QUES_MSG);
          if (prompt.isConfirmed) {
            window.open('/AIWeb/servlet/HttpDispatcher/AIF0_0100/prompt');
          }

          disableSignSendBtn.value = false;
          return;
        }
        // 若 QUES_TYPE 為B，為避免醫療限額保險金重複給付之卡控規則，要先跳出的訊息視窗，可以選擇是 or 否
        if (result.QUES_TYPE === 'B' && result.QUES_MSG) {
          let prompt = await $swal.confirmAsync('請確認', '確定', result.QUES_MSG);
          if (prompt.isConfirmed) {
            window.open(`/AIWeb/servlet/HttpDispatcher/AIF0_0100/prompt?CASE_NO=${applyNo}`);
          }

          disableSignSendBtn.value = false;
          return;
        }
      }

      $swal.success(result.RTN_MSG);
      // 成功返回個人化首頁
      homeStore.resetAllStores();
      // 20221221 如果是學團險，要回學團險清單
      if (applyStore.isLifeGroup || applyStore.isLifeSchool) {
        router.push({ name: 'home', query: { schoolGroup: 'true' } });
      } else {
        router.push({ name: 'home' });
      }
    } catch (e) {
      disableSignSendBtn.value = false;
      $swal.fail(e);
    } finally {
      decisionStore.hideLoading();
    }
  };
  // 是否有不給付通知函輸入按鈕
  const isNeedNoPay = ref('');
  // 是否有不給付通知函icon
  const isInputNoPay = ref('');

  if (!props.isReview && decisionStore.previewData) {
    // 如果是預覽，取得dosignpreview結果
    isNeedNoPay.value = decisionStore.previewData.IS_NPAY_NTIF;
    isInputNoPay.value = decisionStore.previewData.NPAY_NTIF_DONE;
  }

  // 清除暫存
  localStorage.removeItem('isInputNoPay_' + applyNo);

  // 如果是承辦，取得目前登入人員/填寫人員
  const submitUser = props.isReview ? props.procData?.PROC_NAME : await homeStore.getCurrentUser();
  // 顯示送出的時間
  const submitTime = props.isReview ? getROCDate(props.procData.PROC_DT, 'MM-DD HH:mm:ss') : now();
  // console.log(previewRFAs.value);

  const onClickNeedPay = async () => {
    try {
      let result = await decisionStore.checkIsNew(applyNo);

      if (!result.IS_SUCCESS) throw result.RTN_MSG;

      let isNew = result.IS_NEW === 'Y';

      if (isNew) {
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
        window.open(`/servlet/HttpDispatcher/AABA_0600/query?APLY_NO=${applyNo}&isfrom0402=Y`);
      }
    } catch (e) {
      $swal.fail(e);
    }
  };

  const listenerStorage = async () => {
    const inputStatus = localStorage.getItem('isInputNoPay_' + applyNo);

    if (isInputNoPay.value !== 'Y') {
      isInputNoPay.value = inputStatus;
    }

    localStorage.removeItem('isInputNoPay_' + applyNo);
  };

  onMounted(() => {
    window.addEventListener('storage', listenerStorage);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('storage', listenerStorage);
  });
</script>

<style lang="scss" scoped>
  .is-6 {
    width: 48.5% !important;
  }
</style>
