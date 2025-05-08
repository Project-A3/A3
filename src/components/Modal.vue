<template>
  <h2 class="modal-title">
    <slot name="title"></slot>
    <div v-if="props.minify" class="minify-modal-button" ref="minifyTarget" @click="$m.minify(props.minify)">
      <div class="minify-icon"></div>
    </div>
  </h2>
  <section v-bind="$attrs" :class="{ 'overflow-visable': disableOverflow }">
    <slot name="content"></slot>
  </section>
  <div class="modal-tool">
    <slot name="buttons"></slot>
  </div>
</template>
<script setup>
  import { useTippy } from 'vue-tippy';
  import useModal from '~/composables/useModal';

  const props = defineProps({
    disableOverflow: {
      type: Boolean,
      required: false,
      default: false
    },
    minify: {
      type: String,
      required: false,
      default: null
    }
  });
  const { $m } = useModal();
  const minifyTarget = ref(null);
  useTippy(minifyTarget, {
    content: '縮小彈窗',
    theme: 'gray',
    arrow: false,
    placement: 'bottom'
  });
</script>
