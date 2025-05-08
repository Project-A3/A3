<template>
  <div :class="{ 'tab-content': true, 'is-active': isActive, 'is-hidden': isHidden }" :id="props.tabId">
    <slot></slot>
  </div>
</template>
<script setup>
  import { uuid } from '~/common/utils';
  const props = defineProps({
    title: {
      type: String,
      required: true,
      default: ''
    },
    isActive: {
      type: Boolean,
      required: false,
      default: false
    },
    isHidden: {
      type: Boolean,
      required: false,
      default: false
    },
    tabId: {
      type: [String, Function],
      required: false,
      default: () => `tab-${uuid()}`
    },
    hasSvg: {
      type: [Boolean],
      required: false,
      default: false
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    errors: {
      type: Array,
      required: false,
      default: null
    }
  });
</script>
