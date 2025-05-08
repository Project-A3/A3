<template>
  <div class="card risk-card" ref="riskMainArea">
    <!-- 展開/收合 Button -->
    <button class="card-toggle-btn is-blue expand"></button>

    <div class="card-title">
      <h3 class="mr-1">
        作業風險 <ErrorTippy v-if="!riskInfo.IsValid" :errors="['請確認資料都有正確填寫']"></ErrorTippy> ({{ riskCounts }})
      </h3>
      <EllipseTippy v-for="riskTag in riskTags" :content="riskTag.TAG_INFO" disableEllipse>
        <div :class="homeStore.getTagColorClass(riskTag.TAG_COLOR)">{{ riskTag.TAG_NAME }}</div>
      </EllipseTippy>
    </div>
    <div class="card-title">
      <h3 v-if="riskScore.HAS_V011 === 'Y' & riskScore.IS_CRSS2_PILOT_ID != 'Y'" class="mr-1" :style="{ color: `${getScoreColor(riskScore.H_RISK)}` }">
        風險評分：{{ riskScore.TOT_SCOR}}&nbsp;&nbsp;{{ riskScore.RISK_LVL}}
        <!-- <a href="#" @click.stop.prevent="onRiskScore(riskScore.RISK_LINK_PATH2)"><img src="/src/assets/images/icon-btn-openweb.svg" /></a> -->
        <a v-if="riskScore.H_RISK === 'Y' || riskScore.H_RISK === 'H'" href="#" @click.stop.prevent="openRiskScoreModal(riskScore.CRSS3_HIGH_ALERT)"><img src="/src/assets/images/icon-btn-openweb.svg" /></a>
      </h3>
      <h3 v-if="riskScore.IS_CRSS2_DONE === 'Y'" class="mr-1" :style="{ color: `${getScoreColor(riskScore.CRSS2_RISK_LEVEL)}` }">
        風險評分：{{ riskScore.CRSS2_RISK_NAME}}
        <!-- <a href="#" @click.stop.prevent="onRiskScore(riskScore.RISK_LINK_PATH)"><img src="/src/assets/images/icon-btn-openweb.svg" /></a> -->
        <a v-if="riskScore.CRSS2_RISK_LEVEL === 'Y' || riskScore.CRSS2_RISK_LEVEL === 'H'" href="#" @click.stop.prevent="openRiskScoreModal(riskScore.CRSS3_HIGH_ALERT)"><img src="/src/assets/images/icon-btn-openweb.svg" /></a>
      </h3>
    </div>


    <!-- 收合時 Hidden 區塊-->
    <div class="hidden-parts">
      <Tabs class="risk-tabs">
        <RiskTab
          :title="`保戶(${riskInfo.INS_RISK_INFO.length})`"
          :dataList="riskInfo.INS_RISK_INFO"
          :disabled="riskInfo.INS_RISK_INFO.length === 0"
          :isActive="riskInfo.INS_RISK_INFO.length > 0 | 
                    (riskInfo.AGT_RISK_INFO.length === 0 & riskInfo.DIS_RISK_INFO.length === 0 & riskInfo.HOSP_RISK_INFO.length === 0)"
        ></RiskTab>
        <RiskTab
          :title="`業務員(${riskInfo.AGT_RISK_INFO.length})`"
          :dataList="riskInfo.AGT_RISK_INFO"
          :disabled="riskInfo.AGT_RISK_INFO.length === 0"
          :isActive="riskInfo.INS_RISK_INFO.length === 0 & riskInfo.AGT_RISK_INFO.length > 0"
        ></RiskTab>
        <RiskTab
          :title="`疾病(${riskInfo.DIS_RISK_INFO.length})`"
          :dataList="riskInfo.DIS_RISK_INFO"
          :disabled="riskInfo.DIS_RISK_INFO.length === 0"
          :isActive="riskInfo.INS_RISK_INFO.length === 0 & riskInfo.AGT_RISK_INFO.length === 0 & riskInfo.DIS_RISK_INFO.length > 0"
        ></RiskTab>
        <RiskTab
          :title="`醫院/醫師(${riskInfo.HOSP_RISK_INFO.length})`"
          :dataList="riskInfo.HOSP_RISK_INFO"
          :disabled="riskInfo.HOSP_RISK_INFO.length === 0"
          :isActive="riskInfo.INS_RISK_INFO.length === 0 & riskInfo.AGT_RISK_INFO.length === 0 & riskInfo.DIS_RISK_INFO.length === 0 & 
                    riskInfo.HOSP_RISK_INFO.length > 0"
        ></RiskTab>
      </Tabs>
    </div>
  </div>
</template>

<script setup>
  import { storeToRefs } from 'pinia';
  import { useDecisionStore } from '~/stores/decision';
  import EllipseTippy from '../EllipseTippy.vue';
  import Tabs from '../Tabs/Tabs.vue';
  import RiskTab from './RiskTab.vue';
  import ErrorTippy from '../Editable/ErrorTippy.vue';
  import { toggleCard } from '~/common/utils';
  import { useHomeStore } from '~/stores/home';
  import useModal from '~/composables/useModal';
  import useSwal from '~/composables/useSwal';
  import RiskScoreModal from './Modals/RiskScoreModal.vue';
  const { $swal } = useSwal();
  const { $m } = useModal();

  const homeStore = useHomeStore();
  const decisionStore = useDecisionStore();
  const { riskTags, riskScore, riskCounts, riskInfo } = storeToRefs(decisionStore);
  const applyNo = inject('ApplyNo');

  const getScoreColor = (type) => ( (type === 'Y') | (type === 'H') ? 'red' : '#6fba2a');

  const onRiskScore = (linkPath) => {
    window.open(linkPath);
  };
  const openRiskScoreModal = async (CRSS3_HIGH_ALERT) => {
    try {
      decisionStore.showLoading();
      const data = await decisionStore.getRiskTags3(applyNo, CRSS3_HIGH_ALERT);

      $m.show({
        component: RiskScoreModal,
        id: 'riskScoreModal',
        data: data
      });
    } catch (e) {
      $swal.fail(e);
    } finally {
      decisionStore.hideLoading();
    }
  };

  const riskMainArea = ref(null);

  onMounted(() => {
    toggleCard(riskMainArea.value);
  });
</script>

<style lang="scss" scoped>
  .risk-tabs {
    & > section .tab-content .part:nth-child(1) {
      border: none;
    }
  }
</style>
