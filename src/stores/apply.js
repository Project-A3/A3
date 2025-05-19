import { cloneDeep, differenceWith, isEqual } from 'lodash-es';
import { defineStore } from 'pinia';
import {
  apiReadApplicationData,
  apiReadBasicData,
  apiGetTrusteeEEID,
  apiGetAccidentReasonsData,
  apiQueryClaimCatList,
  apiSearchOP
} from '~/common/api';
import { useLanguageStore } from './language';
/*先註解 import {
  apiQueryOcrReasonsList,
  apiQueryClaimCatList,
  apiGetSchoolCityList,
  apiGetSchool,
  apiGetHospitalAreaList,
  apiGetHospital,
  apiGetMainDepList,
  apiGetSubDepList,
  apiGetICDClass,
  apiSearchICD,
  apiGetCancerCatList,
  apiGetBoneDayList,
  apiSearchOP,
  apiGetOpProd,
  apiGetOpGrad,
  apiGetDiePlaceAreaList,
  apiGetFullDisbList,
  apiGetHeavyDisbList,
  apiGetGravItemList,
  apiGetStemItemList,
  apiGetConList,
  apiGetReceiptItem,
  apiSaveClamData,
  apiSaveReDealClamData,
  apiGetEmpDegreeSel,
  apiGetDisbClsList,
  apiGetDisbPartList,
  apiGetDisbLFList,
  apiGetDisbELBWList,
  apiGetDisbFuncListByPart,
  apiGetDisbFuncListByELBW,
  apiCheckHPolicyNo,
  apiGetCountryList,
  apiGetInKindPaymentList
} from '~/common/api';
import { LifeGroupClassify } from '~/common/utils/enum';*/


