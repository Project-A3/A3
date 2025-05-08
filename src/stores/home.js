import { isEmpty, remove, sortBy } from 'lodash-es';
import { defineStore } from 'pinia';
import { nextTick } from 'vue';
import {
  apiApprDoReturn,
  apiApprRecheck,
  apiDeleteTodoList,
  apiDelRelieveRmk,
  apiFinishToDo,
  apiGetEmpBasic,
  apiGetPersonalData,
  apiGetPersonalDataCnt,
  apiGetServerName,
  apiGetTodoDailyCnt,
  apiGetTodoList,
  apiGetToDoListByAprv,
  apiGetToDoListByDecd,
  apiGetToDoReminder,
  apiGetWaitClamSignStatus,
  apiInsertTodoList,
  apiPinClamCase,
  apiReceiveToDo,
  apiUpdateTodoList
} from '~/common/api';
import { CaseTablesType, ServiceName, UserRoleEnum, WaitApproveType } from '~/common/utils/enum';
import useMoment from '~/composables/useMoment';
import { useAccountingStore } from './accounting';
import { useApplyStore } from './apply';
import { useBeneficiaryStore } from './beneficiary';
import { useDecisionStore } from './decision';
import { useEditableStore } from './editable';
import { useFooterStore } from './footer';
import { useOverviewStore } from './overview';
import { useQuickSearchStore } from './quickSearch';

