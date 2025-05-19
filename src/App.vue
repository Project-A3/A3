<template>
  <div class="error" v-if="error">
    {{ error }}
  </div>
  <router-view v-else v-slot="{ Component }">
    <template v-if="Component">
      <keep-alive :max="1">
        <suspense>
          <component :is="Component"></component>
          <template #fallback>
            <Loading :active="true" :can-cancel="false" :is-full-page="true" color="#6fba2a"></Loading>
          </template>
        </suspense>
      </keep-alive>
    </template>
  </router-view>
  
  <ModalContainer />
  <Loading :active="isLoading" :can-cancel="false" :is-full-page="true" color="#6fba2a"></Loading>
</template>

<script>
  // Import component
  import Loading from 'vue-loading-overlay';
  // Import stylesheet
  import { onMounted } from 'vue';
import 'vue-loading-overlay/dist/vue-loading.css';
import { useLanguageStore } from '~/stores/language';
import useSwal from './composables/useSwal';
import ModalContainer from './components/ModalContainer.vue';
  
  const { $swal } = useSwal();

  export default {
    setup(props) {
      const language = useLanguageStore();
      // 每個頁面會用到的Loading
      const isLoading = computed(() => inject('isLoading').value);
      // Global error handler
      const error = ref(null);
      onErrorCaptured((e, instance, info) => {
        console.error('There is an error: ', e.message,'instance',instance,'info',info);
        console.log(instance);
        console.log(info);
        let errorMessage = e.toString().includes('呼叫API異常') ? e : language.translate('App_001');
        error.value = errorMessage;
        inject('isLoading').value = false;
        $swal.fail(errorMessage);
      });

      onMounted(async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const lang = urlParams.get('lang') || import.meta.env.CATHAYLIFE_VITE_Language;
        await language.switchLanguage(lang);
      });

      return {
        isLoading,
        error
      };
    },
    components: {
      Loading,
      ModalContainer
    }
  };
</script>

<style lang="scss">
  #app {
    // overflow-x: auto;
    // TODO: 到時候要改成error component
    .error {
      color: red;
      font-size: 25px;
      text-align: center;
    }
  }
</style>
