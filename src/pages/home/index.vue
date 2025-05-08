<template>
  <div class="page-index">
    <Header></Header>
    <main class="hide-right">
      <ContentLeft></ContentLeft>
      <ContentRight></ContentRight>
      <div class="button-drag">
        <svg></svg>
      </div>
      <ModalContainer></ModalContainer>
      <div class="notification" v-if="hasNotifications">
        <Notification
          v-for="notification in notifications"
          :key="notification.TODO_NO"
          :notification="notification"
          :onClickUnderstood="onClickUnderstood"
        ></Notification>
      </div>
    </main>
  </div>
  <div class="is-overlay" v-if="isShowOverlay"></div>
</template>
<script setup>
  import { onActivated, onDeactivated } from 'vue';
import initUI from '~/common/ui/initial';
import Header from '~/components/Header/Header.vue';
import Notification from '~/components/Notification.vue';
import useNotification from '~/composables/useNotification';
import useSwal from '~/composables/useSwal';
import { useHomeStore } from '~/stores/home';
import { useLanguageStore } from '~/stores/language';
import ContentLeft from './components/ContentLeft/ContentLeft.vue';
import ContentRight from './components/ContentRight/ContentRight.vue';
  const { $swal } = useSwal();

  const language = useLanguageStore();
  const ModalContainer = defineAsyncComponent(() => import('~/components/ModalContainer.vue'));

  // 通知相關邏輯
  const { notifications, hasNotifications, onClickUnderstood, startInterval, isShowOverlay } = useNotification();
  // console.log(overlayClass);

  const homeStore = useHomeStore();
  await homeStore.initPersonalIndex();

  let stopInterval = null;
  onActivated(() => {
    initUI();
    // 每一段時間呼叫一次取得通知API
    stopInterval = startInterval();
  });

  onDeactivated(() => {
    stopInterval();
  });
</script>
