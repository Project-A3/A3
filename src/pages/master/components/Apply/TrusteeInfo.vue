<template>
    <div class="card half-card">
        <h2 class="sticky-basic-info">Dữ liệu cơ bản của đại lý</h2>

        <div class="columns non-sticky-columns has-flex-column">
            <div class="column">
                <span class="field">Mã đại lý</span>
                <div style="display: flex; align-items: center;">
                    <FormInput type="text" class="w-330" v-model="basicData.TRUSTEE_EE_ID"></FormInput>
                    <button type="button" class="button button-enter-case" style="margin-left: 8px;">
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
