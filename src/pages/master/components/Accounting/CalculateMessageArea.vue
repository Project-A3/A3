<template>
  <!-- Thirdly Card -->
  <div class="card is-full thirdly-card is-expanded">
    <!-- 展開/收合 Button -->
    <button class="card-toggle-btn expand"></button>

    <div class="columns card-title">
      <div class="column p-0">
        <h3>試算訊息</h3>
        <label class="is-dark">
          <input type="checkbox" id="cbShowAllMessage" @change="onShowAllCheckChanged" />
          <span>顯示全部訊息</span>
        </label>
      </div>
    </div>

    <div class="hidden-parts">
      <div class="table-content">
        <table class="table is-fullwidth">
          <thead class="no-wrap-title">
            <tr class="scroll-fix">
              <th class="">保單號碼</th>
              <th class="">險別</th>
              <th>訊息內容</th>
              <th class="has-text-centered hor-ver-center">
                程式
                <div class="eye-toggle" @click="toggleAllProgName">
                  <svg
                    :class="['eye-toggle-icon', { open: showingMessages.length > 0 && showingMessages[0].IS_SHOW_PROG }]"
                  ></svg>
                </div>
              </th>
            </tr>
          </thead>
          <tbody v-for="message in showingMessages">
            <tr>
              <td>{{ message.POLICY_NO }}</td>
              <td>{{ message.PROD_ID }}</td>
              <td class="font-eudc" :class="{ 'has-text-link': message.LEVEL === '0', 'has-text-danger': message.LEVEL > 1 }">
                {{ message.MESG }}
              </td>
              <td>
                <span class="eye-toggle-info" v-if="message.IS_SHOW_PROG">{{ message.PROG_NAME }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
  import useSwal from '~/composables/useSwal';
  import { useAccountingStore } from '~/stores/accounting.js';
  const { $swal } = useSwal();
  const accountingStore = useAccountingStore();
  const props = defineProps({
    applyNo: {
      type: String,
      required: true,
      default: ''
    },
    messages: {
      type: Array,
      required: true,
      default: []
    }
  });
  console.log(props.messages);
  const showingMessages = ref({});
  watchEffect(() => { 
    showingMessages.value = props.messages.map((m) => ({
      IS_SHOW_PROG: false,
      ...m
    }));
  });
  console.log(props.messages);

  const onShowAllCheckChanged = async (event) => {
    try {
      accountingStore.showLoading();
      const messages = await accountingStore.getCalcMessages(props.applyNo, event.target.checked);
      showingMessages.value = messages.map((m) => ({
        IS_SHOW_PROG: false,
        ...m
      }));
    } catch (e) {
      $swal.fail(e);
    } finally {
      accountingStore.hideLoading();
    }
  };

  const toggleAllProgName = () => showingMessages.value.forEach((m) => (m.IS_SHOW_PROG = !m.IS_SHOW_PROG));
</script>

<style lang="scss" scoped></style>
