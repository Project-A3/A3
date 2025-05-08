<template>
  <div>
    <input type="date" ref="pickerRef" />
  </div>
</template>

<script setup>
  import useDatetimePicker from '~/composables/useDatetimePicker';
  const props = defineProps({
    modelValue: {
      type: [String, Number],
      required: true,
      default: ''
    },
    option: {
      type: Object,
      required: false,
      default: {}
    }
  });
  const pickerRef = ref(null);
  const emit = defineEmits(['update:modelValue']);
  onMounted(() => {
    const isRange = props.option?.isRange;
    if (isRange && props.modelValue) {
      const d = props.modelValue.split('~');
      props.option.startDate = d[0].trim();
      props.option.endDate = d[1].trim();
    }
    props.option.showClearButton = true;
    props.option.maxDate = new Date();
    const { datetimePicker } = useDatetimePicker(pickerRef.value, props.option);

    if (props.modelValue) {
      datetimePicker.value(props.modelValue);
    }

    datetimePicker.onSave = async (CEDate, ROCDate) => {
      console.log('save');
      if (CEDate) {
        if (isRange) {
          emit('update:modelValue', `${CEDate[0]}~${CEDate[1]}`);
        } else {
          emit('update:modelValue', CEDate);
        }
      }
    };
    datetimePicker.onClear = () => {
      datetimePicker.clear();
      emit('update:modelValue', '');
    };
    datetimePicker.onInputChange = (CEDate, ROCDate) => {
      emit('update:modelValue', CEDate);
    };
  });
</script>

<style lang="scss" scoped></style>
