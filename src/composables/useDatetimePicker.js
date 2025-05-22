import bulmaCalendar from '~/common/ui/bulma-calendar';
import useMoment from '~/composables/useMoment';
import { useLanguageStore } from "~/stores/language";

export default function useDatetimePicker(element, customOption = {}) {
  const { getVNDate, format, isValidDate, add, isSameOrAfter } = useMoment();
  const language = useLanguageStore();
  const defaultOption = {
    type: 'date',
    dateFormat: 'yyyy-MM-dd',
    isRange: false,
    showHeader: false,
    showFooter: true,
    showButtons: false,
    showTodayButton: false,
    showClearButton: false,
    showCancelButton: false,
    closeOnSelect: false,
    weekStart: 1,
    validateLabel: language.translate("Composables_UseDatetimePicker_001"), // 確認
    cancelLabel: language.translate("Composables_UseDatetimePicker_002"), // 取消
    clearLabel: language.translate("Composables_UseDatetimePicker_003"), // 清除
    minuteSteps: 15,
    readonly: false,
    multiselectMode: false,
    placeholder: language.translate("Composables_UseDatetimePicker_004"), // 請選擇日期
    formats: {
      header: 'LLL yyy',
      navigationMonth: 'LLL',
      navigationYear: (year) => year.getFullYear(),
      selectMonth: 'LLL',
      selectYear: (year) => year.getFullYear(),
      weekday: 'ccccc'
    }
  };

  const option = {
    ...defaultOption,
    ...customOption
  };

  let picker = bulmaCalendar.attach(element, option)[0];

  let yearNav = document.querySelector('.datepicker-nav-year');
  yearNav.addEventListener('click', () => {
    let years = document.querySelector('.datepicker-years');
    let yearActive = document.querySelector('.datepicker-year.is-active');
    years.scroll({
      top: yearActive.offsetTop - years.offsetTop - years.clientHeight / 2,
      behavior: 'instant'
    });
  });

  // 使用者輸入的Input框
  const userInput = picker.element.previousElementSibling;
  if (userInput.tagName !== 'INPUT') throw 'Cannot find picker input';
  userInput.placeholder = option.placeholder;
  if (option.isRange && userInput.previousElementSibling.classList.contains('is-datetimepicker-range')) {
    userInput.previousElementSibling.remove();
    userInput.parentElement.classList.add('is-range');
  }

  if (option.multiselectMode) picker._ui.calendar.classList.add('is-multiselect');
  // input readonly setting
  if (!option.readonly) userInput.removeAttribute('readonly');

  // 民國年格式 //2024 01-01-2024
    let ROCFormat = option.type === 'datetime' ? 'MM-DD HH:mm' : 'DD-MM-YYYY';
        let CEFormat = ROCFormat;

  class DatetimePicker {
    // Getter
    get option() {
      return option;
    }
    get bulmaCalendar() {
      return picker;
    }
    get userInput() {
      return userInput;
    }
    // Method
    set onSave(saveCallback) {
      picker.on('save', (date) => {
        console.log('save');

        if (option.multiselectMode) {
          if (saveCallback) saveCallback(picker.datePicker.highlightedDates);
          return;
        }

        let getDate = date.data.value();
        let rocDate = getDate ? getVNDate(new Date(getDate), ROCFormat) : '';
        let ceDate = date.data.value();
        userInput.value = rocDate;
        if (option.isRange) {
          // 兩個日期都要選才回傳
          if (date.data.startDate && date.data.endDate) {
            // range會回傳array開始跟結束時間
            ceDate = [format(date.data.startDate, CEFormat), format(date.data.endDate, CEFormat)];
            // debugger;
            let rStartDate = getVNDate(ceDate[0], ROCFormat);
            let rEndDate = getVNDate(ceDate[1], ROCFormat);
            rocDate = [rStartDate, rEndDate];
            userInput.value = `${rStartDate}~${rEndDate}`;
          } else {
            userInput.value = '';
            ceDate = '';
            rocDate = '';
          }
        }
        if (saveCallback) saveCallback(ceDate, rocDate);
      });
    }
    set onClear(clearCallback) {
      if (clearCallback) picker.options.onClearCallback = clearCallback;
    }
    set onSelect(selectCallback) {
      picker.on('select', (date) => {
        if (selectCallback) selectCallback(date);
      });
    }

    set onShow(onShowCallback) {
      picker.on('show', () => {
        if (onShowCallback) onShowCallback();
      });
    }

    set onInputChange(changeCallback) {
      userInput.addEventListener('change', (event) => {
        console.log('change');
        if (!option.isRange) {
          // TODO: 要根據option的格式做檢核
          if (
            isValidDate(event.target.value, 'YY-MM-DD', true) ||
            isValidDate(event.target.value, 'YYY-MM-DD', true) ||
            isValidDate(event.target.value, 'YYY-MM-DD HH:mm', true)
          ) {
            let splitDate = event.target.value.split('-');
            let CEDate = `${Number(splitDate[0]) + 1911}-${splitDate[1]}-${splitDate[2]}`;
            picker.value(new Date(CEDate));
            let ROCDate = getVNDate(CEDate, ROCFormat);
            event.target.value = ROCDate;

            if (changeCallback) changeCallback(CEDate, ROCDate);
          }
        } else {
          // Range Picker Manual Input
          if (event.target.value.includes('~')) {
            let rangeDates = event.target.value.split('~');
            if ((isValidDate(rangeDates[0], 'YY-MM-DD', true) || isValidDate(rangeDates[0], 'YYY-MM-DD', true) || isValidDate(rangeDates[0], 'YYY-MM-DD HH:mm', true)) &&
                (isValidDate(rangeDates[1], 'YY-MM-DD', true) || isValidDate(rangeDates[1], 'YYY-MM-DD', true) || isValidDate(rangeDates[1], 'YYY-MM-DD HH:mm', true))) {
              let startSplitDate = rangeDates[0].split('-');
              let startCEDate = `${Number(startSplitDate[0]) + 1911}-${startSplitDate[1]}-${startSplitDate[2]}`;
              let endSplitDate = rangeDates[1].split('-');
              let endCEDate = `${Number(endSplitDate[0]) + 1911}-${endSplitDate[1]}-${endSplitDate[2]}`;
              let chgDatesOrder = isSameOrAfter(startCEDate, endCEDate);
              let startDate = chgDatesOrder ? endCEDate : startCEDate;
              let endDate = chgDatesOrder ? startCEDate : endCEDate;
              this.value(`${startDate} ~ ${endDate}`);
              if (changeCallback) changeCallback(startDate, endDate);
            }
          }
        }

        // event.target.value = getVNDate(targetDate);
      });
    }

    value(value) {
      if (!option.isRange) {
        let date = new Date(value);
        picker.value(date);
        userInput.value = getVNDate(date, ROCFormat);
      } else {
        // userInput.value = value;
        // userInput.value = getVNDate()
        try {
          picker.value(value.replace('~', '-')); // yyyy-MM-dd - yyyy-MM-dd
          let d = value.split('~');
          console.log(d);
          userInput.value = `${getVNDate(d[0].trim(), ROCFormat)}~${getVNDate(d[1].trim(), ROCFormat)}`;
        } catch (e) {
          throw e + '日期範圍格式錯誤';
        }
      }
    }

    getValue() {
      return picker.value();
    }

    show() {
      picker.show();
    }

    hide() {
      picker.hide();
    }

    refresh() {
      picker.refresh();
    }

    hightlightDate(date) {
      let d = typeof date === 'string' ? new Date(date) : date;
      const index = picker.datePicker.highlightedDates.map(Number).indexOf(+d);
      // 已存在就移除 => 改成先不做事，只有點沒選過的日期要新增
      if (index > -1) {
        // picker.datePicker.highlightedDates.splice(index, 1);
      } else {
        picker.datePicker.highlightedDates.push(d);
      }
    }

    isOpen() {
      return picker.isOpen();
    }

    clear() {
      userInput.value = '';
      picker.clear();
    }

    destroy() {
      document.getElementById(picker.id).remove();
      picker = null;
    }
  }

  return {
    datetimePicker: new DatetimePicker()
  };
}
