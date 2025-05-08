<template>
  <div class="page-search">
    <Header></Header>
    <main>
      <slot></slot>
    </main>
    <ModalContainer></ModalContainer>
  </div>
</template>
<script setup>
  import Header from '~/components/Header/Header.vue';
  import initUI from '~/common/ui/initial';
  import ModalContainer from '~/components/ModalContainer.vue';
  onMounted(() => {
    initUI();
  });
</script>

