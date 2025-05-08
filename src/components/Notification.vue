<template>
  <div :class="renderLevelClass">
    <div class="warp">
      <div class="item-top">
        <span class="time">{{ format(notification.TODO_DATE, 'HH:mm') }}</span>
        <span class="todo pr-2"><cathay-translate code="Component_Notification_001" /></span>
        <span class="todo-en todo">{{ notification.TODO_NO }}</span>
      </div>
      <div class="item-bot" v-if="notification.TODO_TYPE == '5'">
        <span class="title">{{ notification.TODO_TYPE_NAME }}</span>
        <span class="content">今日NAP待回復件數: 【<a href="#" @click.stop.prevent="homeStore.onClickNAPTodo()">{{ notification.TODO_CONTENT }}</a>】</span>
      </div>
      <div class="item-bot" v-else>
        <span class="title">{{ notification.TODO_TYPE_NAME }}</span>
        <span class="content">{{ notification.TODO_CONTENT }}</span>
      </div>
      <button type="button" class="understood" @click="onClick(notification)"><cathay-translate code="Component_Notification_002" /></button>
    </div>
  </div>
</template>
<script setup>
  import useMoment from '~/composables/useMoment';
  import { useHomeStore } from '~/stores/home';

  const homeStore = useHomeStore();
  const { format } = useMoment();

  const props = defineProps({
    notification: {
      type: Object,
      required: true,
      default: {
        TODO_DATE: '',
        TODO_CONTENT: '',
        TODO_NO: '',
        IMPO_LEVEL: '',
        TODO_TYPE: '',
        TODO_TYPE_NAME: ''
      }
    },
    onClickUnderstood: {
      type: Function,
      required: false,
      default: (todo) => console.log('todo')
    }
  });

  const notification = toRef(props, 'notification');

  const renderLevelClass = computed(() => ({
    card: true,
    'is-important': notification.value.IMPO_LEVEL === '1',
    'is-warning': notification.value.IMPO_LEVEL === '2'
  }));

  // 點擊知道了
  const onClick = (todo) => props.onClickUnderstood(todo);
</script>
