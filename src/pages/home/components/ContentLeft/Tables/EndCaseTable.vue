<template>
  <div class="block table-block">
    <div class="block-title-outside scroll-fix is-flex is-justify-content-space-between is-align-items-center">
      <p>
        <cathay-translate code="Component_EndCaseTable_001" /> <span>({{ endCaseData.length }})</span>
      </p>
      <div class="control mr-5 mb-3">
        <div class="endcase-datepicker-wrapper">
          <input class="input is-normal" type="date" ref="calendarTrigger" />
        </div>
        <div class="datetimepicker-dummy is-primary">
          <div class="datetimepicker-dummy-wrapper" id="pickerInputWrapper">
            <input id="pickerInput" type="text" class="input is-normal" v-model="selectedRangeDateString" readonly />
          </div>
        </div>
      </div>
    </div>
    <div class="block-content">
      <table class="table is-striped-odd is-fullwidth" id="dataTable">
        <StickyThead>
          <tr class="scroll-fix">
            <SortingThead sortKey="APLY_DATE" :currentSortKey="sortName" :isSortDesc="isSortDesc" :onClickSort="setSort">
              <cathay-translate code="Component_EndCaseTable_002" />
            </SortingThead>
            <SortingThead sortKey="APLY_NO" :currentSortKey="sortName" :isSortDesc="isSortDesc" :onClickSort="setSort">
              <cathay-translate code="Component_EndCaseTable_003" />
            </SortingThead>
            <SortingThead sortKey="CLAM_CAT" :currentSortKey="sortName" :isSortDesc="isSortDesc" :onClickSort="setSort">
              <cathay-translate code="Component_EndCaseTable_004" />
            </SortingThead>
            <th><cathay-translate code="Component_EndCaseTable_005" /></th>
            <SortingThead sortKey="DECD_EMP_NAME" :currentSortKey="sortName" :isSortDesc="isSortDesc" :onClickSort="setSort">
              <cathay-translate code="Component_EndCaseTable_006" />
            </SortingThead>
            <SortingThead sortKey="END_CASE_DATE" :currentSortKey="sortName" :isSortDesc="isSortDesc" :onClickSort="setSort">
              <cathay-translate code="Component_EndCaseTable_007" />
            </SortingThead>
            <th><cathay-translate code="Component_EndCaseTable_008" /></th>
            <th><cathay-translate code="Component_EndCaseTable_009" /></th>
            <th><cathay-translate code="Component_EndCaseTable_010" /></th>
          </tr>
        </StickyThead>
        <tbody>
          <tr v-for="endCase in endCaseData" :key="endCase.APLY_NO">
            <td width="120px" style="min-width: 120px">{{ getVNDate(endCase.APLY_DATE) }}</td>
            <td style="width: 80px">
              <a href="#" @click.stop.prevent="onClickApplyNo(endCase)">{{ endCase.APLY_NO }}</a>
              <br />
              {{ language.translate('Common_Service_Center') + ':' + endCase.ACCEPT_DIV_NAME }}
            </td>
            <td class="limit-width w-105" width="125">
              <EllipseTippy
                :disableEllipse="true"
                :content="handleClamCatText(endCase.CLAM_CAT, language.translate('Common_CLAIM_CAT_' + endCase.CLAM_CAT))"
                :manual-refresh="true"
              >
                <span class="w-50 is-block">{{ endCase.CLAM_CAT }}</span>
              </EllipseTippy>
            </td>
            <td width="106" class="limit-width w-105 pr-3">
              <EllipseTippy :content="endCase.OCR_NAME" class="font-eudc" displayBlock>{{ endCase.OCR_NAME }}</EllipseTippy>
            </td>
            <td width="106" class="limit-width w-105 pr-3">
              <EllipseTippy :content="endCase.DECD_EMP_NAME" class="font-eudc" displayBlock>{{
                endCase.DECD_EMP_NAME
              }}</EllipseTippy>
            </td>
            <td width="128">{{ getVNDate(endCase.END_CASE_DATE) }}</td>
            <td width="128">
              <button
                class="primary-button-light"
                @click="onClickNote(endCase.APLY_NO)"
                style="border: 2px solid #b7dc94; border-radius: 15px"
              >
                <cathay-translate code="Component_EndCaseTable_011" />
              </button>
            </td>
            <td width="176">
              <p v-for="endCaseTodo in endCase.endCaseToDoList">
                <span class="font-eudc">{{ endCaseTodo.END_TODO_NAME }}</span>
              </p>
            </td>
            <td class="has-left-border limit-width" width="154" style="max-width: 154px">
              <EllipseTippy v-if="endCase.PIN_MEMO != ''" :content="endCase.PIN_MEMO">
                <p class="note font-eudc">
                  {{ endCase.PIN_MEMO }}
                </p>
              </EllipseTippy>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script setup>
  // 已結案表格
  import { storeToRefs } from 'pinia';
  import { onClickOutside } from '@vueuse/core';
  import bulmaCalendar from '~/common/ui/bulma-calendar';
  import { handleClamCatText } from '~/common/utils';
  import EllipseTippy from '~/components/EllipseTippy.vue';
  import SortingThead from '~/components/SortingThead.vue';
  import useCaseTable from '~/composables/useCaseTable';
  import useMoment from '~/composables/useMoment';
  import useSwal from '~/composables/useSwal';
  import useTableSort from '~/composables/useTableSort';
  import StickyThead from '../StickyThead.vue';
  import moment from 'moment';
  import { useLanguageStore } from '~/stores/language';
  import { useHomeStore } from '~/stores/home';

  const homeStore = useHomeStore();
  const language = useLanguageStore();
  const { $swal } = useSwal();
  const { getVNDate, format, diff, getDate } = useMoment();
  const defaultDate = {
    start: getDate(new Date()),
    end: getDate(new Date())
  };

  const { dataCnt } = storeToRefs(homeStore);
  const endCaseData = await useCaseTable('endCaseList_mapList', defaultDate.start, defaultDate.end);
  const calendarTrigger = ref(null);
  const selectedRangeDateString = ref(
    `${moment(defaultDate.start).format('DD/MM/yyyy')}~${moment(defaultDate.end).format('DD/MM/yyyy')}`
  );

  onMounted(() => {
    const pickerOption = {
      type: 'date',
      isRange: true,
      dateFormat: 'yyyy/MM/dd',
      showHeader: false,
      showFooter: false,
      showButtons: false,
      showTodayButton: false,
      showClearButton: false,
      weekStart: 1,
      validateLabel: '確定',
      cancelLabel: '取消',
      minuteSteps: 15,
      formats: {
        header: 'LLL yyy',
        navigationMonth: 'LLL',
        navigationYear: 'yyyy年',
        selectMonth: 'LLL',
        selectYear: 'yyyy',
        weekday: 'ccccc'
      }
    };
    // console.log(calendarTrigger.value);
    let picker = bulmaCalendar.attach(calendarTrigger.value, pickerOption)[0];
    // set default range date
    picker.value(`${defaultDate.start} - ${defaultDate.end}`);
    let pickerElement = document.querySelector('.endcase-datepicker-wrapper .datetimepicker');
    const showPicker = () => {
      pickerElement.classList.add('is-active');
    };

    const hidePicker = () => {
      pickerElement.classList.remove('is-active');
    };

    onClickOutside(pickerElement, (event) => {
      // console.log(event);
      if (!event.target.closest('.swal2-container')) hidePicker();
    });

    // 選擇完起訖日期後觸發
    picker.on('select', async (date) => {
      let startDate = format(date.data.startDate, 'YYYY-MM-DD');
      let endDate = format(date.data.endDate, 'YYYY-MM-DD');
      // 檢核日期最多只能選30天
      let diffDay = diff(startDate, endDate);
      if (Math.abs(diffDay) >= 30) {
        $swal.fail(language.translate('Component_EndCaseTable_012'));
      } else {
        selectedRangeDateString.value = `${moment(startDate).format('DD/MM/yyyy')}~${moment(endDate).format('DD/MM/yyyy')}`;
        hidePicker();
        // Make api call and render the new data
        const response = await useCaseTable('endCaseList_mapList', startDate, endDate);
        dataCnt.value.decdCnt_map.CLAM_END_CASE_CNT = response.length;
        endCaseData.length = 0;
        endCaseData.push(...response);
      }
    });

    document.getElementById('pickerInputWrapper').addEventListener('click', () => {
      showPicker();
    });
  });

  const { sortName, isSortDesc, setSort } = useTableSort(endCaseData);

  const onClickApplyNo = (data) => {
    let flag = 'FLAG=0';

    if (data.APLY_STS == '20' || data.APLY_STS == '40' || data.APLY_STS == '45' || data.APLY_STS == '50' ) {
      flag += '&LINK_STATUS=' + data.APLY_STS;
    }
    window.open(`/servlet/HttpDispatcher/AAA4_0100/prompt?newTxRequest=true&${flag}&PROCESS_NUM=${data.APLY_NO}`);
  };

  const onClickNote = (applyNo) => {
    window.open(`/servlet/HttpDispatcher/AAH0_0900/prompt?PROCESS_NUM=${applyNo}`);
  };
</script>
<style lang="scss">
  .endcase-datepicker-wrapper {
    .datetimepicker-dummy {
      display: none !important;
    }
    .datetimepicker {
      margin-top: 67px;
    }
  }
  #pickerInput {
    width: 255px;
  }
  .control .datetimepicker-dummy .datetimepicker-dummy-wrapper {
    background: transparent;
    input {
      background: white;
      border: 2px solid #b7dc94;
    }
  }
</style>
