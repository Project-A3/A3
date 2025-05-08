<template>
  <Modal>
    <template v-slot:title>手術代碼</template>
    <template v-slot:content>
      <!-- Info-->
      <div class="data-horizontal-info">
        <div class="columns">
          <div class="column is-6 ver-center">
            <span class="field">手術部位</span>
            <span class="data">
              <FormDropdown :options="partOptions" class="w-260 height-limit" v-model="opPart"></FormDropdown>
            </span>
          </div>
          <div class="column is-6 ver-center">
            <span class="field">手術關鍵字</span>
            <span class="data">
              <input class="input search-input font-eudc" type="search" v-model="opKeyword" />
              <button class="button is-primary search-btn" @click="onClickSearch">查詢</button>
            </span>
          </div>
        </div>
        <div class="columns">
          <div class="column">
            <span class="field">是否符合手術等級</span>
            <span class="data">
              <a href="javascript:void(0)" class="feature" @click="onClickOP('X001', '不符合手術等級', 'N')">
                X001 不符合手術等級
              </a>
            </span>
          </div>
          <div class="column is-6 ver-center">
            <span class="field">癌症手術</span>
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
        </div>
        <div class="columns">
          <div class="column is-narrow">
            <span class="field mr-60">裝設重建項目</span>
          </div>
          <div class="column">
            <span class="data">
              <a href="javascript:void(0)" class="ml-177 feature" @click="onClickOP('BEGG', '癌症義肢裝設', 'N')">
                BEGG癌症義肢裝設
              </a>
              <a href="javascript:void(0)" class="ml-177 feature" @click="onClickOP('BEGH', '癌症義齒裝設', 'N')">
                BEGH癌症義齒裝設
              </a>
              <a href="javascript:void(0)" class="ml-177 feature" @click="onClickOP('BEGI', '癌症義乳重建', 'N')">
                BEGI癌症義乳重建
              </a>
            </span>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="modal-table">
        <table class="table is-fullwidth is-striped-odd tr-can-click">
          <thead class="is-sticky">
            <tr>
              <th class="has-text-centered" style="width: 80px">手術<br />代碼</th>
              <th class="has-text-centered" style="width: 150px">手術<br />部位</th>
              <th class="is-vcentered" style="width: 320px">公司手術名稱</th>
              <th class="is-vcentered">手術別名</th>
              <th class="has-text-centered is-vcentered" style="width: 90px">癌症手術</th>
              <th class="has-text-centered is-vcentered" style="width: 90px">健保碼</th>
              <th class="is-vcentered" style="width: 90px">狀態</th>
            </tr>
          </thead>
          <tbody v-if="searchResult.length > 0">
            <tr
              v-for="op in searchResult"
              @click="onClickOP(op.OP_CODE, op.OP_NAME, op.CANCER_OP, op.IS_STOP === 'Y')"
              :class="{ 'cannot-click': op.IS_STOP === 'Y' }"
            >          
              <td class="has-text-centered">
                <a href="javascript:void(0)" :class="{ 'disable-click': op.IS_STOP === 'Y' }">{{ op.OP_CODE }}</a>
              </td>
              <td class="has-text-centered font-eudc">{{ op.OP_BODY_NAME }}</td>
              <td class="font-eudc">{{ op.OP_NAME }}</td>
              <td class="is-clickable font-eudc" @click.stop.prevent="onClickLink(op.OP_CODE, op.OP_BODY_CODE)">
                {{ op.OP_OTR_NAME }}
                <img src="/src/assets/images/icon-open.svg" alt="open" />
              </td>
              <td class="has-text-centered">{{ op.CANCER_OP === 'Y' ? '是' : '否' }}</td>
              <td class="has-text-centered">
                {{ op.HINS_POINT }}
                <img
                  src="/src/assets/images/icon-open.svg"
                  alt="open"
                  @click.stop.prevent="onClickLink(op.OP_CODE, op.OP_BODY_CODE)"
                />
              </td>
              <td>
                <p v-if="op.IS_STOP === 'Y'">停用</p>
                <p v-if="op.STOP_RESN !== ''">{{ op.STOP_RESN }}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
    <template v-slot:buttons>
      <button class="button is-light" @click="props.close">取消</button>
      <a href="#" class="clear-modal" @click.stop.prevent="emitEvent.clearValue">清除</a>
    </template>
  </Modal>
</template>
<script setup>
  import { cloneDeep } from 'lodash-es';
import FormDropdown from '~/components/Form/FormDropdown.vue';
import Modal from '~/components/Modal.vue';
import useSwal from '~/composables/useSwal';
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

  const searchResult = ref([]);
  const lastSearchResult = ref([]);
  const isCancer = ref(false);
  const opPart = ref('ALL');
  const opKeyword = ref('');
  const selectedOP = reactive({ code: '', name: '', isCancer: '' });
  const partOptions = reactive([
    {
      name: '全部',
      value: 'ALL',
      selected: true
    },
    {
      name: '皮膚',
      value: 'A'
    },
    {
      name: '乳房',
      value: 'B'
    },
    {
      name: '筋骨',
      value: 'C'
    },
    {
      name: '呼吸器',
      value: 'D'
    },
    {
      name: '循環器',
      value: 'E'
    },
    {
      name: '造血與淋巴系統',
      value: 'F'
    },
    {
      name: '消化器',
      value: 'G'
    },
    {
      name: '尿、性器',
      value: 'H'
    },
    {
      name: '內分泌器',
      value: 'I'
    },
    {
      name: '神經外科',
      value: 'J'
    },
    {
      name: '聽器',
      value: 'K'
    },
    {
      name: '視器',
      value: 'L'
    },
    {
      name: '牙齒',
      value: 'M'
    },
    {
      name: '治療性先天殘缺手術',
      value: 'N'
    },
    {
      name: '特定處置',
      value: '1'
    },
    {
      name: '燒燙傷程度',
      value: '2'
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
      searchResult.value = await applyStore.searchOP(opPart.value, opKeyword.value);
      lastSearchResult.value = cloneDeep(searchResult.value);
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
</script>
<style lang="scss"></style>
