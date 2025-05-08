<template>
  <div>
    <input
      v-bind="$attrs"
      @input="updateValue($event.target.value)"
      :id="id"
      :value="modelValue"
      :aria-describedby="error ? `${id}-error` : null"
      :aria-invalid="error ? true : false"
      @change="onChange"
    />
    <FieldErrorMessage v-if="error" :id="`${id}-error`">
      {{ error }}
    </FieldErrorMessage>
  </div>
</template>
<script setup>
  import FieldErrorMessage from './FieldErrorMessage.vue';
  import { uuid } from '~/common/utils';
  const props = defineProps({
    error: {
      type: String,
      default: ''
    },
    modelValue: {
      type: [String, Number],
      default: ''
    }
  });
  const emit = defineEmits(['update:modelValue', 'change']);
  const updateValue = (value) => {
    emit('update:modelValue', value);
  };
  const id = uuid();
  let error = toRef(props, 'error');
  let modelValue = toRef(props, 'modelValue');

  const onChange = () => {
    emit('change');
  };
</script>
<style lang="scss"></style>
