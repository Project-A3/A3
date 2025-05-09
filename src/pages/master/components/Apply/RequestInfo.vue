<template>
    <div class="card sticky">
        <div class="columns">
            <div class="column">
                <span class="field">Dữ liệu cơ bản của người yêu cầu</span>
            </div>
        </div>
        <div class="columns non-sticky-columns has-flex-column">
            <div class="column">
                <span class="field">Mối quan hệ của người yêu cầu</span>
                <span class="data">{{ basicData.INFORM_NUM }}</span>
            </div>
        </div>
        <div class="columns non-sticky-columns has-flex-column">
            <div class="column">
                <span class="field">Tên người yêu cầu</span>
                <span class="data">{{ basicData.REQUEST_NAME }}</span>
            </div>
            <div class="column">
                <span class="field">Ngày sinh</span>
                <span class="data">{{ basicData.REQUEST_BIRTH_DATE }}</span>
            </div>
        </div>
        <div class="columns non-sticky-columns has-flex-column">
            <div class="column">
                <span class="field">Loại giấy chứng nhận</span>
                <span class="data">
                    <BaseDropdown :options="dropdownCertificateOptions" :onSelected="onDropdownSelected" class="is-primary">
                    </BaseDropdown>
                </span>
            </div>
            <div class="column">
                <span class="field">Mã giấy chứng nhận</span>
                <span class="data">
                    <FormInput type="text" class="w-160" ></FormInput>
                </span>
            </div>
        </div>
        <div class="columns non-sticky-columns has-flex-column">
            <div class="column">
                <span class="field">Địa chỉ liên lạc</span>
                <span class="data">
                    <FormInput type="text" class="w-160" ></FormInput>
                </span>
            </div>
        </div>
        <div class="columns non-sticky-columns has-flex-column">
            <div class="column">
                <span class="field">Điện thoại liên lạc</span>
                <span class="data">                     
                    <FormInput type="text" class="w-160" ></FormInput>
                </span>
            </div>
        </div>
        <div class="columns non-sticky-columns has-flex-column">
            <div class="column">
                <span class="field">Điện thoại di động</span>
                <span class="data">                    
                    <FormInput type="text" class="w-160" ></FormInput>
                </span>
            </div>
        </div>
        <div class="columns non-sticky-columns has-flex-column">
            <div class="column">
                <span class="field">Email</span>
                <span class="data">
                    <FormInput type="text" class="w-160" ></FormInput>
                </span>
            </div>
        </div>
    </div>
</template>
<script setup>
import BaseDropdown from '~/components/BaseDropdown.vue';
import { storeToRefs } from 'pinia';
import { useApplyStore } from '~/stores/apply';
import FormInput from '~/components/Form/FormInput.vue';

const props = defineProps({
    basicData: {
        type: Object,
        required: true
    }
});
const applyStore = useApplyStore();
const {
    dropdownCertificateOptions,
} = storeToRefs(applyStore);

const basicData = toRef(props, 'basicData');
let theBasicData = basicData.value;
// let INSRD_PHONE_REGION = theBasicData.INSRD_PHONE_REGION;

</script>