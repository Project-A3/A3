<template>
  <div class="block user-block">
    <p class="block-title-outside is-invisible">
      <cathay-translate code="Component_UserInfo_001" />
    </p>
    <div class="block-content">
      <div class="user-info">
        <div class="user-name font-eudc">{{ userInfo.EMP_NAME }}</div>
        <div class="user-role">{{ userInfo.POSITION_NAME }}</div>
      </div>

      <div>
        <div class="info-box" v-if="userRole === UserRoleEnum.Decd">
          <span><cathay-translate code="Component_UserInfo_002" /></span>
          <b>{{ userInfo.CASE_CNT }}</b>
        </div>
        <div class="dropdown item-no-hover select-no-close">
          <div v-if="businessAgents.length > 0" class="dropdown-trigger">
            <button class="button" aria-haspopup="true" aria-controls="dropdown-menu">
              <span class="font-eudc">{{ checkedAgentsName }}</span>
              <img src="/src/assets/images/icon-arrow-down.svg" alt="ARROW DOWN" />
            </button>
          </div>
          <div class="dropdown-menu" role="menu">
            <div class="dropdown-content">
              <a
                v-for="businessAgent in businessAgents"
                :key="businessAgent.AGNT_ID"
                class="dropdown-item"
              >
                <div class="md-checkbox">
                  <input
                    :id="businessAgent.AGNT_ID"
                    type="checkbox"
                    :value="businessAgent.AGNT_ID"
                    v-model="checkedAgents"
                    :disabled="
                      checkedAgents.length === 1 &&
                      checkedAgents[0] === businessAgent.AGNT_ID
                    "
                  />
                  <label :for="businessAgent.AGNT_ID">
                    <span v-if="businessAgent.AGNT_ROLE == '1'" class="font-eudc">{{
                      language.translate("Common_Client_002")
                    }}</span>
                    <span v-else-if="businessAgent.AGNT_ROLE == '2'" class="font-eudc">{{
                      language.translate("Common_Client_003") +
                      "-" +
                      businessAgent.SHOW_NAME
                    }}</span>
                    <span v-else-if="businessAgent.AGNT_ROLE == '3'" class="font-eudc">{{
                      language.translate("Common_Client_008") +
                      "-" +
                      businessAgent.SHOW_NAME
                    }}</span>
                  </label>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { debouncedWatch } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { UserRoleEnum } from "~/common/utils/enum";
import { useHomeStore } from "~/stores/home";
import { useLanguageStore } from "~/stores/language";

const language = useLanguageStore();
const homeStore = useHomeStore();
const { userInfo, userRole, getAllagents, currentBusinessAgents } = storeToRefs(
  homeStore
);

// 代理人 預設只勾個人
const businessAgents = getAllagents.value;
const checkedAgents = ref([businessAgents[0].AGNT_ID]);
sessionStorage.setItem("checkedAgents", checkedAgents.value.join("_"));
// 目前勾選的代理人名稱
const checkedAgentsName = computed(() =>
  businessAgents
    .filter((agent) => checkedAgents.value.includes(agent.AGNT_ID))
    .map((agent) => agent.SHOW_NAME ?? language.translate("Common_Client_002"))
    .join(",")
);

// 勾選代理人後要將勾選的代理人帶入參數重新呼叫一次API
debouncedWatch(
  checkedAgents,
  async () => {
    try {
      homeStore.showLoading();
      // console.log('change');
      await homeStore.changeBusinessAgents(checkedAgents.value);
      // 預設先清除
      sessionStorage.removeItem("checkedAgents");
      sessionStorage.setItem("checkedAgents", checkedAgents.value.join("_"));
    } catch (e) {
      throw e;
    } finally {
      homeStore.hideLoading();
    }
  },
  { debounce: 100 }
);

defineExpose({
  userInfo,
  businessAgents,
  checkedAgents,
  checkedAgentsName,
  userRole,
  UserRoleEnum,
});
</script>
<style lang="scss"></style>
