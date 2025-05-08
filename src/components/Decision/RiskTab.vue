<template>
  <Tab :title="props.title" :isActive="props.isActive" :disabled="props.disabled">
    <div class="part" v-for="data in dataList" :key="data.SER_NO">
      <h3>
        <span class="font-eudc">{{ data.RISK_TITLE }}</span>
      </h3>
      <p v-if="data.SER_NO === 'IAA'">
      檢核客戶通訊資料(手機/email/市話/地址)問題，<span @click="openRiskModal(data)">詳細原因請點按</span><br/>
      請與經手人或客戶確認，並擇一方式處理：<br/>
      一、同意：<br/>
          <div style="margin-left: 30px;">
          1.修改通訊資料：確認後請於「理賠特殊修正」，提出「理賠案件聯絡資訊修改」類別修正。<br/>
          2.補全聲明書：請補全「聯絡資料確認聲明書」請客戶簽署，並註明原因(親屬同住共用市話或地址)。<br/>
          3.人事建檔：確認客戶與員工為一等親家人，須補建檔。(內勤聯繫人資，外勤聯繫業管單位)<br/>
          </div>
      二、不同意：<br/>
          <div style="margin-left: 30px;">
          確認及軌跡留存：非上述處理方式，請於工作底稿註記原因及處理方式。<br/>
          </div>
      </p>
      <p v-else>
        <span class="font-eudc">{{ data.RISK_NAME_STR }}</span>
        <span @click="openRiskModal(data)">{{ data.RISK_NAME_CNT }}</span>
        <span class="font-eudc">{{ data.RISK_NAME_END }}</span>
      </p>
      <template v-if="!readonly">
        <div class="button-group">
          <OptionButton :isActive="data.OPINION === 'Y'" @click.native="onClickOpinion(data, 'Y')">同意</OptionButton>
          <OptionButton :isActive="data.OPINION === 'N'" @click.native="onClickOpinion(data, 'N')">不同意</OptionButton>
        </div>
        <textarea
          v-if="data.OPINION === 'N'"
          v-model="data.DSAG_RESN"
          @change="decisionStore.markModified"
          type="text"
          class="disagree-input font-eudc"
          :class="{ 'is-error': data.ERROR }"
          :placeholder="data.SER_NO === 'IAA'?'請輸入不同意原因，例：12/31已聯繫客戶說明，因久居國外留存親友地址，故客戶本次暫不修改通訊資料。':'請輸入不同意原因'"
          @blur="decisionStore.validateRiskInfo(data)"
        />
        <p v-if="data.ERROR" class="error-message"><img src="/src/assets/images/icon-warn.svg" alt="ERROR" />{{ data.ERROR }}</p>
      </template>
      <div class="result  font-eudc" v-else>
        <p>{{ data.OPINION === 'N' ? '不' : '' }}同意。{{ data.DSAG_RESN }}</p>
      </div>
    </div>
  </Tab>
</template>

<script setup>
  import useModal from '~/composables/useModal';
import { useDecisionStore } from '~/stores/decision';
import Tab from '../Tabs/Tab.vue';
import RiskModal from './Modals/RiskModal.vue';
import OptionButton from './OptionButton.vue';
  const decisionStore = useDecisionStore();
  const readonly = computed(() => decisionStore.isReadonly);
  const { $m } = useModal();
  const props = defineProps({
    dataList: {
      type: Array,
      required: true,
      default: []
    },
    title: {
      type: String,
      required: true,
      default: ''
    },
    isActive: {
      type: Boolean,
      required: false,
      default: false
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  });

  const onClickOpinion = (data, value) => {
    data.OPINION = value;
    if (value === 'Y') {
      data.ERROR = '';
      data.DSAG_RESN = ''; // 清除原因

      // 通訊資料待確認，開啟畫面AAJ0_0100
      if(data.SER_NO === 'IAA') {
        window.open(`/servlet/HttpDispatcher/AAJ0_0100/prompt`);
      }
    }
    decisionStore.markModified();
  };

  const openRiskModal = (riskData) => {
    $m.show({
      component: RiskModal,
      id: 'riskModal',
      data: riskData
    });
  };
</script>

<style lang="scss" scoped>
  .result {
    font-size: 16px;
    font-weight: 600;
    color: #2372bc;
  }
</style>
