<template>
  <LifeCycleHook :onKeydownSave="saveData">
    <!-- First-Card 基本資料-->
    <BasicInfo :basicData="basicData" :applyNo="props.applyNo"></BasicInfo>
    <!-- Second Card -->
    <div class="card is-full second-card is-expanded">
      <!-- 展開/收合 Button -->
      <button class="card-toggle-btn expand"></button>

      <div class="columns">
        <div class="column p-0">
          <h3 class="sticky-basic-info">保單概況</h3>
        </div>
      </div>

      <div class="table-content">
        <div class="table-title">
          已選擇保單
          <span>({{ selectedPolicies().length }})</span>
        </div>

        <table class="table is-striped-odd is-fullwidth" id="chooseInsuranceTable">
          <thead>
            <tr class="scroll-fix">
              <SortingThead
                class="has-text-centered"
                sortKey="SYS_NO"
                :currentSortKey="sortSetting.selected.sortKey"
                :isSortDesc="sortSetting.selected.isSortDesc"
                :onClickSort="onClickSortSelected"
                style="width: 110px"
                >業務別
              </SortingThead>
              <th>保單號碼</th>
              <th class="has-text-right">保額</th>
              <th class="has-text-left is-block" style="width: 80px">單位</th>
              <th>險別</th>
              <th class="has-text-centered">投保(復效)日期</th>
              <th class="has-text-centered" v-if="showRoleName">關係</th>
              <template v-if="isGroupInsurance">
                <th class="has-text-centered">批註</th>
                <th class="has-text-centered">等級/補助</th>
              </template>
              <template v-else>
                <th class="has-text-centered">除外</th>
                <th class="has-text-centered">下次應繳日</th>
              </template>
              <th class="has-text-centered">條款重點檢核</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="policy in selectedPolicies(sortSetting.selected.sortKey, sortSetting.selected.isSortDesc)">
              <td class="has-text-centered">{{ policy.SYS_NAME_SHOW }}</td>
              <td>
                <a :href="policy.POLICY_NO_LINK" target="_blank" class="insurance-no">{{ policy.POLICY_NO_SHOW }}</a>
              </td>
              <td class="has-text-right">{{ policy.FACE_AMT }}</td>
              <td class="has-text-left">{{ policy.FACE_AMT_UNIT }}</td>
              <td>
                <a
                  v-if="policy.PROD_LINK === 'Y'"
                  href="#"
                  class="is-primary font-eudc"
                  @click.stop.prevent="onClickGetPolicyTerms(policy)"
                  >{{ policy.PROD_NAME }}</a
                >
                <span class="font-eudc" v-else>{{ policy.PROD_NAME }}</span>
              </td>
              <td class="has-text-centered">
                <p :style="{ color: `${handleTextColor(policy.ISSUE_DATE_COLOR)}` }">{{ getROCDate(policy.ISSUE_DATE) }}</p>
              </td>
              <td class="has-text-centered" v-if="showRoleName">{{ policy.ROLE_NAME }}</td>
              <td class="has-text-centered">
                <span v-if="isGroupInsurance">{{ policy.HAS_SPEC }}</span>
                <a
                  :href="`/AVWeb/servlet/HttpDispatcher/AVE0_6000/query?LINK_TYPE=Y&IMG_KIND_LINK=AB08&RCPT_NO_LINK=${policy.POLICY_NO}&IMG_KIND_OPT=AB08&RCPT_NO=${policy.POLICY_NO}`"
                  class="has-text-danger"
                  target="_blank"
                  v-else
                >
                  {{ policy.EXCL_CODE }}
                </a>
              </td>
              <td class="has-text-centered">
                <p v-if="isGroupInsurance">{{ policy.RET_DEGREE }}</p>
                <p :style="{ color: `${handleTextColor(policy.RNXT_PAY_DATE_COLOR)}` }" v-else>
                  {{ getROCDate(policy.RNXT_PAY_DATE) }}
                </p>
              </td>
              <td class="has-text-centered">
                <button class="button icon paper" v-if="policy.TERMS_PATH" @click="onClickTermsPath(policy.TERMS_PATH)"></button>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="columns">
          <span>最後保單確認時間：{{ polCfmTimeStr }}</span>
          <div class="column hor-right p-0">
            <button class="button is-primary" @click="onClickEditPolicy" :disabled="isReviewer">編輯保單</button>
            <button
              class="button is-primary"
              :disabled="disablePrepaymentButton"
              @click="onClickPrepayment"
            >
              預付金紀錄
            </button>
            <button
              class="button is-primary"
              :disabled="disableSegmentationButton || isReviewer"
              @click="onClickSegmentation"
            >
              保單分期
            </button>
          </div>
        </div>
      </div>

      <div class="table-content hidden-parts">
        <div class="table-title">
          未選擇保單
          <span>({{ unselectedPolicies().length }})</span>
        </div>

        <table class="table is-striped-odd is-fullwidth">
          <thead>
            <tr class="scroll-fix">
              <th v-if="isGroupInsurance">是否繳費</th>
              <SortingThead
                class="has-text-centered"
                sortKey="SYS_NO"
                :currentSortKey="sortSetting.unselected.sortKey"
                :isSortDesc="sortSetting.unselected.isSortDesc"
                :onClickSort="onClickSortUnselected"
                style="width: 110px"
                v-else
                >業務別
              </SortingThead>
              <th>保單號碼</th>
              <th class="has-text-right">保額</th>
              <th class="has-text-left is-block" style="width: 80px">單位</th>
              <th>險別</th>
              <th class="has-text-centered">投保(復效)日期</th>
              <th class="has-text-centered" v-if="showRoleName">關係</th>
              <template v-if="isGroupInsurance">
                <th class="has-text-centered">批註</th>
                <th class="has-text-centered">下次應繳日</th>
                <th class="has-text-centered">等級/補助</th>
              </template>
              <template v-else>
                <th class="has-text-centered">除外</th>
                <th class="has-text-centered">下次應繳日</th>
                <th class="has-text-centered">條款重點檢核</th>
              </template>
            </tr>
          </thead>
          <tbody>
            <tr v-for="policy in unselectedPolicies(sortSetting.unselected.sortKey, sortSetting.unselected.isSortDesc)">
              <td class="has-text-centered">
                <template v-if="isGroupInsurance"> {{ policy.IS_PAY_SHOW }}</template>
                <template v-else> {{ policy.SYS_NAME_SHOW }}</template>
              </td>
              <td>
                <a :href="policy.POLICY_NO_LINK" target="_blank" class="insurance-no">{{ policy.POLICY_NO_SHOW }}</a>
              </td>
              <td class="has-text-right">{{ policy.FACE_AMT }}</td>
              <td class="has-text-left">{{ policy.FACE_AMT_UNIT }}</td>
              <td>
                <a
                  v-if="policy.PROD_LINK === 'Y'"
                  href="#"
                  class="is-primary font-eudc"
                  @click.stop.prevent="onClickGetPolicyTerms(policy)"
                  >{{ policy.PROD_NAME }}</a
                >
                <span class="font-eudc" v-else>{{ policy.PROD_NAME }}</span>
              </td>
              <td class="has-text-centered">
                <p :style="{ color: `${handleTextColor(policy.ISSUE_DATE_COLOR)}` }">{{ getROCDate(policy.ISSUE_DATE) }}</p>
              </td>
              <td class="has-text-centered" v-if="showRoleName">{{ policy.ROLE_NAME }}</td>
              <td class="has-text-centered">
                <span v-if="isGroupInsurance">{{ policy.HAS_SPEC }}</span>
                <a
                  :href="`/AVWeb/servlet/HttpDispatcher/AVE0_6000/query?LINK_TYPE=Y&IMG_KIND_LINK=AB08&RCPT_NO_LINK=${policy.POLICY_NO}&IMG_KIND_OPT=AB08&RCPT_NO=${policy.POLICY_NO}`"
                  class="is-primary"
                  target="_blank"
                  v-else
                >
                  {{ policy.EXCL_CODE }}
                </a>
              </td>
              <td class="has-text-centered">
                <p :style="{ color: `${handleTextColor(policy.RNXT_PAY_DATE_COLOR)}` }">
                  {{ getROCDate(policy.RNXT_PAY_DATE) }}
                </p>
              </td>
              <td class="has-text-centered">
                <span v-if="isGroupInsurance">{{ policy.RET_DEGREE }}</span>
                <button
                  class="button icon paper"
                  v-else-if="!isGroupInsurance && policy.TERMS_PATH"
                  @click="onClickTermsPath(policy.TERMS_PATH)"
                ></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Thirdly Card -->
    <div class="card is-full thirdly-card" ref="beneInfo">
      <div class="columns">
        <div class="column p-0">
          <h3>受益人清單</h3>
        </div>
      </div>

      <div class="table-content">
        <div class="table-title">
          <BaseDropdown
            ref="payTypeDropdown"
            :options="payTypeOptionsIsOIU"
            :onSelected="onPayTypeSelected"
            v-if="basicData.IS_OIU === 'Y'"
          ></BaseDropdown>
          <BaseDropdown
            ref="payTypeDropdown"
            :options="payTypeOptions"
            :onSelected="onPayTypeSelected"
            v-else-if="!isReviewer"
          ></BaseDropdown>
          <p v-else>{{ PayType.getChineseStatus(currentPayType) }}</p>
        </div>

        <table class="table is-striped-odd is-fullwidth">
          <thead class="no-wrap-title">
            <tr class="scroll-fix">
              <th class="has-text-centered">序號</th>
              <th>受益人姓名</th>
              <th>受益人ID</th>
              <th>受款人姓名</th>
              <th>受款人ID</th>
              <th>與受益人關係</th>
              <th>受款人法代/<br />姓名ID</th>
              <th>洗錢資恐<br />風險等級</th>
              <th>是否具FATCA/<br />CRS指標</th>
              <th>給付方式</th>
              <template v-if="!isReviewer">
                <th class="has-text-centered">編輯</th>
                <th class="has-text-centered">刪除</th>
              </template>
            </tr>
          </thead>
          <tbody>
            <template v-for="(beneficiary, index) in beneficiaries">
            <tr>
              <td class="has-text-centered">{{ index + 1 }}</td>
              <td class="font-eudc">{{ beneficiary.BENE_NAME }}</td>
              <td>{{ beneficiary.BENE_ID }}</td>
              <td class="font-eudc">{{ beneficiary.ACPT_NAME }}</td>
              <td>{{ beneficiary.ACPT_ID }}</td>
              <td>{{ beneficiary.ACPT_RLAT }}</td>
              <td><button class="button icon toggle" v-if="beneficiary.LEGL_ACPT_LIST.length > 0"></button><div v-else>無</div></td>
              <td>
                <a
                  @click.stop.prevent="onClickRiskLink(beneficiary)"
                  :class="{ 'is-primary': true, 'is-warning': (beneficiary.RISK_LEVEL.includes('高') || beneficiary.RISK_LEVEL.includes('制')) }"
                >
                  {{ beneficiary.RISK_LEVEL }}
                </a>
              </td>
              <td>
                <p :class="{ 'is-warning': beneficiary.FATCA_FLAG === 'Y' || beneficiary.CRS_FLAG === 'Y' }">
                  {{ beneficiary.FATCA_FLAG }}/{{ beneficiary.CRS_FLAG }}
                </p>
              </td>
              <td>
                <div class="is-flex is-justify-content-space-between is-align-items-center">
                  <div>
                    <p v-if="beneficiary.PAY_TYPE === PayType.Remit && beneficiary.RMT_RIGHT_NOW === 'Y'">即時匯撥</p>
                    <p
                      v-else-if="beneficiary.PAY_TYPE === PayType.Cheque && beneficiary.CNCL_LINE_IDX === 'Y'"
                      class="has-text-danger"
                    >
                      支票(取消平行線)
                    </p>
                    <p
                      v-else-if="beneficiary.PAY_TYPE === PayType.Cheque && beneficiary.UN_BACK_IDX === 'Y'"
                      class="has-text-danger"
                    >
                      支票(取消禁背)
                    </p>
                    <p v-else>{{ beneficiary.PAY_DESC }}</p>
                    <p 
                      v-if="beneficiary.PAY_TYPE === PayType.Cheque && !isEmpty(beneficiary.APLY_SER_NO)"
                      class="has-text-danger"
                    >
                      票據變更編號: {{ beneficiary.APLY_SER_NO }}
                    </p>
                    <p v-if="beneficiary.PAY_TYPE === PayType.Remit && !isEmpty(beneficiary.PAY_ACCOUNT)">
                      {{ beneficiary.PAY_ACCOUNT }}
                    </p>
                    <p v-if="beneficiary.PAY_TYPE === PayType.Remit && !isEmpty(beneficiary.BANK_NO)">
                      {{ beneficiary.BANK_NO }}
                    </p>
                    <p v-if="beneficiary.PAY_TYPE === PayType.Remit && !isEmpty(beneficiary.ACNT_NO)">
                      {{ beneficiary.ACNT_NO }}
                    </p>
                    <p v-if="beneficiary.PAY_TYPE === PayType.Money && !isEmpty(beneficiary.PAY_UNIT)">
                      給付單位: {{ beneficiary.PAY_UNIT }} {{ beneficiary.PAY_UNIT_SHORT_NAME }}
                    </p>
                  </div>
                  <ErrorTippy v-if="beneficiary.PAY_TYPE_CHANGE" :errors="['給付方式已變更，請確認資料是否正確']"></ErrorTippy>
                  <ErrorTippy v-if="!isEmpty(beneficiary.ICON_MSG)" :errors="[beneficiary.ICON_MSG]" :key="beneficiary.ICON_MSG"></ErrorTippy>
                </div>
              </td>
              <template v-if="!isReviewer">
                <td class="has-text-centered">
                  <button class="button edit" @click="openBeneficiaryModal('EDIT', beneficiary)"></button>
                </td>
                <td class="has-text-centered">
                  <button class="button trash" @click="deleteBeneficiary(beneficiary)"></button>
                </td>
              </template>
            </tr>
            <tr class="hidden-info is-hidden">
              <td colspan="3"></td>
              <td colspan="9">
                <div class="columns is-multiline">
                  <template v-for="(leglData, index) in beneficiary.LEGL_ACPT_LIST">
                  <div class="column is-4">
                    <span style="color:red" v-if="beneficiary.IS_OVER_LEGL === 'Y'">*</span>
                    <span class="field">受款人法代姓名/ID</span>
                    <span class="data">
                      <EllipseTippy :disableEllipse="true" :key="beneficiary.IS_OVER_LEGL" :content="beneficiary.IS_OVER_LEGL === 'Y' ? '超過兩位受款人法代，請依申請書資料人工進行洗錢資恐檢核。':''" >
                        {{ !isEmpty(leglData.CFM_LEGL_NAME)?leglData.CFM_LEGL_NAME:leglData.APLY_LEGL_NAME }}/{{ !isEmpty(leglData.CFM_LEGL_ID)?leglData.CFM_LEGL_ID:leglData.APLY_LEGL_ID }}
                      </EllipseTippy>
                      
                    </span>
                  </div>
                  <div class="column is-4">
                    <span class="field">洗錢資恐風險等級</span>
                    <span class="data">
                    <a
                      @click.stop.prevent="onClickDetailRiskLink(leglData)"
                      :class="{ 'is-primary': true, 'is-warning': (leglData.LEGL_AIL0_RISK_LVL_NAME.includes('高') || leglData.LEGL_AIL0_RISK_LVL_NAME.includes('制')) }"
                    >
                      {{ leglData.LEGL_AIL0_RISK_LVL_NAME }}
                    </a>
                    </span>
                  </div>
                  <div class="column is-4">
                  </div>
                  </template>
                </div>
              </td>
            </tr>
            </template>
          </tbody>
        </table>

        <div class="columns">
          <div class="column hor-right p-0">
            <button
              class="button is-primary has-icon"
              :disabled="!currentPayType || isReviewer"
              @click="openBeneficiaryModal('ADD', null)"
            >
              <span>新增受益人</span>
              <img src="/src/assets/images/icon-add.svg" alt="ADD" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </LifeCycleHook>
