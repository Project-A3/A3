<template>
  <div class="card signed-history-card" ref="signHistoryArea">
    <!-- 展開/收合 Button -->
    <button class="card-toggle-btn is-blue"></button>

    <div class="card-title">
      <h3>簽呈歷程</h3>
    </div>

    <!-- 收合時 Hidden 區塊-->
    <div class="hidden-parts" style="display: none">
      <div class="columns mb-3">
        <div class="column ml-4">
          <span class="memo">簽呈內容</span>
        </div>
        <div class="column is-narrow hor-right">
          <p class="memo">
            輸入者
            <span>輸入時間</span>
          </p>
        </div>
      </div>

      <div v-for="(signHistories, index1) in signHistoriesLs" :key="index1">
        <div class="history-card" v-for="history in reverse(entries(groupBy(signHistories.SIGN_DATA, 'SIGN_VER')))" :key="index">
          <h2>紀錄{{ history[0] }} ({{ signHistories.APLY_NO  }})</h2>
          <template v-for="sign in history[1]" :key="sign.SHOW_ORDER_LV1">
            <div class="part pb-2" :class="{ 'border-none': sign.SHOW_ORDER_LV1 == 1 }">
              <div class="item">
                <template v-for="detail in sign.SIGN_DETAIL" :key="detail.SHOW_ORDER_LV2">
                  <h3 :class="{ 'mt-4': detail.SHOW_ORDER_LV2 != 1 }" v-if="detail.IS_TITLE === 'Y'"><span class="font-eudc">{{ detail.SIGN_CTX }}</span></h3>
                  <p v-else><span class="font-eudc">{{ detail.SIGN_CTX }}</span></p>
                </template>
              </div>
            </div>
            <div class="part case-officer first-case-officer">
              <div class="officer">
                <p>
                  <span class="font-eudc">{{ sign.SIGN_NAME }}</span><span>{{ getROCDate(sign.SING_TIME, 'MM-DD HH:mm') }}</span>
                </p>
              </div>
            </div>
          </template>
        </div>       
      </div>
    </div>
  </div>
</template>

<script setup>
  import { groupBy, reverse, entries } from 'lodash-es';
  import { toggleCard } from '~/common/utils';
  import useMoment from '~/composables/useMoment';
  import { useDecisionStore } from '~/stores/decision';

  const { getROCDate } = useMoment();
  const decisionStore = useDecisionStore();

  const signHistoriesLs = computed(() => Object.values(decisionStore.signData));
  console.log('===== signHistoriesLs =====');
  console.log(signHistoriesLs);

  const signHistoryArea = ref(null);
  onMounted(() => {
    toggleCard(signHistoryArea.value);
  });
</script>

<style lang="scss" scoped></style>
