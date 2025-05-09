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
        <a v-if="onCleared" class="dropdown-item clear" href="javascript:void(0)" @click="onCleared">清除</a>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { isEmpty } from 'lodash-es';
  import iconArrowDownLight from '~/assets/images/icon-arrow-down-light.svg';
  import iconArrowDown from '~/assets/images/icon-arrow-down-primary.svg';
  import iconArrowDownBlue from '~/assets/images/icon-arrow-down-blue.svg';
  const props = defineProps({
    options: {
      type: Array,
      required: true,
      default: []
    },
    onSelected: {
      type: Function,
      required: false,
      default: (value) => console.log('haha',value)
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
  const selectedOption = ref(options.value.find((e) => e.hasOwnProperty('selected') && e.selected));

  const setOption = (value) => {
    props.options.forEach((option) => {
      if (option.value === value) {
        option.selected = true;
        selectedOption.value = option;
      } else {
        option.selected = false;
      }
    });
  };

  const onSelected = (option) => {
    // console.log(options);
    // props.options[1].selected = true;
    if (!option.disabled && !option.isCreate) {
      setOption(option.value);
    }
    props.onSelected(option.value, option.name);
  };

  // 有人從外部改options要跟著變
  watch(
    () => props.options,
    (newOptions) => {
      selectedOption.value = newOptions.find((e) => e.hasOwnProperty('selected') && e.selected);
    },
    { deep: true }
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