</template>
<script>
  export default {
    name: 'Overview',
    inheritAttrs: false,
    customOptions: {}
  };
</script>
<script setup>
  import { pausableWatch } from '@vueuse/core';
import { isEmpty } from 'lodash-es';
import { storeToRefs } from 'pinia';
import {
  apiIsPreferredMember,
  apiIsSemiAutoAction
} from '~/common/api';
import BasicInfo from '~/components/BasicInfo.vue';
import ErrorTippy from '~/components/Editable/ErrorTippy.vue';
import EllipseTippy from '~/components/EllipseTippy.vue';
import SortingThead from '~/components/SortingThead.vue';
import useMoment from '~/composables/useMoment.js';
import useSwal from '~/composables/useSwal';
import autoExecutStatus from '~/pages/master/components/Apply/Modals/AutoExecutStatus.vue';
import { useApplyStore } from '~/stores/apply';
import { useFooterStore } from '~/stores/footer.js';
import { useOverviewStore } from '~/stores/overview.js';
import { PayType } from '../../../../common/utils/enum';
import BaseDropdown from '../../../../components/BaseDropdown.vue';
import LifeCycleHook from '../../../../components/LifeCycleHook.vue';
import useModal from '../../../../composables/useModal';
import AddBeneficiaryModal from './Modals/AddBeneficiaryModal.vue';
import EditPolicyModal from './Modals/EditPolicyModal.vue';

  console.log('in the overview component');
  const props = defineProps({
    applyNo: {
      type: String,
      required: true
    }
  });

  const { isManager: isReviewer } = storeToRefs(useApplyStore());
  const { getROCDate } = useMoment();
  const { $swal } = useSwal();
  const { $m } = useModal();
  const overviewStore = useOverviewStore();
  const footerStore = useFooterStore();
  const isLoading = inject('isLoading');
  const applyStore = useApplyStore();

  // 客製化按鈕達成非同步需求
  const confirmAsyncCus = (title = '', confirmButtonText = '確定', text = '') => {
    const swalWithButtons = Swal.mixin({
      customClass: {
        confirmButton: 'button swal-primary'
      },
      buttonsStyling: false
    });
    return swalWithButtons.fire({
      icon: 'success',
      title,
      text,
      showDenyButton: false,
      confirmButtonText: confirmButtonText
    });
  };

  // 開啟自動化擬人
  try {
    // 是不是試點人員
    const response = await apiIsPreferredMember();
    const isPreferredMember = response.data.result;
    console.log('isPreferredMember=' + isPreferredMember);

    // 是不是可執行擬人(例：首次跑/重複跑)
    const response2 = await apiIsSemiAutoAction([props.applyNo]);
    const isSemiAutoAction = response2.data.result;
    console.log('isSemiAutoAction=' + isSemiAutoAction);

    if (isPreferredMember === 'Y' && isSemiAutoAction === 'Y') { // 走擬人
      $m.show({
          component: autoExecutStatus,
          id: '#autoExecutStatus',
          data: {
              aplyNo: props.applyNo,
              saveCallback: (cbrs) => { 
              console.log('autoExecutStatus callback=' + cbrs);
              if(cbrs === 'N') {
                // 呼叫API取得保單概況資料，呼叫 loading 畫面
                isLoading.value = true;
                readOverView();
              }
            }
          }
      });
    } else { // 走原流程
      isLoading.value = true;
      readOverView();
    } 
  } catch (e) {
    let prompt = await confirmAsyncCus("本件不符合擬人，請接續審理\n" + '保單確認前擬人檢核異常:' + e);
    if (prompt.isConfirmed) {
      isLoading.value = true;
      // 呼叫API取得保單概況資料
      readOverView();
    }
  }
  
  const {
    basicData,
    policies,
    deadDate,
    selectedPolicies,
    unselectedPolicies,
    disableSegmentationButton,
    disablePrepaymentButton,
    getBeneficiaries,
    isPageChanged,
    isGroupInsurance,
    currentPayType,
    polCfmTime,
    policiesOcr
  } = storeToRefs(overviewStore);

  // 設定Footer資料
  footerStore.setFooterData({
    applyNo: props.applyNo,
    ocrId: basicData.value.OCR_ID,
    ocrName: basicData.value.OCR_NAME,
    lifeGropClfy: basicData.value.LIFE_GROP_CLFY,
    pageKey: 'overview'
  });
  // 處理日期文字顏色
  const handleTextColor = (color) => (color === 'R' ? 'red' : 'black');

  // 點擊險別文字
  const onClickGetPolicyTerms = async (policy) => {
    window.open(`/servlet/HttpDispatcher/AAB3_1000/download?downloadFilePath=${policy.POLICY_TERMS_PATH}`);
  };
  // 點擊預付金紀錄
  const onClickPrepayment = () => {
    window.open(`/servlet/HttpDispatcher/AAI0_0701/prompt?OCR_ID=${basicData.value.OCR_ID}&ACTION_FROM=AAB1_0700`);
  };
  // 點擊保單分期
  const onClickSegmentation = () => {
    window.open(`/servlet/HttpDispatcher/AAB1_0410/prompt?APLY_NO=${props.applyNo}&DEAD_DATE=${deadDate.value}`);
  };
  // 點擊編輯保單
  const onClickEditPolicy = async () => {
    // 0729調整，加call AA_B3Z300.getEffPolicyInfoByCase並帶事故日
    try {
      overviewStore.showLoading();
      // let result = await overviewStore.getEffPolicyInfoByCase(props.applyNo, basicData.value.OCR_DATE);
      // if (!result.IS_SUCCESS) throw result.RTN_MSG;
      // 上面的拋RTN_MSG 已移至overview.js中進行
      let result = policiesOcr.value;
      const resultData = toRaw(result);

      $m.show({
        component: EditPolicyModal,
        id: 'editPolicy',
        data: { policies: resultData, applyNo: props.applyNo }
      });
    
      console.log('編輯保單彈窗資料');
      console.log(resultData);
      console.log('編輯保單彈窗資料');

    } catch (e) {
      $swal.fail(e);
    } finally {
      overviewStore.hideLoading();
    }
  };

  // 目前受益人清單的給付方式 => 改成抓overviewStore的currentPayType
  // const currentPayType = toRef(basicData.value, 'PAY_TYPE');
  // 受益人清單(取得全部受益人)
  const beneficiaries = computed(() => getBeneficiaries.value('0'));

  const showRoleName = computed(() => (applyStore.isLifeGroup && applyStore.reviewerInfo?.STEP_STS === '1'));

  const polCfmTimeStr = computed(() => polCfmTime.value);

  // 給付方式下拉選單
  const payTypeDropdown = ref(null);
  // 給付方式下拉選單選項
  const payTypeOptions = [
    {
      name: '請選擇',
      value: PayType.All,
      disabled: true,
      selected: !currentPayType.value
    },
    {
      name: '匯撥',
      value: PayType.Remit,
      selected: currentPayType.value === PayType.Remit
    },
    {
      name: '現金',
      value: PayType.Money,
      selected: currentPayType.value === PayType.Money
    },
    {
      name: '支票',
      value: PayType.Cheque,
      selected: currentPayType.value === PayType.Cheque
    }
  ];
  // 國際保險業務_給付方式下拉選單選項只能匯撥
    const payTypeOptionsIsOIU = [
    {
      name: '匯撥',
      value: PayType.Remit,
      selected: currentPayType.value === PayType.Remit
    }
  ];
  // 下拉選單切換，更新所有受益人給付方式
  const onPayTypeSelected = async (value) => {
    try {
      isLoading.value = true;
      let payTypeName = payTypeDropdown.value.selectedOption.name;
      const isUpdated = await overviewStore.changeBeneficiariesPayType(props.applyNo, value, payTypeName, beneficiaries.value);
      if (isUpdated) {
        currentPayType.value = value;
      } else {
        payTypeDropdown.value.setOption(currentPayType.value);
      }
    } catch (e) {
      $swal.fail(e);
      // 選單放回原本的值
      payTypeDropdown.value.setOption(currentPayType.value);
    } finally {
      isLoading.value = false;
    }
  };
  
  // 刪除受益人
  const deleteBeneficiary = async (beneficiary) => {
    let prompt = await $swal.confirmAsync('您確定要刪除這筆資料嗎？', '刪除');
    if (prompt.isConfirmed) {
      try {
        isLoading.value = true;
        let isDeleted = await overviewStore.deleteBeneficiary(props.applyNo, beneficiary);
        if (isDeleted) {
          $swal.success('刪除成功');
        }
      } catch (e) {
        $swal.fail(e);
      } finally {
        isLoading.value = false;
      }
    }
  };

  // 開啟新增/編輯受益人Modal
  const openBeneficiaryModal = (mode, editingBeneficiary) => {
    $m.show({
      component: AddBeneficiaryModal,
      id: 'beneficiaryModal',
      data: {
        mode, // 新增 or 編輯
        payType: currentPayType.value, // 給付方式
        editingBeneficiary, // 要編輯的受益人資料
        applyNo: props.applyNo // 受理編號
      }
    });
  };

  // 排序相關
  const sortSetting = reactive({
    selected: {
      sortKey: '',
      isSortDesc: null
    },
    unselected: {
      sortKey: '',
      isSortDesc: null
    }
  });

  const onClickSortSelected = (key) => {
    sortSetting.selected.sortKey = key;
    sortSetting.selected.isSortDesc = !sortSetting.selected.isSortDesc;
  };
  const onClickSortUnselected = (key) => {
    sortSetting.unselected.sortKey = key;
    sortSetting.unselected.isSortDesc = !sortSetting.unselected.isSortDesc;
  };

  // 條款重點檢核
  const onClickTermsPath = (path) => {
    window.open(path);
  };

  // 監聽頁面是否變更過
  const { stop, pause, resume } = pausableWatch(
    [policies, getBeneficiaries.value('0')],
    (v) => {
      isPageChanged.value = true;
      pause();
    },
    { deep: true }
  );

  // 20221101 洗錢資恐連結
  const onClickRiskLink = (beneficiary) => {
    window.open(`/AIWeb/servlet/HttpDispatcher/AIL0_1000/query?CUSTOMER_ID=${beneficiary.ACPT_ID}`);
    // 高風險的連結，需同時跳出三個頁面
    if (beneficiary.RISK_LEVEL.includes('高')) {
      const today = getROCDate(new Date(), 'MMDD', '');
      window.open(
        `/AIWeb/servlet/HttpDispatcher/AIL0_1300/query?QUERY_ID=${beneficiary.ACPT_ID}&QUERY_START_DATE=${today}&QUERY_END_DATE=${today}`
      );
      // window.open(`/AIWeb/servlet/HttpDispatcher/AIL0_1900/query?QRY_RECORD_TYPE=0&QRY_SAN=&NAME=${beneficiary.ACPT_NAME}`);
      console.log('>>ACPT_NAME=' + beneficiary.ACPT_NAME);
      postWindowOpen('/AIWeb/servlet/HttpDispatcher/AIL0_1900/query','QRY_RECORD_TYPE,0,QRY_SAN,,NAME,'+beneficiary.ACPT_NAME);
    }
  };

  const onClickDetailRiskLink = (leglData) => {
    let leglName = !isEmpty(leglData.CFM_LEGL_NAME)?leglData.CFM_LEGL_NAME:leglData.APLY_LEGL_NAME;
    let leglId = !isEmpty(leglData.CFM_LEGL_ID)?leglData.CFM_LEGL_ID:leglData.APLY_LEGL_ID;

    window.open(`/AIWeb/servlet/HttpDispatcher/AIL0_1000/query?CUSTOMER_ID=${leglId}`);
    // 高風險的連結，需同時跳出三個頁面
    if (leglData.LEGL_AIL0_RISK_LVL_NAME.includes('高')) {
      const today = getROCDate(new Date(), 'MMDD', '');
      window.open(
        `/AIWeb/servlet/HttpDispatcher/AIL0_1300/query?QUERY_ID=${leglId}&QUERY_START_DATE=${today}&QUERY_END_DATE=${today}`
      );
      
      postWindowOpen('/AIWeb/servlet/HttpDispatcher/AIL0_1900/query','QRY_RECORD_TYPE,0,QRY_SAN,,NAME,'+leglName);
    }
  };

  function postWindowOpen(url, data) {
    console.log('postWindowOpen url='+url);
    console.log('postWindowOpen data='+data);

    // input的key,value,key,value...
    var dataAry = data.split(',');
	  console.log('dataAry='+ dataAry.length);

    // 產生一個暫存的form
    var tempForm = document.createElement("form");
    tempForm.id = "tempForm1";
    tempForm.method = "get";
    tempForm.action = url;
    tempForm.target = 'newWin';
    tempForm.accept="BIG5";
    tempForm.acceptCharset="BIG5";

    // 產生hidden Input
    for(let i=0 ; i<dataAry.length ; i=i+2){
    	var hideInput = document.createElement("input");
      hideInput.type = "hidden";
      hideInput.name = dataAry[i];
      hideInput.value = dataAry[i+1];
     	// 把Input 放進 form
    	tempForm.appendChild(hideInput);
	  } 

    window.open('about:blank', 'newWin', 'hight=400, width=400, top=0, left=0, toolbar=yes, menubar=yes, scrollbars=yes, resizable=yes, location=yes, status=yes');

    document.body.appendChild(tempForm);
    tempForm.submit();
    document.body.removeChild(tempForm);
  }
  
  // UI JS
  const beneInfo = ref(null);
  let toggleMsgDetail = (e) => {
    let toggleButton = e.target.closest('.button.toggle');
    if (toggleButton) {
      let hiddenInfo = toggleButton.closest('tr').nextElementSibling;
      if (hiddenInfo && hiddenInfo.classList.contains('hidden-info')) {
        toggleButton.closest('tr').classList.toggle('selected');
        toggleButton.classList.toggle('expand');
        hiddenInfo.classList.toggle('is-hidden');
      }
    }
  };
  onMounted(() => {
    beneInfo.value.addEventListener('click', toggleMsgDetail);
  });

  onBeforeUnmount(() => {
    beneInfo.value.removeEventListener('click', toggleMsgDetail);
  });

  // 儲存資料
  const saveData = async (hasCallback) => {
    // 檢核畫面上是否有錯誤，hacky先判斷有沒有error class
    const mainSection = document.getElementById('mainSection');
    if (mainSection.querySelector('img.error-message')) {
      $swal.warning('資料有誤，請確認資料無誤後再次送出');
      return false;
    }

    // 暫時只show console log
    console.log('click save button!');
    try {
      isLoading.value = true;
      const saveResult = await overviewStore.savePageData(props.applyNo);
      console.log(saveResult);
      if (!saveResult.IS_SUCCESS) throw saveResult.RTN_MSG;
      // 沒callback再show成功
      if (!hasCallback) $swal.success(saveResult.RTN_MSG);
      // 更新儲存時間
      footerStore.setSaveTime({ trial: saveResult.CASE_FLOW_BTN_DT });
      isPageChanged.value = false;
      resume();
      return true;
    } catch (e) {
      $swal.fail(e);
      console.error(e);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  async function readOverView() {
    let { errorMessage, warningMessage } = await overviewStore.getAllData(props.applyNo);
    if (!isEmpty(errorMessage.trim())) {
      isLoading.value = false;
      $swal.fail(errorMessage);
    } else if (!isEmpty(warningMessage.trim())) {
      isLoading.value = false;
      $swal.warning(warningMessage); 
    } else {
      isLoading.value = false;
    }

    // 設定Footer資料
    footerStore.setFooterData({
      applyNo: props.applyNo,
      ocrId: basicData.value.OCR_ID,
      ocrName: basicData.value.OCR_NAME,
      lifeGropClfy: basicData.value.LIFE_GROP_CLFY,
      pageKey: 'overview'
    });
  }

</script>
