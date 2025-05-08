<template>
  <Modal>
    <template v-slot:title>{{ props.data.title }}</template>
    <template v-slot:content>
      <iframe frameborder="0" width="100%" height="650" :src="props.data.url"></iframe>
    </template>
    <template v-slot:buttons>
      <button class="button is-light close-modal w-fixed-140" @click="props.close">返回</button>
    </template>
  </Modal>
</template>

<script setup>
  import Modal from '~/components/Modal.vue';
  const props = defineProps({
    data: {
      type: Object,
      required: true,
      default: {}
    },
    close: {
      type: Function,
      required: false,
      default: () => console.log('close modal!')
    }
  });
  console.log(props.data.url);
</script>

<style lang="scss" scoped></style>
