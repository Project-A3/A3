<template>
  <div
    ref="target"
    :class="{ 'flex-fit-content': props.fitContent, 'is-editing': isEditing, 'is-flex': true, 'is-align-items-center': true }"
  >
    <span v-if="!isEditing" class="data font-eudc" @click="onClickField" data-editing-type="2" :id="key">{{
      selectedOption?.name && selectedOption?.value ? selectedOption.name : props.nonSelectedText
    }}</span>
    <BaseDropdown
      v-else
      v-bind="$attrs"
      :class="[
        'is-primary',
        'is-outline',
        'width-limit',
        'height-limit',
        { 'w-100': props.fitContent },
        { disabled: props.disabled }
      ]"
      :options="dropdownOptions"
      :onSelected="onDropdownSelected"
      :onCleared="onDropdownCleared"
      :isLoading="isLoading"
      :style="dropdownStyle"
      ref="baseDropdown"
      @click.native="onDropdownClicked"
    ></BaseDropdown>
    <ErrorTippy :errors="errors" @click.native="onClickField"></ErrorTippy>
  </div>
</template>
<script setup>
  import useEditableField from '~/composables/useEditableField';
  import BaseDropdown from '../BaseDropdown.vue';
  import ErrorTippy from './ErrorTippy.vue';
  const props = defineProps({
    fitContent: {
      type: Boolean,
      required: false,
      default: false
    },
    modelValue: {
      type: [String, Number],
      required: true,
      default: ''
    },
    modelName: {
      type: String,
      required: false,
      default: ''
    },
    editingWidth: {
      type: [String, Number],
      required: false,
      default: null
    },
    options: {
      type: [Array, Function],
      required: true,
      default: []
    },
    nonSelectedValue: {
      type: String,
      required: false,
      default: ''
    },
    nonSelectedText: {
      type: String,
      required: false,
      default: '請選擇'
    },
    // 監聽的欄位，有變動要Refresh option
    watchValue: {
      type: [String, Number],
      required: false,
      default: null
    },
    onRefreshOptions: {
      type: Function,
      required: false,
      default: null
    },
    schema: {
      type: Object,
      required: false,
      default: null
    },
    disabled: {
      type: Boolean,
      required: false,
      default: null
    },
    dynamic: {
      type: String,
      required: false,
      default: null
    }
  });
  const emit = defineEmits(['update:modelValue', 'update:modelName', 'onSelected']);
  const baseDropdown = ref(null);
  const modelValue = toRef(props, 'modelValue');
  const dropdownStyle = {
    width: !props.editingWidth ? 'auto' : props.editingWidth + 'px',
    minWidth: props.editingWidth < 100 ? props.editingWidth + 'px' : '100px',
    ...props.inputStyle
  };
  const dropdownOptions = reactive([]);
  const isLoading = ref(false);
  // console.log(typeof props.options);
  if (typeof props.options === 'function') {
    isLoading.value = true;
    props
      .options()
      .then((getOptions) => {
        dropdownOptions.push(...getOptions);
        isLoading.value = false;
      })
      .catch((e) => {
        isLoading.value = false;
        console.error(e);
      });

    // debugger;
  } else {
    dropdownOptions.push(...props.options);
  }
  if (props.nonSelectedValue) dropdownOptions.unshift({ name: props.nonSelectedText, value: '', disabled: true }); // 有可能還是會傳空的，佔位一個空選項
  dropdownOptions.unshift({ name: props.nonSelectedText, value: props.nonSelectedValue, disabled: true });
  const setSelectedOption = () => {
    for (let option of dropdownOptions) {
      option.selected = false;
      if (option.value === modelValue.value) {
        option.selected = true;
        break;
      }
    }
  };
  setSelectedOption();
  const selectedOption = computed(() => dropdownOptions.find((e) => e.hasOwnProperty('value') && e.value === modelValue.value));
  const onDropdownSelected = (value, name) => {
    if (value !== 'CREATE') {
      emit('update:modelValue', value);
      emit('update:modelName', name);
    }
    emit('onSelected', value, dropdownOptions);
    isDropdownOpened.value = false;
  };
  const onDropdownCleared = () => {
    emit('update:modelValue', props.nonSelectedValue);
    emit('update:modelName', '');
    emit('onSelected', props.nonSelectedValue);
    isDropdownOpened.value = false;
    dropdownOptions[0].selected = true;
    // setEditing(false);
  };

  const { target, key, isEditing, onClickField, errors, setEditing } = useEditableField(props.isEditable, modelValue, {
    clickOutsideAnyWhere: () => {
      isDropdownOpened.value = false;
    },
    schema: props.schema
  });
  // 刷新Options用
  if (props.watchValue !== null) {
    watch(
      () => props.watchValue,
      async (newValue, oldValue) => {
        // console.log(newValue);
        if (props.onRefreshOptions) {
          try {
            isLoading.value = true;
            let options = await props.onRefreshOptions(newValue);
            console.log(options);
            dropdownOptions.splice(0);
            dropdownOptions.push(...options);
            dropdownOptions.unshift({
              name: props.nonSelectedText,
              value: props.nonSelectedValue,
              selected: true,
              disabled: true
            });
            emit('update:modelValue', props.nonSelectedValue);
          } catch (e) {
            console.error(e);
          } finally {
            isLoading.value = false;
          }
        }
      }
    );
  }
  if (props.disabled) {
    watch(
      () => props.disabled,
      (newValue) => {
        if (newValue) {
          // disable時將值清空並選擇預設值
          emit('update:modelValue', props.nonSelectedValue);
          dropdownOptions[0].selected = true;
        }
      }
    );
  }

  const isDropdownOpened = ref(false);
  const onDropdownClicked = () => {
    isDropdownOpened.value = !isDropdownOpened.value;
  };

  onMounted(() => {
    // 如果是dynamic，每次打開都刷新options
    if (props.dynamic && props.onRefreshOptions) {
      watch(props.dynamic === 'editing' ? isEditing : isDropdownOpened, async (newValue) => {
        if (newValue) {
          try {
            isLoading.value = true;
            let options = await props.onRefreshOptions();
            // console.log(options);
            dropdownOptions.splice(0);
            dropdownOptions.push(...options);
            setSelectedOption();
            // 如果沒對應選項，就顯示請選擇
            if (dropdownOptions.length > 0 && !dropdownOptions.some((e) => e.selected)) {
              dropdownOptions[0].selected = true;
            }
          } catch (e) {
            console.error(e);
          } finally {
            isLoading.value = false;
          }
        }
      });
    }
  });
</script>
