<template>
    <div class="card sticky half-card">
        <div class="columns">
            <div class="column">
                <span class="field">Dữ liệu cơ bản của đại lý</span>
            </div>
        </div>
        <div class="columns non-sticky-columns has-flex-column">
            <div class="column">
                <span class="field">Mã đại lý</span>
                <span class="data">{{ basicData.TRUSTEE_EE_ID }}</span>
            </div>
            <div class="column">
                <span class="field">Họ tên</span>
                <span class="data">{{ basicData.TRUSTEE_NAME }}</span>
            </div>
        </div>
        <div class="columns non-sticky-columns has-flex-column">
            <div class="column">
                <span class="field">Điện thoại liên lạc</span>
                <span class="data">#</span>
            </div>
        </div>
        <div class="columns non-sticky-columns has-flex-column">
            <div class="column">
                <span class="field">Điện thoại di động</span>
                <span class="data">{{ basicData.TRUSTEE_MOBILE }}</span>
            </div>
        </div>
        <div class="columns non-sticky-columns has-flex-column">
            <div class="column">
                <span class="field">Email</span>
                <span class="data">{{ basicData.TRUSTEE_EMAIL }}</span>
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
