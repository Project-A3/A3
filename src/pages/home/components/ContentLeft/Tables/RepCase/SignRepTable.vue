<template>
  <table class="table is-striped-odd is-fullwidth" id="dataTable">
    <StickyThead>
      <tr class="scroll-fix">
        <SortingThead sortKey="APLY_NO" :currentSortKey="sortName" :isSortDesc="isSortDesc" :onClickSort="setSort"
          ><cathay-translate code="Component_RepTable_001" />
        </SortingThead>
        <th><cathay-translate code="Component_RepTable_002" /></th>
        <th><cathay-translate code="Component_RepTable_003" /></th>
        <th><cathay-translate code="Component_RepTable_004" /></th>
        <th class="has-text-centered"><cathay-translate code="Component_RepTable_005" /></th>
      </tr>
    </StickyThead>
    <tbody>
      <tr v-for="rep in repData" :key="rep.APLY_NO">
        <td style="width: 80px">
          <a href="#" @click.stop.prevent="onClickApplyNo(rep.APLY_NO)">{{ rep.APLY_NO }}</a>
          <br />
          {{ language.translate('Common_Service_Center') + ':' + rep.ACCEPT_DIV_NAME }}
        </td>
        <td class="limit-width w-105" width="200">
          <EllipseTippy :content="rep.OCR_NAME" class="font-eudc" displayBlock>{{ rep.OCR_NAME }}</EllipseTippy>
        </td>
        <td class="limit-width w-105" width="200">
          <EllipseTippy :content="rep.TRAN_NAME" class="font-eudc" displayBlock>{{ rep.TRAN_NAME }}</EllipseTippy>
        </td>
        <td class="limit-width w-330">
          <EllipseTippy v-if="rep.PIN_MEMO != ''" :content="rep.PIN_MEMO">
            <p class="note font-eudc">
              {{ rep.PIN_MEMO }}
            </p>
          </EllipseTippy>
        </td>
        <td class="has-text-centered" width="65">
          <button @click.stop.prevent="onClickHandle(rep.APLY_NO)">
            <img src="/src/assets/images/icon-sign.svg" alt="SIGN" />
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script setup>
  // 待簽收-補全簽收
  import EllipseTippy from '~/components/EllipseTippy.vue';
  import SortingThead from '~/components/SortingThead.vue';
  import useTableSort from '~/composables/useTableSort';
  import StickyThead from '../../StickyThead.vue';
  import { useLanguageStore } from '~/stores/language';
  
  const language = useLanguageStore();
  const props = defineProps({
    signRep_mapList: {
      type: Array,
      required: true,
      default: []
    }
  });

  const repData = reactive(props.signRep_mapList);
  const { sortName, isSortDesc, setSort } = useTableSort(repData);

  const onClickApplyNo = (applyNo) => {
    window.open(`/servlet/HttpDispatcher/AAB4_0500/prompt?PROCESS_NUM=${applyNo}`);
  };

  const onClickHandle = (applyNo) => {
    window.open(`/servlet/HttpDispatcher/AAB4_0531/prompt?PROCESS_NUM=${applyNo}`);
  };
</script>
<style lang="scss"></style>
