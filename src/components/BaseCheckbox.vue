<template>
  <label v-bind="$attrs">
    <input v-bind="$attrs" type="checkbox" @change="onChanged($event.target.checked)" :checked="props.defaultValue" />
    <span><slot></slot></span>
  </label>
</template>
<script setup>
  const props = defineProps({
    defaultValue: {
      type: Boolean,
      required: false,
      default: false
    },
    onChanged: {
      type: Function,
      required: true,
      default: (isChecked) => console.log(isChecked)
    }
  });
</script>
