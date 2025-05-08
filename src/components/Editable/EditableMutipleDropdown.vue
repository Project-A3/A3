<template>
  <div ref="target" :class="{ 'flex-fit-content': props.fitContent, 'is-editing': isEditing }" style="min-width: 100px; height: 100%">
    <span v-if="!isEditing" class="data" @click="onClickField" data-editing-type="2" :id="key">{{ selectedText }}</span>
    <MutipleDropdown v-else emptyOptionText="無收據" :options="props.options" :onChanged="onDropdownChanged"></MutipleDropdown>
  </div>
</template>
<script setup>
  import useEditableField from '~/composables/useEditableField';
  import MutipleDropdown from '~/components/MutipleDropdown.vue';

  const props = defineProps({
    fitContent: {
      type: Boolean,
      required: false,
      default: false
    },
    modelValue: {
      type: [String, Array],
      required: true,
      default: []
    },
    editingWidth: {
      type: [String, Number],
      required: false,
      default: null
    },
    options: {
      type: Array,
      required: true,
      default: []
    },
    nonSelectedValue: {
      type: String,
      required: false,
      default: ''
    }
  });
  const emit = defineEmits(['update:modelValue']);
  const modelValue = toRef(props, 'modelValue');
  const dropdownStyle = {
    width: !props.editingWidth ? 'auto' : props.editingWidth + 'px',
    minWidth: '100px',
    ...props.inputStyle
  };

  const selectedText = ref(
    props.options
      .filter((item) => item.checked)
      .map((m) => m.text)
      .join(',') ?? '請選擇'
  );

  const onDropdownChanged = (values, texts) => {
    if (typeof modelValue.value === 'string') {
      emit('update:modelValue', values.length > 0 ? values.join(',') : '');
    } else {
      emit('update:modelValue', values);
    }
    selectedText.value = texts;
  };

  const { target, key, isEditing, onClickField } = useEditableField(props.isEditable);
</script>
