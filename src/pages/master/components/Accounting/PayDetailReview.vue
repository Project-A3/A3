<template>
  <div class="card is-full payee-card">
    <div class="columns card-title">
      <div class="column p-0">
        <a href="#" @click.stop.prevent="onClickBeneficiary()">
          <h3 style="text-decoration: underline;color: #6fba2a;">受款人資訊</h3>
        </a>
      </div>
    </div>

    <div class="table-content">
      <table class="table is-fullwidth">
        <thead>
          <tr class="scroll-fix">
            <th class="">受款人姓名</th>
            <th>FATCA/CRS 指標</th>
            <th class="has-text-centered">洗錢資恐等級</th>
            <th class="has-text-centered">未成年</th>
            <th>給付方式</th>
            <th class="has-text-right">延滯息</th>
            <th class="has-text-right">延滯息所得稅</th>
            <th class="has-text-right">補充保費</th>
            <th class="has-text-right">理賠金額</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="detail in payDetails">
            <td class="font-eudc">{{ detail.ACPT_NAME }}<br />{{ detail.ACPT_ID }}</td>
            <td>{{ detail.FATCA_FLAG }}/{{ detail.CRS_FLAG }}</td>
            <td class="has-text-centered">
              <a @click="onClickRiskLink(detail)" :class="{ 'is-primary': true, 'is-warning': (detail.RISK_LEVEL.includes('高') || detail.RISK_LEVEL.includes('制')) }">
                {{ detail.RISK_LEVEL }}
              </a>
            </td>
            <td class="has-text-centered">
              <span :class="{ 'has-text-danger': (detail.IS_ADULTS === 'Y') }">{{ detail.IS_ADULTS }}</span>
            </td>
            <td>
              <p v-if="detail.PAY_TYPE === PayType.Remit && detail.RMT_RIGHT_NOW === 'Y'">即時匯撥</p>
              <p v-else-if="detail.PAY_TYPE === PayType.Cheque && detail.CNCL_LINE_IDX === 'Y'" class="has-text-danger">
                支票(取消平行線)
              </p>
              <p v-else-if="detail.PAY_TYPE === PayType.Cheque && detail.UN_BACK_IDX === 'Y'" class="has-text-danger">
                支票(取消禁背)
              </p>
              <p v-else>{{ detail.PAY_DESC }}</p>
              <p 
                v-if="detail.PAY_TYPE === PayType.Cheque && !isEmpty(detail.APLY_SER_NO)"
                class="has-text-danger"
              >
                票據變更編號: {{ detail.APLY_SER_NO }}
              </p>

              {{ detail.BANK_NO }} {{ detail.ACNT_NO }}

              <p v-if="detail.PAY_TYPE === PayType.Money && !isEmpty(detail.PAY_UNIT)">
                給付單位: {{ detail.PAY_UNIT }} {{ detail.PAY_UNIT_SHORT_NAME }}
              </p>
            </td>
            <td class="has-text-right">{{ toCurrency(detail.DLY_INT) }}</td>
            <td class="has-text-right">{{ toCurrency(detail.DLY_INT_TAX) }}</td>
            <td class="has-text-right">{{ toCurrency(detail.FEE) }}</td>
            <td class="has-text-right">{{ toCurrency(detail.PAY_AMT) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
  import { isEmpty } from 'lodash-es';
import { storeToRefs } from 'pinia';
import { toCurrency } from '~/common/utils';
import { PayType } from '~/common/utils/enum';
import useMoment from '~/composables/useMoment';
import useSwal from '~/composables/useSwal';
import { useAccountingStore } from '~/stores/accounting';
import { useBeneficiaryStore } from '~/stores/beneficiary';
  const { $swal } = useSwal();

  const accountingStore = useAccountingStore();
  const beneficiaryStore = useBeneficiaryStore();
  const { getROCDate } = useMoment();
  const { payDetailReviewData } = storeToRefs(accountingStore);
  const payDetails = computed(() => payDetailReviewData.value.BENE_INFO);

  // 20221101 洗錢資恐連結
  const onClickRiskLink = (beneficiary) => {
    window.open(`/AIWeb/servlet/HttpDispatcher/AIL0_1000/query?CUSTOMER_ID=${beneficiary.ACPT_ID}`);
    // 高風險的連結，需同時跳出三個頁面
    if (beneficiary.RISK_LEVEL.includes('高')) {
      const today = getROCDate(new Date(), 'MMDD', '');
      window.open(
        `/AIWeb/servlet/HttpDispatcher/AIL0_1300/query?QUERY_ID=${beneficiary.ACPT_ID}&QUERY_START_DATE=${today}&QUERY_END_DATE=${today}`
      );
      
      // window.open(`/AIWeb/servlet/HttpDispatcher/AIL0_1900/query?QRY_RECORD_TYPE=0&QRY_SAN=&NAME=${beneficiary.ACPT_NAME}`);
      console.log('>>ACPT_NAME=' + beneficiary.ACPT_NAME);
      postWindowOpen('/AIWeb/servlet/HttpDispatcher/AIL0_1900/query','QRY_RECORD_TYPE,0,QRY_SAN,,NAME,'+beneficiary.ACPT_NAME);
    }
    
  };

  const router = useRouter();
  const route = useRoute();
  const applyNo = route.query?.q;

  const onClickBeneficiary = async() => {
    try{
      if (import.meta.env.DEV) {
        let routeData = router.resolve({
          path: '/master/beneficiary',
          query: { q: applyNo }
        });
        window.open(routeData.href, '_blank');
      } else {
        window.open('/servlet/HttpDispatcher/AAB3_1000/prompt#/master/beneficiary?q=' + applyNo);
      }

      beneficiaryStore.isChkBeneficiary = 'Y';
    } catch (e) {
      $swal.fail(e);
    }
  };

  function postWindowOpen(url, data) {
    console.log('postWindowOpen url='+url);
    console.log('postWindowOpen data='+data);

    // input的key,value,key,value...
    var dataAry = data.split(',');
	  console.log('dataAry='+ dataAry.length);

    // 產生一個暫存的form
    var tempForm = document.createElement("form");
    tempForm.id = "tempForm1";
    tempForm.method = "get";
    tempForm.action = url;
    tempForm.target = 'newWin';
    tempForm.accept="BIG5";
    tempForm.acceptCharset="BIG5";

    // 產生hidden Input
    for(let i=0 ; i<dataAry.length ; i=i+2){
    	var hideInput = document.createElement("input");
      hideInput.type = "hidden";
      hideInput.name = dataAry[i];
      hideInput.value = dataAry[i+1];
     	// 把Input 放進 form
    	tempForm.appendChild(hideInput);
	  } 

    window.open('about:blank', 'newWin', 'hight=400, width=400, top=0, left=0, toolbar=yes, menubar=yes, scrollbars=yes, resizable=yes, location=yes, status=yes');

    document.body.appendChild(tempForm);
    tempForm.submit();
    document.body.removeChild(tempForm);
  }
</script>

<style lang="scss" scoped></style>
