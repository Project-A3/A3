<template>
  <div>
    <BaseDropdown
      v-bind="$attrs"
      :isLoading="props.isLoading"
      :options="dropdownOptions"
      :onSelected="onDropdownSelected"
      :id="id"
    ></BaseDropdown>
    <FieldErrorMessage v-if="error" :id="`${id}-error`">
      {{ error }}
    </FieldErrorMessage>
  </div>
</template>
<script setup>
  import BaseDropdown from '../BaseDropdown.vue';
  import FieldErrorMessage from './FieldErrorMessage.vue';
  import { uuid } from '~/common/utils';
  const props = defineProps({
    modelValue: {
      type: [String, Number],
      required: true,
      default: ''
    },
    options: {
      type: Array,
      required: true,
      default: []
    },
    error: {
      type: String,
      required: false,
      default: ''
    },
    isLoading: {
      type: Boolean,
      required: false,
      default: false
    },
    watchValue: {
      type: [String, Number],
      required: false,
      default: null
    },
    onRefreshOptions: {
      type: Function,
      required: false,
      default: null
    }
  });
  const emit = defineEmits(['update:modelValue']);
  const modelValue = toRef(props, 'modelValue');
  // console.log(modelValue);
  const dropdownOptions = toRef(props, 'options');
  // console.log(dropdownOptions);
  const setSelectedOption = () => {
    dropdownOptions.value.forEach((option) => {
      option.selected = false;
      if (option.value === modelValue.value) option.selected = true;
    });
  };
  setSelectedOption();
  const onDropdownSelected = (value) => {
    emit('update:modelValue', value);
  };
  const id = uuid();
  watch(modelValue, (newValue, oldValue) => {
    setSelectedOption();
  });

  // 刷新Options用
  if (props.watchValue !== null) {
    // console.log('watch value ' + props.watchValue);
    watch(
      () => props.watchValue,
      async (newValue, oldValue) => {
        // console.log(newValue);
        if (props.onRefreshOptions) {
          try {
            await props.onRefreshOptions(newValue);
          } catch (e) {
            console.error(e);
          }
        }
      }
    );
  }
</script>
<style lang=""></style>
