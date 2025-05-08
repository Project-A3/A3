<template>
  <Modal :minify="modalTitle">
    <template v-slot:title>{{ modalTitle }}</template>
    <template v-slot:content>
      <form>
        <div class="part top">
          <div class="columns">
            <div class="column">
              <span class="field">受益人姓名</span>
            </div>
            <div class="column">
              <FormInput type="search" class="w-160 font-eudc" v-model="beneficiaryName" :error="errors.beneficiaryName"></FormInput>
            </div>
            <div class="column is-narrow">
              <div class="w-40"></div>
            </div>
            <div class="column">
              <span class="field">受益人ID</span>
            </div>
            <div class="column">
              <FormInput type="search" class="w-160" v-model="beneficiaryId" :error="errors.beneficiaryId"></FormInput>
            </div>
          </div>
          <div class="columns">
            <div class="column">
              <span class="field">指定受款人</span>
            </div>
            <div class="column">
              <FormDropdown
                :class="{ 'w-160': true, disabled: payType !== PayType.Remit }"
                :options="acceptOptions"
                v-model="acceptType"
              ></FormDropdown>
            </div>
            <div class="column is-narrow">
              <div class="w-40"></div>
            </div>
            <div class="column">
              <span class="field">與受益人關係</span>
            </div>
            <div class="column">
              <FormDropdown
                :class="{ 'w-160': true, disabled: isWithBeneRpDisabled }"
                :options="withBeneRelationshipOptions"
                v-model="withBeneRelationship"
                :error="errors.withBeneRelationship"
              ></FormDropdown>
            </div>
          </div>
          <div class="columns" v-if="generateAcptField">
            <div class="column">
              <span class="field">受款人姓名</span>
            </div>
            <div class="column">
              <FormInput type="search" class="w-160 font-eudc" v-model="acceptName" :error="errors.acceptName"></FormInput>
            </div>
            <div class="column is-narrow">
              <div class="w-40"></div>
            </div>
            <div class="column">
              <span class="field">受款人ID</span>
            </div>
            <div class="column">
              <FormInput type="search" class="w-160" v-model="acceptId" :error="errors.acceptId"></FormInput>
            </div>
          </div>
          <div class="columns">
            <div class="column">
              <span class="field">受款人法代<br>姓名1</span>
            </div>
            <div class="column">
              <FormInput type="search" class="w-160 font-eudc" v-model="leglAcptName1" :error="errors.leglAcptName1"></FormInput>
            </div>
            <div class="column is-narrow">
              <div class="w-40"></div>
            </div>
            <div class="column">
              <span class="field">受款人法代<br>ID1</span>
            </div>
            <div class="column">
              <FormInput type="search" class="w-160" v-model="leglAcptId1" :error="errors.leglAcptId1"></FormInput>
            </div>
          </div>
          <div class="columns">
            <div class="column">
              <span class="field">受款人法代<br>姓名2</span>
            </div>
            <div class="column">
              <FormInput type="search" class="w-160 font-eudc" v-model="leglAcptName2" :error="errors.leglAcptName2"></FormInput>
            </div>
            <div class="column is-narrow">
              <div class="w-40"></div>
            </div>
            <div class="column">
              <span class="field">受款人法代<br>ID2</span>
            </div>
            <div class="column">
              <FormInput type="search" class="w-160" v-model="leglAcptId2" :error="errors.leglAcptId2"></FormInput>
            </div>
          </div>
          <div class="columns" v-if="isOIU === 'Y'">
            <div class="column is-narrow">
              <div class="w-120">
                <span class="field">受款身分別</span>
              </div>
            </div>
            <div class="column">
              <FormDropdown
                v-model="idType"
                :class="{ 'w-160': true, disabled: payType !== PayType.Remit }"
                :options="idTypeList"
                :error="errors.idType"
              ></FormDropdown>
              </div>
            <div class="column is-narrow">
              <div class="w-40"></div>
            </div>
            <div class="column">
              <span class="field">受款國別</span>
            </div>
            <div class="column" >
              <div>
              <EditableDropdown  
                  v-model="acceptCountry"
                  :editingWidth="165"
                  :options="countryList"
               ></EditableDropdown>
               <FieldErrorMessage v-if="errors.acceptCountry">
                {{ errors.acceptCountry }}
              </FieldErrorMessage>
              </div>
            </div>   
          </div>
          <div class="columns" v-if="isOIU === 'Y'">
            <div class="column is-narrow">
                <div class="w-120">
                  <span class="field">生日</span>
                </div>
              </div>
              <div class="column">
                <DatetimePicker
                  v-model="acceptBirth"
                  :schema="string().required('請輸入出生日期')"
                  :isDatetime="true"
                ></DatetimePicker>
              </div>
          </div>
        </div>
        <div class="part bottom" v-if="payType === PayType.Money">
          <div class="columns">
            <div class="column is-narrow ver-top">
              <div class="w-120">
                <span class="field">給付方式</span>
              </div>
            </div>
            <div class="column">
              <div class="columns is-multiline">
                <div class="column is-full">
                  <span class="field">現金</span>
                </div>
              </div>
            </div>
          </div>
          <div class="columns">
            <div class="column">
              <span class="field">給付單位</span>
            </div>
            <div class="column">
              <FormInput
                type="text"
                class="w-160"
                placeholder="請輸入單位代號"
                v-model="payUnitNo"
                :error="errors.payUnitNo"
                :disabled="isPayUnitDisabled"
              ></FormInput>
            </div>
            <div class="column">
              <div class="w-160">
                <FormCheckbox v-model="divNo">同受理單位</FormCheckbox>
              </div>
            </div>
            <div class="column"></div>
            <div class="column is-narrow">
              <div class="w-40"></div>
            </div>
          </div>
        </div>
        <div class="part bottom" v-else-if="payType === PayType.Remit">
          <div class="columns">
            <div class="column is-narrow ver-top">
              <div class="w-120">
                <span class="field">給付方式</span>
              </div>
            </div>
            <div class="column">
              <div class="columns is-multiline">
                <div class="column is-full">
                  <span class="field">匯撥</span>
                </div>
                <div class="column is-full pt-2" v-if="isOIU !== 'Y'">
                  <FormCheckbox class="m-0" v-model="hasOneAcc">一指通</FormCheckbox>
                  <FormCheckbox v-model="rmtRightNow">即時匯撥</FormCheckbox>
                </div>
              </div>
            </div>
          </div>
          <div class="columns">
            <div class="column is-narrow">
              <div class="w-120">
                <span class="field" v-if="isOIU !== 'Y'">帳戶名稱</span>
                <span class="field" v-else>受款人姓名(英文戶名/中文戶名/ID)</span>
              </div>
            </div>
            <div class="column">
              <FormInput
                type="text"
                class="w-330 font-eudc"
                placeholder="請輸入帳戶名稱"
                v-model="acnm"
                :error="errors.acnm"
                :disabled="isAcnmDisabled"
              ></FormInput>
              <FormCheckbox v-model="rmtModRsn" :disabled="isCathaylife">冠夫姓</FormCheckbox>
            </div>
          </div>
          <div class="columns">
            <div class="column is-narrow">
              <div class="w-120">
                <span class="field" v-if="isOIU !== 'Y'">行庫代號</span>
                <span class="field" v-else>國際銀行代碼</span>
              </div>
            </div>
            <div class="column"  v-if="isOIU !== 'Y'">
              <FormInput
                type="text"
                class="w-330"
                placeholder="請輸入行庫代號"
                v-model="bankNo"
                :error="errors.bankNo"
                :disabled="isAccountAreaDisabled"
              ></FormInput>
              <a href="javascript:void(0)" class="code-query" @click.prevent="onClickSearchFISC">行庫代號查詢</a>
            </div>
            <div class="column" v-else>
              <FormInput
                type="text"
                class="w-330"
                placeholder="請輸入國際銀行代碼"
                v-model="bankNo"
                :error="errors.bankNo"
                :disabled="isAccountAreaDisabled"
              ></FormInput>
              <a href="javascript:void(0)" class="code-query" @click.prevent="onClickSearchFISC">行庫代號查詢</a>
            </div>
          </div>
          <div class="columns" v-if="isOIU === 'Y'">
            <div class="column is-narrow">
              <div class="w-120">
                <span class="field">銀行名稱/分行</span>
              </div>
            </div>
            <div class="column">
              <FormInput
                type="text"
                class="w-330"
                placeholder="請輸入銀行名稱/分行"
                v-model="bankName"
                :error="errors.bankName"
                :disabled="isAccountAreaDisabled"
              ></FormInput>
            </div>
          </div>
          <div class="columns" >
            <div class="column is-narrow">
              <div class="w-120">
                <span class="field">帳號</span>
              </div>
            </div>
            <div class="column">
              <FormInput
                type="text"
                class="w-330"
                placeholder="請輸入帳號"
                v-model="acntNo"
                :error="errors.acntNo"
                :disabled="isAccountAreaDisabled"
                @change="onAcntChange"
              ></FormInput>
            </div>
          </div>
        </div>
        <div class="part bottom" v-else-if="payType === PayType.Cheque">
          <div class="columns">
            <div class="column is-narrow ver-top">
              <div class="w-120">
                <span class="field">給付方式</span>
              </div>
            </div>
            <div class="column">
              <div class="columns is-multiline">
                <div class="column is-full">
                  <span class="field">支票</span>
                </div>
                <div class="column is-full pt-2">
                  <FormCheckbox class="m-0" v-model="isPay3Return">支票寄回理賠科（法扣件用）</FormCheckbox>
                </div>
                <div class="column is-full pt-4">
                  <div class="columns">
                    <div class="column w-144">
                      <FormCheckbox class="m-0" v-model="isUnback">取消禁背</FormCheckbox>
                    </div>
                    <div class="column">
                      <FormInput
                        type="text"
                        class="w-260 font-eudc"
                        placeholder="請輸入原因"
                        v-model="unBackReason"
                        :error="errors.unBackReason"
                      ></FormInput>
                    </div>
                  </div>
                </div>
                <div class="column is-full pt-2">
                  <div class="columns">
                    <div class="column w-144">
                      <FormCheckbox class="m-0" v-model="isCancelLine">取消平行線</FormCheckbox>
                    </div>
                    <div class="column">
                      <FormInput
                        type="text"
                        class="w-260 font-eudc"
                        placeholder="請輸入原因"
                        v-model="cancelLineReason"
                        :error="errors.cancelLineReason"
                      ></FormInput>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="columns">
            <div class="column is-narrow">
              <div class="w-265">
                <span class="field">票據記載事項變更申請書編號</span>
              </div>
            </div>
            <div class="column">
              <FormInput
                type="text"
                class="w-160"
                placeholder="請輸入"
                v-model="applySerialNo"
                :disabled="isApplySerialNoDisabled"
                :error="errors.applySerialNo"
                maxlength="12"
                @change="onApplySerialNoChange"
                @input="isFetching = true"
              ></FormInput>
            </div>
          </div>
        </div>
        <div v-else>
          <p class="has-text-danger has-text-centered mt-2">給付方式(PayType)錯誤，需為匯撥(5)、現金(2)、支票(3)其中一種</p>
        </div>
      </form>
    </template>
    <template v-slot:buttons>
      <button class="button is-light" @click="props.close">取消</button>
      <button class="button is-primary" :disabled="isFetching" @click.prevent="onSubmit">儲存</button>
    </template>
  </Modal>
