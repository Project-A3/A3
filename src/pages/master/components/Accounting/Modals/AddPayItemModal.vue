<template>
  <Modal>
    <template v-slot:title>新增核付項目</template>
    <template v-slot:content>
      <!-- 資料列表 -->
      <div class="table-title">投保明細</div>
      <div class="modal-table">
        <table class="table is-striped-odd is-fullwidth">
          <thead>
            <tr>
              <th>保單號碼</th>
              <th>險別</th>
              <th class="has-text-centered">約別</th>
              <th class="has-text-right">保額</th>
              <th>單位</th>
              <th>索賠類別</th>
              <th>理賠項目</th>
              <th class="has-text-centered">
                <label class="is-light">
                  <input
                    class="select-all"
                    type="checkbox"
                    :checked="policies && policies.length > 0 && policies.every((p) => p.IS_CHECKED)"
                    @change="handleCheckAll"
                  />
                  <span>處理</span>
                </label>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(policy, index) in policies" :key="policy.PROD_ID" :class="{ checked: policy.IS_CHECKED }">
              <td>
                <span v-if="index === 0">{{ policy.POLICY_NO }}</span>
                <span v-else-if="policies[index - 1].POLICY_NO === policy.POLICY_NO"></span>
                <span v-else>{{ policy.POLICY_NO }}</span>
              </td>
              <td class="font-eudc">{{ policy.PROD_ID }} {{ policy.PROD_ID_NAME }}</td>
              <td class="has-text-centered">{{ policy.PROD_KIND == '1' ? '主' : '附' }}</td>
              <td class="has-text-right">{{ policy.FACE_AMT }}</td>
              <td class="has-text-left">{{ policy.FACE_AMT_UNIT_NAME }}</td>
              <td class="w-17">
                <FormDropdown
                  class="category height-limit"
                  :options="policy.CLAM_CAT_OPTIONS"
                  v-model="policy.CLAM_CAT"
                ></FormDropdown>
              </td>
              <td class="w-10">
                <FormDropdown
                  class="item height-limit"
                  :options="policy.CLAM_AMT_OPTIONS"
                  :isLoading="policy.CLAM_AMT_LOADING"
                  :watchValue="policy.CLAM_CAT"
                  :onRefreshOptions="
                    (selectedClamCat) => {
                      onRefreshClamAmtOptions(selectedClamCat, policy);
                    }
                  "
                  v-model="policy.CLAM_AMT_CODE"
                ></FormDropdown>
              </td>
              <td class="has-text-centered">
                <label class="is-dark">
                  <input type="checkbox" v-model="policy.IS_CHECKED" />
                  <span></span>
                </label>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="columns">
          <div class="column hor-right">
            <button class="button is-primary is-outline" @click="onClickAdd">新增</button>
          </div>
        </div>
      </div>

      <!-- 資料列表 -->
      <div class="table-title">新增項目</div>
      <div class="modal-table">
        <table class="table is-striped-odd is-fullwidth">
          <thead>
            <tr class="">
              <th class="">序號</th>
              <th class="">保單號碼</th>
              <th>險別</th>
              <th class="has-text-centered">約別</th>
              <th class="has-text-right">保額</th>
              <th>單位</th>
              <th>索賠類別</th>
              <th>理賠項目</th>
              <th class="has-text-centered">刪除</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(policy, index) in addedPayItems" :key="policy.PROD_ID">
              <td>{{ index + 1 }}</td>
              <td>
                <span>{{ policy.POLICY_NO }}</span>
              </td>
              <td class="font-eudc">{{ policy.PROD_ID_NAME }}</td>
              <td class="has-text-centered">{{ policy.PROD_KIND == '1' ? '主' : '附' }}</td>
              <td class="has-text-right">{{ policy.FACE_AMT }}</td>
              <td class="has-text-left">{{ policy.FACE_AMT_UNIT_NAME }}</td>
              <td class="w-17">
                <span>{{ policy.CLAM_CAT_NAME ? policy.CLAM_CAT_NAME : policy.CLAM_CAT }}</span>
              </td>
              <td>
                <span class="font-eudc" v-if="policy.CLAM_AMT_CODE">{{ policy.CLAM_AMT_NAME }}</span>
              </td>
              <td class="has-text-centered">
                <button class="button icon trash" @click="onClickDelete(policy)"></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
    <template v-slot:buttons>
      <button class="button is-light close-modal" @click="props.close">取消</button>
      <button class="button is-primary close-modal" :disabled="addedPayItems.length <= 0" @click="onSubmit">確認</button>
    </template>
  </Modal>
</template>

