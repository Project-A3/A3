<template>
  <Modal disableOverflow>
    <template v-slot:title>人工核定</template>
    <template v-slot:content>
      <!-- Title-->
      <div class="columns title">
        <h3>修改原因</h3>
      </div>

      <!-- Table-->
      <div class="manual-approved-table">
        <!-- Insurance 1 -->
        <div class="table-part">
          <div class="columns table-title">
            <div class="column">保單號碼 {{ policy.POLICY_NO }}</div>
          </div>
          <!-- Insurance Type 1-1 -->
          <div class="columns table-num">
            <div class="column is-narrow ver-center">
              <div class="number">1</div>
            </div>
            <div class="column">
              <div class="columns data-status">
                <div class="column is-9">
                  <div class="columns is-multiline">
                    <div class="column is-5">
                      <span class="field mr-57">險別</span>
                      <span class="data font-eudc">{{ policy.PROD_ID }} {{ policy.PROD_ID_NAME }}</span>
                    </div>
                    <div class="column is-4 is-flex">
                      <span class="field">理賠項目</span>
                      <span class="data is-inline-block font-eudc" style="max-width: 150px">{{
                        policy.CLAM_ITEM.CLAM_AMT_NAME
                      }}</span>
                    </div>
                    <div class="column is-3 ml--20">
                      <span class="field mr-57">保額</span>
                      <span class="data">{{ policy.CLAM_ITEM.FACE_AMT }}{{ policy.CLAM_ITEM.FACE_AMT_UNIT_NAME }}</span>
                    </div>
                    <div class="column is-5 hidden-info">
                      <span class="field">給付天數</span>
                      <span class="data" v-if="isDCZ1DelayRest">{{ payDay }}</span>
                      <FormInput class="is-inline" type="number" v-model="payDay" :error="errors.payDay" v-else></FormInput>
                      <span class="field m-0 ml-1">天</span>
                    </div>
                    <div class="column is-4 hidden-info ver-center" v-if="!(isDCZ1 && policy.CLAM_ITEM.MAN_ISRT_IND === 'N')">
                      <span class="field">試算金額</span>
                      <span class="data">{{ policy.CLAM_ITEM.TRIL_CALC_AMT }}元</span>
                    </div>
                    <div
                      class="column is-3 ml--20 hidden-info ver-center"
                      v-if="!(isDCZ1 && policy.CLAM_ITEM.MAN_ISRT_IND === 'N')"
                    >
                      <span class="field">給付金額</span>
                      <!-- <span class="data" v-if="isDCZ1DelayRest">{{ payAmount }}元</span> -->
                      <FormInput
                        class="is-inline hide-arrows"
                        type="number"
                        v-model="payAmount"
                        :error="errors.payAmount"
                        @change="checkMultAcptRule"
                      ></FormInput>
                    </div>
                    <div class="column is-12 ml-20 is-flex ver-center" v-if="isDCZ1DelayRest">
                      <span class="field">計息起日</span>
                      <DatetimePicker v-model="loanStartDate" style="width: 180px"></DatetimePicker>
                    </div>
                  </div>
                </div>
                <div class="column is-4 ver-center" :class="{ 'mt--60': isDCZ1DelayRest }">
                  <span class="field mr-20">給付狀態</span>
                  <span class="data">
                    <FormDropdown
                      class="status"
                      :options="statusOptions"
                      v-model="payStatus"
                      :error="errors.payStatus"
                    ></FormDropdown>
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
          <button class="button" @click="isReasonModalShow = true">
            <span>{{ changeReason ? changeReason : '請選擇修改原因' }}</span>
            <img src="/src/assets/images/icon-add.svg" alt="ADD" />
          </button>
        </div>
      </div>
      <FieldErrorMessage id="changeReasonError" v-if="errors.changeReason">{{ errors.changeReason }}</FieldErrorMessage>
      <textarea
        class="font-eudc"
        cols="30"
        rows="10"
        placeholder="請輸入修改原因。注意不可輸入:(){}&quot'; 8 種字元，且限 300 字。"
        v-model="changeReasonMemo"
      ></textarea>

      <!-- Input Group -->
      <div class="input-group" v-if="policy.CLAM_ITEM.PARAMTERS2">
        <div class="columns">
          <div class="column is-narrow">
            <span class="field">類別</span>
          </div>
          <div class="column">
            <FormDropdown
              class="height-limit"
              :options="diagKindOptions"
              v-model="diagKind"
              :error="errors.diagKind"
            ></FormDropdown>
          </div>
          <div class="column is-narrow">
            <span class="field">疾病代碼</span>
          </div>
          <div class="column">
            <div class="dropdown">
              <div class="dropdown-trigger">
                <button class="button" @click="isICDModalShow = true">
                  <span>{{ icdCode ? icdCode : '請選擇' }}</span>
                  <img src="/src/assets/images/icon-add.svg" alt="ADD" />
                </button>
              </div>
            </div>
            <FieldErrorMessage id="icdCodeError" v-if="errors.icdCode">{{ errors.icdCode }}</FieldErrorMessage>
          </div>
          <div class="column is-narrow">
            <span class="field">骨折代碼</span>
          </div>
          <div class="column">
            <div class="dropdown">
              <div class="dropdown-trigger">
                <button class="button" @click="isBoneModalShow = true">
                  <span>{{ boneCode ? boneCode : '請選擇' }}</span>
                  <img src="/src/assets/images/icon-add.svg" alt="ADD" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="columns">
          <div class="column is-narrow">
            <span class="field">手術代碼</span>
          </div>
          <div class="column">
            <div class="dropdown">
              <div class="dropdown-trigger">
                <button class="button" aria-haspopup="true" aria-controls="dropdown-menu" @click="isOperationModalShow = true">
                  <span>{{ opCode ? opCode : '請選擇' }}</span>
                  <img src="/src/assets/images/icon-add.svg" alt="ADD" />
                </button>
              </div>
            </div>
          </div>
          <div class="column is-narrow">
            <span class="field">手術等級</span>
          </div>
          <div class="column">
            <FormDropdown class="height-limit" :options="opGradeOptions" v-model="opGrade" :error="errors.opGrade"></FormDropdown>
          </div>
          <div class="column is-narrow">
            <span class="field">住院區間</span>
          </div>
          <div class="column">
            <DatetimePicker
              :option="{ isRange: true, readonly: true, closeOnSelect: true }"
              v-model="hospitalDateRange"
            ></DatetimePicker>
          </div>
        </div>

        <div class="columns">
          <div class="column is-narrow">
            <span class="field">門診日期</span>
          </div>
          <div class="column" style="flex-wrap: wrap">
            <div class="datetimepicker-wrapper-div range-datetime" v-if="policy.CLAM_ITEM.IS_EMGY_ITEM === 'Y'">
              <DatetimeRangePicker
                v-model:modelStartDate="clinicDateTime.start"
                v-model:modelEndDate="clinicDateTime.end"
                :isDatetime="true"
              ></DatetimeRangePicker>
            </div>
            <div
              class="datetimepicker-wrapper-div multiple-date"
              v-for="(clinicDate, index) in clinicDateList"
              :key="index + clinicDate"
              v-else
            >
              <DatetimePicker v-model="clinicDateList[index]"></DatetimePicker>
              <button class="button is-primary-lightest m-1 button-delete" @click="onClickDeleteClinicDate(index)">
                <img src="/src/assets/images/icon-trash.svg" alt="TRASH" />
              </button>
            </div>
          </div>

          <div class="column is-2 hor-right">
            <button
              class="button is-primary has-icon-back has-icon-back-add"
              v-if="policy.CLAM_ITEM.IS_EMGY_ITEM === 'N'"
              @click="onClickAddClinicDate"
            >
              新增
            </button>
          </div>
        </div>
      </div>

      <!-- Reducing Benefits 削減給付 -->
      <div class="reducing-benefits" v-if="isMultAcpt === 'Y'">
        <div class="columns title mt-5"><h3>多受益人分次理賠設定</h3></div>
        <div class="table-content">
          <table class="table is-fullwidth">
            <thead class="no-wrap-title">
              <tr>
                <th>待給付金額</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <FormInput
                    class="is-inline hide-arrows"
                    type="number"
                    v-model="multApctAmt"
                    :error="errors.multApctAmt"
                    :disabled="isMultApctAmtDisabled"
                  ></FormInput>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Paying According Contract 依約給付
      <div class="paying-according-contract" v-if="payStatus === PayItemStatus.ContractPay">
        <div class="table-content mt-5">
          <table class="table is-fullwidth">
            <thead class="no-wrap-title">
              <tr>
                <th>所繳保費總額</th>
                <th>所繳保費總額加計利息</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><input class="hide-arrows" type="number" value="" /></td>
                <td><input class="hide-arrows" type="number" value="" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      -->

      <!-- DISB Area -->
      <template v-if="policy.CLAM_ITEM.CLAM_CAT === 'B'">
        <!-- Title-->
        <div class="columns title">
          <h3>失能等級</h3>
        </div>
        <FormDropdown
          class="edit-reason height-limit"
          :options="disbOptions"
          v-model="disbGrade"
          :error="errors.disbGrade"
        ></FormDropdown>

        <!-- Table -->
        <div class="modal-table">
          <table class="table is-striped-odd is-fullwidth">
            <thead>
              <tr>
                <th>序號</th>
                <th>失能程度</th>
                <th>失能等級表</th>
                <th>失能等級</th>
                <th>給付比例</th>
                <th>程度描述</th>
                <th>給付狀態</th>
                <th class="has-text-centered">刪除</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(disbItem, index) in disbItems" :key="index">
                <td class="has-text-centered">{{ index + 1 }}</td>
                <td class="">
                  <div class="dropdown open-modal-in-table">
                    <div class="dropdown-trigger">
                      <button class="button" @click.prevent="onClickOpenDisbModal(disbItem.UUID)">
                        <span>{{ disbItem.SHOW_RANK }}</span>
                        <img src="/src/assets/images/icon-add.svg" alt="ADD" />
                      </button>
                    </div>
                  </div>
                  <FieldErrorMessage style="position: relative" :id="`disb${index}Error`" v-if="disbItem.ERROR">
                    {{ disbItem.ERROR }}
                  </FieldErrorMessage>
                </td>
                <td>{{ disbItem.SHOW_GRADE_TABLE }}</td>
                <td>{{ disbItem.SHOW_GRADE }}</td>
                <td>{{ disbItem.SHOW_RATE }}</td>
                <td style="max-width: 300px">{{ disbItem.DISB_DISC }}</td>
                <td>{{ disbItem.SHOW_PAY_STS }}</td>
                <td class="has-text-centered">
                  <button class="button icon trash" @click="onClickDeleteDisbItem(disbItem.UUID)"></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="columns">
          <div class="column hor-right">
            <button class="button is-primary has-icon-back has-icon-back-add" @click="onClickAddDisbItem">新增</button>
          </div>
        </div>
      </template>
    </template>
    <template v-slot:buttons>
      <button class="button is-primary is-light" @click="props.close">取消</button>
      <button class="button is-primary" @click.prevent="onSubmit" :disabled="disabledSubmit">確認</button>
      <!-- <p>{{ errors }}</p> -->
    </template>
  </Modal>
  <ManualReasonModal
    v-if="isReasonModalShow"
    :data="{}"
    :close="
      () => {
        isReasonModalShow = false;
      }
    "
    @onClickConfirm="onReasonChoosed"
  ></ManualReasonModal>
  <ModalWrapper id="diseaseCode" v-if="isICDModalShow">
    <ICDModal
      :data="{
        emitEvents: icdModalEmitEvents
      }"
      :close="
        () => {
          isICDModalShow = false;
        }
      "
    ></ICDModal>
  </ModalWrapper>
  <ModalWrapper id="disabilityQuery" v-if="isBoneModalShow">
    <BoneFractureModal
      :data="{
        emitEvents: boneModalEmitEvents
      }"
      :close="
        () => {
          isBoneModalShow = false;
        }
      "
    ></BoneFractureModal>
  </ModalWrapper>
  <ModalWrapper id="surgicalCode" v-if="isOperationModalShow">
    <OperationModal
      :data="{
        emitEvents: operationModalEmitEvents
      }"
      :close="
        () => {
          isOperationModalShow = false;
        }
      "
    >
    </OperationModal>
  </ModalWrapper>
  <DisbTableModal
    v-if="isDisbTableModalShow"
    :data="{}"
    :close="
      () => {
        isDisbTableModalShow = false;
      }
    "
    @onClickLink="onClickDisbLink"
  >
  </DisbTableModal>
