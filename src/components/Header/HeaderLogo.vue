<template>
  <div class="header-logo" @click="onClickBackToHome">
    <!-- <img src="/src/assets/images/logo-w.svg" alt="LOGO" /> -->
    <img src="/src/assets/images/icon-home.svg" />
    <p class="logo-name"><cathay-translate code="Component_HeaderLogo_001" /></p>
  </div>
</template>
<script setup>
  import { useHomeStore } from '~/stores/home';
  const router = useRouter();
  const route = useRoute();
  const onClickBackToHome = () => {
    // Reset all store
    useHomeStore().resetAllStores();
    if (route.name === 'home') {
      // 重新整理
      location.reload();
    } else {
      router.push({ name: 'home' });
    }
  };
</script>
