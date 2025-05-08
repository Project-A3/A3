<template>
  <div class="block calendar-block">
    <div class="block-title-outside"><cathay-translate code="Component_Calendar_001" /></div>
    <div class="block-content">
      <div class="calendar">
        <div class="calendar-menu">
          <div id="calendarNavi" class="calendar-navi">
            <div class="calendar-navi-title">
              <input type="hidden" ref="pickerRef" />
              <img src="/src/assets/images/icon-calendar.svg" alt="CALENDAR" />
              <span id="renderRange" class="render-range"></span>
            </div>
            <div class="calendar-navi-button">
              <button type="button" class="button move-day" data-action="move-prev">
                <img src="/src/assets/images/icon-arrow-up.svg" alt="ARROW" data-action="move-prev" />
              </button>
              <button type="button" class="button move-day ms-10" data-action="move-next">
                <img src="/src/assets/images/icon-arrow-down.svg" alt="ARROW" data-action="move-next" />
              </button>
            </div>
            <button type="button" class="button move-today" data-action="move-today">
              <cathay-translate code="Component_Calendar_002" />
            </button>
          </div>
        </div>

        <div id="calendar" style="height: 265px" ref="calendarTarget"></div>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { isEmpty } from 'lodash-es';
  import { storeToRefs } from 'pinia';
  import { watch } from 'vue';
  import calendar from '~/common/ui/calendar';
  import useDatetimePicker from '~/composables/useDatetimePicker';
  import useMoment from '~/composables/useMoment';
  import useSwal from '~/composables/useSwal';
  import { useHomeStore } from '~/stores/home';
  import { useLanguageStore } from '~/stores/language';
  import { useIntersectionObserver } from '@vueuse/core';

  const calendarTarget = ref(null);
  const homeStore = useHomeStore();
  const { calendarData, currentCalendarSelecedDate } = storeToRefs(useHomeStore());
  const { getDate, now } = useMoment();
  const { $swal } = useSwal();
  const language = useLanguageStore();

  // console.log(calendarData.value);
  let calInstance = null;
  // 目前選擇的待辦日期ID
  let selectedScheduleId = ref('TODAY');
  let pickerRef = ref(null);

  watch(
    () => language.languages,
    (newValue, oldValue) => {
      if (newValue !== oldValue) {
        calInstance.setOptions({
          month: {
            daynames: [
              language.translate('Component_Calendar_004'),
              language.translate('Component_Calendar_005'),
              language.translate('Component_Calendar_006'),
              language.translate('Component_Calendar_007'),
              language.translate('Component_Calendar_008'),
              language.translate('Component_Calendar_009'),
              language.translate('Component_Calendar_010')
            ]
          }
        });
      }
    }
  );

  useIntersectionObserver(calendarTarget, ([{ isIntersecting }]) => {
    if (isIntersecting) {
      calInstance.setOptions({
        month: {
          daynames: [
            language.translate('Component_Calendar_004'),
            language.translate('Component_Calendar_005'),
            language.translate('Component_Calendar_006'),
            language.translate('Component_Calendar_007'),
            language.translate('Component_Calendar_008'),
            language.translate('Component_Calendar_009'),
            language.translate('Component_Calendar_010')
          ]
        }
      });
    }
  });

  onMounted(() => {
    console.log('calendar mounted!');
    calendarTarget.value;
    const daynames = [
      language.translate('Component_Calendar_004'),
      language.translate('Component_Calendar_005'),
      language.translate('Component_Calendar_006'),
      language.translate('Component_Calendar_007'),
      language.translate('Component_Calendar_008'),
      language.translate('Component_Calendar_009'),
      language.translate('Component_Calendar_010')
    ];

    if (calInstance === null) calInstance = calendar.init(calendarData.value.todoCountList, daynames);
    // 將instance放入Store共用
    homeStore.currentCalendarInstance = calInstance;
    const refreshCalendar = async (start, end) => {
      let strStartDate = getDate(start.toDate());
      let strEndDate = getDate(end.toDate());
      let result = await homeStore.getTodoDailyCounts(strStartDate, strEndDate);
      if (result.IS_SUCCESS) {
        // Render 日曆圓點
        homeStore.setTodoDailyCounts(result.todoCnt_mapList);
      } else {
        console.error(result.RTN_MSG);
        $swal.fail(result.RTN_MSG);
      }
    };
    // 刷新當日待辦
    const refreshTodos = async (date) => {
      const result = await homeStore.getTodoList(date);
      if (result.IS_SUCCESS) {
        homeStore.setTodoList(result?.todoList_mapList);
      } else {
        // TODO: 查無資料處理
        homeStore.cleanTodoList();
        console.error(language.translate('Component_Calendar_003') + ` ${result.RTN_MSG}`); // 取得當日待辦失敗
      }
    };

    // 改變日曆到指定日期
    const changeCalendarToDate = async (date) => {
      calInstance.setDate(new Date(date));
      await refreshCalendar(calInstance.getDateRangeStart(), calInstance.getDateRangeEnd());
      await refreshTodos(date);
      currentCalendarSelecedDate.value = new Date(date);
      calInstance.highlightDate(date);
      calInstance.setRenderRangeText();
    };

    // 切換至上兩週
    calInstance.onMovePrev = refreshCalendar;
    // 切換至下兩週
    calInstance.onMoveNext = refreshCalendar;
    // 移至今天
    calInstance.onMoveToday = async (start, end) => {
      await changeCalendarToDate(now('YYYY-MM-DD'));
      selectedScheduleId.value = 'TODAY';
      calendar.highlightToday();
    };
    // 點擊Schedule
    calInstance.on('clickSchedule', async (event) => {
      // 將行事曆當天變成active的樣式
      let className = '.tui-full-calendar-weekday-grid-line.tui-full-calendar-near-month-day';
      document.elementsFromPoint(event.event.clientX, event.event.clientY).forEach((e) => {
        if (e.matches(className)) {
          calInstance.removeAllSelected();
          e.classList.add('is-selected');
        }
      });

      const schedule = event.schedule;
      // 取得點擊的待辦日期(要去除最後一個字是因為最後一個字為當天的index)
      let clickDate = schedule.id.slice(0, -1);
      currentCalendarSelecedDate.value = new Date(clickDate);
      selectedScheduleId.value = schedule.id;
      // 刷新待辦
      await refreshTodos(clickDate);
      let removeHover = () =>
        document.querySelectorAll('.tui-full-calendar-near-month-day').forEach((e) => e.classList.remove('is-hover'));

      removeHover();
    });

    // 點擊沒有待辦的日期
    calInstance.onClickDate = (date) => {
      // alert(date);
      currentCalendarSelecedDate.value = date;
      homeStore.cleanTodoList();
    };

    calInstance.on('afterRenderSchedule', function (event) {
      const schedule = event.schedule;
      const element = calInstance.getElement(schedule.id, schedule.calendarId);
      let eleCount = element.querySelector('.tui-full-calendar-weekday-schedule-title');
      if (eleCount) eleCount.removeAttribute('title');
      if (selectedScheduleId.value === 'TODAY') {
        calendar.highlightToday();
      } else {
        if (schedule.id == selectedScheduleId.value) {
          if (element) {
            const clientRect = element.getBoundingClientRect();
            const clientX = clientRect.left;
            const clientY = clientRect.top;
            let className = '.tui-full-calendar-weekday-grid-line.tui-full-calendar-near-month-day';
            document.elementsFromPoint(clientX, clientY).forEach((e) => {
              if (e.matches(className)) {
                calInstance.removeAllSelected();
                e.classList.add('is-selected');
              }
            });
          }
        }
      }

      /** 處理hover樣式 */
      document.querySelectorAll('.tui-full-calendar-weekday-schedules .tui-full-calendar-weekday-schedule-title').forEach((e) => {
        let className = '.tui-full-calendar-weekday-grid-line.tui-full-calendar-near-month-day';

        e.addEventListener(
          'mouseover',
          function (event) {
            document.elementsFromPoint(event.clientX, event.clientY).forEach((el) => {
              if (el.matches(className) && !el.classList.contains('is-hover')) {
                // calInstance.removeAllSelected();
                document.querySelectorAll('.tui-full-calendar-near-month-day').forEach((e) => e.classList.remove('is-hover'));
                el.classList.add('is-hover');
              }
            });
          },
          false
        );
      });

      document.querySelectorAll('.tui-full-calendar-near-month-day').forEach((e) => {
        // console.log(e);

        e.addEventListener(
          'mouseout',
          function () {
            e.classList.remove('is-hover');
          },
          false
        );
      });
      // use the element
      // console.log(element);
    });

    const { datetimePicker } = useDatetimePicker(pickerRef.value);
    //點擊日期範圍文字
    calInstance.onClickRangeText = () => {
      datetimePicker.show();
    };
    // 選擇小日曆日期後
    datetimePicker.onSave = async (CEDate, ROCDate) => {
      if (!isEmpty(CEDate)) await changeCalendarToDate(CEDate);
    };
  });
  onBeforeUnmount(() => {
    if (calInstance) {
      calInstance.clear();
      calInstance.destroy();
      calendarTarget.value.innerHTML = '';
    }
  });

  // 移除title attribute
  const removeTitleAttributes = () => {
    document.querySelectorAll('.calendar .tui-full-calendar-weekday-schedule-title').forEach((e) => e.removeAttribute('title'));
  };

  // 每當日曆資料更新時要刷新calendar
  watch(calendarData, async (count, prevCount) => {
    if (calInstance != null) {
      calInstance.clear();
      calInstance.createSchedules(calendarData.value.todoCountList, true);
      calInstance.render();

      // alert('change');
      if (selectedScheduleId.value === 'TODAY') {
        // alert('today');
        setTimeout(() => {
          calendar.highlightToday();
        }, 200);
      }
    }
  });

  defineExpose({
    calendarData
  });
</script>
<style lang="scss">
  .calendar .datetimepicker-dummy {
    display: none;
  }
</style>
