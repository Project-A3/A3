<template>
  <div class="header-info-avatar">
    <Tippy
      trigger="click"
      hideOnClick="toggle"
      :interactive="true"
      theme="treesure"
      :zIndex="999"
      :onMount="onTippyMount"
      :maxWidth="464"
      :onShow="onTippyShow"
      :onHide="onTippyHide"
      :onClickOutside="onClickOutsideTippy"
    >
      <img id="avatartOpenTreeMenu" src="/src/assets/images/btn-kiwi-search.svg" alt="AVATAR" />
      <template #content>
        <div class="treesure" id="treesure">
          <div class="field has-addons search">
            <div class="control">
              <input v-model="inputSearch" class="input" type="search" placeholder="請輸入查詢關鍵字" />
              <p class="has-text-danger pl-1 mt-1">{{ inValidMessage }}</p>
            </div>
            <div class="control">
              <button :class="buttonClass" @click="onClickSearch">搜尋</button>
            </div>
          </div>
          <div class="treesure-tab">
            <div class="tabs">
              <ul>
                <li class="is-active" data-content="evaluationTabContent" @click="onClickMedical">
                  <a>醫鑑({{ result.apprs_mapList.length }})</a>
                </li>
                <li data-content="reviewTabContent">
                  <a>審核要點({{ result.cfmKeyPoint_mapList.length }})</a>
                </li>
                <li class="is-link" @click="onClickNotice"><a>通知要點</a></li>
                <li class="is-link" @click="onClickWiki"><a>Wiki</a></li>
              </ul>
              <section v-show="hasResult">
                <div class="tab-content is-active" id="evaluationTabContent">
                  <div class="evaluation-list">
                    <div class="evaluation-list-item" v-for="appr in result.apprs_mapList" :key="appr.APPRS_NO">
                      <h2>{{ appr.APPRS_NO }}</h2>
                      <div>
                        <h3>手術名稱</h3>
                        <strong>{{ appr.OP_NAME }}</strong>
                      </div>
                      <div>
                        <h3>病歷重點</h3>
                        <span>{{ appr.ANALYSIS_MEMO }}</span>
                      </div>
                      <div>
                        <h3>保戶姓名</h3>
                        <span>{{ appr.APPRS_NAME }}</span>
                      </div>
                      <div>
                        <h3>詢問醫師</h3>
                        <span>{{ appr.DOCTOR_NAME }}</span>
                        <h3>醫鑑進度</h3>
                        <span>{{ appr.APPRS_PRGS_NAME }}</span>
                      </div>
                      <a
                        :href="`/AHWeb/servlet/HttpDispatcher/AHG0_0300/query?newTxRequest=true&APLY_NO=${appr.APLY_NO}&APPRS_NO=${appr.APPRS_NO}&SER_NO=${appr.SER_NO}`"
                        target="_blank"
                        class="button-open-web"
                      >
                        <svg></svg>
                      </a>
                    </div>
                  </div>
                </div>
                <div class="tab-content" id="reviewTabContent">
                  <div class="list">
                    <div class="list-item" v-for="cfm in result.cfmKeyPoint_mapList" :key="cfm.DOC_NO">
                      <div class="wrap">
                        <h3>{{ cfm.DOC_NAME }}</h3>
                        <p>{{ cfm.NOTE }}</p>
                      </div>
                      <a href="javascript:void(0)" class="button-open-web"><svg></svg></a>
                    </div>
                  </div>
                </div>
                <!-- <div class="tab-content" id="informTabContent"></div>
                <div class="tab-content" id="wikiTabContent"></div> -->
              </section>
            </div>
          </div>
        </div>
      </template>
    </Tippy>
  </div>
  <div class="is-overlay" v-if="isShowOverlay"></div>
</template>
<script setup>
  import { Tippy } from 'vue-tippy';
  import { apiSecretarySearch } from '~/common/api';
  import { initTabs } from '~/common/ui/tab';
  import useSwal from '~/composables/useSwal';
  const { $swal } = useSwal();
  const isShowOverlay = ref(false);
  const isLoading = ref(false);
  const hasResult = ref(false);
  const inputSearch = ref('');
  const result = ref({ apprs_mapList: [], cfmKeyPoint_mapList: [] });
  const inValidMessage = ref('');

  const buttonClass = reactive({
    button: true,
    'is-primary': true,
    'button-treesure-search': true,
    'is-loading': isLoading
  });

  const onTippyMount = () => {
    initTabs(document.getElementById('treesure'));
  };

  const onTippyShow = () => {
    isShowOverlay.value = true;
  };

  const onClickOutsideTippy = (t, e) => {
    if (e.target.closest('.swal2-container')) return;
    t.hide();
  };

  const onTippyHide = (v) => {
    console.log(v);
    isShowOverlay.value = false;
    // 恢復成預設樣子
    hasResult.value = false;
    result.value = { apprs_mapList: [], cfmKeyPoint_mapList: [] };
    inputSearch.value = '';
    inValidMessage.value = '';
  };

  const onClickSearch = async () => {
    if (inputSearch.value === '') {
      inValidMessage.value = '不能為空白';
      return;
    }

    isLoading.value = true;
    inValidMessage.value = '';
    const response = await apiSecretarySearch([inputSearch.value]);
    if (response.data?.result?.IS_SUCCESS) {
      // result.value = response.data?.result;
      let apprs = response.data?.result?.apprs_mapList ?? [];
      let cfms = response.data?.result?.cfmKeyPoint_mapList ?? [];
      result.value.apprs_mapList = apprs;
      result.value.cfmKeyPoint_mapList = cfms;
      hasResult.value = true;
      isLoading.value = false;
    } else {
      // 查無資料處理
      console.log(response.data.result.RTN_MSG);
      isLoading.value = false;
      $swal.fail(response.data.result.RTN_MSG);
    }
  };

  const onClickNotice = () => {
    window.open('https://agent2.cathaylife.com.tw/PDAX/PDAXF100');
  };

  const onClickWiki = () => {
    window.open('http://wiki.cathaylife.com.tw/8700200/index.php/%E9%A6%96%E9%A0%81');
  };

  const onClickMedical = () => {
    window.open('/AHWeb/servlet/HttpDispatcher/AHG0_0100/prompt');
  };
</script>

<style lang="scss" scoped>
  .is-overlay {
    position: fixed;
    top: 50px;
  }
</style>
