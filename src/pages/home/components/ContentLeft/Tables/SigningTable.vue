<template>
  <div class="block table-block">
    <p class="block-title-outside scroll-fix">
      <cathay-translate code="Component_SigningTable_001" /> <span>({{ signingData.length }})</span>
    </p>
    <div class="block-content">
      <table class="table is-striped-odd is-fullwidth" id="dataTable">
        <StickyThead>
          <tr class="scroll-fix">
            <SortingThead sortKey="APLY_DATE" :currentSortKey="sortName" :isSortDesc="isSortDesc" :onClickSort="setSort">
              <cathay-translate code="Component_SigningTable_002" />
            </SortingThead>
            <SortingThead sortKey="APLY_NO" :currentSortKey="sortName" :isSortDesc="isSortDesc" :onClickSort="setSort">
              <cathay-translate code="Component_SigningTable_003" />
            </SortingThead>
            <SortingThead sortKey="CLAM_CAT" :currentSortKey="sortName" :isSortDesc="isSortDesc" :onClickSort="setSort">
              <cathay-translate code="Component_SigningTable_004" />
            </SortingThead>
            <th style="width: 15%"><cathay-translate code="Component_SigningTable_005" /></th>
            <th style="width: 15%"><cathay-translate code="Component_SigningTable_006" /></th>
            <th><cathay-translate code="Component_SigningTable_007" /></th>
          </tr>
        </StickyThead>
        <tbody>
          <tr v-for="signing in signingData" :key="signing.APLY_NO">
            <td width="120px" style="min-width: 120px">{{ getVNDate(signing.APLY_DATE) }}</td>
            <td style="width: 80px">
              <a href="#" @click.stop.prevent="onClickApplyNo(signing)">{{ signing.APLY_NO }}</a>
              <br />
              {{ language.translate('Common_Service_Center') + ':' + signing.ACCEPT_DIV_NAME }}
            </td>
            <td width="115" class="limit-width w-105">
              <EllipseTippy
                :disableEllipse="true"
                :content="handleClamCatText(signing.CLAM_CAT, language.translate('Common_CLAIM_CAT_' + signing.CLAM_CAT))"
                :manual-refresh="true"
              >
                <span class="w-50 is-block">{{ signing.CLAM_CAT }}</span>
              </EllipseTippy>
            </td>
            <td style="width: 15%" class="limit-width w-105">
              <EllipseTippy :content="signing.OCR_NAME" class="font-eudc" displayBlock>{{ signing.OCR_NAME }}</EllipseTippy>
            </td>
            <td style="width: 15%" class="limit-width w-105">
              <EllipseTippy :content="signing.ASSIGNED_EMP_NAME" class="font-eudc" displayBlock>{{
                signing.ASSIGNED_EMP_NAME
              }}</EllipseTippy>
            </td>
            <td class="limit-width w-330">
              <EllipseTippy v-if="signing.PIN_MEMO != ''" :content="signing.PIN_MEMO">
                <p class="note font-eudc">
                  {{ signing.PIN_MEMO }}
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
  // 簽擬中表格
  import { handleClamCatText } from '~/common/utils';
  import EllipseTippy from '~/components/EllipseTippy.vue';
  import SortingThead from '~/components/SortingThead.vue';
  import useCaseTable from '~/composables/useCaseTable';
  import useMoment from '~/composables/useMoment';
  import useTableSort from '~/composables/useTableSort';
  import StickyThead from '../StickyThead.vue';
  import { useLanguageStore } from '~/stores/language';

  const language = useLanguageStore();
  const signingData = await useCaseTable('signingList_mapList');
  const { sortName, isSortDesc, setSort } = useTableSort(signingData);
  const { getVNDate } = useMoment();
  const onClickApplyNo = (data) => {
    let flag = 'FLAG=0';

    if (data.APLY_STS == '20' || data.APLY_STS == '40' || data.APLY_STS == '45' || data.APLY_STS == '50' ) {
      flag += '&LINK_STATUS=' + data.APLY_STS;
    }
    window.open(`/servlet/HttpDispatcher/AAA4_0100/prompt?newTxRequest=true&${flag}&PROCESS_NUM=${data.APLY_NO}`);
  };
</script>
<style lang="scss"></style>
