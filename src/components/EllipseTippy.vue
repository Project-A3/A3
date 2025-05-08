<template>
  <Tippy :content="propContent" theme="ellipsify" :arrow="false" appendTo="parent" ref="slotRef" :key="tkey">
    <slot></slot>
  </Tippy>
</template>
<script setup>
  import { nextTick } from 'vue';
  import { Tippy, useTippy } from 'vue-tippy';

  const props = defineProps({
    content: {
      type: [String, Number],
      required: true,
      default: ''
    },
    disableEllipse: {
      type: Boolean,
      required: false,
      default: false
    },
    displayBlock: {
      type: Boolean,
      required: false,
      default: false
    },
    manualRefresh: {
      type: Boolean,
      required: false,
      default: false
    }
  });

  const propContent = computed(() => props.content);
  const tkey = ref(0);
  if (props.manualRefresh) {
    watch(
      () => props.content,
      async (newValue, oldValue) => {
        console.log(newValue);
        console.log(oldValue);
        // propContent.value = newValue;
        tkey.value++;
      }
    );
  }

  const slotRef = ref(null);

  onUpdated(() => {
    // console.log('update');
    try {
      let element = slotRef.value.elem.firstElementChild ? slotRef.value.elem.firstElementChild : slotRef.value.elem;
      if (element.offsetWidth >= element.scrollWidth && !props.disableEllipse) {
        slotRef.value.destroy();
        element.style.cursor = 'default';
      }
    } catch (e) {
      console.log(e);
    }
  });

  onMounted(() => {
    // console.log('mounted');
    // 有省略時才需要Tippy，其餘destroy

    if (slotRef.value) {
      // console.log(props.content);
      // console.log(checkEllipsis(slotRef.value.elem));
      // console.log(slotRef.value.elem.firstElementChild);
      let element = slotRef.value.elem.firstElementChild ? slotRef.value.elem.firstElementChild : slotRef.value.elem;
      if (props.displayBlock) {
        element.style.display = 'block';
        element.style.overflow = 'hidden';
        element.style.textOverflow = 'ellipsis';
      }
      // debugger;
      // console.log(slotRef.value.elem);
      // console.log(slotRef.value.elem.offsetWidth);
      // console.log(slotRef.value.elem.scrollWidth);
      // console.log(slotRef.value.elem.clientWidth);
      if (element.offsetWidth >= element.scrollWidth && !props.disableEllipse) {
        slotRef.value.destroy();
        element.style.cursor = 'default';
      }
    }
  });
</script>
<style lang="scss">
  [data-v-tippy] {
    cursor: pointer;
  }
  [data-tippy-root] {
    width: max-content;
    word-wrap:break-word;
    font-family: "EUDC";
  }
</style>
