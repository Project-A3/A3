<template>
  <div class="card is-full sixth-card" id="ApplySixthCard" v-if="isShowInKindPayArea">
    <!-- 展開/收合 Button -->
    <button class="card-toggle-btn"></button>

    <h2>實物給付</h2>

    <div class="part border-none">
      <div class="columns has-flex-column">
        <div class="column is-one-quarter">
          <EditableCheckbox v-model="checkedPayCatA"></EditableCheckbox>
          <span class="field ml-12">實物服務</span>
          <ErrorTippy v-if="checkedPayCatA === 'Y' & checkedPayCatB === 'Y'" :errors="['實物服務及未支付餘額只能擇一選擇']"></ErrorTippy>
        </div>
      </div>
      <div class="columns has-flex-column">
      <GroupEditable>
        <div class="column is-3">
          <span class="field">服務廠商</span>
          <EditableDropdown
            v-model="inKindPayData.UNI_CODE"
            :editingWidth="180"
            :options="getUniCodeOptions"
            :disabled="checkedPayCatA === 'N'"
            :schema="
              string()
                .nullable()
                .test('required', '請選擇服務廠商', (value) => !(checkedPayCatA === 'Y' && isEmpty(value)))
            "
          ></EditableDropdown>
        </div>
        <div class="column is-3">
          <span class="field">服務類型</span>
          <EditableDropdown
            v-model="inKindPayData.VENDOR_TYPE"
            :editingWidth="180"
            :watchValue="inKindPayData.UNI_CODE"
            :onRefreshOptions="getVendorTypeOptions"
            :options="getVendorTypeOptions"
            :disabled="checkedPayCatA === 'N'"
            :schema="
              string()
                .nullable()
                .test('required', '請選擇服務類型', (value) => !(checkedPayCatA === 'Y' && isEmpty(value)))
            "
          ></EditableDropdown>
        </div>
        <div class="column is-3">
          <span class="field">給付項目</span>
          <EditableDropdown
            v-model="inKindPayData.PAY_ITEM"
            :editingWidth="180"
            :watchValue="inKindPayData.VENDOR_TYPE"
            :onRefreshOptions="getPayItemOptions"
            :options="getPayItemOptions"
            :disabled="checkedPayCatA === 'N'"
            :schema="
              string()
                .nullable()
                .test('required', '請選擇給付項目', (value) => !(checkedPayCatA === 'Y' && isEmpty(value)))
            "
          ></EditableDropdown>
        </div>
      </GroupEditable>
      </div>
      <div class="columns has-flex-column">
        <div class="column">
          <EditableCheckbox v-model="checkedPayCatB"></EditableCheckbox>
          <span class="field ml-12">未支付餘額</span>
          <ErrorTippy v-if="checkedPayCatA === 'Y' & checkedPayCatB === 'Y'" :errors="['實物服務及未支付餘額只能擇一選擇']"></ErrorTippy>
        </div>
      </div>
      <div class="columns has-flex-column">
        <div class="column">
          <EditableCheckbox v-model="checkedPayCatC"></EditableCheckbox>
          <span class="field ml-12">補償金</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
  import EditableDropdown from '~/components/Editable/EditableDropdown.vue';
  import GroupEditable from '~/components/Editable/GroupEditable.vue';
  import EditableCheckbox from '~/components/Editable/EditableCheckbox.vue';
  import { useApplyStore } from '~/stores/apply';
  import { storeToRefs } from 'pinia';
  import useSwal from '~/composables/useSwal';
  import ErrorTippy from '~/components/Editable/ErrorTippy.vue';
  import { isEmpty } from 'lodash-es';
  import { string } from 'yup';

  const applyStore = useApplyStore();
  const { isShowInKindPayArea } = storeToRefs(applyStore);
  const { $swal } = useSwal();

  const props = defineProps({
    inKindPayData: {
      type: Object,
      required: true,
      default: {}
    }
  });
  
  const inKindPayData = toRef(props, 'inKindPayData');
  const checkedPayCats = ref(inKindPayData.value.PAY_CAT.split('_').filter((item) => item));
  const checkedPayCatA = ref(checkedPayCats.value.includes('A')?'Y':'N');
  const checkedPayCatB = ref(checkedPayCats.value.includes('B')?'Y':'N');
  const checkedPayCatC = ref(checkedPayCats.value.includes('C')?'Y':'N');
  
  // 設定pay_cat FOR儲存格式
  watch([checkedPayCatA, checkedPayCatB, checkedPayCatC], ([payCatA, payCatB, payCatC], [prevPayCatA, prevPayCatB, prevPayCatC]) => {
    let payCat = [];
    if(payCatA == 'Y'){
      payCat.push('A');
    }
    if(payCatB == 'Y'){
      payCat.push('B');
    }
    if(payCatC == 'Y'){
      payCat.push('C');
    }
    inKindPayData.value.PAY_CAT = payCat.join('_');

    // 實物服務checkbox取消，選項初始化
    if(payCatA == 'N' & payCatA != prevPayCatA){
      inKindPayData.value.UNI_CODE = '';
    }

  })

  const IN_KIND_LEVEL_1 = await applyStore.getInKindPaymentList();

  // 檢核
  watch([()=>inKindPayData.value.UNI_CODE, ()=>inKindPayData.value.VENDOR_TYPE, ()=>inKindPayData.value.PAY_ITEM], ([uniCode, vendorType, payItem], [pUniCode, pVendorType, pPayItem]) => {
    // console.log('uniCode[',uniCode,'][',pUniCode,']');
    // console.log('vendorType[',vendorType,'][',pVendorType,']');
    // console.log('payItem[',payItem,'][',pPayItem,']');

    let IN_KIND_LEVEL_2 = IN_KIND_LEVEL_1
      .filter((e) => e.UNI_CODE === uniCode & e.IN_KIND_LEVEL_2 !== undefined)
      .map((m) => m.IN_KIND_LEVEL_2).flat();

    let IN_KIND_LEVEL_3 = IN_KIND_LEVEL_2
      .filter((e) => e.VENDOR_TYPE === vendorType & e.IN_KIND_LEVEL_3 !== undefined)
      .map((m) => m.IN_KIND_LEVEL_3).flat();

    let existInLevel1 = IN_KIND_LEVEL_1.filter((e) => e.UNI_CODE === uniCode);

    let existInLevel2 = IN_KIND_LEVEL_2.filter((e) => e.VENDOR_TYPE === vendorType);

    let existInLevel3 = IN_KIND_LEVEL_3.filter((e) => e.PAY_ITEM === payItem);

    if (isEmpty(IN_KIND_LEVEL_1)) {
      $swal.warning('無對應之服務廠商，請找理品科設定');
      return;
    }

    if (!isEmpty(uniCode) & isEmpty(pUniCode) & !isEmpty(IN_KIND_LEVEL_1) & isEmpty(existInLevel1)) {
      $swal.warning(`已選的服務廠商：${uniCode}，不在可選擇之下拉式清單內，請重新選擇`);
      return;
    }

    if (!isEmpty(uniCode) & isEmpty(IN_KIND_LEVEL_2)) {
      $swal.warning('無對應之服務類型，請找理品科設定');
      return;
    }

    if (!isEmpty(vendorType) & isEmpty(pVendorType) & !isEmpty(IN_KIND_LEVEL_2) & isEmpty(existInLevel2)) {
      $swal.warning(`已選的服務類型：${vendorType}，不在可選擇之下拉式清單內，請重新選擇`);
      return;
    }

    if (!isEmpty(uniCode) & !isEmpty(vendorType) & (vendorType != pVendorType) & isEmpty(IN_KIND_LEVEL_3)) {
      $swal.warning('無對應之給付項目，請找理品科設定');
      return;
    }

    if (!isEmpty(payItem) & isEmpty(pPayItem) & !isEmpty(IN_KIND_LEVEL_3) & isEmpty(existInLevel3)) {
      $swal.warning(`已選的給付項目：${payItem}，不在可選擇之下拉式清單內，請重新選擇`);
      return;
    }

  }, {immediate: true});

  // 取得服務廠商
  const getUniCodeOptions = async () => {
    let option = IN_KIND_LEVEL_1.map((m) => ({
      name: m.VENDOR_NAME,
      value: m.UNI_CODE
    }));

    return option;
  };

  // 取得服務類型
  const getVendorTypeOptions = async (uniCode) => {
    // 首次進來時uniCode不會有值傳入
    if (uniCode === undefined) {
      uniCode = inKindPayData.value.UNI_CODE;
    }

    let option = IN_KIND_LEVEL_1
      .filter((e) => e.UNI_CODE === uniCode & e.IN_KIND_LEVEL_2 !== undefined)
      .map((m) => m.IN_KIND_LEVEL_2).flat()
      .map((m) => ({
        name: m.VENDOR_TYPE_NAME,
        value: m.VENDOR_TYPE
      }));

    return option;
  };

  // 取得給付項目
  const getPayItemOptions = async (vendorType) => {
    // 首次進來時vendorType不會有值傳入
    if (vendorType === undefined) {
      vendorType = inKindPayData.value.VENDOR_TYPE;
    }

    let option = IN_KIND_LEVEL_1
      .filter((e) => e.UNI_CODE === inKindPayData.value.UNI_CODE)
      .map((m) => m.IN_KIND_LEVEL_2).flat()
      .filter((e) => e.VENDOR_TYPE === vendorType & e.IN_KIND_LEVEL_3 !== undefined)
      .map((m) => m.IN_KIND_LEVEL_3).flat()
      .map((m) => ({
        name: m.PAY_ITEM_NAME,
        value: m.PAY_ITEM
      }));

    return option;
  };
</script>
