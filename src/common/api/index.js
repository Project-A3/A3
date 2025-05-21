/*
  如有多臺api server，對API的擴充可參考
  https://ithelp.ithome.com.tw/articles/10263166
*/

import apiClient from './client';

/**
 * 取得環境名稱
 */
export const apiGetServerName = () => apiClient.post('AA_E3Z100.getServerName');

//#region 個人化首頁 相關 API
/**
 * 取得個人化首頁全部資料
 * @param {Array} params ['查詢人員', '查詢起日', '查詢迄日']
 */
export const apiGetPersonalData = (params) => apiClient.post('AA_B3Z100.getPersonalData', params);
export const apiGetPersonalDataCnt = (params) => apiClient.post('AA_B3Z100.getPersonalDataCnt', params);
/**
 * 取得登入者資料
 * @param {Array} params ['查詢人員']
 */
export const apiGetEmpBasic = (params) => apiClient.post('AA_B3Z100.getEmpBasic', params);
/**
 * 取得核賠人員CaseTable資料
 * @param {Array} params ['查詢人員', 'QUERY_KIND', 'QUERY_STS', '查詢起日', '查詢迄日']
 * 查詢起日和查詢迄日QUERY_KIND=6(已結案)時才會傳
 * QUERY_KIND可參照CaseTablesType
 * QUERY_STS可參照WaitApproveType
 */
export const apiGetToDoListByDecd = (params) => apiClient.post('AA_B3Z100.getToDoListByDecd', params);
/**
 * 取得覆核人員CaseTable資料
 * @param {Array} params ['查詢人員', 'QUERY_KIND', 'QUERY_STS']
 */
export const apiGetToDoListByAprv = (params) => apiClient.post('AA_B3Z100.getToDoListByAprv', params);
/**
 * 取得檢核DTAAB080結果
 * @param {Array} params ['APLY_NO']
 */
export const apiGetWaitClamSignStatus = (params) => apiClient.post('AA_B3Z100.getWaitClamSignStatus', params);
/**
 * 解除契約-待備註輸入處理件刪除
 * @param {Array} params ['APLY_NO', 'POLICY_NO', 'SER_NO']
 */
export const apiDelRelieveRmk = (params) => apiClient.post('AA_B3Z100.delRelieveRmk', params);
/**
 * 釘選/取消釘選案件
 * @param {Array} params ['APLY_NO(受理編號)', 'PIN_TYPE']
 * PIN_TYPE: 1 => 釘選, 2 => 取消釘選
 */
export const apiPinClamCase = (params) => apiClient.post('AA_B3Z100.pinClamCase', params);
/**
 * 快捷專區查詢
 * @param {Array} params ['SEARCH_TYPE', 'SEARCH_STR']
 * SEARCH_TPYE: 1 => 受理編號, 2 => 保單號碼, 3 => 事故人ID
 */
export const apiQuickSearch = (params) => apiClient.post('AA_E3Z100.quickSearch', params);
/**
 * 待辦提醒通知
 * @param {Array} params ['查詢人員', '查詢日期']
 */
export const apiGetToDoReminder = (params) => apiClient.post('AA_B3Z200.getToDoReminder', params);
/**
 * 點擊待辦通知的"知道了"按鈕
 * @param {Array} params ['待辦事項ID']
 */
export const apiReceiveToDo = (params) => apiClient.post('AA_B3Z200.receiveToDo', params);
/**
 * 取得行事曆待辦數量
 * @param {Array} params ['查詢人員', '查詢起日', '查詢迄日']
 */
export const apiGetTodoDailyCnt = (params) => apiClient.post('AA_B3Z200.getTodoDailyCnt', params);
/**
 * 完成待辦事項
 * @param {Array} params ['待辦事項ID']
 */
export const apiFinishToDo = (params) => apiClient.post('AA_B3Z200.finishToDo', params);
/**
 * 新增備註
 * @param {Array} params ['受理編號', '備註類型', '備註內容']
 * 備註類型:
 * 1:案件處理(補全、交查、病歷檢視)* 2:電聯經手人/客戶 3:待會醫鑑 4:寄送文件 5:NAP待回復 0:其他
 */
export const apiInsertMemo = (params) => apiClient.post('AA_B3Z210.insertMemo', params);
/**
 * 修改備註
 * @param {Array} params ['受理編號', '備註代號', '備註類型', '備註內容']
 */
export const apiUpdateMemo = (params) => apiClient.post('AA_B3Z210.updateMemo', params);
/**
 * 刪除備註
 * @param {Array} params ['受理編號', '備註代號']
 */
