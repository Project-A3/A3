<template>
  <nav class="header-nav">
    <ul>
      <li>
        <a
          data-page="apply"
          href="javascript:void(0)"
          :class="{ active: currentActiveTab === 'APPLY' }"
          @click="onClickNav('APPLY')"
        >
          <cathay-translate code="Component_HeaderNav_001" />
          <img v-if="currentActiveTab === 'APPLY' && currentTabHasError" src="/src/assets/images/icon-warn.svg" alt="ERROR" />
        </a>
      </li>
      <li>
        <a href="javascript:void(0)" :class="{ active: currentActiveTab === 'OVERVIEW' }" @click="onClickNav('OVERVIEW')">
          <cathay-translate code="Component_HeaderNav_002" />
          <img v-if="currentActiveTab === 'OVERVIEW' && (currentTabHasError | overviewHasError)" src="/src/assets/images/icon-warn.svg" alt="ERROR" />
        </a>
      </li>
      <li>
        <a href="javascript:void(0)" :class="{ active: currentActiveTab === 'ACCOUNTING' }" @click="onClickNav('ACCOUNTING')">
          <cathay-translate code="Component_HeaderNav_003" />
          <img
            v-if="currentActiveTab === 'ACCOUNTING' && currentTabHasError"
            src="/src/assets/images/icon-warn.svg"
            alt="ERROR"
          />
        </a>
      </li>
      <li>
        <a href="javascript:void(0)" :class="{ active: currentActiveTab === 'BENEFICIARY' }" @click="onClickNav('BENEFICIARY')">
          <cathay-translate code="Component_HeaderNav_004" />
          <img
            v-if="currentActiveTab === 'BENEFICIARY' && currentTabHasError"
            src="/src/assets/images/icon-warn.svg"
            alt="ERROR"
          />
        </a>
      </li>
    </ul>
  </nav>
