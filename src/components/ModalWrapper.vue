<template>
  <div :class="{ modal: true, 'is-active': true }" :id="props.id">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="box">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
  const props = defineProps({
    id: {
      type: String,
      required: true,
      default: ''
    }
  });
</script>

<style lang="scss" scoped></style>