export const apiDeleteMemo = (params) => apiClient.post('AA_B3Z210.deleteMemo', params);
/**
/**
 * 釘選備註
 * @param {Array} params ['受理編號', '備註代號']
 */
export const apiPinMemo = (params) => apiClient.post('AA_B3Z210.pinMemo', params);
/**
 * 取消釘選備註
 * @param {Array} params ['受理編號', '備註代號']
 */
export const apiCancelPinMemo = (params) => apiClient.post('AA_B3Z210.cancelPinMemo', params);
/**
 * 取得當日待辦
 * @param {Array} params ['查詢人員', '查詢日期']
 */
export const apiGetTodoList = (params) => apiClient.post('AA_B3Z200.getTodoList', params);
/**
 * 新增待辦
 * @param {Array} params ['日期', '重要性', '待辦類別', '受理編號', '待辦內容']
 */
export const apiInsertTodoList = (params) => apiClient.post('AA_B3Z200.insertTodoList', params);
/**
 * 修改待辦
 * @param {Array} params ['待辦事項代號', '日期', '重要性', '待辦類別', '受理編號', '待辦內容']
 */
export const apiUpdateTodoList = (params) => apiClient.post('AA_B3Z200.updateTodoList', params);
/**
 * 刪除待辦
 * @param {Array} params ['待辦事項代號']
 */
export const apiDeleteTodoList = (params) => apiClient.post('AA_B3Z200.deleteTodoList', params);
/**
 * 小秘書搜尋
 * @param {Array} params ['關鍵字']
 */
export const apiSecretarySearch = (params) => apiClient.post('AA_B3Z100.secretarySearch', params);
/**
 * 醫鑑再次確認
 * @param {Array} params ['關鍵字']
 */
export const apiApprRecheck = (params) => apiClient.post('AA_B3Z100.reCheck', params);
/**
 * 醫鑑再次確認確定
 * @param {Array} params ['關鍵字']
 */
export const apiApprDoReturn = (params) => apiClient.post('AA_B3Z100.doRtn', params);

//#endregion

//#region 查詢頁面 API
/**
 * 不給付紀錄
 * @param {Array} params ['保單號碼', '受理編號', '事故人ID', '員工ID']
 */
export const apiQueryNotGiveBenefitRecords = (params) => apiClient.post('AA_E3Z101.queryNotGiveBenefitRecords', params);
/**
 * 特殊紀錄
 * @param {Array} params ['被保人ID']
 */
export const apiQuerySpecialRecord = (params) => apiClient.post('AA_E3Z101.querySpecialRecord', params);
/**
 * 理賠紀錄
 * @param {Array} params ['保單號碼', '險別代碼', '受理編號', '事故人ID', '員工ID']
 */
export const apiQueryClaimRecords = (params) => apiClient.post('AA_E3Z101.queryClaimRecords', params);
/**
 * 補全紀錄
 * @param {Array} params ["OCR_ID","APLY_NO","TRN_ID","KEYIN_ID","CAN_INPUT","TYPE","KEYIN_TIME_S","KEYIN_TIME_E"]
 */
export const apiQueryCompletionRecords = (params) => apiClient.post('AA_E3Z101.queryCompletionRecords', params);
/**
 * 保單查險別
 * @param {Array} params ['保單號碼']
 */
export const apiQueryProdIdAndProdName = (params) => apiClient.post('AA_E3Z101.queryProdIdAndProdName', params);
/**
 * 給付項目-保單號碼
 * @param {Array} params ["POLICY_NO","PROD_ID","APLY_NO","OCR_ID","EMP_ID"]
 */
export const apiQueryPaymentItemsPolicyNo = (params) => apiClient.post('AA_E3Z101.queryPaymentItemsPolicyNo', params);
/**
 * 給付項目-醫療合併記錄筆數
 * @param {Array} params ["保單號碼"]
 */
export const apiCountMergeRecords = (params) => apiClient.post('AA_E3Z101.countMergeRecords', params);
/**
 * 給付項目-壽險不給付記錄筆數
 * @param {Array} params ["POLICY_NO","OCR_ID","APLY_NO","EMP_ID"]
 */
export const apiCountNotGiveBenefitRecords = (params) => apiClient.post('AA_E3Z101.countNotGiveBenefitRecords', params);
/**
 * 給付項目-未結案溢付記錄筆數
 * @param {Array} params ["保單號碼", "事故人ID"]
 */
