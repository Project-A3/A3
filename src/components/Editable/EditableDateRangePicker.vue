<template>
  <div class="is-flex is-align-items-center">
    <div
      ref="target"
      :class="{
        'editable-wrapper': true,
        'is-editing': isEditing,
        'has-delete-button': isEditing && onClickDelete,
        'is-datetime': props.isDatetime
      }"
      @click="onClickField"
      data-editing-type="3"
      :id="key"
    >
      <span v-show="!isEditing" class="data">
        {{ getVNDate(props.modelStartDate, !props.isDatetime ? 'DD/MM/YYYY' : 'MM-DD HH:mm') }}~{{
          getVNDate(props.modelEndDate, !props.isDatetime ? 'DD/MM/YYYY' : 'MM-DD HH:mm')
        }}
      </span>
    </div>
    <button
      v-if="isEditing && onClickDelete"
      class="button is-primary-lightest m-1 button-delete is-editing"
      @click="onClickDelete"
    >
      <img src="/src/assets/images/icon-trash.svg" alt="TRASH" />
    </button>
    <ErrorTippy :errors="errors" :key="errorKey" @click.native="onClickField"></ErrorTippy>
  </div>
</template>
<script setup>
  import { nextTick } from 'vue';
import useDatetimePicker from '~/composables/useDatetimePicker';
import useEditableField from '~/composables/useEditableField';
import useMoment from '~/composables/useMoment';
import { useLanguageStore } from "~/stores/language";
import ErrorTippy from './ErrorTippy.vue';
const language = useLanguageStore();
  const props = defineProps({
    modelStartDate: {
      type: [String],
      required: true,
      default: ''
    },
    modelEndDate: {
      type: [String],
      required: true,
      default: ''
    },
    editingWidth: {
      type: [String, Number],
      required: false,
      default: null
    },
    onClickDelete: {
      type: Function,
      required: false,
      default: null
    },
    isDatetime: {
      type: Boolean,
      required: false,
      default: false
    },
    schema: {
      type: Object,
      required: false,
      default: null
    },
    hasRepeatRange: {
      type: [Function, Boolean],
      required: false,
      default: false
    }
  });
  const { getVNDate, format, isSameOrAfter, diff, now } = useMoment();
  const emit = defineEmits(['update:modelStartDate', 'update:modelEndDate']);
  let currentPicker = null;
  const modelStartDate = ref(props.modelStartDate);
  const endDate = ref(props.modelEndDate);
  //let backUpValue = ref(props.modelValue);
  let errorKey = ref(0);

  const destroyPicker = (event) => {
    // console.log('destroy picker');

    if (currentPicker) {
      currentPicker.destroy();
      currentPicker = null;
    }

    // 檢核是否有重複區間
    if (typeof props.hasRepeatRange === 'function' && props.hasRepeatRange()) {
      // console.log(errors);
      // errors.length = 0;
      errors.push(language.translate("Component_EditableDateRangePicker_001")); // 日期區間重疊
      if (!event.target.closest('.error-message')) errorKey.value++;
    } else if (errors.length > 0) {
      if (!event.target.closest('.error-message')) errorKey.value++;
    }

    nextTick(() => {
      if (diff(now('YYYY-MM-DD'), props.modelStartDate) < 0 || diff(now('YYYY-MM-DD'), props.modelEndDate) < 0) {
        errors.length = 0;
        errors.push(language.translate("Component_EditableDateRangePicker_002")); // 輸入日期不可超過當日，請輸入正確日期
        errorKey.value++;
      }
    });
    
  };
  const { target, key, isEditing, onClickField, setEditing, errors } = useEditableField(props.isEditable, modelStartDate, {
    clickOutsideCallback: destroyPicker,
    schema: props.schema
  });

  onUpdated(async () => {
    if (isEditing.value === true && currentPicker === null) {
      let chgDatesOrder = isSameOrAfter(props.modelStartDate, props.modelEndDate);
      let modelStartDate = chgDatesOrder ? props.modelEndDate : props.modelStartDate;
      let modelEndDate = chgDatesOrder ? props.modelStartDate : props.modelEndDate;
      let pickerRef = document.createElement('input');
      target.value.appendChild(pickerRef);
      //let isGroupEditing = target.value.closest('.group-editing') != null;
      let hasDate = props.modelStartDate && props.modelEndDate;
      let pOption = { showClearButton: true, isRange: true, placeholder: language.translate("Component_EditableDateRangePicker_003"), closeOnSelect: true }; // 請選擇日期區間
      if (hasDate) {
        if (!props.isDatetime) {
          pOption.startDate = modelStartDate;
          pOption.endDate = modelEndDate;
        } else {
          const startDate = format(modelStartDate, 'YYYY-MM-DD');
          const startTime = format(modelStartDate, 'HH:mm');
          const endDate = format(modelEndDate, 'YYYY-MM-DD');
          const endTime = format(modelEndDate, 'HH:mm');

          pOption.startDate = startDate;
          pOption.startTime = startTime;
          pOption.endDate = endDate;
          pOption.endTime = endTime;
        }
      }
      if (props.isDatetime) {
        pOption.type = 'datetime';
        // pOption.minuteSteps = 10;
        pOption.editTimeManually = true;
        pOption.showHeader = true;
      }
      pOption.maxDate = new Date();
      const { datetimePicker } = useDatetimePicker(pickerRef, pOption);
      if (hasDate) {
        datetimePicker.value(`${modelStartDate} ~ ${modelEndDate}`);
      }
      datetimePicker.onSave = async (CEDate, ROCDate) => {
        if (CEDate) {
          // console.log('save')
          let startCEDate = CEDate[0];
          let endCEDate = CEDate[1];
          if (props.isDatetime) {
            startCEDate += ':00';
            endCEDate += ':00';
          }
          emit('update:modelStartDate', startCEDate);
          emit('update:modelEndDate', endCEDate);
        }
      };
      datetimePicker.onClear = () => {
        emit('update:modelStartDate', '');
        emit('update:modelEndDate', '');
        datetimePicker.clear();
      };
      datetimePicker.onInputChange = (startCEDate, endCEDate) => {
        let startDate = startCEDate;
        let endDate = endCEDate;
        if (props.isDatetime) {
          startDate += ':00';
          endDate += ':00';
        }
        emit('update:modelStartDate', startDate);
        emit('update:modelEndDate', endDate);
      };
      currentPicker = datetimePicker;
    }
  });

  watch(() => props.modelEndDate, (newVal) => {
    endDate.value = newVal;
  });

  watch(modelStartDate, (val) => {
    emit('update:modelStartDate', val);
  });
  
  watch(endDate, (val) => {
    emit('update:modelEndDate', val);
  });

  watch(
    () => props.modelStartDate,
    (newValue, oldValue) => {
      modelStartDate.value = newValue;
      if (currentPicker && `${newValue} - ${props.modelEndDate}` !== currentPicker.getValue()) {
        if (newValue === '') {
          currentPicker.bulmaCalendar.clear();
        } else {
          currentPicker.value(`${newValue} ~ ${props.modelEndDate}`);
        }
      }
    }
  );
</script>
<style lang="scss" scoped>
  .editable-wrapper {
    min-width: 40px;
    min-height: 20px;
    width: 100%;
  }
  .has-delete-button {
    display: flex;
    // flex-direction: row-reverse;
    align-items: center;
  }
</style>
<style lang="scss">
  .hor-center {
    .editable-wrapper {
      text-align: center;
      .datetimepicker-dummy {
        justify-content: center;
      }
    }
  }
  .is-datetime .datetimepicker {
    max-width: 330px !important;
  }
  .is-datetime {
    .datetimepicker-dummy-wrapper.is-range {
      width: 330px !important;
      max-width: 330px !important;
    }
  }
</style>