export const useApplyStore = defineStore('apply', {
  state: () => ({
    // 目前是什麼類型的案件 0:個險 G:團險 H:學團險
    currentLifeGropClfy: '0',
    // 備份原始資料，供送出比對頁面是否改變使用
    backupResult: null,
    basicData: {},
    claimData: {},
    diagData: {},
    receiptData: {},
    highSettlementData: {},
    inKindPayData: {},
    // 以上是主要資料
    // 以下是Modal資料
    // 索賠類別
    claimCategories: {
      PERSON_CLAM_CATS: null,
      GROUP_CLAM_CATS: null,
      SCHOOL_CLAM_CATS: null
    },
    // 投保學校縣市
    schoolCities: null,
    // 醫院縣市
    hospitalCities: null,
    // 手術主科別
    opMainDeps: null,
    // 疾病分類
    ICDClasses: null,
    // 癌症分類
    cancerCategories: null,
    // 骨折換算
    boneDays: null,
    // 死亡地點區域
    diePlaceArea: null,
    // 完全失能項目
    fullDisabilityList: null,
    // 重大疾病項目
    heavyDisabilityList: null,
    // 妊娠期併發症
    gravItemList: null,
    // 臍帶血幹細胞適應症
    stemItemList: null,
    // 先天性重大殘缺
    conItemList: null,
    // Has ACT_CD Area
    cloneArea: {
      // 無記名
      noNameList: null,
      noNameGList: null,
      // 診斷書
      diags: [],
      // 收據
      receipts: [],
      // 失能項目
      disbItems: []
    },
    // 異動欄位
    detectFields: [
      {
        javaClass: 'java.util.Map',
        FIELD_ID: 'APLY_KIND',
        FIELD_NAME: '申請種類',
        UPT_BEF: '',
        UPF_AFT: ''
      },
      {
        javaClass: 'java.util.Map',
        FIELD_ID: 'CLAM_CAT',
        FIELD_NAME: '索賠類別',
        UPT_BEF: '',
        UPF_AFT: ''
      },
      {
        javaClass: 'java.util.Map',
        FIELD_ID: 'noNameList',
        FIELD_NAME: '無記名資料',
        UPT_BEF: '',
        UPF_AFT: ''
      },
      {
        javaClass: 'java.util.Map',
        FIELD_ID: 'OCR_DATE',
        FIELD_NAME: '事故日',
        UPT_BEF: '',
        UPF_AFT: ''
      },
      {
        javaClass: 'java.util.Map',
        FIELD_ID: 'SCH_NO',
        FIELD_NAME: '學校代號',
        UPT_BEF: '',
        UPF_AFT: ''
      },
      {
        javaClass: 'java.util.Map',
        FIELD_ID: 'ICD_CODE',
        FIELD_NAME: '診斷病名',
        UPT_BEF: '',
        UPF_AFT: ''
      },
      {
        javaClass: 'java.util.Map',
        FIELD_ID: 'OP_CODE',
        FIELD_NAME: '手術代碼',
        UPT_BEF: '',
        UPF_AFT: ''
      },
      {
        javaClass: 'java.util.Map',
        FIELD_ID: 'DOC_NAME',
        FIELD_NAME: '醫生姓名',
        UPT_BEF: '',
        UPF_AFT: ''
      },
      {
        javaClass: 'java.util.Map',
        FIELD_ID: 'HOSP_NAME',
        FIELD_NAME: '醫院中文',
        UPT_BEF: '',
        UPF_AFT: ''
      },
      {
        javaClass: 'java.util.Map',
        FIELD_ID: 'DEAD_DATE',
        FIELD_NAME: '死亡日期',
        UPT_BEF: '',
        UPF_AFT: ''
      },
      {
        javaClass: 'java.util.Map',
        FIELD_ID: 'OCR_ID',
        FIELD_NAME: '事故者ID',
        UPT_BEF: '',
        UPF_AFT: ''
      },
      {       
        javaClass: 'java.util.Map',        
        FIELD_ID: 'COUNTRY_CODE',       
        FIELD_NAME: '國籍',       
        UPT_BEF: '',        
        UPF_AFT: ''      
       } 
    ],
    isManager: false,
    reviewerInfo: null,
    inKindPaymentList: null,
    isShowInKindPayArea: false,
  }),
  getters: {
    /*先註解// 取得目前所得類別清單
    getCurrentClaimCat(state) {
       switch (state.currentLifeGropClfy) {
        // 個人險
        case LifeGroupClassify.Person:
          return state.claimCategories.PERSON_CLAM_CATS;
        // 團體險
        case LifeGroupClassify.Group:
          return state.claimCategories.GROUP_CLAM_CATS;
        // 學團險
        case LifeGroupClassify.School:
          return state.claimCategories.SCHOOL_CLAM_CATS;
        default:
          return [];
      }
    },
    isLifePerson: (state) => state.currentLifeGropClfy === LifeGroupClassify.Person,
    isLifeGroup: (state) => state.currentLifeGropClfy === LifeGroupClassify.Group,
    isLifeSchool: (state) => state.currentLifeGropClfy === LifeGroupClassify.School,
    // isManager: (state) => state.basicData?.APLY_STS >= 42 && state.basicData?.APLY_STS <= 80,
    // 決策引導顯示用疾病名稱
    icdCodeName: (state) =>
      state.diagData?.DIAG_DATA?.length > 0
        ? state.diagData.DIAG_DATA[0]?.CFM_ICD_CODE1 + state.diagData.DIAG_DATA[0]?.CFM_ICD_NAME1
        : ''*/
  },
  actions: {
    /**
     * 進頁面取得基本資料
     * @param {String} applyNo 受理編號
     */
    async getBasicData(applyNo) {
      const responses = await Promise.all([
        apiReadBasicData([applyNo])
      ]);

      console.log('apply.js getBasicData responses>>>');

      let basicDataResult = responses[0].data.result.applyData;

      for(const key of Object.keys(this.basicData)){
        this.basicData[key] = basicDataResult[key];
      }
    },

    /**
     * 進頁面取得全部申請資料
     * @param {String} applyNo 受理編號
     */
    async getAllData(applyNo) {
      const responses = await Promise.all([
        apiReadApplicationData([applyNo])/*先註解,
        apiGetDiePlaceAreaList()*/
      ]);
      console.log('apply.js getAllData responses>>>'); 
      console.log(responses);

      let result = responses[0].data.result;
      if (!result.IS_SUCCESS) {
        let errorMessage = result.RTN_MSG;
        var warningMessage = '';

        return { errorMessage, warningMessage };
      }
      let applyData = result.BASIC.applyData;
      this.basicData = applyData;
      this.applyNo = result.BASIC.applyData.PROCESS_NUM;
      //先註解 if (result.BASIC.RTN_CODE >= 0) this.currentLifeGropClfy = result.BASIC.LIFE_GROP_CLFY;
      this.claimData = applyData;
     //0100644068 add call api
      this.diagData = result.DIAG;
      this.cloneArea.diags = cloneDeep(result?.DIAG?.DIAG_DATA ?? []);
     //0100644068 end
      /*先註解 this.diagData = result.DIAG;
      this.receiptData = result.RECEIPT;
      this.highSettlementData = result.HIGHSETTLEMENT;
      this.inKindPayData = result.INKINDPAY;
      this.isShowInKindPayArea = this.inKindPayData.PROC_STS === '1' | this.inKindPayData.PROC_STS === '3';

      this.backupResult = cloneDeep(result);

      // 複製一份
      this.cloneArea.noNameList = cloneDeep(result?.CLAIM?.noNameList ?? []);
      this.cloneArea.noNameGList = cloneDeep(result?.CLAIM?.noNameGList ?? []);
      this.cloneArea.diags = cloneDeep(result?.DIAG?.DIAG_DATA ?? []);
      this.cloneArea.receipts = cloneDeep(result?.RECEIPT?.RECEIPT_DATA ?? []);
      this.cloneArea.disbItems = cloneDeep(result?.HIGHSETTLEMENT?.DISB_DATA?.DISB_ITEM_DATA ?? []);

      // 設定要偵測異動的欄位
      this.setDetectFields(result, 'BEFORE');

      let errorMessage = '';
      if (result.BASIC.RTN_CODE < 0) errorMessage += result.BASIC.RTN_MSG + '\n';
      if (result.CLAIM.RTN_CODE < 0) errorMessage += result.CLAIM.RTN_MSG + '\n';
      if (result.DIAG.RTN_CODE < 0) errorMessage += result.DIAG.RTN_MSG + '\n';
      if (result.RECEIPT.RTN_CODE < 0) errorMessage += result.RECEIPT.RTN_MSG + '\n';
      if (result.HIGHSETTLEMENT.RTN_CODE < 0) errorMessage += result.HIGHSETTLEMENT.RTN_MSG + '\n';
      if (result.INKINDPAY.RTN_CODE < 0) errorMessage += result.INKINDPAY.RTN_MSG;

      // 符合大額給付狀態發生日要固定顯示
      if (!result.HIGHSETTLEMENT?.CFM_DISB_DATE) {
        result.HIGHSETTLEMENT.CFM_DISB_DATE = '';
        this.backupResult.HIGHSETTLEMENT.CFM_DISB_DATE = '';
      }

      var warningMessage = '';

      if (result.RTN_CODE == '1') warningMessage += result.RTN_MSG;
      if (result.BASIC.RTN_CODE == '1') warningMessage += result.BASIC.RTN_MSG;
      if (result.CLAIM.RTN_CODE == '1') warningMessage += result.CLAIM.RTN_MSG;
      if (result.DIAG.RTN_CODE == '1') warningMessage += result.DIAG.RTN_MSG;
      if (result.RECEIPT.RTN_CODE == '1') warningMessage += result.RECEIPT.RTN_MSG;
      if (result.HIGHSETTLEMENT.RTN_CODE == '1') warningMessage += result.HIGHSETTLEMENT.RTN_MSG;
      if (result.INKINDPAY.RTN_CODE == '1') warningMessage += result.INKINDPAY.RTN_MSG;

      if (responses[1].data.result.IS_SUCCESS) {
        this.diePlaceArea = responses[1].data.result.PLACE_AREA_LIST;
      }*/
      
      let errorMessage = '';
      var warningMessage = '';
      return { errorMessage, warningMessage };
    },

    // 取得部分彈窗的資料
    async getNeedModalData() {
      const responses = await Promise.all([
        this.getClaimCategories(),
        this.getCancerCategories(),
        this.getBoneDays(),
        this.getFullDisabilityList(),
        this.getHeavyDisabilityList()
      ]);
      console.log(responses);
      // 索賠類別
      if (responses[0].IS_SUCCESS) {
        this.claimCategories = responses[0];
      }
      // 癌症類別
      if (responses[1].IS_SUCCESS) {
        this.cancerCategories = responses[1].CANCER_CAT_LIST;
      }
      // 骨折換算
      if (responses[2].IS_SUCCESS) {
        this.boneDays = responses[2].BONE_DAY_LIST;
      }
      // 完全失能項目
      if (responses[3].IS_SUCCESS) {
        this.fullDisabilityList = responses[3].FULL_DISB_LIST;
      }
      // 重大疾病項目
      if (responses[4].IS_SUCCESS) {
        this.heavyDisabilityList = responses[4].HEVY_DIS_LIST;
      }
    },

    /**
     * 取得事故原因
     * @param {事故原因類型} type
     */
    async getAccidentReasons(type) {
      /*先註解 try {
        const response = await apiQueryOcrReasonsList([type]);
        const result = response.data.result;
        if (!result.IS_SUCCESS) throw result.RTN_MSG;
        return result.OCR_RESN_LIST;
      } catch (e) {
        throw e;
      }*/
      try {
        const response = await apiGetAccidentReasonsData([type]);
        const result = response.data.result;
        if (!result.IS_SUCCESS) throw result.RTN_MSG;
        return result.ACCIDENT_LIST;
      } catch (e) {
        throw e;
      }
    },
    /**
     * 取得所有索賠類別
     */
    async getClaimCategories() {
      // if (this.claimCategories.PERSON_CLAM_CATS || this.claimCategories.GROUP_CLAM_CATS || this.claimCategories.SCHOOL_CLAM_CATS)
      //   return this.getCurrentClaimCat;
      /*先註解 try {
        const response = await apiQueryClaimCatList();
        const result = response.data.result;
        if (!result.IS_SUCCESS) throw result.RTN_MSG;
        this.claimCategories.PERSON_CLAM_CATS = result.PERSON_CLAM_CATS;
        this.claimCategories.GROUP_CLAM_CATS = result.GROUP_CLAM_CATS;
        this.claimCategories.SCHOOL_CLAM_CATS = result.SCHOOL_CLAM_CATS;
        return this.getCurrentClaimCat;
      } catch (e) {
        throw e;
      }*/
      if (this.claimCategories.PERSON_CLAM_CATS || this.claimCategories.GROUP_CLAM_CATS || this.claimCategories.SCHOOL_CLAM_CATS)
        return this.getCurrentClaimCat;
      try {
        const response = await apiQueryClaimCatList();
        const result = response.data.result;
        if (!result.IS_SUCCESS) throw result.RTN_MSG;
        this.claimCategories.PERSON_CLAM_CATS = result.PERSON_CLAM_CATS;
        this.claimCategories.GROUP_CLAM_CATS = result.GROUP_CLAM_CATS;
        this.claimCategories.SCHOOL_CLAM_CATS = result.SCHOOL_CLAM_CATS;
        return this.getCurrentClaimCat;
      } catch (e) {
        throw e;
      }
    },
    /**
     * 取得投保學校縣市
     */
    async getSchoolCities() {
      // 如果已經有資料就直接回傳，不再Call APi
      if (this.schoolCities) return this.schoolCities;
      /*先註解 try {
        const response = await apiGetSchoolCityList();
        const result = response.data.result;
        console.log(result);
        if (!result.IS_SUCCESS) throw result.RTN_MSG;

        this.schoolCities = result.SCHOOL_CITY_LIST;
        return result.SCHOOL_CITY_LIST;
      } catch (e) {
        throw e;
      }*/
    },
    /**
     * 查詢投保學校
     * @param {String} city 縣市名稱
     * @param {String} code 學校代碼
     * @param {String} keyword 學校關鍵字
     */
    async getSchools(city, code, keyword) {
      /*先註解 try {
        const response = await apiGetSchool([city, code, keyword]);
        const result = response.data.result;
        if (!result.IS_SUCCESS) throw result.RTN_MSG;
        return result.SCHOOL_LIST;
      } catch (e) {
        throw e;
      }*/
    },
    /**
     * 取得醫院縣市
     */
    async getHospitalCities() {
      // 如果已經有資料就直接回傳，不再Call APi
      if (this.hospitalCities) return this.hospitalCities;
      /*先註解 try {
        const response = await apiGetHospitalAreaList();
        const result = response.data.result;
        console.log(result);
        if (!result.IS_SUCCESS) throw result.RTN_MSG;

        this.hospitalCities = result.HOSP_AREA_LIST;
        return result.HOSP_AREA_LIST;
      } catch (e) {
        throw e;
      }*/
    },
    /**
     * 查詢醫院
     * @param {String} localCode 區域代碼
     * @param {String} keyword 醫院關鍵字
     */
    async getHospitals(localCode, keyword) {
      /*先註解 try {
        const response = await apiGetHospital([localCode, keyword]);
        const result = response.data.result;
        if (!result.IS_SUCCESS) throw result.RTN_MSG;
        return result.HOSP_LIST;
      } catch (e) {
        throw e;
      }*/
    },
    /**
     * 取得手術主科別
     */
    async getOpMainDeps() {
      /*先註解 try {
        if (this.opMainDeps) return this.opMainDeps;
        const response = await apiGetMainDepList();
        const result = response.data.result;
        if (!result.IS_SUCCESS) throw result.RTN_MSG;
        this.opMainDeps = result.MAIN_DEP_LIST;
        return result.MAIN_DEP_LIST;
      } catch (e) {
        throw e;
      }*/
    },

    /**
     * 取得手術子科別
     * @param {String} mainDpCode 主科別代碼
     */
    async getOpSubDeps(mainDpCode) {
      /*先註解 try {
        const response = await apiGetSubDepList([mainDpCode]);
        const result = response.data.result;
        if (!result.IS_SUCCESS) throw result.RTN_MSG;
        return result.SUB_DEP_LIST;
      } catch (e) {
        throw e;
      }*/
    },

    /**
     * 取得疾病類別
     */
    async getICDClasses() {
      /*先註解 try {
        if (this.ICDClasses) return this.ICDClasses;
        const response = await apiGetICDClass();
        const result = response.data.result;
        if (!result.IS_SUCCESS) throw result.RTN_MSG;
        this.ICDClasses = result.ICD_LEVEL1;
        return result.ICD_LEVEL1;
      } catch (e) {
        throw e;
      }*/
    },

    /**
     *
     * @param {String} name 第二層疾病名稱
     * @param {String} keyword 搜尋關鍵字
     * @param {String} code 疾病代碼
     */
    async searchICD(name, keyword, code) {
      /*先註解 try {
        const response = await apiSearchICD([name, keyword, code]);
        const result = response.data.result;
        if (!result.IS_SUCCESS) throw result.RTN_MSG;
        return result.ICD_LIST;
      } catch (e) {
        throw e;
      }*/
    },

    /**
     * 取得癌症分類
     */
    async getCancerCategories() {
      if (this.cancerCategories) return this.cancerCategories;
      /*先註解 try {
        const response = await apiGetCancerCatList();
        const result = response.data.result;
        if (!result.IS_SUCCESS) throw result.RTN_MSG;
        this.cancerCategories = result.CANCER_CAT_LIST;
        return result.CANCER_CAT_LIST;
      } catch (e) {
        throw e;
      }*/
    },

    /**
     * 取得國籍
     */
    async getCountryOptions() {
      /*先註解 try {
        const response = await apiGetCountryList(); 
        const result = response.data.result;
      
        if (!result.IS_SUCCESS) throw result.RTN_MSG;
        return result.DATA;
      } catch (e) {
        throw e;
      }*/
    },

    /**
     * 取得骨折換算資料
     */
    async getBoneDays() {
      if (this.boneDays) return this.boneDays;
      /*先註解 try {
        const response = await apiGetBoneDayList();
        const result = response.data.result;
        if (!result.IS_SUCCESS) throw result.RTN_MSG;
        this.boneDays = result.BONE_DAY_LIST;
        return result.BONE_DAY_LIST;
      } catch (e) {
        throw e;
      }*/
    },

    /**
     * 搜尋手術
     * @param {String} part 部位
     * @param {String} keyword 關鍵字
     */
    async searchOP(area, grade, cancer, name, isDiv, isName) {
      try {
      const response = await apiSearchOP([area, grade, cancer, name, isDiv, isName]);
        const result = response.data.result;
        if (!result.IS_SUCCESS) throw result.RTN_MSG;
        return result.OP_LIST;
      } catch (e) {
        throw e;
      }
      /*先註解 try {
        const response = await apiSearchOP([part, keyword]);
        const result = response.data.result;
        if (!result.IS_SUCCESS) throw result.RTN_MSG;
        return result.OP_LIST;
      } catch (e) {
        throw e;
      }*/
    },
    /**
     * 取得手術險別/等級
     * @param {String} type PROD/GRAD
     * @param {String} value 參數
     */
    async getOPProdOrGrad(type, value) {
      /*先註解 try {
        let response = type === 'PROD' ? await apiGetOpProd([value]) : await apiGetOpGrad([value]);
        let result = response.data.result;
        if (!result.IS_SUCCESS) throw result.RTN_MSG;
        return result[type === 'PROD' ? 'opProdList' : 'opGradList'];
      } catch (e) {
        throw e;
      }*/
    },

    /**
     * 取得員工等級
     * @param {String} policyNo 保單號碼
     */
    async GetEmpDegreeSel(policyNo) {
      /*先註解 try {
        let response = await apiGetEmpDegreeSel([policyNo]);
        let result = response.data.result;
        if (!result.IS_SUCCESS) throw result.RTN_MSG;
        return result.EMP_DEGREE_LIST;
      } catch (e) {
        throw e;
      }*/
    },

    /**
     * 取得死亡地點區域別
     */
    async getDiePlaceArea() {
      // 如果已經有資料就直接回傳，不再Call APi
      if (this.diePlaceArea) return this.diePlaceArea;
      /*先註解 try {
        const response = await apiGetDiePlaceAreaList();
        const result = response.data.result;
        if (!result.IS_SUCCESS) throw result.RTN_MSG;

        this.diePlaceArea = result.PLACE_AREA_LIST;
        return result.PLACE_AREA_LIST;
      } catch (e) {
        throw e;
      }*/
    },

    /**
     * 取得完全失能項目
     */
    async getFullDisabilityList() {
      if (this.fullDisabilityList) return this.fullDisabilityList;
      /*先註解 try {
        const response = await apiGetFullDisbList();
        const result = response.data.result;
        this.fullDisabilityList = result.FULL_DISB_LIST;
        return result.FULL_DISB_LIST;
      } catch (e) {
        throw e;
      }*/
    },
    /**
     * 取得重大疾病項目
     */
    async getHeavyDisabilityList() {
      if (this.heavyDisabilityList) return this.heavyDisabilityList;
      /*先註解 try {
        const response = await apiGetHeavyDisbList();
        const result = response.data.result;
        this.heavyDisabilityList = result.HEVY_DIS_LIST;
        return result.HEVY_DIS_LIST;
      } catch (e) {
        throw e;
      }*/
    },
    /**
     * 取得會用到的失能項目List
     * @param {String} apiName api名稱
     * @param {String} param 參數
     * @returns
     */
    async getDisbList(apiName, param) {
      /*先註解 try {
        let response, result;
        let returnList = [];
        switch (apiName) {
          case 'getDisbClsList':
            response = await apiGetDisbClsList();
            result = response.data.result;
            returnList = result.DISB_CLS_LIST.map((e) => ({ KEY: e.DISB_CLS_KEY, NAME: e.DISB_CLS_NAME }));
            break;
          case 'getDisbPartList':
            response = await apiGetDisbPartList([param]);
            result = response.data.result;
            returnList = result.DISB_PART_LIST.map((e) => ({ KEY: e.DISB_PART_KEY, NAME: e.DISB_PART_NAME }));
            break;
          case 'getDisbLFList':
            response = await apiGetDisbLFList([param]);
            result = response.data.result;
            returnList = result.DISB_LF_LIST.map((e) => ({ KEY: e.DISB_LF_KEY, NAME: e.DISB_LF_NAME }));
            break;
          case 'getDisbELBWList':
            response = await apiGetDisbELBWList([param]);
            result = response.data.result;
            returnList = result.DISB_ELBW_LIST.map((e) => ({ KEY: e.DISB_ELBW_KEY, NAME: e.DISB_ELBW_NAME }));
            break;
          case 'getDisbFuncListByPart':
            response = await apiGetDisbFuncListByPart([param]);
            result = response.data.result;
            returnList = result.DISB_FUNC_LIST.map((e) => ({ KEY: e.DISB_FUNC_KEY, NAME: e.DISB_FUNC_NAME }));
            break;
          case 'getDisbFuncListByELBW':
            response = await apiGetDisbFuncListByELBW([param]);
            result = response.data.result;
            returnList = result.DISB_FUNC_LIST.map((e) => ({ KEY: e.DISB_FUNC_KEY, NAME: e.DISB_FUNC_NAME }));
          default:
            break;
        }
        if (!result.IS_SUCCESS) throw result.RTN_MSG;
        return returnList;
      } catch (e) {
        throw e;
      }*/
    },

    /**
     * 取得大額給付特殊疾病資料
     * @param {String} type GRAV/STEM/CON
     */
    async getSpecialDisease(type) {
      /*先註解 try {
        switch (type) {
          case 'GRAV': {
            if (this.gravItemList) return this.gravItemList;
            const response = await apiGetGravItemList();
            const result = response.data.result;
            console.log(result);
            if (!result.IS_SUCCESS) throw result.RTN_MSG;

            this.gravItemList = result.GRAV_ITEM_LIST;
            return result.GRAV_ITEM_LIST;
          }
          case 'STEM': {
            if (this.stemItemList) return this.stemItemList;
            const response = await apiGetStemItemList();
            const result = response.data.result;
            console.log(result);
            if (!result.IS_SUCCESS) throw result.RTN_MSG;

            this.stemItemList = result.STEM_ITEM_LIST;
            return result.STEM_ITEM_LIST;
          }
          case 'CON': {
            if (this.conItemList) return this.conItemList;
            const response = await apiGetConList();
            const result = response.data.result;
            console.log(result);
            if (!result.IS_SUCCESS) throw result.RTN_MSG;

            this.conItemList = result.CON_LIST;
            return result.CON_LIST;
          }
          default:
            return [];
        }
      } catch (e) {
        throw e;
      }*/
    },

    generatePageData(applyNo, QUES_TYPE = 'X', QUES_ANSWER = 'X') {
      const template = {
        javaClass: 'java.util.Map',
        BASIC_DATA: {
          APLY_NO: applyNo,
          ...this.basicData
        },
        CLAIM_DATA: {
          APLY_NO: applyNo,
          ...this.claimData
        },
        DIAG_DATA: {
          APLY_NO: applyNo,
          ...this.diagData
        },
        RECEIPT_DATA: {
          APLY_NO: applyNo,
          ...this.receiptData
        },
        HIGHSETTLEMENT_DATA: {
          APLY_NO: applyNo,
          ...this.highSettlementData
        },
        INKINDPAY: {
          APLY_NO: applyNo,
          ...this.inKindPayData
        }
      };
      // 不需傳事故原因中文
      delete template.CLAIM_DATA.OCR_RESN_NAME;

      // 處理ACT_CD是U的部分，和原先複製的資料做比對
      this.handleActcd('U', template);
      let detectFieldNeedData = {
        BASIC: this.basicData,
        CLAIM: this.claimData,
        DIAG: this.diagData,
        HIGHSETTLEMENT: this.highSettlementData
      };
      // 處理異動欄位
      this.setDetectFields(detectFieldNeedData, 'AFTER');
      // 取出異動欄位
      let UPT_INFO = this.detectFields.filter((d) => !isEqual(d.UPF_AFT, d.UPT_BEF));
      // 取出來後再清掉值
      UPT_INFO.forEach((u) => {
        u.UPF_AFT = '';
        u.UPT_BEF = '';
      });

      console.log(cloneDeep(template));
      console.log(UPT_INFO);
      // 補上每個區塊的受理編號
      return {
        data: [
          applyNo,
          'AAA0Z100',
          this.isPageChanged() ? 'Y' : 'N',
          UPT_INFO.length > 0 ? 'Y' : 'N',
          UPT_INFO,
          [template],
          QUES_TYPE,
          QUES_ANSWER,
          []
        ],
        detectFieldNeedData
      };
    },

    isPageChanged() {
      // 第一次進來觸發自動儲存時要帶Y
      if (this.claimData.APLY_PROC_STS === '1') {
        return true;
      }

      console.log('basic data changed: ' + !isEqual(this.backupResult.BASIC, this.basicData));
      console.log('claim data changed: ' + !isEqual(this.backupResult.CLAIM, this.claimData));
      console.log('diag data changed: ' + !isEqual(this.backupResult.DIAG, this.diagData));
      // console.log(JSON.stringify(this.backupResult.DIAG));
      // console.log(JSON.stringify(this.diagData));
      console.log('receipt data changed: ' + !isEqual(this.backupResult.RECEIPT, this.receiptData));
      console.log('highsettlement data changed:' + !isEqual(this.backupResult.HIGHSETTLEMENT, this.highSettlementData));
      console.log('inKindPayData data changed:' + !isEqual(this.backupResult.INKINDPAY, this.inKindPayData));
      let isChanged =
        !isEqual(this.backupResult.BASIC, this.basicData) ||
        !isEqual(this.backupResult.CLAIM, this.claimData) ||
        !isEqual(this.backupResult.DIAG, this.diagData) ||
        !isEqual(this.backupResult.RECEIPT, this.receiptData) ||
        !isEqual(this.backupResult.HIGHSETTLEMENT, this.highSettlementData) ||
        !isEqual(this.backupResult.INKINDPAY, this.inKindPayData);
      return isChanged;
    },

    /**
     * 檢核學團險件保單號碼
     */
    async checkHPolicyNo() {
      /*先註解 const response = await apiCheckHPolicyNo([this.claimData.POLICY_NO]);
      const result = response.data.result;
      return result;*/
    },

    /**
     * 儲存頁面資料
     * @param {String} applyNo 受理編號
     */
    async savePageData(applyNo, QUES_TYPE = 'X', QUES_ANSWER = 'X') {
      /*先註解 let requestData = this.generatePageData(applyNo, QUES_TYPE, QUES_ANSWER);
      // 呼叫API儲存
      const response = await apiSaveClamData(requestData.data);
      const result = response.data.result;
      if (result.IS_SUCCESS) {
        this.handleActcd('D');
        this.setDetectFields(null, 'RESET');
        this.setDetectFields(requestData.detectFieldNeedData, 'BEFORE');
        this.backupResult = cloneDeep({
          BASIC: this.basicData,
          CLAIM: this.claimData,
          DIAG: this.diagData,
          RECEIPT: this.receiptData,
          HIGHSETTLEMENT: this.highSettlementData,
          INKINDPAY: this.inKindPayData
        });
      }
      result.DATA = requestData;
      return result;*/
    },

    /**
     * 異動儲存
     */
    async saveReDealPageData(data) {
      /*先註解 const response = await apiSaveReDealClamData(data);
      const result = response.data.result;
      return result;*/
    },

    /**
     * 處理異動欄位
     * @param {Object} data
     * @param {String} type  BEFORE、AFTER、RESET
     * @returns
     */
    setDetectFields(data, type = 'BEFORE') {
      if (type === 'RESET') {
        this.detectFields.forEach((d) => {
          d.UPT_BEF = '';
          d.UPF_AFT = '';
        });
        return;
      }

      let fieldName = type === 'BEFORE' ? 'UPT_BEF' : 'UPF_AFT';
      // 申請種類
      this.detectFields[0][fieldName] = data?.CLAIM?.CFM_APLY_KIND;
      // 索賠類別
      this.detectFields[1][fieldName] = data?.CLAIM?.CFM_CLAM_CAT;
      // 無記名
      this.detectFields[2][fieldName] = data?.CLAIM?.noNameList ? data?.CLAIM?.noNameList : null;
      // 事故日
      this.detectFields[3][fieldName] = data?.CLAIM?.OCR_DATE;
      // 學校代碼
      this.detectFields[4][fieldName] = data?.CLAIM?.SCH_NO;
      // 多筆 => 國壽回覆不用放異動值了，但為了比較還是會放值
      // 診斷病名
      this.detectFields[5][fieldName] = data?.DIAG?.DIAG_DATA?.map(
        (e) => e.CFM_ICD_CODE1 + e.CFM_ICD_CODE2 + e.CFM_ICD_CODE3 + e.CFM_ICD_CODE4 + e.CFM_ICD_CODE5
      );

      // 手術代碼
      this.detectFields[6][fieldName] = data.DIAG?.DIAG_DATA?.map((e) => e.MEDICAL_DATA?.OPER_DATA?.map((o) => o.CFM_OP_CODE));
      // 醫生姓名
      this.detectFields[7][fieldName] = data.DIAG?.DIAG_DATA?.map((e) => e.DOC_NAME);
      // 醫院中文
      this.detectFields[8][fieldName] = data.DIAG?.DIAG_DATA?.map((e) => e.HOSP_NAME);
      // 死亡日期
      this.detectFields[9][fieldName] = data?.HIGHSETTLEMENT?.DEATH_DATA?.CFM_DEAD_DATE;
      //事故者ID
      this.detectFields[10][fieldName] = data?.BASIC?.OCR_ID;
      // 國籍
      this.detectFields[11][fieldName] = data?.BASIC?.COUNTRY_CODE; 
    },

    handleActcd(action, targetData) {
      // 處理ACT_CD是U的部分，和原先複製的資料做比對，如有不同設成U
      if (action === 'U') {
        let updatedNoNameList = differenceWith(
          targetData.CLAIM_DATA?.noNameList?.filter((e) => e.ACT_CD !== 'A' && e.ACT_CD !== 'D'),
          this.cloneArea.noNameList,
          isEqual
        ).map((m) => m.SER_NO.toString());
        if (updatedNoNameList.length > 0) {
          targetData.CLAIM_DATA?.noNameList?.forEach((element) => {
            if (updatedNoNameList.includes(element.SER_NO.toString())) element.ACT_CD = 'U';
          });
          console.log(updatedNoNameList);
        }

        let updatedNoNameGList = differenceWith(
          targetData.CLAIM_DATA?.noNameGList?.filter((e) => e.ACT_CD !== 'A' && e.ACT_CD !== 'D'),
          this.cloneArea.noNameGList,
          isEqual
        ).map((m) => m.SER_NO.toString());
        if (updatedNoNameGList.length > 0) {
          targetData.CLAIM_DATA?.noNameGList?.forEach((element) => {
            if (updatedNoNameGList.includes(element.SER_NO.toString())) element.ACT_CD = 'U';
          });
          console.log(updatedNoNameGList);
        }

        let updatedDiags = differenceWith(
          targetData?.DIAG_DATA?.DIAG_DATA.filter((e) => e.ACT_CD !== 'A' && e.ACT_CD !== 'D'),
          this.cloneArea.diags,
          isEqual
        ).map((m) => m.DIAG_SER_NO.toString());
        if (updatedDiags.length > 0) {
          targetData?.DIAG_DATA?.DIAG_DATA.forEach((element) => {
            if (updatedDiags.includes(element.DIAG_SER_NO.toString())) element.ACT_CD = 'U';
          });
          console.log(updatedDiags);
        }
        let updatedReceipts = differenceWith(
          targetData?.RECEIPT_DATA?.RECEIPT_DATA.filter((e) => e.ACT_CD !== 'A' && e.ACT_CD !== 'D'),
          this.cloneArea.receipts,
          isEqual
        ).map((m) => m.SER_NO.toString());
        if (updatedReceipts.length > 0) {
          targetData?.RECEIPT_DATA?.RECEIPT_DATA.forEach((element) => {
            if (updatedReceipts.includes(element.SER_NO.toString())) element.ACT_CD = 'U';
          });
          console.log(updatedReceipts);
        }

        let updatedDisbItems = differenceWith(
          targetData?.HIGHSETTLEMENT_DATA?.DISB_DATA?.DISB_ITEM_DATA.filter((e) => e.ACT_CD !== 'A' && e.ACT_CD !== 'D'),
          this.cloneArea.disbItems,
          isEqual
        ).map((m) => m.DISB_SER_NO.toString());
        if (updatedDisbItems.length > 0) {
          targetData?.HIGHSETTLEMENT_DATA?.DISB_DATA?.DISB_ITEM_DATA.forEach((element) => {
            if (updatedDisbItems.includes(element.DISB_SER_NO.toString())) element.ACT_CD = 'U';
          });
          console.log(updatedDisbItems);
        }
      } else {
        if (this.claimData?.noNameList) {
          for (let i = this.claimData?.noNameList.length - 1; i >= 0; i -= 1) {
            if (this.claimData?.noNameList[i]?.ACT_CD === 'D') {
              this.claimData?.noNameList.splice(i, 1);
            } else {
              this.claimData.noNameList[i].ACT_CD = '';
            }
          }
        }
        if (this.claimData?.noNameGList) {
          for (let i = this.claimData?.noNameGList.length - 1; i >= 0; i -= 1) {
            if (this.claimData?.noNameGList[i]?.ACT_CD === 'D') {
              this.claimData?.noNameGList.splice(i, 1);
            } else {
              this.claimData.noNameGList[i].ACT_CD = '';
            }
          }
        }
        if (this.diagData?.DIAG_DATA) {
          for (let i = this.diagData?.DIAG_DATA.length - 1; i >= 0; i -= 1) {
            if (this.diagData?.DIAG_DATA[i]?.ACT_CD === 'D') {
              this.diagData?.DIAG_DATA.splice(i, 1);
            } else {
              this.diagData.DIAG_DATA[i].ACT_CD = '';
            }
          }
        }
        if (this.receiptData?.RECEIPT_DATA) {
          for (let i = this.receiptData?.RECEIPT_DATA.length - 1; i >= 0; i -= 1) {
            if (this.receiptData?.RECEIPT_DATA[i]?.ACT_CD === 'D') {
              this.receiptData?.RECEIPT_DATA.splice(i, 1);
            } else {
              this.receiptData.RECEIPT_DATA[i].ACT_CD = '';
            }
          }
        }
        if (this.highSettlementData?.HIGHSETTLEMENT?.DISB_DATA?.DISB_ITEM_DATA) {
          for (let i = this.highSettlementData?.HIGHSETTLEMENT?.DISB_DATA?.DISB_ITEM_DATA.length - 1; i >= 0; i -= 1) {
            if (this.highSettlementData?.HIGHSETTLEMENT?.DISB_DATA?.DISB_ITEM_DATA[i]?.ACT_CD === 'D') {
              this.highSettlementData?.HIGHSETTLEMENT?.DISB_DATA?.DISB_ITEM_DATA.splice(i, 1);
            } else {
              this.highSettlementData.HIGHSETTLEMENT.DISB_DATA.DISB_ITEM_DATA[i].ACT_CD = '';
            }
          }
        }

        this.cloneArea.noNameList = cloneDeep(this.claimData?.noNameList ?? []);
        this.cloneArea.noNameGList = cloneDeep(this.claimData?.noNameGList ?? []);
        this.cloneArea.diags = cloneDeep(this.diagData?.DIAG_DATA ?? []);
        this.cloneArea.receipts = cloneDeep(this.receiptData?.RECEIPT_DATA ?? []);
        this.cloneArea.disbItems = cloneDeep(this.highSettlementData?.DISB_DATA?.DISB_ITEM_DATA ?? []);
      }
    },

    /**
     * 取得收據項目
     * @param {String} hospitalCode 醫院代碼
     * @param {String} receiptKind 收據種類
     */
    async getReceiptItems(hospitalCode, receiptKind, isSchool) {
      /*先註解 const respose = await apiGetReceiptItem([hospitalCode, receiptKind, isSchool]);
      const result = respose.data.result;
      return result;*/
    },

    /**
     * 取得實物給付代碼設定
     */
    async getInKindPaymentList() {
      // 如果已經有資料就直接回傳，不再Call APi
      if (this.inKindPaymentList) return this.inKindPaymentList;
      /*先註解 try {
        //debugger;
        const response = await apiGetInKindPaymentList();
        const result = response.data.result;
        if (!result.IS_SUCCESS) throw result.RTN_MSG;

        this.inKindPaymentList = result.IN_KIND_PAYMENT_LIST;
        return result.IN_KIND_PAYMENT_LIST;
      } catch (e) {
        throw e;
      }*/
    }, 

    /**
     * 取得員工等級
     * @param {String} trusteeEEID 保單號碼
     */
    async getTrusteeEEID(trusteeEEID) {
      try {
        let response = await apiGetTrusteeEEID([trusteeEEID]);
        let result = response.data.result;
        if (!result.IS_SUCCESS) throw result.RTN_MSG;
        return result.EmpInfo;
      } catch (e) {
        throw e;
      }
    },
  }
});
