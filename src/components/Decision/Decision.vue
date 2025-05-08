<template>
  <div :class="['card', 'decision-card', { 'edit-state': isEditMode, 'review-state': isReadonly }]" ref="decisionMainArea">
    <!-- 展開/收合 Button -->
    <button class="card-toggle-btn is-blue expand"></button>
    <div class="card-title">
      <h3>
        決策引導 <ErrorTippy v-if="!isDecisionValid" :errors="['請確認資料都有正確填寫']"></ErrorTippy
        ><span class="icd-text font-eudc" v-if="applyStore.icdCodeName && decisionStore.isDCNTEnable">({{ applyStore.icdCodeName }})</span>
      </h3>
    </div>

    <!-- 收合時 Hidden 區塊-->
    <div class="hidden-parts">
      <Tabs>
        <Tab
          title="互動問題"
          :isActive="decisionStore.isDCNTEnable && decisionStore.DCNTData.STATUS !== '2'"
          :isHidden="!decisionStore.isDCNTEnable"
        >
          <div
            class="part"
			:class="{ 'border-none': index === 0 }"									   
            v-for="(question, index) in currentQuestions"
            :key="question.QUE_SER_NO"
            v-show="question.QUE_IS_ON === 'Y'"
          >
            <div class="part-title">
              <span class="question-num">Q{{ index + 1 }}</span>
              <h3>
                <span class="font-eudc">{{ question.QUE_CONT }}</span>
                <a
                  href="javascript:void(0)"
                  v-for="remind in question.REMINDS"
                  :key="remind.REM_ID"
                  @click="openPdfModal(remind.REM_CONT, remind.REM_PDF_URL + remind.REM_PDF_FILE)"
                >
                  <img src="/src/assets/images/icon-paper-secondary.svg" alt="PAPER" />
                  <span class="font-eudc">{{ remind.REM_SCAT_NAME }}</span>
                </a>
              </h3>
            </div>
            <div class="button-group">
              <OptionButton
                v-for="option in question.OPTIONS"
                :key="option.OPT_SER_NO"
                :class="{ 'has-dot': question.QUE_TYPE === '2' && option.OPT_ID === question.SYS_DCN_ANS }"
                :isActive="option.OPT_IS_CHK === 'Y'"
                :disabled="isReadonly"
                @click.native="onClickOption(question.QUE_SER_NO, question.OPTIONS, option)"
              >
                <span class="font-eudc">{{ option.OPT_CONT }}</span>
              </OptionButton>
              <!-- <button class="button is-secondary is-outline has-dot is-active">有保單未滿 2 年</button>
              <button class="button is-secondary is-outline open-modal" data-target="qaWillReload">皆投保 2 年以上</button> -->
            </div>
          </div>
        </Tab>
        <Tab
          class="signed-content"
          title="簽呈內容"
          :isActive="!decisionStore.isDCNTEnable || decisionStore.DCNTData.STATUS === '2'"
        >
          <!-- 承辦可編輯簽呈 -->
          <template v-if="!isReadonly">
            <div class="part" v-for="rfaCat in currentRFAs" :key="rfaCat.categoryId">
              <div class="part-title font-eudc">
                <h3>{{ rfaCat.categoryName }}</h3>
              </div>
              <div class="columns is-multiline">
                <div class="column is-12" v-for="rfa in rfaCat.rfas" :key="rfa.RFA_ID">
                  <template v-if="isEditMode && rfa.RFA_IS_ALT === 'Y' && rfa.RFA_TYPE === '0'">
                    <div
                      class="tag dropdown is-solid width-full height-limit"
                      :class="{ 'is-secondary': rfa.RFA_TYPE === '0', 'is-yellow': rfa.RFA_TYPE > 0 }"
                    >
                      <div class="dropdown-trigger">
                        <button class="button" aria-haspopup="true" aria-controls="dropdown-menu">
                          <span>{{ rfa.ALT_SCAT_NAME ? rfa.ALT_SCAT_NAME : rfa.RFA_SCAT_NAME }}</span>
                          <img src="/src/assets/images/icon-arrow-down-light.svg" alt="ARROW DOWN" />
                        </button>
                      </div>
                      <div class="dropdown-menu" role="menu">
                        <div class="dropdown-content">
                          <a
                            class="dropdown-item"
                            v-for="subRfa in findSubRfas(rfaCat.categoryId)"
                            :key="subRfa.RFA_SCAT_ID"
                            @click.stop.prevent="updateSubRfa(rfa, subRfa)"
                          >
                            {{ subRfa.RFA_SCAT_NAME }}
                          </a>
                        </div>
                      </div>
                    </div>
                  </template>
                  <div v-else :class="['tag','font-eudc', { 'is-secondary': rfa.RFA_TYPE === '0', 'is-yellow': rfa.RFA_TYPE > 0 }]">
                    {{ rfa.ALT_SCAT_NAME ? rfa.ALT_SCAT_NAME : rfa.RFA_SCAT_NAME }}
                  </div>
                  <div v-if="isEditMode && rfa.RFA_IS_ALT === 'Y'" class="is-flex is-align-items-center w-100">
                    <textarea
                      :class="{ 'is-error': rfa.ERROR }"
                      class="font-eudc"
                      cols="15"
                      rows="3"
                      placeholder="請輸入新增內容"
                      @blur="updateRfaContent(rfa, $event)"
                      >{{ rfa.ALT_CONT ? rfa.ALT_CONT : rfa.RFA_CONT }}</textarea
                    >
                    <button class="button icon trash" @click="onClickDeleteRFA(rfa)"></button>
                  </div>
                  <p class="font-eudc" style="word-wrap: break-word;" v-else>{{ rfa.ALT_CONT ? rfa.ALT_CONT : rfa.RFA_CONT }}</p>
                  <div v-if="rfa.ERROR" style="width: 85%">
                    <div class="error-message"><img src="/src/assets/images/icon-warn.svg" alt="ERROR" />{{ rfa.ERROR }}</div>
                  </div>
                </div>
                <div class="column is-12 hor-right" v-if="isEditMode">
                  <div class="dropdown is-thirdly is-solid height-limit">
                    <div class="dropdown-trigger">
                      <button class="button apply-btn footer-btn" aria-haspopup="true" aria-controls="dropdown-menu">
                        <span>新增</span>
                        <img src="/src/assets/images/icon-arrow-down-light.svg" alt="ARROW" />
                      </button>
                    </div>
                    <div class="dropdown-menu" role="menu">
                      <div class="dropdown-content">
                        <a
                          href="javascript:void(0)"
                          class="dropdown-item"
                          v-for="subRfa in findSubRfas(rfaCat.categoryId)"
                          :key="subRfa.RFA_SCAT_ID"
                          @click="onClickAddRfa(subRfa)"
                        >
                          {{ subRfa.RFA_SCAT_NAME }}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 簽呈預覽按鈕 -->
            <div class="part">
              <div class="two-btns-group" v-if="!isEditMode">
                <button class="button is-secondary is-outline-fill" @click="onClickEdit">
                  <img src="/src/assets/images/icon-edit-secondary.svg" alt="edit" />
                  編輯簽呈
                </button>

                <button class="button is-secondary" :disabled="!isDecisionValid | disablePreviewBtn" @click="onClickPreview">
                  <img src="/src/assets/images/icon-eye-open.svg" alt="eye" />
                  簽呈預覽
                </button>
              </div>
              <button class="button is-secondary is-outline-fill" :disabled="!isRfaValid" @click="onClickComplete" v-else>
                <img src="/src/assets/images/icon-complete-secondary.svg" alt="complete" />
                完成編輯
              </button>
            </div>
          </template>
          <DecisionPreview
            v-else
            :currentRFAs="currentRFAs"
            :isReview="isReview"
            :procData="{ PROC_DT: DCNTData.PROC_DT, PROC_NAME: DCNTData.PROC_NAME }"
            :managerRfas="sortBy(MANG_SIGN, ['SHOW_ORDER_LV1'])"
          ></DecisionPreview>
        </Tab>
      </Tabs>
    </div>
  </div>
