<template>
  <Modal>
    <template v-slot:title></template>
    <template v-slot:content>
      <div class="flex-box">
        <div class="flex-left">
          <ul id="accordion" class="accordion">
            <li v-for="level1 in ICDClasses">
              <div class="link">
                <span class="font-eudc">{{ level1.ICD_NAME_LV1 }}</span><img
                  src="/src/assets/images/icon-arrow-down-grey.svg" alt="ARROW" />
              </div>
              <ul class="submenu">
                <li v-for="level2 in level1.ICD_LEVEL2">
                  <a href="javascript:void(0)" :class="{ 'is-active': selectedLevel2ICDName === level2.ICD_NAME_LV2 }"
                    @click.prevent="onClickLevel2(level2.ICD_CODE_S, level2.ICD_CODE_E)"><span class="font-eudc">{{
                      level2.ICD_NAME_LV2
                    }}</span></a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <div class="flex-right">
          <div class="columns">
            <div class="column is-6 ver-center">
              <span class="field">Tên bệnh</span>
              <span class="data">
                <input class="input search-input w-280 font-eudc" type="search" v-model="icdNameIndex" />
              </span>
            </div>
            <div class="column is-6 ver-center">
              <span class="field">Mã bệnh</span>
              <span class="data">
                <input class="input search-input w-160" type="search" v-model="icdCode" />
                <button class="button is-primary search-btn" @click="onClickButtonFind"><cathay-translate
                    code="Page_OperationModal_004" /></button>
              </span>
            </div>
          </div>
          <!-- <div class="memo">(若多個請以逗號間隔)</div> -->

          <!-- Table -->
          <div class="modal-table">
            <table class="table is-fullwidth is-striped-odd tr-can-click">
              <thead class="is-sticky">
                <tr>
                  <th class="has-text-centered w-6percent is-vcentered">STT</th>
                  <th class="is-vcentered">Bệnh thần kinh</th>
                  <th class="is-vcentered">Bệnh ung thư</th>
                  <th class="is-vcentered">Tên bệnh</th>
                  <th class="is-vcentered">Mã bệnh</th>
                  <!-- <th>健保平均<br />住院日數</th>
                  <th class="is-vcentered w-10percent">公司平均<br />住院日數</th> -->
                </tr>
              </thead>
              <tbody v-if="searchResult.length > 0">
                <tr v-for="(icd, index) in searchResult" :class="{ selected: selectedICD.code === icd.ICD_CODE }"
                  :key="icd.ICD_CODE" @click="onClickICD(icd.ICD_CODE, icd.DISEASE)">
                  <td class="has-text-centered">{{ index + 1 }}</td>
                  <td>{{ icd.PSYCHIATRIC_FLAG === 'Y' ? 'Có' : '' }}</td>
                  <td>{{ icd.CANCER_FLAG === 'Y' ? 'Có' : '' }}</td>
                  <td class="font-eudc">{{ icd.DISEASE }}</td>
                  <td>
                    <a href="javascript:void(0)">{{ icd.ICD_CODE }}</a>
                    <!-- <a href="javascript:void(0)" :class="{ 'is-active': selectedLevel2ICDName === level2.ICD_NAME_LV2 }"
                      @click.prevent="onClickLevel2(level2.ICD_CODE_S, level2.ICD_CODE_E)"><span class="font-eudc">{{
                        level2.ICD_NAME_LV2
                        }}</span></a> -->
                  </td>
                  <!-- <td>{{ icd.HINS_AVG_DAY }}</td>
                  <td class="has-text-centered">{{ icd.CTHY_AVG_DAY }}</td> -->
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:buttons>
      <button class="button is-light" @click="props.close"><cathay-translate
          code="Page_ClaimCatogoryModal_002" /></button>
      <a href="#" class="clear-modal" @click.stop.prevent="emitEvent.clearValue"><cathay-translate
          code="Component_BaseDropDown_001" /></a>
      <!-- <button class="button is-primary" :disabled="isConfirmDisabled" @click="onClickConfirm">確認</button> -->
    </template>
  </Modal>
</template>
<script setup>
import { nextTick } from 'vue';
import Modal from '~/components/Modal.vue';
import useSwal from '../../../../../composables/useSwal';
import { useApplyStore } from '../../../../../stores/apply';
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

// 疾病分類
const ICDClasses = reactive([]);
//#region 取得疾病分類
const getICDClasses = async () => {
  applyStore.showLoading();
  try {
    let icds = await applyStore.getICDClasses();
    ICDClasses.push(...icds);
    await nextTick();
    bindAccordion();
  } catch (e) {
    $swal.fail(e);
  } finally {
    applyStore.hideLoading();
  }
};
getICDClasses();
//#endregion

// 搜尋結果
const searchResult = ref([]);
// 疾病名稱索引
const icdNameIndex = ref('');
// 疾病代碼
const icdCode = ref('');
// 左側選單選擇的疾病類別(第二層)
const selectedLevel2ICDName = ref('');
const selectedicdCodeStart = ref('');
const selectedicdCodeEnd = ref('');

// 點擊左側選單第二層
const onClickLevel2 = (icdCodeStart, icdCodeEnd) => {
  selectedicdCodeStart.value = icdCodeStart;
  selectedicdCodeEnd.value = icdCodeEnd;
  onClickSearch();
};

const onClickButtonFind = () => {
  selectedicdCodeStart.value = '';
  selectedicdCodeEnd.value = '';
  onClickSearch();
}

// 最後選擇的疾病
const selectedICD = reactive({ code: '', name: '' });

const onClickICD = (code, name) => {
  console.log("selectedICD", code, name);
  selectedICD.code = code;
  selectedICD.name = name;
  onClickConfirm();
};

const isConfirmDisabled = computed(() => selectedICD.code == '' || selectedICD.name == '');

// 查詢
const onClickSearch = async () => {
  applyStore.showLoading();
  try {
    const result = await applyStore.searchICD(selectedicdCodeStart.value, selectedicdCodeEnd.value, icdNameIndex.value, icdCode.value);
    searchResult.value = result;
  } catch (e) {
    $swal.fail(e);
  } finally {
    applyStore.hideLoading();
  }
};

// 選擇疾病後點擊確認
const emitEvent = props.data.emitEvents;
const onClickConfirm = () => {
  if (selectedICD.code === '' || selectedICD.name === '') {
    $swal.warning('請選擇一種疾病');
    return;
  }

  // 更新資料
  emitEvent.updateText(selectedICD.code);
  emitEvent.updateValue(selectedICD.code);
  emitEvent.updateText2(selectedICD.name);

  props.close();
};

const bindAccordion = () => {
  let accordion = document.getElementById('accordion');
  const slideDown = (elem) => (elem.style.height = `${elem.scrollHeight + 20}px`);
  const slideUp = (elem) => (elem.style.height = `0px`);
  accordion.querySelectorAll('.link').forEach((element) => {
    element.addEventListener('click', (e) => {
      let activeLi = accordion.querySelector('li.open');
      let li = e.currentTarget.closest('li');
      if (activeLi) {
        // slideUp(activeLi);
        activeLi.classList.remove('open', 'default');
        slideUp(activeLi.querySelector('.submenu'));
        if (activeLi == li) return;
      }
      li.classList.add('open', 'default');
      slideDown(e.currentTarget.nextElementSibling);
    });
  });
};
</script>
<style lang="scss"></style>
