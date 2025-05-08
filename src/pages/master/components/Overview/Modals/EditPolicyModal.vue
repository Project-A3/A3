<template>
  <Modal>
    <template v-slot:title>編輯確認保單</template>
    <template v-slot:content>
      <!-- 資料列表 -->
      <div class="modal-table">
        <table class="table is-striped-odd is-fullwidth">
          <thead>
            <tr class="scroll-fix">
              <SortingThead
                class="has-text-centered"
                sortKey="SYS_NO"
                width="120"
                :currentSortKey="sortName"
                :isSortDesc="isSortDesc"
                :onClickSort="setSort"
                >業務別
              </SortingThead>
              <th>保單號碼</th>
              <th class="has-text-right">保額</th>
              <th>單位</th>
              <th>險別</th>
              <th>投保(復效)日期</th>
              <th class="has-text-centered" v-if="showRoleName">關係</th>
              <template v-if="isGroupInsurance">
                <th class="has-text-centered">批註</th>
                <th class="has-text-centered">等級/補助</th>
              </template>
              <template v-else>
                <th class="has-text-centered">除外</th>
                <th>下次應繳日</th>
              </template>
              <th class="has-text-centered">
                <label class="is-light" @click.prevent="toggleSelectAllPolicy">
                  <input class="select-all" type="checkbox" :checked="isSelectedAll" />
                  <span>全選</span>
                </label>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="policy in policies" :class="{ checked: policy.SELECT === 'Y' }">
              <td class="has-text-centered">{{ policy.SYS_NAME_SHOW }}</td>
              <td>
                {{ policy.POLICY_NO_SHOW }}
              </td>
              <td class="has-text-right" style="padding-right: 10px">{{ policy.FACE_AMT }}</td>
              <td class="has-text-left">{{ policy.FACE_AMT_UNIT }}</td>
              <td>
                {{ policy.PROD_NAME }}
              </td>
              <td class="has-text-centered">
                <p :style="{ color: `${handleTextColor(policy.ISSUE_DATE_COLOR)}` }">{{ getROCDate(policy.ISSUE_DATE) }}</p>
              </td>
              <td class="has-text-centered" v-if="showRoleName">{{ policy.ROLE_NAME }}</td>
              <td class="has-text-centered">
                <template v-if="isGroupInsurance">{{ policy.HAS_SPEC }}</template>
                <template v-else>{{ policy.EXCL_CODE }}</template>
              </td>
              <td class="has-text-centered">
                <p v-if="isGroupInsurance">{{ policy.RET_DEGREE }}</p>
                <p :style="{ color: `${handleTextColor(policy.RNXT_PAY_DATE_COLOR)}` }" v-else>
                  {{ getROCDate(policy.RNXT_PAY_DATE) }}
                </p>
              </td>
              <td class="has-text-centered">
                <label class="is-dark" @click.prevent="toggleSelectPolicy(policy)">
                  <input type="checkbox" :checked="policy.SELECT === 'Y'" />
                  <span></span>
                </label>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
    <template v-slot:buttons>
      <button class="button is-light" @click="props.close">取消</button>
      <button class="button is-primary" @click="onSubmit">儲存</button>
    </template>
  </Modal>
</template>
<script setup>
  import { cloneDeep, isEmpty } from 'lodash-es';
  import useMoment from '~/composables/useMoment.js';
  import { useOverviewStore } from '~/stores/overview.js';
  import { useApplyStore } from '~/stores/apply';
  import Modal from '~/components/Modal.vue';
  import useSwal from '~/composables/useSwal';
  import SortingThead from '~/components/SortingThead.vue';
  import useTableSort from '~/composables/useTableSort';

  const { getROCDate } = useMoment();
  const overviewStore = useOverviewStore();
  const applyStore = useApplyStore();
  const { $swal } = useSwal();
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
  // console.log(props.data);

  // 是否為學團險
  const isGroupInsurance = computed(() => overviewStore.isGroupInsurance);

  // 複製一份，送出成功再更新真正的policies Data
  const policies = ref(cloneDeep(props.data?.policies));
  const handleTextColor = (color) => (!isEmpty(color) ? color.toLowerCase() : 'black');
  // 單選
  const toggleSelectPolicy = (policy) => {
    policy.SELECT = policy.SELECT === 'Y' ? 'N' : 'Y';
  };
  // 是否全選
  const isSelectedAll = computed(() => policies.value.every((e) => e.SELECT === 'Y'));
  // 全選
  const toggleSelectAllPolicy = () => {
    const setSelected = !isSelectedAll.value ? 'Y' : 'N';
    policies.value.forEach((policy) => {
      policy.SELECT = setSelected;
    });
  };

  const showRoleName = computed(() => (applyStore.isLifeGroup && applyStore.reviewerInfo?.STEP_STS === '1'));

  // 排序相關
  const { sortName, isSortDesc, setSort } = useTableSort(policies);

  // 送出
  const onSubmit = async () => {
    try {
      overviewStore.showLoading();
      const checkResult = await overviewStore.savePolicyInfoCheck(props.data?.applyNo, policies.value);
      if (checkResult.IS_SUCCESS) {
        // 檢核通過，直接儲存
        if (checkResult.RTN_CODE == '0') {
          await saveData();
        } else {
          overviewStore.hideLoading();
          // 檢核通過，需再確認是否儲存
          let prompt = await $swal.confirmAsync(checkResult.RTN_MSG);
          if (prompt.isConfirmed) {
            overviewStore.showLoading();
            await saveData();
          }
        }
        props.close();
      } else {
        throw checkResult.RTN_MSG;
      }
    } catch (e) {
      $swal.fail(e);
    } finally {
      overviewStore.hideLoading();
    }
  };

  // 儲存保單資料
  const saveData = async () => {
    const saveResult = await overviewStore.savePolicyInfo(props.data.applyNo, policies.value);
    if (!saveResult.IS_SUCCESS) throw saveResult.RTN_MSG;
    // 更新Store資料
    overviewStore.setPolicies(policies.value);
    // 都成功就呼叫API Reload Data
    await overviewStore.reloadPolicyInfoData(props.data?.applyNo);
    // 有成功訊息就顯示成功訊息
    if (saveResult.RTN_MSG) {
      $swal.success(saveResult.RTN_MSG);
    }
  };
</script>
