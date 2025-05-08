<template>
  <div class="card is-full fourth-card is-expanded" id="ApplyFourthCard">
    <button class="card-toggle-btn expand"></button>
    <h2>收據</h2>

    <Tabs @onTabClick="onTabChanged" ref="receiptTabs" class="folder-style">
      <Tab
        v-for="(receipt, receiptIndex) in showingReceipts"
        :key="receipt.SER_NO"
        :title="`收據${receiptIndex + 1}`"
        :hasSvg="receipt.MAN_ISRT_IND === 'Y'"
        :isActive="receiptIndex === 0"
      >
        <section>
          <!-- 收據資訊 -->
          <div class="part receipt-info border-none">
            <div class="columns is-multiline has-flex-column">
              <div class="column is-4">
                <span class="field">醫院名稱</span>
                <EditableModal
                  v-model:modelText="receipt.HOSP_NAME"
                  v-model:modelValue="receipt.HOSP_CODE"
                  :modal="{
                    component: HospitalModal,
                    id: 'selectHospitalModal',
                    data: {}
                  }"
                  :schema="string().required('請選擇醫院')"
                ></EditableModal>
              </div>
              <div class="column is-3">
                <span class="field">收據種類</span>
                <EditableDropdown
                  v-model="receipt.RCPT_KIND"
                  :editingWidth="161"
                  :disabled="receipt.MAN_ISRT_IND !== 'Y'"
                  :options="[
                    {
                      name: receipt.DB_ID === '031' & receipt.RCPT_KIND === '2' ? '住院收據合計' : '住院收據',
                      value: ReceiptKind.Hospitalized
                    },
                    {
                      name: '門診合計表',
                      value: ReceiptKind.Clinic
                    },
                    {
                      name: '團險特殊收據',
                      value: ReceiptKind.Group,
                      disabled: !isLifeGroup
                    }
                  ]"
                  :schema="
                    string()
                      .required('請選擇收據種類')
                      .test(
                        'maxLength',
                        '團險特殊收據不得大於 20 筆',
                        (value) => !(value === ReceiptKind.Group && receipt.ITEM_DATA.length > 20)
                      )
                  "
                ></EditableDropdown>
              </div>
              <div class="column is-4">
                <span class="field">收據序號</span>
                <span class="data not-editable">{{ receipt.SER_NO }}</span>
              </div>
              <div class="column is-4">
                <template v-if="receipt.RCPT_KIND !== ReceiptKind.Group">
                  <span class="field">就診期間</span>
                  <EditableDateRangePicker
                    v-model:modelStartDate="receipt.HOSP_STR_DATE"
                    v-model:modelEndDate="receipt.HOSP_END_DATE"
                    :schema="string().required('請選擇就診期間')"
                  ></EditableDateRangePicker>
                </template>
              </div>
              <div class="column is-3">
                <template v-if="receipt.RCPT_KIND !== ReceiptKind.Group">
                  <span class="field mr-12">收據正本</span>
                  <EditableCheckbox v-model="receipt.IS_RCPT_ORIG"></EditableCheckbox>
                </template>
              </div>
              <div class="column is-2">
                <template v-if="receipt.RCPT_KIND !== ReceiptKind.Group">
                  <span class="field mr-12">社保身分</span>
                  <EditableCheckbox v-model="receipt.IS_SOC_INSU"></EditableCheckbox>
                </template>
              </div>
              <div class="column is-4"></div>

              <!-- 合計金額 -->
              <div class="total-receipt">
                <div class="columns">
                  <div class="column is-half p-0">
                    <span class="receipt-count">{{ showingReceiptItem.length }}</span>
                    <span class="receipt-count">個項目</span>
                  </div>
                  <div class="column is-half p-0"></div>
                </div>
                <div class="columns">
                  <div class="column is-half p-0 ver-center">
                    <span class="field">合計金額</span>
                  </div>
                  <div class="column is-half p-0 hor-right ver-center">
                    <span class="total-amount">{{ totalAmount }}</span>
                    <span class="total-amount-yuan">元</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="hidden-parts">
            <!-- 收據項目 -->
            <div class="part">
              <h3>收據項目</h3>
              <div v-if="receipt.RCPT_KIND !== ReceiptKind.Group">
                <!-- 上方表頭 -->
                <div class="columns">
                  <div class="column is-12 p-0 mx-1">
                    <div class="columns">
                      <div class="column is-half border-right padding-only-right">
                        <div class="columns">
                          <div class="column is-1 p-0">
                            <span class="field mr-none">序號</span>
                          </div>
                          <div class="column is-1 p-0">
                            <span class="field mr-none">分類</span>
                          </div>
                          <div class="column is-7 p-0">
                            <span class="field">項目</span>
                          </div>
                          <div class="column is-3 p-0 hor-right">
                            <span class="field mr-0">金額</span>
                          </div>
                        </div>
                      </div>
                      <div class="column is-half padding-only-left">
                        <div class="columns">
                          <div class="column is-1 p-0">
                            <span class="field mr-none">序號</span>
                          </div>
                          <div class="column is-1 p-0">
                            <span class="field mr-none">分類</span>
                          </div>
                          <div class="column is-7 p-0">
                            <span class="field">項目</span>
                          </div>
                          <div class="column is-3 p-0 hor-right">
                            <span class="field mr-0">金額</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 下方表格 -->
                <div class="columns is-vcentered">
                  <!--非團險收據表格內容 -->
                  <GroupEditable class="is-12 p-0 mx-1" ref="nonGroupLifeGroups">
                    <div class="columns is-multiline">
                      <!-- 第1筆資料 -->
                      <div
                        :class="[
                          'column',
                          'is-half',
                          {
                            'border-right': index % 2 === 0,
                            'padding-only-right': index % 2 === 0,
                            'padding-only-left': index % 2 !== 0
                          }
                        ]"
                        v-for="(receiptItem, index) in receipt.ITEM_DATA"
                      >
                        <div class="columns border-bot has-flex-column" v-if="receiptItem.IS_HIDE_FLAG != 'Y'">
                          <div class="column is-1">
                            <span class="data not-editable">{{ index + 1 }}</span>
                          </div>
                          <div class="column is-1">
                            <span class="data not-editable">{{ receiptItem.RCPT_SER_NO }}</span>
                          </div>
                          <div class="column is-5">
                            <span class="data ml-02 not-editable font-eudc">{{ receiptItem.PAY_RCPT_NAME }}</span>
                          </div>
                          <div class="column is-5 hor-right">
                            <!-- 門診合計表的收據項目「義齒輔具類」新增義齒顆數 -->
                            <div
                              v-if="receipt.RCPT_KIND === ReceiptKind.Clinic && receiptItem.RCPT_SER_NO === '004'"
                              class="is-editing is-flex is-align-items-center"
                            >
                              <!-- 欄位名稱待定 -->
                              <EditableInput
                                :inputWidth="50"
                                placeholder=""
                                v-model="receiptItem.CFM_RCPT_CNT"
                                :schema="
                                  string()
                                    .required('請輸入顆數')
                                    .matches(/^-?[0-9]*$/, '格式錯誤，請輸入數字')
                                "
                              ></EditableInput>
                              <span class="mx-3">顆</span>
                            </div>
                            <EditableInput
                              class="has-text-right"
                              :inputWidth="92"
                              :spanWidth="80"
                              v-model="receiptItem.CFM_RCPT_AMT"
                              :schema="
                                string()
                                  .required('請輸入金額')
                                  .matches(/^-?[0-9]*$/, '格式錯誤，請輸入數字')
                              "
                              :onClickDelete="
                                receiptItem.MAN_ISRT_IND === 'Y' ? () => onClickDeleteReceiptItem(receiptItem.SER_NO) : null
                              "
                            ></EditableInput>
                          </div>
                        </div>
                      </div>
                    </div>
                  </GroupEditable>
                </div>
              </div>
              <!-- 團險特殊收據 -->
              <GroupEditable class="p-0" v-else ref="groupLifeGroups">
                <div class="columns">
                  <div class="column">
                    <table class="table is-fullwidth is-striped-odd">
                      <thead>
                        <tr>
                          <th class="p-14-5 has-text-centered w-5percent">序號</th>
                          <th class="p-14-5 w-15percent">收據日期</th>
                          <th class="p-14-5 has-text-right w-10percent pr-25">申請金額</th>
                          <th class="p-14-5 has-text-right w-13percent pr-25">核定金額</th>
                          <th class="p-14-5">修改原因</th>
                          <th class="p-14-5 has-text-centered w-7percent">收據正本</th>
                          <th class="p-14-5 has-text-centered w-7percent pr-1">社保身份</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(receiptItem, index) in receipt.ITEM_DATA">
                          <td class="has-text-centered">{{ index + 1 }}</td>
                          <td>
                            <EditableDatePicker
                              v-model="receiptItem.HOSP_STR_DATE"
                              :schema="string().required('請選擇收據日期')"
                            ></EditableDatePicker>
                          </td>
                          <td class="has-text-right pr-25 not-editable">{{ receiptItem.APLY_RCPT_AMT }}</td>
                          <td class="has-text-right pr-25">
                            <EditableInput
                              class="is-justify-content-flex-end"
                              v-model="receiptItem.CFM_RCPT_AMT"
                              :schema="
                                string()
                                  .required('請輸入金額')
                                  .matches(/^-?[0-9]*$/, '格式錯誤，請輸入數字')
                              "
                            ></EditableInput>
                          </td>
                          <td><EditableInput v-model="receiptItem.CHG_MEMO" fitContent></EditableInput></td>
                          <td class="has-text-centered">
                            <EditableCheckbox v-model="receiptItem.IS_RCPT_ORIG"></EditableCheckbox>
                          </td>
                          <td class="has-text-centered" style="min-width: 150px; position: relative">
                            <EditableCheckbox
                              v-model="receiptItem.IS_SOC_INSU"
                              :onClickDelete="
                                receiptItem.MAN_ISRT_IND === 'Y' ? () => onClickDeleteReceiptItem(receiptItem.SER_NO) : null
                              "
                            ></EditableCheckbox>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </GroupEditable>
              <!-- 新增收據項目、刪除收據 Button -->
              <div class="part border-none">
                <div class="columns">
                  <div class="column hor-right p-0 mr-only-top mr-only-bot">
                    <button
                      v-if="receipt.MAN_ISRT_IND === 'Y'"
                      class="button is-danger is-outlined mr-5"
                      @click="deleteReceipt(receipt.SER_NO)"
                    >
                      <span>刪除收據 {{ receiptIndex + 1 }}</span>
                    </button>
                    <div class="dropdown is-primary height-limit" v-if="receipt.RCPT_KIND !== ReceiptKind.Group">
                      <div class="dropdown-trigger" v-if="receipt.IS_HIDE_FLAG != 'Y'">
                        <button class="button apply-btn" @click="onClickAddReceiptItem(receipt.HOSP_CODE, receipt.RCPT_KIND)">
                          <span>新增收據項目</span>
                          <img src="/src/assets/images/icon-add.svg" alt="ADD" />
                        </button>
                      </div>
                    </div>
                    <button class="button apply-btn" v-else @click="addReceiptItem('', '', ReceiptKind.Group, true)">
                      <span>新增</span>
                      <img src="/src/assets/images/icon-add.svg" alt="ADD" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Tab>
      <template v-slot:buttons>
        <button class="button apply-btn no-bg-btn" @click="addReceipt">
          <span>新增收據</span>
          <img src="/src/assets/images/icon-add.svg" alt="ADD" />
        </button>
      </template>
    </Tabs>
  </div>