</template>
<script setup>
  import useSwal from '~/composables/useSwal';
  import { useAccountingStore } from '~/stores/accounting';
  import { useApplyStore } from '~/stores/apply';
  import { useBeneficiaryStore } from '~/stores/beneficiary';
  import { useFooterStore } from '~/stores/footer';
  import { useModalStore } from '~/stores/modal';
  import { useOverviewStore } from '~/stores/overview';
  import Swal from 'sweetalert2/dist/sweetalert2.js';
  import { PayType } from '~/common/utils/enum';

  const props = defineProps({
    // OVERVIEW: 保單概況, APPLY: 申請資料
    currentActiveTab: {
      type: String,
      required: false,
      default: ''
    }
  });

  // 客製化按鈕達成非同步需求
  const confirmAsyncCus = (title = '', confirmButtonText = '確定', text = '') => {
    const swalWithButtons = Swal.mixin({
      customClass: {
        confirmButton: 'button swal-primary'
      },
      buttonsStyling: false
    });
    return swalWithButtons.fire({
      icon: 'success',
      title,
      text,
      showDenyButton: false,
      confirmButtonText: confirmButtonText
    });
  };
  
  // 檢查爭議金額有無勾選
  const flagCheck = () => {
    let flag1 =  accountingStore.DisputedCasesData.type1_checked
    let flag2 =  accountingStore.DisputedCasesData.type2_checked
    let flag3 =  accountingStore.DisputedCasesData.type3_checked
    let flagCk = flag1 || flag2 || flag3;
    return flagCk;
  };

  const router = useRouter();
  const route = useRoute();
  const aplyNo = inject('ApplyNo');
  const { $swal } = useSwal();
  const currentTabHasError = ref(false);
  const accountingStore = useAccountingStore();
  const applyStore = useApplyStore();
  const footerStore = useFooterStore();
  const overviewStore = useOverviewStore();
  const modalStore = useModalStore();

  const overviewHasError = computed(() => {
    let hasError = false;

    // 給付單位非可付現單位
    if(overviewStore.currentPayType === PayType.Money && overviewStore.beneficiariesData?.IS_PAY_UNIT === 'N'){
      hasError = true;
    }

    // 有附上票據變更申請書，請確認受款人是否需取消禁背或取消平行線。
    if(overviewStore.currentPayType === PayType.Cheque && overviewStore.beneficiariesData?.IS_CHK_CHECK === 'N'){
      hasError = true;
    }

    return hasError;
  });

  const onClickNav = async (tabName) => {
    const changePage = () => {
      router.push({
        name: 'master-page',
        params: { page: tabName.toLowerCase() },
        query: { q: aplyNo, readonly: route.query.readonly }
      });
      currentTabHasError.value = false;
    };

    // 如果有彈窗最小化，就閃一下不做任何處理
    if (modalStore.isMinify) {
      modalStore.flash();
      return;
    }

    // 點同一頁就不做任何處理
    if (tabName === props.currentActiveTab) return;
    // 如果為主管，就直接切頁(因沒辦法做任何變動)
    else if (applyStore.isManager) {
      changePage();
      return;
    }

    // 保單概況有訊息顯示訊息，沒有的話直接切換頁面不會跳確認視窗。
    if (props.currentActiveTab === 'OVERVIEW' && tabName !== 'OVERVIEW') {
      if(overviewHasError.value) {
        $swal.warning(overviewStore.beneficiariesData.RTN_MSG);
      } else {
        changePage();
      }
      return;
    }

    if (props.currentActiveTab === 'ACCOUNTING' && tabName === 'BENEFICIARY' && accountingStore.totalAmount.payResult < 0) {
      $swal.warning('總給付金額不得為負項，請調整試算');
      return;
    }

    // 核算結果若【試算調整確認】狀態為可點選時且未點選過，要跳出提示訊息
    if (props.currentActiveTab === 'ACCOUNTING' && tabName !== 'ACCOUNTING' && !accountingStore.disableDoConfirm) {
      if (accountingStore.sprFlag) {
        $swal.warning('需做保單分期計算或有理賠項目調整，請先點選「試算調整確認」後再切換頁面');
      } else {
        $swal.warning('有理賠項目調整，請先點選「試算調整確認」後再切換頁面');
      }
      
      return;
    }

    // 進入核算結果頁面，預設試算完直接存檔，後直接切到受益人分配頁面不會跳確認視窗。
    if (props.currentActiveTab === 'ACCOUNTING' && accountingStore.disableDoConfirm && !accountingStore.isDispChanged) {
      let flagCk = flagCheck();
        if (props.currentActiveTab === 'ACCOUNTING' && tabName === 'BENEFICIARY' && flagCk) {
          const reviewerInfo = footerStore.getReviewerInfo(aplyNo);
          const DisputedCasesMsg = await accountingStore.alertDisputedCasesMsg(aplyNo);
          if (DisputedCasesMsg && !reviewerInfo.isReviewer) {
            let prompt = await confirmAsyncCus(DisputedCasesMsg);
            if(prompt.isConfirmed){
              changePage();
              return
            } else {
              return
            }
          } else {
            changePage();
            return
          }
        } else {
          changePage();
          return
        }  
    }

    // 第一次進來的案件，申請資料至少要儲存一次
    if (props.currentActiveTab === 'APPLY' && applyStore.claimData?.APLY_PROC_STS == '1') {
      // 儲存左邊停留頁籤資料
      footerStore.submitPageData(async (isSuccess) => {
        console.log(isSuccess);
        if (isSuccess) {
          applyStore.claimData.APLY_PROC_STS = '2';
          // 備份的也一併設為2，下次儲存才不會誤偵測有改變過頁面
          if (applyStore.backupResult?.CLAIM) {
            applyStore.backupResult.CLAIM.APLY_PROC_STS = '2';
          }
          changePage();
        } else {
          currentTabHasError.value = true;
        }
      });
      return;
    }

    if (props.currentActiveTab === 'APPLY' && tabName !== 'APPLY') {
      const mainSection = document.getElementById('mainSection');
      if (mainSection.querySelector('img.error-message')) {
        $swal.warning('資料有誤，請確認資料無誤後再次送出');
        return;
      }
    }

    let isPageChanged = false;
    switch (props.currentActiveTab) {
      case 'APPLY':
        isPageChanged = applyStore.isPageChanged();
        break;
      case 'OVERVIEW':
        isPageChanged = useOverviewStore().isPageChanged;
        break;
      case 'ACCOUNTING':
        isPageChanged = accountingStore.isPageChanged;
        break;
      case 'BENEFICIARY':
        isPageChanged = useBeneficiaryStore().isPageChanged();
        break;
      default:
        break;
    }
    console.log(props.currentActiveTab + ' isPageChanged: ' + isPageChanged);
    // 頁面有變更，跳出訊息詢問是否要儲存

    if (isPageChanged) {
      const isConfirmSave = await $swal.confirmAsync(
        '資料未儲存，確定要離開嗎？',
        '儲存',
        '如未儲存離開頁面，此次變更資料將會遺失。',
        '不儲存，離開'
      );
      console.log('saveCheck: ' + isConfirmSave);
      if (isConfirmSave.isConfirmed) {
        // 儲存左邊停留頁籤資料
        footerStore.submitPageData(async (isSuccess) => {
          console.log(isSuccess);
          if (isSuccess) {
            let flagCk = flagCheck();
            if (props.currentActiveTab === 'ACCOUNTING' && tabName === 'BENEFICIARY' && flagCk) {
                const reviewerInfo = footerStore.getReviewerInfo(aplyNo);
                const DisputedCasesMsg = await accountingStore.alertDisputedCasesMsg(aplyNo);
                if (DisputedCasesMsg && !reviewerInfo.isReviewer) {
                  let prompt = await confirmAsyncCus(DisputedCasesMsg);
                  if(prompt.isConfirmed){
                      changePage();
                    } else {
                      return
                    }
                } else{
                  changePage();
                }
            } else {
              changePage();
            }
          } else {
            currentTabHasError.value = true;
          }
        });
      } else {
        if (isConfirmSave.dismiss !== 'backdrop') {
          changePage();
        }
      }
    } else {
        changePage();
      }  
  };
</script>
