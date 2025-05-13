<template>
    <div class="card half-card">
        <h2 class="sticky-basic-info">Dữ liệu sự kiện và loại yêu cầu</h2>

        <div class="columns non-sticky-columns has-flex-column">
            <div class="column">
                <span class="field">Mối quan hệ của người yêu cầu</span>
                    <BaseDropdown 
                        :options="listRltp"
                        class="height-limit is-outline sign-level"
                        @selected="eventListRltp" 
                        v-model="basicData.REQUEST_BEN_RLTP"
                    ></BaseDropdown>
            </div>
        </div>
        <div class="columns non-sticky-columns has-flex-column">
            <div class="column">
                <span class="field">Tên người yêu cầu</span>
                    <FormInput 
                        type="text" 
                        class="w-330" 
                        v-model="basicData.REQUEST_NAME"
                    ></FormInput>
            </div>
            
            <div class="column">
                <span class="field">Ngày sinh</span>
                <DatetimePicker 
                    v-model="basicData.REQUEST_BIRTH_DATE" 
                    style="width: 180px"
                ></DatetimePicker>
            </div>
        </div>
        <div class="columns non-sticky-columns has-flex-column">
            <div class="column">
                <span class="field">Loại giấy chứng nhận</span>
                    <BaseDropdown 
                        :options="listCrtType" 
                        @selected="eventListCrtType"
                        v-model="basicData.REQUEST_CERTI_TYPE" 
                        class="height-limit is-outline sign-level"
                    ></BaseDropdown>
            </div>
            <div class="column">
                <span class="field">Mã giấy chứng nhận</span>
                <span class="data">
                    <FormInput 
                    type="text" 
                    class="w-330" 
                    v-model="basicData.REQUEST_CERTI_NUM"
                    ></FormInput>
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
                    fitContent="true"
                    ></EditableInput>
            </div>
        </div>
        <div class="columns non-sticky-columns has-flex-column">
            <div class="column">
                <span class="field">Điện thoại liên lạc</span>
                    <EditableInput 
                        type="text" 
                        class="w-330" 
                        v-model="basicData.REQUEST_TELEPHONE_NUM"
                    ></EditableInput>
            </div>
        </div>
        <div class="columns non-sticky-columns has-flex-column">
            <div class="column">
                <span class="field">Điện thoại di động</span>
                    <EditableInput 
                        type="text" 
                        v-model="basicData.REQUEST_MOBILE_NUM"
                        ></EditableInput>
            </div>
        </div>
        <div class="columns non-sticky-columns has-flex-column">
            <div class="column">
                <span class="field">Email</span>
                    <EditableInput 
                    type="text" 
                    v-model="basicData.REQUEST_EMAIL"
                    :inputStyle="{
                        width: '50%'
                    }"
                    fitContent="true"
                    ></EditableInput>
            </div>
        </div>
    </div>
</template>
<script setup>
import BaseDropdown from '~/components/BaseDropdown.vue';
import FormInput from '~/components/Form/FormInput.vue';
import { useLanguageStore } from '~/stores/language';
import EditableInput from '~/components/Editable/EditableInput.vue';
import DatetimePicker from '~/components/DatetimePicker.vue';
import { string } from 'yup';
import useSwal from '~/composables/useSwal';
import { toRef, ref } from 'vue';


const props = defineProps({
    basicData: {
        type: Object,
        required: true
    }
});

const { $swal } = useSwal();
const basicData = toRef(props, 'basicData');
let theBasicData = basicData.value;
console.log('theBasicData', theBasicData);
const language = useLanguageStore();

const listRltp = ref([
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


const eventListRltp = (value) => {
     if (value === '1') {
        theBasicData.REQUEST_NAME = theBasicData.INSURED_NAME;
        theBasicData.REQUEST_BIRTH_DATE =  theBasicData.INSURED_BIRTHDAY;
        theBasicData.REQUEST_CERTI_TYPE = theBasicData.INSURED_CERTI_TYPE;
        
        listCrtType.value.forEach((item) => {
            if (item.value === theBasicData.INSURED_CERTI_TYPE) {
                item.selected = true;
            } else {
                item.selected = false;
            }
        });

        theBasicData.REQUEST_CERTI_NUM = theBasicData.INSURED_ID;
        theBasicData.REQUEST_ADDRESS = theBasicData.INSRD_ADDR;
        theBasicData.REQUEST_MOBILE_NUM = theBasicData.INSRD_MOBILE;
        theBasicData.REQUEST_EMAIL = theBasicData.INSRD_EMAIL;
    } else {
        theBasicData.REQUEST_NAME = '';
        theBasicData.REQUEST_BIRTH_DATE = null;
        theBasicData.REQUEST_CERTI_TYPE = '1';

        listCrtType.value.forEach((item) => {
            if (item.value === '1') {
                item.selected = true;
            } else {
                item.selected = false;
            }
        });

        theBasicData.REQUEST_CERTI_NUM = '';
        theBasicData.REQUEST_ADDRESS = '';
        theBasicData.REQUEST_MOBILE_NUM = '';
        theBasicData.REQUEST_TELEPHONE_NUM = '';
        theBasicData.REQUEST_EMAIL = '';
    }

};

const eventListCrtType = (value) => {
    if (value === '0') {
        $swal.fail('Vui lòng chọn loại giấy chứng nhận');
    } 
};


</script>