import { isRef } from 'vue';
import { LifeGroupClassify, QuickSearchType } from '~/common/utils/enum';

/**
 * 取得各個快捷按鈕事件
 * @param {QuickSearchType} linkType linkType傳1是受理編號，傳3是事故人ID
 * @param {Object} params 受理編號 + 事故人ID
 * @returns Click Event
 */
//
export default function useQuickLink(linkType, { applyNo, ocrId, ocrName, lifeGropClfy }) {
  // hacky, 這樣帶Proxy或字串都可以
  let getlinkType = () => (isRef(linkType) ? linkType.value : linkType);
  let getRealApplyNo = () => (isRef(applyNo) ? applyNo.value : applyNo);
  let getRealOcrId = () => (isRef(ocrId) ? ocrId.value : ocrId);
  let getRealOcrName = () => (isRef(ocrName) ? ocrName.value : ocrName);
  let getLifeGropClfy = () => (isRef(lifeGropClfy) ? lifeGropClfy.value : lifeGropClfy);

  // console.log(applyNo, ocrId);
  const router = useRouter();
  const isUseApplyNo = linkType === QuickSearchType.ApplyNo;
  // 點擊理賠紀錄
  const onClickClaimRecords = () => {
    let url;
    if (isUseApplyNo) {
      url = `/servlet/HttpDispatcher/AAE0_0200/prompt?PROCESS_NUM_INPUT=${getRealApplyNo()}&SUBMIT_INPUT=1&PAY_TYPE_INPUT=0&DATE_SELECT=0&DATE_ORDER=1&BACK_FROM=A3`;
    } else {
      url = `/servlet/HttpDispatcher/AAE0_0200/prompt?CERTI_TYPE_INPUT=${getlinkType()}&QUERY_METHOD_INSURED_ID_INPUT=checkbox&INSURED_ID_INPUT=${getRealOcrId()}&SUBMIT_INPUT=1&PAY_TYPE_INPUT=0&DATE_SELECT=0&DATE_ORDER=1&BACK_FROM=A3`;
    }
    window.open(url);
  };

  // 點擊不給付紀錄
  const onClickNotGiveRecords = () => {
    let url;
    if (isUseApplyNo) {
      url = `/servlet/HttpDispatcher/AAE0_0200/prompt?PROCESS_NUM_INPUT=${getRealApplyNo()}&QUERY_METHOD_NON_PAY_INPUT=checkbox&SUBMIT_INPUT=1&PAY_TYPE_INPUT=0&DATE_SELECT=0&DATE_ORDER=1&BACK_FROM=A3`;
    } else {
      url = `/servlet/HttpDispatcher/AAE0_0200/prompt?CERTI_TYPE_INPUT=${getlinkType()}&QUERY_METHOD_INSURED_ID_INPUT=checkbox&INSURED_ID_INPUT=${getRealOcrId()}&QUERY_METHOD_NON_PAY_INPUT=checkbox&SUBMIT_INPUT=1&PAY_TYPE_INPUT=0&DATE_SELECT=0&DATE_ORDER=1&BACK_FROM=A3`;
    }
    window.open(url);
  };

  // 點擊解除紀錄
  const onClickReleaseRecords = () => {
    let url;
    if (isUseApplyNo) {
      url = `/servlet/HttpDispatcher/AAE0_0200/prompt?PROCESS_NUM_INPUT=${getRealApplyNo()}&QUERY_METHOD_NON_RENEWAL_INPUT=checkbox&SUBMIT_INPUT=1&PAY_TYPE_INPUT=0&DATE_SELECT=0&DATE_ORDER=1&BACK_FROM=A3`;
    } else {
      url = `/servlet/HttpDispatcher/AAE0_0200/prompt?CERTI_TYPE_INPUT=${getlinkType()}&QUERY_METHOD_INSURED_ID_INPUT=checkbox&INSURED_ID_INPUT=${getRealOcrId()}&QUERY_METHOD_NON_RENEWAL_INPUT=checkbox&SUBMIT_INPUT=1&PAY_TYPE_INPUT=0&DATE_SELECT=0&DATE_ORDER=1&BACK_FROM=A3`;
    }
    window.open(url);
  };

  // 點擊特殊紀錄
  const onClickSpecialRecords = () => {
    if (!isUseApplyNo) {
      window.open(`/servlet/HttpDispatcher/AAB4_0600/prompt?ID_TYPE=${getlinkType()}&ID=${getRealOcrId()}`);
    }
  };

  // 點擊索引紀錄
  const onClickIndexRecords = () => {
    if (!isUseApplyNo) {
      window.open(`/servlet/HttpDispatcher/AAA4_0600/prompt2?ID_TYPE=${getlinkType()}&ID=${getRealOcrId()}`);
    }
  };

  // 點擊補全
  const onClickCompletionRecords = () => {
    let url;
    if (isUseApplyNo) {
      url = `/servlet/HttpDispatcher/AAB4_0500/prompt?PROCESS_NUM=${getRealApplyNo()}&BACK_FROM=A3`;
    } else {
      url = `/servlet/HttpDispatcher/AAB4_0500/prompt?ID_TYPE=${getlinkType()}&ID=${getRealOcrId()}&BACK_FROM=A3`;
    }
    window.open(url);
  };

  // 點擊交查
  const onClickReceiveInspection = () => {
    let url;
    if (isUseApplyNo) {
      url = `/servlet/HttpDispatcher/AHE0_3000/prompt?PROCESS_NUM=${getRealApplyNo()}&BACK_FROM=A3`;
    } else {
      url = `/servlet/HttpDispatcher/AHE0_3000/prompt?ID_TYPE=${getlinkType()}&ID=${getRealOcrId()}&BACK_FROM=A3`;
    }
    window.open(url);
  };

  // 點擊照會
  const onClickNoteLink = () => {
    let url;
    if (isUseApplyNo) {
      url = `/servlet/HttpDispatcher/AAB4_0400/prompt?PROCESS_NUM=${getRealApplyNo()}&BACK_FROM=A3`;
    } else {
      url = `/servlet/HttpDispatcher/AAB4_0400/prompt?ID_TYPE=${getlinkType()}&ID=${getRealOcrId()}&BACK_FROM=A3`;
    }
    window.open(url);
  };

  function postWindowOpen(url, data) {
    console.log('postWindowOpen url=' + url);
    console.log('postWindowOpen data=' + data);

    // input的key,value,key,value...
    var dataAry = data.split(',');
    console.log('dataAry=' + dataAry.length);

    // 產生一個暫存的form
    var tempForm = document.createElement('form');
    tempForm.id = 'tempForm1';
    tempForm.method = 'get';
    tempForm.action = url;
    tempForm.target = 'newWin';
    tempForm.accept = 'BIG5';
    tempForm.acceptCharset = 'BIG5';

    // 產生hidden Input
    for (let i = 0; i < dataAry.length; i = i + 2) {
      var hideInput = document.createElement('input');
      hideInput.type = 'hidden';
      hideInput.name = dataAry[i];
      hideInput.value = dataAry[i + 1];
      // 把Input 放進 form
      tempForm.appendChild(hideInput);
    }

    window.open(
      'about:blank',
      'newWin',
      'hight=400, width=400, top=0, left=0, toolbar=yes, menubar=yes, scrollbars=yes, resizable=yes, location=yes, status=yes'
    );

    document.body.appendChild(tempForm);
    tempForm.submit();
    document.body.removeChild(tempForm);
  }

  // 點擊進入案件
  const onClickEnterCase = () => {
    // window.open(`/AAWeb/servlet/HttpDispatcher/AAE0_0500/prompt?LINK_PARAM=${getRealApplyNo()}&OPEN_IMG=Y`);
    let routeData = router.resolve({
      name: 'master-page',
      params: { page: 'apply' },
      query: { q: getRealApplyNo() }
    });
    window.open(routeData.href, '_blank');
    window.open(`/servlet/HttpDispatcher/AAZ3_0100/prompt?APLY_NO=${getRealApplyNo()}`);
  };

  // 點擊實物服務紀錄
  const onClickAAA8_0100 = () => {
    window.open(
      `/servlet/HttpDispatcher/AAA8_0100/query?TxRequest=true&syscode=AA&subcode=AAA8&checkChose_1=1&S_OCR_ID=${getRealOcrId()}&checkChose_4=4&S_APLY_NO=${getRealApplyNo()}`
    );
  };

  return {
    onClickClaimRecords,
    onClickSpecialRecords,
    onClickNotGiveRecords,
    onClickReleaseRecords,
    onClickIndexRecords,
    onClickReceiveInspection,
    onClickCompletionRecords,
    onClickNoteLink,
    onClickEnterCase,
    onClickAAA8_0100
  };
}
