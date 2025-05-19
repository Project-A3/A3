<template>
  <Modal>
    <template v-slot:title><cathay-translate code="Page_OperationModal_001"/></template>
    <template v-slot:content>
      <!-- Info-->
      <div class="data-horizontal-info">
        <div class="columns">
          <div class="column is-6 ver-center">
            <span class="data cursor-pointer" @click="onCheckDiv" style="margin-right: 10px">
              <img
                v-if="isCheckDiv"
                src="/src/assets/images/checkbox-checked.svg"
                alt="CHECKMARK"
                style="position: relative; bottom: -3.5px"
              />
              <img v-else src="/src/assets/images/checkbox-off.svg" alt="CHECKMARK" style="position: relative; bottom: -3.5px" />
            </span>
            <span class="field"><cathay-translate code="Page_OperationModal_002"/></span>
            <span class="data">
              <FormDropdown :options="areaOptions" class="w-260 height-limit" v-model="opArea"></FormDropdown>
            </span>
          </div>
        </div>
        <div class="columns">
          <div class="column is-6 ver-center">
            <span class="field"><cathay-translate code="Page_OperationModal_036"/></span>
            <span class="data">
              <FormDropdown :options="gradeOptions" class="w-260 height-limit" v-model="opGrade"></FormDropdown>
            </span>
          </div>
        </div>
        <div class="columns">
          <div class="column is-6 ver-center">
            <span class="field"><cathay-translate code="Page_OperationModal_038"/></span>
            <span class="data">
              <FormDropdown :options="cancerOptions" class="w-260 height-limit" v-model="opCancer"></FormDropdown>
            </span>
          </div>
        </div>
        <div class="columns">
          <div class="column is-6 ver-center">
            <span class="data cursor-pointer" @click="onCheckName" style="margin-right: 10px">
              <img
                v-if="isCheckName"
                src="/src/assets/images/checkbox-checked.svg"
                alt="CHECKMARK"
                style="position: relative; bottom: -3.5px"
              />
              <img v-else src="/src/assets/images/checkbox-off.svg" alt="CHECKMARK" style="position: relative; bottom: -3.5px" />
            </span>
            <span class="field"><cathay-translate code="Page_OperationModal_003"/></span>
            <span class="data">
              <input class="input search-input font-eudc" type="search" v-model="opName" />
            </span>
          </div>
          <div class="column is-6 ver-center">
              <button class="button is-primary search-btn" @click="onClickSearch"><cathay-translate code="Page_OperationModal_004"/></button>
          </div>
        </div>
        <!-- <div class="columns">
          <div class="column">
            <span class="field"><cathay-translate code="Page_OperationModal_005"/></span>
            <span class="data">
              <a href="javascript:void(0)" class="feature" @click="onClickOP('X001', '不符合手術等級', 'N')">
                <cathay-translate code="Page_OperationModal_006"/>
              </a>
            </span>
          </div>
          <div class="column is-6 ver-center">
            <span class="field"><cathay-translate code="Page_OperationModal_007"/></span>
            <span class="data cursor-pointer" @click="onCheckCancer">
              <img
                v-if="isCancer"
                src="/src/assets/images/checkbox-checked.svg"
                alt="CHECKMARK"
                style="position: relative; bottom: -3.5px"
              />
              <img v-else src="/src/assets/images/checkbox-off.svg" alt="CHECKMARK" style="position: relative; bottom: -3.5px" />
            </span>
          </div>
        </div> -->
        <!-- <div class="columns">
          <div class="column is-narrow">
            <span class="field mr-60"><cathay-translate code="Page_OperationModal_008"/></span>
          </div>
          <div class="column">
            <span class="data">
              <a href="javascript:void(0)" class="ml-177 feature" @click="onClickOP('BEGG', '癌症義肢裝設', 'N')">
                <cathay-translate code="Page_OperationModal_009"/>
              </a>
              <a href="javascript:void(0)" class="ml-177 feature" @click="onClickOP('BEGH', '癌症義齒裝設', 'N')">
                <cathay-translate code="Page_OperationModal_010"/>
              </a>
              <a href="javascript:void(0)" class="ml-177 feature" @click="onClickOP('BEGI', '癌症義乳重建', 'N')">
                <cathay-translate code="Page_OperationModal_011"/>
              </a>
            </span>
          </div>
        </div> -->
      </div>

      <!-- Table -->
      <div class="modal-table">
        <table class="table is-fullwidth is-striped-odd tr-can-click">
          <thead class="is-sticky">
            <tr>
              <!-- <th class="has-text-centered" style="width: 80px"><cathay-translate code="Page_OperationModal_012"/><br /><cathay-translate code="Page_OperationModal_013"/></th> -->
              <th class="is-vcentered"><cathay-translate code="Page_OperationModal_042"/></th>
              <th class="is-vcentered"><cathay-translate code="Page_OperationModal_002"/></th>
              <th class="is-vcentered"><cathay-translate code="Page_OperationModal_036"/></th>
              <th class="is-vcentered"><cathay-translate code="Page_OperationModal_038"/></th>
              <th class="has-text-centered is-vcentered"><cathay-translate code="Page_OperationModal_003"/></th>
              <th class="is-vcentered"><cathay-translate code="Page_OperationModal_001"/></th>
            </tr>
          </thead>
          <tbody v-if="searchResult.length > 0">
            <tr
              v-for="(op, index) in searchResult"
              @click="onClickOP(op.OP_CODE, op.OP_NAME, op.CANCER_OP, op.IS_STOP === 'Y')"
              :class="{ 'cannot-click': op.IS_STOP === 'Y' }"
            >          
              <td class="has-text-centered font-eudc">{{ index + 1 }}</td>
              <td class="font-eudc">{{ op.OP_BODY }}</td>
              <td class="has-text-centered">{{ op.OP_GRADE }}</td>
              <td class="has-text-centered">{{ op.CANCER_IND }}</td>
              <td class="">{{ op.OP_NAME }}</td>
              <td class="has-text-centered">
                <a href="javascript:void(0)" :class="{ 'disable-click': op.IS_STOP === 'Y' }">{{ op.OP_CODE }}</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
    <template v-slot:buttons>
      <button class="button is-light" @click="props.close"><cathay-translate code="Page_OperationModal_021"/></button>
      <a href="#" class="clear-modal" @click.stop.prevent="emitEvent.clearValue"><cathay-translate code="Page_OperationModal_022"/></a>
    </template>
  </Modal>
