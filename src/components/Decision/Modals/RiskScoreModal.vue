<template>
  <Modal>
    <template v-slot:title>CRSS 3.0 模型高風險警示</template>
    <template v-slot:content>
      <!-- 文字區域 -->
      <div class="info">
        <div class="columns">
          <div class="column is-10">
            <p style="color:red">針對高風險回饋目標，如有疑慮，請先點選右邊「注意事項」</p>
            <p>計算區間：2020年-2022年之理賠資料</p>
          </div>
          <div class="column hor-right">
            <button class="button apply-btn" @click="openRiskScoreNoticeItemModal">
              <span>注意事項</span>
              <img src="/src/assets/images/icon-add.svg" alt="MEMO" />
            </button>
          </div>
        </div>
      </div>

      <!-- 醫院資料列表 -->
      <div class="modal-table">
        <table class="table is-striped-odd is-fullwidth">
          <thead class="is-sticky">
            <tr>
              <th class="has-text-centered ver-middle select-item" @click="onClickItem('A')"><span :class="{'active': itemType == 'A'}">疾病相關 <img v-if="existItemType['A']" src="/src/assets/images/icon-warn.svg"/></span></th>
              <th class="has-text-centered ver-middle select-item" @click="onClickItem('B')"><span :class="{'active': itemType == 'B'}">過往理賠 <img v-if="existItemType['B']" src="/src/assets/images/icon-warn.svg"/></span></th>
              <th class="has-text-centered ver-middle select-item" @click="onClickItem('C')"><span :class="{'active': itemType == 'C'}">保單資訊 <img v-if="existItemType['C']" src="/src/assets/images/icon-warn.svg"/></span></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in currentData" :key="item">
              <td class="has-text-left" colspan="3">{{ item }}</td>
            </tr>
          </tbody>
        </table>
        <!-- Pagination & Info  -->
        <div class="number-of-data-info" v-if="hasData">
          顯示<span>{{ currentPageIndex.start }}</span
          >-<span>{{ currentPageIndex.end }}</span
          >則內容，共<span>{{ totalCounts }}</span
          >則
        </div>
        <Pagination
          :total="totalCounts"
          :pageSize="pageSize"
          :currentPage="currentPage"
          @onPageChanged="onPageChanged"
        ></Pagination>
        <div class="button-group">
          <OptionButton :isActive="isAgree === 'Y'" @click.native="onClickOpinion('Y')">同意</OptionButton>
          <OptionButton :isActive="isAgree === 'N'" @click.native="onClickOpinion('N')">不同意</OptionButton>
        </div>
        <textarea
          class="resize-vertical is-secondary font-eudc"
          rows="5"
          v-model="uptResn"
        ></textarea>
      </div>
    </template>
    <template v-slot:buttons>
      <button class="button is-light" @click="props.close">取消</button>
      <button class="button is-primary" @click="onSubmit" :disabled="isAgree === ''">確認</button>
    </template>
  </Modal>
  <RiskScoreNoticeItemModal
    v-if="isShowRiskScoreNoticeItemModal"
    :close="
      () => {
        isShowRiskScoreNoticeItemModal = false;
      }
    "
  ></RiskScoreNoticeItemModal>
</template>
<script setup>
  import Modal from '~/components/Modal.vue';
  import RiskScoreNoticeItemModal from './RiskScoreNoticeItemModal.vue';
  import OptionButton from '~/components/Decision/OptionButton.vue';
  import { isEmpty } from 'lodash-es';
  import useSwal from '~/composables/useSwal';
  import { useDecisionStore } from '~/stores/decision';
  import usePagination from '~/composables/usePagination';
  import Pagination from '~/components/Pagination.vue';

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

  const decisionStore = useDecisionStore();
  const { $swal } = useSwal();

  // 分頁相關
  const { totalCounts, pageSize, currentData, currentPage, currentPageIndex, hasData, onPageChanged, setPageData } =
    usePagination();

  const aplyNo = ref(props.data.APLY_NO);

  const highRiskItems = ref(props.data.HIGH_RISK_ITEMS);

  const isShowRiskScoreNoticeItemModal = ref(false);

  const itemType = ref("A");

  const isAgree = ref("");

  const uptResn = ref("");

  const existItemType = ref({'A': false, 'B': false, 'C':false})

  watch(itemType, () => {
    let filteredItems = [];

    // 處理顯示疾病相關、過往理賠、保單資訊資料
    highRiskItems.value.forEach(element => {
      for(let key in element){
        if(key.charAt(0) === itemType.value){
          filteredItems.push(element[key]);
        }

        // 處理驚嘆號icon顯示
        existItemType.value[key.charAt(0)] = true;
      }
    });

    setPageData(filteredItems);
  }, {immediate: true});

  // 開啟注意事項
  const openRiskScoreNoticeItemModal = () => {
    isShowRiskScoreNoticeItemModal.value=true;
  };

  // 切換顯示類別
  const onClickItem = (type) => {
    itemType.value = type;
  }

  // 同意、不同意
  const onClickOpinion = (value) => {
    isAgree.value = value;
  };

  // 確認
  const onSubmit = async () => {
    if(isAgree.value === 'N' & isEmpty(uptResn.value)){
      $swal.warning("不同意必須輸入文字回饋才可按確認。");
      return;
    }

    try {
      decisionStore.showLoading();

      const saveData = {
        javaClass: 'java.util.Map',
        APLY_NO: aplyNo.value,
        IS_AGREE: isAgree.value,
        UPT_RESN: uptResn.value
      };

      await decisionStore.doConfirm(saveData);
      props.close();
    } catch (e) {
      $swal.fail(e);
    } finally {
      decisionStore.hideLoading();
    }
  };
</script>
<style lang="scss" scoped></style>
