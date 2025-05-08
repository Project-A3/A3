<template>
  <table class="table is-striped-odd is-fullwidth" id="dataTable">
    <StickyThead>
      <tr class="scroll-fix">
        <SortingThead sortKey="APLY_NO" :currentSortKey="sortName" :isSortDesc="isSortDesc" :onClickSort="setSort"
          ><cathay-translate code="Component_InvsTable_001" />
        </SortingThead>
        <SortingThead sortKey="INVS_KIND" :currentSortKey="sortName" :isSortDesc="isSortDesc" :onClickSort="setSort"
          ><cathay-translate code="Component_InvsTable_002" />
        </SortingThead>
        <th><cathay-translate code="Component_InvsTable_003" /></th>
        <th><cathay-translate code="Component_InvsTable_004" /></th>
        <th class="has-text-centered"><cathay-translate code="Component_InvsTable_005" /></th>
      </tr>
    </StickyThead>
    <tbody>
      <tr v-for="invs in invsData" :key="invs.APLY_NO">
        <td style="width: 80px">
          {{ invs.APLY_NO }}
          <br />
          {{ language.translate('Common_Service_Center') + ':' + invs.ACCEPT_DIV_NAME }}
        </td>
        <td width="165">{{ language.translate('Common_' + invs.INVS_KIND) }}</td>
        <td v-html="invs.OCR_NAME" class="font-eudc" width="300"></td>
        <td class="limit-width w-330">
          <EllipseTippy v-if="invs.PIN_MEMO != ''" :content="invs.PIN_MEMO">
            <p class="note font-eudc">
              {{ invs.PIN_MEMO }}
            </p>
          </EllipseTippy>
        </td>
        <td class="has-text-centered" width="65">
          <button @click="onClickHandle(invs.APLY_NO)">
            <img src="/src/assets/images/icon-sign.svg" alt="SIGN" />
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script setup>
  import EllipseTippy from '~/components/EllipseTippy.vue';
  import SortingThead from '~/components/SortingThead.vue';
  import useTableSort from '~/composables/useTableSort';
  import StickyThead from '../../StickyThead.vue';
  import { useLanguageStore } from '~/stores/language';

  const language = useLanguageStore();
  const props = defineProps({
    signInvs_mapList: {
      type: Array,
      required: true,
      default: []
    }
  });

  const invsData = reactive(props.signInvs_mapList);
  const { sortName, isSortDesc, setSort } = useTableSort(invsData);
  const onClickHandle = (applyNo) => {
    window.open(`/servlet/HttpDispatcher/AHD0_2001/prompt?PROCESS_NUM=${applyNo}`);
  };
</script>
<style lang="scss"></style>
