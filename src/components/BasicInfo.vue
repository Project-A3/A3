<template>
  <div class="card is-full first-card sticky base-info-area">
    <div class="columns case-info">
      <div class="column is-one-quarter">
        <a class="has-text-primary" :href="`/servlet/HttpDispatcher/AAZ3_0100/prompt?APLY_NO=${applyNo}`" target="_blank">
          受編 {{ applyNo }}
        </a>
      </div>
      <div class="column">
        <EllipseTippy v-for="tag in basicData.CASE_TAG" :content="tag.TAG_INFO" disableEllipse>
        <div :class="homeStore.getTagColorClass(tag.TAG_COLOR)">{{ tag.TAG_NAME }}</div>
        </EllipseTippy>
      </div>
    </div>
    <div class="columns non-sticky-columns has-flex-column">
      <div class="column is-one-quarter">
        <span class="field">事故者姓名</span>
        <EditableInput
          :isEditable="props.isEditable"
          :inputWidth="180"
          v-model="basicData.OCR_NAME"
          :schema="string().required('請輸入事故者姓名').max(140, '最多140個字')"
          class="font-eudc"
        ></EditableInput>
      </div>
      <div class="column is-one-quarter">
        <span class="field">事故者 ID</span>
        <EditableInput
          :isEditable="props.isEditable"
          :inputWidth="180"
          v-model="basicData.OCR_ID"
          :schema="string().required('請輸入事故者 ID').max(10, '超過10碼')"
        ></EditableInput>
      </div>
      <div class="column is-one-quarter">
        <span class="field">出生日期</span>
        <EditableDatePicker
          :isEditable="props.isEditable"
          v-model="basicData.OCR_BRDY"
          :schema="string().required('請輸入出生日期')"
        ></EditableDatePicker>
        (<span :class="{ 'has-text-danger': ocrAge < 18 }">{{ ocrAge }}歲</span>)
      </div>
      <div class="column is-one-quarter">
        <span class="field">國籍</span>
        <EditableDropdown
          v-if="basicData.IS_OIU === 'Y' && props.isEditable"
          v-model="basicData.COUNTRY_CODE"
          :editingWidth="165"
          :options="getCountryOptions" 
          @onSelected="
            (value, options) => {
              selectCountryCallback(value, basicData, options);
            }
          "
        ></EditableDropdown>
        <span class="data not-editable font-eudc" v-else>{{ basicData.COUNTRY_CH }}</span>
      </div>
    </div>

    <div class="columns sticky-columns">
      <div class="column sticky-case-info ml-4 is-2">
        <a class="has-text-primary" :href="`/servlet/HttpDispatcher/AAZ3_0100/prompt?APLY_NO=${applyNo}`" target="_blank">
          受編 {{ applyNo }}
        </a>
      </div>
      <div class="column is-narrow">
        <div class="w-fixed-300">
          <span class="field mr-12">事故者姓名</span>
          <span class="data font-eudc">{{ basicData.OCR_NAME }}</span>
          <span class="data ml-1">{{ basicData.OCR_ID }}</span>
        </div>
      </div>
      <div class="column is-narrow">
        <div class="w-fixed-210">
          <span class="field mr-12">出生日期</span>
          <span class="data"
            >{{ getROCDate(basicData.OCR_BRDY) }} (<span :class="{ 'has-text-danger': ocrAge < 18 }">{{ ocrAge }}歲</span>)</span
          >
        </div>
      </div>
      <div class="column is-narrow ml-5">
        <div class="w-fixed-160">
          <span class="field">國籍</span>
          <span class="data font-eudc">{{ basicData.COUNTRY_CH }}</span>
        </div>
      </div>
      <div class="column">
        <div v-for="tag in basicData.CASE_TAG" class="tag sticky-tags" :key="tag.TAG_NAME">
          {{ tag.TAG_NAME }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { string } from 'yup';
import EditableDropdown from '~/components/Editable/EditableDropdown.vue';
import useMoment from '~/composables/useMoment.js';
import { useApplyStore } from '~/stores/apply';
import { useHomeStore } from '~/stores/home';
import EditableDatePicker from './Editable/EditableDatePicker.vue';
import EditableInput from './Editable/EditableInput.vue';
import EllipseTippy from './EllipseTippy.vue';

  const homeStore = useHomeStore();
  const applyStore = useApplyStore();
  const { getROCDate, getAge, getOcrAge } = useMoment();
  const props = defineProps({
    basicData: {
      type: Object,
      required: true
    },
    applyNo: {
      type: String,
      required: true
    },
    isEditable: {
      type: Boolean,
      required: false,
      default: false
    },
    claimData: {
      type: Object,
      required: true,
      default: {}
    }
  });
  const basicData = toRef(props, 'basicData');
  const applyNo = toRef(props, 'applyNo');
  const claimData = toRef(props, 'claimData');
  const age = computed(() => getAge(basicData.value.OCR_BRDY));
  const ocrAge = computed(() => getOcrAge(claimData.value.APLY_DATE, basicData.value.OCR_BRDY));

  // 取得國籍下拉選單
  const getCountryOptions = async () => {
    let places = await applyStore.getCountryOptions();
 
    let areas = places
      .map((m) => ({
        name: m.COUNTRY_CODE +'/' +m.COUNTRY_CH,
        value: m.COUNTRY_CODE
      }));

    return areas;  
  };

  // 國籍中文回寫
  const selectCountryCallback = (value, basicData, options) => {
    basicData.COUNTRY_CH = options.find((e) => e.selected === true).name;
  };
</script>
<style lang="scss" scoped>
  .tag:empty {
    display: none;
  }
  .base-info-area .not-editable {
    cursor: auto !important;
  }
</style>
