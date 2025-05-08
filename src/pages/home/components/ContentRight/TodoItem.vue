<template>
  <li :class="levelAndIcon[0]">
    <!-- <img :src="levelAndIcon[1]" alt="ICON" /> -->
    <div class="oval"></div>
    <h6>{{ todoItem.TODO_TYPE_NAME }}</h6>
    <div v-if="todoItem.TODO_TYPE == '5'">
      <EllipseTippy :disableEllipse="true" :content="handleTodoText(todoItem.TODO_CONTENT)" :manual-refresh="true">
        <span class="font-eudc">
          <cathay-translate code="Component_TodoItem_001" />: 【<a href="#" @click.stop.prevent="homeStore.onClickNAPTodo()">{{
            todoItem.TODO_CONTENT
          }}</a
          >】
        </span>
      </EllipseTippy>
    </div>
    <template v-else>
      <EllipseTippy :content="todoItem.APLY_NO">
        {{ todoItem.APLY_NO }}
      </EllipseTippy>
      <EllipseTippy :disableEllipse="true" :content="handleTodoText(todoItem.TODO_CONTENT)" :manual-refresh="true">
        <span class="font-eudc">{{ todoItem.TODO_CONTENT }}</span>
      </EllipseTippy>
    </template>
    <div class="todo-button">
      <Tippy trigger="click" :arrow="false" theme="todoEditor" v-if="todoItem.TODO_TYPE !== '5'">
        <button class="button edit-todo">
          <svg width="30" height="30" xmlns="http://www.w3.org/2000/svg">
            <g stroke="#E16B5D" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10.5 19.5h2.227l6.312-6.311a1.575 1.575 0 0 0-2.228-2.228L10.5 17.273V19.5zM15.697 12.075l2.228 2.228" />
            </g>
          </svg>
        </button>
        <template #content>
          <ul class="tippy-dropdown-menu">
            <li class="tippy-dropdown-item" @click="openEditTodoModal(todoItem)">
              <cathay-translate code="Component_TodoItem_002" />
            </li>
            <li class="tippy-dropdown-item" @click="onClickDelete(todoItem.TODO_NO)">
              <cathay-translate code="Component_TodoItem_003" />
            </li>
          </ul>
        </template>
      </Tippy>

      <button class="button finish-todo" @click="onClickFinish(todoItem.TODO_NO)">
        <svg width="30" height="30" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M10.75 15.25 13 17.5l6-6"
            stroke="#E16B5D"
            stroke-width="1.5"
            fill="none"
            fill-rule="evenodd"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>
  </li>
</template>
<script setup>
  import iconPaperCheck from '~/assets/images/icon-paper-check.svg';
  import iconFile from '~/assets/images/icon-fire.svg';
  import iconMail from '~/assets/images/icon-mail.svg';
  import iconBell from '~/assets/images/icon-bell.svg';
  import { Tippy, useTippy } from 'vue-tippy';
  import useModal from '~/composables/useModal';
  import AddTodoModal from '../Modals/AddTodoModal.vue';
  import useSwal from '~/composables/useSwal';
  import EllipseTippy from '~/components/EllipseTippy.vue';
  import { useHomeStore } from '~/stores/home';
  import { useLanguageStore } from '~/stores/language';

  const homeStore = useHomeStore();
  const language = useLanguageStore();
  const { $swal } = useSwal();
  const { $m } = useModal();
  const props = defineProps({
    todo: {
      type: Object,
      required: true,
      default: {
        TODO_DATE: '',
        TODO_CONTENT: '',
        TODO_NO: '',
        IMPO_LEVEL: '',
        FINS_DATE: '',
        TODO_TYPE: '',
        APLY_NO: '',
        TODO_TYPE_NAME: ''
      }
    },
    onClickFinish: {
      type: Function,
      required: false,
      default: (todoNo) => console.log('finish todo!')
    },
    onClickDelete: {
      type: Function,
      required: false,
      default: (todoNo) => console.log('delete todo!')
    }
  });

  const todoItem = toRef(props, 'todo');
  // 根據重要性決定class和icon
  var levelAndIcon = computed(() => {
    // 如果已完成要顯示已完成樣式
    if (todoItem.value.FINS_DATE) {
      return ['finished', iconPaperCheck];
    }
    switch (todoItem.value.IMPO_LEVEL) {
      case '1':
        return ['danger', iconFile];
      case '2':
        return ['warning', iconBell];
      case '3':
        return ['normal', iconMail];
      default:
        return ['', ''];
    }
  });

  const onClickFinish = (todoNo) => {
    // 未完成才能點擊完成
    if (levelAndIcon.value[0] !== 'finished') {
      props.onClickFinish(todoNo);
    }
  };

  const openEditTodoModal = (todo) => {
    $m.show({ component: AddTodoModal, id: 'addTodoModal', data: { mode: 'EDIT', editingTodo: todo } });
  };

  const onClickDelete = (todoNo) => {
    $swal.confirm(language.translate('Component_TodoItem_004'), () => props.onClickDelete(todoNo), language.translate('Component_TodoItem_003'));
  };

  const handleTodoText = (content) => {
    const concatArray = [];
    concatArray.push(content);
    return concatArray.join('、');
};
</script>
<style lang="scss">
  .tippy-box[data-theme~='todoEditor'] {
    border: 2px solid #c9c9c9;
    color: #585862;
    .tippy-dropdown-item:hover {
      background-color: #f5f5f5;
    }
  }
</style>
