<template>
  <div class="second-card">
    <span class="sticky-basic-info"></span>
    <!-- Data List -->
    <div class="card is-full" v-for="allocation in paymentAllocations" :key="allocation.POLICY_NO">
      <button class="card-toggle-btn expand"></button>
      <div class="card-title">
        <h3>保單號碼-
          <a href="#" style="pointer-events: auto;text-decoration: underline;color: #6fba2a;" @click.stop.prevent="onClickPolicyBeneList(allocation.POLICY_NO)">
            {{ allocation.POLICY_NO }}
          </a>
        </h3>
        <p>
          索賠項目數量<span>{{ allocation.CLAM_CAT_TYPE_COUNT }}</span
          >項
        </p>
      </div>
      <div class="table-content hidden-parts" v-for="claimCatInfo in allocation.claimCatInfo" :key="claimCatInfo.CLAM_CAT">
        <div class="table-title">
          <span class="bold">{{ claimCatInfo.CLAM_CAT_NAME }}</span>
          <span class="ml-15">給付總額</span>
          <span class="ml-1"> {{ claimCatInfo.CURR_DESC }}</span>
          <span class="ml-1">{{ parseFloat(claimCatInfo.PAY_AMT).toLocaleString('en-US') }}</span>
        </div>
        <span style="color: red" v-if="claimCatInfo.CLAM_CAT == 'Z'">
          當單一受編單一受款人，所有保單的延滯息總額超過NT2萬元時(不含2萬)，須扣補充保費及延滯息所得稅。
          <br>
          補充保費=延滯息總額的2.11%、延滯息所得稅=延滯息總額的10% (補充保費費率={{ claimCatInfo.SUPP_PERM_RATE }}，外幣匯率={{ claimCatInfo.CURR_RATE }})
        </span>
        <table class="table is-striped-odd hover-none is-fullwidth" v-if="claimCatInfo.CLAM_CAT !== 'Z'">
          <thead>
            <tr>
              <th class="has-text-centered">序號</th>
              <th>受益人姓名</th>
              <th>受款人姓名</th>
              <th>受款人 ID</th>
              <th class="has-text-right pr-30">比例</th>
              <th class="has-text-right pr-30">給付金額</th>
              <th>變更原因</th>
              <th class="has-text-centered">刪除</th>
            </tr>
          </thead>
          <tbody>
            <GroupEditable
              tag="tr"
              v-for="(beneInfo, index) in claimCatInfo.beneInfo"
              :key="beneInfo.BENE_ID + index"
              disableGroupClick
            >
              <td class="has-text-centered">{{ index + 1 }}</td>
              <td>
                <EditableDropdown
                  v-model="beneInfo.BENE_ID"
                  :options="getBeneOptions()"
                  :schema="string().required('請選擇受益人')"
                  :onRefreshOptions="onRefreshBeneOptions"
                  dynamic="editing"
                  :editingWidth="160"
                  @onSelected="
                    (value, options) => {
                      onBeneSelected(value, beneInfo, options);
                    }
                  "
                  class="height-limit"
                ></EditableDropdown>
              </td>
              <td class="font-eudc">{{ beneInfo.ACPT_NAME }}</td>
              <td>{{ beneInfo.ACPT_ID }}</td>
              <td class="has-text-right pr-30">
                <EditableInput
                  type="text"
                  :inputWidth="130"
                  v-model="beneInfo.PAY_RATO"
                  :schema="
                    string()
                      .matches(/^[0-9]*$/, '格式錯誤，請輸入數字')
                      .required('請輸入比例')
                      .test('totalNot100', '比例總和需為100', () => {
                        return validateRatioTotal(claimCatInfo.beneInfo);
                      })
                  "
                  :hasPercent="true"
                  class="is-inline"
                  :onInputChange="
                    (value) => {
                      let precision = claimCatInfo.CURR === 'NTD' ? 0 : 2;
                      beneInfo.PAY_AMT = calculateMoney(claimCatInfo.PAY_AMT, value, precision);
                    }
                  "
                ></EditableInput>
              </td>
              <td class="has-text-right pr-30">
                <EditableInput
                  type="number"
                  :inputWidth="130"
                  :numberToFixed="claimCatInfo.CURR === 'NTD' ? 0 : 2"
                  v-model="beneInfo.PAY_AMT"
                  :schema="
                    number()
                      .typeError('格式錯誤，請輸入數字')
                      .required('請輸入給付金額')
                      .test(
                        'totalNotAmount',
                        `給付金額總和需為${claimCatInfo.CURR === 'NTD' ? parseInt(claimCatInfo.PAY_AMT) : claimCatInfo.PAY_AMT}`,
                        () => {
                          return validateAmountTotal(claimCatInfo.PAY_AMT, claimCatInfo.beneInfo, 'PAY_AMT');
                        }
                      )
                  "
                  class="is-inline"
                  isCurrency
                ></EditableInput>
              </td>
              <td>
                <div class="is-flex is-align-items-center">
                  <EditableDropdown
                    :editingWidth="210"
                    v-model="beneInfo.BENE_CHG_RESN"
                    :options="getReasonOptions()"
                    nonSelectedText="-"
                    class="height-limit"
                    :schema="changeReasonSchema(beneInfo)"
                  ></EditableDropdown>
                </div>
              </td>
              <td class="has-text-centered">
                <button
                  class="button icon trash"
                  @click="deleteBeneInfo(claimCatInfo.POLICY_NO, claimCatInfo.CLAM_CAT, beneInfo)"
                ></button>
              </td>
            </GroupEditable>
          </tbody>
        </table>
        <table class="table is-striped-odd hover-none is-fullwidth" v-else>
          <thead>
            <tr>
              <th class="has-text-centered">序號</th>
              <th>受益人姓名</th>
              <th>受款人姓名</th>
              <th>受款人 ID</th>
              <th class="has-text-centered">比例</th>
              <th class="has-text-right pr-30">給付金額</th>
              <th class="has-text-right pr-30">補充保費</th>
              <th class="has-text-right pr-30">延滯息所得稅</th>
              <th class="has-text-right pr-30">延滯息</th>
              <th>變更原因</th>
              <th class="has-text-centered">刪除</th>
            </tr>
          </thead>
          <tbody>
            <GroupEditable
              tag="tr"
              v-for="(beneInfo, index) in claimCatInfo.beneInfo"
              :key="beneInfo.BENE_ID + index"
              disableGroupClick
            >
              <td class="has-text-centered">{{ index + 1 }}</td>
              <td>
                <EditableDropdown
                  v-model="beneInfo.BENE_ID"
                  :options="getBeneOptions()"
                  :schema="string().required('請選擇受益人')"
                  :onRefreshOptions="onRefreshBeneOptions"
                  dynamic="editing"
                  :editingWidth="160"
                  @onSelected="
                    (value, options) => {
                      onBeneSelected(value, beneInfo, options);
                    }
                  "
                  class="height-limit"
                ></EditableDropdown>
              </td>
              <td class="font-eudc">{{ beneInfo.ACPT_NAME }}</td>
              <td>{{ beneInfo.ACPT_ID }}</td>
              <td class="has-text-centered">
                <EditableInput
                  type="text"
                  :inputWidth="80"
                  v-model="beneInfo.PAY_RATO"
                  :hasPercent="true"
                  :schema="
                    string()
                      .matches(/^[0-9]*$/, '格式錯誤，請輸入數字')
                      .required('請輸入比例')
                      .test('totalNot100', '比例總和需為100', () => {
                        return validateRatioTotal(claimCatInfo.beneInfo);
                      })
                  "
                  :onInputChange="
                    (value) => {
                      let precision = claimCatInfo.CURR === 'NTD' ? 0 : 2;
                      beneInfo.DLY_INT = calculateMoney(claimCatInfo.PAY_AMT, value, precision);
                      beneInfo.DLY_INT_TAX = calculateMoney(claimCatInfo.DLY_INT_TAX_COUNT, value, precision);
                      beneInfo.FEE = calculateMoney(claimCatInfo.FEE_COUNT, value, precision);
                      beneInfo.PAY_AMT = beneInfo.DLY_INT - Math.abs(beneInfo.DLY_INT_TAX) - Math.abs(beneInfo.FEE);
                    }
                  "
                  class="is-inline"
                ></EditableInput>
              </td>
              <td class="has-text-right pr-30">{{ toCurrency(beneInfo.PAY_AMT) }}</td>
              <td class="has-text-right pr-30">
                <EditableInput
                  :inputWidth="90"
                  v-model="beneInfo.FEE"
                  :schema="number().typeError('格式錯誤，請輸入數字').required('請輸入補充保費')"
                  :onInputChange="
                    (value) => {
                      beneInfo.FEE =  0 - Math.abs(beneInfo.FEE);
                    }
                  "
                  class="is-inline"
                  isCurrency
                ></EditableInput>
              </td>
              <td class="has-text-right pr-30">
                <EditableInput
                  :inputWidth="90"
                  v-model="beneInfo.DLY_INT_TAX"
                  :schema="number().typeError('格式錯誤，請輸入數字').required('請輸入延滯息所得稅')"
                  :onInputChange="
                    (value) => {
                      beneInfo.DLY_INT_TAX = 0 - Math.abs(beneInfo.DLY_INT_TAX);
                    }
                  "
                  class="is-inline"
                  isCurrency
                ></EditableInput>
              </td>
              <td class="has-text-right pr-30">
                <EditableInput
                  type="number"
                  :numberToFixed="claimCatInfo.CURR === 'NTD' ? 0 : 2"
                  :inputWidth="100"
                  v-model="beneInfo.DLY_INT"
                  class="is-inline"
                  :schema="
                    number()
                      .typeError('格式錯誤，請輸入數字')
                      .required('請輸入延滯息')
                      .test(
                        'totalNotAmount',
                        `延滯息總和需為${claimCatInfo.CURR === 'NTD' ? parseInt(claimCatInfo.PAY_AMT) : claimCatInfo.PAY_AMT}`,
                        () => {
                          return validateAmountTotal(claimCatInfo.PAY_AMT, claimCatInfo.beneInfo, 'DLY_INT');
                        }
                      )
                  "
                  isCurrency
                ></EditableInput>
              </td>
              <td>
                <div class="is-flex is-align-items-center">
                  <EditableDropdown
                    :editingWidth="150"
                    v-model="beneInfo.BENE_CHG_RESN"
                    :options="getReasonOptions()"
                    nonSelectedText="-"
                    class="height-limit"
                    :schema="changeReasonSchema(beneInfo)"
                  ></EditableDropdown>
                </div>
              </td>
              <td class="has-text-centered">
                <button
                  class="button icon trash"
                  @click="deleteBeneInfo(claimCatInfo.POLICY_NO, claimCatInfo.CLAM_CAT, beneInfo)"
                ></button>
              </td>
            </GroupEditable>
          </tbody>
        </table>
        <div class="button-group">
          <button
            class="button is-primary is-outline text-is-color"
            :disabled="isEqual(claimCatInfo.beneInfo, copyTempData)"
            @click="onClickCopy(claimCatInfo.beneInfo, $event)"
          >
            <span v-if="isEqual(claimCatInfo.beneInfo, copyTempData)">已</span>複製
          </button>
          <button
            class="button is-primary is-outline text-is-color"
            :disabled="!hasCopyData || isEqual(claimCatInfo.beneInfo, copyTempData)"
            @click="onClickPaste(claimCatInfo)"
          >
            貼上並取代
          </button>
          <button class="button is-primary has-icon-back has-icon-back-add" @click="onClickInsert(claimCatInfo.beneInfo)">
            新增受益人
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { pausableWatch } from '@vueuse/core';
import { isEmpty, isEqual, pull, round, toSafeInteger } from 'lodash-es';
import { storeToRefs } from 'pinia';
import { nextTick } from 'vue';
import { number, string } from 'yup';
import iconAddBene from '~/assets/images/icon-add.svg';
import { toCurrency } from '~/common/utils';
import EditableDropdown from '~/components/Editable/EditableDropdown.vue';
import EditableInput from '~/components/Editable/EditableInput.vue';
import GroupEditable from '~/components/Editable/GroupEditable.vue';
import useDecimal from '~/composables/useDecimal';
import useModal from '~/composables/useModal';
import useSwal from '~/composables/useSwal';
import { useApplyStore } from '~/stores/apply';
import { useBeneficiaryStore } from '~/stores/beneficiary';
import { useEditableStore } from '~/stores/editable';
import AddBeneficiaryModal from '../Overview/Modals/AddBeneficiaryModal.vue';

  const { add } = useDecimal();
  const { $swal } = useSwal();
  const { $m } = useModal();
  const beneficiaryStore = useBeneficiaryStore();
  const applyStore = useApplyStore();
  const editableStore = useEditableStore();
  const { paymentAllocations, beneChangeReasons, beneficiaries } = storeToRefs(beneficiaryStore);
  const router = useRouter();
  const applyNo = inject('ApplyNo');

  const getReasonOptions = () =>
    beneChangeReasons.value.map((r) => ({
      name: r.BENE_CHG_RESN_DESC,
      value: r.BENE_CHG_RESN
    }));

  // 取得受益人下拉選單資料
  const getBeneOptions = () => {
    let options = beneficiaries.value.map((b) => ({
      name: b.BENE_NAME,
      value: b.BENE_ID
    }));

    options.push({
      name: `受益人建檔 <img src="${iconAddBene}">`,
      value: 'CREATE',
      isCreate: true
    });

    return options;
  };
  const onRefreshBeneOptions = async () => {
    beneficiaries.value = await beneficiaryStore.getBeneInfo(applyNo);
    return getBeneOptions();
  };

  // 取得受款人資料
  const getAccepter = (beneId) => {
    const template = { ACPT_ID: '', ACPT_NAME: '', BENE_NAME: '', ID_TYPE: '', ACPT_BIRTH: '', ACPT_COUNTRY: '', ACPT_EN_NAME: '', BANK_NAME: '' };
    if (!beneId) return template;
    let findBeneInfo = beneficiaries.value.find((b) => b.BENE_ID === beneId);
    if (findBeneInfo) {
      template.ACPT_ID = findBeneInfo.ACPT_ID;
      template.ACPT_NAME = findBeneInfo.ACPT_NAME;
      template.BENE_NAME = findBeneInfo.BENE_NAME;
      template.ID_TYPE = findBeneInfo.ID_TYPE;
      template.ACPT_BIRTH = findBeneInfo.ACPT_BIRTH;
      template.ACPT_COUNTRY = findBeneInfo.ACPT_COUNTRY;
      template.ACPT_EN_NAME = findBeneInfo.ACPT_EN_NAME;
      template.BANK_NAME = findBeneInfo.BANK_NAME;
    }
    return template;
  };

  // 選擇受益人後更新受款人資料
  const onBeneSelected = (id, beneficiary, options) => {
    if (id !== 'CREATE') {
      const acpt = getAccepter(id);
      beneficiary.ACPT_ID = acpt.ACPT_ID;
      beneficiary.ACPT_NAME = acpt.ACPT_NAME;
      beneficiary.BENE_NAME = acpt.BENE_NAME;
      beneficiary.ID_TYPE = acpt.ID_TYPE;
      beneficiary.ACPT_BIRTH = acpt.ACPT_BIRTH;
      beneficiary.ACPT_COUNTRY = acpt.ACPT_COUNTRY;
      beneficiary.ACPT_EN_NAME = acpt.ACPT_EN_NAME;
      beneficiary.BANK_NAME = acpt.BANK_NAME;
    } else {
      // 受益人建檔
      // 目前受益人清單的給付方式
      const currentPayType = applyStore.basicData.PAY_TYPE;
      // 先關掉編輯模式，這樣下次打開就會直接刷新受益人清單
      editableStore.closeCurrentGroupEditing();
      // 跳彈窗
      $m.show({
        component: AddBeneficiaryModal,
        id: 'beneficiaryModal',
        data: {
          mode: 'ADD', // 新增 or 編輯
          payType: currentPayType, //TODO: 給付方式想想要從保單概況拿還是申請資料
          editingBeneficiary: null, // 要編輯的受益人資料
          applyNo, // 受理編號
          saveCallback: (bene) => {
            console.log(bene);
            onRefreshBeneOptions().then((value) => {
              beneficiary.ACPT_ID = bene.ACPT_ID;
              beneficiary.ACPT_NAME = bene.ACPT_NAME;
              beneficiary.BENE_NAME = bene.BENE_NAME;
              beneficiary.BENE_ID = bene.BENE_ID;
              beneficiary.ID_TYPE = bene.ID_TYPE;
              beneficiary.ACPT_BIRTH = bene.ACPT_BIRTH;
              beneficiary.ACPT_COUNTRY = bene.ACPT_COUNTRY;
              beneficiary.ACPT_EN_NAME = bene.ACPT_EN_NAME;
              beneficiary.BANK_NAME = bene.BANK_NAME;
            });
          }
        }
      });
    }

    if(applyStore.basicData.IS_OIU === 'Y' & isEmpty(beneficiary.BAL_TYPE)) {
      beneficiary.BAL_TYPE = 'OIU';
    }
  };

  // 刪除受益人分配資料
  const deleteBeneInfo = async (policyNo, clamCat, beneficiary) => {
    try {
      let r = await $swal.confirmAsync('確定要刪除嗎?');
      if (r.isConfirmed) {
        // 從畫面上刪除
        for (const allocation of paymentAllocations.value) {
          for (const claimCatInfo of allocation.claimCatInfo) {
            if (claimCatInfo.POLICY_NO === policyNo && claimCatInfo.CLAM_CAT === clamCat) {
              pull(claimCatInfo.beneInfo, beneficiary);
              break;
            }
          }
        }
        $swal.success('刪除成功');
      }
    } catch (e) {
      $swal.fail(e);
    } finally {
      beneficiaryStore.hideLoading();
    }
  };

  // 檢核比例加總是否為100
  const validateRatioTotal = (beneInfo) => {
    let total = beneInfo.map((b) => toSafeInteger(b.PAY_RATO)).reduce((a, b) => a + b, 0);
    // console.log(total);
    return total === 100;
  };

  // 檢核給付金額加總是否為給付總額
  const validateAmountTotal = (totalAmount, beneInfo, field) => {
    let total = beneInfo.map((b) => b[field]).reduce((a, b) => add(a,b), 0);
    return total === parseFloat(totalAmount);
  };

  // 根據比例算出金額
  const calculateMoney = (totalAmount, ratio, precision) => {
    // console.log('input change');
    return round((totalAmount * ratio) / 100, precision);
  };

  // 複製的暫存值
  const copyTempData = ref([]);

  const { stop, pause, resume } = pausableWatch(
    copyTempData,
    (v) => {
      console.log('watch pausable!');
      copyTempData.value = [];
      pause();
    },
    { deep: true }
  );

  // 點擊複製
  const onClickCopy = async (beneInfo, event) => {
    // 有Error時不能複製
    if (event.target.closest('.table-content') && event.target.closest('.table-content').querySelector('img.error-message')) {
      $swal.warning('請先將資料填寫正確');
      return;
    }
    await nextTick();
    pause();
    copyTempData.value = beneInfo;
    await nextTick();
    resume();
  };

  // 判斷目前有沒有複製的資料
  const hasCopyData = computed(() => {
    return copyTempData.value.length > 0;
  });

  // 點擊貼上並取代
  const onClickPaste = (claimCatInfo) => {
    claimCatInfo.beneInfo.length = 0;
    claimCatInfo.beneInfo = copyTempData.value.map((b) => ({
      ...b,
      PAY_AMT: round((claimCatInfo.PAY_AMT * b.PAY_RATO) / 100),
      DLY_INT: claimCatInfo.CLAM_CAT === 'Z' ? round((claimCatInfo.PAY_AMT * b.PAY_RATO) / 100) : 0,
      FEE: 0,
      DLY_INT_TAX: 0,
      MAN_INS: 'Y'
    }));
  };

  // 點擊新增
  const onClickInsert = (beneInfo) => {
    console.log(beneInfo);
    beneInfo.push({
      ACNM: '',
      ACNT_NO: '',
      ACPT_ID: '',
      ACPT_NAME: '',
      ACPT_RLAT: '',
      APLY_DIV_NO: '',
      APLY_SER_NO: '',
      BANK_NO: '',
      BENE_BRDY: '',
      BENE_CHG_RESN: '',
      BENE_CHG_RESN_DESC: '',
      IS_CURR_INS: true,
      ORI_PAY_RATO: 0,
      ORI_BENE_ID: '',
      BENE_ID: '',
      BENE_NAME: '',
      CNCL_LINE_CTX_TEXT: '',
      CNCL_LINE_IDX: '',
      CRS_FLAG: '',
      DLY_INT: 0,
      DLY_INT_TAX: 0,
      FATCA_FLAG: '',
      FEE: 0,
      IS_PAY3_RTN: '',
      ONE_ACC: '',
      PAY_AMT: 0,
      PAY_DESC: '',
      PAY_RATO: '0',
      PAY_TYPE: '',
      PAY_UNIT: '',
      RISK_LEVEL: '',
      RMT_MOD_RSN: '',
      RMT_RIGHT_NOW: '',
      UN_BACK_CTX_TEXT: '',
      UN_BACK_IDX: '',
      WARNING: 'N',
      MAN_INS: 'Y',
      javaClass: 'com.cathay.aa.b3.bo.AA_B3Z300_bo1'
    });
  };

  // 變更原因警示訊息Schema
  const changeReasonSchema = (beneInfo) =>
    string().test(
      'required',
      '請選擇變更原因',
      (value) =>
        !(
          (beneInfo.IS_CURR_INS ||
            toSafeInteger(beneInfo.PAY_RATO) != toSafeInteger(beneInfo.ORI_PAY_RATO) ||
            beneInfo.BENE_ID !== beneInfo.ORI_BENE_ID) &&
          !value
        )
    );

  const onClickPolicyBeneList = async(policyNo) => {
    try{
      if (import.meta.env.DEV) {
          let routeData = router.resolve({
            path: '/master/policy_bene_list',
            query: { q: policyNo }
          });
          window.open(routeData.href, '_blank');
        } else {
          window.open('/servlet/HttpDispatcher/AAB3_1000/prompt#/master/policy_bene_list?q=' + policyNo);
        }
    } catch (e) {
      $swal.fail(e);
    }
  };
</script>

<style lang="scss">
  .page-beneficiary {
    .is-inline * {
      display: inline-block !important;
    }
    .is-inline .data {
      overflow: initial !important;
    }
  }
</style>
