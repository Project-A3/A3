<template>
  <div class="is-flex w-100 is-align-items-center limit-width" ref="target">
    <EllipseTippy v-if="!isEditing" :content="showingText" class="limit-width" displayBlock>
      <span class="data font-eudc" data-editing-type="4" :id="key" @click="onClickField">
        {{ placeholderOnlyTrigger && showingText === placeholder ? '' : showingText }}
      </span>
    </EllipseTippy>
    <div v-else :style="styleList" class="dropdown is-editing is-primary is-outline limit-width mr-2" @click="onClickOpenModal">
      <div class="dropdown-trigger">
        <button class="button" aria-haspopup="true" aria-controls="dropdown-menu">
          <span class="font-eudc" :class="{ placeholder: showingText === props.placeholder }">{{ showingText }}</span
          ><img src="/src/assets/images/icon-add.svg" alt="ARROW DOWN" />
        </button>
      </div>
    </div>
    <ErrorTippy :errors="errors" @click.native="onClickField"></ErrorTippy>
  </div>
</template>
<script>
  import { useLanguageStore } from "~/stores/language";
  const  language=useLanguageStore();
  </script>
<script setup>
  import { isEmpty } from 'lodash-es';
  import useEditableField from '~/composables/useEditableField';
  import useModal from '../../composables/useModal';
  import EllipseTippy from '../EllipseTippy.vue';
  import ErrorTippy from './ErrorTippy.vue';

  const props = defineProps({
    modal: {
      type: Object,
      required: true,
      default: {
        component: '',
        id: '',
        data: {}
      }
    },
    editingWidth: {
      type: [String, Number],
      required: false,
      default: null
    },
    editingStyle: {
      type: Object,
      required: false,
      default: {}
    },
    placeholder: {
      type: String,
      required: false,
      default: language.translate("Component_HighSettlementArea_061")
    },
    placeholderOnlyTrigger: {
      type: Boolean,
      required: false,
      default: false
    },
    // 要顯示的文字
    modelText: {
      type: [String, null],
      required: true,
      default: ''
    },
    modelText2: {
      type: String,
      required: false,
      default: ''
    },
    // 資料的值
    modelValue: {
      type: [String, Number, null],
      default: '',
      required: true
    },
    // 資料的值，多一個備用
    modelValue2: {
      type: [String, Number],
      default: '',
      required: false
    },
    //多一個備用
    modelValue3: {
      type: [String, Number],
      default: '',
      required: false
    },
    schema: {
      type: Object,
      required: false,
      default: null
    }
  });

  const showingText = computed(() => (isEmpty(props.modelText) ? props.placeholder : props.modelText + props.modelText2));
  const modelValue = toRef(props, 'modelValue');
  const emit = defineEmits([
    'update:modelText',
    'update:modelText2',
    'update:modelValue',
    'update:modelValue2',
    'update:modelValue3'
  ]);

  const { $m } = useModal();

  const onClickOpenModal = () => {
    props.modal.data.models = {
      text: props.modelText,
      text2: props.modelText2,
      value: props.modelValue,
      value2: props.modelValue2,
      value3: props.modelValue3
    };
    props.modal.data.emitEvents = {
      updateText(text) {
        emit('update:modelText', text);
      },
      updateText2(text) {
        emit('update:modelText2', text);
      },
      updateValue(value) {
        emit('update:modelValue', value);
      },
      updateValue2(value) {
        emit('update:modelValue2', value);
      },
      updateValue3(value) {
        emit('update:modelValue3', value);
      },
      clearValue() {
        emit('update:modelText', '');
        emit('update:modelText2', '');
        emit('update:modelValue', '');
        emit('update:modelValue2', '');
        emit('update:modelValue3', '');
        $m.hide();
        // setEditing(false);
      }
    };
    $m.show(props.modal);
  };

  const { target, key, isEditing, onClickField, setEditing, errors } = useEditableField(props.isEditable, modelValue, {
    schema: props.schema
  });

  const styleList = {
    width: !props.editingWidth ? '100%' : props.editingWidth + 'px',
    ...props.editingStyle
  };
</script>
<style lang="scss"></style>
