<template>
  <div>
    <input type="date" ref="pickerRef" />
  </div>
</template>

<script setup>
  import useDatetimePicker from '~/composables/useDatetimePicker';
  import useMoment from '~/composables/useMoment';
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
    isDatetime: {
      type: Boolean,
      required: false,
      default: false
    }
  });

  const { getROCDate, format } = useMoment();
  const emit = defineEmits(['update:modelStartDate', 'update:modelEndDate']);
  const pickerRef = ref(null);

  onMounted(() => {
    let hasDate = props.modelStartDate && props.modelEndDate;
    let pOption = { showClearButton: true, isRange: true, placeholder: '請選擇日期區間', closeOnSelect: true, position: 'top' };
    if (hasDate) {
      if (!props.isDatetime) {
        pOption.startDate = props.modelStartDate;
        pOption.endDate = props.modelEndDate;
      } else {
        const startDate = format(props.modelStartDate, 'YYYY-MM-DD');
        const startTime = format(props.modelStartDate, 'HH:mm');
        const endDate = format(props.modelEndDate, 'YYYY-MM-DD');
        const endTime = format(props.modelEndDate, 'HH:mm');

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
    const { datetimePicker } = useDatetimePicker(pickerRef.value, pOption);
    if (hasDate) {
      datetimePicker.value(`${props.modelStartDate} ~ ${props.modelEndDate}`);
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
      emit('update:modelStartDate', startCEDate);
      emit('update:modelEndDate', endCEDate);
    };
  });
</script>

<style lang="scss" scoped></style>
