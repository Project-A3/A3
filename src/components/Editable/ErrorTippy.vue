<template>
  <div class="validate-error" v-if="errors.length > 0">
    <Tippy :content="props.errors.join('，')" theme="error" :arrow="false" appendTo="parent">
      <img class="error-message" src="/src/assets/images/icon-warn.svg" alt="ERROR" />
    </Tippy>
  </div>
</template>

<script setup>
  import { Tippy } from 'vue-tippy';
  const props = defineProps({
    errors: {
      type: Array,
      required: true,
      default: []
    }
  });
</script>

<style lang="scss" scoped>
  .validate-error {
    min-width: 20px;
    width: 20px;
    margin-left: 5px;
    display: inline-block;
  }
</style>
