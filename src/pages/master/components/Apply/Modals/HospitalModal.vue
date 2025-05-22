<template>
  <Modal disableOverflow>
    <template v-slot:title>Tìm bệnh viên</template>
    <template v-slot:content>
      <!-- 查詢區域 -->
      <div class="columns pl-1">
        <div class="column p-0">
          <input class="font-eudc" v-model="hospitalName" type="text" placeholder="Nhập tên cần tìm" />
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
        <table class="table is-fullwidth is-striped-odd tr-can-click">
          <thead>
            <tr>
              <th class="has-text-centered ver-middle pl-2">Số thứ tự</th>
              <th class="has-text-centered ver-middle">Tỉnh</th>
              <th class="has-text-centered ver-middle">Bệnh viện kiểm tra sức khỏe</th>
              <th class="has-text-centered ver-middle">Bệnh lý nghiêm trọng</th>
              <th class="has-text-centered ver-middle">Tên bệnh viện</th>
              <th class="has-text-centered ver-middle">TTYT được cấp phép</th>
              <th class="has-text-centered ver-middle">Chấp thuận AutoClaim</th>
              <th class="has-text-centered ver-middle">Ngừng sử dụng</th>
              <th class="has-text-centered ver-middle pr-2">Mã bệnh viện</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(hospital, index) in currentData"
              @click="onClickHospital(hospital.HOSP_ID, hospital.HOSP_NAME)"
            >
              <td class="has-text-centered">{{ index + currentPageIndex.start }}</td>
              <td class="has-text-centered">{{ hospital.PROVINCE }}</td>
              <td class="has-text-centered"><input type="checkbox" :value="hospital.MED_EXAM_IND" :checked="hospital.MED_EXAM_IND === 'Y'" v-model="checkedClaimCats" /></td>
              <td class="has-text-centered"><input type="checkbox" :value="hospital.RISK_DEAD_IND" :checked="hospital.RISK_DEAD_IND === 'Y'" v-model="checkedClaimCats" /></td>
              <td class="has-text-centered">{{ hospital.HOSP_NAME }}</td>
              <td class="has-text-centered"><input type="checkbox" :value="hospital.IS_AUTHORIZE" :checked="hospital.IS_AUTHORIZE === 'Y'" v-model="checkedClaimCats" /></td>
              <td class="has-text-centered"><input type="checkbox" :value="hospital.IS_AUTO_CLAIM" :checked="hospital.IS_AUTO_CLAIM === 'Y'" v-model="checkedClaimCats" /></td>
              <td class="has-text-centered"><input type="checkbox" :value="hospital.IS_STOPPED" :checked="hospital.IS_STOPPED === 'Y'" v-model="checkedClaimCats" /></td>
              <td class="has-text-centered">{{ hospital.HOSP_ID }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Pagination & Info  -->
      <div class="number-of-data-info" v-if="hasData">
        <cathay-translate code="Component_Pagination_003" /><span>{{ currentPageIndex.start }}</span
        >-<span>{{ currentPageIndex.end }}</span
        ><cathay-translate code="Component_Pagination_004" /><span>{{ totalCounts }}</span
        ><cathay-translate code="Component_Pagination_005" />
      </div>
      <Pagination
        :total="totalCounts"
        :pageSize="pageSize"
        :currentPage="currentPage"
        @onPageChanged="onPageChanged"
      ></Pagination>
    </template>
    <template v-slot:buttons>
      <button class="button is-light" @click="props.close">Hủy bỏ</button>
      <a href="#" class="clear-modal" @click.stop.prevent="emitEvent.clearValue">Xóa bỏ</a>
    </template>
  </Modal>
</template>
<script setup>
  import { isEmpty } from 'lodash-es';
  import Modal from '~/components/Modal.vue';
  import FormDropdown from '~/components/Form/FormDropdown.vue';
  import usePagination from '~/composables/usePagination';
  import Pagination from '~/components/Pagination.vue';
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

  // 分頁相關
  const { totalCounts, pageSize, currentData, currentPage, currentPageIndex, hasData, onPageChanged, setPageData } = usePagination();
  // 搜尋結果
  const searchedHospitals = ref([]);
  // 輸入搜尋的醫院名稱
  const hospitalName = ref('');
  // 選擇的縣市
  const hospitalCity = ref('');
  // 縣市下拉選單
  const hospitalCityOptions = reactive([
    {
      name: 'Vui lòng chọn',
      value: '',
      selected: true
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
          name: city.NAME,
          value: city.OPTION
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
    if (isEmpty(hospitalCity.value) && isEmpty(hospitalName.value)) {
      $swal.warning('Vui lòng chọn điều kiện tìm');
      return;
    }
    try {
      applyStore.showLoading();
      // 清除選擇的醫院
      selectedHospital.code = '';
      selectedHospital.name = '';
      searchedHospitals.value = await applyStore.getHospitals(hospitalCity.value, hospitalName.value);
      setPageData(searchedHospitals.value);
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
      $swal.warning('Vui lòng chọn bệnh viện');
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
