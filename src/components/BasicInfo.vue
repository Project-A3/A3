<template>
  <div class="card is-full first-card sticky base-info-area">
    <div class="columns case-info">
      <div class="column">
        <a class="has-text-primary" :href="`/servlet/HttpDispatcher/AAM4_0300/viewer4iClaim?PROCESS_NUM=${applyNo}`" target="_blank">
          <cathay-translate code="Component_BasicInfo_001" /> {{ applyNo }}
        </a>
      </div>
    </div>
    <div class="columns non-sticky-columns has-flex-column">
      <div class="column">
          <span class="field mr-12"><cathay-translate code="Component_BasicInfo_002" /></span>
          <span class="data font-eudc">{{ basicData.INSURED_NAME }}</span>
      </div>
      <div class="column">
        <span class="field"><cathay-translate code="Component_BasicInfo_003" /></span>
        <span class="data" v-if="basicData.INSURED_CERTI_TYPE === '1'"><cathay-translate code="Component_BasicInfo_008" /></span>
        <span class="data" v-else-if="basicData.INSURED_CERTI_TYPE === '2'"><cathay-translate code="Component_BasicInfo_009" /></span>
        <span class="data" v-else-if="basicData.INSURED_CERTI_TYPE === '3'"><cathay-translate code="Component_BasicInfo_010" /></span>
        <span class="data" v-else-if="basicData.INSURED_CERTI_TYPE === '4'"><cathay-translate code="Component_BasicInfo_011" /></span>
        <span class="data" v-else>{{ basicData.INSURED_CERTI_TYPE }}</span>
      </div>
      <div class="column">
        <span class="field mr-12"><cathay-translate code="Component_BasicInfo_004" /></span>
        <span class="data">{{ basicData.INSURED_ID }}</span>
      </div>
      <div class="column ml-5">
        <span class="field mr-12"><cathay-translate code="Component_BasicInfo_005" /></span>
        <span class="data">
          {{ getROCDate(basicData.REQUEST_BIRTH_DATE) }} (<span :class="{ 'has-text-danger': ocrAge < 18 }"> {{ ocrAge }} <cathay-translate code="Component_BasicInfo_006" /></span>)
        </span>
      </div>
      <div class="column ml-5">
        <span class="field"><cathay-translate code="Component_BasicInfo_007" /></span>
        <span class="data font-eudc">{{ basicData.CTN_SNAME }}</span>
      </div>
      <div class="column">
        <div v-for="tag in basicData.CASE_TAG" class="tag sticky-tags" :key="tag.TAG_NAME">
          {{ tag.TAG_NAME }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import useMoment from '~/composables/useMoment.js';

  const { getROCDate, getOcrAge } = useMoment();
  const props = defineProps({
    basicData: {
      type: Object,
      required: true
    },
    applyNo: {
      type: String,
      required: true
    },
    claimData: {
      type: Object,
      required: true,
      default: {}
    }
  });
  
  const basicData = toRef(props, 'basicData');
  const applyNo = toRef(props, 'applyNo');
  const claimData = toRef(props, 'claimData');
  const ocrAge = computed(() => getOcrAge(claimData.value.INSURED_DATE, basicData.value.REQUEST_BIRTH_DATE));

</script>
