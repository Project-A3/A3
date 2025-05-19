<template>
  <Modal disableOverflow>
    <template v-slot:title><cathay-translate code="Page_AccidentReasonModal_001"/></template>
    <template v-slot:content>
      <BaseDropdown :options="accidentTypes" :onSelected="onTypeSelected"></BaseDropdown>
      <div class="modal-table">
        <table class="table is-striped-odd is-fullwidth tr-can-click">
          <thead>
            <tr>
              <th class="has-text-centered ver-middle"><cathay-translate code="Page_AccidentReasonModal_008"/></th>
              <th class="ver-middle"><cathay-translate code="Page_AccidentReasonModal_009"/></th>
              <th class="ver-middle"><cathay-translate code="Page_AccidentReasonModal_010"/></th>
              <th class="has-text-centered ver-middle"><cathay-translate code="Page_AccidentReasonModal_011"/></th>
              <th></th>
            </tr>
          </thead>
          <tbody v-if="hasData">
            <tr
              v-for="(reason, index) in currentData"
              @click="onClickReason(reason.ACCIDENT_REASON_CODE, reason.ACCIDENT_NAME)"
            >
              <td class="has-text-centered w-5">{{ index + currentPageIndex.start }}</td>
              <td class="w-11 font-eudc">{{ reason.OCR_KIND_NAME }}</td>
              <td class="has-border-right font-eudc" style="width: 70%">{{ reason.ACCIDENT_NAME }}</td>
              <td class="has-text-centered">{{ reason.ACCIDENT_REASON_CODE }}</td>
              <td class="has-text-centered">
                <div class="radio-group">
                  <input type="radio" class="radio-input" id="4" :checked="reason.ACCIDENT_REASON_CODE === selectedReason.code" />
                  <label for="4" class="radio-label is-dark">
                    <span class="radio-button"></span>
                  </label>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Pagination & Info  -->
      <div class="number-of-data-info" v-if="hasData">
        <cathay-translate code="Component_Pagination_003" /><span>{{ currentPageIndex.start }}</span
        >-<span>{{ currentPageIndex.end }}</span
        ><cathay-translate code="Component_Pagination_004" /><span>{{ totalCounts }}</span
        ><cathay-translate code="Component_Pagination_005" />
      </div>
      <Pagination
        :total="totalCounts"
        :pageSize="pageSize"
        :currentPage="currentPage"
        @onPageChanged="onPageChanged"
      ></Pagination>
    </template>
    <template v-slot:buttons>
      <button class="button is-light" @click="props.close"><cathay-translate code="Page_AccidentReasonModal_013"/></button>
      <a href="#" class="clear-modal" @click.stop.prevent="emitEvent.clearValue"><cathay-translate code="Page_AccidentReasonModal_012"/></a>
    </template>
  </Modal>
</template>
<script setup>
  import Modal from '~/components/Modal.vue';
  import BaseDropdown from '~/components/BaseDropdown.vue';
  import { useApplyStore } from '~/stores/apply';
  import useSwal from '~/composables/useSwal';
  import usePagination from '~/composables/usePagination';
  import Pagination from '~/components/Pagination.vue';
  import { isEmpty } from 'lodash-es';
  import { useLanguageStore } from '~/stores/language';
  const language = useLanguageStore();
  const { $swal } = useSwal();
  const applyStore = useApplyStore();
  const props = defineProps({
    data: {
      type: Object,
      required: true,
      default: {}
    },
    close: {
      type: Function,
      required: false,
      default: () => console.log('close modal!')
    }
  });

  // 事故分類下拉選單選項
  const accidentTypes = [
    {
      name: language.translate('Page_AccidentReasonModal_002'),
      value: '',
      selected: true,
      disabled: true
    },
    {
      name: language.translate('Page_AccidentReasonModal_003'),
      value: 'A'
    },
    {
      name: language.translate('Page_AccidentReasonModal_004'),
      value: 'B'
    },
    {
      name: language.translate('Page_AccidentReasonModal_005'),
      value: 'C'
    },
    {
      name: language.translate('Page_AccidentReasonModal_006'),
      value: 'D'
    },
    {
      name: language.translate('Page_AccidentReasonModal_007'),
      value: 'E'
    }
  ];

  // 分頁相關
  const { totalCounts, pageSize, currentData, currentPage, currentPageIndex, hasData, onPageChanged, setPageData } =
    usePagination();

  // 下拉選單選擇時Call API
  const onTypeSelected = async (value) => {
    if (value != '') {
      try {
        selectedReason.code = '';
        selectedReason.name = '';
        applyStore.showLoading();
        let result = await applyStore.getAccidentReasons(value);
        setPageData(result.OCR_RESN_LIST);
      } catch (e) {
        $swal.fail(e);
      } finally {
        applyStore.hideLoading();
      }
    }
  };

  // 最後選擇的事故原因
  const selectedReason = reactive({ code: '', name: '' });

  // 點擊表格內的原因
  const onClickReason = (resn, resnName) => {
    selectedReason.code = resn;
    selectedReason.name = resnName;
    onClickConfirm();
  };

  const isConfirmDisabled = computed(() => isEmpty(selectedReason.code) || isEmpty(selectedReason.name));
  // 選擇完事故原因後點擊確認
  const emitEvent = props.data.emitEvents;
  const onClickConfirm = () => {
    // 更新資料
    emitEvent.updateValue(selectedReason.code);
    emitEvent.updateValue2(selectedReason.name);
    emitEvent.updateText(selectedReason.code);
    emitEvent.updateText2(selectedReason.name);
    // 關閉Modal
    props.close();
  };
</script>
<style lang="scss"></style>
