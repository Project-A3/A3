<template>
  <button :class="renderClass" @click="handleClick">
    <cathay-translate :code="text" /><span>{{ count }}</span>
  </button>
</template>
<script setup>
  import { useHomeStore } from '~/stores/home';
  import { CaseTablesType } from '../../../../common/utils/enum';

  const homeStore = useHomeStore();
  const props = defineProps({
    // 文字
    text: {
      type: String,
      required: true,
      default: ''
    },
    // 件數
    count: {
      type: [Number, String],
      required: true,
      default: 0
    },
    // 是否為目前篩選條件
    isSelected: {
      type: Boolean,
      required: false,
      default: false
    },
    // 查詢類型(表格類型)
    caseTablesType: {
      type: String,
      default: '',
      required: false
    },
    // 待核定/待簽擬類型
    waitApproveType: {
      type: String,
      default: '',
      required: false
    }
  });

  const count = toRef(props, 'count');
  const text = toRef(props, 'text');
  const selected = toRef(props, 'isSelected');
  const renderClass = computed(() => {
    return {
      'primary-button-light': true,
      disabled:
        count.value == 0 &&
        props.caseTablesType !== CaseTablesType.EndCase &&
        props.caseTablesType !== CaseTablesType.TempEndCase,
      selected: selected.value
    };
  });

  const handleClick = () => {
    if (!renderClass.value.disabled) {
      homeStore.changeCaseTable(props.waitApproveType, props.caseTablesType);
    }
  };
  defineExpose({
    text,
    count,
    renderClass,
    handleClick
  });
</script>
<style lang=""></style>
