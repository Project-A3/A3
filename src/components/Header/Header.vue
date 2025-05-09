<template>
  <header>
    <HeaderLogo></HeaderLogo>
    <div class="header-gradient"><p>{{serverName}}</p></div>
    <div class="header-info">
      <HeaderNav v-if="props.currentActiveTab !== ''" :currentActiveTab="props.currentActiveTab"></HeaderNav>
      <HeaderLanguage></HeaderLanguage>
      <!--<HeaderSearch></HeaderSearch>-->
    </div>
  </header>
</template>

<script setup>
  import { apiGetServerName } from '../../../src/common/api/index.js';
import HeaderLanguage from './HeaderLanguage.vue';
import HeaderLogo from './HeaderLogo.vue';
import HeaderNav from './HeaderNav.vue';
import HeaderSearch from './HeaderSearch.vue';

  const props = defineProps({
    // OVERVIEW: 保單概況, APPLY: 申請資料
    currentActiveTab: {
      type: String,
      required: false,
      default: ''
    }
  });
   
  const response = await apiGetServerName();
  const result = response.data.result;
  const serverName = result.SERVER_NAME;
</script>
