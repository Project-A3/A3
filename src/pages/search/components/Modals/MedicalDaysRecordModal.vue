<template>
  <Modal>
    <template v-slot:title>醫療天數紀錄</template>
    <template v-slot:content>
      <!-- Info-->
      <div class="data-horizontal-info">
        <div class="columns">
          <div class="column is-7">
            <span class="field">受理編號</span>
            <span class="data">{{ props.data.APLY_NO }}</span>
          </div>
          <div class="column is-5">
            <span class="field">保單號碼</span>
            <span class="data">{{ props.data.POLICY_NO }}</span>
          </div>
        </div>
        <div class="columns">
          <div class="column is-7">
            <span class="field">給付險別</span>
            <span class="data">{{ props.data.PROD_ID_NAME }}</span>
          </div>
          <div class="column is-5">
            <span class="field">給付項目</span>
            <span class="data">{{ props.data.CLAM_AMT_NAME }}</span>
          </div>
        </div>
      </div>
      <!-- Table -->
      <div class="modal-table">
        <table class="table is-striped-odd is-fullwidth">
          <thead>
            <tr>
              <th class="has-text-centered">序號</th>
              <th>起始日</th>
              <th>終止日</th>
              <th>手術代碼/手術名稱</th>
              <th>骨折代碼</th>
              <th>手術等級</th>
              <th>手術倍數</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(record, index) in props.data.DATA">
              <td class="has-text-centered">{{ index + 1 }}</td>
              <td>{{ getROCDate(record.STR_DATE) }}</td>
              <td>{{ getROCDate(record.END_DATE) }}</td>
              <td>{{ record.OP_CODE }}-{{ record.OP_NAME }}</td>
              <td>{{ isEmpty(record.BONE_CODE) ? '-' : record.BONE_CODE }}</td>
              <td>{{ isEmpty(record.GRAD) ? '-' : record.GRAD }}</td>
              <td>{{ isEmpty(record.OP_RATIO) ? '-' : record.OP_RATIO }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
    <template v-slot:buttons>
      <button class="button is-primary" @click="props.close">確認</button>
    </template>
  </Modal>
</template>
<script setup>
  import { isEmpty } from 'lodash-es';
  import useMoment from '../../../../composables/useMoment';
  import Modal from '~/components/Modal.vue';
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
  console.log(props.data);
</script>
<style lang="scss"></style>
