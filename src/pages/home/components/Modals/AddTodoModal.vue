<template>
  <Modal>
    <template v-slot:title
      >{{
        isEditing ? language.translate('Component_AddTodoModal_001') : language.translate('Component_AddTodoModal_002')
      }}&nbsp;<cathay-translate code="Component_AddTodoModal_003"
    /></template>
    <template v-slot:content>
      <div class="columns">
        <div class="column">
          <input type="date" ref="pickerRef" />
        </div>
        <div class="column">
          <BaseDropdown :options="levelDropdownOptions" :onSelected="onLevelDropdownSelected" class="width-small"></BaseDropdown>
        </div>
      </div>
      <div class="columns">
        <div class="column">
          <BaseDropdown :options="typeDropdownOptions" :onSelected="onTypeDropdownSelected" class="width-full"></BaseDropdown>
        </div>
        <div class="column">
          <input v-model="todo.applyNo" type="text" :placeholder="language.translate('Component_AddTodoModal_004')" />
        </div>
      </div>
      <div class="columns">
        <div class="column is-full">
          <textarea
            v-model="todo.content"
            class="resize-vertical font-eudc"
            rows="4"
            :placeholder="language.translate('Component_AddTodoModal_005')"
            maxlength="200"
          ></textarea>
          <div style="text-align: right;  font-size: 14px;">{{todo.content.length}}/200</div>
          <p class="has-text-danger">{{ inValidMessage }}</p>
        </div>
      </div>
    </template>
    <template v-slot:buttons>
      <button class="button is-light" @click="props.close"><cathay-translate code="Component_AddTodoModal_006" /></button>
      <button class="button is-primary" @click="onSubmit"><cathay-translate code="Component_AddTodoModal_007" /></button>
    </template>
  </Modal>
