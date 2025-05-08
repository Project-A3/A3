<template>
  <div class="is-flex is-align-items-center">
    <div
      ref="target"
      :class="{ 'editable-wrapper': true, 'is-editing': isEditing }"
      @click="onClickField"
      data-editing-type="3"
      :id="key"
    >
      <span v-show="!isEditing" class="data">{{ getROCDate(props.modelValue) }}</span>
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
  import useDatetimePicker from '~/composables/useDatetimePicker';
  import useMoment from '~/composables/useMoment';
  import useEditableField from '~/composables/useEditableField';
  import ErrorTippy from './ErrorTippy.vue';

  const props = defineProps({
    modelValue: {
      type: [String, Number],
      required: true,
      default: ''
    },
    editingWidth: {
      type: [String, Number],
      required: false,
      default: null
    },
    multipleMode: {
      type: Boolean,
      required: false,
      default: false
    },
    hightlightDates: {
      type: Array,
      required: false,
      default: []
    },
    isEditable: {
      type: Boolean,
      required: false,
      default: true
    },
    schema: {
      type: Object,
      required: false,
      default: null
    },
    customValidate: {
      type: Function,
      required: false,
      default: null
    },
    onClickDelete: {
      type: Function,
      required: false,
      default: null
    }
  });
  const { getROCDate } = useMoment();
  const emit = defineEmits(['update:modelValue']);
  const errorKey = ref(0);
  let currentPicker = null;
  let backUpValue = ref(props.modelValue);
  const modelValue = toRef(props, 'modelValue');
  const destroyPicker = () => {
    if (currentPicker) {
      // console.log(currentPicker);
      currentPicker.destroy();
      currentPicker = null;
    }

    if (errors.length > 0) {
      errorKey.value++;
    }
  };
  const { target, key, isEditing, onClickField, setEditing, errors, doValidation } = useEditableField(
    props.isEditable,
    modelValue,
    {
      clickOutsideCallback: destroyPicker,
      schema: props.schema
    }
  );

  onUpdated(async () => {
    if (isEditing.value === true && currentPicker === null) {
      let pickerRef = document.createElement('input');
      target.value.appendChild(pickerRef);
      let isGroupEditing = target.value.closest('.group-editing') != null;
      const { datetimePicker } = useDatetimePicker(pickerRef, {
        showClearButton: true,
        hightlightDates: props.hightlightDates,
        maxDate: new Date()
      });

      if (props.modelValue) {
        datetimePicker.value(props.modelValue);
      }
      datetimePicker.onShow = () => {
        // debugger;
        // 關閉其他picker
        let otherPickerRef = target.value.closest('.part').querySelector('.for-picker');
        if (otherPickerRef && otherPickerRef.bulmaCalendar) otherPickerRef.bulmaCalendar.hide();
      };
      datetimePicker.onSave = async (CEDate, ROCDate) => {
        console.log('save');
        emit('update:modelValue', CEDate);
      };
      datetimePicker.onClear = async () => {
        // setEditing(false);
        // destroyPicker();
        datetimePicker.clear();
        emit('update:modelValue', '');
        // await nextTick();
        // doValidation();
        // console.log(errors);
      };
      datetimePicker.onInputChange = (CEDate, ROCDate) => {
        emit('update:modelValue', CEDate);
      };
      if (props.multipleMode) {
        datetimePicker.onSelect = (date) => {
          if (date?.data?.date?.start) {
            datetimePicker.hightlightDate(date?.data?.date?.start);
          }
        };
      }
      currentPicker = datetimePicker;
    }
  });

  watch(isEditing, (newValue, oldValue) => {
    if (!newValue) destroyPicker();
  });

  // watch(
  //   () => props.modelValue,
  //   (newValue, oldValue) => {
  //     console.log(newValue);
  //     if (currentPicker && newValue !== currentPicker.getValue()) {
  //       if (newValue === '') {
  //         currentPicker.bulmaCalendar.clear();
  //       } else {
  //         currentPicker.value(newValue);
  //       }
  //     }
  //   }
  // );
</script>
<style scoped>
  .editable-wrapper {
    min-width: 40px;
    min-height: 20px;
  }
</style>
