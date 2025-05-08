<template>
  <table class="table is-striped-odd is-fullwidth" id="dataTable">
    <StickyThead>
      <tr class="scroll-fix">
        <SortingThead sortKey="APLY_NO" :currentSortKey="sortName" :isSortDesc="isSortDesc" :onClickSort="setSort"
          >受理編號
        </SortingThead>
        <th>事故人姓名</th>
        <th>時效起日</th>
        <th>保單號碼</th>
        <SortingThead sortKey="PROC_DATE" :currentSortKey="sortName" :isSortDesc="isSortDesc" :onClickSort="setSort"
          >處理日期
        </SortingThead>
        <th>釘選備註</th>
        <th class="has-text-centered">刪除</th>
      </tr>
    </StickyThead>
    <tbody>
      <tr v-for="memo in memoData" :key="memo.APLY_NO">
        <td width="165">
          <a href="#" @click.stop.prevent="onClickApplyNo(memo)">{{ memo.APLY_NO }}</a>
        </td>
        <td width="106" class="limit-width w-105">
          <EllipseTippy :content="memo.OCR_NAME" class="font-eudc" displayBlock>{{ memo.OCR_NAME }}</EllipseTippy>
        </td>
        <td width="126">{{ memo.STR_DATE }}</td>
        <td width="165">{{ memo.POLICY_NO }}</td>
        <td width="116">{{ getROCDate(memo.PROC_DATE) }}</td>
        <td class="limit-width w-330">
          <EllipseTippy v-if="memo.CASE_TAG != ''" :content="memo.CASE_TAG.replaceAll('_', '，')" displayBlock>
            <div class="tag-container limit-width w-300">
              <span v-for="tag in memo.CASE_TAG.split('_')" class="tag is-orange font-eudc">
                {{ tag }}
              </span>
            </div>
          </EllipseTippy>
          <EllipseTippy v-if="memo.PIN_MEMO != ''" :content="memo.PIN_MEMO">
            <p class="note font-eudc">
              {{ memo.PIN_MEMO }}
            </p>
          </EllipseTippy>
        </td>
        <td class="has-text-centered" width="65">
          <button @click="onClickDelete(memo)" v-if="memo.IS_DELETE === 'Y'">
            <img src="/src/assets/images/icon-trash.svg" alt="TRASH" />
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script setup>
  import { pull } from 'lodash-es';
import { storeToRefs } from 'pinia';
import EllipseTippy from '~/components/EllipseTippy.vue';
import SortingThead from '~/components/SortingThead.vue';
import useMoment from '~/composables/useMoment';
import useSwal from '~/composables/useSwal';
import useTableSort from '~/composables/useTableSort';
import { useHomeStore } from '~/stores/home';
import StickyThead from '../../StickyThead.vue';

  const { $swal } = useSwal();
  const homeStore = useHomeStore();
  const { dataCnt } = storeToRefs(homeStore);
  const { getROCDate } = useMoment();
  // 解除契約-待備註處理件
  const props = defineProps({
    cnclMemo_mapList: {
      type: Array,
      required: true,
      default: []
    }
  });

  const memoData = reactive(props.cnclMemo_mapList);
  const { sortName, isSortDesc, setSort } = useTableSort(memoData);

  const onClickApplyNo = async (processMemo) => {
    location.href = `/servlet/HttpDispatcher/AAK0_0401/query?newTxRequest=false&syscode=AA&subcode=AAK0&APLY_NO=${processMemo.APLY_NO}&POLICY_NO=${processMemo.POLICY_NO}&Link=AAK00400`;
    // location.href = `/AAWeb/servlet/HttpDispatcher/AAK0_0400/prompt?LINK_INPUT_ID=${homeStore.userInfo.EMP_ID}`;
    // window.open(`/AAWeb/servlet/HttpDispatcher/AAK0_0400/prompt?LINK_INPUT_ID=${homeStore.userInfo.EMP_ID}`);
  };

  const onClickDelete = async (deleteMemo) => {
    try {
      let r = await $swal.confirmAsync('是否確認刪除?');
      if (r.isConfirmed) {
        homeStore.showLoading();

        await homeStore.delRelieveRmk([deleteMemo.APLY_NO, deleteMemo.POLICY_NO, deleteMemo.SER_NO]);
        
        // 從畫面上刪除
        pull(memoData, deleteMemo);

        // [其他]區塊數量減少
        dataCnt.value.decdCnt_map.CNCL_POLICY_CNT --;

        $swal.success('刪除成功');
      }
    } catch (e) {
      $swal.fail(e);
    } finally {
      homeStore.hideLoading();
    }
  };
</script>