</template>
<script setup>
  import { cloneDeep, isEmpty } from 'lodash-es';
  import BaseDropdown from '~/components/BaseDropdown.vue';
  import Modal from '~/components/Modal.vue';
  import useDatetimePicker from '~/composables/useDatetimePicker';
  import useMoment from '~/composables/useMoment';
  import useSwal from '~/composables/useSwal';
  import { useHomeStore } from '~/stores/home';
  import { useLanguageStore } from '~/stores/language';
  import { useQuickSearchStore } from '~/stores/quickSearch';
  const { $swal } = useSwal();
  const { getDate, format, isValidDate, isBetween } = useMoment();
  const homeStore = useHomeStore();
  const quickSearchStore = useQuickSearchStore();
  const language = useLanguageStore();

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

  const mode = props.data?.mode;
  const isEditing = mode === 'EDIT';
  const editingTodo = isEditing ? props.data?.editingTodo : {};
  console.log(mode);
  if (mode === 'ADD') {
    // 新增
  } else if (mode === 'EDIT') {
    // 修改
    console.log(props.data?.editingTodo);
  }

  const todo = reactive({
    todoNo: !isEditing ? '' : editingTodo.TODO_NO,
    date: '', // 初始值在init datetimepicker時設定
    level: !isEditing ? '1' : editingTodo.IMPO_LEVEL,
    type: !isEditing ? '' : editingTodo.TODO_TYPE,
    applyNo: !isEditing ? '' : editingTodo.APLY_NO,
    content: !isEditing ? '' : editingTodo.TODO_CONTENT
  });


  const levelDropdownOptions = [
    {
      name: '<small class="dot danger"></small><span>' + language.translate('Component_AddTodoModal_008') + '</span>', // 重要
      value: '1',
      allowHtml: true,
      selected: true
    },
    {
      name: '<small class="dot warning"></small><span>' + language.translate('Component_AddTodoModal_009') + '</span>', // 次要
      value: '2',
      allowHtml: true
    },
    {
      name: '<small class="dot success"></small><span>' + language.translate('Component_AddTodoModal_010') + '</span>', // 普通
      value: '3',
      allowHtml: true
    }
  ];
  const onLevelDropdownSelected = (value) => {
    todo.level = value;
  };

  if (isEditing) {
    // 編輯時要先將選項選好
    levelDropdownOptions.forEach((o) => {
      if (o.value === editingTodo.IMPO_LEVEL) {
        levelDropdownOptions[0].selected = false;
        o.selected = true;
      }
    });
  }

  const typeDropdownOptions = cloneDeep(quickSearchStore.memoOptions);
  const onTypeDropdownSelected = (value) => {
    todo.type = value;
  };
  if (isEditing) {
    // 編輯時要先將選項選好
    typeDropdownOptions.forEach((o) => {
      if (o.value === editingTodo.TODO_TYPE) {
        typeDropdownOptions[0].selected = false;
        o.selected = true;
      }
    });
  }

  const pickerRef = ref(null);
  onMounted(() => {
    const pickerOption = {
      type: 'datetime',
      showClearButton: false,
      showCancelButton: true,
      minuteSteps: 10
    };
    const { datetimePicker } = useDatetimePicker(pickerRef.value, pickerOption);

    // Loop on each calendar initialized
    let defaultDate = homeStore.currentCalendarSelecedDate;
    // console.log(defaultDate);
    // 預設目前時間點+1整點
    let nextHour = new Date().getHours() + 1;
    defaultDate.setHours(nextHour, 0, 0, 0);
    // 給日曆和todo date預設值
    datetimePicker.value(!isEditing ? defaultDate : new Date(editingTodo.TODO_DATE));
    todo.date = format(!isEditing ? defaultDate : editingTodo.TODO_DATE, 'YYYY-MM-DD HH:mm');

    // 使用者自行手動輸入
    datetimePicker.onInputChange = (CEDate, ROCDate) => {
      todo.date = CEDate;
    };
    // 使用者選擇日期後點確認
    datetimePicker.onSave = (CEDate, ROCDate) => {
      let fullDateTime = format(CEDate, 'YYYY-MM-DD HH:mm');
      todo.date = fullDateTime;
    };
  });

  const inValidMessage = ref('');
  const validate = () => {
    if (isEmpty(todo.date)) {
      inValidMessage.value = language.translate('Component_AddTodoModal_011'); // 請選擇日期
      return false;
    } else if (isEmpty(todo.type)) {
      inValidMessage.value = language.translate('Component_AddTodoModal_012'); // 請選擇類型
      return false;
    } else if (isEmpty(todo.content)) {
      inValidMessage.value = language.translate('Component_AddTodoModal_013'); // 請輸入行事曆內容
      return false;
    } else if (!isValidDate(todo.date, 'YYYY-MM-DD HH:mm')) {
      console.log(todo.date);
      inValidMessage.value = language.translate('Component_AddTodoModal_014'); // 日期格式錯誤，請輸入有效日期(格式為YYYY-MM-DD HH:mm)
      return false;
    } else {
      inValidMessage.value = '';
      return true;
    }
  };

  const onSubmit = async () => {
    if (!validate()) {
      return;
    }
    todo.date = format(todo.date, 'YYYY-MM-DD HH:mm:ss.SSS');
    console.log(todo);
    let result = !isEditing ? await homeStore.insertTodoList(todo) : await homeStore.updateTodoList(todo);
    if (result.IS_SUCCESS) {
      props.close();
      // 刷新待辦清單
      // 如果是新增目前選擇的日期，則刷新畫面上的待辦清單
      if (getDate(homeStore.currentCalendarSelecedDate) === getDate(todo.date)) {
        // console.log(result);
        homeStore.setTodoList(result.todoList_mapList);
      } // 如果不是，就不動作(因為點到當天時會Call API取最新的資料)

      // 刷新行事曆
      // 如果目前新增的日期有在Range內，就呼叫API刷新Calendar
      let calendarStartDate = getDate(homeStore.currentCalendarInstance.getDateRangeStart().toDate());
      let calendarEndDate = getDate(homeStore.currentCalendarInstance.getDateRangeEnd().toDate());
      console.log(calendarStartDate, calendarEndDate);
      if (isBetween(todo.date, calendarStartDate, calendarEndDate)) {
        console.log('between');
        let result = await homeStore.getTodoDailyCounts(calendarStartDate, calendarEndDate);
        if (result.IS_SUCCESS) {
          // Render 日曆圓點
          homeStore.setTodoDailyCounts(result.todoCnt_mapList);
          homeStore.currentCalendarInstance.highlightDate(getDate(homeStore.currentCalendarSelecedDate));
        } else {
          console.error(result.RTN_MSG);
          // $swal.fail(result.RTN_MSG);
        }
      } // 如果沒有，就不動作

      $swal.success();
    } else {
      $swal.fail(result.RTN_MSG);
    }
  };
</script>

<style lang="scss" scoped>
  .width-full {
    position: fixed;
    width: 260px !important;
    z-index: 55;
  }
</style>