</template>
<script setup>
  import Modal from '~/components/Modal.vue';
  import { PayType } from '~/common/utils/enum';
  import { useField, useForm } from 'vee-validate';
  import { object, string, number, boolean, ref } from 'yup';
  import FormInput from '~/components/Form/FormInput.vue';
  import { useOverviewStore } from '~/stores/overview';
  import useSwal from '~/composables/useSwal';
  import FormDropdown from '~/components/Form/FormDropdown.vue';
  import FormCheckbox from '~/components/Form/FormCheckbox.vue';
  import { nextTick, shallowRef } from 'vue';
  import { isEmpty } from 'lodash-es';
  import { apiGetIdTypeList } from '~/common/api';
  import { useApplyStore } from '~/stores/apply';
  import EditableDropdown from '~/components/Editable/EditableDropdown.vue';
  import FieldErrorMessage from '~/components/Form/FieldErrorMessage.vue';
  import DatetimePicker from '~/components/DatetimePicker.vue';
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
  const applyStore = useApplyStore();
  const overviewStore = useOverviewStore();
  const { $swal } = useSwal();
  const mode = props.data?.mode;
  const isAddMode = mode === 'ADD';
  const isEditMode = mode === 'EDIT';

  // 標題
  const modalTitle = (mode === 'ADD' ? '新增' : '編輯') + '受益人';
  // 目前的給付方式
  const payType = toRef(props.data, 'payType');
  // 目前編輯的受益人資料(編輯時才有資料，否則為null)
  const editingBeneficiary = props.data?.editingBeneficiary;
  console.log(payType.value);
  console.log('editingBeneficiary',editingBeneficiary);
  const isFetching = shallowRef(false);

  // 判斷是否為OIU件
  const isOIU = overviewStore.basicData.IS_OIU
  // API取得身分別
  const getIdTypeList = await apiGetIdTypeList();
  // 重構身分別
  const setIdTypeList = async () => {
    let places = getIdTypeList.data.result.idTypeList;
    let areas = places
      .map((m) => ({
        name: m.ID_TYPE_TEXT,
        value: m.ID_TYPE
      }));
    return areas;  
  };
  const idTypeList = await setIdTypeList();
 
  // 取得國籍下拉選單
  const getCountryOptions = async () => {
    let places = await applyStore.getCountryOptions();
    let areas = places
      .map((m) => ({
        name: m.COUNTRY_CODE +'/' +m.COUNTRY_CH,
        value: m.COUNTRY_CODE
      }));

    return areas;  
  };
  const countryList = await getCountryOptions();

  // 行庫代碼規則與國際銀行代碼區別
  const getBankNoSchema = async () => {
    let tempSchema ='';
    if(isOIU === 'Y'){
      tempSchema = 
      string().test(
          'bankNo-required',
          '國際銀行代碼須為8碼或11碼',
          (value) => !(value.length!=8 && value.length!=11))
          .matches( /^[0-9a-zA-Z-]+$/, '國際銀行代碼需為半形英文或數字')
          .required('請輸入國際銀行代碼') 
    } else {
      tempSchema = 
      string()
          .matches(/^[0-9]*$/, '只能為數字')
          .max(7, '最多7碼數字')
          .when('withBeneRelationship', {
            is: (withBeneRelationship) => withBeneRelationship !== '國泰人壽',
            then: string().required('請輸入行庫代號')})
    }
    return tempSchema;  
  };
  const bankNoSchema = await getBankNoSchema();

  // 銀行名稱OIU件區別
  const getBankNameSchema = async () => {
    let tempSchema ='';
    if(isOIU === 'Y'){
      tempSchema = 
      string()
          .required('請輸入銀行名稱/分行')
          .matches(/^[a-zA-Z0-9 ,]*$/, '銀行名稱需為半形英文或數字或要半形空白跟英文逗號')
    } 
    return tempSchema;  
  };
  const bankNameSchema = await getBankNameSchema();
  //#region 下拉選單選項
  const acceptOptions = reactive([
    {
      name: '同受益人',
      value: '同受益人'
    },
    {
      name: '新增',
      value: '新增'
    }
  ]);
  const withBeneRelationshipOptions = reactive([
    {
      name: '本人',
      value: '本人'
    },
    {
      name: '法定代理人',
      value: '法定代理人'
    },
    {
      name: '國泰人壽',
      value: '國泰人壽'
    }
  ]);
  // 新增受益人 團險件 且 給付狀態為匯撥時，與受益人關係下拉選單增加『眷屬指定員工』
  if (overviewStore.isGroupInsurance && payType.value === PayType.Remit) {
    withBeneRelationshipOptions.push({
      name: '眷屬指定員工',
      value: '眷屬指定員工'
    });

    withBeneRelationshipOptions.push({
      name: '債權轉讓',
      value: '債權轉讓'
    });
  }
  //#endregion

  // 行庫代號查詢
  const onClickSearchFISC = async () => {
    let link = await overviewStore.getFISCLink();
    if (link != '') {
      window.open(link);
    } else {
      $swal.fail('取得行庫代號連結失敗');
    }
  };

  //#region 表單相關
  // 驗證規則
  const generateSchema = () => {
    const baseSchema = {
      beneficiaryName: string().required('請輸入姓名').max(70, '最多70字'),
      beneficiaryId: string()
        .required('請輸入ID')
        .matches(/^\S*$/, '不得輸入空白鍵'),
      acceptType: string().required('請選擇受款人'),
      withBeneRelationship: string().required('請選擇與受益人關係'),
      leglAcptId1: string().nullable().when(['leglAplyAcptId1', 'leglAplyAcptName1'], {
          is: (leglAplyAcptId1, leglAplyAcptName1) =>
            !isEmpty(leglAplyAcptId1) && !isEmpty(leglAplyAcptName1),
          then: string().required('請填受款人法代ID')
        }),
      leglAcptName1: string().nullable().when(['leglAplyAcptId1', 'leglAplyAcptName1'], {
          is: (leglAplyAcptId1, leglAplyAcptName1) =>
            !isEmpty(leglAplyAcptId1) && !isEmpty(leglAplyAcptName1),
          then: string().required('請填受款人法代姓名')
        }),
      leglAcptId2: string().nullable().when(['leglAplyAcptId2', 'leglAplyAcptName2'], {
          is: (leglAplyAcptId2, leglAplyAcptName2) =>
            !isEmpty(leglAplyAcptId2) && !isEmpty(leglAplyAcptName2),
          then: string().required('請填受款人法代ID')
        }),
      leglAcptName2: string().nullable().when(['leglAplyAcptId2', 'leglAplyAcptName2'], {
          is: (leglAplyAcptId2, leglAplyAcptName2) =>
            !isEmpty(leglAplyAcptId2) && !isEmpty(leglAplyAcptName2),
          then: string().required('請填受款人姓名')
        }),
      idType: string().nullable().when('isOIU', {
          is: (isOIU) => isOIU === 'Y',
          then: string().required('請輸入受款身分別')
        }),
      acceptCountry: string().nullable().when('isOIU', {
          is: (isOIU) => isOIU === 'Y',
          then: string().required('請選擇受款國別')
        }),
    };
    const moneySchema = {
      payUnitNo: string()
        .required('請輸入單位代號')
        .matches(/^[a-zA-Z0-9]{7}$/, '只能為7碼英/數字')
    };
    const remitSchema = {
      hasOneAcc: boolean().required(),
      rmtRightNow: boolean().required(),
      rmtModRsn: boolean().required(),
      acnm: string()
        .max(70, '最多70字')
        .when('withBeneRelationship', {
          is: (withBeneRelationship) => withBeneRelationship !== '國泰人壽',
          then: string().required('請輸入帳戶名稱')
        }),
      // OIU 件區需做區別
      bankNo:bankNoSchema,
      // .matches(/^[a-zA-Z0-9]{7}$/, '只能為7碼英/數字'),
      acntNo: string()
        .matches(/^[0-9]*$/, '只能為數字')
        .max(16, '最多16碼數字')
        .when('withBeneRelationship', {
          is: (withBeneRelationship) => withBeneRelationship !== '國泰人壽',
          then: string().required('請輸入帳號')
        }),
      bankName:bankNameSchema,
      acceptId: string()
        .when(['acceptType', 'withBeneRelationship'], {
          is: (acceptType, withBeneRelationship) =>
            acceptType === '新增' && (withBeneRelationship === '法定代理人' || withBeneRelationship === '眷屬指定員工'),
          then: string()
            .required('請填寫ID')
            .notOneOf([ref('beneficiaryId')], '不能和受益人ID相同')
        })
        .matches(/^\S*$/, '不得輸入空白鍵'),
      acceptName: string().when(['acceptType', 'withBeneRelationship'], {
        is: (acceptType, withBeneRelationship) =>
          acceptType === '新增' && (withBeneRelationship === '法定代理人' || withBeneRelationship === '眷屬指定員工'),
        then: string().required('請填寫姓名')
      })
    };

    const chequeSchema = {
      isPay3Return: boolean().required(),
      isUnback: boolean().required(),
      unBackReason: string()
        .nullable()
        .when('isUnback', {
          is: true,
          then: string().nullable().required('請填寫原因')
        })
        .max(40, '最多40字'),
      isCancelLine: boolean().required(),
      cancelLineReason: string()
        .nullable()
        .when('isCancelLine', {
          is: true,
          then: string().nullable().required('請填寫原因')
        })
        .max(40, '最多40字'),
      applySerialNo: string()
        .nullable()
        .when(['isUnback', 'isCancelLine'], {
          is: (isUnback, isCancelLine) => isUnback || isCancelLine,
          then: string().nullable().required('請填寫申請書編號')
        })
        .matches(/^[a-zA-Z0-9]*$/, '只能為英文或數字')
        .max(12, '最多12碼英/數字')
    };
    let validationSchema = {};
    switch (payType.value) {
      case PayType.Money:
        validationSchema = {
          ...baseSchema,
          ...moneySchema
        };
        break;
      case PayType.Remit:
        validationSchema = {
          ...baseSchema,
          ...remitSchema
        };
        break;
      case PayType.Cheque:
        validationSchema = {
          ...baseSchema,
          ...chequeSchema
        };
        break;
      default:
        break;
    }
    
    return validationSchema;
  };

  // 新增預設值
  let initialValues = {
    acceptType: '同受益人',
    payUnitNo: '',
    divNo: false,
    withBeneRelationship: '本人',
    isPay3Return: false,
    isUnback: false,
    isCancelLine: false,
    unBackReason: '',
    cancelLineReason: '',
    applySerialNo: '',
    hasOneAcc: false,
    rmtRightNow: false,
    rmtModRsn: false,
    acnm: '',
    bankNo: '',
    acntNo: '',
    idType:'',//OIU
    acceptBirth:'',//OIU
    acceptCountry:'',//OIU
    bankName:'',//OIU
    isOIU:overviewStore.basicData.IS_OIU
  };
  // 編輯時要把值帶進來
  if (isEditMode) {
    
    let leglSize = editingBeneficiary.LEGL_ACPT_LIST.length;
    let leglData1 = leglSize > 0 ? editingBeneficiary.LEGL_ACPT_LIST[0]:{};
    let leglData2 = leglSize > 1 ? editingBeneficiary.LEGL_ACPT_LIST[1]:{};

    initialValues = {
      acceptType: editingBeneficiary.BENE_ID === editingBeneficiary.ACPT_ID ? '同受益人' : '新增',
      beneficiaryName: editingBeneficiary.BENE_NAME,
      beneficiaryId: editingBeneficiary.BENE_ID,
      leglAcptName1: !isEmpty(leglData1.CFM_LEGL_NAME) ? leglData1.CFM_LEGL_NAME: leglData1.APLY_LEGL_NAME,
      leglAplyAcptName1: leglData1.APLY_LEGL_NAME,
      leglAcptId1: !isEmpty(leglData1.CFM_LEGL_ID) ? leglData1.CFM_LEGL_ID: leglData1.APLY_LEGL_ID,
      leglAplyAcptId1: leglData1.APLY_LEGL_ID,
      leglSerNo1: leglData1.LEGL_SER_NO,
      leglAcptName2: !isEmpty(leglData2.CFM_LEGL_NAME) ? leglData2.CFM_LEGL_NAME: leglData2.APLY_LEGL_NAME,
      leglAplyAcptName2: leglData2.APLY_LEGL_NAME,
      leglAcptId2: !isEmpty(leglData2.CFM_LEGL_ID) ? leglData2.CFM_LEGL_ID: leglData2.APLY_LEGL_ID,
      leglAplyAcptId2: leglData2.APLY_LEGL_ID,
      leglSerNo2: leglData2.LEGL_SER_NO,
      payUnitNo: editingBeneficiary.PAY_UNIT,
      divNo: editingBeneficiary.APLY_DIV_NO === editingBeneficiary.PAY_UNIT,
      withBeneRelationship: editingBeneficiary.ACPT_RLAT.includes('法定') ? '法定代理人' : editingBeneficiary.ACPT_RLAT,
      isPay3Return: editingBeneficiary.IS_PAY3_RTN === 'Y',
      isUnback: editingBeneficiary.UN_BACK_IDX === 'Y',
      unBackReason: editingBeneficiary.UN_BACK_CTX_TEXT,
      isCancelLine: editingBeneficiary.CNCL_LINE_IDX === 'Y',
      cancelLineReason: editingBeneficiary.CNCL_LINE_CTX_TEXT,
      applySerialNo: editingBeneficiary.APLY_SER_NO,
      hasOneAcc: editingBeneficiary.ONE_ACC === 'Y',
      rmtRightNow: editingBeneficiary.RMT_RIGHT_NOW === 'Y',
      rmtModRsn: editingBeneficiary.RMT_MOD_RSN === 'Y',
      acnm: editingBeneficiary.ACNM,
      bankNo: editingBeneficiary.BANK_NO,
      bankName: editingBeneficiary.BANK_NAME,
      acntNo: editingBeneficiary.ACNT_NO,
      acceptName: editingBeneficiary.ACPT_NAME,
      acceptId: editingBeneficiary.ACPT_ID,
      idType:editingBeneficiary.ID_TYPE,
      acceptBirth:editingBeneficiary.ACPT_BIRTH,
      acceptCountry:editingBeneficiary.ACPT_COUNTRY,
      isOIU:overviewStore.basicData.IS_OIU
    };
  }

  //! userForm must above useField
  const { handleSubmit, errors, setFieldError } = useForm({
    validationSchema: object(generateSchema()),
    validateOnMount: isEditMode,
    initialValues
  });

  // 欄位
  // 受益人姓名
  const { value: beneficiaryName } = useField('beneficiaryName');
  // 受益人ID
  const { value: beneficiaryId } = useField('beneficiaryId');
  // 受款人法代姓名1
  const { value: leglAcptName1 } = useField('leglAcptName1');
  const { value: leglAplyAcptName1 } = useField('leglAplyAcptName1');
  // 受款人法代ID1
  const { value: leglAcptId1 } = useField('leglAcptId1');
  const { value: leglAplyAcptId1 } = useField('leglAplyAcptId1');
  // 受款人法代SER_NO1
  const { value: leglSerNo1 } = useField('leglSerNo1');
  // 受款人法代姓名2
  const { value: leglAcptName2 } = useField('leglAcptName2');
  const { value: leglAplyAcptName2 } = useField('leglAplyAcptName2');
  // 受款人法代ID2
  const { value: leglAcptId2 } = useField('leglAcptId2');
  const { value: leglAplyAcptId2 } = useField('leglAplyAcptId2');
  // 受款人法代SER_NO2
  const { value: leglSerNo2 } = useField('leglSerNo2');
  
  // 給付單位(現金)
  const { value: payUnitNo } = useField('payUnitNo');
  // 同受理單位勾選(現金)
  const { value: divNo } = useField('divNo');
  // 指定受款人- 同受益人、新增
  const { value: acceptType } = useField('acceptType');
  // 與受益人關係- 本人、法定代理人、國泰人壽
  const { value: withBeneRelationship } = useField('withBeneRelationship');
  // 支票寄回理賠科(支票)
  const { value: isPay3Return } = useField('isPay3Return');
  // 取消禁背(支票)
  const { value: isUnback } = useField('isUnback');
  // 取消禁背原因(支票)
  const { value: unBackReason } = useField('unBackReason');
  // 取消平行線(支票)
  const { value: isCancelLine } = useField('isCancelLine');
  // 取消平行線原因(支票)
  const { value: cancelLineReason } = useField('cancelLineReason');
  // 票據記載事項變更申請書編號(支票)
  const { value: applySerialNo } = useField('applySerialNo');
  // 一指通(匯撥)
  const { value: hasOneAcc } = useField('hasOneAcc');
  // 即時匯撥(匯撥)
  const { value: rmtRightNow } = useField('rmtRightNow');
  // 冠夫姓(匯撥)
  const { value: rmtModRsn } = useField('rmtModRsn');
  // 帳戶名稱(匯撥)
  const { value: acnm } = useField('acnm');
  // 行庫代號(匯撥)
  const { value: bankNo } = useField('bankNo');
  // 銀行名稱
  const { value: bankName } = useField('bankName');
  // 銀行帳號(匯撥)
  const { value: acntNo, handleChange: handleAcntChange } = useField('acntNo');
  // 新增受款人姓名(匯撥)
  const { value: acceptName } = useField('acceptName');
  // 新增受款人ID
  const { value: acceptId } = useField('acceptId');
  // OIU 受款身分別
  const { value: idType } = useField('idType');
  // OIU 生日
  const { value: acceptBirth } = useField('acceptBirth');
  // OIU 受款國別
  const { value: acceptCountry } = useField('acceptCountry');
  //#region 欄位連動監聽
  // 同受理單位時，給付單位不能編輯
  const isPayUnitDisabled = computed(() => divNo.value);
  // 支票的申請書編號是否diabled
  const isApplySerialNoDisabled = computed(() => !isUnback.value && !isCancelLine.value);
  // 預設不勾選冠夫姓。勾選冠夫姓欄位，使⽤者才可以編輯「帳⼾名稱」欄位。
  const isAcnmDisabled = computed(() => !rmtModRsn.value && !isCathaylife.value);
  // 指定受款人為同受益人時，與受益人關係為本人並反灰
  const isWithBeneRpDisabled = computed(() => acceptType.value === '同受益人');
  // 指定受款人為新增，與受益人關係為法定代理人時產生受款人姓名、ID欄位
  const generateAcptField = computed(
    () =>
      acceptType.value === '新增' &&
      (withBeneRelationship.value === '法定代理人' || withBeneRelationship.value === '眷屬指定員工' || withBeneRelationship.value === '債權轉讓')
  );
  // 目前是否選國泰人壽
  const isCathaylife = computed(() => withBeneRelationship.value === '國泰人壽');
  // 帳號區塊內的欄位是否不能編輯(勾選一指通或選擇國泰人壽時不可編輯) 0822 => 選擇國泰人壽要可編輯
  const isAccountAreaDisabled = computed(() => hasOneAcc.value && (isOIU !== 'Y'));
  watchEffect(async () => {
    if (isPayUnitDisabled.value) payUnitNo.value = overviewStore.basicData.APLY_DIV_NO;
    if (isApplySerialNoDisabled.value) applySerialNo.value = '';
    if (!isUnback.value) unBackReason.value = '';
    if (!isCancelLine.value) cancelLineReason.value = '';
    if (isWithBeneRpDisabled.value) withBeneRelationship.value = '本人';

    if (acceptType.value === '新增') {
      if (withBeneRelationship.value === '本人') {
        withBeneRelationship.value = '法定代理人';
        withBeneRelationshipOptions[0].disabled = true;
      }

      // 冠夫姓沒勾時，名稱和受款人姓名同步(有新增受款人)
      else if (
        (withBeneRelationship.value === '法定代理人' || withBeneRelationship.value === '眷屬指定員工' || withBeneRelationship.value === '債權轉讓') &&
        isAcnmDisabled.value
      ) {
        acnm.value = acceptName.value;
      } else if (isCathaylife.value) {
        rmtModRsn.value = false;
        acnm.value = '國泰人壽保險公司';
      }
    }
    // debugger;
    // 冠夫姓沒勾時，名稱和受款人姓名同步(同受益人)
    if (acceptType.value === '同受益人' && isAcnmDisabled.value) {
      acnm.value = beneficiaryName.value ?? '';
    }
    // 一指通和國泰人壽不能同時選
    if (hasOneAcc.value && withBeneRelationship.value === '國泰人壽') {
      $swal.warning('一指通和國泰人壽只能擇一');
      await nextTick();
      // 把一指通勾掉
      hasOneAcc.value = false;
      bankNo.value = '';
      acntNo.value = '';
    }

    // 支票寄回理賠科 取消禁背 取消平行線前端卡控
    if (isUnback.value && isCancelLine.value) {
      $swal.warning('取消禁背和取消平行線不能同時勾選');
      await nextTick();
      // 把取消平行線勾掉
      isCancelLine.value = false;
    }

    // ID自動轉大寫
    beneficiaryId.value = beneficiaryId.value?.toUpperCase();
    acceptId.value = acceptId.value?.toUpperCase();
  });

  // 一指通邏輯
  watch(hasOneAcc, async (newValue, oldValue) => {
    console.log(newValue);
    // 一指通和國泰人壽不能同時選
    if (newValue && withBeneRelationship.value !== '國泰人壽') {
      // 呼叫一指通API
      let queryAccId = withBeneRelationship.value === '本人' ? beneficiaryId.value : acceptId.value;
      let queryCountryCode = acceptCountry.value;
      await nextTick();

      if(isOIU === 'Y') {
        if (!isEmpty(queryAccId) && !isEmpty(queryCountryCode)) {
          const oneAcc = await overviewStore.getOiuOneAccount(queryAccId, queryCountryCode);

          if (oneAcc.IS_SUCCESS) {
            bankNo.value = oneAcc.SWIFT_CODE;
            acntNo.value = oneAcc.ACNT_NO;
            bankName.value = oneAcc.BANK_NAME;
          } else {
            $swal.fail(oneAcc.RTN_MSG);
            // 把一指通勾掉
            hasOneAcc.value = false;
          }
        } else {
          let warningMsg = '';
          let wording = withBeneRelationship.value === '本人' ? '益' : '款';

          if(isEmpty(queryAccId)) {
            warningMsg = `請先填寫受${wording}人ID和受${wording}人姓名\n`;;
          }

          if(isEmpty(queryCountryCode)) {
            warningMsg += '請先填寫受款國別';
          }

          $swal.fail(warningMsg);
          // 把一指通勾掉
          hasOneAcc.value = false;
        }
      } else {
        if (!isEmpty(queryAccId)) {
          const oneAcc = await overviewStore.getOneAccount(queryAccId);

          if (oneAcc.IS_SUCCESS) {
            // acnm.value = beneficiaryName.value;
            bankNo.value = oneAcc.ONE_ACC_BANK_NO;
            acntNo.value = oneAcc.ONE_ACC_ACNT_NO;
          } else {
            $swal.fail(oneAcc.RTN_MSG);
            // 把一指通勾掉
            hasOneAcc.value = false;
          }
        } else {
          let wording = withBeneRelationship.value === '本人' ? '益' : '款';
          $swal.fail(`請先填寫受${wording}人ID和受${wording}人姓名`);
          // 把一指通勾掉
          hasOneAcc.value = false;
        }
      }
    }
  });

  // 20200820 帳號輸入游標移開後前面補0，補足16位
  const onAcntChange = () => {
    handleAcntChange(acntNo.value.padStart(16, '0'));
  };

  //#endregion

  // 20221219取得支票訊息
  const onApplySerialNoChange = async () => {
    // console.log(applySerialNo.value);

    try {
      // overviewStore.showLoading();
      let chequeReasonData = await overviewStore.getResnNoAndName(applySerialNo.value);
      // 取消禁背
      if (chequeReasonData.ITEM === '1') {
        // 兩個不能同時勾
        if (chequeReasonData.UN_BACK_IDX === 'Y' && isCancelLine.value) {
          isCancelLine.value = false;
        }
        isUnback.value = chequeReasonData.UN_BACK_IDX === 'Y';
        unBackReason.value = chequeReasonData.UN_BACK_CTX_TEXT;
      }
      // 取消平行線
      else if (chequeReasonData.ITEM === '4') {
        if (chequeReasonData.CNCL_LINE_IDX === 'Y' && isUnback.value) {
          isUnback.value = false;
        }
        isCancelLine.value = chequeReasonData.CNCL_LINE_IDX === 'Y';
        cancelLineReason.value = chequeReasonData.CNCL_LINE_CTX_TEXT;
      } else {
        throw 'getResnNoAndName ITEM error';
      }
    } catch (e) {
      console.error(e);
      $swal.fail(e);
    } finally {
      isFetching.value = false;
    }
  };

  // 送出表單
  const onSubmit = handleSubmit(async (values, actions) => {
    // alert(JSON.stringify(values, null, 2));
    const instance = {};
    // 受益人ID
    instance.BENE_ID = values.beneficiaryId;
    // 受益人姓名
    instance.BENE_NAME = values.beneficiaryName;

    let leglAcptList = [];

    let leglAcpt1 = { 
      javaClass: 'java.util.Map',
      LEGL_ACPT_NAME: values.leglAcptName1,
      LEGL_ACPT_ID: values.leglAcptId1,
      LEGL_APLY_ACPT_NAME: values.leglAplyAcptName1,
      LEGL_APLY_ACPT_ID: values.leglAplyAcptId1,
      LEGL_SER_NO: values.leglSerNo1
    };

    let leglAcpt2 = { 
      javaClass: 'java.util.Map',
      LEGL_ACPT_NAME: values.leglAcptName2,
      LEGL_ACPT_ID: values.leglAcptId2,
      LEGL_APLY_ACPT_NAME: values.leglAplyAcptName2,
      LEGL_APLY_ACPT_ID: values.leglAplyAcptId2,
      LEGL_SER_NO: values.leglSerNo2
    };

    leglAcptList.push(leglAcpt1);
    leglAcptList.push(leglAcpt2);

    // 受款人法代
    instance.LEGL_ACPT_LIST = leglAcptList;

    // 預設受款人都先放本人
    // 受款人姓名
    instance.ACPT_NAME = values.beneficiaryName;
    // 受款人ID
    instance.ACPT_ID = values.beneficiaryId;

    // 與受益人關係
    instance.ACPT_RLAT = values.withBeneRelationship;
    // alert(withBeneRelationshipOptions.find((option) => option.selected).name);
    // return;

    // 給付方式
    instance.PAY_TYPE = payType.value;

    // 0822新增 原始ID
    instance.ORI_BENE_ID = isAddMode ? values.beneficiaryId : editingBeneficiary.ORI_BENE_ID;

    // OIU 件 ID_TYPE ACPT_BIRTH ACPT_COUNTRY ACPT_EN_NAME
    if(isOIU === 'Y'){
      instance.ID_TYPE = values.idType;
      instance.ACPT_BIRTH = values.acceptBirth;
      instance.ACPT_COUNTRY = values.acceptCountry;
      instance.BANK_NAME = values.bankName;
    }

    switch (payType.value) {
      case PayType.Money:
        instance.ACPT_NAME = values.beneficiaryName;
        instance.ACPT_ID = values.beneficiaryId;
        instance.ACPT_RLAT = isAddMode ? '本人' : editingBeneficiary.ACPT_RLAT;
        instance.PAY_DESC = '現金';
        instance.PAY_UNIT = values.payUnitNo;
        instance.APLY_DIV_NO = overviewStore.basicData.APLY_DIV_NO;
        break;
      case PayType.Remit:
        instance.PAY_DESC = '匯撥';
        instance.ONE_ACC = values.hasOneAcc ? 'Y' : 'N';
        instance.RMT_RIGHT_NOW = values.rmtRightNow ? 'Y' : 'N';
        instance.RMT_MOD_RSN = values.rmtModRsn ? 'Y' : 'N';
        instance.BANK_NO = values.bankNo;
        instance.ACNT_NO = values.acntNo;        
        instance.ACNM = values.acnm;
        // 受款人如果不是本人，要覆寫
        if (values.acceptType === '新增') {
          if (withBeneRelationship.value === '國泰人壽') {
            //* 如果為國泰人壽帶空白
            // 受款人姓名
            instance.ACPT_NAME = '';
            // 受款人ID
            instance.ACPT_ID = '03374707';
          } else if (withBeneRelationship.value === '法定代理人' || withBeneRelationship.value === '眷屬指定員工' || withBeneRelationship.value === '債權轉讓') {
            // 受款人姓名
            instance.ACPT_NAME = values.acceptName;
            // 受款人ID
            instance.ACPT_ID = values.acceptId;
          }
        }

        break;
      case PayType.Cheque:
        instance.PAY_DESC = '支票';
        instance.IS_PAY3_RTN = values.isPay3Return ? 'Y' : 'N';
        instance.UN_BACK_IDX = values.isUnback ? 'Y' : 'N';
        instance.UN_BACK_CTX_TEXT = values.unBackReason;
        instance.CNCL_LINE_IDX = values.isCancelLine ? 'Y' : 'N';
        instance.CNCL_LINE_CTX_TEXT = values.cancelLineReason;
        instance.APLY_SER_NO = values.applySerialNo;
        break;
      default:
        break;
    }
    try {
      overviewStore.showLoading();
      // 呼叫API取得與受益人關係和風險資料
      let indicator = await overviewStore.getIndicator(instance.ACPT_ID, instance.ACPT_NAME);
      // instance.ACPT_RLAT = indicator.ACPT_RLAT; //TODO: 因為關係別是使用者自己選的，暫時先不放，等有問題再說
      instance.FATCA_FLAG = indicator.FATCA_FLAG;
      instance.CRS_FLAG = indicator.CRS_FLAG;
      instance.RISK_LEVEL = indicator.RISK_LEVEL;

      let result = isAddMode
        ? await overviewStore.addBeneficiary(instance, props.data?.applyNo)
        : await overviewStore.editBeneficiary(editingBeneficiary, instance, props.data?.applyNo);

      // 儲存成功
      if (result) {
        if (!isAddMode && editingBeneficiary.PAY_TYPE_CHANGE) {
          // 編輯成功移除驚嘆號
          editingBeneficiary.PAY_TYPE_CHANGE = false;
        }
        // 都成功就呼叫API Reload Data
        await overviewStore.reloadBeneficiaryData(props.data?.applyNo);

        let defaultMessage = isAddMode ? '已加入受益人清單' : '修改成功';

        $swal.success(result.message ? result.message : defaultMessage);

        // 提供儲存後的Callback function
        if (props.data?.saveCallback && typeof props.data.saveCallback === 'function')
          props.data.saveCallback(isAddMode ? instance : editingBeneficiary);
        props.close();
      }
    } catch (e) {
      $swal.fail(e);
    } finally {
      overviewStore.hideLoading();
    }
  });

  //#endregion
</script>

<style lang="scss">

  .datetimepicker {
    position: absolute !important;
  }

</style>
