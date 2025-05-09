<template>
    <div class="card sticky half-card">
        <div class="columns">
            <div class="column">
                <span class="field">Khác</span>
            </div>
        </div>
        <div class="columns non-sticky-columns has-flex-column">
            <div class="column">
                <span class="field">Nhân viên tiếp nhận</span>
                <span class="data">{{ basicData.ID_PROCESS_EE }} {{ basicData.ID_PROCESS_EE_NAME }}</span>
            </div>
            <div class="column">
                <span class="field">Ngày thụ lý</span>
                <span class="data">{{ getROCDate(basicData.PROCESS_DATE) }}</span>
            </div>
        </div>
        <div class="columns non-sticky-columns has-flex-column">
            <div class="column">
                <span class="field">Đơn vị tiếp nhận</span>
                <span class="data">{{ basicData.ACCEPT_DIV_NO_1 }} {{ basicData.ACCEPT_DIV_NO_2 }}</span>
            </div>
        </div>
        <div class="columns non-sticky-columns has-flex-column">
            <div class="column">
                <span class="field">Tiến độ bồi thường</span>
                <span class="data">{{ CLAIM_STATUS }}</span>
            </div>
        </div>
        <div class="columns non-sticky-columns has-flex-column">
            <div class="column">
                <span class="field">Tự giải quyết và chuyển đi</span>
                <span class="data" v-if="basicData.AUTO_CHK_TRANSF_IND === '0'">自核 Tự kiểm tra</span>
                <span class="data" v-if="basicData.AUTO_CHK_TRANSF_IND === '1'">轉送 Chuyển đi</span>
                <span class="data" v-if="basicData.AUTO_CHK_TRANSF_IND === '2'">自核轉送 Tự kiểm tra chuyển đia</span>

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

let CLAIM_STATUS = theBasicData.CLAIM_STATUS
if (CLAIM_STATUS == 10) {
    CLAIM_STATUS = '受理 Thụ lý'
} else if (CLAIM_STATUS == 15) {
    CLAIM_STATUS = '不全 Hồ sơ thiếu'
} else if (CLAIM_STATUS == 20) {
    CLAIM_STATUS = '確認 Xác nhận hồ sơ'
} else if (CLAIM_STATUS == 40) {
    CLAIM_STATUS = '核定 Xem xét đánh giá'
} else if (CLAIM_STATUS == 45) {
    CLAIM_STATUS = '退回 Hoàn trả nội bộ'
} else if (CLAIM_STATUS == 50) {
    CLAIM_STATUS = '核付 Phê duyệt'
} else if (CLAIM_STATUS == 80) {
    CLAIM_STATUS = '部分結案 Kết thúc một phần hồ sơ'
} else if (CLAIM_STATUS == 90) {
    CLAIM_STATUS = '結案 Kết thúc hồ sơ'
} else if (CLAIM_STATUS == 91) {
    CLAIM_STATUS = '作廢 Báo huỷ'
} 
</script>