</template>

<script setup>
  import Modal from '~/components/Modal.vue';
  import { useAccountingStore } from '~/stores/accounting';
  import { useHomeStore } from '~/stores/home';
  import FormDropdown from '~/components/Form/FormDropdown.vue';
  import { object, string, number, boolean } from 'yup';
  import useSwal from '~/composables/useSwal';
  import { useField, useForm } from 'vee-validate';
  import { cloneDeep, remove } from 'lodash-es';
  import FormInput from '~/components/Form/FormInput.vue';
  import { PayItemStatus } from '~/common/utils/enum';
  import FieldErrorMessage from '~/components/Form/FieldErrorMessage.vue';
  import ModalWrapper from '~/components/ModalWrapper.vue';
  import DatetimePicker from '~/components/DatetimePicker.vue';
  import { uuid } from '~/common/utils';
  import DatetimeRangePicker from '~/components/DatetimeRangePicker.vue';
  import useMoment from '~/composables/useMoment';
  import useDecimal from '~/composables/useDecimal';

  const { add, subtract, divide, multiply } = useDecimal();
  const { getROCDate, format } = useMoment();

  const { $swal } = useSwal();

  const ManualReasonModal = defineAsyncComponent(() => import('./ManualReasonModal.vue'));
  const ICDModal = defineAsyncComponent(() => import('../../Apply/Modals/ICDModal.vue'));
  const BoneFractureModal = defineAsyncComponent(() => import('../../Apply/Modals/BoneFractureModal.vue'));
  const OperationModal = defineAsyncComponent(() => import('../../Apply/Modals/OperationModal.vue'));
  const DisbTableModal = defineAsyncComponent(() => import('./DisbTableModal.vue'));

  const isReasonModalShow = ref(false);
  const isICDModalShow = ref(false);
  const isBoneModalShow = ref(false);
  const isOperationModalShow = ref(false);

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
  console.log(props.data);
  const policy = ref(cloneDeep(props.data.policy));
  const accountingStore = useAccountingStore();
  const homeStore = useHomeStore();
  console.info(policy.value.CLAM_ITEM?.MAN_ISRT_IND);
  // 給付狀態下拉選單選項
  const statusOptions = reactive([
    {
      name: '請選擇',
      value: ''
      // disabled: true
    },
    {
      name: PayItemStatus.getChineseStatus(PayItemStatus.NotYetPay),
      value: PayItemStatus.NotYetPay
    },
    {
      name: PayItemStatus.getChineseStatus(PayItemStatus.ContractPay),
      value: PayItemStatus.ContractPay,
      disabled: policy.value.CLAM_ITEM?.MAN_ISRT_IND === 'Y' // 人工新增不顯示依約給付
    },
    {
      name: PayItemStatus.getChineseStatus(PayItemStatus.AgreementPay),
      value: PayItemStatus.AgreementPay
    },
    {
      name: PayItemStatus.getChineseStatus(PayItemStatus.ReducePay),
      value: PayItemStatus.ReducePay
    },
    {
      name: PayItemStatus.getChineseStatus(PayItemStatus.DelayRest),
      value: PayItemStatus.DelayRest
    },
    // {
    //   name: PayItemStatus.getChineseStatus(PayItemStatus.ReturnNotPay),
    //   value: PayItemStatus.ReturnNotPay
    // },
    // {
    //   name: PayItemStatus.getChineseStatus(PayItemStatus.Bypass),
    //   value: PayItemStatus.Bypass
    // },
    {
      name: PayItemStatus.getChineseStatus(PayItemStatus.Manual),
      value: PayItemStatus.Manual
    }
  ]);

  // 類別下拉選單處理
  const diagKindOptions = reactive([
    {
      name: '請選擇',
      value: '',
      disabled: true
    }
  ]);

  //CALL API：AA_B3Z310.getDIAG_KIND_LIST取得下拉選單內容(多筆)
  accountingStore
    .getDiagKindList()
    .then((list) => {
      // "DIAG_KIND"有值：就使用該筆資料當下拉選單的資料(只會有1筆可下拉)
      if (policy.value.CLAM_ITEM.DIAG_KIND) {
        diagKindOptions.push({
          name: list.find((kind) => kind.DIAG_KIND === policy.value.CLAM_ITEM.DIAG_KIND)?.DIAG_KIND_NAME ?? '無對應中文',
          value: policy.value.CLAM_ITEM.DIAG_KIND,
          selected: true
        });
      } else {
        diagKindOptions.push(
          ...list.map((m) => ({
            name: m.DIAG_KIND_NAME,
            value: m.DIAG_KIND
          }))
        );
      }
    })
    .catch((e) => $swal.fail(e));

  // 手術等級下拉選單選項
  const opGradeOptions = reactive([
    {
      name: '請選擇',
      value: '',
      disabled: true
    }
  ]);
  accountingStore
    .getOpGradeList(policy.value.PROD_ID)
    .then((list) => {
      opGradeOptions.push(
        ...list.map((m) => ({
          name: m.value,
          value: m.OP_GRADE,
          selected: m.OP_GRADE == policy.value.CLAM_ITEM.OP_GRAD
        }))
      );
    })
    .catch((e) => $swal.fail(e));

  // 失能程度下拉選單選項
  const disbOptions = reactive([
    {
      name: '請選擇',
      value: '',
      disabled: true
    },
    {
      name: '等級一',
      value: '1'
    },
    {
      name: '等級二',
      value: '2'
    },
    {
      name: '等級三',
      value: '3'
    },
    {
      name: '等級四',
      value: '4'
    },
    {
      name: '等級五',
      value: '5'
    },
    {
      name: '等級六',
      value: '6'
    },
    {
      name: '等級七',
      value: '7'
    },
    {
      name: '等級八',
      value: '8'
    },
    {
      name: '等級九',
      value: '9'
    },
    {
      name: '等級十',
      value: '10'
    },
    {
      name: '等級十一',
      value: '11'
    }
  ]);

  // 處理急診日期時間區間
  const handleEmgyDatetime = (text) => {
    var datetimeSplit = text.split('_');
    var startDate = `${datetimeSplit[0]} ${datetimeSplit[1]}`;
    var endDate = `${datetimeSplit[2]} ${datetimeSplit[3]}`;
    return [startDate, endDate];
  };

  // 取得預設選擇的給付狀態
  const getDefaultStatus = () => {
    if (policy.value.CLAM_ITEM.PAY_STS) {
      return policy.value.CLAM_ITEM.PAY_STS;
    }
    if (policy.value.CLAM_ITEM?.MAN_ISRT_IND !== 'Y') {
      return PayItemStatus.ContractPay;
    }
    return '';
  };

  // 檢核設定
  const { handleSubmit, errors } = useForm({
    validationSchema: object({
      payDay: string()
        .required('請填寫給付天數')
        .matches(/^[0-9]*$/, '只能為數字'),
      payAmount: string().when('curr', (curr, schema) =>
        curr != 'NTD'
          ? schema.when('isMultAcpt', (isMultAcpt, schema) =>
              isMultAcpt === 'Y'
                ? schema.required('請填寫給付金額').matches(/^\d*\.?\d{0,2}$/, '給付金額需大於0，最多小數點2位數字')
                : schema.required('請填寫給付金額').matches(/^-?\d*\.?\d{0,2}$/, '給付金額最多小數點2位數字')
            )
          : schema.when('isMultAcpt', (isMultAcpt, schema) =>
              isMultAcpt === 'Y'
                ? schema.required('請填寫給付金額').matches(/^\d*$/, '給付金額需大於0整數')
                : schema.required('請填寫給付金額').matches(/^-?\d*$/, '給付金額需為整數')
            )
      ),
      payStatus: string().required('請選擇給付狀態'),
      changeReason: string().when('payStatus', (value, schema) =>
        value != PayItemStatus.ContractPay ? schema.required('請選擇修改原因') : schema.nullable().notRequired()
      ),
      icdCode: string().when('parameters2', (value, schema) =>
        value ? schema.required('請選擇疾病代碼') : schema.nullable().notRequired()
      ),
      hospitalDateRange: string().nullable().notRequired(),
      // hospitalDateRange: string().when('parameters2', (value, schema) =>
      //   value ? schema.required('請選擇住院區間') : schema.nullable().notRequired()
      // )
      multApctAmt: string().when('isMultAcpt', (value, schema) =>
        value === 'Y'
          ? schema.required('請填寫待給付金額').matches(/^\d*\.?\d+$/, '待給付金額不得小於 0')
          : schema.nullable().notRequired()
      )
    }),
    // validateOnMount: isEditMode,
    initialValues: {
      payDay: policy.value.CLAM_ITEM.PAY_DAY,
      payAmount: policy.value.CLAM_ITEM.PAY_AMT.replaceAll(',', ''),
      payStatus: getDefaultStatus(),
      changeReason: policy.value.CLAM_ITEM.CHG_RESN,
      changeReasonMemo: policy.value.CLAM_ITEM.CHG_MEMO,
      diagKind: policy.value.CLAM_ITEM.DIAG_KIND,
      icdCode: policy.value.CLAM_ITEM?.ICD_CODE ? policy.value.CLAM_ITEM.ICD_CODE : '',
      boneCode: policy.value.CLAM_ITEM.BONE_CODE,
      opCode: policy.value.CLAM_ITEM.OP_CODE,
      opGrade: policy.value.CLAM_ITEM.OP_GRAD,
      hospitalDateRange:
        policy.value.CLAM_ITEM?.EVT_STR_DATE && policy.value.CLAM_ITEM?.EVT_END_DATE
          ? `${policy.value.CLAM_ITEM.EVT_STR_DATE} ~ ${policy.value.CLAM_ITEM.EVT_END_DATE}`
          : '',
      clinicDate: policy.value.CLAM_ITEM.DATE_DTLS,
      clamCat: policy.value.CLAM_ITEM.CLAM_CAT,
      parameters2: policy.value.CLAM_ITEM.PARAMTERS2,
      disbGrade: policy.value.CLAM_ITEM.DISB_GRAD,
      loanStartDate: policy.value.CLAM_ITEM?.EVT_STR_DATE ?? '',
      ocrDate: policy.value.CLAM_ITEM?.OCR_DATE,
      curr: policy.value.CLAM_ITEM?.CURR,
      multApctAmt: policy.value.CLAM_ITEM?.MULT_APCT_AMT,
      isMultAcpt: policy.value.CLAM_ITEM?.IS_MULT_ACPT
    }
  });

  // 欄位
  // 給付天數
  const { value: payDay } = useField('payDay');
  // 給付金額
  const { value: payAmount } = useField('payAmount');
  // 給付狀態
  const { value: payStatus } = useField('payStatus');
  // 修改原因代碼
  const { value: changeReason } = useField('changeReason');
  // 修改原因文字
  const { value: changeReasonMemo } = useField('changeReasonMemo');
  // 類別
  const { value: diagKind } = useField('diagKind');
  // 疾病代碼
  const { value: icdCode } = useField('icdCode');
  // 骨折代碼
  const { value: boneCode } = useField('boneCode');
  // 手術代碼
  const { value: opCode } = useField('opCode');
  // 手術等級
  const { value: opGrade } = useField('opGrade');
  // 住院區間
  const { value: hospitalDateRange } = useField('hospitalDateRange');
  // 門診日期
  const { value: clinicDate } = useField('clinicDate');
  // 門診日期to array
  const clinicDateList = reactive(policy.value.CLAM_ITEM.DATE_DTLS);
  const clinicDateTime = reactive({
    start: '',
    end: ''
  });

  // 計息起日
  const { value: loanStartDate } = useField('loanStartDate');
  const { value: ocrDate } = useField('ocrDate');

  if (policy.value.CLAM_ITEM.IS_EMGY_ITEM === 'Y' && policy.value.CLAM_ITEM.DATE_DTLS?.length > 0) {
    const range = handleEmgyDatetime(policy.value.CLAM_ITEM.DATE_DTLS[0]);
    clinicDateTime.start = range[0];
    clinicDateTime.end = range[1];
  }

  // 索賠類別
  const { value: clamCat } = useField('clamCat');
  // parameters2
  const { value: parameters2 } = useField('parameters2');
  // 失能等級
  const { value: disbGrade } = useField('disbGrade');

  // 補中文
  // 手術名稱
  const opName = ref(policy.value.CLAM_ITEM.BONE_NAME);
  // 骨折代碼名稱
  const boneName = ref(policy.value.CLAM_ITEM.BONE_NAME);
  // 疾病代碼名稱
  const icdName = ref(policy.value.CLAM_ITEM.ICD_NAME);

  // 待給付金額
  const { value: multApctAmt } = useField('multApctAmt');
  // 是否有入多受益人分配(Y/N)
  const { value: isMultAcpt } = useField('isMultAcpt');

  // 新增門診日期
  const onClickAddClinicDate = () => {
    if (clinicDateList.some((d) => !d)) {
      $swal.warning('請先填寫所有門診日期');
      return;
    }

    clinicDateList.push('');
  };

  const onClickDeleteClinicDate = (index) => {
    clinicDateList.splice(index, 1);
  };

  // 選擇原因後觸發
  const onReasonChoosed = (reason) => {
    console.log(reason);
    changeReason.value = reason.code;
    changeReasonMemo.value = reason.name;
    isReasonModalShow.value = false;
  };

  // 選擇疾病後觸發
  const icdModalEmitEvents = {
    updateValue: (value) => {
      icdCode.value = value;
    },
    updateText: (text) => {
      // 有要中文名稱的話於此取值
      icdName.value = text;
    },
    clearValue: () => {
      icdCode.value = '';
      icdName.value = '';
      isICDModalShow.value = false;
    }
  };

  // 選擇骨折代碼後觸發
  const boneModalEmitEvents = {
    updateValue: (value) => {
      boneCode.value = value;
    },
    updateText: (text) => {
      // 有要中文名稱的話於此取值
      boneName.value = text;
    },
    clearValue: () => {
      boneCode.value = '';
      boneName.value = '';
      isBoneModalShow.value = false;
    }
  };

  // 選擇手術代碼後觸發
  const operationModalEmitEvents = {
    updateValue: (value) => {
      opCode.value = value;
    },
    updateValue2: (value) => {
      // 有要中文名稱的話於此取值
      opName.value = value;
    },
    updateValue3: (value) => {
      // 有要是否癌症取此值
    },
    clearValue: () => {
      opCode.value = '';
      opName.value = '';
      isOperationModalShow.value = false;
    }
  };

  // 是否為延滯息
  const isDCZ1 = computed(() => policy.value.CLAM_ITEM?.CLAM_AMT_CODE === 'DCZ1');

  // 是否為延滯息且狀態選擇修正延滯息日期
  const isDCZ1DelayRest = computed(() => payStatus.value == PayItemStatus.DelayRest && isDCZ1.value);

  // 是否可調整待給付金額欄位
  const isMultApctAmtDisabled = computed(
    () => (policy.value.CLAM_ITEM?.CLAM_AMT_CODE === 'PBA1') | (policy.value.CLAM_ITEM?.CLAM_AMT_CODE === 'BKZ2')
  );

  // 計息起日改變，呼叫API更新給付天數
  watch(loanStartDate, async (newValue, oldValue) => {
    console.log(newValue);
    try {
      accountingStore.showLoading();
      let passDay = await accountingStore.getCurrentPassDay(policy.value.APLY_NO, newValue);
      payDay.value = passDay;
      ocrDate.value = newValue;
      // 若isCurrentPassDay回傳的DCZ1_PAY_DAY為0時需要連動將畫面給付金額改為0
      // 且一併將PAY_AMT改為0(此修改MAN_ISRT_IND為Y 或是 N皆適用)
      if (passDay == '0') {
        payDay.value = '0';
        payAmount.value = '0';
      }
    } catch (e) {
      $swal.fail(e);
    } finally {
      accountingStore.hideLoading();
    }
  });

  // 給付金額異動、選擇修改原因
  watch([payStatus, changeReason], async ([newPayStatus, newChangeReason], [oldPayStatus, oldChangeReason]) => {
    checkMultAcptRule();
  });

  // A區顯示異動、給付金額異動
  watch([isMultAcpt, payAmount], async ([newIsMultAcpt, newPayAmount], [oldIsMultAcpt, oldPayAmount]) => {
    // console.log('isMultAcpt==>',newIsMultAcpt, oldIsMultAcpt, newIsMultAcpt === oldIsMultAcpt, oldIsMultAcpt === 'N', newIsMultAcpt === 'Y');
    // console.log('payAmount==>',newPayAmount, oldPayAmount, newPayAmount === oldPayAmount);
    // console.log('multApctAmt==>',multApctAmt.value);

    // 第一次出現A區、給付金額異動
    if (((oldIsMultAcpt === 'N') & (newIsMultAcpt === 'Y')) | ((newIsMultAcpt === 'Y') & (newPayAmount != oldPayAmount))) {
      reCalMultApctAmt();
    }

    // 不符合多受益人規則，清掉多受益人輸入資料。
    if (newIsMultAcpt === 'N') {
      multApctAmt.value = '0';
    }
  });

  /**
   * 檢核多受益人輸入規則
   */
  const checkMultAcptRule = async () => {
    const claimItem = props.data.policy.CLAM_ITEM;
    let clamCat = claimItem.CLAM_CAT;
    let manIsrtInd = claimItem.MAN_ISRT_IND;
    let paySts = payStatus.value;
    let fTrilCalcAmt = parseFloat(claimItem.TRIL_CALC_AMT.replaceAll(',', ''));

    let getEVT_STR_DATE = '';
    let getEVT_END_DATE = '';
    if (parameters2.value) {
      if (hospitalDateRange.value) {
        getEVT_STR_DATE = hospitalDateRange.value.split('~')[0].trim();
        getEVT_END_DATE = hospitalDateRange.value.split('~')[1].trim();
      }
    } else {
      getEVT_STR_DATE = claimItem.EVT_STR_DATE;
      getEVT_END_DATE = claimItem.EVT_END_DATE;
    }

    const updPayItem = {
      APLY_NO: props.data.policy.APLY_NO,
      SER_NO: claimItem.SER_NO,
      CLAM_CAT: claimItem?.CLAM_CAT,
      PARAMTERS2: claimItem?.PARAMTERS2,
      POLICY_NO: props.data.policy.POLICY_NO,
      PROD_ID: props.data.policy.PROD_ID,
      PROD_ID_NAME: props.data.policy.PROD_ID_NAME,
      CLAM_AMT_CODE: claimItem.CLAM_AMT_CODE,
      CLAM_AMT_NAME: claimItem.CLAM_AMT_NAME,
      FACE_AMT: claimItem.FACE_AMT,
      FACE_AMT_UNIT: claimItem.FACE_AMT_UNIT,
      PAY_STS: payStatus.value,
      PAY_STS_NAME: PayItemStatus.getChineseStatus(payStatus.value),
      PAY_DAY: payDay.value,
      TRIL_CALC_AMT: claimItem.TRIL_CALC_AMT,
      PAY_AMT: payAmount.value,
      CHG_RESN: changeReason.value,
      CHG_MEMO: changeReasonMemo.value,
      DISB_GRAD: disbGrade.value, // 失能等級
      DIAG_KIND: diagKind.value,
      DIAG_KIND_NAME: diagKindOptions.find((option) => option.value === diagKind.value)?.name,
      ICD_CODE: icdCode.value,
      ICD_NAME: icdName.value,
      BONE_CODE: boneCode.value,
      BONE_NAME: boneName.value,
      OP_CODE: opCode.value,
      OP_NAME: opName.value,
      OP_GRAD: opGrade.value,
      OP_RATIO: claimItem.OP_RATIO,
      EVT_STR_DATE: getEVT_STR_DATE,
      EVT_END_DATE: getEVT_END_DATE,
      DATE_DTLS: claimItem.IS_EMGY_ITEM === 'Y' ? [parseClinicDateTime()] : clinicDateList.filter((d) => d),
      OCR_DATE: ocrDate.value,
      IS_FROM_DTAAB020: claimItem.EXTRA_INFO?.indexOf('FROM_DTAAB020') >= 0 ? 'Y' : ''
    };

    // console.log('fTrilCalcAmt==>',fTrilCalcAmt);
    // console.log('clamCat==>',clamCat);
    // console.log('manIsrtInd==>',manIsrtInd);
    // console.log('paySts==>',paySts);
    //if((fTrilCalcAmt > 0) & (clamCat === 'A') & (manIsrtInd != 'Y') & (paySts === PayItemStatus.ReducePay)){
    if ((fTrilCalcAmt > 0) & (manIsrtInd != 'Y') & (paySts === PayItemStatus.ReducePay)) {
      let checkResult = await accountingStore.checkMultAcptRule(updPayItem);

      if (checkResult.IS_SUCCESS) {
        if ((checkResult.IS_MULT_ACPT === 'N') & (isMultAcpt.value === 'Y')) {
          $swal.warning('不符合多受益人規則，清掉多受益人輸入資料。');
        }

        isMultAcpt.value = checkResult.IS_MULT_ACPT;
      } else {
        console.error(checkResult.RTN_MSG);
      }
    } else {
      console.log('不符合A區顯示規則。');
      isMultAcpt.value = 'N';
    }
  };

  /**
   * 重新計算待給付金額
   */
  const reCalMultApctAmt = async () => {
    if (props.data.policy.CLAM_ITEM.TRIL_CALC_AMT > 0) {
      let amt = subtract(props.data.policy.CLAM_ITEM.TRIL_CALC_AMT, payAmount.value);
      multApctAmt.value = amt.toString();
    }
  };

  //#region 失能等級表格處理

  // 從getPayItems DATA_006帶入
  const disbItems = reactive(props.data.disbItems);

  // 加上UUID和顯示用資料
  disbItems.forEach((e) => {
    e.UUID = uuid();
    e.SHOW_RANK = e.DISB_ITEM;
    e.SHOW_GRADE_TABLE = e.DISB_TBLE;
    e.SHOW_GRADE = e.DISB_LVL + '級';
    e.SHOW_RATE = e.DISB_PRCT + '%';
    e.DISB_DISC = e.DISB_LVL_DESC;
  });

  const isDisbTableModalShow = ref(false);
  let currentSelectDisbItemId = null;

  const onClickOpenDisbModal = (uuid) => {
    isDisbTableModalShow.value = true;
    currentSelectDisbItemId = uuid;
  };

  const onClickAddDisbItem = () => {
    disbItems.push({
      // 表格顯示用
      UUID: uuid(),
      SHOW_RANK: '請選擇',
      SHOW_GRADE_TABLE: '',
      SHOW_GRADE: '',
      SHOW_RATE: '',
      DISB_DISC: '',
      SHOW_PAY_STS: computed(() => PayItemStatus.getChineseStatus(payStatus.value)),
      // 帶回資料用
      APLY_NO: policy.value.APLY_NO,
      APRV_DATE: '',
      CLAM_AMT_CODE: policy.value.CLAM_ITEM.CLAM_AMT_CODE,
      CLAM_CAT: policy.value.CLAM_ITEM.CLAM_CAT,
      DISB_ITEM: '',
      DISB_LVL: '',
      DISB_LVL_DESC: '',
      DISB_PRCT: '',
      DISB_TBLE: '',
      OCR_ID: policy.OCR_ID,
      PAY_STS: computed(() => payStatus.value),
      POLICY_NO: policy.value.POLICY_NO,
      PROD_ID: policy.value.PROD_ID
    });
  };

  const onClickDisbLink = (item) => {
    console.log(item);
    const findItem = disbItems.find((e) => e.UUID === currentSelectDisbItemId);
    // 把資料帶回
    if (findItem) {
      findItem.SHOW_RANK = item.SHOW_RANK;
      findItem.SHOW_GRADE_TABLE = item.SHOW_GRADE_TABLE;
      findItem.SHOW_GRADE = item.SHOW_GRADE + '級';
      findItem.SHOW_RATE = item.SHOW_RATE + '%';
      findItem.DISB_DISC = item.DISB_DISC;

      findItem.DISB_ITEM = item.SHOW_RANK;
      findItem.DISB_LVL = item.SHOW_GRADE;
      findItem.DISB_LVL_DESC = item.DISB_DISC;
      findItem.DISB_PRCT = item.SHOW_RATE;
      findItem.DISB_TBLE = item.SHOW_GRADE_TABLE;
    }
  };

  const onClickDeleteDisbItem = (uuid) => {
    remove(disbItems, (e) => e.UUID === uuid);
  };

  //#endregion

  const parseClinicDateTime = () => {
    if (clinicDateTime.start && clinicDateTime.end) {
      return `${format(clinicDateTime.start, 'YYYY-MM-DD_HH:mm:ss')}_${format(clinicDateTime.end, 'YYYY-MM-DD_HH:mm:ss')}`;
    } else {
      return '';
    }
  };

  const disabledSubmit = ref(false);
  // 表單送出
  const onSubmit = handleSubmit(async (values, actions) => {
    if (values.payStatus === PayItemStatus.ContractPay && policy.value.CLAM_ITEM?.MAN_ISRT_IND !== 'Y') {
      $swal.warning('依約給付，無法人工核定');
      return;
    }

    let fTrilCalcAmt = parseFloat(policy.value.CLAM_ITEM.TRIL_CALC_AMT.replaceAll(',', ''));
    let fMultApctAmt = parseFloat(multApctAmt.value.replaceAll(',', ''));
    let fPayAmount = parseFloat(payAmount.value.replaceAll(',', ''));
    let clamAmtCode = policy.value.CLAM_ITEM.CLAM_AMT_CODE;
    let manIsrtInd = policy.value.CLAM_ITEM.MAN_ISRT_IND;
    let clamCat = policy.value.CLAM_ITEM.CLAM_CAT;

    // console.log('試算金額',fTrilCalcAmt);
    // console.log('CLAM_AMT_CODE',clamAmtCode);
    // console.log('待給付金額',fMultApctAmt);
    // console.log('給付金額',fPayAmount);

    if (isMultAcpt.value === 'Y') {
      if (multApctAmt.value < 0) {
        $swal.warning('待給付金額不得為負');
        return;
      }
      if ((clamAmtCode === 'PBA1') | (clamAmtCode === 'BKZ2')) {
        if (add(multApctAmt.value, payAmount.value) != fTrilCalcAmt) {
          $swal.warning('待給付金額+給付金額， 需與試算金額相同');
          return;
        }
      } else {
        if (add(multApctAmt.value, payAmount.value) > fTrilCalcAmt) {
          //$swal.warning('待給付金額+給付金額，不得大試算金額');
          $swal.warning(
            '試算金額(' +
              fTrilCalcAmt +
              ')<待給付金額(' +
              multApctAmt.value +
              ')+給付金額(' +
              payAmount.value +
              ')，請再次確認待給付金額是否正確'
          );
          return;
        }
        if (add(multApctAmt.value, payAmount.value) < fTrilCalcAmt) {
          let prompt = await $swal.confirmAsync('請再次確認待給付金額是否正確(應給付金額-本次給付金額)');
          if (!prompt.isConfirmed) {
            return;
          }
        }
      }
    }

    // 檢核失能等級表格資料
    let isDisbDataValid = true;
    disbItems.forEach((e) => {
      if (!e.DISB_ITEM) {
        e.ERROR = '請選擇失能程度';
        isDisbDataValid = false;
      } else {
        e.ERROR = '';
      }
    });
    if (!isDisbDataValid) return;

    console.log(values);
    try {
      accountingStore.showLoading();
      const claimItem = props.data.policy.CLAM_ITEM;

      let getEVT_STR_DATE = '';
      let getEVT_END_DATE = '';
      if (values.parameters2) {
        console.log(values.hospitalDateRange);
        if (values.hospitalDateRange) {
          getEVT_STR_DATE = values.hospitalDateRange.split('~')[0].trim();
          getEVT_END_DATE = values.hospitalDateRange.split('~')[1].trim();
        }
      } else {
        getEVT_STR_DATE = claimItem.EVT_STR_DATE;
        getEVT_END_DATE = claimItem.EVT_END_DATE;
      }

      const newTemplate = {
        // javaClass: 'java.util.Map',
        APLY_NO: props.data.policy.APLY_NO,
        SER_NO: claimItem.SER_NO,
        CLAM_CAT: claimItem?.CLAM_CAT,
        PARAMTERS2: claimItem?.PARAMTERS2,
        POLICY_NO: props.data.policy.POLICY_NO,
        PROD_ID: props.data.policy.PROD_ID,
        PROD_ID_NAME: props.data.policy.PROD_ID_NAME,
        CLAM_AMT_CODE: claimItem.CLAM_AMT_CODE,
        CLAM_AMT_NAME: claimItem.CLAM_AMT_NAME,
        FACE_AMT: claimItem.FACE_AMT,
        FACE_AMT_UNIT: claimItem.FACE_AMT_UNIT,
        PAY_STS: values.payStatus,
        PAY_STS_NAME: PayItemStatus.getChineseStatus(values.payStatus),
        PAY_DAY: values.payDay,
        TRIL_CALC_AMT: claimItem.TRIL_CALC_AMT,
        PAY_AMT: values.payAmount,
        CHG_RESN: values.changeReason,
        CHG_MEMO: values.changeReasonMemo,
        DISB_GRAD: values.disbGrade, // 失能等級
        DIAG_KIND: values.diagKind,
        DIAG_KIND_NAME: diagKindOptions.find((option) => option.value === values.DIAG_KIND)?.name,
        ICD_CODE: values.icdCode,
        ICD_NAME: icdName.value,
        BONE_CODE: values.boneCode,
        BONE_NAME: boneName.value,
        OP_CODE: values.opCode,
        OP_NAME: opName.value,
        OP_GRAD: values.opGrade,
        OP_RATIO: claimItem.OP_RATIO,
        EVT_STR_DATE: getEVT_STR_DATE,
        EVT_END_DATE: getEVT_END_DATE,
        DATE_DTLS: claimItem.IS_EMGY_ITEM === 'Y' ? [parseClinicDateTime()] : clinicDateList.filter((d) => d),
        OCR_DATE: values.ocrDate,
        IS_MULT_ACPT: isMultAcpt.value,
        MULT_APCT_AMT: values.multApctAmt
      };

      // console.log('clamCat==>',clamCat);
      // console.log('fPayAmount==>',fPayAmount);
      // console.log('manIsrtInd==>',manIsrtInd);

      // 多受益人例外授權(人工新增)
      if ((clamCat === 'A') & (fPayAmount > 0) & (manIsrtInd === 'Y')) {
        let checkResult = await accountingStore.checkMultAcptRule(newTemplate);

        if (checkResult.IS_SUCCESS) {
          if (checkResult.IS_MULT_ACPT === 'W') {
            isMultAcpt.value = checkResult.IS_MULT_ACPT;
            accountingStore.hideLoading();
            disabledSubmit.value = true;

            let prompt = await $swal.confirmAsync('多受益人保單分次理賠，資料庫無資料，請例外授權。');
            if (prompt.isConfirmed) {
              window.open(
                `/AIWeb/servlet/HttpDispatcher/AIF0_0100/prompt?SYS_CODE=AA&CASE_NO=${newTemplate.APLY_NO}&EMAIL_ID=${homeStore.userInfo.EMP_ID}`
              );
            }
            return;
          }
        } else {
          console.error(checkResult.RTN_MSG);
        }
      }

      const result = await accountingStore.doManual(newTemplate, disbItems);

      $swal.success(result.RTN_MSG ? result.RTN_MSG : '檢核成功');
      props.close();
    } catch (e) {
      $swal.fail(e);
      console.error(e);
    } finally {
      accountingStore.hideLoading();
    }
  });
</script>

<style lang="scss">
  #manualApproved .error-message {
    position: absolute;
    margin-top: 1px;
    padding-left: 0;
  }
  #manualApproved #diseaseCode .modal-content .flex-box .flex-right .columns .column .field {
    margin-right: 12px;
  }
  #manualApproved .datetimepicker {
    position: absolute !important;
  }
  #manualApproved .input-group .error-message {
    margin-top: 60px;
  }
  #manualApproved .dropdown.open-modal-in-table {
    width: 140px;
  }
</style>