export const apiCountOverflowPaymentRecords = (params) => apiClient.post('AA_E3Z101.countOverflowPaymentRecords', params);
/**
 * 理賠記錄查詢-醫療紀錄彈窗
 * @param {Array} params ["POLICY_NO","APLY_NO","CLAM_CAT","PROD_ID","OCR_ID","CLAM_AMT_CODE","SER_NO","PROD_ID_NAME","CLAM_AMT_NAME"]
 */
export const apiQueryMedicalDayDetail = (params) => apiClient.post('AA_E3Z101.queryMedicalDayDetail', params);
//#endregion

//#region 申請資料 API
/**
 * 取得基本資料
 * @param {Array} params ['受理編號']
 */
export const apiReadBasicData = (params) => apiClient.post('AA_A0Z100.getBasicData', params);
/**
 * 取得申請資料
 * @param {Array} params ['受理編號']
 */
export const apiReadApplicationData = (params) => apiClient.post('AA_A0Z100.readApplicationData', params);
/**
 * 事故原因查詢
 * @param {Array} params ['事故分類代碼']
 */
export const apiQueryOcrReasonsList = (params) => apiClient.post('AA_A0Z110.queryOCR_RESN_List', params);
/**
 * 取得員工等級
 * @param {Array} params ['保單號碼']
 */
export const apiGetEmpDegreeSel = (params) => apiClient.post('AA_A0Z110.getEMP_DEGREE_SEL', params);
// 彈窗
/**
 * 索賠類別查詢
 */
export const apiQueryClaimCatList = () => apiClient.post('AA_A0Z110.getCLAM_CAT_List');
/**
 * 取得投保學校
 * @param {Array} params ['縣市', '學校代碼', '學校名稱']
 */
export const apiGetSchool = (params) => apiClient.post('AA_A0Z110.querySchool', params);
/**
 * 取得投保學校縣市
 */
export const apiGetSchoolCityList = () => apiClient.post('AA_A0Z110.getSCHOOL_CITY_List');
/**
 * 取得醫院
 * @param {Array} params ['區域代碼', '醫院名稱']
 */
export const apiGetHospital = (params) => apiClient.post('AA_A0Z100.queryHospData', params);
/**
 * 取得醫院區域
 */
export const apiGetHospitalAreaList = () => apiClient.post('AA_A0Z110.getHOSP_AREA_List');
/**
 * 取得手術主科別
 */
export const apiGetMainDepList = () => apiClient.post('AA_A0Z110.getMAIN_DEP_List');
/**
 * 取得手術子科別
 * @param {Array} params ['主科別']
 */
export const apiGetSubDepList = (params) => apiClient.post('AA_A0Z110.querySUB_DEP_List', params);
/**
 * 取得疾病分類
 */
export const apiGetICDClass = () => apiClient.post('AA_A0Z110.getICDClasses');
/**
 * 查詢疾病
 * @param {Array} params ['第二層疾病名稱', '疾病索引關鍵字', '疾病代碼']
 */
export const apiSearchICD = (params) => apiClient.post('AA_A0Z110.queryICD', params);
/**
 * 取得癌症分類
 */
export const apiGetCancerCatList = () => apiClient.post('AA_A0Z110.getCANCER_CAT_List');

/**
 * 取得國籍
 */
export const apiGetCountryList = () => apiClient.post('AA_A0Z100.getCountryList');

/**
 * 取得癌症分類
 */
export const apiGetBoneDayList = () => apiClient.post('AA_A0Z110.getBONE_DAY_List');
/**
 * 查詢手術
 * @param {Array} params ['部位', '關鍵字']
 */
export const apiSearchOP = (params) => apiClient.post('AA_A0Z100.queryOP', params);
/**
 * 查詢手術險別
 * @param {Array} params ['手術代碼']
 */
export const apiGetOpProd = (params) => apiClient.post('AA_A0Z100.getOpProd', params);
/**
 * 查詢手術等級
 * @param {Array} params ['手術險別']
 */
export const apiGetOpGrad = (params) => apiClient.post('AA_A0Z100.getOpGrad', params);

/**
 * 取得死亡地點區域別
 */
export const apiGetDiePlaceAreaList = () => apiClient.post('AA_A0Z110.getPLACE_AREA_List');
/**
 * 取得完全失能項目
 */
export const apiGetFullDisbList = () => apiClient.post('AA_A0Z110.getFULL_DISB_List');
/**
 * 取得重大疾病項目
 */
export const apiGetHeavyDisbList = () => apiClient.post('AA_A0Z110.getHEVY_DIS_List');
/**
 * 妊娠期併發症
 */
