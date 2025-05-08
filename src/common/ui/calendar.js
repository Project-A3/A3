import moment from 'moment';
import Calendar from 'tui-calendar';

const calendar = {
  init(defaultSchedles = [], daynames, startDate, endDate) {
    let cal = {};
    if (document.getElementById('calendar') != null) {
      cal = new Calendar('#calendar', {
        defaultView: 'month', // set 'month'
        // taskView: ['task'], // e.g. true, false, or ['task', 'milestone']
        scheduleView: true, // e.g. true, false, or ['allday', 'time']
        disableClick: true,
        disableDblClick: true,
        isReadOnly: true,
        template: {
          allday: function (schedule) {
            return `<span class="schedule-count ${schedule.dueDateClass}">${schedule.title}</span>`;
          }
        },
        month: {
          daynames: daynames,
          startDayOfWeek: 1,
          visibleWeeksCount: 2 // visible week count in monthly
        },
        theme: {
          'common.border': '0',
          'common.dayname.color': '#4f4f4f',
          'common.holiday.color': '#4f4f4f',
          'common.saturday.color': '#4f4f4f',
          'month.dayname.borderLeft': '0',
          'month.dayname.fontSize': '14px',
          'month.day.fontSize': '20px',
          'month.dayname.textAlign': 'center',
          'week.dayname.textAlign': 'center'
        }
      });
      // console.log(cal);

      // cal.on('beforeCreateSchedule', function (event) {
      //   console.log(event);
      //   var startTime = event.start;
      //   var endTime = event.end;
      //   var isAllDay = event.isAllDay;
      //   var guide = event.guide;
      //   var triggerEventName = event.triggerEventName;
      //   var schedule;

      //   if (triggerEventName === 'click') {
      //     // open writing simple schedule popup
      //     alert('asdf');
      //   }
      // });

      cal.createSchedules(defaultSchedles);

      cal.removeAllSelected = function () {
        document
          .querySelectorAll('.tui-full-calendar-weekday-grid-line.tui-full-calendar-near-month-day')
          .forEach((dayCell) => dayCell.classList.remove('is-selected'));
      };

      cal.onMovePrev = function () {
        console.log('move previous range');
      };

      cal.onMoveNext = function () {
        console.log('move next range');
      };
      cal.onMoveToday = function () {
        console.log('move today');
      };
      cal.onClickDate = function (date) {
        console.log(`click ${date}`);
      };
      cal.onClickRangeText = function () {
        console.log('click range text');
      };

      cal.highlightDate = function (currentDate) {
        let start = moment(cal.getDateRangeStart().toDate());
        let date = moment(new Date(`${currentDate} 00:00:00`));

        let duration = moment.duration(date.diff(start)).asDays();
        let className = '.tui-full-calendar-weekday-grid-line.tui-full-calendar-near-month-day';
        setTimeout(() => {
          cal.removeAllSelected();
          document.querySelectorAll(className)[duration].classList.add('is-selected');
        }, 10);
      };

      cal.setRenderRangeText = setRenderRangeText;

      // 點擊日期格子(有schedule的不會觸發到，因為schedule蓋在格子上)
      document.addEventListener(
        'click',
        function (e) {
          // console.log(e.target.closest('.open-modal'));
          let className = '.tui-full-calendar-weekday-grid-line.tui-full-calendar-near-month-day';
          if (e.target.matches(className)) {
            cal.removeAllSelected();
            e.target.closest(className).classList.add('is-selected');
            let elementDay = e.target.querySelector('.tui-full-calendar-weekday-grid-date');
            if (elementDay) {
              const dateStart = cal.getDateRangeStart().toDate();
              const dateEnd = cal.getDateRangeEnd().toDate();
              const dayOfMonth = parseInt(elementDay.innerText, 10);
              // console.log(dayOfMonth, dateStart.getDate());
              // 跨月
              // dayOfMonth < dateStart.getDate()
              const dateOfMonth = new Date(
                dateStart.getFullYear(),
                dayOfMonth < dateStart.getDate() ? dateEnd.getMonth() : dateStart.getMonth(),
                dayOfMonth
              );

              cal.onClickDate(dateOfMonth);
            }
          }
        },
        false
      );

      document.getElementById('calendarNavi').addEventListener('click', (e) => {
        onClickNavi(e);
      });

      document.querySelector('.calendar-navi-button').addEventListener('click', (e) => {
        onClickNavi(e);
      });
      document.getElementById('renderRange').addEventListener('click', (e) => {
        cal.onClickRangeText();
      });
      function setRenderRangeText() {
        const renderRange = document.getElementById('renderRange');
        //var options = cal.getOptions();
        //var viewName = cal.getViewName();

        let html = [];
        // console.log(startDate, endDate);
        if (startDate && endDate && isInit) {
          let ROCStartDate = moment(startDate).format('YYYY-MM-DD');
          // debugger;
          let ROCEndDate = moment(endDate).format('YYYY-MM-DD');
          html.push(`${ROCStartDate}～${ROCEndDate}`);
        } else {
          html.push(moment(cal.getDateRangeStart().getTime()).format('YYYY-MM-DD'));
          html.push('～');
          html.push(moment(cal.getDateRangeEnd().getTime()).format('MM-DD'));
        }
        renderRange.innerHTML = html.join('');
      }

      function getDataAction(target) {
        return target.dataset ? target.dataset.action : target.getAttribute('data-action');
      }

      function onClickNavi(e) {
        e.stopPropagation();
        // console.log(e.target);
        const action = getDataAction(e.target);
        switch (action) {
          case 'move-prev':
            cal.prev();
            cal.onMovePrev(cal.getDateRangeStart(), cal.getDateRangeEnd());
            // calendar.onMovePrev();
            break;
          case 'move-next':
            cal.next();
            cal.onMoveNext(cal.getDateRangeStart(), cal.getDateRangeEnd());
            // calendar.onMoveNext();
            break;
          case 'move-today':
            cal.today();
            // cal.removeAllSelected();
            // calendar.highlightToday();
            cal.onMoveToday(cal.getDateRangeStart(), cal.getDateRangeEnd());

            break;
          default:
            return;
        }

        setRenderRangeText();
      }

      setRenderRangeText();
      // console.log(cal);
      // calendar.highlightToday();
    }

    return cal;
  },
  highlightToday() {
    let todayElement = document.querySelector(
      '.tui-full-calendar-weekday-grid-line.tui-full-calendar-near-month-day.tui-full-calendar-today'
    );
    if (todayElement && !todayElement.classList.contains('is-selected')) {
      todayElement.classList.add('is-selected');
    }
  }
};

export default calendar;