export const useHomeStore = defineStore('home', {
  state: () => ({
    // 初次進來全部資料
    data: null,
    dataCnt: null,
    // 監聽Table類型flag
    pauseTableWatch: false,
    // 目前的查詢類型
    currentWaitApproveType: '',
    // 目前的查詢項目(表格類型)
    currentCaseTablesType: '',
    // 目前查詢的待核定/待簽擬所有資料
    currentWaitTableData: [],
    // 目前查詢的人員(含代理人)
    currentBusinessAgents: [],
    // 目前行事曆選擇的日期
    currentCalendarSelecedDate: new Date(),
    // 目前行事曆的instance: 提成共用方便其他component使用
    currentCalendarInstance: {},
    // 使用者選擇的待簽收類型，因為預設有可能會切換到此
    currentToBeSignedForType: CaseTablesType.ToBeSignedFor.Rep,
    // 使用者選擇的調查件類型，因為預設有可能會切換到此
    currentSurveyCaseForType: CaseTablesType.SurveyCase.AprvInvs,
    // 使用者選擇的照會意見類型，因為預設有可能會切換到此
    currentNoteCommentForType: CaseTablesType.NoteComment.AprvNotes,
    // 使用者選擇的照會意見類型，因為預設有可能會切換到此
    currentRepCaseForType: CaseTablesType.RepCase.SignRep,
    // 使用者選擇的CMR件類型，因為預設有可能會切換到此
    currentToBeCrmType: WaitApproveType.ToBeCmr.Cathay,
    // 預設進個人化首頁是否有預設要顯示的表格
    hasDefaultCaseTable: false,
    batchRenderId: ''
  }),
  getters: {
    // 登入者資訊
    userInfo(state) {
      let info = state?.data?.empBasic_map;
      if (info) return info;
      else throw 'API無回傳登入者資料';
    },
    // 登入者角色
    userRole(state) {
      if (!isEmpty(this.userInfo.DECD_LEVEL)) {
        // 覆核人員
        if (this.userInfo.DECD_LEVEL === '0' || this.userInfo.DECD_LEVEL === '1') return UserRoleEnum.Aprv;
        // 核賠人員
        else return UserRoleEnum.Decd;
      } else {
        //* 非理賠人員視為覆核人員
        return UserRoleEnum.Aprv;
      }
    },
    getAllagents(state) {
      return state.data.businessAgnt_mapList ?? [];
    },
    // 承辦、免覆核承辦待核定篩選條件
    waitApproveCondition(state) {
      let condition = {
        fiveDaysCount: 0,
        sixTo15DaysCount: 0,
        sixteenTo30DaysCount: 0,
        over30DaysCount: 0,
        // 退回件: 核賠人員才有
        returnCount: 0,
        allCount: 0,
        restartCount: 0,
        // 解除契約: 覆核人員才有
        cancelCount: 0,
        // CMR件
        cmrCount: 0
      };

      if (this.userRole === UserRoleEnum.Decd || this.userRole === UserRoleEnum.Aprv) {
        let isUnderTaker = this.userRole === UserRoleEnum.Decd; // 是否為核賠人員
        let propertyName = isUnderTaker ? 'decdCnt_map' : 'aprvCnt_map';
        let valueName = isUnderTaker ? 'CLAM' : 'APRV';

        // 共同有的一起設定
        condition.fiveDaysCount = state.dataCnt[propertyName][`${valueName}_5DAY_CNT`];
        condition.sixTo15DaysCount = state.dataCnt[propertyName][`${valueName}_6TO15DAY_CNT`];
        condition.sixteenTo30DaysCount = state.dataCnt[propertyName][`${valueName}_16TO30DAY_CNT`];
        condition.over30DaysCount = state.dataCnt[propertyName][`${valueName}_OVER_30DAY_CNT`];
        condition.allCount = state.dataCnt[propertyName][`${valueName}_ALL_CNT`];
        condition.returnCount = state.dataCnt[propertyName][`${valueName}_RETURN_CNT`];
        condition.restartCount = state.dataCnt[propertyName][`${valueName}_RE_START_CNT`];
        condition.cmrCount = state.dataCnt[propertyName][`${valueName}_CMR_CNT`]; //CMR件
        
        // 各自的各自設定
        if (!isUnderTaker){
          condition.cancelCount = state.dataCnt.aprvCnt_map.CNCL_POLICY_CNT; //解除契約
        }
      }

      return condition;
    },
    // 行事曆區塊會用到的資料
    calendarData(state) {
      // 西元日期，到calendar.js轉成民國

      let todoCountList = [];
      state.dataCnt.todoCnt_mapList.forEach((todo) => {
        if (todo.IMPO_LEVEL_H > 0) {
          todoCountList.push({
            id: todo.TODO_DATE + '1',
            calendarId: '1',
            title: todo.IMPO_LEVEL_H,
            category: 'allday',
            dueDateClass: 'danger',
            start: todo.TODO_DATE
          });
        }
        if (todo.IMPO_LEVEL_M > 0) {
          todoCountList.push({
            id: todo.TODO_DATE + '2',
            calendarId: '1',
            title: todo.IMPO_LEVEL_M,
            category: 'allday',
            dueDateClass: 'warn',
            start: todo.TODO_DATE
          });
        }
        if (todo.IMPO_LEVEL_L > 0) {
          todoCountList.push({
            id: todo.TODO_DATE + '3',
            calendarId: '1',
            title: todo.IMPO_LEVEL_L,
            category: 'allday',
            dueDateClass: 'success',
            start: todo.TODO_DATE
          });
        }
      });
      // console.log(todoCountList);

      return {
        startDate: state.data.QUERY_STR_DATE,
        endDate: state.data.QUERY_END_DATE,
        todoCountList
      };
    },
    /**
     * 將待辦事項資料轉成UI要的樣子
     * @param {*} state
     * @returns {fullTime, time: HH:mm, todos: []}
     */
    todayTodos(state) {
      const todos = [];
      const { format } = useMoment();
      state.dataCnt.todoList_mapList.reduce((acc, curr) => {
        const findObj = todos.find((o) => o.fullTime == curr.TODO_DATE);
        // console.log(findObj);
        if (findObj) {
          findObj.todos.push(curr);
          // 按照重要性、等級排序
          findObj.todos = sortBy(findObj.todos, ['TODO_IMPO_LEVEL', 'FINS_DATE']);
        } else {
          todos.push({
            fullTime: curr.TODO_DATE,
            time: format(curr.TODO_DATE, 'HH:mm'),
            todos: [curr]
          });
        }
        return acc;
      }, []);
      return sortBy(todos, ['time']);
    },

    currentRequestAgents(state) {
      return state.currentBusinessAgents.length === 1 ? state.currentBusinessAgents[0] : state.currentBusinessAgents.join('_');
    }
  },
  actions: {
    /**
     * 初始化個人化首頁
     * 時機: 使用者一進來的時候呼叫
     */
    async initPersonalIndex() {
      const route = useRoute();
      let role = route.query?.role;
      let demoCase = '';
      if (role === '1') {
        demoCase = 'All';
      } else if (role === '2') {
        demoCase = 'case3';
      } else if (role === '0') {
        demoCase = 'case1';
      }

      const storageCheckedAgents = sessionStorage.getItem('checkedAgents');
      let reqAgents = storageCheckedAgents ? storageCheckedAgents : demoCase;

      // 取得個人化首頁所有資料
      await this.fetchPersonalData(reqAgents);
      // 設定預設Table資料
      this.setDefaultTableData();
      // 設定初始查詢條件
      this.setDefaultQueryType();
      // 設定預設代理人(全選)
      this.setDefaultBusinessAgents();
      // 處理query string
      this.handleQueryString(route.query);
    },
    handleQueryString(queryString) {
      // 判斷是否要回待簽收
      let sign = queryString?.sign;
      if (sign && this.userRole === UserRoleEnum.Decd) {
        this.currentWaitApproveType = '';
        this.currentCaseTablesType = CaseTablesType.ToBeSignedFor.All;
        switch (sign) {
          case CaseTablesType.ToBeSignedFor.Rep:
          case CaseTablesType.ToBeSignedFor.Invs:
          case CaseTablesType.ToBeSignedFor.Apprs:
            this.currentToBeSignedForType = sign;
            break;
          default:
            this.currentToBeSignedForType = CaseTablesType.ToBeSignedFor.Rep;
            break;
        }
        return;
      }

      // 判斷是否要到待結案頁
      let waitEnd = queryString?.waitEnd;
      if (waitEnd) {
        this.hasDefaultCaseTable = true;
        this.currentWaitApproveType = WaitApproveType.WaitEnd;
      }

      // 判斷是否要到待簽擬頁
      let toBeSigned = queryString?.toBeSigned;
      if (toBeSigned) {
        this.hasDefaultCaseTable = true;
        this.currentWaitApproveType = '';
        this.currentCaseTablesType = CaseTablesType.ToBeSigned;
      }
    },
    // 取得個人化首頁所有資料
    async fetchPersonalData(agents = '') {
      const responses = await Promise.all([apiGetPersonalData([agents, '', '']), apiGetPersonalDataCnt([agents, '', ''])]);

      let result1 = responses[0].data.result;
      let result2 = responses[1].data.result;

      if (result1.IS_SUCCESS) {
        this.data = result1;
      } else {
        throw result1.RTN_MSG;
      }

      if (result2.IS_SUCCESS) {
        this.dataCnt = result2;
      } else {
        throw result2.RTN_MSG;
      }
    },
    // 設定初始查詢條件
    setDefaultQueryType() {
      this.currentWaitApproveType = WaitApproveType.All;
      // 核賠人員預設待核定，覆核人員預設待簽擬
      this.currentCaseTablesType = this.userRole === UserRoleEnum.Decd ? CaseTablesType.WaitApprove : CaseTablesType.ToBeAprvPay;
      // console.log(this.currentCaseTablesType);
    },
    // 設定預設Table資料
    setDefaultTableData() {
      if (this.data != null) {
        let currentData = null;
        if (this.data.decdList_mapList) {
          currentData = this.data.decdList_mapList;
        } else {
          currentData = this.data.signList_mapList;
        }

        this.currentWaitTableData = [];

        this.batchRenderId = setInterval(() => {
          let currentDataLength = currentData.length;

          if (currentDataLength == 0) {
            clearInterval(this.batchRenderId);
            return;
          }

          for (let i = 0; i < Math.min(10, currentDataLength); i++) {
            this.currentWaitTableData.push(currentData.shift());
          }
        }, 0);
      }
    },
    // 設定預設代理人(預設全選) => 20220125改為預設個人 => 20221124改為預設全選
    setDefaultBusinessAgents() {
      if (this.data != null) {
        // 代理人
        const businessAgents = this.data?.businessAgnt_mapList ?? [];
        // 目前勾選的代理人(預設個人)  AGNT_ROLE 1 本人，2 代理人
        // const checkedAgents = businessAgents.filter((agent) => agent.AGNT_ROLE === '1').map((agent) => agent.AGNT_ID);
        // 目前勾選的代理人(預設全選)
        const checkedAgents = businessAgents.map((agent) => agent.AGNT_ID);
        if (checkedAgents.length === 0) {
          // 非理賠人員沒有資料，要補上個人
          checkedAgents.push(this.userInfo.EMP_ID);
        }
        console.log(checkedAgents);
        // 綁定目前勾選的代理人至Store
        this.setBusinessAgent(checkedAgents);
      }
    },
    // 設定代理人資料
    setBusinessAgent(agents) {
      this.currentBusinessAgents = agents;
    },

    // 根據使用者選擇的類型切換對應的表格
    changeCaseTable(waitApproveType, caseTablesType) {
      this.currentWaitApproveType = waitApproveType;
      this.currentCaseTablesType = caseTablesType;
    },

    /**
     * 呼叫API查詢CaseTable資料
     * 有日期就帶(已結案才有可能帶日期)，沒日期預設帶空的
     * @param {String} startDate YYYY-MM-DD
     * @param {String} endDate YYYY-MM-DD
     */
    async queryTableData(startDate = '', endDate = '') {
      try {
        clearInterval(this.batchRenderId);
        this.showLoading();

        const storageCheckedAgents = sessionStorage.getItem('checkedAgents');
        const checkedAgents = storageCheckedAgents ? storageCheckedAgents.split('_') : this.currentBusinessAgents;

        let reqAgents = checkedAgents.length === 1 ? checkedAgents[0] : checkedAgents.join('_');
        // console.log(reqAgents);
        let response = null;
        // call query api, 根據登入者角色要Call不同API
        if (this.userRole === UserRoleEnum.Decd) {
          // 核賠人員
          response = await apiGetToDoListByDecd([
            reqAgents,
            this.currentCaseTablesType,
            this.currentWaitApproveType,
            startDate,
            endDate
          ]);
        } else if (this.userRole === UserRoleEnum.Aprv) {
          let QUERY_KIND = this.currentCaseTablesType;
          let QUERY_STS = this.currentWaitApproveType;

          // 覆核人員
          response = await apiGetToDoListByAprv([reqAgents, QUERY_KIND, QUERY_STS]);
        }
        if (response.data.result.IS_SUCCESS) {
          // this.currentCaseTableData = response.data.result;
          return response.data.result;
        } else {
          // alert(response.data.result.RTN_MSG);
          throw response.data.result.RTN_MSG;
        }
      } catch (e) {
        throw e;
      } finally {
        this.hideLoading();
      }
    },

    /**
     * 重新整理CaseTable(其他表格)資料
     */
    async reloadCaseTable() {
      const backupType = this.currentCaseTablesType;
      this.currentCaseTablesType = 'RELOAD';
      await nextTick();
      this.currentCaseTablesType = backupType;
    },

    /**
     * 更換代理人，畫面上有新勾選代理人或取消勾選代理人時呼叫
     * @param {Array[String]} agents 代理人ID陣列
     */
    async changeBusinessAgents(agents) {
      // console.log(agents);
      // 暫停監聽，等到切換完畢頁面刷新後再監聽
      this.pauseTableWatch = true;
      let reqAgents = agents.length === 1 ? agents[0] : agents.join('_');
      await this.fetchPersonalData(reqAgents);
      // 設定預設Table資料
      this.setDefaultTableData();
      // 設定初始查詢條件
      this.setDefaultQueryType();
      // this.pauseTableWatch = false;
    },

    /**
     * 釘選/取消釘選案件
     * @param {String} applyNo 案件編號
     * @param {Boolean} needPin true/false => 釘選/取消釘選
     */
    async pinOrUnpinCase(applyNo, needPin) {
      // console.log('pin!');
      const response = await apiPinClamCase([applyNo, needPin ? '1' : '2']);
      return response.data.result;
    },

    /**
     * 取得待辦提醒通知
     */
    async getTodoReminder() {
      const { now } = useMoment();
      // 只能傳本人，不需傳代理人
      const response = await apiGetToDoReminder([this.userInfo.EMP_ID, now('YYYY-MM-DD')]);
      return response.data.result;
    },
    /**
     * 點擊待辦通知的"知道了"按鈕
     */
    async confirmTodoReminder(todoNo) {
      const response = await apiReceiveToDo([todoNo]);
      return response.data.result;
    },
    /**
     * 完成待辦
     * @param {String} todoNo 待辦事項編號
     */
    async finishTodo(todoNo) {
      const { now } = useMoment();
      // Setting ui to finish
      var todoIndex = this.dataCnt.todoList_mapList.findIndex((e) => e.TODO_NO == todoNo);
      this.dataCnt.todoList_mapList[todoIndex].FINS_DATE = now();
      const response = await apiFinishToDo([todoNo]);
      if (!response.data.result.IS_SUCCESS) {
        console.error('finish todo fail');
        // if fail, restore ui
        setTimeout(() => (this.dataCnt.todoList_mapList[todoIndex].FINS_DATE = ''), 1);
      }
      return response.data.result;
    },

    async deleteTodoFromUI(todoNo) {
      // 從待辦清單移除
      let deletedTodo = remove(this.dataCnt.todoList_mapList, (x) => x.TODO_NO === todoNo);
      if (deletedTodo.length > 0) {
        const { getDate } = useMoment();

        // 從行事曆 -1
        // console.log(deletedTodo[0]);
        let todoCnt = this.dataCnt.todoCnt_mapList.find((e) => e.TODO_DATE == getDate(deletedTodo[0].TODO_DATE));
        if (todoCnt) {
          const levelMapping = {
            1: 'H',
            2: 'M',
            3: 'L'
          };
          let strLevel = `IMPO_LEVEL_${levelMapping[deletedTodo[0].IMPO_LEVEL]}`;
          todoCnt[strLevel] = (todoCnt[strLevel] - 1).toString();
          // console.log(todoCnt);
        }
      }
    },

    /**
     * 取得區間內每一天的待辦數量
     * @param {String} start 開始日期 YYYY-MM-DD
     * @param {String} end 結束日期 YYYY-MM-DD
     */
    async getTodoDailyCounts(start, end) {
      this.showLoading();
      // 只能傳本人，不需傳代理人
      const response = await apiGetTodoDailyCnt([this.userInfo.EMP_ID, start, end]);
      this.hideLoading();
      return response.data.result;
    },
    /**
     * 待辦數量更新資料
     * @param {Array} dailyList
     */
    setTodoDailyCounts(dailyList) {
      this.dataCnt.todoCnt_mapList = dailyList;
    },

    /**
     * 更新待辦事項
     * @param {Array}} todoList
     */
    setTodoList(todoList) {
      this.dataCnt.todoList_mapList = todoList;
    },

    /**
     * 取得當日待辦
     * @param {String} date 日期 YYYY-MM-DD
     */
    async getTodoList(date) {
      this.showLoading();
      // 只能傳本人，不需傳代理人
      const response = await apiGetTodoList([this.userInfo.EMP_ID, date]);
      this.hideLoading();
      return response.data.result;
    },
    /**
     * 新增待辦
     */
    async insertTodoList({ date, level, type, applyNo, content }) {
      this.showLoading();
      const response = await apiInsertTodoList([date, level, type, applyNo, content]);
      this.hideLoading();
      return response.data.result;
    },

    /**
     * 修改待辦
     */
    async updateTodoList({ todoNo, date, level, type, applyNo, content }) {
      this.showLoading();
      const response = await apiUpdateTodoList([todoNo, date, level, type, applyNo, content]);
      this.hideLoading();
      return response.data.result;
    },
    /**
     * 修改待辦
     */
    async deleteTodoList(todoNo) {
      this.showLoading();
      const response = await apiDeleteTodoList([todoNo]);
      this.hideLoading();
      return response.data.result;
    },

    /**
     * 清空待辦
     */
    cleanTodoList() {
      this.dataCnt.todoList_mapList = [];
    },

    /**
     * 取得目前登入者，for其他功能使用
     */
    async getCurrentUser() {
      let info = this?.data?.empBasic_map;
      if (info) return info;
      else {
        try {
          let response = await apiGetEmpBasic(['']);
          const result = response.data.result;
          if (!result.IS_SUCCESS) throw result.RTN_MSG;
          if (!this.data) {
            this.data = { empBasic_map: result.empBasic_map };
          }

          return result.empBasic_map;
        } catch (e) {
          console.error('呼叫apiGetEmpBasic取得登入者失敗' + e);
          return { EMP_NAME: '取得登入者失敗', EMP_ID: '' };
        }
      }
    },

    /**
     * 清除所有Store
     */
    resetAllStores() {
      console.info('Reset Stores');
      useQuickSearchStore().$reset();
      useApplyStore().$reset();
      useOverviewStore().$reset();
      useDecisionStore().$reset();
      useEditableStore().$reset();
      useAccountingStore().$reset();
      useBeneficiaryStore().$reset();
      useFooterStore().$reset();
    },

    /**
     * 醫鑑再次確認
     */
    async apprsRecheck({ APPRS_NO, SER_NO, ONCE_RTN }) {
      const response = await apiApprRecheck([APPRS_NO, SER_NO, ONCE_RTN]);
      const result = response.data.result;
      if (!result.IS_SUCCESS) throw result.RTN_MSG;
      return result.IS_SUCCESS;
    },

    /**
     * 醫鑑再次確認確定
     */
    async apprsDoReturn({ APPRS_NO, SER_NO, MEMO }) {
      if (!MEMO) throw '請填寫原因';
      const response = await apiApprDoReturn([APPRS_NO, SER_NO, MEMO]);
      const result = response.data.result;
      if (!result.IS_SUCCESS) throw result.RTN_MSG;
      return result.IS_SUCCESS;
    },
    /**
     * 解除契約-待備註輸入處理件刪除
     * @param {Object} relieveRmk 待備註輸入處理件物件
     */
    async delRelieveRmk(relieveRmk) {
      try {
        const response = await apiDelRelieveRmk(relieveRmk);
        const result = response.data.result;
        if (!result.IS_SUCCESS) throw result.RTN_MSG;
        return true;
      } catch (e) {
        throw e;
      }
    },
    getTagColorClass(type) {
      return {
        tag: true,
        'font-eudc': true,
        'is-yellow': type === 'Y',
        'is-green': type === 'G',
        'is-purple': type === 'P',
        'is-orange': type === 'O'
      };
    },
    /**
     * 取得檢核DTAAB080結果
     * @param {String} applyNo 案件編號
     */
    async getWaitClamSignStatus(applyNo) {
      const response = await apiGetWaitClamSignStatus([applyNo]);
      return response.data.result;
    },
    // 更新個人化首頁筆數
    async refreshPersonalDataCnt() {
      const storageCheckedAgents = sessionStorage.getItem('checkedAgents');
      let reqAgents = storageCheckedAgents ? storageCheckedAgents : '';

      const response = await apiGetPersonalDataCnt([reqAgents, '', '']);

      let result = response.data.result;

      if (result.IS_SUCCESS) {
        this.dataCnt = result;
      } else {
        throw result.RTN_MSG;
      }
    },

    /**
     * 點擊介接NAP的URL
     */
    async onClickNAPTodo() {
      const response = await apiGetServerName();
      const serverName = response.data.result.SERVER_NAME;

      let url = '';

      if (import.meta.env.MODE === 'development') {
        url = 'https://tmycrm.cathaylife.com.tw';
      } else {
        switch (serverName) {
          case ServiceName.Testing:
            url = 'https://tmycrm.cathaylife.com.tw';
            break;
          case ServiceName.Staging:
            url = 'https://smycrm.cathaylife.com.tw';
            break;
          case ServiceName.Production:
            url = 'https://mycrm.cathaylife.com.tw';
            break;
          default:
            url = '';
            break;
        }
      }

      window.open(`${url}/AYF0/F1/index?syscode=A3&divno=${this.userInfo.DIV_NO}&empid=${this.userInfo.EMP_ID}`);
    }
  }
});
