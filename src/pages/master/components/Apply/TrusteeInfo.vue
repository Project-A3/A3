<template>
    <div class="card half-card">
        <h2 class="sticky-basic-info">Dữ liệu cơ bản của đại lý</h2>

        <div class="columns non-sticky-columns has-flex-column">
            <div class="column">
                <span class="field">Mã đại lý</span>
                <div style="display: flex; align-items: center;">
                    <FormInput type="text" class="w-330" v-model="basicData.TRUSTEE_EE_ID"></FormInput>
                    <button 
                        type="button" 
                        class="button is-primary" 
                        style="margin-left: 8px;" 
                        @click="fetchTrusteeEEID"
                        >
                        Tìm
                    </button>
                </div>
            </div>
            <div class="column">
                <span class="field">Họ tên</span>
                <FormInput type="text" class="w-330" v-model="basicData.TRUSTEE_NAME"></FormInput>
            </div>
        </div>
        <div class="columns non-sticky-columns has-flex-column">
            <div class="column">
                <span class="field">Điện thoại liên lạc</span>
                <div style="display: flex; align-items: center;">
                    <EditableInput  
                        :inputStyle="{
                            width: '80px'
                        }"
                        type="text" 
                        v-model="basicData.TRUSTEE_PHONE_REGION"
                    ></EditableInput>
                    -
                    <EditableInput 
                        type="text" 
                        v-model="basicData.TRUSTEE_PHONE"
                        :inputStyle="{
                            width: '140px'
                        }"
                    ></EditableInput>
                    #
                    <EditableInput 
                        type="text" 
                        v-model="basicData.TRUSTEE_EXTENSION"
                        :inputStyle="{
                            width: '80px'
                        }"
                    ></EditableInput>
                </div>
            </div>
        </div>
        <div class="columns non-sticky-columns has-flex-column">
            <div class="column">
                <span class="field">Điện thoại di động</span>
                <EditableInput type="text" v-model="basicData.TRUSTEE_MOBILE"></EditableInput>
            </div>
        </div>
        <div class="columns non-sticky-columns has-flex-column">
            <div class="column">
                <span class="field">Email</span>
                <EditableInput 
                    type="text" 
                    v-model="basicData.TRUSTEE_EMAIL"
                    :inputStyle="{
                        width: '300px'
                    }"
                ></EditableInput>
            </div>
        </div>
    </div>
</template>
<script setup>
import FormInput from '~/components/Form/FormInput.vue';
import EditableInput from '~/components/Editable/EditableInput.vue';

import { useApplyStore } from '~/stores/apply';

const applyStore = useApplyStore();

const props = defineProps({
    basicData: {
        type: Object,
        required: true
    }
});

const basicData = toRef(props, 'basicData');

const fetchTrusteeEEID = async () => {
    let trustee = await applyStore.getTrusteeEEID(props.basicData.TRUSTEE_EE_ID);
    basicData.value.TRUSTEE_NAME = trustee.map.EMP_NAME;
    basicData.value.TRUSTEE_MOBILE = trustee.map.MOBILE;
    basicData.value.TRUSTEE_EMAIL = trustee.map.EMAIL;
};
</script>