export const apiGetGravItemList = () => apiClient.post('AA_A0Z110.getGRAV_ITEM_List');
/**
 * 臍帶血幹細胞適應症
 */
export const apiGetStemItemList = () => apiClient.post('AA_A0Z110.getSTEM_ITEM_List');
/**
 * 先天性重大殘缺
 */
export const apiGetConList = () => apiClient.post('AA_A0Z110.getCON_List');
/**
 * 取得實物給付代碼設定
 */
export const apiGetInKindPaymentList = () => apiClient.post('AA_A0Z110.getIN_KIND_PAYMENT_List');
/**
 * 取得殘廢項目
 */
export const apiGetDisbClsList = () => apiClient.post('AA_A0Z100.getDisbClsList');
/**
 * 取得殘廢部位項目
 */
export const apiGetDisbPartList = (params) => apiClient.post('AA_A0Z100.getDisbPartList', params);
/**
 * 取得殘廢左右項目
 */
export const apiGetDisbLFList = (params) => apiClient.post('AA_A0Z100.getDisbLFList', params);
/**
 * 取得殘廢關節項目
 */
export const apiGetDisbELBWList = (params) => apiClient.post('AA_A0Z100.getDisbELBWList', params);
/**
 * 依殘廢部位取得殘廢機能喪失項目
 */
export const apiGetDisbFuncListByPart = (params) => apiClient.post('AA_A0Z100.getDisbFuncListByPart', params);
/**
 * 依殘廢關節取得殘廢機能喪失項目
 */
export const apiGetDisbFuncListByELBW = (params) => apiClient.post('AA_A0Z100.getDisbFuncListByELBW', params);

/**
 * 儲存資料
 * @param {Array} params ['醫院代碼', '收據種類']
 */
export const apiGetReceiptItem = (params) => apiClient.post('AA_A0Z100.getReceiptItem', params);

/**
 * 檢核學團險件保單號碼
 */
export const apiCheckHPolicyNo = (params) => apiClient.post('AA_A0Z100.checkHPolicyNo', params);

//#endregion

//#region 保單概況 API
/**
 * 取得保單概況資料
 * @param {Array} params ['受理編號']
 */
// export const apiGetEffPolicyInfoByCase = (params) => apiClient.post('AA_B3Z300.getEffPolicyInfoByCase', params);

/**
 * 是否可自動保單確認
 * @param {Array} params ['受理編號']
 * @returns 
 */
export const apiIsAutoConfirmPolicy = (params) => apiClient.post('AA_B3Z300.isAutoConfirmPolicy', params);

/**
 * 自動保單確認
 * @param {*} params 
 * @returns 
 */
export const apiAutoConfirmPolicy = (params) => apiClient.post('AA_B3Z300.autoConfirmPolicy', params);

/**
 * 讀取已選保單/未選保單(系統日)
 * @param {Array} params ['受理編號']
 * @returns 
 */
export const apiGetPolicyInfoBySysDate = (params) => apiClient.post('AA_B3Z300.getPolicyInfoBySysDate', params);

/**
 * 讀取已選保單/未選保單(事故日)
 * @param {Array} params ['受理編號']
 * @returns 
 */
export const apiGetPolicyInfoByOcrDate = (params) => apiClient.post('AA_B3Z300.getPolicyInfoByOcrDate', params);

/**
 * 取得受益人清單
 * @param {Array} params ['受理編號']
 */
export const apiGetBeneficiary = (params) => apiClient.post('AA_B3Z300.getBeneficiary', params);
/**
 * 取得條款檔案下載
 * @param {Array} params ["PROD_ID","PROD_CAT","ISSUE_DATE","ACCESS_DATE","FACE_AMT","POLICY_NO"]
 */
export const apiGetPolicyTerms = (params) => apiClient.post('AA_B3Z300.getPolicyTerms', params);
/**
 * 儲存資料前確認
 * @param {Object} params {PAGE_KEY: '保單概況', PAGE_EDIT: '', POLICY_INFO: [], BENE_INFO:[]}
 */
export const apiSavePageDataCheck = (params) => apiClient.post('AA_B3Z300.savePageDataCheck', params);
/**
 * 儲存資料
 * @param {Object} params {PAGE_KEY: '保單概況', PAGE_EDIT: '', POLICY_INFO: [], BENE_INFO:[]}
 */
export const apiSavePageData = (params) => apiClient.post('AA_B3Z300.savePageData', params);

/**
 * 取得一指通帳戶資料
 * @param {Array} params ['受款人ID']
 */
export const apiGetOneAccount = (params) => apiClient.post('AA_B3Z300.getONE_ACC', params);

