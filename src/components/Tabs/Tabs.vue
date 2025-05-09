<template>
  <!-- Tabs -->
  <div class="tabs" ref="tabRef">
    <ul>
      <li
        v-for="(tab, index) in tabProps"
        :class="{ 'is-active': tab.isActive, 'is-disabled': tab.disabled, 'is-hidden': tab.isHidden }"
        :data-content="tabIds[index]"
        @click="onTabClick(index, tab.id)"
      >
        <a><svg v-if="tab.hasSvg"></svg>{{ tab.title }}<ErrorTippy v-if="tab.errors" :errors="tab.errors"></ErrorTippy></a>
      </li>
    </ul>
    <slot name="buttons"></slot>
    <section>
      <!-- Tab Content -->
      <slot></slot>
    </section>
  </div>
</template>

<script setup>
  import { nextTick } from 'vue';
  import { initTabs, setActiveTab } from '~/common/ui/tab';
  import ErrorTippy from '../Editable/ErrorTippy.vue';
  const emit = defineEmits(['onTabClick']);
  const slots = useSlots();
  const tabRef = ref(null);
  // await nextTick();
  //0100644068 Doan Ngoc Thanh comment
  // let slotDefault = computed(() => (slots.default()[0].props ? slots.default() : slots.default()[0].children));
  // const tabProps = computed(() => slotDefault.value.map((m) => m.props));
  // Start Doan Ngoc Thanh edit code
  let slotDefault = computed(() => {
    const defaultSlot = slots.default();
    if (Array.isArray(defaultSlot)) {
      return defaultSlot[0].props ? defaultSlot : defaultSlot[0]?.children || [];
    }
    return [];
  });
  const tabProps = computed(() => Array.isArray(slotDefault.value) ? slotDefault.value.map((m) => m.props) : []);
  // End Doan Ngoc Thanh edit code
  console.log(slots.default());
  // console.log(tabProps);
  const tabIds = reactive([]);
  const onTabClick = (index, id) => {
    emit('onTabClick', index, id);
  };

  const initAllTabs = () => {
    // console.log(tabRef.value);
    tabRef.value.querySelectorAll('.tab-content').forEach((tab, index) => {
      // console.log(tab.getAttribute('id'));
      // console.log(tabProps);
      tabIds[index] = tab.getAttribute('id');
    });
    initTabs(tabRef.value);
  };

  const setActive = (index) => {
    if (tabRef.value) {
      let findTab = tabRef.value.querySelectorAll('ul > li')[index];
      console.log(findTab);
      if (findTab) {
        setActiveTab(findTab);
      }
    }
  };

  onMounted(async () => {
    await nextTick();
    initAllTabs();
  });

  watch(
    () => tabProps.value.length,
    async (newValue, oldValue) => {
      console.log(newValue);
      await nextTick();
      initAllTabs();
    }
  );

  defineExpose({
    setActive
  });
</script>