</template>
<script setup>
  import { cloneDeep } from 'lodash-es';
import FormDropdown from '~/components/Form/FormDropdown.vue';
import Modal from '~/components/Modal.vue';
import useSwal from '~/composables/useSwal';
import { useApplyStore } from '~/stores/apply';
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

  const searchResult = ref([]);
  // const lastSearchResult = ref([]);
  const isCancer = ref(false);
  const isCheckDiv = ref(false);
  const isCheckName = ref(false);
  const opArea = ref('A');
  const opGrade = ref('0');
  const opCancer = ref('A');
  const opName = ref('');
  const selectedOP = reactive({ code: '', name: '', isCancer: '', isCheckName: '', isCheckDiv: '' });
  const areaOptions = reactive([
    // {
    //   name: '全部',
    //   value: 'ALL',
    //   selected: true
    // },
    {
      name: language.translate('Page_OperationModal_023'),
      value: 'A'
    },
    {
      name: language.translate('Page_OperationModal_024'),
      value: 'B'
    },
    {
      name: language.translate('Page_OperationModal_025'),
      value: 'C'
    },
    {
      name: language.translate('Page_OperationModal_026'),
      value: 'D'
    },
    {
      name: language.translate('Page_OperationModal_027'),
      value: 'E'
    },
    {
      name: language.translate('Page_OperationModal_028'),
      value: 'F'
    },
    {
      name: language.translate('Page_OperationModal_029'),
      value: 'G'
    },
    {
      name: language.translate('Page_OperationModal_030'),
      value: 'H'
    },
    {
      name: language.translate('Page_OperationModal_031'),
      value: 'I'
    },
    {
      name: language.translate('Page_OperationModal_032'),
      value: 'J'
    },
    {
      name: language.translate('Page_OperationModal_033'),
      value: 'K'
    },
    {
      name: language.translate('Page_OperationModal_034'),
      value: 'L'
    },
    {
      name: language.translate('Page_OperationModal_035'),
      value: 'M'
    }
    // ,
    // {
    //   name: '治療性先天殘缺手術',
    //   value: 'N'
    // },
    // {
    //   name: '特定處置',
    //   value: '1'
    // },
    // {
    //   name: '燒燙傷程度',
    //   value: '2'
    // }
  ]);

  const gradeOptions = reactive([
    {
      name: language.translate('Page_OperationModal_037'),
      value: '0'
    },
    {
      name: '1',
      value: '01'
    },
    {
      name: '2',
      value: '02'
    },
    {
      name: '3',
      value: '03'
    },
    {
      name: '4',
      value: '04'
    },
    {
      name: '5',
      value: '05'
    },
    {
      name: '6',
      value: '06'
    },
    {
      name: '7',
      value: '07'
    },
    {
      name: '8',
      value: '08'
    },
    {
      name: '9',
      value: '09'
    },
    {
      name: '10',
      value: '010'
    }
  ]);

  const cancerOptions = reactive([
    {
      name: language.translate('Page_OperationModal_039'),
      value: 'A'
    },
    {
      name: language.translate('Page_OperationModal_040'),
      value: '0'
    },
    {
      name: language.translate('Page_OperationModal_041'),
      value: 'N'
    }
  ]);
  
  const onClickOP = (code, name, cancer, isStop) => {
    if (isStop) {
      return;
    }
    selectedOP.code = code;
    selectedOP.name = name;
    selectedOP.isCancer = cancer;
    onClickConfirm();
  };

  const isConfirmDisabled = computed(() => selectedOP.code === '' || selectedOP.name === '');

  const onClickSearch = async () => {
    try {
      applyStore.showLoading();
      searchResult.value = await applyStore.searchOP(opArea.value, opGrade.value, opCancer.value, opName.value, isCheckDiv.value, isCheckName.value);
      console.log('searchResult', searchResult.value);
      // lastSearchResult.value = cloneDeep(searchResult.value);
      // 20221018_申請資料_筱玲_Q1 isCancer僅用來帶回顯示畫面，非篩選
      // if (isCancer.value && searchResult.value.length > 0) {
      //   searchResult.value = searchResult.value.filter((result) => result.CANCER_OP === 'Y');
      // }
    } catch (e) {
      $swal.fail(e);
    } finally {
      applyStore.hideLoading();
    }
  };

  const emitEvent = props.data.emitEvents;
  const onClickConfirm = () => {
    emitEvent.updateValue(selectedOP.code);
    emitEvent.updateValue2(selectedOP.name);
    // 有勾癌症篩選就帶"是"回去
    emitEvent.updateValue3(isCancer.value ? 'Y' : selectedOP.isCancer);
    props.close();
  };

  const onClickLink = (opCode, opBodyCode) => {
    window.open(`/servlet/HttpDispatcher/AAC0_0406/prompt?OP_CODE=${opCode}&OP_BODY_CODE=${opBodyCode}`);
  };

  const onCheckCancer = () => {
    isCancer.value = !isCancer.value;
    // // 下方有搜尋結果的話要篩選 => 20221018_申請資料_筱玲_Q1 此勾勾僅用來帶回顯示畫面，非篩選
    // if (isCancer.value && searchResult.value.length > 0) {
    //   searchResult.value = searchResult.value.filter((result) => result.CANCER_OP === 'Y');
    // } else if (!isCancer.value) {
    //   searchResult.value = lastSearchResult.value;
    // }
  };

  const onCheckDiv = () => {
    isCheckDiv.value = !isCheckDiv.value;
  };

  const onCheckName = () => {
    isCheckName.value = !isCheckName.value;
  };
</script>
<style lang="scss"></style>
