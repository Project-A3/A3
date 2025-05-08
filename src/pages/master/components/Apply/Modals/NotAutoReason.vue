<template>
  <Modal>
    <template v-slot:title>請輸入不使用 擬人自動原因</template>
    <template v-slot:content>
      <p style="color: red;">自動擬人結案原因框要空白</p>
      <br>
      <div>
        <EditableDropdown :editingWidth="450" v-model="selecteItem" :options="[
          { name: '經檢視理賠紀錄，須人工審核', value: '經檢視理賠紀錄，須人工審核' },
          { name: '經檢視特殊紀錄，須人工審核', value: '經檢視特殊紀錄，須人工審核' },
          { name: '經檢視不給付紀錄，須人工審核', value: '經檢視不給付紀錄，須人工審核' },
          { name: '須編輯本次保單選擇', value: '須編輯本次保單選擇' },
          { name: '須調整受益人清單', value: '須調整受益人清單' },
          { name: '須調整給付狀態', value: '須調整給付狀態' },
          { name: '須新增給付明細說明', value: '須新增給付明細說明' },
          { name: '重新檢查申請資料(再次觸發擬人)', value: '重新檢查申請資料(再次觸發擬人)' },
          { name: '其他', value: '其他' }
        ]" @onSelected="(options) => {
          selectCountryCallback(options);
        }">

        </EditableDropdown>
      </div>
      <textarea v-model="selecteItem"></textarea>
    </template>
    <template v-slot:buttons>
      <button :disabled="selecteItem === ''" class="button is-primary" @click="onClickInsert">人工接續審理</button>
      <button :disabled="selecteItem !== ''" class="button is-primary" @click="semiAutomatic330">自動擬人結案</button>
      <button class="button is-primary" @click="props.close" v-show="showCloseButton">關閉</button>
    </template>
  </Modal>
</template>
<script setup>
import { ref } from 'vue';
import Modal from '~/components/Modal.vue';
import EditableDropdown from '~/components/Editable/EditableDropdown.vue';
import {
  apiSaveNotExecReason,
  apiGetReviewerInfo,
  apiSemiAutomatic330
} from '~/common/api';
import { useRouter } from 'vue-router';

const router = useRouter();
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
const showCloseButton = ref(false);
const selecteItem = ref('');
const applyID = props.data.aplyNo;

// 客製化按鈕達成非同步需求
const confirmAsyncCus = (title = '', confirmButtonText = '確定', text = '') => {
  const swalWithButtons = Swal.mixin({
    customClass: {
      confirmButton: 'button swal-primary'
    },
    buttonsStyling: false
  });
  return swalWithButtons.fire({
    icon: 'success',
    title,
    text,
    showDenyButton: false,
    confirmButtonText: confirmButtonText
  });
};

let reasonId = '';

async function onClickInsert() {
  const info = await apiGetReviewerInfo([applyID]);
  const empID = info.data.result.ASSIGNED_EMP_ID;
  const parms = [applyID, reasonId, selecteItem.value, empID]
  const response = apiSaveNotExecReason(parms);
  props.data.saveCallback('N');
  props.close()
};

async function semiAutomatic330() {
  const parms330 = [applyID];
  const response = await apiSemiAutomatic330(parms330); //擬人自動 結案處理
  const isSemiAuto = response.data.result.isSemiAuto;
  const semiAutoMsg = response.data.result.RTN_MSG;

  if (isSemiAuto === "N") {
    let prompt = await confirmAsyncCus("自動結案異常，請接續審理\n" + semiAutoMsg);
    if (prompt.isConfirmed) {
      props.data.saveCallback('N');
      props.close();
      return true
    }
  } else {
    //導回個人首頁
    props.close()
    router.push({ name: 'home' });
  }
}

const selectCountryCallback = (options) => {
  if ('經檢視理賠紀錄，須人工審核' == options) {
    reasonId = 'NUSA1'
  }
  if ('經檢視特殊紀錄，須人工審核' == options) {
    reasonId = 'NUSA2'
  }
  if ('經檢視理賠紀錄，須人工審核' == options) {
    reasonId = 'NUSA3'
  }
  if ('須編輯本次保單選擇' == options) {
    reasonId = 'NUSA4'
  }
  if ('須調整受益人清單' == options) {
    reasonId = 'NUSA5'
  }
  if ('須調整給付狀態' == options) {
    reasonId = 'NUSA6'
  }
  if ('須新增給付明細說明' == options) {
    reasonId = 'NUSA7'
  }
  if ('重新檢查申請資料(再次觸發擬人)' == options) {
    reasonId = 'NUSA8'
  }
  if ('其他' == options) {
    reasonId = 'NUSA99'
  }
};
</script>
<style lang="scss" scoped></style>
