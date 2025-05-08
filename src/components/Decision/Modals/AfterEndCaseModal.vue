<template>
  <Modal minify="請承辦於結案後處理">
    <template v-slot:title>請承辦於結案後處理 (可複選)</template>
    <template v-slot:content>
      <div class="columns is-multiline">
        <div class="column is-6" v-for="item in endItemList">
          <label class="is-secondary">
            <input type="checkbox" :value="item.END_ITEM_CODE" :checked="item.IS_CHECKED" @change="onCheckboxChanged" />
            <span>{{ item.END_ITEM_NAME }}</span>
            <input type="text" class="is-underline font-eudc" v-if="item.IS_INPUT === 'Y'" v-model="item.INPUT_VALUE" maxlength="150" />
          </label>
        </div>
      </div>
    </template>
    <template v-slot:buttons>
      <button class="button is-secondary is-outline" @click="props.close">取消</button>
      <button class="button is-secondary" @click="onClickSubmit">新增</button>
    </template>
  </Modal>
</template>

<script setup>
  import { cloneDeep, remove } from 'lodash-es';
  import Modal from '~/components/Modal.vue';
  import { useDecisionStore } from '~/stores/decision';
  const decisionStore = useDecisionStore();

  const endItemList = ref(cloneDeep(decisionStore.signInitData?.END_ITEM_LIST));

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
  const onCheckboxChanged = (event) => {
    console.log(event.target.checked);
    console.log(event.target.value);
    let findItem = endItemList.value.find((item) => item.END_ITEM_CODE === event.target.value);
    if (findItem) {
      findItem.IS_CHECKED = event.target.checked;
      if (!findItem.IS_CHECKED) findItem.INPUT_VALUE = ''; // 清掉輸入框內的文字
    }
  };


  const onClickSubmit = () => {
    decisionStore.signInitData.END_ITEM_LIST = endItemList.value;
    props.data.emitEvent.submit(endItemList.value.filter(e => e.IS_CHECKED));
    props.close();
  };
</script>

<style lang="scss" scoped></style>
