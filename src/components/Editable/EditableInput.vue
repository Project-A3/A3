<template>
  <div
    ref="target"
    :class="['is-editing', 'is-flex', 'is-align-items-center', 'limit-width', { 'flex-fit-content': props.fitContent }]"
  >
    <EllipseTippy
      v-if="!isEditing"
      :content="modelValue"
      :class="['data font-eudc', { 'not-editable': !props.isEditable, 'limit-width': props.tippy }]"
      :id="key"
      data-editing-type="1"
      @click="onClickField"
      :style="tippyStyle"
      displayBlock
    >
      {{ props.isCurrency ? toCurrency(modelValue) : modelValue }}
      <template v-if="props.hasPercent">%</template>
    </EllipseTippy>
    <div :class="{ 'flex-fit-content': props.fitContent }" v-else>
      <input
        ref="textbox"
        :type="inputType"
        :placeholder="placeholder"
        :class="{ 'is-error': errors.length > 0, 'hide-arrows': true }"
        class="font-eudc"
        @input="updateValue($event.target.value)"
        @change="changeValue($event.target.value)"
        :value="modelValue"
        :style="textboxStyle"
      />
      <button v-if="props.onClickDelete" @click.prevent="props.onClickDelete" class="button is-primary-lightest ml-2">
        <img src="/src/assets/images/icon-trash.svg" alt="TRASH" />
      </button>
      <span v-if="props.hasPercent">%</span>
    </div>
    <ErrorTippy :errors="errors" :key="errorKey" @click.native="onClickField"></ErrorTippy>
  </div>
</template>
<script setup>
  import { isNaN, toSafeInteger } from 'lodash-es';
  import { toCurrency } from '~/common/utils';
  import useEditableField from '~/composables/useEditableField';
  import EllipseTippy from '../EllipseTippy.vue';
  import ErrorTippy from './ErrorTippy.vue';

  const attrs = useAttrs();
  // console.log(attrs.type);
  const inputType = attrs.type ? attrs.type : 'text';
  const props = defineProps({
    fitContent: {
      type: Boolean,
      required: false,
      default: false
    },
    placeholder: {
      type: String,
      required: false,
      default: '請輸入'
    },
    modelValue: {
      type: [String, Number],
      required: true,
      default: ''
    },
    isEditable: {
      type: Boolean,
      required: false,
      default: true
    },
    maxWidth: {
      type: [String, Number],
      required: false,
      default: null
    },
    inputWidth: {
      type: [String, Number],
      required: false,
      default: null
    },
    inputStyle: {
      type: Object,
      required: false,
      default: {}
    },
    tippy: {
      type: String,
      required: false,
      default: null
    },
    onClickDelete: {
      type: Function,
      required: false,
      default: null
    },
    schema: {
      type: Object,
      required: false,
      default: null
    },
    spanWidth: {
      type: [String, Number],
      required: false,
      default: 25
    },
    numberToFixed: {
      type: Number,
      required: false,
      default: 0
    },
    hasPercent: {
      type: Boolean,
      required: false,
      default: false
    },
    onInputChange: {
      type: Function,
      required: false,
      default: null
    },
    isCurrency: {
      type: Boolean,
      required: false,
      default: false
    }
  });
  const textbox = ref(null);
  const textboxStyle = {
    width: !props.inputWidth ? '90%' : props.inputWidth + 'px',
    ...props.inputStyle
  };
  const tippyStyle = {
    maxWidth: !props.maxWidth ? 'auto' : props.maxWidth + 'px',
    minWidth: props.spanWidth + 'px',
    minHeight: '10px',
    cursor: 'pointer'
  };
  const modelValue = toRef(props, 'modelValue');
  // 更新欄位值
  const emit = defineEmits(['update:modelValue']);
  const updateValue = (value) => {
    emit('update:modelValue', value);
  };

  const { target, key, isEditing, onClickField, errors, doValidation } = useEditableField(props.isEditable, modelValue, {
    schema: props.schema,
    clickOutsideCallback: () => {
      // 如果是數字，做小數點處理
      if (inputType === 'number') {
        let decimalValue = parseFloat(modelValue.value);
        // debugger;
        // console.log(isNaN(decimalValue));
        if (!isNaN(decimalValue)) {
          if (props.numberToFixed > 0) {
            updateValue(decimalValue.toFixed(props.numberToFixed));
          } else {
            updateValue(toSafeInteger(decimalValue));
          }
          setTimeout(() => {
            doValidation();
          }, 1);
        }
      }
      if (errors.length > 0) errorKey.value += 1;
    }
  });
  const errorKey = ref(1);
  const changeValue = async (value) => {
    if (props.onInputChange) {
      props.onInputChange(value);
    }
  };
</script>
