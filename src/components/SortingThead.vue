<template>
  <th class="sort" @click="onClickSort(props.sortKey)">
    <slot></slot>
    <svg width="16" height="13" viewBox="-50 -50 300 300" v-if="props.currentSortKey === props.sortKey">
      <polygon :class="{ triangle: true, down: isSortDesc }" stroke-linejoin="round" points="100,60 0,200 200,200" />
    </svg>
  </th>
</template>
<script setup>
  const props = defineProps({
    currentSortKey: {
      type: String,
      required: true,
      default: ''
    },
    sortKey: {
      type: String,
      required: true,
      default: ''
    },
    isSortDesc: {
      type: Boolean,
      required: true,
      default: true
    },
    onClickSort: {
      type: Function,
      required: true,
      default: () => console.log('sort!')
    }
  });
  const onClickSort = (key) => {
    props.onClickSort(key);
  };
</script>
<style lang=""></style>