</template>

<script setup>
  import { cloneDeep, sortBy } from 'lodash-es';
import { storeToRefs } from 'pinia';
import { toggleCard, uuid } from '~/common/utils';
import useModal from '~/composables/useModal';
import useSwal from '~/composables/useSwal';
import { useApplyStore } from '~/stores/apply';
import { useDecisionStore } from '~/stores/decision';
import { useFooterStore } from '~/stores/footer';
import ErrorTippy from '../Editable/ErrorTippy.vue';
import Tab from '../Tabs/Tab.vue';
import Tabs from '../Tabs/Tabs.vue';
import DecisionPreview from './DecisionPreview.vue';
import AddRfaModal from './Modals/AddRfaModal.vue';
import PdfModal from './Modals/PdfModal.vue';
import OptionButton from './OptionButton.vue';

  const router = useRouter();
  const applyNo = inject('ApplyNo');
  const { $m } = useModal();
  const { $swal } = useSwal();
  const decisionStore = useDecisionStore();
  const applyStore = useApplyStore();
  const footerStore = useFooterStore();

  const { DCNTData, MANG_SIGN, currentQuestions, isPreview, isReadonly, isReview, disablePreviewBtn, riskInfo } = storeToRefs(decisionStore);
  // 左側核算結果會吃這個readonly
  const readonly = inject('IsReadonly');
  // 目前決策引導內顯示的問題
  // 取得所有簽呈大小類
  const getRFAs = await decisionStore.getAllRFAs();
  const findSubRfas = (categoryId) => getRFAs.find((r) => r.RFA_CAT_ID === categoryId)?.RFA_SCATS;

  const bindUUID = () => {
    for (let question of DCNTData.value.QUESTIONS) {
      for (let option of question.OPTIONS) {
        option.RFA.UUID = uuid();
      }
    }
    for (let rfaCan of DCNTData.value.RFA_CANS) {
      rfaCan.UUID = uuid();
    }
  };

  // Recursive顯示問題
  const recursiveShowQuestions = (nextQuestionSerNo) => {
    // debugger;
    if (nextQuestionSerNo == '999') {
      if (!isReadonly.value) $swal.info('結束決策引導，請自行新增簽呈');
      return;
    }
    let nextQuestion = DCNTData.value.QUESTIONS.find((q) => q.QUE_SER_NO == nextQuestionSerNo);
    if (nextQuestion) {
      let cloneNextQuestion = cloneDeep(nextQuestion);
      // 如果下一題已經有展開
      if (cloneNextQuestion.QUE_IS_ON === 'Y') {
        // 顯示在畫面上
        currentQuestions.value.push(cloneNextQuestion);
        // 判斷是否有選擇選項
        let selectedOption = cloneNextQuestion.OPTIONS.find((o) => o.OPT_IS_CHK === 'Y');
        // 有選擇而且有下一題的話就繼續展開
        if (selectedOption && selectedOption.NEXT_QUE_SER) {
          recursiveShowQuestions(selectedOption.NEXT_QUE_SER);
        }
      } else {
        // 沒展開的話把它展開
        cloneNextQuestion.QUE_IS_ON = 'Y';
        // 顯示在畫面上
        currentQuestions.value.push(cloneNextQuestion);
        // 還要看有沒有系統預設選，有的話繼續顯示，並更新簽呈
        if (cloneNextQuestion.QUE_TYPE !== '1' && cloneNextQuestion.SYS_DCN_ANS) {
          let selectedOption = cloneNextQuestion.OPTIONS.find((o) => o.OPT_ID === cloneNextQuestion.SYS_DCN_ANS);
          if (selectedOption && selectedOption.NEXT_QUE_SER) {
            if (selectedOption.RFA?.RFA_ID) {
              selectedOption.RFA.RFA_IS_USED = 'Y';
            }
            recursiveShowQuestions(selectedOption.NEXT_QUE_SER);
          }
        }
      }
    }
  };

  // 如果是第一次觸發決策引導
  switch (DCNTData.value.STATUS) {
    case '0':
      bindUUID();
      // 將第一題顯示在畫面上
      if (DCNTData.value.QUESTIONS.length > 0) {
        let question1 = DCNTData.value.QUESTIONS.find((q) => q.QUE_SER_NO === '1');
        if (question1) {
          question1.QUE_IS_ON = 'Y';
          currentQuestions.value = [question1];
        }
      }
      break;
    case '1':
      bindUUID();
      // 直接recursive從第一題開啟問題
      recursiveShowQuestions('1');
      break;
    case '2':
      // 唯讀
      // 直接recursive從第一題開啟問題
      recursiveShowQuestions('1');
      break;
    default:
      break;
  }

  // 畫面上的簽呈
  const currentRFAs = computed(() => {
    const useRFAs = getRFAs.map((r) => ({
      categoryId: r.RFA_CAT_ID,
      categoryName: r.RFA_CAT_NAME,
      rfas: []
    }));
    // console.log(useRFAs);
    // 問題簽呈
    for (let question of currentQuestions.value) {
      for (let option of question.OPTIONS) {
        if (option.RFA && option.RFA?.RFA_ID && option.RFA?.RFA_IS_USED === 'Y') {
          let rfaCat = useRFAs.find((r) => r.categoryId === option.RFA.RFA_CAT_ID);
          // 帶入question id和 option id，方便操作
          option.RFA.QUE_ID = question.QUE_ID;
          option.RFA.OPT_ID = option.OPT_ID;
          // 如果已經有該種類，就直接push rfa
          if (rfaCat) {
            rfaCat.rfas.push(option.RFA);
            // 排序尚未確認
            // rfaCat.rfas = sortBy(rfaCat.rfas, ['RFA_SER_NO']);
          } else {
            useRFAs.push({ categoryId: option.RFA.RFA_CAT_ID, categoryName: option.RFA.RFA_CAT_NAME, rfas: [option.RFA] });
          }
        }
      }
    }
    // 罐頭簽呈
    for (let rfaCan of DCNTData.value.RFA_CANS) {
      rfaCan.RFA_ID = rfaCan.RFA_CAN_ID;
      rfaCan.RFA_CONT = rfaCan.RFA_CAN_CONT;
      let rfaCat = useRFAs.find((r) => r.categoryId === rfaCan.RFA_CAT_ID);
      // 如果已經有該種類，就直接push rfa
      if (rfaCat) {
        rfaCat.rfas.push(rfaCan);
        // 排序
        rfaCat.rfas = sortBy(rfaCat.rfas, ['RFA_TYPE']);
      } else {
        useRFAs.push({ categoryId: rfaCan.RFA_CAT_ID, categoryName: rfaCan.RFA_CAT_NAME, rfas: [rfaCan] });
      }
    }
    return sortBy(useRFAs, ['categoryId']);
  });
  // 是否開啟編輯模式
  const isEditMode = ref(false);

  // 條款PDF Modal
  const openPdfModal = (title, url) => {
    $m.show({
      component: PdfModal,
      id: 'illustrate',
      data: { title, url: `/servlet/HttpDispatcher/AAB3_1000/openPdf?pdfFilePath=${url}#view=FitH,top` }
    });
  };

  // 點擊選項回答
  const onClickOption = async (questionSerNo, options, option) => {
    // 如果已經選擇該選項，就直接return
    if (option.OPT_IS_CHK === 'Y') return;
    decisionStore.markModified();
    // 要更改答案，要跳確認視窗是否清除
    // questionSerNo !== currentQuestions.value[currentQuestions.value.length - 1].QUE_SER_NO &&
    if (options.some((o) => o.OPT_IS_CHK === 'Y')) {
      // 跳確認視窗
      let needClear = await confirmClearQuestion();
      if (needClear) {
        // 目前是哪個問題
        let index = currentQuestions.value.findIndex((q) => q.QUE_SER_NO === questionSerNo);
        if (index > -1) {
          // 如果有修改過內容，清除內容
          currentQuestions.value[index].OPTIONS.forEach((o) => {
            o.RFA.ALT_CONT = null;
          });

          // 將該題之後的實際RFA都設為未勾選，問題未展開
          for (let i = index + 1; i < currentQuestions.value.length; i++) {
            let findQuestion = DCNTData.value.QUESTIONS.find((q) => q.QUE_SER_NO == currentQuestions.value[i].QUE_SER_NO);
            if (findQuestion) {
              findQuestion.QUE_IS_ON = 'N';
              findQuestion.OPTIONS.forEach((o) => {
                o.OPT_IS_CHK = 'N';
                o.RFA.RFA_IS_USED = 'N';
                o.RFA.ALT_SCAT_NAME = null;
                o.RFA.ALT_SCAT_ID = null;
                o.RFA.ALT_CONT = null;
              });
            }
          }

          // 清除該問題後的所有問題
          currentQuestions.value.length = index + 1;
        }
      } else {
        // 不清除就不做下面的事
        return;
      }
    }
    // 清除所有，並選擇該選項
    options.forEach((o) => {
      o.OPT_IS_CHK = 'N';
    });
    option.OPT_IS_CHK = 'Y';

    // 清除該問題的所有簽呈
    options.forEach((o) => {
      o.RFA.RFA_IS_USED = 'N';
      o.RFA.ALT_SCAT_NAME = null;
      o.RFA.ALT_SCAT_ID = null;
      o.RFA.ALT_CONT = null;
    });
    // 先判斷是否有簽呈，有的話再選擇該簽呈
    if (option.RFA?.RFA_ID) {
      option.RFA.RFA_IS_USED = 'Y';
    }

    // Recursive 開啟問題
    recursiveShowQuestions(option.NEXT_QUE_SER);
  };

  // 確認重整視窗
  const confirmClearQuestion = () => {
    return new Promise((resolve, reject) => {
      $swal.confirm(
        '問題將會重整',
        () => {
          resolve(true);
        },
        '確認',
        '此題以後的互動問題皆需重新回答，確認要修改嗎?',
        () => {
          resolve(false);
        }
      );
    });
  };

  // 點擊編輯
  const onClickEdit = () => {
    isEditMode.value = true;
  };

  // 點擊完成
  const onClickComplete = () => {
    isEditMode.value = false;
  };

  // 新增簽呈: 跳Modal
  const onClickAddRfa = (RFA_SCAT) => {
    $m.show({
      id: 'addPetition',
      data: RFA_SCAT,
      component: AddRfaModal
    });
  };

  // 修改簽呈子類別
  const updateSubRfa = (oriSubRfa, newSubRfa) => {
    console.log(oriSubRfa, newSubRfa);
    for (let question of currentQuestions.value) {
      for (let option of question.OPTIONS) {
        if (option.RFA.UUID === oriSubRfa.UUID) {
          // console.log('find update rfa');
          let isTheSameSubRfa = option.RFA.RFA_SCAT_NAME === newSubRfa.RFA_SCAT_NAME;
          option.RFA.ALT_SCAT_ID = isTheSameSubRfa ? null : newSubRfa.RFA_SCAT_ID;
          option.RFA.ALT_SCAT_NAME = isTheSameSubRfa ? null : newSubRfa.RFA_SCAT_NAME;
          break;
        }
      }
      if (question.QUE_ID === oriSubRfa.QUE_ID) break;
    }
    decisionStore.markModified();
  };

  // 刪除簽呈
  const onClickDeleteRFA = (rfa) => {
    let isUpdated = false;
    for (let question of currentQuestions.value) {
      for (let option of question.OPTIONS) {
        if (option.RFA.UUID === rfa.UUID) {
          option.RFA.RFA_IS_USED = 'N'; // 改成未使用
          option.RFA.ALT_CONT = null; // 清除填寫的內容，還原預設內容
          isUpdated = true;
          break;
        }
      }
      if (question.QUE_ID === rfa.QUE_ID) break;
    }
    // 問題簽呈內沒找到，找罐頭簽呈
    if (!isUpdated) {
      DCNTData.value.RFA_CANS = DCNTData.value.RFA_CANS.filter((r) => r.UUID !== rfa.UUID);
    }
    decisionStore.markModified();
  };

  // 編輯簽呈內容
  const updateRfaContent = (rfa, event) => {
    console.log(rfa);
    console.log(event.target.value);

    let errorMessage = '';

    // 如果是空白，不能更新
    if (!event.target.value.trim()) {
      // event.target.value = rfa.RFA_CONT;
      errorMessage = '內容不得為空';
      // return;
    }
    // 最多150多字
    else if (event.target.value.length > 150) {
      errorMessage = `已超過限制字數 (${event.target.value.length}/150)`;
    }

    // 問題簽呈
    if (rfa.RFA_TYPE === '0') {
      for (let question of currentQuestions.value) {
        for (let option of question.OPTIONS) {
          if (option.RFA.UUID === rfa.UUID) {
            if (errorMessage) {
              option.RFA.ERROR = errorMessage;
              return;
            }
            option.RFA.ERROR = '';

            // console.log('find update rfa');
            let isTheSameContent = option.RFA.RFA_CONT === event.target.value;
            option.RFA.ALT_CONT = isTheSameContent ? null : event.target.value;
            break;
          }
        }
        if (question.QUE_ID === rfa.QUE_ID) break;
      }
    } else {
      let findRfaCan = DCNTData.value.RFA_CANS.find((r) => r.UUID === rfa.UUID);
      if (findRfaCan) {
        if (errorMessage) {
          findRfaCan.ERROR = errorMessage;
          return;
        }
        findRfaCan.ERROR = '';
        let isTheSameContent = findRfaCan.RFA_CAN_CONT === event.target.value;
        findRfaCan.ALT_CONT = isTheSameContent ? null : event.target.value;
      }
    }
    // alert(event.target.value);
    decisionStore.markModified();
  };

  // 檢核決策引導問題區塊
  const validateDecision = () => {
    let errorQuestions = [];
    // 檢核問題是否都有回答
    for (let question of currentQuestions.value) {
      // 畫面上有顯示問題但未選擇答案
      if (question.QUE_IS_ON === 'Y') {
        let hasError = question.OPTIONS.every((option) => option.OPT_IS_CHK !== 'Y');
        if (hasError) errorQuestions.push(question);
      }
    }

    // let errorRfas = [];
    // for (let rfa of currentRFAs.value) {
    //   let hasError = rfa.rfas.some((r) => !r.RFA_CONT && !r.ALT_CONT);
    //   if (hasError) errorRfas.push(rfa);
    // }
    // console.log(errorRfas);
    return errorQuestions.length === 0;
  };
  // computed檢核狀態
  const isDecisionValid = computed(() => validateRfa() === true);

  // 檢核編輯的簽呈內容是否有ERROR
  const validateRfa = () => {
    let errorRfas = [];
    for (let rfa of currentRFAs.value) {
      let hasError = rfa.rfas.some((r) => r.ERROR);
      if (hasError) errorRfas.push(rfa);
    }
    return errorRfas.length === 0;
  };

  const isRfaValid = computed(() => validateRfa() === true);

  // 點預覽簽呈
  const onClickPreview = async () => {
    // 20221028 卡控需在受益人分配頁面才能點選簽呈預覽
    if (footerStore.pageKey !== 'beneficiary') {
      $swal.warning('請切換到受益人分配頁面\n才能點選簽呈預覽');
      return;
    }

    // 檢核作業風險
    let isValid = decisionStore.validateRisk();
    if (!isValid) {
      $swal.warning('資料有誤，請再次確認', '請確認作業風險資料無誤後再次送出。');
      return;
    }

    // 20221021預覽前檢核簽呈內容不得為空
    if (currentRFAs.value.every((rfa) => rfa.rfas.length === 0)) {
      $swal.warning('簽呈內容不得為空');
      return;
    }

    // 20221028簽呈預覽前應檢核決策引導互動問題要作答完成才可進行預覽
    if (!validateDecision()) {
      $swal.warning('請先完成所有互動問題');
      return;
    }

    // 呼叫dosignpreview
    try {
      disablePreviewBtn.value = true;
      decisionStore.showLoading();
      await decisionStore.doSignPreview(applyNo, async (result) => {
        if (result.IS_SUCCESS) {
          // 右邊切換到簽呈預覽畫面
          isPreview.value = true;
          // 左邊切換到readonly核算結果畫面
          readonly.value = true;
          await router.push({
            name: 'master-page',
            params: { page: 'accounting' },
            query: { q: applyNo, readonly: new Date().getMilliseconds() }
          });
          if (result.RTN_MSG) {
            $swal.success(result.RTN_MSG);
          }
        } else {
          // 需重算延滯息
          //if (result.IS_RECAL_DLY_INT === 'Y') {
            // 左邊切換到受益人分配畫面
          //  const beneficiaryStore = useBeneficiaryStore();
          //  beneficiaryStore.isCalFee = 'Y';
          //  await router.push({
          //    name: 'master-page',
          //    params: { page: 'beneficiary' },
          //    query: { q: applyNo, fee: 'Y' }
          //  });
          //}
          if(result.UPDATE_CONTACTINFO_RISK === 'Y') {
            let index = riskInfo.value.INS_RISK_INFO.findIndex(item => item.SER_NO === 'IAA');
            if(index !== -1) {
              riskInfo.value.INS_RISK_INFO.splice(index, 1, result.CONTACTINFO_RISK);
            } else {
              riskInfo.value.INS_RISK_INFO.push(result.CONTACTINFO_RISK)
            }
          }

          decisionStore.hideLoading();
          disablePreviewBtn.value = false;
          $swal.fail(result.RTN_MSG);
        }

        // 訴訟件確認
        console.log('CHECK_LOW_CASE='+ result.CHECK_LOW_CASE);        
        if (result.CHECK_LOW_CASE === 'Y') {
          const isLawCase = await $swal.confirmAsync('', '是', '是否為訴訟件?', '否');
                        
          if (isLawCase.isConfirmed) {
            const openLink = '/servlet/HttpDispatcher/AAD6_0100/prompt?APLY_NO=' + applyNo + '&OCR_ID='+ result.OCR_ID;
            window.open(openLink);
          }
        } 
      });
    } catch (e) {
      if (e) {
        disablePreviewBtn.value = false;
        $swal.fail(e);
        console.error(e);
      }
      decisionStore.hideLoading();
    }
  };

  const decisionMainArea = ref(null);

  onMounted(() => {
    toggleCard(decisionMainArea.value);
  });
</script>

<style lang="scss" scoped>
  .button-group {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    button {
      margin-left: 0 !important;
      min-height: 50px;
      padding: 7px !important;
    }
  }
  .card-title {
    h3 {
      flex-shrink: 1 !important;
      padding-right: 23px;
      .icd-text {
        font-weight: normal;
        color: #2372bc;
      }
    }
  }
</style>
