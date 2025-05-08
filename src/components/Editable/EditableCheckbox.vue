<template>
  <span class="data" data-editing-type="5" ref="target" :id="key">
    <div v-if="!isEditing" @click="onClickField" style="display: inline">
      <img v-if="modelValue == props.checkedFlag" src="/src/assets/images/icon-checkmark-check.svg" alt="CHECKMARK" />
      <template v-else>{{ props.uncheckedText }}</template>
    </div>
    <label v-else class="is-editing is-align-items-center">
      <input type="checkbox" @change="updateValue($event.target.checked)" :checked="modelValue === props.checkedFlag" />
      <span></span>
    </label>
  </span>
  <button
    v-if="props.onClickDelete && isEditing"
    @click.prevent="props.onClickDelete"
    class="button is-primary-lightest ml-2 is-editing ab-delete-button"
  >
    <img src="/src/assets/images/icon-trash.svg" alt="TRASH" />
  </button>
</template>
<script setup>
  import useEditableField from '~/composables/useEditableField';

  const props = defineProps({
    modelValue: {
      type: [String, Boolean],
      required: true,
      default: false
    },
    checkedFlag: {
      type: [String, Boolean],
      required: false,
      default: 'Y'
    },
    uncheckedFlag: {
      type: [String, Boolean],
      required: false,
      default: 'N'
    },
    uncheckedText: {
      type: String,
      required: false,
      default: '-'
    },
    onClickDelete: {
      type: Function,
      required: false,
      default: null
    }
  });

  const modelValue = toRef(props, 'modelValue');
  // 更新欄位值
  const emit = defineEmits(['update:modelValue']);
  const updateValue = (value) => {
    emit('update:modelValue', value ? props.checkedFlag : props.uncheckedFlag);
  };
  const { isEditing, target, key, onClickField } = useEditableField();
</script>
<style lang="scss" scoped>
  .ab-delete-button {
    position: absolute;
    right: 5%;
    top: 50%;
    transform: translateY(-50%);
  }
</style>