/**
 * 取得一指通帳戶資料For OIU
 * @param {Array} params ['受款人ID', '國籍代碼']
 */
export const apiGetOiuOneAccount = (params) => apiClient.post('AA_B3Z300.getOIU_ONE_ACC', params);

export const apiCheckSavePolicyInfo = (params) => apiClient.post('AA_B3Z300.checkSavePolicyInfo', params);
export const apiSavePolicyInfo = (params) => apiClient.post('AA_B3Z300.savePolicyInfo', params);
export const apiCheckSaveBeneInfo = (params) => apiClient.post('AA_B3Z300.checkSaveBeneInfo', params);
export const apiSaveBeneInfo = (params) => apiClient.post('AA_B3Z300.saveBeneInfo', params);
/**
 * 是否為覆核人員
 * @param {Array} params ['受理編號']
 */
export const apiGetReviewerInfo = (params) => apiClient.post('AA_B3Z310.getReviewerInfo', params);

/**
 * 取得行庫連結
 */
export const apiGetFISC = () => apiClient.post('AA_B3Z300.getFISC');

/**
 * 取得風險、與受益人關係
 * @param {Array} params ['受款人ID', '受款人姓名']
 */
export const apiGetIndicator = (params) => apiClient.post('AA_B3Z320.getIndicator', params);

/**
 * 取得支票訊息
 * @param {Array} params ['票據記載事項變更申請書編號']
 */
export const apiGetResnNoAndName = (params) => apiClient.post('AA_B3Z300.getResnNoAndName', params);

//#endregion

//#region 決策引導 API

/**
 * 取得風險標籤
 * @param {Array} params ['受理編號']
 */
export const apiGetRiskTags = (params) => apiClient.post('AA_B3Z220.getRiskTags', params);

/**
 * 查詢風險標籤CRSS3.0
 * @param {Array} params ['受理編號']
 */
export const apiGetRiskTags3 = (params) => apiClient.post('AA_B3Z220.getRiskTags3', params);

/**
 * CRSS3.0 確認
 * @param {Array} params [Map]
 */
export const apiDoConfirm = (params) => apiClient.post('AA_B3Z220.doConfirm', params);

/**
 * 取得異常風險提示及承辦意見回饋
 * @param {Array} params ['受理編號']
 */
export const apiGetRiskOpinion = (params) => apiClient.post('AA_B3Z220.getRiskInfo_Opinion', params);

/**
 * 判斷是否啟用決策引導
 * @param {Array} params ['受理編號', '申請種類', '事故人ID']
 */
export const apiIsDCNTEnable = (params) => apiClient.post('AA_B3Z230.isDCNTEnable', params);
/**
 * 取得決策引導問題組合包
 * @param {Array} params ['受理編號', '事故人ID', '受理種類']
 */
export const apiGetDCNT = (params) => apiClient.post('AA_B3Z230.getDCNT', params);
/**
 * 取得簽呈大小類清單
 */
export const apiGetRFACATandSCATList = () => apiClient.post('AA_B3Z230.getRFACATandSCATList');
/**
 * 取得簽呈小類罐頭簽呈內容
 * @param {Array} params ['簽呈小類ID']
 */
export const apiGetRFACONT = (params) => apiClient.post('AA_B3Z230.getRFACONT', params);
/**
 * 不給付通知函輸入
 * @param {Array} params ['受理編號']
 */
export const apiGetNotPayInput = (params) => apiClient.post('AA_B3Z340.getNotPayInput', params);
/**
 * 取得不給付通知函輸入抬頭資訊
 */
export const apiGetNotPayTitleAndContent = (params) => apiClient.post('AA_B3Z340.getNotPayTitleAndContent', params);
/**
 * 取得不給付條款選擇項目
 * @param {Array} params ['業務別(保單來源)','商品代號']
 */
export const apiGetNotPayLaw = (params) => apiClient.post('AA_B3Z340.getNotPayLaw', params);

/**
 * 取得不給付通知函抬頭樣式、主張依據
 */
export const apiGetNotPayTitleSelectList = (params) => apiClient.post('AA_B3Z340.getNotPayTitleSelectList', params);

/**
 * 儲存不給付通知函輸入
 * @param {Array} params {請求Json}
 */
export const apiSaveNotPayInput = (params) => apiClient.post('AA_B3Z340.saveNotPayInput', params);
/**
 * 預覽不給付通知函輸入
 * @param {Array} params {請求Json}
 */
