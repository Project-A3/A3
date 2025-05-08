<template>
  <button :class="['button', 'is-secondary', 'is-outline', { 'is-active': props.isActive }]"><slot></slot></button>
</template>

<script setup>
  const props = defineProps({
    isActive: {
      type: Boolean,
      required: false,
      default: false
    }
  });
</script>

<style lang="scss" scoped></style>
