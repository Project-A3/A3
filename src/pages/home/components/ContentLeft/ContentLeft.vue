<template>
  <section>
    <div class="filter-area">
      <UserInfo></UserInfo>
      <WaitApprove></WaitApprove>
      <OtherFilter></OtherFilter>
    </div>
    <CaseTable></CaseTable>
    <div class="button-scroll-to-top"><cathay-translate code="Common_GO_TOP" /></div>
  </section>
</template>

<script setup>
  import CaseTable from './CaseTable.vue';
import OtherFilter from './OtherFilter.vue';
import UserInfo from './UserInfo.vue';
import WaitApprove from './WaitApprove.vue';
</script>