export const apiPrintNotPayInput = (params) => apiClient.post('AA_B3Z340.printNotPayInput', params);
/**
 * 判斷是否開啟新版不給付通知函輸入
 * @param {Array} params {請求Json}
 */
export const apiCheckIsNew = (params) => apiClient.post('AA_B3Z340.checkIsNew', params);
/**
 * 簽呈預覽處理
 * @param {Array} params ['受理編號']
 */
export const apiDoSignPreview = (params) => apiClient.post('AA_B3Z330.doSignPreview', params);
/**
 * 簽呈送出
 */
export const apiDoSignSend = (params) => apiClient.post('AA_B3Z330.doSignSend', params);
/**
 * 檢核是否有包含給付已超過上限項目
 * @param {Array} params ['受理編號']
 */
export const apiChkLmtExptNo = (params) => apiClient.post('AA_B3Z400.chkLmtExptNo', params);
/**
 * 取得簽呈歷程
 */
export const apiGetSignData = (params) => apiClient.post('AA_B3Z400.getSignData', params);
/**
 * 取得簽擬初始化內容
 */
export const apiGetSignInit = (params) => apiClient.post('AA_B3Z400.getSignInit', params);
/**
 * 退回
 */
export const apiDoBack = (params) => apiClient.post('AA_B3Z400.doBack', params);
/**
 * 如擬
 */
export const apiDoAcceptAndEndCase = (params) => apiClient.post('AA_B3Z400.doAcceptAndEndCase', params);
/**
 * 如擬非同步
 */
export const apiDoAcceptAndEndCaseAsync = (params) => apiClient.post('AA_B3Z400.doAcceptAndEndCaseAsync', params);
/**
 * 擬如擬
 */
export const apiDoSign = (params) => apiClient.post('AA_B3Z400.doSign', params);
/**
 * 暫存主管簽呈內容
 */
export const apiSaveMangSign = (params) => apiClient.post('AA_B3Z400.saveMangSign', params);

//#endregion

//#region 核算結果
/**
 * 取得核算結果
 * @param {Array} params ['受理編號']
 */
export const apiGetPayItems = (params) => apiClient.post('AA_B3Z310.getPayItems', params);
/**
 * 新增核付項目時，依據事故者ID及受理編號查詢投保明細和索賠類別
 * @param {Array} params ['事故者ID', '事故日期', '受理編號']
 */
export const apiGetInsuranceDetail = (params) => apiClient.post('AA_B3Z310.getInsuranceDetail', params);
/**
 * 新增核付項目時，依據險別及索賠項目查詢可選之理賠金項目
 * @param {Array} params ['險別', '索賠類別']
 */
export const apiGetClamItemOpts = (params) => apiClient.post('AA_B3Z310.getCLAM_ITEM_OPTS', params);
/**
 * 新增核付項目
 * @param {Array} params {核付項目物件}
 */
export const apiGetCreatManualPayItem = (params) => apiClient.post('AA_B3Z310.creatManualPayItem', params);
/**
 * 依據選擇類別取得人工核定原因列表
 * @param {Array} params ['拒賠原因分類代碼']
 *  A: 通則
    B: 醫療
    C: 重大、長看、豁免
    D: 死亡殘廢
    E: 其他
    G: 政策性融通
 */
export const apiQueryRjctResnList = (params) => apiClient.post('AA_A0Z110.queryRJCT_RESN_List', params);
/**
 * 取得事故分類下拉選單選項
 */
export const apiGetReasonList = (params) => apiClient.post('AA_A0Z110.getREASON_TYPE_LIST', []);
/**
 * 人工核定一般理賠項目
 * @param {Array} params {請求json}
 */
export const apiDoManual = (params) => apiClient.post('AA_B3Z310.doManual', params);
/**
 * 人工核定失能理賠項目
 * @param {Array} params {請求json}
 */
export const apiDoManualDisb = (params) => apiClient.post('AA_B3Z310.doManual_DISB', params);
/**
 * 協議給付、不給付、暫不處理的給付狀態更新
 * @param {Array} params {請求Json}
 */
export const apiDoPayDecision = (params) => apiClient.post('AA_B3Z310.doPayDecision', params);
/**
 * 查詢給付明細
 * @param {Array} params ['受理編號']
 */
export const apiGetPayDetail = (params) => apiClient.post('AA_B3Z310.getPayDetail', params);
/**
 * 儲存給付明細
 * @param {Array} params {請求Json}
 */
export const apiSavePayDetail = (params) => apiClient.post('AA_B3Z310.savePayDetail', params);
/**
 * 查詢解除註記資料
 * @param {Array} params ['受理編號']
 */
