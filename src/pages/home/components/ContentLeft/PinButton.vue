<template>
  <button :class="pinRenderClass">
    <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
      <g stroke="#57A786" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round">
        <path
          d="m17.847 7.254-3.018 5.226-3.812 2.444-1.006 1.742 9.007 5.2 1.005-1.742.21-4.524 3.018-5.226M14.515 19.266 12 23.62M16.946 6.735l7.205 4.16"
        />
      </g>
    </svg>
  </button>
</template>

<script setup>
  const props = defineProps({
    isPin: {
      type: Boolean,
      required: false,
      default: false
    }
  });

  const isPin = toRef(props, 'isPin');

  // 釘選按鈕Class
  const pinRenderClass = reactive({
    button: true,
    'button-pin': true,
    pinned: isPin
  });

  defineExpose({
    pinRenderClass
  });
</script>
