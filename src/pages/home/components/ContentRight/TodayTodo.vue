<template>
  <div class="block todo-block">
    <div class="block-content">
      <div class="block-title-inside">
        <p>{{ blockTitleDate }}</p>
        <div class="title-tool-button">
          <button class="primary-button-light open-modal" @click="showAddTodoModal">
            <cathay-translate code="Component_TodayTodo_001" />
          </button>
        </div>
      </div>
      <div class="todo-area">
        <div class="todo" v-for="todayTodo in todayTodos" :key="todayTodo.time">
          <p class="todo-time">{{ todayTodo.time }}</p>
          <ul class="todo-list">
            <TodoItem
              v-for="todo in todayTodo.todos"
              :key="todo.TODO_NO"
              :todo="todo"
              :onClickFinish="onClickFinish"
              :onClickDelete="onClickDelete"
            ></TodoItem>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { useThrottleFn } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import useModal from '~/composables/useModal';
import useMoment from '~/composables/useMoment';
import useSwal from '~/composables/useSwal';
import { useHomeStore } from '~/stores/home';
import { useLanguageStore } from '~/stores/language';
import AddTodoModal from '../Modals/AddTodoModal.vue';
import TodoItem from './TodoItem.vue';
  const { $swal } = useSwal();
  const homeStore = useHomeStore();
  const { $m } = useModal();
  const { getVNDate } = useMoment();

  const { todayTodos, currentCalendarSelecedDate } = storeToRefs(homeStore);
  const language = useLanguageStore();
  let blockTitleDate = computed(() =>
    getVNDate(currentCalendarSelecedDate.value) === getVNDate(new Date())
      ? language.translate('Component_TodayTodo_002') // 待辦事項
      : getVNDate(currentCalendarSelecedDate.value)
  );

  const onClickFinish = useThrottleFn(async (todoNo) => {
    // do something, it will be called at most 100 per minisecond
    await homeStore.finishTodo(todoNo);
  }, 100);

  const onClickDelete = async (todoNo) => {
    const result = await homeStore.deleteTodoList(todoNo);
    if (result.IS_SUCCESS) {
      $swal.success(language.translate('Component_TodayTodo_003')); // 刪除成功
      // UI更新
      homeStore.deleteTodoFromUI(todoNo);
    } else {
      $swal.fail(result.RTN_MSG);
    }
  };

  const showAddTodoModal = () => {
    $m.show({ component: AddTodoModal, id: 'addTodoModal', data: { mode: 'ADD' } });
  };

  defineExpose({
    todayTodos,
    showAddTodoModal,
    onClickFinish,
    onClickDelete
  });
</script>