export const apiGetRelieveRmk = (params) => apiClient.post('AA_B3Z310.getRelieveRmk', params);
/**
 * 解除註記時，依據事故者ID查詢投保保單
 * @param {Array} params ['事故者ID', '事故日期']
 */
export const apiGetPolicies = (params) => apiClient.post('AA_B3Z310.getPolicies', params);
/**
 * 儲存解除註記資料
 * @param {Array} params {請求Json}
 */
export const apiSaveRelieveRmk = (params) => apiClient.post('AA_B3Z310.saveRelieveRmk', params);
/**
 * 儲存例外授權碼
 * @param {Array} params ['受理編號']
 */
export const apiSaveExptNo = (params) => apiClient.post('AA_B3Z310.saveEXPT_NO', params);
/**
 * 讀取試算訊息
 * @param {Array} params ['受理編號']
 */
export const apiGetCalcMesgs = (params) => apiClient.post('AA_B3Z310.getCalcMesgs', params);
/**
 * 取得實支費用明細
 * @param {Array} params ['受理編號', '理賠保險金代碼', '業務別']
 */
export const apiGetExpenseDetail = (params) => apiClient.post('AA_B3Z310.getExpenseDetail', params);

/**
 * 取得內容模板罐頭
 * @param {Array} params ['受理編號']
 */
export const apiGetNotice = (params) => apiClient.post('AA_B3Z310.getNotice', params);
/**
 * 試算調整確認
 * @param {Array} params ['受理編號', '例外授權碼', [核算結果資料]]
 */
export const apiDoClamConfirm = (params) => apiClient.post('AA_B3Z310.doClamConfirm', params);
/**
 * 回復試算確認
 * @param {Array} params ['受理編號']
 */
export const apiGetReCalPayItems = (params) => apiClient.post('AA_B3Z310.getReCalPayItems', params);

/**
 * 清除試算紀錄
 * @param {Array} params ['受理編號']
 */
export const apiClearCalculate = (params) => apiClient.post('AA_B3Z311.clearCalculate', params);

/**
 * 計息起日計算天數
 * @param {Array} params ['計息起日', 'APLY_NO', 'APLY_DIV_NO']
 */
export const apiIsCurrentPassDay = (params) => apiClient.post('AA_B3Z310.isCurrentPassDay', params);

/**
 * 檢核多受益人輸入規則
 * @param {Object} params {AA_B3Z310_bo}
 */
export const apiCheckMultAcptRule = (params) => apiClient.post('AA_B3Z310.checkMultAcptRule', params);
//#endregion

//#region 受益人分配 API
/**
 * 取得受益人分配資料
 * @param {Array} params ['受理編號']
 */
export const apiGetPaymentAllocation = (params) => apiClient.post('AA_B3Z320.getPaymentAllocation', params);
/**
 * 取得受益人資料
 * @param {Array} params ['受理編號']
 */
export const apiGetBeneInfo = (params) => apiClient.post('AA_B3Z320.getBeneInfo', params);
/**
 * 取得變更原因
 */
export const apiGetBeneChgResn = () => apiClient.post('AA_B3Z320.getBeneChgResn', []);
/**
 * 刪除受益人
 * @param {Object} params {受益人物件}
 */
export const apiDeleteBeneInfo = (params) => apiClient.post('AA_B3Z320.deleteBeneInfo', params);

/**
 * 取得人工核定類別
 */
export const apiGetDiagKindList = () => apiClient.post('AA_B3Z310.getDIAG_KIND_LIST', []);
/**
 * 取得人工核定等級
 * @param {Array} params ['險別ID']
 */
export const apiGetOpGradeList = (params) => apiClient.post('AA_B3Z310.getOP_GRADE_LIST', params);
/**
 * 失能程度彈窗資料
 */
export const apiGetDisbTable = () => apiClient.post('AA_B3Z310.getDISB_TABLE_DATA', []);

/**
 * 核算結果資料(覆核)
 * @param {Array} params ['受理編號']
 */
export const apiGetPayItemsReadOnly = (params) => apiClient.post('AA_B3Z310.getPayItemsReadOnly', params);
/**
 * 取得受款人資料(覆核)
 * @param {Array} params ['受理編號']
 */
export const apiGetPayDetailReview = (params) => apiClient.post('AA_B3Z320.getPayDetail', params);
/**
 * 取得簽核層級
 * @param {Array} params ['受理編號']
 */
export const apiGetSignLevelInfo = (params) => apiClient.post('AA_B3Z320.getSIGN_LVL_INFO', params);
/**
 * 取得保單受益人清單
 * @param {Array} params ['保單號碼']
 */
