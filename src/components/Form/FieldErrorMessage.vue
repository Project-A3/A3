<template>
  <p aria-live="assertive" class="error-message" :id="id">
    <slot></slot>
  </p>
</template>

<script setup>
  const props = defineProps({
    id: {
      type: [String, Number],
      required: true
    }
  });
</script>
<style lang="scss" scoped>
  .error-message {
    color: red;
    margin-top: 5px;
    padding-left: 8px;
  }
</style>
