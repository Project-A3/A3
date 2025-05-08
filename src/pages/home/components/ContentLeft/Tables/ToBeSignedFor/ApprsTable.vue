<template>
  <table class="table is-striped-odd is-fullwidth" id="dataTable">
    <StickyThead>
      <tr class="scroll-fix">
        <SortingThead sortKey="APLY_NO" :currentSortKey="sortName" :isSortDesc="isSortDesc" :onClickSort="setSort"
          >受理編號
        </SortingThead>
        <th>詢問項目</th>
        <th>事故人姓名</th>
        <th>醫師</th>
        <th class="has-text-centered">免會件</th>
        <th>釘選備註</th>
        <th class="has-text-centered">評分結案</th>
        <th class="has-text-centered">再次確認</th>
      </tr>
    </StickyThead>
    <tbody>
      <tr v-for="apprs in apprsData" :key="apprs.APLY_NO">
        <td width="165">
          <a href="#" @click.stop.prevent="onClickApplyNo(apprs)">{{ apprs.APLY_NO }}</a>
        </td>
        <td width="165">
          <a
            class="is-primary"
            :href="`/AHWeb/servlet/HttpDispatcher/AHG0_0300/query?APLY_NO=${apprs.APLY_NO}&APPRS_NO=${apprs.APPRS_NO}&SER_NO=${apprs.SER_NO}`"
            target="_blank"
            ><span class="font-eudc">{{ apprs.ITEM_NAME }}</span>
          </a>
        </td>
        <td class="limit-width w-105" width="101">
          <EllipseTippy :content="apprs.APPRS_NAME" class="font-eudc" displayBlock>{{ apprs.APPRS_NAME }}</EllipseTippy>
        </td>
        <td class="limit-width w-105" width="101">
          <EllipseTippy :content="apprs.DOCTOR_NAME" class="font-eudc" displayBlock>{{ apprs.DOCTOR_NAME }}</EllipseTippy>
        </td>
        <td class="has-left-border has-text-centered" width="101">
          <img v-if="apprs.UNAPRV === 'Y'" src="/src/assets/images/icon-checkmark-check.svg" alt="CHECKMARK" />
        </td>
        <td class="has-left-border limit-width w-330">
          <EllipseTippy v-if="apprs.PIN_MEMO != ''" :content="apprs.PIN_MEMO">
            <p class="note font-eudc">
              {{ apprs.PIN_MEMO }}
            </p>
          </EllipseTippy>
        </td>
        <td class="has-text-centered" width="104">
          <button @click="onClickScore(apprs)">
            <img src="/src/assets/images/icon-sign.svg" alt="SIGN" />
          </button>
        </td>
        <td class="has-text-centered" width="100">
          <button class="button" @click="onClickRecheck(apprs)" :disabled="apprs.UNAPRV === 'Y'">
            <img src="/src/assets/images/icon-back.svg" alt="BACK" />
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script setup>
  // 待簽收-醫鑑評分
  import EllipseTippy from '~/components/EllipseTippy.vue';
import SortingThead from '~/components/SortingThead.vue';
import useSwal from '~/composables/useSwal';
import useTableSort from '~/composables/useTableSort';
import { useHomeStore } from '~/stores/home';
import StickyThead from '../../StickyThead.vue';

  const homeStore = useHomeStore();
  const { $swal } = useSwal();
  const props = defineProps({
    signApprs_mapList: {
      type: Array,
      required: true,
      default: []
    }
  });

  const apprsData = reactive(props.signApprs_mapList);
  const { sortName, isSortDesc, setSort } = useTableSort(apprsData);

  const onClickApplyNo = (apprs) => {
    window.open(`/servlet/HttpDispatcher/AAE0_0500/prompt?LINK_PARAM=${apprs.APLY_NO}&OPEN_IMG=Y`);

    // location.href = `/AHWeb/servlet/HttpDispatcher/AHE0_0300/sign?APPRS_NO=${apprs.APPRS_NO}&SER_NO=${apprs.SER_NO}&APLY_NO=${apprs.APLY_NO}&IS_GRADE=${apprs.IS_GRADE}`;
    // window.open(
    //   `/AHWeb/servlet/HttpDispatcher/AHE0_0300/sign?APPRS_NO=${apprs.APPRS_NO}&SER_NO=${apprs.SER_NO}&APLY_NO=${apprs.APLY_NO}&IS_GRADE=${apprs.IS_GRADE}`
    // );
  };

  const onClickScore = (apprs) => {
    window.open(`/servlet/HttpDispatcher/AAZ3_0100/prompt?APLY_NO=${apprs.APLY_NO}`);
    location.href = `/AHWeb/servlet/HttpDispatcher/AHE0_0300/sign?APPRS_NO=${apprs.APPRS_NO}&SER_NO=${apprs.SER_NO}&APLY_NO=${apprs.APLY_NO}&IS_GRADE=${apprs.IS_GRADE}`;
  };

  // 再次確認(2022/08 新需求)
  const onClickRecheck = async (apprs) => {
    try {
      homeStore.showLoading();
      // 先呼叫再次確認API
      await homeStore.apprsRecheck(apprs);
      homeStore.hideLoading();
      // 再次確認成功的話就跳confirm alert
      const prompt = await $swal.getInstance().fire({
        title: '醫師再次確認原因',
        input: 'text',
        confirmButtonColor: '#6fba2a',
        confirmButtonText: '確定',
        showCancelButton: true,
        cancelButtonText: '取消',
        showLoaderOnConfirm: true,
        reverseButtons: true,
        preConfirm: (reason) => {
          apprs.MEMO = reason;
          return homeStore
            .apprsDoReturn(apprs)
            .then((response) => {
              return true;
            })
            .catch((error) => {
              $swal.getInstance().showValidationMessage(error);
            });
        }
      });
      // 點擊確認後API回傳成功
      if (prompt.isConfirmed && prompt.value) {
        // 重新取一次資料
        await homeStore.reloadCaseTable();
        $swal.success('操作成功');
      }
    } catch (e) {
      $swal.fail(e);
    } finally {
      homeStore.hideLoading();
    }
  };
</script>
<style lang="scss"></style>