export const apiGetPolicyBeneList = (params) => apiClient.post('AA_B3Z320.getPolicyBeneList', params);
//#endregion

//#region 爭議案件 API
 /**
 * 查詢爭議案件
 * 
 */
export const apiGetDisputedCases = (params) => apiClient.post('AA_B3Z310.getDisputedCases', params);

 /**
 * 取得查詢爭議案件 byaplyNO
 * 
 */
export const apiGetDisputedCasesAplyNO = (params) => apiClient.post('AA_B3Z310.getDisputedCasesAplyNO', params);

 /**
 * 提示爭議案件
 * 
 */
export const apiDoAlertDisputedCases = (params) => apiClient.post('AA_B3Z310.doAlertDisputedCases', params);

/**
* 爭議案件卡控
*
*/
export const apiCheckDecision = (params) => apiClient.post('AA_B3Z330.checkDecision', params);

//#endregion

//#region 共用
/**
 * 取得身分別
 * @param {*} params
 */
export const apiGetIdTypeList = (params) => apiClient.post('AA_B3Z300.getIdTypeList', params);

/**
 * 取得上次儲存時間
 * @param {Array} params ['受理編號']
 */
export const apiGetSaveTime = (params) => apiClient.post('AA_B3Z300.getSaveTime', params);

/**
 * 頁面儲存
 * @param {Array} params []
 */
export const apiSaveClamData = (params) => apiClient.post('AA_B3Z390.saveClamData', params);

/**
 * 頁面異動儲存
 * @param {Array} params []
 */
export const apiSaveReDealClamData = (params) => apiClient.post('AA_B3Z390.saveReDealClamData', params);

/**
 * 決策引導儲存
 * @param {Array} params []
 */
export const apiSaveDcntRiskData = (params) => apiClient.post('AA_B3Z390.saveDcntRiskData', params);

/**
 * 儲存決策引導作答軌跡
 * @param {Array} params []
 */
export const apiSaveDCNT = (params) => apiClient.post('AA_B3Z230.saveDCNT', params);

/**
 * 快捷交查與醫鑑處理
 * @param {Array} params ['APLY_NO', 'AH_TYPE']
 * AH_TYPE 交查類別
 * 1：交查
 * 2：醫鑑
 */
export const apiDoInsertAH = (params) => apiClient.post('AA_B3Z390.doInsertAH', params);

/**
 * 更新紀錄查詢表示
 * @param {*} params
 */
export const apiUpdRecIdx = (params) => apiClient.post('AA_B3Z390.updRecIdx', params);

/**
 * 是否為試點人員
 * @param {*} params 
 * @returns 
 */
export const apiIsPreferredMember = (params) => apiClient.post('AA_A0Z026.isPreferredMember', params);

/**
 * 是否執行擬人自動(首次/重覆執行判斷)
 * @param {*} params 
 * @returns 
 */
export const apiIsSemiAutoAction = (params) => apiClient.post('AA_A0Z026.isSemiAutoAction', params);

/**
 * 保單概況執行前 擬人自動檢核
 * @param {Array} params ['受理編號']
 * @returns 
 */
export const apiIsSemiAutoBeforOverview = (params) => apiClient.post('AA_A0Z026.isSemiAutoBeforOverview', params);

/**
 * 保單概況 擬人自動
 * 
 */
export const apiSemiAutomatic300 = (params) => apiClient.post('AA_B3Z300.semiAutomatic', params);

/**
 * 核算結果 擬人自動
 * 
 */
export const apiSemiAutomatic310 = (params) => apiClient.post('AA_B3Z310.semiAutomatic', params);

 /**
 * 受益人分配 擬人自動
 * 
 */
export const apiSemiAutomatic320 = (params) => apiClient.post('AA_B3Z320.semiAutomatic', params);

 /**
 * 結案處理 擬人自動
 * 
 */
export const apiSemiAutomatic330 = (params) => apiClient.post('AA_B3Z330.semiAutomatic', params);

 /**
 * 請輸入不使用 擬人自動原因
 * 
 */
export const apiSaveNotExecReason = (params) => apiClient.post('AA_A0Z026.saveNotExecReason', params);
export const apiGetTrusteeEEID = (params) => apiClient.post('AA_B3Z100.getTrusteeEEID', params);
export const apiGetAccidentReasonsData = (params) => apiClient.post('AA_A0Z100.queryOCR_RESN_List', params);
export const apiGetCitiesList = (params) => apiClient.post('AA_A0Z100.queryProvince', params);
//#endregion
