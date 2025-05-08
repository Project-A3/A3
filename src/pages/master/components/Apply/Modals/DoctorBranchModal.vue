<template>
  <Modal disableOverflow>
    <template v-slot:title>醫生科別</template>
    <template v-slot:content>
      <BaseDropdown
        class="height-limit"
        :isLoading="isDropdownLoading"
        :options="mainDepOptions"
        :onSelected="onDepSelected"
      ></BaseDropdown>
      <div class="modal-table">
        <table class="table is-striped-odd is-fullwidth tr-can-click">
          <thead>
            <tr>
              <th class="has-text-centered ver-middle">序號</th>
              <th class="ver-middle">主科別中文</th>
              <th class="ver-middle has-text-centered">主科別代號</th>
              <th class="ver-middle">次科別中文</th>
              <th class="ver-middle has-text-centered">次科別代碼</th>
              <th></th>
            </tr>
          </thead>
          <tbody v-if="hasData">
            <tr
              v-for="(dep, index) in currentData"
              :class="{ checked: dep.MAIN_DEP_CODE === selectedDep.mainDepCode && dep.SUB_DEP_CODE === selectedDep.subDepCode }"
              @click="onClickDep(dep.MAIN_DEP_CODE, dep.SUB_DEP_CODE, dep.MAIN_DEP_NAME, dep.SUB_DEP_NAME)"
            >
              <td class="has-text-centered w-5">{{ index + currentPageIndex.start }}</td>
              <td class="font-eudc">{{ dep.MAIN_DEP_NAME }}</td>
              <td class="has-text-centered">{{ dep.MAIN_DEP_CODE }}</td>
              <td class="font-eudc">{{ dep.SUB_DEP_NAME }}</td>
              <td class="has-text-centered">{{ dep.SUB_DEP_CODE }}</td>
              <td class="has-text-centered">
                <div class="radio-group">
                  <input
                    type="radio"
                    class="radio-input"
                    id="4"
                    :checked="dep.MAIN_DEP_CODE === selectedDep.mainDepCode && dep.SUB_DEP_CODE === selectedDep.subDepCode"
                  />
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
        顯示<span>{{ currentPageIndex.start }}</span
        >-<span>{{ currentPageIndex.end }}</span
        >則內容，共<span>{{ totalCounts }}</span
        >則
      </div>
      <Pagination
        :total="totalCounts"
        :pageSize="pageSize"
        :currentPage="currentPage"
        @onPageChanged="onPageChanged"
      ></Pagination>
    </template>
    <template v-slot:buttons>
      <button class="button is-light" @click="props.close">取消</button>
      <a href="#" class="clear-modal" @click.stop.prevent="emitEvent.clearValue">清除</a>
    </template>
  </Modal>
</template>
<script setup>
  import Modal from '~/components/Modal.vue';
  import BaseDropdown from '~/components/BaseDropdown.vue';
  import { useApplyStore } from '../../../../../stores/apply';
  import useSwal from '../../../../../composables/useSwal';
  import usePagination from '../../../../../composables/usePagination';
  import Pagination from '../../../../../components/Pagination.vue';
  import { isEmpty } from 'lodash';
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

  // 主科別
  const mainDepOptions = [
    {
      name: '請選擇',
      value: '',
      selected: true,
      disabled: true
    }
  ];
  const isDropdownLoading = ref(false);
  //#region 取得主科別
  const getMainDeps = async () => {
    isDropdownLoading.value = true;
    try {
      let deps = await applyStore.getOpMainDeps();
      deps.forEach((dep) => {
        mainDepOptions.push({
          name: dep.MAIN_DEP_NAME,
          value: dep.MAIN_DEP_CODE
        });
      });
    } catch (e) {
      $swal.fail(e);
    } finally {
      isDropdownLoading.value = false;
    }
  };
  getMainDeps();
  //#endregion

  // 分頁相關
  const { totalCounts, pageSize, currentData, currentPage, currentPageIndex, hasData, onPageChanged, setPageData } =
    usePagination();

  // 下拉選單選擇時Call API
  const onDepSelected = async (value) => {
    if (value != '') {
      try {
        selectedDep.mainDepCode = '';
        selectedDep.subDepCode = '';
        selectedDep.mainDepName = '';
        selectedDep.subDepsubDepNameCode = '';

        applyStore.showLoading();
        let result = await applyStore.getOpSubDeps(value);
        setPageData(result);
      } catch (e) {
        $swal.fail(e);
      } finally {
        applyStore.hideLoading();
      }
    }
  };

  // 最後選擇的事故原因
  const selectedDep = reactive({ mainDepCode: '', subDepCode: '', mainDepName: '', subDepName: '' });

  // 點擊表格內的原因
  const onClickDep = (mainDepCode, subDepCode, mainDepName, subDepName) => {
    selectedDep.mainDepCode = mainDepCode;
    selectedDep.subDepCode = subDepCode;
    selectedDep.mainDepName = mainDepName;
    selectedDep.subDepName = subDepName;
    onClickConfirm();
  };

  const isConfirmDisabled = computed(() => isEmpty(selectedDep.mainDepCode) || isEmpty(selectedDep.subDepCode));
  // 選擇完事故原因後點擊確認
  const emitEvent = props.data.emitEvents;
  const onClickConfirm = () => {
    // 更新資料
    emitEvent.updateValue(selectedDep.mainDepCode);
    emitEvent.updateValue2(selectedDep.subDepCode);
    emitEvent.updateText(selectedDep.mainDepName);
    emitEvent.updateText2(selectedDep.subDepName);
    // 關閉Modal
    props.close();
  };
</script>
<style lang="scss"></style>
