<template>
  <div id="noPaymentLetterInput">
    <div class="modal-content">
      <div class="box">
        <h2 class="modal-title">{{ isReadonly ? '不給付通知函檢視' : '不給付通知函輸入' }}</h2>
        <section>
          <p class="modal-subtitle">受理編號 {{ props.applyNo }}</p>
          <div class="modal-table">
            <section id="mainSection" :class="{ 'cursor-not-allowed': isReadonly }">
              <div class="letter">
                <div class="top">
                  <div class="columns">
                    <div class="column is-4">
                      <span class="field">標題</span>
                      <div class="height-limit">
                        <FormDropdown
                          class="width-full height-limit-lg"
                          :class="[{ disabled: isReadonly }]"
                          :isLoading="isDropdownLoading"
                          :options="notPayTitlesOptions"
                          :watchValue="title"
                          :onRefreshOptions="
                            () => {
                              onRefreshTitle();
                            }
                          "
                          v-model="title"
                        ></FormDropdown>
                      </div>
                      <p class="has-text-danger" v-if="titleError != ''">{{ titleError }}</p>
                    </div>
                  </div>
                  <div class="columns">
                    <div class="column is-4">
                      <span class="field">子標題</span>
                      <div class="height-limit">
                        <FormDropdown
                          class="width-full height-limit-lg"
                          :class="[{ disabled: isReadonly }]"
                          :isLoading="isDropdownLoading"
                          :options="notPaySubTitlesOptions"
                          :watchValue="subTitle"
                          :onRefreshOptions="
                            () => {
                              onRefreshSubTitle();
                            }
                          "
                          v-model="subTitle"
                        ></FormDropdown>
                      </div>
                      <p class="has-text-danger" v-if="subTitleError != ''">{{ subTitleError }}</p>
                    </div>
                  </div>
                </div>
                <div class="bottom">
                  <div class="columns is-multiline">
                    <!-- 姓名 -->
                    <div class="column is-12">
                      <input
                        type="text"
                        class="w-268 font-eudc"
                        placeholder="請輸入受益人（事故者）姓名"
                        v-model="notPayData.BENE_NAME"
                        maxlength="150"
                        :disabled="isReadonly"
                      />
                      <p class="has-text-danger" v-if="beneNameError != ''">{{ beneNameError }}</p>
                      <span class="ml-15 field mr-0">先生/女士</span>
                    </div>
                    <div class="column is-12">
                      <textarea
                        name=""
                        id=""
                        cols="30"
                        rows="10"
                        class="is-light resize-vertical font-eudc h-120"
                        :disabled="isReadonly"
                        v-model="notPayData.TITLE_CONT"
                      ></textarea>
                      <p class="has-text-danger" v-if="titleContError != ''">{{ titleContError }}</p>
                      <button v-if="!isReadonly"
                        class="button icon open"
                        @click="openNotPayDataItemModal('A')"
                        :disabled="isReadonly"
                      ></button>
                    </div>
                    <div class="column is-12"></div>
                    <div class="column is-12" v-if="title !== 'A03'">
                      <span class="field font-eudc">{{ content }}</span>
                      <input type="text" class="w-216" v-model="headLine" maxlength="150" :disabled="isReadonly" />
                      <p class="has-text-danger" v-if="headLineError != ''">{{ headLineError }}</p>
                      <span class="field ml-15">因</span>
                      <input type="text" class="w-216" v-model="notPayData.OCR_RESN_CTX" maxlength="150" :disabled="isReadonly" />
                      <p class="has-text-danger" v-if="ocrResnCtxError != ''">{{ ocrResnCtxError }}</p>
                    </div>
                    <div class="column is-12" v-if="title === 'A03'">
                      <span class="field font-eudc">{{ content }}</span>
                    </div>
                    <div class="column is-12" v-if="title === 'A03'">
                      <span class="field">申請原因：</span>
                      <input type="text" class="w-216" v-model="notPayData.OCR_RESN_CTX" maxlength="150" :disabled="isReadonly" />
                      <p class="has-text-danger" v-if="ocrResnCtxError != ''">{{ ocrResnCtxError }}</p>
                    </div>
                    <div class="column is-12">
                      <!-- 理賠金申請項目 -->
                      <div class="column p-0">
                        {{ clamAmtName }}
                      </div>
                      
                      <div class="column is-2 hor-right">
                        <button v-if="!isReadonly"
                          class="button is-primary has-icon-back has-icon-back-add"
                          :disabled="(notPayData.RJCT_RESN_MEMO.length === 3)"
                          @click="addRjctResnMemo()"
                        >
                          新增
                        </button>
                      </div>
                    </div>
                    <div class="column is-12"  v-for="(rjctResnMemo, index) in notPayData.RJCT_RESN_MEMO" :key="rjctResnMemo">
                      <textarea
                        name=""
                        id=""
                        cols="30"
                        rows="10"
                        class="is-light resize-vertical font-eudc h-110"
                        v-model="rjctResnMemo.TEXT"
                        :disabled="isReadonly"
                      ></textarea>
                      <button v-if="!isReadonly"
                        class="button icon open"
                        @click="openNotPayDataItemModal('C', index)"
                        :disabled="isReadonly"
                      ></button>
                      <button v-if="notPayData.RJCT_RESN_MEMO.length > 1 & !isReadonly" class="button is-primary-lightest m-1 button-delete" @click="deleteRjctResnMemo(index)">
                        <img src="/src/assets/images/icon-trash.svg" alt="TRASH" />
                      </button>
                      <p class="has-text-danger" v-if="rjctResnMemoError[index] != ''">{{ rjctResnMemoError[index] }}</p>
                    </div>
                  </div>
                </div>

                <div class="conclusion">
                  <!-- 結語 -->
                  <td class="font-eudc">{{ conclusion }}</td>
                </div>
              </div>
              <div class="modal-table">
                <div class="table-title">退件保單明細</div>
                <table class="table is-fullwidth">
                  <thead>
                    <tr>
                      <th class="has-text-centered">序號</th>
                      <th>保單號碼</th>
                      <th>險別</th>
                      <th class="has-text-left">項目</th>
                      <th>未符合條款內容</th>
                      <th class="has-text-centered">選擇條款</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(notPayItem, index) in notPayDataDetails" :key="notPayItem.SER_NO">
                      <td class="has-text-centered has-border-right">{{ index + 1 }}</td>
                      <td class="font-eudc">{{ notPayItem.POLICY_NO }}<br>({{ notPayItem.SYS_NO_NAME }})</td>
                      <td class="font-eudc">{{ notPayItem.PROD_ID }} {{ notPayItem.PROD_SNAME }}</td>
                      <td class="has-text-left font-eudc">{{ notPayItem.ITEM }}</td>
                      <td class="has-text-centered">
                        <textarea
                          v-model="notPayItem.LAWS_CONTENT"
                          cols="46"
                          rows="10"
                          class="is-light resize-vertical font-eudc"
                          :disabled="isReadonly"
                        ></textarea>
                      </td>
                      <td class="has-text-centered">
                        <button v-if="notPayItem.isSelect === 'Y' && isConfirm !== 'Y'"
                          class="button icon open"
                          @click="openNotPayDataDetailsModal(notPayItem)"
                          :disabled="isReadonly"
                        ></button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </section>
        <div class="modal-tool">
          <div class="modal-tool">
            <button class="button is-light close-modal" @click="onPrint" :disabled="disabledPrint">預覽</button>
            <button class="button is-primary close-modal" @click="onSave" v-if="!isReadonly">
              儲存
              <div class="time">{{ getROCDate(inputDate, 'MM-DD HH:mm:ss') }}</div>
              <p class="has-text-danger has-error" v-if="hasError">請確認欄位是否輸入正確</p>
            </button>
            
          </div>
        </div>
      </div>
    </div>
  </div>
  <NotPayDataDetailsModal
    v-if="isDetailsModalShow"
    :data="{
      sysNo: sysNo,
      prodId: prodId
    }"
    :close="
      () => {
        isDetailsModalShow = false;
      }
    "
    @onClickConfirm="onNotPayDataDetailsChoosed"
  ></NotPayDataDetailsModal>
  <NotPayDataItemModal
    v-if="isItemModalShow"
    :data="{
      title: title,
      subTitle: subTitle,
      modalItemType: modalItemType
    }"
    :close="
      () => {
        isItemModalShow = false;
      }
    "
    @onClickConfirm="onNotPayDataItemChoosed"
  ></NotPayDataItemModal>
