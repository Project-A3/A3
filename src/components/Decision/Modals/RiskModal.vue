<template>
  <Modal>
    <template v-slot:title>作業風險-{{ props.data.RISK_TITLE }}</template>
    <template v-slot:content>
      <template v-if="data.SER_NO === 'IAA'">
        <!-- 文字區域 -->
        <div class="info">
          <p>{{ props.data.RISK_NAME }}</p>
        </div>

        <!-- 通訊資料待確認列表 -->
        <div class="modal-table">
          <table class="table is-fullwidth">
            <thead class="is-sticky">
              <tr>
                <th class="has-text-left">ID</th>
                <th class="has-text-left">代碼</th>
                <th class="has-text-left">訊息</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(rltn, index) in props.data.RLTN_List">
                <td class="has-text-left">{{ rltn.ID }}</td>
                <td class="has-text-left">{{ rltn.ERR_CODE }}</td>
                <td class="has-text-left">{{ rltn.ERR_MSG }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
      <template v-else>
        <!-- 文字區域 -->
        <div class="info">
          <p>{{ props.data.RISK_NAME }}</p>
          <p>{{ props.data.RISK_INFO }}</p>
          <p class="time">計算區間 : {{ calDate.start }}~{{ calDate.end }}</p>
        </div>

        <!-- 醫院資料列表 -->
        <div class="modal-table">
          <table class="table is-fullwidth">
            <thead class="is-sticky">
              <tr>
                <th>序號</th>
                <th class="has-text-centered">事故者姓名</th>
                <th class="has-text-centered">事故者ID</th>
                <th class="has-text-centered">該手術理賠次數</th>
                <th class="has-text-centered">受理編號</th>
                <th class="has-text-centered">手術日</th>
                <th>與本案事故者關係</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(rltn, index) in props.data.RLTN_List">
                <td>{{ index + 1 }}</td>
                <td class="has-text-centered">{{ rltn.OCR_NAME }}</td>
                <td class="has-text-centered">{{ rltn.OCR_ID }}</td>
                <td class="has-text-centered">{{ rltn.ID1_CNT }}</td>
                <td class="has-text-centered">{{ rltn.APLY_NO }}</td>
                <td class="has-text-centered">{{ rltn.OCR_DATE }}</td>
                <td>{{ rltn.RLTN_NAME }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </template>
    <template v-slot:buttons>
      <button class="button is-primary" @click="props.close">確認</button>
    </template>
  </Modal>
</template>
<script setup>
  import Modal from '~/components/Modal.vue';
  import useMoment from '~/composables/useMoment';

  const { getROCDate } = useMoment();

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

  const calDate = reactive({ start: new Date(), end: new Date() });

  // 三年前同月的第一天
  calDate.start.setFullYear(new Date().getFullYear() - 3);
  calDate.start.setDate(1);
  calDate.start = getROCDate(calDate.start);

  // 先預設上個月
  calDate.end.setDate(0);
  // 小於16號再上一個月
  calDate.end = new Date().getDate() >= 16 ? getROCDate(calDate.end) : getROCDate(calDate.end.setDate(0));
</script>
<style lang="scss" scoped></style>
