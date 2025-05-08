import { useDebounceFn, useIntervalFn } from '@vueuse/core';
import { pull } from 'lodash-es';
import { useHomeStore } from '~/stores/home';

export default function useNotification() {
  const homeStore = useHomeStore();
  const notifications = ref([]);
  const timer = 10 * 60 * 1000; // 多久呼叫一次: 10分鐘
  const hasNotifications = ref(false);
  const isShowOverlay = ref(false);
  const overlayClass = reactive({
    'is-overlay': true,
    'is-hidden': true
  });

  const showNotifications = () => {
    hasNotifications.value = true;
    overlayClass['is-hidden'] = false;
    isShowOverlay.value = true;
  };

  const hideNotifications = () => {
    hasNotifications.value = false;
    overlayClass['is-hidden'] = true;
    isShowOverlay.value = false;
  };

  const onClickUnderstood = useDebounceFn(async (todo) => {
    // Optimistic UI，將待辦從畫面上移除
    pull(notifications.value, todo);
    // 如果沒待辦了，要將overlay移除
    if (notifications.value.length === 0) {
      hideNotifications();
    }
    console.log(todo);
    const response = await homeStore.confirmTodoReminder(todo.TODO_NO);
    if (!response.IS_SUCCESS) {
      // doesn't need error restore
      console.error(response.RTN_MSG);
    }
  }, 150);

  const startInterval = () => {
    const { pause, resume, isActive } = useIntervalFn(
      async () => {
        let response = await homeStore.getTodoReminder();
        // 如果呼叫成功且有通知要顯示
        if (response.IS_SUCCESS && response.toDoReminder_mapList) {
          notifications.value = response.toDoReminder_mapList;
          showNotifications();
          // console.log(response.toDoReminder_mapList);
        } else {
          hideNotifications();
        }
      },
      timer,
      { immediate: true, immediateCallback: true }
    );
    return pause;
  };
  return {
    notifications,
    hasNotifications,
    isShowOverlay,
    onClickUnderstood,
    startInterval
  };
}
