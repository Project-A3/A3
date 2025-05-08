<template>
  <Modal disableOverflow>
    <template v-slot:title>選擇學校</template>
    <template v-slot:content>
      <!-- 查詢區域 -->
      <div class="columns pr-6 pl-1">
        <div class="column p-0">
          <input class="font-eudc" style="width: 200px" v-model="schoolCode" type="text" placeholder="請輸入學校代碼" />
        </div>
        <div class="column p-0 ml-4">
          <input class="font-eudc" style="width: 230px" v-model="schoolName" type="text" placeholder="請輸入學校名稱關鍵字" />
        </div>
        <div class="is-4 column p-0 ml-4">
          <FormDropdown
            class="width-full height-limit font-eudc"
            :isLoading="isDropdownLoading"
            :options="schoolCityOptions"
            v-model="schoolCity"
          ></FormDropdown>
        </div>
        <div class="column p-0 ml-4">
          <SearchIconButton @click.native="onClickSearch"></SearchIconButton>
        </div>
      </div>

      <!-- 學校資料列表 -->
      <div class="modal-table" v-if="searchedSchools.length > 0">
        <table class="table is-fullwidth apply-table tr-can-click">
          <thead>
            <tr>
              <th class="pl-1">學校名稱</th>
              <th>地址</th>
              <th>電話</th>
              <th>學校代碼</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="school in searchedSchools"
              @click="onClickSchool(school.SCHOOL_NO, school.SCHOOL_NAME)"
            >
              <td class="font-eudc" style="width: 30%">{{ school.SCHOOL_NAME }}</td>
              <td class="font-eudc" style="width: 30%">{{ school.SCHOOL_ADDR }}</td>
              <td style="width: 23%">{{ school.SCHOOL_TEL }}</td>
              <td style="width: 17%">{{ school.SCHOOL_NO }}</td>
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
  const searchedSchools = ref([]);
  // 輸入搜尋的學校代碼
  const schoolCode = ref('');
  // 輸入搜尋的學校名稱
  const schoolName = ref('');
  // 選擇的縣市
  const schoolCity = ref('');
  // 縣市下拉選單
  const schoolCityOptions = reactive([
    {
      name: '全部',
      value: '',
      selected: true
    }
  ]);
  // 下拉選單Loading
  const isDropdownLoading = ref(false);
  // 最後選擇的學校
  const selectedSchool = reactive({ no: '', name: '' });

  //#region 取得所有縣市
  const getCities = async () => {
    isDropdownLoading.value = true;
    try {
      let cities = await applyStore.getSchoolCities();
      cities.forEach((city) => {
        schoolCityOptions.push({
          name: city.CITY_NAME,
          value: city.CITY_NAME
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
    if (isEmpty(schoolName.value) & isEmpty(schoolCode.value)) {
      $swal.warning('未傳入學校代碼以及學校名稱關鍵字，請擇一輸入');
      return;
    }
    if (isEmpty(schoolCity.value) & isEmpty(schoolCode.value)) {
      $swal.warning('未傳入學校代碼以及區域，請擇一輸入');
      return;
    }
    if (!isEmpty(schoolName.value) && schoolName.value.length < 2) {
      $swal.warning('學校名稱關鍵字，須至少填寫兩個關鍵字才可進行查詢。');
      return;
    }
    try {
      applyStore.showLoading();
      // 清除選擇的學校
      selectedSchool.no = '';
      selectedSchool.name = '';
      searchedSchools.value = await applyStore.getSchools(schoolCity.value, schoolCode.value, schoolName.value);
    } catch (e) {
      $swal.fail(e);
    } finally {
      applyStore.hideLoading();
    }
  };

  // 點擊table選擇學校
  const onClickSchool = (no, name) => {
    selectedSchool.no = no;
    selectedSchool.name = name;
    onClickConfirm();
  };

  const isConfirmDisabled = computed(() => isEmpty(selectedSchool.no) || isEmpty(selectedSchool.name));

  // 選擇完學校後點擊確認
  const emitEvent = props.data.emitEvents;
  const onClickConfirm = () => {
    if (isEmpty(selectedSchool.no) || isEmpty(selectedSchool.name)) {
      $swal.warning('請選擇一所學校');
      return;
    }
    // 更新資料
    emitEvent.updateValue(selectedSchool.name);
    emitEvent.updateText(selectedSchool.no);
    // 關閉Modal
    props.close();
  };
</script>
<style lang="scss"></style>
