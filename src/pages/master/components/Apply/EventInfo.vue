<template>
  <div class="card is-full">
    <div class="columns">
      <div class="column">
        <span class="field">Dữ liệu sự kiện và loại yêu cầu</span>
      </div>
    </div>
    <div class="columns non-sticky-columns has-flex-column">
      <div class="column">
        <span class="field">Loại bồi thường</span>
        <span class="data">{{ basicData.INFORM_NUM }}</span>
      </div>
      <div class="column">
        <span class="field">Nguyên nhân sự kiện</span>
        <span class="data">{{ basicData.INFORM_NUM }}</span>
      </div>
      <div class="column">
        <span class="field">Mô tả về sự kiện</span>
        <span class="data">{{ basicData.INFORM_NUM }}</span>
      </div>
      <div class="column">
        <span class="field">Ngày yêu cầu</span>
        <span class="data"></span>
      </div>
    </div>
    <div class="columns non-sticky-columns has-flex-column">
      <div class="column">
        <span class="field">Loại quyền lợi</span>
        <span class="data">{{ basicData.INFORM_NUM }}</span>
      </div>
      <div class="column">
      </div>
      <div class="column">
        <span class="field">Ngày xảy ra sự kiện</span>
        <span class="data">{{ basicData.INFORM_NUM }}</span>
      </div>
      <div class="column">
        <span class="field">Mức độ sự cố</span>
        <span class="data"></span>
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
