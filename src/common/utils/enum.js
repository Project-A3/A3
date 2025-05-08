// 登入角色
const UserRoleEnum = Object.freeze({
  // 核賠人員
  Decd: '1',
  // 覆核人員
  Aprv: '2',
  // 非理賠人員
  None: '0'
});

// 表格類型(根據查詢項目顯示不同表格)
const CaseTablesType = Object.freeze({
  // 待核定
  WaitApprove: '1',
  // 待核付
  ToBeAprvPay: '2',
  // 簽擬中
  Signing: '3',
  // 暫時結案
  TempEndCase: '4',
  // 已結案
  EndCase: '5',
  // 銀行退款
  BankReTurn: '6',
  // 待審核
  Review: '7',
  // 解除契約
  CancelPolicy: {
    // 全部
    All: 'A',
    // 待核付
    Decd: 'A1',
    // 待結案
    End: 'A2'
  },
  // 待簽收
  ToBeSignedFor: {
    // 全部
    All: 'B',
    // 補全
    Rep: 'B1',
    // 交查
    Invs: 'B2',
    // 照會
    Notes: 'B3'
  },
  // 調查件
  SurveyCase: {
    // 全部
    All: 'C',
    // 交查覆核
    AprvInvs: 'C1',
    // 交查簽收
    SignInvs: 'C2'
  },
  // 照會意見
  NoteComment: {
    // 全部
    All: 'D',
    // 照會覆核
    AprvNotes: 'D1',
    // 照會簽收
    SignNotes: 'D2'
  },
  // 補全件
  RepCase: {
    // 全部
    All: 'E',
    // 照會簽收
    SignRep: 'E1'
  }
});

// 表格查詢類型
const WaitApproveType = Object.freeze({
  // 全部
  All: '0',
  // 五日內
  FiveDays: '1',
  // 6-15日
  SixTo15Days: '2',
  // 16-30日
  SixteenTo30Days: '3',
  // 30日以上
  Over30Days: '4',
  // 退回件
  Return: '5',
  // 重啟件
  Restart: '6',
  // 解除契約: 覆核人員才有
  CancelPolicy: '7',
  // CMR件
  ToBeCmr: {
    // 全部
    All: 'F',
    // 待國泰回覆
    Cathay: 'F1',
    // 待PCV回覆
    Pcv: 'F2',
    // 待補全
    Rep: 'F3'
  }
});

// 快捷專區狀態(For 狀態管理使用)
const QuickSearchStatus = Object.freeze({
  // 預設，尚未搜尋
  Default: '0',
  // 搜尋 ID 結果
  SearchIDResult: '1',
  // 從 ID 結果點進案件
  CaseDetailFromID: '2',
  // 輸入編號查詢
  CaseDetailFromNo: '3'
});

// 快捷專區搜尋類型
const QuickSearchType = Object.freeze({
  // 受理編號
  ApplyNo: '0',
  // 事故人身分證
  OcrNo: '1',
  // 事故人出生證
  OcrBirthNo: '2',
  // 事故人護照
  OcrPassNo: '3',
  // 事故人軍人證
  OcrArmyNo: '4'
});

// 備註類型
const MemoType = Object.freeze({
  // 0:其他
  Other: '0',
  // 1:案件處理(補全、交查、病歷檢視)
  CaseHandling: '1',
  // 2:電聯經手人/客戶
  PhoneContact: '2',
  // 3:待會醫鑑
  Appraisal: '3',
  // 4:寄送文件
  SendDocuments: '4',
  // 5:NAP待回復
  NapAwaitReply: '5'
});

// 給付方式
const PayType = Object.freeze({
  // 全部
  All: '0',
  // 匯撥
  Remit: '5',
  // 現金
  Money: '2',
  // 支票
  Cheque: '3',
  getChineseStatus: function (payType) {
    switch (payType) {
      case this.Remit:
        return '匯撥';
      case this.Money:
        return '現金';
      case this.Cheque:
        return '支票';
      default:
        return '';
    }
  }
});

// Aside狀態管理
const AsideState = Object.freeze({
  // 快捷專區
  QuickSearch: '0',
  // 決策引導
  Decision: '1'
});

// 壽團險分類
const LifeGroupClassify = Object.freeze({
  // 個險
  Person: '0',
  // 團險
  Group: 'G',
  // 學團險
  School: 'H'
});

// 收據類型
const ReceiptKind = Object.freeze({
  // 住院收據
  Hospitalized: '2',
  // 門診合計表
  Clinic: '3',
  // 團險特殊
  Group: '4'
});
/**
 * 給付狀態
0:尚未給付
1:依約給付
2:協議給付
3:削減給付
4:修正延滯息日期
5:退件不給付
6:暫不處理
7:人工處理
 */
const PayItemStatus = Object.freeze({
  NotYetPay: '0',
  ContractPay: '1',
  AgreementPay: '2',
  ReducePay: '3',
  DelayRest: '4',
  ReturnNotPay: '5',
  Bypass: '6',
  Manual: '7',
  getChineseStatus: function (status) {
    switch (status) {
      case this.NotYetPay:
        return '尚未給付';
      case this.ContractPay:
        return '依約給付';
      case this.AgreementPay:
        return '協議給付';
      case this.ReducePay:
        return '削減給付';
      case this.DelayRest:
        return '修正延滯息日期';
      case this.ReturnNotPay:
        return '退件不給付';
      case this.Bypass:
        return '暫不處理';
      case this.Manual:
        return '人工處理';
      default:
        return '';
    }
  }
});

/**
 * 簽核層級
 */
const SignLevel = Object.freeze({
  Reviewer: '1',
  Manager: '2',
  Assistant: '3',
  VicePresident: '4',
  SeniorVicePresident: '5',
  ExecutiveVicePresident: '6',
  President: '7',
  getChinese: function (level) {
    switch (level) {
      case this.Reviewer:
        return '覆核';
      case this.Manager:
        return '經理';
      case this.Assistant:
        return '協理';
      case this.VicePresident:
        return '副總經理';
      case this.SeniorVicePresident:
        return '資深副總經理';
      case this.ExecutiveVicePresident:
        return '執行副總經理';
      case this.President:
        return '總經理';
      default:
        return '';
    }
  }
});

/**
 * 環境識別
 */
const ServiceName = Object.freeze({
  Testing: '測試開發環境',
  Staging: '平行測試環境',
  Production: ''
});

export {
  AsideState,
  CaseTablesType,
  LifeGroupClassify,
  MemoType,
  PayItemStatus,
  PayType,
  QuickSearchStatus,
  QuickSearchType,
  ReceiptKind,
  ServiceName,
  SignLevel,
  UserRoleEnum,
  WaitApproveType
};
