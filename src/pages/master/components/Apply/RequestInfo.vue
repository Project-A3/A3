<template>
    <div class="card half-card">
        <h2 class="sticky-basic-info">Dữ liệu sự kiện và loại yêu cầu</h2>

        <div class="columns non-sticky-columns has-flex-column">
            <div class="column">
                <span class="field">Mối quan hệ của người yêu cầu</span>
                <span class="data">
                    <BaseDropdown 
                        :options= "listRltpOptions"
                        class="height-limit is-outline sign-level"
                        :onSelected="onDropdownSelected" 
                        v-model="basicData.REQUEST_BEN_RLTP"
                    ></BaseDropdown>
                    
                </span>
            </div>
        </div>
        <div class="columns non-sticky-columns has-flex-column">
            <div class="column">
                <span class="field">Tên người yêu cầu</span>
                <span class="data">
                    <FormInput type="text" class="w-330" v-model="basicData.REQUEST_NAME"></FormInput>
                </span>
            </div>
            
            <div class="column">
                <span class="field">Ngày sinh</span>
                <DatetimePicker v-model="basicData.REQUEST_BIRTH_DATE" style="width: 180px"></DatetimePicker>
            </div>
        </div>
        <div class="columns non-sticky-columns has-flex-column">
            <div class="column">
                <span class="field">Loại giấy chứng nhận</span>
                <span class="data">
                    <BaseDropdown 
                        :options="listCrtType" 
                        v-model="basicData.REQUEST_CERTI_TYPE" 
                        class="height-limit is-outline sign-level"
                    ></BaseDropdown>
                </span>
            </div>
            <div class="column">
                <span class="field">Mã giấy chứng nhận</span>
                <span class="data">
                    <FormInput type="text" class="w-330" v-model="basicData.REQUEST_CERTI_NUM"></FormInput>
                </span>
            </div>
        </div>
        <div class="columns non-sticky-columns has-flex-column">
            <div class="column">
                <span class="field">Địa chỉ liên lạc</span>
                <EditableInput 
                    type="text" 
                    v-model="basicData.REQUEST_ADDRESS"
                    :inputStyle="{
                        width: '100%'
                    }"
                    ></EditableInput>
            </div>
        </div>
        <div class="columns non-sticky-columns has-flex-column">
            <div class="column">
                <span class="field">Điện thoại liên lạc</span>
                <span class="data">
                    <EditableInput type="text" class="w-330" v-model="basicData.REQUEST_TELEPHONE_NUM"></EditableInput>
                </span>
            </div>
        </div>
        <div class="columns non-sticky-columns has-flex-column">
            <div class="column">
                <span class="field">Điện thoại di động</span>
                <span class="data">
                    <EditableInput type="text" class="w-330" v-model="basicData.REQUEST_MOBILE_NUM"></EditableInput>
                </span>
            </div>
        </div>
        <div class="columns non-sticky-columns has-flex-column">
            <div class="column">
                <span class="field">Email</span>
                <span class="data">
                    <EditableInput type="text" class="w-160" v-model="basicData.REQUEST_EMAIL"></EditableInput>
                </span>
            </div>
        </div>
    </div>
</template>
<script setup>
import BaseDropdown from '~/components/BaseDropdown.vue';
import FormInput from '~/components/Form/FormInput.vue';
import { useLanguageStore } from '~/stores/language';
import useMoment from '~/composables/useMoment.js';
import EditableInput from '~/components/Editable/EditableInput.vue';
import DatetimePicker from '~/components/DatetimePicker.vue';

const props = defineProps({
    basicData: {
        type: Object,
        required: true
    }
});

const basicData = toRef(props, 'basicData');
let theBasicData = basicData.value;
// let INSRD_PHONE_REGION = theBasicData.INSRD_PHONE_REGION;
const language = useLanguageStore();

const { getROCDate } = useMoment();
const listRltpOptions = ref([
    {
        langKey: 'Stores_Relationship_000', // 事故人身分證
        name: language.translate('Stores_Relationship_000'), // 事故人身分證
        value: '0',
        selected: theBasicData.REQUEST_BEN_RLTP === '0'
    },
    {
        langKey: 'Stores_Relationship_001', // 事故人出生證
        name: language.translate('Stores_Relationship_001'), // 事故人出生證
        value: '1',
        selected: theBasicData.REQUEST_BEN_RLTP === '1'
    },
    {
        langKey: 'Stores_Relationship_002', // 事故人護照
        name: language.translate('Stores_Relationship_002'), // 事故人護照
        value: '2',
        selected: theBasicData.REQUEST_BEN_RLTP === '2'
    },
    {
        langKey: 'Stores_Relationship_003', // 事故人軍人證
        name: language.translate('Stores_Relationship_003'), // 事故人軍人證
        value: '3',
        selected: theBasicData.REQUEST_BEN_RLTP === '3'
    },
    {
        langKey: 'Stores_Relationship_004', // 事故人軍人證
        name: language.translate('Stores_Relationship_004'), // 事故人軍人證
        value: '4',
        selected: theBasicData.REQUEST_BEN_RLTP === '4'
    },
    {
        langKey: 'Stores_Relationship_005', // 事故人軍人證
        name: language.translate('Stores_Relationship_005'), // 事故人軍人證
        value: '5',
        selected: theBasicData.REQUEST_BEN_RLTP === '5'
    }
]);
const listCrtType = ref([
    {
        langKey: 'Stores_Relationship_000', // 事故人身分證
        name: language.translate('Stores_Relationship_000'), // 事故人身分證
        value: '0',
        selected: theBasicData.REQUEST_CERTI_TYPE === '0'
    },
    {
        langKey: 'Stores_QuickSearch_002', // 事故人身分證
        name: language.translate('Stores_QuickSearch_002'), // 事故人身分證
        value: '1',
        selected: theBasicData.REQUEST_CERTI_TYPE === '1'
    },
    {
        langKey: 'Stores_QuickSearch_003', // 事故人出生證
        name: language.translate('Stores_QuickSearch_003'), // 事故人出生證
        value: '2',
        selected: theBasicData.REQUEST_CERTI_TYPE === '2'
    },
    {
        langKey: 'Stores_QuickSearch_004', // 事故人護照
        name: language.translate('Stores_QuickSearch_004'), // 事故人護照
        value: '3',
        selected: theBasicData.REQUEST_CERTI_TYPE === '3'
    },
    {
        langKey: 'Stores_QuickSearch_005', // 事故人軍人證
        name: language.translate('Stores_QuickSearch_005'), // 事故人軍人證
        value: '4',
        selected: theBasicData.REQUEST_CERTI_TYPE === '4'
    }
]);


const onDropdownSelected = (value) => {
    theBasicData.REQUEST_CERTI_TYPE = value;

    if (value === '0') {
        alert('事故人身分證');
    } 
    if (value !== '1') {
        theBasicData.REQUEST_NAME = '';
        theBasicData.REQUEST_BIRTH_DATE = '';
        theBasicData.REQUEST_CERTI_TYPE = '0';
        listCrtType.value.forEach(option => {
            option.selected = option.value === '0';
        });
        theBasicData.REQUEST_CERTI_NUM = '';
        theBasicData.REQUEST_ADDRESS = '';
        theBasicData.REQUEST_MOBILE_NUM = '';
        theBasicData.REQUEST_TELEPHONE_NUM = '';
        theBasicData.REQUEST_EMAIL = '';
    }
};
</script>