</template>

<script setup>
  import { isEmpty } from 'lodash-es';
import initialUI from '~/common/ui/initial';
import FormDropdown from '~/components/Form/FormDropdown.vue';
import useMoment from '~/composables/useMoment';
import useSwal from '~/composables/useSwal';
import { useApplyStore } from '~/stores/apply';
import { useDecisionStore } from '~/stores/decision';
import { useFooterStore } from '~/stores/footer';
import NotPayDataDetailsModal from './Modals/NotPayDataDetailsModal.vue';
import NotPayDataItemModal from './Modals/NotPayDataItemModal.vue';

  const applyStore = useApplyStore();
  const footerStore = useFooterStore();
  const { getROCDate } = useMoment();

  const route = useRoute();

  const props = {
    applyNo: route.query?.applyNo
  };

  const { $swal } = useSwal();
  const decisionStore = useDecisionStore();

  // API取得的不給付通知函輸入資料
  const notPayData = ref({});
  const notPayDataDetails = ref([]);
  const isConfirm = ref(false);

  // 標題
  const title = ref('');
  const titleError = ref('');
  // 子標題
  const subTitle = ref('');
  const subTitleError = ref('');
  

  // 事故原因
  const headLine = ref('');
  const content = ref('');

  // 結語
  const conclusion = ref('');

  const isDetailsModalShow = ref(false);
  const isItemModalShow = ref(false);
  const modalItemType = ref('');
  const sysNo = ref('');
  const prodId = ref('');
  const disabledPrint = ref(true);
  const rjctResnMemoIndex = ref(0);
  const rjctResnMemoError = ref(['','','']);
  const ocrResnCtxError = ref('');
  const inputDate = ref('');

  const isReadonly = computed(() => applyStore.reviewerInfo?.STEP_STS === '2');

  // 標題
  const notPayTitlesOptions = ref([]);

  // 子標題
  const notPaySubTitlesOptions = ref([]);

  // 理賠金申請項目
  const clamAmtName = ref('');

  // API查詢關聯資料
  const notPayTitleAndContentData = ref({});

  // 其他欄位內容
  const otherFieldsMap = ref([]);

  // 下拉選單Loading
  const isDropdownLoading = ref(false);

  const beneNameError = ref('');
  const titleContError = ref('');
  const headLineError = ref('');
  const hasError = ref(false);

  // 開啟選擇條款
  const openNotPayDataDetailsModal = (notPayItem) => {
    sysNo.value = notPayItem.SYS_NO;
    prodId.value = notPayItem.PROD_ID;
    isDetailsModalShow.value = true;
  };

  // 開啟抬頭樣式、主張依據選擇
  const openNotPayDataItemModal = (type, index=0) => {
    if(subTitle.value === ''){
      $swal.warning('請選擇標題及子標題。');
      return;
    }
    isItemModalShow.value = true;
    modalItemType.value = type;
    rjctResnMemoIndex.value = index;
  };

  const initPlzSelectOption = (options) => {
    options.value = [
      {
        name: '請選擇',
        value: '',
        selected: true,
        disabled: true
      }
    ];
  };

  // 初始化已儲存資料
  const initSavedData = async () => {
    try {
      const result = await decisionStore.getNotPayInput(props.applyNo);
      if (!result.IS_SUCCESS) throw result.RTN_MSG;

      conclusion.value = result.note1;
      notPayData.value = result.NotPay;
      notPayDataDetails.value = result.NotPayList;
      isConfirm.value = result.IS_CONFIRM;

      title.value = notPayData.value?.TITLE_TYPE_MAIN;
      subTitle.value = notPayData.value?.TITLE_TYPE;
      headLine.value = notPayData.value?.OCR_NAME;
      inputDate.value = notPayData.value?.INPUT_TIME;

      disabledPrint.value = result.IS_PRINT_FLAG === 'N';
    } catch (e) {
      $swal.fail(e);
    }
  };

  // 初始化下選單
  const initOptions = async () => {
    isDropdownLoading.value = true;
    try {
      // 讀取資料關聯
      notPayTitleAndContentData.value = await decisionStore.getNotPayTitleAndContent(props.applyNo);

      // 初始化下拉選單請選擇
      initPlzSelectOption(notPayTitlesOptions);
      initPlzSelectOption(notPaySubTitlesOptions);

      let titlesOptionkey = [];
      notPayTitleAndContentData.value.forEach((data) => {
        // 初始化標題下拉選單
        if (!titlesOptionkey.includes(data.TITLE_CODE)) {
          titlesOptionkey.push(data.TITLE_CODE);
          notPayTitlesOptions.value.push({
            name: data.TITLE,
            value: data.TITLE_CODE
          });
        }

        // 初始化子標題下拉選單
        if (title.value === data.TITLE_CODE) {
          notPaySubTitlesOptions.value.push({
            name: data.S_TITLE,
            value: data.S_TITLE_CODE
          });
        }

        // 其他欄位對應關係
        otherFieldsMap.value.push({
          headLine: data.HEADLINE,
          titleCode: data.TITLE_CODE,
          subTitleCode: data.S_TITLE_CODE,
          clamAmtName: data.CLAM_AMT_NAME,
          content: data.CONTENT,
          conclusion: data.CONCLUSION
        });

        // 設定其他欄位初始值
        if (title.value === data.TITLE_CODE && subTitle.value === data.S_TITLE_CODE) {
          clamAmtName.value = data.CLAM_AMT_NAME;
          content.value = data.CONTENT;
        }
      });
    } catch (e) {
      $swal.fail(e);
    } finally {
      isDropdownLoading.value = false;
    }
  };

  // 標題異動event
  const onRefreshTitle = () => {
    headLine.value = '';
    content.value = '';
    subTitle.value = '';

    // 連動子標題選單
    initPlzSelectOption(notPaySubTitlesOptions);
    notPayTitleAndContentData.value.forEach((data) => {
      if (title.value === data.TITLE_CODE) {
        notPaySubTitlesOptions.value.push({
          name: data.S_TITLE,
          value: data.S_TITLE_CODE
        });
      }
    });

    // 清空抬頭樣式
    notPayData.value.TITLE_CONT = '';
  };

  // 子標題異動event
  const onRefreshSubTitle = () => {
    let otherFields = otherFieldsMap.value.find((f) => f.titleCode === title.value && f.subTitleCode === subTitle.value);
    headLine.value = otherFields?.headLine;
    clamAmtName.value = otherFields?.clamAmtName;
    content.value = otherFields?.content;
    conclusion.value = otherFields?.conclusion;

    // 清空抬頭樣式
    notPayData.value.TITLE_CONT = '';
  };

  // 選擇條款Popup callBack
  const onNotPayDataDetailsChoosed = (selectedItems) => {
    if (!isEmpty(selectedItems)) {
      const notPayDetail = notPayDataDetails.value.find((p) => p.SYS_NO === sysNo.value && p.PROD_ID === prodId.value);

      if (notPayDetail) {
        let showContent = [];
        for (const selectedItem of selectedItems) {
          showContent.push(selectedItem.TITLE);
          showContent.push(selectedItem.CONTENT);
        }
        notPayDetail.LAWS_CONTENT = showContent.join('\n\n');
      }
      isDetailsModalShow.value = false;
    }
  };

  // 主張依據、抬頭樣式選擇
  const onNotPayDataItemChoosed = (selectedItem) => {
    if (!isEmpty(selectedItem)) {
      notPayData.value.TITLE_TYPE_MAIN = title.value;
      notPayData.value.TITLE_TYPE = subTitle.value;
      if (selectedItem.type === 'A') {
        // 抬頭樣式
        notPayData.value.TITLE_CONT = selectedItem.cont;
      } else if (selectedItem.type === 'C') {
        // 主張依據
        notPayData.value.RJCT_RESN_MEMO[rjctResnMemoIndex.value].TEXT = selectedItem.cont;
      }

      isItemModalShow.value = false;
    }
  };

  // 驗證
  const validation = () => {
    var isValid = true;

    if(title.value === ''){
      titleError.value = '請選擇';
      isValid = false;
    } else {
      titleError.value = '';
    }

    if(subTitle.value === ''){
      subTitleError.value = '請選擇';
      isValid = false;
    } else {
      subTitleError.value = '';
    }

    if(notPayData.value.BENE_NAME === ''){
      beneNameError.value = '不能為空白';
      isValid = false;
    } else {
      beneNameError.value = '';
    }

    if(notPayData.value.TITLE_CONT === ''){
      titleContError.value = '不能為空白';
      isValid = false;
    } else {
      if (notPayData.value.TITLE_CONT.length > 200) {
        titleContError.value = '請輸入200個字以內';
        isValid = false;
      } else {
        titleContError.value = '';
      }
    }

    if(title.value !== 'A03'){
      if(headLine.value === ''){
        headLineError.value = '不能為空白';
        isValid = false;
      } else {
        if (headLine.value.length > 40) {
          headLineError.value = '請輸入40個字以內';
          isValid = false;
        } else {
          headLineError.value = '';
        }
      }
    } else {
      headLineError.value = '';
    }
    
    for(let i=0 ; i < notPayData.value.RJCT_RESN_MEMO.length ; i++){
      if(notPayData.value.RJCT_RESN_MEMO[i].TEXT === ''){
        rjctResnMemoError.value[i] = '不能為空白';
        isValid = false;
      } else {
        if (notPayData.value.RJCT_RESN_MEMO[i].TEXT.length > 300) {
          rjctResnMemoError.value[i] = '請輸入200個字以內';
          isValid = false;
        } else {
          rjctResnMemoError.value[i] = '';
        }
      }
    }

    if(notPayData.value.OCR_RESN_CTX === ''){
      ocrResnCtxError.value = '不能為空白';
      isValid = false;
    } else {
      if (notPayData.value.OCR_RESN_CTX.length > 100) {
        ocrResnCtxError.value = '請輸入100個字以內';
        isValid = false;
      } else {
        ocrResnCtxError.value = '';
      }
    }

    hasError.value = !isValid;

    return isValid;
  };

  // 儲存
  const onSave = async () => {
    if (!validation()) {
      return;
    }

    try {
      decisionStore.showLoading();

      notPayData.value.TITLE_TYPE_MAIN = title.value;
      notPayData.value.TITLE_TYPE = subTitle.value;
      notPayData.value.OCR_NAME = headLine.value;

      let result = await decisionStore.saveNotPayInput(notPayData.value, notPayDataDetails.value);

      if (!result.IS_SUCCESS) throw result.RTN_MSG;
      
      inputDate.value = result.INPUT_DATE;
      $swal.success('儲存成功');

      initSavedData();

      localStorage.removeItem('isInputNoPay_'+props.applyNo);
      localStorage.setItem('isInputNoPay_'+props.applyNo, 'Y');
    } catch (e) {
      $swal.fail(e);
    } finally {
      decisionStore.hideLoading();
    }
  };

  // 預覽
  const onPrint = async () => {
    try {
      decisionStore.showLoading();
      let result = await decisionStore.printNotPayInput(notPayData.value.APLY_NO);

      if (!result.IS_SUCCESS) throw result.RTN_MSG;

      postWindowOpen(
        '/servlet/HttpDispatcher/AAB3_1000/download',
        `downloadFilePath,${result.FILE_PATH},alterFileName,${result.ALT_FILE_NAME}`
      );
      $swal.success('預覽成功');
    } catch (e) {
      $swal.fail(e);
    } finally {
      decisionStore.hideLoading();
    }
  };

  const addRjctResnMemo = async () => {
    notPayData.value.RJCT_RESN_MEMO.push({
      TEXT: ''
    });
  };

  const deleteRjctResnMemo = async (index) => {
    notPayData.value.RJCT_RESN_MEMO.splice(index, 1);
  };

  function postWindowOpen(url, data) {
    console.log('postWindowOpen url=' + url);
    console.log('postWindowOpen data=' + data);

    // input的key,value,key,value...
    var dataAry = data.split(',');
    console.log('dataAry=' + dataAry.length);

    // 產生一個暫存的form
    var tempForm = document.createElement('form');
    tempForm.id = 'tempForm1';
    tempForm.method = 'get';
    tempForm.action = url;
    tempForm.target = '_self';
    tempForm.accept = 'BIG5';
    tempForm.acceptCharset = 'BIG5';

    // 產生hidden Input
    for (let i = 0; i < dataAry.length; i = i + 2) {
      var hideInput = document.createElement('input');
      hideInput.type = 'hidden';
      hideInput.name = dataAry[i];
      hideInput.value = dataAry[i + 1];
      // 把Input 放進 form
      tempForm.appendChild(hideInput);
    }

    document.body.appendChild(tempForm);
    tempForm.submit();
    document.body.removeChild(tempForm);
  }

  try {
    decisionStore.showLoading();

    // 初始化已儲存資料
    await initSavedData();

    // 初始化下拉選單
    await initOptions();

    // 讀取權限
    applyStore.reviewerInfo = await footerStore.getReviewerInfo(props.applyNo);

  } catch (e) {
    $swal.fail(e);
  } finally {
    decisionStore.hideLoading();
  }

  onMounted(() => {
    initialUI();
  });
</script>
<style lang="scss"></style>