</template>
<script setup>
  import Tabs from '~/components/Tabs/Tabs.vue';
  import Tab from '~/components/Tabs/Tab.vue';
  import EditableDropdown from '~/components/Editable/EditableDropdown.vue';
  import EditableCheckbox from '~/components/Editable/EditableCheckbox.vue';
  import EditableInput from '~/components/Editable/EditableInput.vue';
  import GroupEditable from '~/components/Editable/GroupEditable.vue';
  import EditableModal from '~/components/Editable/EditableModal.vue';
  import HospitalModal from './Modals/HospitalModal.vue';
  import ReceiptItemModal from './Modals/ReceiptItemModal.vue';
  import { remove, toSafeInteger, isEmpty } from 'lodash-es';
  import EditableDateRangePicker from '~/components/Editable/EditableDateRangePicker.vue';
  import EditableDatePicker from '~/components/Editable/EditableDatePicker.vue';
  import { useApplyStore } from '~/stores/apply';
  import { storeToRefs } from 'pinia';
  import { sequence } from '~/common/utils';
  import useSwal from '~/composables/useSwal';
  import { ReceiptKind } from '~/common/utils/enum';
  import { string } from 'yup';
  import useModal from '~/composables/useModal';
  import { nextTick } from 'vue';

  const { $m } = useModal();
  const { $swal } = useSwal();
  const applyStore = useApplyStore();
  const { isLifePerson, isLifeGroup, isLifeSchool } = storeToRefs(applyStore);
  const props = defineProps({
    receiptData: {
      type: Object,
      required: true,
      default: {}
    }
  });

  const receiptData = toRef(props, 'receiptData');
  // 只顯示D的
  const showingReceipts = computed(() =>
    receiptData.value?.RECEIPT_DATA ? receiptData.value.RECEIPT_DATA.filter((e) => e.ACT_CD !== 'D') : []
  );

  const isSchool = computed(() => receiptData.value?.IS_SCH);
  // 目前停留在哪個頁籤
  const currentTabIndex = ref(0);
  // 目前是哪個收據
  const currentReceiptIndex = ref(0);
  // 頁籤切換時Trigger
  const onTabChanged = (index, id) => {
    // console.log('tab change');
    currentTabIndex.value = index;
  };
  watch(currentTabIndex, (newValue) => {
    currentReceiptIndex.value = receiptData.value.RECEIPT_DATA.findIndex(
      (e) => e.SER_NO === showingReceipts.value[newValue].SER_NO
    );
  });

  const showingReceiptItem = computed(() =>
    receiptData.value.RECEIPT_DATA[currentReceiptIndex.value].ITEM_DATA.filter((e) => e.IS_HIDE_FLAG  !== 'Y')
  );

  const totalAmount = computed(() =>
    receiptData.value.RECEIPT_DATA[currentReceiptIndex.value].ITEM_DATA.filter((e) => e.IS_HIDE_FLAG  !== 'Y').reduce((a, b) => a + toSafeInteger(b.CFM_RCPT_AMT), 0)
  );

  // 是否有收據項目，若無需顯示警示訊息
  const hasReceiptItems = computed(() => {
    return (tabIndex) => showingReceipts.value[tabIndex].ITEM_DATA.length > 0;
  });

  const nonGroupLifeGroups = ref([]);
  const groupLifeGroups = ref([]);
  const receiptTabs = ref();

  // 新增收據項目下拉選單
  const receiptItemOptions = reactive([]);

  // 刪除收據
  const deleteReceipt = (serNo) => {
    $swal.confirm('您確定要刪除嗎？', async () => {
      // remove(receiptData.value.RECEIPT_DATA, (e) => e.SER_NO === serNo);
      let rReceipt = receiptData.value.RECEIPT_DATA.find((e) => e.SER_NO === serNo);
      if (rReceipt) rReceipt.ACT_CD = 'D';
      // 切換至上一個頁籤
      if (currentTabIndex.value >= 1) {
        currentTabIndex.value -= 1;
        await nextTick();
        receiptTabs.value?.setActive(currentTabIndex.value);
      }
    });
  };

  // 刪除收據項目
  const onClickDeleteReceiptItem = (serNo) => {
    remove(receiptData.value.RECEIPT_DATA[currentReceiptIndex.value].ITEM_DATA, (e) => e.SER_NO === serNo);
  };

  // 呼叫API取得收據項目 => 改成打開Modal
  const onClickAddReceiptItem = async (hospitalCode, kind) => {
    if (!hospitalCode) {
      $swal.warning('請先選擇醫院');
      return;
    } else if (!kind) {
      $swal.warning('請先選擇收據種類');
      return;
    }

    $m.show({
      component: ReceiptItemModal,
      id: 'modifyCategoryModal',
      data: {
        hospitalCode,
        kind,
        isSchool: isSchool.value,
        emitEvents: {
          async insertReceiptItems(items) {
            console.log(items);
            // 先檢核
            let isValid = true;
            for (const item of items) {
              isValid = validReceiptItem(item.RCPT_SER_NO, item.PAY_RCPT_NAME);
              if (!isValid) break;
            }
            // 檢核成功再新增
            if (isValid) {
              for (const item of items) {
                addReceiptItem(item.RCPT_SER_NO, item.PAY_RCPT_NAME, kind);
              }
              await nextTick();
              refreshReceiptItemGroup(kind);
              $m.hide();
            }
          }
        }
      }
    });
  };

  // 新增收據
  const addReceipt = () => {
    const serNo = sequence(receiptData.value.RECEIPT_DATA, 'SER_NO');
    const template = {
      javaClass: 'com.cathay.aa.a0.bo.AA_A0Z100_bo4',
      SER_NO: serNo.toString(),
      MAN_ISRT_IND: 'Y',
      ACT_CD: 'A',
      HOSP_CODE: '',
      HOSP_NAME: '',
      HOSP_STR_DATE: '',
      HOSP_END_DATE: '',
      IS_RCPT_ORIG: '',
      IS_SOC_INSU: 'Y',
      RCPT_KIND: ReceiptKind.Hospitalized, // 預設住院收據
      ITEM_DATA: [],
      ACT_CD: 'A'
    };
    receiptData.value.RECEIPT_DATA.push(template);
  };

  // 檢核收據項目
  const validReceiptItem = (RCPT_SER_NO, PAY_RCPT_NAME) => {
    // 檢核是否重覆的收據項目
    if (
      RCPT_SER_NO &&
      receiptData.value.RECEIPT_DATA[currentReceiptIndex.value].ITEM_DATA.some((e) => e.RCPT_SER_NO === RCPT_SER_NO)
    ) {
      $swal.warning(`${PAY_RCPT_NAME}項目不可重複新增`);
      return false;
    }
    return true;
  };

  // 刷新收據項目Group
  const refreshReceiptItemGroup = (RCPT_KIND) => {
    const resolver = (m) => {
      if (RCPT_KIND === ReceiptKind.Group) {
        return m.RCPT_KIND === RCPT_KIND ? [m.SER_NO] : [];
      } else {
        return [m.SER_NO];
      }
    };

    // Refresh要正確Refresh到
    let needRefreshIndex = showingReceipts.value
      .flatMap(resolver)
      .findIndex((e) => e == receiptData.value.RECEIPT_DATA[currentReceiptIndex.value].SER_NO);
    console.log(showingReceipts.value.flatMap((m) => (m.RCPT_KIND === RCPT_KIND ? [m.SER_NO] : [])));
    console.log(needRefreshIndex);
    if (needRefreshIndex > -1) {
      if (RCPT_KIND !== ReceiptKind.Group) nonGroupLifeGroups.value[needRefreshIndex]?.refreshGroup();
      else groupLifeGroups.value[needRefreshIndex]?.refreshGroup();
    }
  };

  // 新增收據項目
  const addReceiptItem = (RCPT_SER_NO, PAY_RCPT_NAME, RCPT_KIND, NEED_REFRESH = false) => {
    if (!validReceiptItem(RCPT_SER_NO, PAY_RCPT_NAME)) return;
    const serNo = sequence(receiptData.value.RECEIPT_DATA[currentReceiptIndex.value].ITEM_DATA, 'SER_NO');
    receiptData.value.RECEIPT_DATA[currentReceiptIndex.value].ITEM_DATA.push({
      javaClass: 'com.cathay.aa.a0.bo.AA_A0Z100_bo6',
      SER_NO: serNo.toString(),
      HOSP_STR_DATE: '',
      HOSP_END_DATE: '',
      IS_RCPT_ORIG: 'N',
      IS_SOC_INSU: 'N',
      RCPT_SER_NO: isEmpty(RCPT_SER_NO) ? serNo.toString().padStart(3, '0') : RCPT_SER_NO,
      PAY_RCPT_NAME: isEmpty(PAY_RCPT_NAME) ? serNo.toString().padStart(3, '0') : PAY_RCPT_NAME,
      APLY_RCPT_AMT: '',
      CFM_RCPT_AMT: '',
      PAY_KIND: '',
      PAY_KIND_SCH: '',
      CHG_MEMO: '',
      MAN_ISRT_IND: 'Y',
      ACT_CD: 'A'
    });

    if (NEED_REFRESH) {
      refreshReceiptItemGroup(RCPT_KIND);
    }
  };

  // TODO: 金額檢核: 申請金額與核定金額有異動金額，需填寫原因(等有反應再說，尚未確認)
</script>
