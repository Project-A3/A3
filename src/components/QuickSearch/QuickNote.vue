<template>
  <div class="block quick-note-block" v-if="isPrincipal">
    <div class="block-content">
      <div class="block-title-inside">
        <p><cathay-translate code="Component_QuickNote_001" /></p>
        <BaseDropdown :options="dropdownOptions" :onSelected="onDropdownSelected"></BaseDropdown>
      </div>
      <textarea
        class="resize-vertical font-eudc"
        :placeholder="language.translate('Component_QuickNote_002')"
        rows="1"
        v-model="memo"
      ></textarea>
      <p class="has-text-danger" v-if="validationMessage != ''">{{ validationMessage }}</p>
      <button class="button is-primary button-add-note is-outline" @click="onClickCreate">
        <cathay-translate code="Component_QuickNote_003" />
      </button>
    </div>
  </div>
</template>
<script setup>
  import { cloneDeep, isEmpty } from 'lodash-es';
  import { storeToRefs } from 'pinia';
  import BaseDropdown from '~/components/BaseDropdown.vue';
  import useSwal from '~/composables/useSwal';
  import { useLanguageStore } from '~/stores/language';
  import { useQuickSearchStore } from '~/stores/quickSearch';

  const { $swal } = useSwal();
  const quickSearchStore = useQuickSearchStore();
  const { caseDetail, currentQuickSearchCaseDetail } = storeToRefs(quickSearchStore);
  const dropdownOptions = ref(cloneDeep(quickSearchStore.memoOptions));
  // 檢核訊息
  const validationMessage = ref('');
  const memo = ref('');
  const memoType = ref('');
  const language = useLanguageStore();

  watch(
    () => language.languages,
    async (newValue, oldValue) => {
      if (newValue !== oldValue) {
        dropdownOptions.value = cloneDeep(quickSearchStore.memoOptions);

        if (!isEmpty(validationMessage.value)) {
          if (isEmpty(memo.value)) {
            validationMessage.value = language.translate('Component_QuickNote_004'); // 不能為空白
          } else if (isEmpty(memoType.value)) {
            validationMessage.value = language.translate('Component_QuickNote_005'); // 請選擇備註類型
          }
        }
      }
    }
  );
  const isPrincipal = computed(() => caseDetail.value.MOD_MEMO === 'Y');
  const onDropdownSelected = (value) => {
    console.log(value);
    memoType.value = value;
  };

  const resetForm = () => {
    memo.value = '';
    memoType.value = '';
    dropdownOptions.value[0].selected = true;
  };

  const onClickCreate = async () => {
    if (isEmpty(memo.value)) {
      validationMessage.value = language.translate('Component_QuickNote_004'); // 不能為空白
      return;
    } else if (isEmpty(memoType.value)) {
      validationMessage.value = language.translate('Component_QuickNote_005'); // 請選擇備註類型
      return;
    }
    validationMessage.value = '';
    const result = await quickSearchStore.insertMemo(caseDetail.value.APLY_NO, memoType.value, memo.value);

    if (result.IS_SUCCESS) {
      $swal.success(language.translate('Component_QuickNote_006')); // 新增成功
      // 備註歷程要跟著變動
      currentQuickSearchCaseDetail.value.memo_mapList = result.memo_mapList;
      resetForm();
    } else {
      $swal.fail(language.translate('Component_QuickNote_007') + result.RTN_MSG); // 新增失敗，原因:
    }
    // $swal.success('新增成功');
  };
</script>
<style lang=""></style>
