<template>
  <div class="dropdown item-no-hover select-no-close" :class="{ 'disabled': props.options <= 0 }">
    <div class="dropdown-trigger">
      <button class="button" aria-haspopup="true" aria-controls="dropdown-menu">
        <span>{{ checkedItemsName }}</span>
        <img v-if="props.options > 0" src="/src/assets/images/icon-arrow-down.svg" alt="ARROW DOWN" />
        <img v-else src="/src/assets/images/icon-arrow-down-disabled.svg" alt="ARROW DISABLED" />
      </button>
    </div>
    <div class="dropdown-menu" role="menu">
      <div class="dropdown-content">
        <a v-for="option in props.options" :key="option.value" class="dropdown-item">
          <div class="md-checkbox">
            <input :id="key + option.value" type="checkbox" :value="option.value" v-model="checkedItemsValue" />
            <label :for="key + option.value">{{ option.text }}</label>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { uuid } from '../common/utils';
  const key = uuid();
  const props = defineProps({
    options: {
      type: Array,
      required: true,
      default: [
        {
          value: '',
          text: '',
          checked: true
        }
      ]
    },
    placeholder: {
      type: String,
      required: false,
      default: '請選擇'
    },
    emptyOptionText: {
      type: String,
      required: false,
      default: '無資料'
    },
    onChanged: {
      type: Function,
      required: false,
      default: (values, texts) => {}
    }
  });

  // 目前勾選的選項
  const checkedItemsValue = ref(props.options.filter((e) => e.checked).map((m) => m.value));

  // 目前勾選的選項名稱
  const checkedItemsName = computed(() => {
    if (props.options <= 0) return props.emptyOptionText;
    const finalName = props.options
      .filter((item) => checkedItemsValue.value.includes(item.value))
      .map((m) => m.text)
      .join(',');
    return finalName ? finalName : props.placeholder;
  });

  watch(checkedItemsValue, (newValue) => {
    // console.log(newValue);
    props.onChanged(newValue, checkedItemsName.value);
  });
</script>

<style lang="scss" scoped>
  .dropdown {
    min-width: 130px;
    .button {
      height: 100%;
    }
  }
</style>
