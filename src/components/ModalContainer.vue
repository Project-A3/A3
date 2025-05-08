<template>
  <div :class="{ modal: true, 'is-active': isShow }" :id="currentId">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="box" v-if="currentModal != ''">
        <component :is="currentModal" v-bind="data"></component>
      </div>
    </div>
  </div>
  <div :class="{ 'minify-modal': true, flash: isFlash }" v-if="isMinify" ref="modalTitleTarget" @click="modalStore.restoreSize()">
    {{ minifyTitle }}
  </div>
</template>
<script setup>
  import { storeToRefs } from 'pinia';
  import { useModalStore } from '../stores/modal';
  const modalStore = useModalStore();
  const { currentModal, currentId, data, isShow, isMinify, minifyTitle, isFlash } = storeToRefs(modalStore);
</script>
<style lang="scss"></style>
