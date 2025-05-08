<template>
  <Modal>
    <template v-slot:title><cathay-translate code="Component_EditNoteModal_001" /></template>
    <template v-slot:content>
      <BaseDropdown :options="dropdownOptions" :onSelected="onDropdownSelected" class="width-normal"></BaseDropdown>
      <textarea
        class="resize-vertical font-eudc"
        rows="5"
        :placeholder="language.translate('Component_EditNoteModal_002')"
        v-model="memoContent"
      ></textarea>
      <p class="has-text-danger">{{ inValidMessage }}</p>
    </template>
    <template v-slot:buttons>
      <button class="button is-light" @click="props.close"><cathay-translate code="Component_EditNoteModal_003" /></button>
      <button class="button is-primary" @click="onSubmit"><cathay-translate code="Component_EditNoteModal_004" /></button>
    </template>
  </Modal>
</template>
<script setup>
  import { cloneDeep } from 'lodash-es';
  import { storeToRefs } from 'pinia';
  import Modal from '~/components/Modal.vue';
  import BaseDropdown from '~/components/BaseDropdown.vue';
  import useSwal from '~/composables/useSwal';
  import { useQuickSearchStore } from '~/stores/quickSearch';
  import { useHomeStore } from '~/stores/home';
  import { useLanguageStore } from '~/stores/language';

  const language = useLanguageStore();
  const homeStore = useHomeStore();
  const { $swal } = useSwal();
  const quickSearchStore = useQuickSearchStore();
  const { currentQuickSearchCaseDetail } = storeToRefs(quickSearchStore);
  const route = useRoute();
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
  const applyNo = props.data?.applyNo;
  const memo = props.data?.memo;

  const selectedMemoType = ref(memo.MEMO_TYPE);
  const memoContent = ref(memo.MEMO_CONTENT);
  const inValidMessage = ref('');

  // deep copy
  const dropdownOptions = cloneDeep(quickSearchStore.memoOptions);
  dropdownOptions.forEach((d) => {
    if (d.value === memo.MEMO_TYPE) {
      dropdownOptions.shift();
      d.selected = true;
    }
  });

  const onDropdownSelected = (value) => {
    // console.log(value);
    selectedMemoType.value = value;
  };

  const onSubmit = async () => {
    if (selectedMemoType.value == '') {
      inValidMessage.value = language.translate('Component_EditNoteModal_005');
    } else if (memoContent.value == '') {
      inValidMessage.value = language.translate('Component_EditNoteModal_006');
    } else {
      inValidMessage.value = '';
      const result = await quickSearchStore.updateMemo(applyNo, memo.MEMO_NO, selectedMemoType.value, memoContent.value);
      if (result.IS_SUCCESS) {
        props.close();
        // 將畫面上的備註更新
        currentQuickSearchCaseDetail.value.memo_mapList = result.memo_mapList;
        // 如果是個人化首頁以及修改的是釘選備註，左邊表格資料要更新
        if (route.name === 'home' && memo.IS_PIN === 'Y') {
          if (homeStore.currentWaitApproveType === '') {
            homeStore.reloadCaseTable();
          } else {
            let caseInTable = homeStore.currentWaitTableData.find((e) => e.APLY_NO === applyNo);
            if (caseInTable) caseInTable.PIN_MEMO = memoContent.value;
          }
        }
        $swal.success(language.translate('Component_EditNoteModal_007'));
      } else {
        $swal.fail(`修改備註失敗，原因${result.RTN_MSG}`);
      }
    }
  };
</script>
<style lang="scss" scoped>
  .width-normal {
    position: absolute;
  }
  .resize-vertical {
    margin-top: 80px;
  }
</style>
