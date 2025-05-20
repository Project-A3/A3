<template>
  <div class="dropdown" ref="dropdown">
    <div class="dropdown-trigger">
      <button
        :class="{ button: true, 'is-loading': props.isLoading }"
        aria-haspopup="true"
        aria-controls="dropdown-menu"
        type="button"
      >
        <div v-html="selectedOption?.name" class="html-flex-wrapper font-eudc"></div>
        <img class="dropdown-icon" :src="iconArrowDown" alt="ARROW" />
      </button>
    </div>
    <div class="dropdown-menu" role="menu">
      <div class="dropdown-content">
        <a
          v-for="option in props.options"
          href="javascript:void(0)"
          :class="{ 'dropdown-item': true, 'is-disabled': option.disabled, create: option.isCreate }"
          v-show="!option.disabled || (props.options.length === 1 && !option.value)"
          @click.stop.prevent="onSelected(option)"
        >
          <!-- <template v-if="option.allowHtml">
            <div v-html="option.name"></div>
          </template>
          <template v-else>
            {{ option.name }}
          </template> -->
          <span class="font-eudc" v-html="option.name"></span>
        </a>
        <a v-if="onCleared" class="dropdown-item clear" href="javascript:void(0)" @click="onCleared"><cathay-translate code="Component_BaseDropDown_001" /></a>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { isEmpty } from 'lodash-es';
  import iconArrowDownLight from '~/assets/images/icon-arrow-down-light.svg';
  import iconArrowDown from '~/assets/images/icon-arrow-down-primary.svg';
  import iconArrowDownBlue from '~/assets/images/icon-arrow-down-blue.svg';
  
  const emit = defineEmits(['update:modelValue'])

  const props = defineProps({
    modelValue: [String, Number, null],
    options: {
      type: Array,
      required: true,
      default: []
    },
    onSelected: {
      type: Function,
      required: false,
      default: () => {}
    },
    onCleared: {
      type: Function,
      required: false,
      default: null
    },
    isLoading: {
      type: Boolean,
      required: false,
      default: false
    }
  });

  const dropdown = ref(null);
  const options = toRef(props, 'options');
  const selectedOption = ref(null);

  const setOption = (value) => {
  selectedOption.value = props.options.find((e) => e.value === value) || null;
  emit('update:modelValue', value);
} ;

  const onSelected = (option) => {
  if (!option.disabled && !option.isCreate) {
    setOption(option.value);
  }
  props.onSelected(option.value, option.name);
  };


  // 有人從外部改options要跟著變
  watch(
    () => [props.options, props.modelValue],
    () => {
      selectedOption.value = props.options.find((e) => e.value === props.modelValue) || null;
    },
    { immediate: true, deep: true }
  );

  // 下拉選單是否開啟
  onMounted(() => {
    // console.log(dropdown.value);
    if (dropdown.value) {
      if (
        (dropdown.value.classList.contains('is-primary') ||
          dropdown.value.classList.contains('is-secondary') ||
          dropdown.value.classList.contains('is-yellow')) &&
        !dropdown.value.classList.contains('is-outline')
      ) {
        // 根據class不同箭頭的icon會不同
        let icon = dropdown.value.querySelector('.dropdown-icon');
        if (icon) {
          icon.setAttribute('src', iconArrowDownLight);
        }
      } else if (dropdown.value.classList.contains('is-outline')) {
        let icon = dropdown.value.querySelector('.dropdown-icon');
        if (icon) {
          if (dropdown.value.classList.contains('is-secondary')) {
            icon.setAttribute('src', iconArrowDownBlue);
          } else {
            icon.setAttribute('src', iconArrowDown);
          }
        }
      }
    }
  });

  defineExpose({
    setOption,
    selectedOption
  });
</script>
<style lang="scss" scoped>
  .html-flex-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
