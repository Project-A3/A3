<template>
  <label v-bind="$attrs" :class="{ disabled: props.disabled }">
    <input
      v-bind="$attrs"
      :disabled="props.disabled"
      type="checkbox"
      @change="updateValue($event.target.checked)"
      :checked="modelValue"
      :id="id"
    />
    <span><slot></slot></span>
  </label>
  <FieldErrorMessage v-if="error" :id="`${id}-error`">
    {{ error }}
  </FieldErrorMessage>
</template>
<script setup>
  import FieldErrorMessage from './FieldErrorMessage.vue';
  import { uuid } from '~/common/utils';
  const props = defineProps({
    error: {
      type: String,
      required: false,
      default: ''
    },
    modelValue: {
      type: [String, Number, Boolean],
      required: true,
      default: ''
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  });
  const emit = defineEmits(['update:modelValue']);
  const updateValue = (value) => {
    emit('update:modelValue', value);
  };
  const id = uuid();
  let error = toRef(props, 'error');
  let modelValue = toRef(props, 'modelValue');
</script>
<style lang="scss"></style>
