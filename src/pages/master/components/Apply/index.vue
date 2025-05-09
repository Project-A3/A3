<template>
   <!--先註解 <LifeCycleHook :onKeydownSave="saveData">
    <LifeCycleHook>-->
    <SubHeader></SubHeader>
   
    <BasicInfo :basicData="basicData" :applyNo="props.applyNo"></BasicInfo>

    <div style="display: flex">
      <InsrdInfo :basicData="basicData" style="flex: 1;"></InsrdInfo>
      <RequestInfo :basicData="basicData" style="flex: 1;"></RequestInfo>
    </div>

    <EventInfo :basicData="basicData"></EventInfo>

    <div style="display: flex">
      <TrusteeInfo :basicData="basicData" style="flex: 1;"></TrusteeInfo>
      <OtherInfo :basicData="basicData" style="flex: 1;"></OtherInfo>
    </div>

    <!-- <div style="display: flex; gap: 16px; width: 100%;">
      <TrusteeInfo :basicData="basicData" style="flex: 1;"></TrusteeInfo>
      <TrusteeInfo :basicData="basicData" style="flex: 1;"></TrusteeInfo>
    </div>

    <div style="display: flex; gap: 16px; width: 100%;">
      <TrusteeInfo :basicData="basicData" style="flex: 1;"></TrusteeInfo>
      <TrusteeInfo :basicData="basicData" style="flex: 1;"></TrusteeInfo>
    </div> -->
    <!--其他
    <OtherInfo :basicData="basicData"></OtherInfo>-->

    <!--先註解  Second Card 事故/索賠資料
    <ClaimArea :claimData="claimData"></ClaimArea> -->

    <!--先註解  Third Card 診斷書
    <DiagArea :diagData="diagData"></DiagArea> -->

    <!--先註解  Fourth Card 收據
    <ReceiptArea :receiptData="receiptData"></ReceiptArea> -->

    <!--先註解  Sixth Card 實物給付
    <InKindPayArea :inKindPayData="inKindPayData"></InKindPayArea> -->
    
    <!--先註解 Fifth Card 大額給付
    <HighSettlementArea :highSettlementData="highSettlementData"></HighSettlementArea> 
  </LifeCycleHook>-->
  <!--先註解 checkbox preload
  <div class="is-none">
    <label>
      <input type="checkbox" />
      <span></span>
    </label>
    <label>
      <input type="checkbox" checked />
      <span></span>
    </label>
  </div> -->
</template>
<script>
  /*先註解 export default {
    name: 'Apply',
    inheritAttrs: false,
    customOptions: {}
  };*/
</script>
<script setup>
//先註解 import { isEmpty } from 'lodash-es';
import { storeToRefs } from 'pinia';
import BasicInfo from '~/components/BasicInfo.vue';
import InsrdInfo from './InsrdInfo.vue';
import TrusteeInfo from './TrusteeInfo.vue';
import RequestInfo from './RequestInfo.vue';
import EventInfo from './EventInfo.vue';
/*先註解 import TrusteeInfo from '~/components/TrusteeInfo.vue';
import OtherInfo from '~/components/OtherInfo.vue';
import LifeCycleHook from '~/components/LifeCycleHook.vue';
import useSwal from '~/composables/useSwal';*/
import { useApplyStore } from '~/stores/apply';
/*先註解 import { useDecisionStore } from '~/stores/decision';
import { useFooterStore } from '~/stores/footer';
import ClaimArea from './ClaimArea.vue';
import DiagArea from './DiagArea.vue';
import HighSettlementArea from './HighSettlementArea.vue';
import InKindPayArea from './InKindPayArea.vue';
import ReceiptArea from './ReceiptArea.vue';*/
import SubHeader from './SubHeader.vue';
import OtherInfo from './OtherInfo.vue';

const props = defineProps({
    applyNo: {
      type: String,
      required: true
    }
  });

  //先註解 const { $swal } = useSwal();
  //先註解 const footerStore = useFooterStore();
  const applyStore = useApplyStore();
  /*先註解 const decisionStore = useDecisionStore(); */

  // 改成在[page]呼叫
  // const isLoading = inject('isLoading');
  // isLoading.value = true;
  // // 呼叫API取得申請資料
  // let message = await applyStore.getAllData(props.applyNo);
  // if (!isEmpty(message.trim())) $swal.fail(message);
  // isLoading.value = false;
  //先註解 const { basicData, claimData, diagData, receiptData, highSettlementData, inKindPayData, isLifeSchool } = storeToRefs(applyStore);
  const { basicData } = storeToRefs(applyStore);

  
  // 重新讀取基本資料
  applyStore.showLoading();
  await applyStore.getBasicData(props.applyNo);
  applyStore.hideLoading();
  
