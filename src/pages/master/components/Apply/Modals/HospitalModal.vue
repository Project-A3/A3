<template>
  <Modal disableOverflow>
    <template v-slot:title>選擇醫院</template>
    <template v-slot:content>
      <!-- 查詢區域 -->
      <div class="columns pr-6 pl-1">
        <div class="column p-0">
          <input class="font-eudc" v-model="hospitalName" type="text" placeholder="請輸入醫院名稱（非必填）" />
        </div>
        <div class="is-4 column p-0 ml-4">
          <FormDropdown
            class="width-full height-limit-lg"
            :isLoading="isDropdownLoading"
            :options="hospitalCityOptions"
            v-model="hospitalCity"
          ></FormDropdown>
        </div>
        <div class="column p-0 ml-4">
          <SearchIconButton @click.native="onClickSearch"></SearchIconButton>
        </div>
      </div>

      <!-- 醫院資料列表 -->
      <div class="modal-table" v-if="searchedHospitals.length > 0">
        <table class="table is-fullwidth apply-table tr-can-click">
          <thead>
            <tr>
              <th class="pl-1">醫院名稱</th>
              <th>縣市</th>
              <th>地區</th>
              <th>醫院代碼</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="hospital in searchedHospitals"
              @click="onClickHospital(hospital.HOSP_CODE, hospital.HOSP_NAME)"
            >
              <td class="font-eudc">{{ hospital.HOSP_NAME }}</td>
              <td class="font-eudc">{{ hospital.CITY_NAME }}</td>
              <td class="font-eudc">{{ hospital.LOCAL_NAME }}</td>
              <td>{{ hospital.HOSP_CODE }}</td>
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
  import { isEmpty } from 'lodash-es';
  import Modal from '~/components/Modal.vue';
  import FormDropdown from '~/components/Form/FormDropdown.vue';
  import useSwal from '~/composables/useSwal';
  import { useApplyStore } from '~/stores/apply';
  import SearchIconButton from '~/components/SearchIconButton.vue';
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

  // 搜尋結果
  const searchedHospitals = ref([]);
  // 輸入搜尋的醫院名稱
  const hospitalName = ref('');
  // 選擇的縣市
  const hospitalCity = ref('');
  // 縣市下拉選單
  const hospitalCityOptions = reactive([
    {
      name: '請選擇',
      value: '',
      selected: true,
      disabled: true
    }
  ]);
  // 下拉選單Loading
  const isDropdownLoading = ref(false);
  // 最後選擇的醫院
  const selectedHospital = reactive({ code: '', name: '' });

  //#region 取得所有縣市
  const getCities = async () => {
    isDropdownLoading.value = true;
    try {
      let cities = await applyStore.getHospitalCities();
      cities.forEach((city) => {
        hospitalCityOptions.push({
          name: city.CITY_NAME + city.LOCAL_ZONE_NAME,
          value: city.LOCAL_CODE
        });
      });
    } catch (e) {
      $swal.fail(e);
    } finally {
      isDropdownLoading.value = false;
    }
  };
  getCities();
  //#endregion
  // 查詢
  const onClickSearch = async () => {
    if (isEmpty(hospitalCity.value)) {
      $swal.warning('請選擇區域');
      return;
    }
    try {
      applyStore.showLoading();
      // 清除選擇的醫院
      selectedHospital.code = '';
      selectedHospital.name = '';
      searchedHospitals.value = await applyStore.getHospitals(hospitalCity.value, hospitalName.value);
    } catch (e) {
      $swal.fail(e);
    } finally {
      applyStore.hideLoading();
    }
  };

  // 點擊table選擇醫院
  const onClickHospital = (code, name) => {
    selectedHospital.code = code;
    selectedHospital.name = name;
    onClickConfirm();
  };

  const isConfirmDisabled = computed(() => isEmpty(selectedHospital.code) || isEmpty(selectedHospital.name));

  // 選擇完醫院後點擊確認
  const emitEvent = props.data.emitEvents;
  const onClickConfirm = () => {
    if (isEmpty(selectedHospital.code) || isEmpty(selectedHospital.name)) {
      $swal.warning('請選擇一所醫院');
      return;
    }
    // 更新資料
    emitEvent.updateValue(selectedHospital.code);
    emitEvent.updateText(selectedHospital.name);
    // 關閉Modal
    props.close();
  };
</script>
<style lang="scss"></style>
