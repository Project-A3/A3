<template>
  <div class="card is-full form-container thirdly-card">
    <!-- 展開/收合 Button -->
    <button class="card-toggle-btn"></button>
    <div class="columns card-title">
      <div class="column p-0">
        <h3 style="margin-right: 5px">爭議案件</h3>
      </div>
    </div>

    <div class="hidden-parts">
      <form>
        <table class="table is-fullwidth">
          <tbody>
            <tr v-for="(item, index) in formItems" :key="index">
              <td style="width: 15%">
                <div v-if ="!applyStore.isManager && !readonly">
                  <FormCheckbox
                    :modelValue="accountingStore.DisputedCasesData[item.checkedKey]"
                    @update:modelValue="updateChecked(item.checkedKey, item.amountKey, $event)"
                    :disabled="
                      !isCheckBoxEnabled(accountingStore.DisputedCasesData.CURR_EN) ||
                      !isEditable ||
                      readonly ||
                      applyStore.isManager
                    "
                  >
                  <span>{{ item.label }}</span>
                  </FormCheckbox>
                </div>
                <div v-else>
                  <label class="is-dark">
                    <input type="checkbox"  :checked="accountingStore.DisputedCasesData[item.checkedKey]" disabled/>
                    <span>{{ item.label }}</span>
                  </label>
                </div>
              </td>
              <td>
                <FormInput
                  style="width: 50%;color: #272734"
                  type="text"
                  placeholder="請輸入"
                  :error="無法顯示"
                  v-model="accountingStore.DisputedCasesData[item.amountKey]"
                  @input="updateValue($event, item.amountKey)"
                  :disabled="!isInputEnabled(item.checkedKey) || readonly || !isEditable || applyStore.isManager"
                  :readonly="!isEditable"
                ></FormInput>
              </td>
            </tr>
          </tbody>
        </table>
        <span style="color: red" v-if="accountingStore.DisputedCasesData.IS_ALL_NTD === 'N'">
           本案件包含外幣理賠項目，請確認輸入金額需為外幣金額，而非換算台幣後之金額
        </span>
      </form>
 
      <div class="table-content">
        <div v-for="(item, index) in DisputedData" :key="index" class="part hidden-parts" style="color: red">
          <div class="column is-half preserve-whitespace">{{ item }}</div>
        </div>
      </div>
      
    </div>
  </div>
 </template>

<script setup>
  import { ref, inject, onMounted, isReadonly } from 'vue';
  import FormCheckbox from '~/components/Form/FormCheckbox.vue';
  import FormInput from '~/components/Form/FormInput.vue';
  import useSwal from '~/composables/useSwal';
  import { useAccountingStore } from '~/stores/accounting.js';
  import { useApplyStore } from '~/stores/apply.js';
  import Swal from 'sweetalert2/dist/sweetalert2.js';

  const { $swal } = useSwal();
  const applyStore = useApplyStore();
  const accountingStore = useAccountingStore();
  const applyNo = inject('ApplyNo');
  const readonly = inject('IsReadonly');

  const isEditable = computed(() => {
    if (accountingStore.DisputedCasesData.CURR_EN === '') {
      return false;
    } else {
      return true;
    }
  });

  // 用於跟踪初始數據狀態
  const initialState = reactive({
    type1_checked: false,
    type2_checked: false,
    type3_checked: false
  });
  // 表單項目
  const formItems = [
    {
      label: '醫療類爭議保險金',
      checkedKey: 'type1_checked',
      amountKey: 'type1_AMT'
    },
    {
      label: '非醫療類爭議保險金',
      checkedKey: 'type2_checked',
      amountKey: 'type2_AMT'
    },
    {
      label: '身故爭議保險金',
      checkedKey: 'type3_checked',
      amountKey: 'type3_AMT'
    }
  ];

  // 初始化函數
  const initializeForm = () => {
    formItems.forEach((item) => {
      if (accountingStore.DisputedCasesData[item.amountKey]) {
        accountingStore.DisputedCasesData[item.checkedKey] = true;
        initialState[item.checkedKey] = true;

        if(accountingStore.DisputedCasesData.IS_ALL_NTD === 'Y') {
           accountingStore.DisputedCasesData[item.amountKey] = accountingStore.DisputedCasesData[item.amountKey].split('.')[0];
        }
      } else {
        accountingStore.DisputedCasesData[item.checkedKey] = false;
        initialState[item.checkedKey] = false;
      }
    });
  };
  // 在掛載時初始化
  onMounted(() => {
    initializeData();
  });

  // 判斷勾選欄位是否啟用
  const isCheckBoxEnabled = (checkedKey) => {
    if (checkedKey) {
      return true;
    }
    return false;
  };

  // 判斷輸入欄位是否啟用
  const isInputEnabled = (checkedKey) => {
    return accountingStore.DisputedCasesData[checkedKey];
  };

  // 更新複選框狀態
  const updateChecked = (checkedKey, amountKey, value) => {
    accountingStore.DisputedCasesData[checkedKey] = value;
    accountingStore.isDispChanged = true;
    if (!value) {
      accountingStore.DisputedCasesData[amountKey] = '';
    }
  };

  // 初始化數據和表單
  const DisputedData = ref([]);
  const initializeData = async () => {
    try {
      await accountingStore.getDisputedCasesAplyNO(applyNo);
      initializeForm();
      // 以事故人ID查詢舊有爭議案件
      const ocrId = applyStore.basicData.OCR_ID;
      const resp = await accountingStore.getDisputedCases(applyNo, ocrId);
      DisputedData.value = resp
    } catch (e) {
      $swal.fail(e);
    }
  };

  // 更新輸入值
  const updateValue = (event, amountKey) => {
   let value = event.target.value;
   const numberRegex = /^\d*\.?\d{0,2}$/;
   const ntdRegex =  /^[1-9]\d*$/;
   if(accountingStore.DisputedCasesData.IS_ALL_NTD === 'Y'){
     if (value !== '' && !ntdRegex.test(value)) {
       $swal.fail('輸入數值須為數字且不得有小數');
       event.target.value = accountingStore.DisputedCasesData[amountKey] || '';
       return;
     }
   }else{
     if (value !== '' && !numberRegex.test(value)) {
       $swal.fail('輸入數值須為數字且最多小數點兩位');
       event.target.value = accountingStore.DisputedCasesData[amountKey] || '';
       return;
     }
   }

   if (value !== '' && (Number(value) < 1 || Number(value) > 999999999)) {
     $swal.fail('金額需介於$1 ~ $999,999,999');
     event.target.value = accountingStore.DisputedCasesData[amountKey] || '';
   } else {
     accountingStore.DisputedCasesData[amountKey] = value;
     accountingStore.isDispChanged = true;
   }
 };
</script>
<style lang="scss" scoped>
  .form-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    /* 行間距 */
  }

  .preserve-whitespace {
    white-space: pre-wrap;
  }
</style>