/* 先註解
  // 設定Footer資料
  footerStore.setFooterData({
    applyNo: props.applyNo,
    ocrId: basicData.value.OCR_ID,
    ocrName: basicData.value.OCR_NAME,
    lifeGropClfy: basicData.value.LIFE_GROP_CLFY,
    pageKey: 'apply'
  });

  // 儲存邏輯
  const saveData = async (hasCallback) => {
    try {
      let chkMessage = '';

      //檢核學團險件保單號碼
      if (isLifeSchool.value) {
        let checkResult = await applyStore.checkHPolicyNo();

        if (!checkResult.IS_SUCCESS){
          chkMessage += checkResult.RTN_MSG + '\n';
        }
      }

      // 檢核畫面上是否有錯誤，hacky先判斷有沒有error class
      const mainSection = document.getElementById('mainSection');
      if (mainSection.querySelector('img.error-message')) {
        $swal.warning('資料有誤，請確認資料無誤後再次送出');
        return false;
      }

      applyStore.showLoading();
      let result = await applyStore.savePageData(props.applyNo);
      // 成功
      if (result.IS_SUCCESS) {
        // LICXS-693 調整為不論是按 儲存審理進度 或 切換頁籤 成功時都顯示訊息
        // if (!hasCallback) $swal.success(chkMessage + result.RTN_MSG);
        $swal.success(chkMessage + result.RTN_MSG);
        footerStore.setSaveTime({ trial: result.CASE_FLOW_BTN_DT });

        // 儲存申請資料連動決策引導處理
        updateDCNTData(result);
       
        // 儲存申請資料連動作業風險處理
        updateRiskInfo(result);

        return true;
      }
      // 失敗
      if (result.ERR_CODE !== '-301') throw result.RTN_MSG;

      // 失敗，但需跳確認視窗確認 "ERR_CODE":"-301"
      applyStore.hideLoading();

      // 若 QUES_TYPE 非 X，則表示要先跳出的訊息視窗，可以選擇是 or 否
      if (result.QUES_TYPE !== 'X' && result.QUES_MSG) {
        let promptTitle = '請確認';
        switch (result.QUES_TYPE) {
          case 'A':
            promptTitle = '試點規劃申請資料檢核失敗';
            break;
          default:
            break;
        }
        let prompt = await $swal.confirmAsync(promptTitle, '確定', result.QUES_MSG);
        // User選擇是，若之前回傳內容有傳 QUES_TYPE，則要帶入之前回傳內容
        if (prompt.isConfirmed) {
          applyStore.showLoading();
          let saveAgainResult = await applyStore.savePageData(props.applyNo, result.QUES_TYPE, 'Y');
          if (saveAgainResult.IS_SUCCESS) {
            $swal.success(saveAgainResult.RTN_MSG);
            // 試點規劃申請資料檢核失敗，同意切換至舊系統
            if (result.QUES_TYPE === 'A') {
              setTimeout(() => {
                location.href = `/servlet/HttpDispatcher/AAA0_0800/prompt?LINK_PARAM=${props.applyNo}`;
              }, 300);
            }
            return true;
          } else {
            $swal.fail(saveAgainResult.RTN_MSG);
            return false;
          }
        } else {
          $swal.warning('未儲存畫面資料，請再確認');
          return false;
        }
      } else {
        let prompt = await $swal.confirmAsync('欄位異動', '確定', result.RTN_MSG);
        if (prompt.isConfirmed) {
          applyStore.showLoading();
          // 呼叫儲存異動API
          let confirmResult = await applyStore.saveReDealPageData(result.DATA);
          if (!confirmResult.IS_SUCCESS) throw confirmResult.RTN_MSG;
          // 更新儲存時間
          footerStore.setSaveTime({ trial: confirmResult.CASE_FLOW_BTN_DT, decision: confirmResult.DCNT_BTN_DT });
          // 決策引導連動處理
          if (confirmResult.IS_RISK === 'Y') {
            decisionStore.setRiskInfo(confirmResult.riskInfo);
          }
          if (confirmResult.IS_DCNT === 'Y') {
            decisionStore.setDCNTData(confirmResult.dcntInfo);
          } else if (confirmResult.IS_DCNT === 'E') {
            decisionStore.closeDecision();
          }
          $swal.success(confirmResult.RTN_MSG);
          return true;
        } else {
          $swal.warning('未儲存畫面資料，請再確認');
          return false;
        }
      }
    } catch (e) {
      $swal.fail(e);
      console.error(e);
      return false;
    } finally {
      applyStore.hideLoading();
    }
  };

  const updateDCNTData = async (saveResult) => {
    const preDcntId = decisionStore.DCNTData.DCNT_ID;
    const dcntType = saveResult.DCNT_TYPE;
    const dcntInfo = saveResult.dcntInfo;
    const dcntId = dcntInfo.DCNT_ID;

    // console.log('preDcntId', preDcntId);
    // console.log('DCNT_ID',dcntId);

    let onDCNT = dcntType === '1' || (dcntType === '0' && isEmpty(preDcntId) && !isEmpty(dcntId) );
    let chgDCNT = dcntType === '2' || (dcntType === '0' && !isEmpty(preDcntId) && !isEmpty(dcntId) && preDcntId != dcntId);
    let offDCNT = dcntType === '3' || (dcntType === '0' && !isEmpty(preDcntId) && isEmpty(dcntId));

    // console.log('onDCNT',onDCNT);
    // console.log('chgDCNT',chgDCNT);
    // console.log('offDCNT',offDCNT);

    if(onDCNT){
      applyStore.hideLoading();
      
      let prompt = await $swal.confirmAsync('已修改申請資料欄位，是否要清空簽呈內容開啟決策引導?');
      if (prompt.isConfirmed) {
        decisionStore.saveDCNT(dcntInfo);
        decisionStore.refreshDecision(dcntInfo);  
      } else {
        decisionStore.DCNTData.REASON = '理賠人員選擇不開啟';
        decisionStore.saveDCNT(decisionStore.DCNTData);
      }
    }
    
    if(chgDCNT || offDCNT){
      decisionStore.refreshDecision(dcntInfo);
    }
  };

  const updateRiskInfo = async (saveResult) => {
    const riskType = saveResult.RISK_TYPE;
    const riskInfo = saveResult.riskInfo;

    let onRiskinfo = riskType === '1';
    let offRiskinfo = riskType === '2';

    if(onRiskinfo || offRiskinfo){
      decisionStore.refreshRiskinfo(riskInfo);
    }
  };*/
  // onMounted(async () => {
  //   // preload image
  //   let image = new Image();
  //   image.src = '/src/assets/images/checkbox-checked.svg';

  //   let image2 = new Image();
  //   image2.src = '/src/assets/images/checkbox-off.svg';
  // });
</script>
