<template>
  <div class="block table-block">
    <p class="block-title-outside scroll-fix">
      <cathay-translate code="Component_BankReturnTable_001" /> <span>({{ bankReturnData.length }})</span>
    </p>
    <div class="block-content">
      <table class="table is-striped-odd is-fullwidth" id="dataTable">
        <StickyThead>
          <tr class="scroll-fix">
            <th>
              <cathay-translate code="Component_BankReturnTable_002" />
            </th>
            <SortingThead sortKey="PAYMENT_DATE" :currentSortKey="sortName" :isSortDesc="isSortDesc" :onClickSort="setSort">
              <cathay-translate code="Component_BankReturnTable_003" />
            </SortingThead>
            <SortingThead sortKey="POL_NUM" :currentSortKey="sortName" :isSortDesc="isSortDesc" :onClickSort="setSort">
              <cathay-translate code="Component_BankReturnTable_004" />
            </SortingThead>
            <SortingThead sortKey="AMOUNT" :currentSortKey="sortName" :isSortDesc="isSortDesc" :onClickSort="setSort">
              <cathay-translate code="Component_BankReturnTable_005" />
            </SortingThead>
            <SortingThead sortKey="RECEIVING_DATE" :currentSortKey="sortName" :isSortDesc="isSortDesc" :onClickSort="setSort">
              <cathay-translate code="Component_BankReturnTable_006" />
            </SortingThead>
            <SortingThead sortKey="BEN_NAME" :currentSortKey="sortName" :isSortDesc="isSortDesc" :onClickSort="setSort">
              <cathay-translate code="Component_BankReturnTable_007" />
            </SortingThead>
            <SortingThead sortKey="REASON" :currentSortKey="sortName" :isSortDesc="isSortDesc" :onClickSort="setSort">
              <cathay-translate code="Component_BankReturnTable_008" />
            </SortingThead>
            <SortingThead sortKey="DIV_NO" :currentSortKey="sortName" :isSortDesc="isSortDesc" :onClickSort="setSort">
              <cathay-translate code="Component_BankReturnTable_009" />
            </SortingThead>
          </tr>
        </StickyThead>
        <tbody>
          <tr v-for="(bankReturn, index) in bankReturnData" :key="index">
            <td width="120px" style="min-width: 120px">{{ index + 1 }}</td>
            <td width="165">
              {{ getVNDate(bankReturn.PAYMENT_DATE) }}
            </td>
            <td class="limit-width w-105" width="105">
              <a href="#" @click.stop.prevent="onClickPolNum(bankReturn)"> {{ bankReturn.POL_NUM }}</a>
            </td>
            <td width="106" class="limit-width w-105">
              {{ formatCurrency(bankReturn.AMOUNT) }}
            </td>
            <td width="106" class="limit-width w-105">
              {{ getVNDate(bankReturn.RECEIVING_DATE) }}
            </td>
            <td>
              {{ bankReturn.BEN_NAME }}
            </td>
            <td class="limit-width w-330">{{ bankReturn.REASON }}</td>
            <td width="115">{{ bankReturn.DIV_NO }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script setup>
  import SortingThead from '~/components/SortingThead.vue';
  import useCaseTable from '~/composables/useCaseTable';
  import useMoment from '~/composables/useMoment';
  import useTableSort from '~/composables/useTableSort';
  import StickyThead from '../StickyThead.vue';
  import moment from 'moment';

  const bankReturnData = await useCaseTable('bankReturn_mapList');
  const { getVNDate } = useMoment();
  const onClickPolNum = (bankReturn) => {
    let url = '';
    if (
      bankReturn.STEP_ID == '0' ||
      (bankReturn.STATUS == '1' && bankReturn.STEP_ID == '1') ||
      (bankReturn.STEP_ID == '1' && bankReturn.STEP_ID == '')
    ) {
      url = `/servlet/HttpDispatcher/DJN0_0300/window?PAYMENT_DATE=${moment(bankReturn.PAYMENT_DATE).format(
        'DD/MM/YYYY'
      )}&POL_NUM=${bankReturn.POL_NUM}&AMOUNT=${formatCurrency(bankReturn.AMOUNT)}&RECEIVING_DATE=${moment(
        bankReturn.RECEIVING_DATE
      ).format('DD/MM/YYYY')}&BEN_NAME=${bankReturn.BEN_NAME}&ISSUE_DATE=${moment(bankReturn.ISSUE_DATE).format(
        'DD/MM/YYYY'
      )}&ADDRESS=${bankReturn.ADDRESS}&PROCESS_NUM=${bankReturn.APLY_NO}&RECEIPT_SER=${bankReturn.RECEIPT_SER}`;
    } else if (bankReturn.STEP_ID != '0') {
      url = `/servlet/HttpDispatcher/DJN0_0300/view?PAYMENT_DATE=${moment(bankReturn.PAYMENT_DATE).format(
        'DD/MM/YYYY'
      )}&POL_NUM=${bankReturn.POL_NUM}&AMOUNT=${formatCurrency(bankReturn.AMOUNT)}&PROCESS_NUM=${
        bankReturn.APLY_NO
      }&ACCEPT_DIV_NO_1=${bankReturn.ACCEPT_DIV_NO_1}&RECEIPT_SER=${bankReturn.RECEIPT_SER}`;
    }

    window.open(url);
  };

  const formatCurrency = (amount) => {
    let amt = parseFloat(amount);
    return amt.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  };

  const { sortName, isSortDesc, setSort } = useTableSort(bankReturnData, {
    defaultSort: { key: 'PAYMENT_DATE', method: 'desc' }
  });
</script>
<style lang="scss"></style>
