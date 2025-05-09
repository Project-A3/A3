<template>
  <div class="card half-card">
    <h2 class="sticky-basic-info"><cathay-translate code="Component_InsrdInfo_001"/></h2>
    <div class="columns non-sticky-columns has-flex-column">
      <div class="column">
        <span class="field"><cathay-translate code="Component_InsrdInfo_002" /></span>
        <span class="data">{{ basicData.INFORM_NUM }}</span>
      </div>
    </div>
    <div class="columns non-sticky-columns has-flex-column">
      <div class="column">
        <span class="field"><cathay-translate code="Component_InsrdInfo_003" /></span>
        <span class="data">{{ basicData.INSRD_POSTAL_CODE1 }}{{ basicData.INSRD_POSTAL_CODE2 }} {{ basicData.INSRD_ADDR }}</span>
      </div>
    </div>
    <div class="columns non-sticky-columns has-flex-column">
      <div class="column">
        <span class="field"><cathay-translate code="Component_InsrdInfo_004" /></span>
        <span class="data">{{ basicData.INSRD_POSTAL_CODE1 }}{{ basicData.INSRD_POSTAL_CODE2 }} {{ basicData.INSRD_ADDR }}</span>
      </div>
    </div>
    <div class="columns non-sticky-columns has-flex-column">
      <div class="column">
        <span class="field"><cathay-translate code="Component_InsrdInfo_005" /></span>
        <span class="data">{{ PHONE }}</span>
      </div>
    </div>
    <div class="columns non-sticky-columns has-flex-column">
      <div class="column">
        <span class="field"><cathay-translate code="Component_InsrdInfo_006" /></span>
        <span class="data">{{ basicData.INSRD_MOBILE }}</span>
      </div>
    </div>
    <div class="columns non-sticky-columns has-flex-column">
      <div class="column">
        <span class="field"><cathay-translate code="Component_InsrdInfo_007" /></span>
        <span class="data">{{ basicData.INSRD_EMAIL }}</span>
      </div>
    </div>
  </div>
</template>
<script setup>
  const props = defineProps({
    basicData: {
      type: Object,
      required: true
    }
  });
  
  const basicData = toRef(props, 'basicData');
  let theBasicData = basicData.value;
  let INSRD_PHONE_REGION = theBasicData.INSRD_PHONE_REGION;
  let INSRD_PHONE = theBasicData.INSRD_PHONE;
  let INSRD_EXTENSION = theBasicData.INSRD_EXTENSION;
  let PHONE = '';
  if (INSRD_PHONE_REGION && INSRD_PHONE) {
    PHONE = INSRD_PHONE_REGION + '-' + INSRD_PHONE;
    if (INSRD_EXTENSION) {
      PHONE += '#' + INSRD_EXTENSION;
    }
  } else if (INSRD_PHONE && INSRD_EXTENSION) {
    PHONE = INSRD_PHONE + '#' + INSRD_EXTENSION;
  } else if (INSRD_PHONE) {
    PHONE = INSRD_PHONE; 
  }

</script>
