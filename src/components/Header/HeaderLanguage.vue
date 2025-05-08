<template>
  <BaseDropdown
    ref="refDropdown"
    class="height-limit is-outline sign-level"
    :options="options"
    :onSelected="onDropdownSelected"
  ></BaseDropdown>
</template>

<script setup>
  import BaseDropdown from '~/components/BaseDropdown.vue';
import { useLanguageStore } from '~/stores/language';
  const refDropdown = ref(null);
  const options = reactive([
    { name: 'Vietnamese', value: 'vi_VN', selected: true },
    { name: 'Chinese', value: 'zh_TW', selected: false }
  ]);

  const language = useLanguageStore();
  const onDropdownSelected = (value) => {
    language.switchLanguage(value);
  };
</script>
<style lang="scss" scoped></style>
