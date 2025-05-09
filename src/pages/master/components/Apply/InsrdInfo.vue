<template>
  <div class="card sticky">
    <div class="columns">
      <div class="column">
        <span class="field"><cathay-translate code="Component_InsrdInfo_001" /></span>
      </div>
    </div>
    <div class="columns non-sticky-columns has-flex-column">
      <div class="column">
        <span class="field"><cathay-translate code="Component_InsrdInfo_002" /></span>
        <span class="data">{{ basicData.INFORM_NUM }}</span>
      </div>
    </div>
    <div class="columns non-sticky-columns has-flex-column">
      <div class="column">
        <span class="field"><cathay-translate code="Component_InsrdInfo_003" /></span>
        <span class="data">{{ basicData.INSRD_POSTAL_CODE1 }}{{ basicData.INSRD_POSTAL_CODE2 }} {{ basicData.INSRD_ADD_PART1 }}{{ basicData.INSRD_ADD_PART2 }}{{ basicData.INSRD_ADD_PART3 }}{{ basicData.INSRD_ADD_PART4 }}{{ basicData.INSRD_ADD_PART5 }}{{ basicData.INSRD_ADD_PART6 }}{{ basicData.INSRD_ADD_PART7 }}{{ basicData.INSRD_ADD_PART8 }}</span>
      </div>
    </div>
    <div class="columns non-sticky-columns has-flex-column">
      <div class="column">
        <span class="field"><cathay-translate code="Component_InsrdInfo_004" /></span>
        <span class="data">{{ basicData.REQUEST_ADDRESS }}</span>
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
    <div class="columns non-sticky-columns has-flex-column">
        <div class="column">
          <span class="field">a</span>
          <span class="data">a</span>
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