<script setup>
  import Modal from '~/components/Modal.vue';
  import useSwal from '~/composables/useSwal';
  import { useAccountingStore } from '~/stores/accounting';
  import FormDropdown from '~/components/Form/FormDropdown.vue';
  import { cloneDeep, pull, sortBy } from 'lodash-es';
  import { uuid } from '~/common/utils';
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
  const { $swal } = useSwal();

  const accountingStore = useAccountingStore();
  // API取得的投保保單
  const policies = ref([]);

  // 新增的核付項目: 預設帶入所有MAN_ISRT_IND的資料 => 0901_Q2改成預設帶空的
  const addedPayItems = ref([]);
  // console.log(addedPayItems);
  // 取得索賠類別預設下拉選單選項
  const getClaimCategoryOptions = (claimCategories) => {
    const options = claimCategories.map((c, index) => ({
      name: c.CLAM_CAT_NAME,
      value: c.CLAM_CAT
    }));
    options.unshift({
      name: '請選擇',
      disabled: true,
      value: ''
    });
    return options;
  };

  // 取得理賠項目預設下拉選單選項
  const getClaimAmtOptions = async (policy, clamCat) => {
    // 不再從API取得
    // const claimAmts = await accountingStore.getClaimAmts(prodId, clamCat);
    const claimAmts = policy.CLAM_CAT_INFO.find((c) => c.CLAM_CAT === clamCat)?.CLAM_AMT_INFO;
    if (!claimAmts) return [];
    const options = claimAmts.map((c) => ({
      name: c.CLAM_AMT_NAME,
      value: c.CLAM_AMT_CODE
    }));
    options.unshift({
      name: '請選擇',
      disabled: true,
      selected: true,
      value: ''
    });
    return options;
  };
  // 刷新理賠項目下拉選單
  const onRefreshClamAmtOptions = async (selectedClamCat, policy) => {
    policy.CLAM_AMT_LOADING = true;
    const options = await getClaimAmtOptions(policy, selectedClamCat);
    // debugger;
    policy.CLAM_AMT_OPTIONS = options;
    policy.CLAM_AMT_CODE = '';
    policy.CLAM_AMT_LOADING = false;
  };

  // 取得畫面上資料
  try {
    accountingStore.showLoading();
    const insuranceDetail = await accountingStore.getInsuranceDetail(props.data.applyNo);
    policies.value = sortBy(insuranceDetail.POLICY_INFO, ['POLICY_NO']);
    policies.value.forEach((policy) => {
      policy.CLAM_CAT = '';
      policy.CLAM_CAT_OPTIONS = getClaimCategoryOptions(policy.CLAM_CAT_INFO);
      policy.CLAM_AMT_CODE = '';
      policy.CLAM_AMT_OPTIONS = [{ name: '請選擇', value: '', disabled: true }];
      policy.CLAM_AMT_LOADING = false;
      policy.IS_CHECKED = false;
      // 新增的預設值統一帶0
      policy.PAY_AMT = '0';
      policy.TRIL_CALC_AMT = '0';
      policy.UUID = uuid();
    });
    console.log(insuranceDetail.value);
  } catch (e) {
    $swal.fail(e);
  } finally {
    accountingStore.hideLoading();
  }

  // 點擊新增
  const onClickAdd = () => {
    let isValid = true;
    let insClamAmtCode = [];
    policies.value
      .filter((policy) => policy.IS_CHECKED)
      .forEach((policy) => {
        // 檢核是不是都有填寫索賠類別和理賠項目
        if (!policy.CLAM_CAT || !policy.CLAM_AMT_CODE) {
          $swal.fail('請確定勾選的索賠類別和理賠項目都有填寫');
          isValid = false;
          return;
        }

        // 檢核理賠項目是否已經下方新增項目
        else if (
          addedPayItems.value.some(
            (p) =>
              p.POLICY_NO === policy.POLICY_NO &&
              p.PROD_ID === policy.PROD_ID &&
              p.CLAM_CAT === policy.CLAM_CAT &&
              p.CLAM_AMT_CODE === policy.CLAM_AMT_CODE
          )
        ) {
          const clamCatName = policy.CLAM_CAT_OPTIONS.find((o) => o.selected)?.name;
          const clamAmtName = policy.CLAM_AMT_OPTIONS.find((o) => o.selected)?.name;
          $swal.fail(
            `<span class='font-eudc'>新增作業有誤，重複新增理賠項目。保單號碼[${policy.POLICY_NO}] 險別[${policy.PROD_ID} ${policy.PROD_ID_NAME}] 索賠類別[${policy.CLAM_CAT} ${clamCatName}] 理賠項目代碼[${policy.CLAM_AMT_CODE} ${clamAmtName}]</span>`
          );
          isValid = false;
          return;
        }
      });

    if (!isValid) {
      return;
    }

    // 放到下方，並移除上方 => 改成不移除上方，直接複製一份至下方
    const checkedPolicies = cloneDeep(policies.value.filter((p) => p.IS_CHECKED));
    checkedPolicies.forEach((p) => {
      p.CLAM_AMT_NAME = p.CLAM_AMT_OPTIONS.find((o) => o.selected)?.name;
      p.CLAM_CAT_NAME = p.CLAM_CAT_OPTIONS.find((o) => o.selected)?.name;
    });
    addedPayItems.value.push(...checkedPolicies);
    addedPayItems.value = sortBy(addedPayItems.value, ['POLICY_NO']);
    // policies.value = policies.value.filter((p) => !p.IS_CHECKED);
  };

  // 點擊垃圾桶刪除
  const onClickDelete = (policy) => {
    $swal.confirm('確定要刪除嗎?', () => {
      // 還原勾選狀態，避免回去上方後還是勾選 => 改成不放回去上方
      policy.IS_CHECKED = false;
      // policies.value.push(policy);
      // policies.value = sortBy(policies.value, ['POLICY_NO']);
      pull(addedPayItems.value, policy);
    });
  };

  // 全選/全不選
  const handleCheckAll = (event) => policies.value.forEach((policy) => (policy.IS_CHECKED = event.target.checked));

  // 送出
  const onSubmit = async () => {
    try {
      accountingStore.showLoading();
      await accountingStore.creatManualPayItem(props.data.applyNo, addedPayItems.value);
      $swal.success('新增成功');
      props.close();
    } catch (e) {
      $swal.fail(`<span class='font-eudc'>${e}</span>`);
    } finally {
      accountingStore.hideLoading();
    }
  };
</script>

<style lang="scss" scoped></style>
