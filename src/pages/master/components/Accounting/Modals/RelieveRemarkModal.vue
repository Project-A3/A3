<template>
  <Modal disableOverflow>
    <template v-slot:title>解除註記</template>
    <template v-slot:content>
      <p class="modal-subtitle">受理編號 {{ props.data.applyNo }}</p>
      <div class="modal-table">
        <table class="table is-fullwidth is-striped-odd">
          <thead>
            <tr>
              <th>時效起日</th>
              <th>保單號碼</th>
              <th>輸入人員ID</th>
              <th>輸入人員姓名</th>
              <th>輸入日期</th>
              <th>處理日期</th>
              <th>簽擬日期</th>
              <th class="has-text-centered" v-if="!applyStore.isManager">刪除</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="relieveRemark in relieveRemarks" :key="relieveRemark.SER_NO">
              <td>
                <DatetimePicker v-model="relieveRemark.STR_DATE" v-if="!applyStore.isManager && !isReadonly"></DatetimePicker>
                <span v-else>{{ relieveRemark.STR_DATE }}</span>
              </td>
              <td>
                <BaseDropdown
                  v-if="!applyStore.isManager"
                  class="fix-content"
                  :class="{ disabled: isReadonly }"
                  :options="relieveRemark.policyOptions"
                  :onSelected="
                    (value) => {
                      onPolicySelected(value, relieveRemark);
                    }
                  "
                ></BaseDropdown>
                <span v-else>{{ relieveRemark.POLICY_NO }}</span>
              </td>
              <td>{{ relieveRemark.INPUT_ID }}</td>
              <td>{{ relieveRemark.INPUT_NAME }}</td>
              <td>{{ getROCDate(relieveRemark.INPUT_DATE) }}</td>
              <td>{{ getROCDate(relieveRemark.PROC_DATE) }}</td>
              <td>
                <span :class="{ 'is-grey': !relieveRemark.ASSIGNED_DATE }">
                  {{ relieveRemark.ASSIGNED_DATE ? getROCDate(relieveRemark.ASSIGNED_DATE) : '-' }}
                </span>
              </td>
              <td class="has-text-centered" v-if="!applyStore.isManager">
                <button
                  class="button icon trash"
                  @click="onClickDelete(relieveRemark)"
                  v-if="relieveRemark.BTN_UPDATE === 'Y'"
                  :disabled="isReadonly"
                ></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="columns">
        <div class="column hor-right p-0">
          <button class="button is-primary has-icon-back has-icon-back-add" @click="addRelieveRemark" :disabled="isReadonly">
            新增
          </button>
        </div>
      </div>
    </template>
    <template v-slot:buttons>
      <button class="button is-light close-modal" @click="props.close">取消</button>
      <button class="button is-primary close-modal" @click="onSubmit" v-if="!applyStore.isManager" :disabled="isReadonly">
        儲存
      </button>
    </template>
  </Modal>
</template>

<script setup>
  import Modal from '~/components/Modal.vue';
  import useMoment from '~/composables/useMoment';
  import useSwal from '~/composables/useSwal';
  import { useAccountingStore } from '~/stores/accounting';
  import DatetimePicker from '~/components/DatetimePicker.vue';
  import { pull } from 'lodash-es';
  import BaseDropdown from '~/components/BaseDropdown.vue';
  import { useApplyStore } from '~/stores/apply';
  import { sequence } from '~/common/utils';
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

  const { getROCDate } = useMoment();
  const { $swal } = useSwal();
  const applyStore = useApplyStore();
  const accountingStore = useAccountingStore();
  const relieveRemarks = ref([]);
  const policies = ref([]);
  const isReadonly = inject('IsReadonly');
  const apiApplyNo = ref(null);
  try {
    accountingStore.showLoading();
    const result = await accountingStore.getRelieveRemarks(props.data.applyNo);
    console.log(result);
    relieveRemarks.value = result.DATA;
    apiApplyNo.value = result.APLY_NO;
    policies.value = await accountingStore.getPolicies(props.data.applyNo);
    relieveRemarks.value.forEach((remark) => {
      // 處理保單下拉選單
      remark.policyOptions = policies.value.map((p) => ({
        name: p.POLICY_NO,
        value: p.POLICY_NO,
        selected: p.POLICY_NO === remark.POLICY_NO
      }));
      if (!remark.POLICY_NO) {
        remark.policyOptions.unshift({
          name: '請選擇保單',
          value: '',
          disabled: true,
          selected: true
        });
      }
    });
  } catch (e) {
    $swal.fail(e);
  } finally {
    accountingStore.hideLoading();
  }

  // 選擇保單
  const onPolicySelected = (policyNo, relieveRemark) => {
    relieveRemark.POLICY_NO = policyNo;
  };

  // 刪除
  const onClickDelete = (relieveRemark) => {
    pull(relieveRemarks.value, relieveRemark);
  };

  // 新增
  const addRelieveRemark = () => {
    const serNo = sequence(relieveRemarks.value, 'SER_NO');
    let template = {
      APRV_DATE: null,
      CLAM_NAME: null,
      INPUT_ID: '',
      CLAM_DATE: null,
      PROC_ID: '',
      ASSIGNED_EMP_NAME: null,
      SER_NO: serNo.toString(),
      RMK_KIND: '',
      APRV_NAME: null,
      APLY_NO: props.data.applyNo,
      PROC_APLY_NO: '',
      INPUT_NAME: '',
      INPUT_DATE: '',
      CLAM_ID: null,
      ASSIGNED_DATE: null,
      POLICY_NO: '',
      BTN_UPDATE: 'Y',
      APRV_ID: null,
      PROC_NAME: '',
      STR_DATE: '',
      ASSIGNED_EMP_ID: null,
      PROC_DATE: '',
      javaClass: 'com.cathay.aa.bo.DTAAK004_TEMP',
      OCR_NAME: '',
      policyOptions: []
    };
    template.policyOptions = policies.value.map((p) => ({
      name: p.POLICY_NO,
      value: p.POLICY_NO
    }));
    template.policyOptions.unshift({
      name: '請選擇保單',
      value: '',
      disabled: true,
      selected: true
    });
    relieveRemarks.value.push(template);
  };

  // 送出
  const onSubmit = async () => {
    try {
      accountingStore.showLoading();
      if (relieveRemarks.value.some((r) => !r.STR_DATE)) {
        $swal.warning('請確定起始日期都有填寫');
        return;
      } else if (relieveRemarks.value.some((r) => !r.POLICY_NO)) {
        $swal.warning('請確定保單編號都有填寫');
        return;
      }
      const message = await accountingStore.saveRelieveRemarks(relieveRemarks.value, apiApplyNo.value ?? props.data.applyNo);
      $swal.success(message ? message : '儲存成功');
      props.close();
    } catch (e) {
      $swal.fail(e);
    } finally {
      accountingStore.hideLoading();
    }
  };
</script>

<style lang="scss"></style>
