<!-- 重大疾病項目 -->
<template>
  <Modal>
    <template v-slot:title>修改重大疾病項目</template>
    <template v-slot:content>
      <div class="columns is-multiline">
        <div v-for="(cat, index) in heavyDisbList" class="column is-6" :key="cat.DIS_CODE">
          <label class="is-flex">
            <!-- <input type="checkbox" :value="cat.DISB_CAT" v-model="checkedClaimCats" /> -->
            <div class="radio-group">
              <input :id="`hd_C${index}`" type="radio" class="radio-input" :value="cat.DIS_CODE" v-model="checkedItem" />
              <label :for="`hd_C${index}`" class="radio-label is-dark">
                <span class="radio-button"></span>
              </label>
            </div>
            <span class="ml-3 font-eudc">{{ cat.DIS_NAME }}</span>
          </label>
        </div>
      </div>
    </template>
    <template v-slot:buttons>
      <button class="button is-light" @click="props.close">取消</button>
      <a href="#" class="clear-modal" @click.stop.prevent="emitEvent.clearValue">清除</a>
    </template>
  </Modal>
</template>
<script setup>
  import useSwal from '~/composables/useSwal';
  import Modal from '~/components/Modal.vue';
  import { useApplyStore } from '~/stores/apply';
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
  const heavyDisbList = ref([]);
  try {
    applyStore.showLoading();
    heavyDisbList.value = await applyStore.getHeavyDisabilityList();
  } catch (e) {
    $swal.fail(e);
  } finally {
    applyStore.hideLoading();
  }

  // 勾選的疾病項目
  const checkedItem = ref(props.data.models.value);
  // 勾選的疾病項目中文
  const checkedItemName = computed(() => heavyDisbList.value.find((e) => e.DIS_CODE === checkedItem.value)?.DIS_NAME ?? '');
  console.log(props.data);
  const emitEvent = props.data.emitEvents;
  const onSubmit = () => {
    emitEvent.updateValue(checkedItem.value);
    emitEvent.updateText(checkedItemName.value);
    props.close();
  };

  watch(checkedItem, () => {
    onSubmit();
  });
</script>
<style lang="scss"></style>
