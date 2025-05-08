<template>
  <div class="radio-group">
    <input
      type="radio"
      class="radio-input"
      v-model="modelObject.type"
      :id="elementId"
      v-bind="$attrs"
      :value="typeValue"
      @change="onTypeChange($event.target)"
    />
    <label ref="labelElement" :for="elementId" v-if="label" :class="labelClass">
      <span class="radio-button"></span>
      {{ label }}
    </label>
  </div>
  <input
    v-if="props.hasField"
    :value="inputValue"
    @change="onInputChange($event.target.value)"
    @blur="onInputBlur($event.target.value)"
    @input="onInput($event.target.value)"
    @focus="onInputFocus"
    type="search"
    class="w-180"
    :placeholder="`請輸入${label}`"
  />
</template>
<script setup>
  import { uniqueId } from 'lodash-es';
  import { useTippy } from 'vue-tippy';
  const elementId = uniqueId();
  const emit = defineEmits(['update:modelValue']);
  const props = defineProps({
    label: {
      type: String,
      default: ''
    },
    modelValue: {
      type: Object,
      default: () => ({
        type: '',
        fieldValue: ''
      })
    },
    value: {
      type: [String, Number],
      required: true
    },
    tippy: {
      type: String,
      default: null
    },
    hasField: {
      type: Boolean,
      default: true
    },
    onInputChange: {
      type: Function,
      required: false,
      default: (value) => console.log(`input value changed: ${value}`)
    },
    onInputBlur: {
      type: Function,
      required: false,
      default: (value) => console.log(`input value changed: ${value}`)
    },
    onTypeChange: {
      type: Function,
      required: false,
      default: (target) => console.log(`type changed: ${target}`)
    }      
  });

  let label = toRef(props, 'label');
  let modelValue = toRef(props, 'modelValue');
  let typeValue = toRef(props, 'value');
  const modelObject = computed({
    get: () => modelValue.value,
    set: (value) => emit('update:modelValue', value)
  });
  // debugger;
  const defaultValue = modelObject.value.type === typeValue.value ? modelObject.value.fieldValue : '';
  const inputValue = ref(defaultValue);

  const onInput = (value) => {
    inputValue.value = value.toUpperCase();
    if (modelObject.value.type === props.value) {
      modelObject.value.fieldValue = value.toUpperCase();
    }
  };

  const onInputChange = (value) => {
    if (props.onInputChange) props.onInputChange(value.toUpperCase());
  };

  const onInputBlur = (value) => {
    if (props.onInputBlur) props.onInputBlur(value.toUpperCase());
  };

  const onInputFocus = () => {
    modelObject.value.type = props.value;
    modelObject.value.fieldValue = inputValue.value;
  };

  const onTypeChange = (target) => {
    try {
      // console.log(target.closest('.radio-group').nextElementSibling);
      modelObject.value.fieldValue = target.closest('.radio-group').nextElementSibling.value;
    } catch (e) {
      console.warn('設值失敗，無對應搜尋欄位');
    }
    // modelObject.value.fieldValue = '';
  };

  const labelElement = ref(null);
  const labelClass = reactive({
    'radio-label': true,
    'is-dark': true,
    'has-option': true,
    'has-tippy': props.tippy
  });
  if (props.tippy) {
    useTippy(labelElement, {
      content: props.tippy,
      theme: 'gray',
      arrow: false
    });
  }
</script>
<style lang="scss"></style>
