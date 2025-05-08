<template>
  <button id="btnActualAmount" class="button big-yellow-btn" @click="isShowList = !isShowList">實支<br />金額</button>
  <div class="payment-each-beneficiary" v-if="isShowList">
    <div class="payment-each-beneficiary-wrap">
      <button class="button close-btn" @click="isShowList = false"><svg></svg></button>
      <h3>各受益人實支金額</h3>
      <div class="table-area">
        <table class="table is-striped-odd is-white">
          <thead class="is-sticky">
            <tr>
              <th>受益人姓名</th>
              <th class="has-text-right">實支金額</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="actualAmount in actualAmountList" :key="actualAmount.BENE_ID">
              <td class="font-eudc">{{ actualAmount.BENE_NAME }}</td>
              <td class="has-text-right">{{ actualAmount.TOTAL.toLocaleString('en-US') }}</td>
            </tr>
          </tbody>
          <tfoot class="total is-sticky">
            <tr>
              <td>總計</td>
              <td class="has-text-right fz-18">{{ totalAmount.toLocaleString('en-US') }}</td>
            </tr>
          </tfoot>
        </table>
        <div class="tfoot-line"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { toSafeInteger } from 'lodash-es';
  import { storeToRefs } from 'pinia';
  import { useBeneficiaryStore } from '~/stores/beneficiary';
  const beneficiaryStore = useBeneficiaryStore();
  const { paymentAllocations } = storeToRefs(beneficiaryStore);

  // 實支金額開關
  const isShowList = ref(false);

  const actualAmountList = computed(() => {
    const list = [];
    for (const allocation of paymentAllocations.value) {
      for (const claimCatInfo of allocation.claimCatInfo) {
        for (const b of claimCatInfo.beneInfo) {
          if (!b.BENE_ID) continue;
          // 實⽀⾦額 = 延滯息 - 補充保費 - 延滯息所得稅
          let total =
            claimCatInfo.CLAM_CAT === 'Z'
              ? Math.abs(parseFloat(b.DLY_INT)) - Math.abs(parseFloat(b.FEE)) - Math.abs(parseFloat(b.DLY_INT_TAX))
              : parseFloat(b.PAY_AMT);
          // 找現在清單內有沒有該受益人了
          let findBeneInfo = list.find((bene) => bene.BENE_ID === b.BENE_ID && bene.BENE_NAME === b.BENE_NAME);
          if (findBeneInfo) {
            findBeneInfo.TOTAL += total;
          } else {
            list.push({ BENE_ID: b.BENE_ID, BENE_NAME: b.BENE_NAME, TOTAL: total });
          }
        }
      }
    }
    return list;
  });

  const totalAmount = computed(() => actualAmountList.value.map((m) => m.TOTAL).reduce((a, b) => a + b, 0));
  console.log(actualAmountList.value.map((m) => m.TOTAL));

  console.log(actualAmountList.value);
</script>

<style lang="scss" scoped></style>
