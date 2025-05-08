import axios from 'axios';
//import { useLanguageStore } from '~/stores/language';
// const baseURL = 'http://localhost:4000';
const baseURL = import.meta.env.CATHAYLIFE_API_URL;
// const baseURL = 'https://swas3.cathaylife.com/AAWeb/servlet/HttpDispatcher/AAB3_1000/api/';

const apiClient = axios.create({
  baseURL,
  timeout: 180000, // 請求超時180秒Error
  headers: { 'Content-Type': 'application/json' },
  responseType: 'json'
});

//const language = useLanguageStore();

// 前置攔截器(發起請求之前的攔截)
apiClient.interceptors.request.use(
  (config) => {
    /**
     * 根據你的項目實際情況來對配置做處理
     * 這裡對配置暫不做任何處理，直接返回
     */
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 後攔截器(獲取到回傳結果時的攔截)
apiClient.interceptors.response.use(
  (response) => {
    /**
     * 根據項目實際情況來對響應和錯誤做處理
     */
    // loading.hide();
    if (response.statusText === 'OK') {
      // 多放一個IS_SUCCESS避免每次寫都要寫RTN_CODE >= 0
      let result = response.data?.result;
      if (typeof result !== 'object' && result !== undefined && result !== null) return response;
      if (result !== undefined) {
        // 沒有回傳RTN_CODE一律視為成功
        response.data.result.RTN_CODE = response.data.result?.RTN_CODE === undefined ? '0' : response.data.result.RTN_CODE;
        response.data.result.IS_SUCCESS = response.data.result.RTN_CODE >= 0;
        if (response.data.result.RTN_CODE == '1' || !response.data.result.IS_SUCCESS) {
          console.error(`ERR_CODE: ${response.data.result.ERR_CODE}`);
          //console.log(`RTN_MSG: ${response.data.result.RTN_MSG}`);
        }
      } else {
        console.error('result', result);
        let errorMessage = `呼叫API異常，請通知理企科窗口協助處理。\nAPI：${response.config.url}`;
        console.error(errorMessage);
        return Promise.reject(errorMessage);
      }
    }

    // console.log(response);
    return response;
  },
  (error) => {
    if (error.response && error.response.data) {
      //const code = error.response.status;
      //const msg = error.response.data.message;
      console.error(`[Axios Response Error]`, error.response);
      console.log(error);
    } else {
      console.error(`[Axios Error]`);
    }
    return Promise.reject(`呼叫API異常，請通知理企科窗口協助處理。\nAPI：${error.response.config.url}`);
  }
);

export default apiClient;
