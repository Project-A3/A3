<template>
  <Modal>
    <template v-slot:title>
      擬人自動 處理中
      <br>
      <img style="height: 30%; width: 30%;" src="/src/assets/images/autoExecutStatus.png" alt="AUTO">
    </template>

    <template v-slot:content>
      <ul class="timeline timeline-split padding:0 150px">
        <li :class="{ 'timeline-item': true, 'is-current': activeIndex }">
          <div class="timeline-marker"></div>
          <div class="timeline-content">
            <p class="font-eudc"> 初始規則 檢查中...</p>
          </div>
        </li>
        <li :class="{ 'timeline-item': true, 'is-current': activeIndex2 }">
          <div class="timeline-marker"></div>
          <div class="timeline-content">
            <p class="font-eudc"> 保單概況 處理中...</p>
          </div>
        </li>
        <li :class="{ 'timeline-item': true, 'is-current': activeIndex3 }">
          <div class="timeline-marker"></div>
          <div class="timeline-content">
            <p class="font-eudc"> 核算結果 處理中...</p>
          </div>
        </li>
        <li :class="{ 'timeline-item': true, 'is-current': activeIndex4 }">
          <div class="timeline-marker"></div>
          <div class="timeline-content">
            <p class="font-eudc"> 受益人分配 處理中...</p>
          </div>
        </li>
        <li :class="{ 'timeline-item': true, 'is-current': activeIndex5 }">
          <div class="timeline-marker"></div>
          <div class="timeline-content">
            <p class="font-eudc"> 結案 處理中...</p>
          </div>
        </li>
      </ul>
    </template>
    <template v-slot:buttons>
      <button class="button is-primary" @click="props.close" :disabled="state.isButtonDisabled">關閉</button>
    </template>
    <!-- 保單概況 核算結果 受益人分配 -->
  </Modal>

</template>
<script setup>
import { ref } from 'vue';
import { reactive } from 'vue';
import useSwal from '~/composables/useSwal';
import Modal from '~/components/Modal.vue';
import {
  apiIsSemiAutoBeforOverview,
  apiSemiAutomatic300,
  apiSemiAutomatic310,
  apiSemiAutomatic320,
  apiSemiAutomatic330
} from '~/common/api';
import notAutoReason from './NotAutoReason.vue';
import useModal from '~/composables/useModal';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2/dist/sweetalert2.js';

const router = useRouter();
const { $swal } = useSwal();
const { $m } = useModal();
const state = reactive({
  isButtonDisabled: true // 預設按鈕為禁用
});

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

const applyID = props.data.aplyNo;
const activeIndex = ref(false);
const activeIndex2 = ref(false);
const activeIndex3 = ref(false);
const activeIndex4 = ref(false);
const activeIndex5 = ref(false);

async function semiAutomatic01(parms) {
  activeIndex.value = true;
  const response = await apiIsSemiAutoBeforOverview(parms);
  const result = response.data.result
  return result
}

async function semiAutomatic02(parms) {
  activeIndex2.value = true;
  const response = await apiSemiAutomatic300(parms);
  const result = response.data.result
  return result
}

async function semiAutomatic03(parms) {
  activeIndex3.value = true;
  const response = await apiSemiAutomatic310(parms);
  const result = response.data.result
  return result
}

async function semiAutomatic04(parms) {
  activeIndex4.value = true;
  const response = await apiSemiAutomatic320(parms);
  const result = response.data.result
  return result
}

async function semiAutomatic05(parms) {
  activeIndex5.value = true;
  const response = await apiSemiAutomatic330(parms);
  const result = response.data.result
  return result
}
// 輸入不使用擬人VUE原因
const opneNotAutoReason = () => {
  $m.show({
    component: notAutoReason,
    id: '#notAutoReason',
    data: {
      aplyNo: applyID,
      saveCallback: (cbrs) => {
        console.log('notAutoReason=' + cbrs);
        if (cbrs === 'N') {
          // 呼叫API取得保單概況資料
          if (props.data?.saveCallback && typeof props.data.saveCallback === 'function') {
            props.data.saveCallback('N');
          };
        }
      }
    }
  });
}

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

//同步處理
async function runInOrder() {

  const parms = [applyID];
  // 初始規則 檢查中
  const result = await semiAutomatic01(parms);
  const RTN_CODE = result.RTN_CODE
  const semiAutoMsg = result.RTN_MSG;

  if (RTN_CODE != "0" && props.data?.saveCallback && typeof props.data.saveCallback === 'function') {
    let prompt = await confirmAsyncCus("本件不符合擬人，請接續審理\n" + semiAutoMsg);
    if (prompt.isConfirmed) {
      props.data.saveCallback('N');
      props.close();
      return true
    }
  } else {
    // 保單概況 擬人自動
    const result2 = await semiAutomatic02(parms);
    const isSemiAuto2 = result2.isSemiAuto;
    const semiAutoMsg2 = result2.RTN_MSG;

    if (isSemiAuto2 === "N" && props.data?.saveCallback && typeof props.data.saveCallback === 'function') {
      let prompt2 = await confirmAsyncCus("本件不符合擬人，請接續審理\n" + semiAutoMsg2);
      if (prompt2.isConfirmed) {
        props.data.saveCallback('N');
        props.close();
        return true
      }
    } else {
       // 核算結果 擬人自動
      const result3 = await semiAutomatic03(parms);
      const isSemiAuto3 = result3.isSemiAuto;
      const semiAutoMsg3 = result3.RTN_MSG;

      if (isSemiAuto3 === "N" && props.data?.saveCallback && typeof props.data.saveCallback === 'function') {
        let prompt3 = await confirmAsyncCus("本件不符合擬人，請接續審理\n" + semiAutoMsg3);
        if (prompt3.isConfirmed) {
          props.data.saveCallback('N');
          props.close();
          return true
        }
      } else {
         //受益人分配 擬人自動
        const result4 = await semiAutomatic04(parms);
        const isSemiAuto4 = result4.isSemiAuto;
        const semiAutoMsg4 = result4.RTN_MSG;

        if (isSemiAuto4 === "N" && props.data?.saveCallback && typeof props.data.saveCallback === 'function') {
          let prompt4 = await confirmAsyncCus("本件不符合擬人，請接續審理\n" + semiAutoMsg4);
          if (prompt4.isConfirmed) {
            props.data.saveCallback('N');
            props.close();
            return true
          }
        } else {
          let confirmAsync = await $swal.confirmAsync('本案符合擬人自動核賠，確認後案件自動結案？');
          if (confirmAsync.isConfirmed) {
            //擬人自動 結案處理
            const result5 = await semiAutomatic05(parms); 
            const isSemiAuto5 = result5.isSemiAuto;
            const semiAutoMsg5 = result5.RTN_MSG;

            if (isSemiAuto5 === "N" && props.data?.saveCallback && typeof props.data.saveCallback === 'function') {
              let prompt5 = await confirmAsyncCus("自動結案異常，請接續審理\n" + semiAutoMsg5);
              if (prompt5.isConfirmed) {
                props.data.saveCallback('N');
                props.close();
                return true
              }
            } else {
              // 導回個人首頁
              props.close()
              router.push({ name: 'home' });  
            }
          } else {
            opneNotAutoReason();
          }
        }
      }
    }
  }
}

runInOrder()

</script>
<style lang="scss"></style>
