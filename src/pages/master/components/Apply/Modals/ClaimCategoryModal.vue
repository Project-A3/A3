<!-- 索賠類別彈窗 -->
<template>
  <Modal>
    <template v-slot:title><cathay-translate code="Page_ClaimCatogoryModal_001" /></template>
    <template v-slot:content>
      <div class="columns is-multiline">
        <div v-for="claimCat in claimList" class="column is-6" :key="claimCat.CLAM_CAT">
          <label>
            <input type="checkbox" :value="claimCat.CLAM_CAT" v-model="checkedClaimCats" />
            <span class="font-eudc">{{ claimCat.CLAM_CAT_DESC }}</span>
          </label>
        </div>
      </div>
    </template>
    <template v-slot:buttons>
      <button class="button is-light" @click="props.close"><cathay-translate code="Page_ClaimCatogoryModal_002" /></button>
      <button class="button is-primary" @click.prevent="onSubmit"><cathay-translate code="Page_ClaimCatogoryModal_003" /></button>
    </template>
  </Modal>
</template>
<script setup>
  import Modal from '~/components/Modal.vue';
  import { useApplyStore } from '~/stores/apply';
  import useSwal from '~/composables/useSwal';
  const { $swal } = useSwal();
  const applyStore = useApplyStore();
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

  const claimList = ref([
    {
        CLAM_CAT: 'APPLY_HOSP_M_IND',
        CLAM_CAT_DESC: 'Hỗ trợ viện phí cá nhân'
    },
    {
        CLAM_CAT: 'APPLY_HOSP_SP_IND',
        CLAM_CAT_DESC: 'Trợ cấp điều trị'
    },
    {
        CLAM_CAT: 'APPLY_RISK_IND',
        CLAM_CAT_DESC: 'Bệnh lý nghiêm trọng'
    },
    {
        CLAM_CAT: 'APPLY_DEATH_IND',
        CLAM_CAT_DESC: 'Tử vong'
    },
    {
        CLAM_CAT: 'APPLY_H_DISB_IND',
        CLAM_CAT_DESC: 'Thương tật toàn bộ và vĩnh viễn'
    },
    {
        CLAM_CAT: 'APPLY_DISB_IND',
        CLAM_CAT_DESC: 'Thương tật từng phần'
    },
    {
        CLAM_CAT: 'APPLY_WP_IND',
        CLAM_CAT_DESC: 'Miễn nộp phí bảo hiểm'
    },
    {
        CLAM_CAT: 'APPLY_END_LIFE_IND',
        CLAM_CAT_DESC: 'Giai đoạn cuối đời'
    },
    {
        CLAM_CAT: 'APPLY_LONG_CARE_IND',
        CLAM_CAT_DESC: 'Chăm sóc lâu dài'
    },
    {
        CLAM_CAT: 'APPLY_CANCER_IND',
        CLAM_CAT_DESC: 'Phòng ngừa ung thư'
    }
  ]);
  // const claimList = ref([]);
  // try {
  //   applyStore.showLoading();
  //   claimList.value = await applyStore.getClaimCategories();
  // } catch (e) {
  //   $swal.fail(e);
  // } finally {
  //   applyStore.hideLoading();
  // }

  // 勾選的索賠類別
  const checkedClaimCats = ref(props.data.models.value.split(', ').filter((item) => item));
  console.log(checkedClaimCats.value);
  // 勾選的索賠類別名稱
  const checkedClaimCatNames = computed(() => {
    let finalText = '';
    checkedClaimCats.value.forEach((e) => {
      if (e && e !== '') {
        let c = claimList.value.find((c) => c.CLAM_CAT === e);
        if (c) {
          finalText += c.CLAM_CAT_DESC + ', ';
        }
      }
    });
    if (finalText.length > 1) finalText = finalText.slice(0, -2);
    console.log(finalText);
    return finalText;
  });

  console.log(props.data);

  const validation = () => {
    var isValid = true;

    // 進件時符合OIU件(比照現行規則)，且索賠類別僅單一勾選「意外險」或「員工福團」需卡控
    if (
      applyStore.basicData.IS_OIU === 'Y' &&
      checkedClaimCats.value.length === 1 &&
      (checkedClaimCats.value[0] === 'O' || checkedClaimCats.value[0] === 'X')
    ) {
      $swal.fail('OIU件不可勾選員工福團、意外險');
      isValid = false;
    }
    // 索賠類別勾選「意外險」或「員工福團」，選取必須同時勾選其他索賠類別
    else if (checkedClaimCats.value.filter((c) => c !== 'O' && c !== 'X').length === 0) {
      $swal.fail('意外險/員工福團選取必須同時勾選其他索賠類別');
      isValid = false;
    }
    // 索賠類別定期給付保險金/生活補助/失能生活金，不能與其他索賠類別同時勾選
    else if (checkedClaimCats.value.length > 1 && checkedClaimCats.value.indexOf('N') >= 0) {
      $swal.fail('理賠年金不得與其它索賠類別同時申請');
      isValid = false;
    }
    // 索賠類別A跟K不能同時勾選
    else if (checkedClaimCats.value.indexOf('A') >= 0 && checkedClaimCats.value.indexOf('K') >= 0) {
      $swal.fail('死亡(A)和完全失能(K)不能同時勾選');
      isValid = false;
    }
    // 索賠類別A、K僅能與E、F、G同時勾選
    else if (
      (checkedClaimCats.value.indexOf('A') >= 0 || checkedClaimCats.value.indexOf('K') >= 0) && 
      checkedClaimCats.value.filter((c) => c !== 'A' && c !== 'K' && c !== 'E' && c !== 'F' && c !== 'G' && c !== 'O' && c !== 'X').length > 0
    ) {
      $swal.fail('死亡(A)或完全失能(完全失能關懷)(K)僅能與醫療日額(燒燙傷)(E)、醫療實支(F)、防癌(G)、員工福團(含退休員工福團)(O)及意外險(X)索賠類別同時勾選，請修正後重新送出');
      isValid = false;
    }
    return isValid;
  };

  // 當索賠類別有勾完全失能時，死亡給付與完全失能項目的區塊都直接展開 LICXS-436
  const handleCheckFullDisb = () => {
    if (!applyStore.highSettlementData?.DEATH_DATA) {
      applyStore.highSettlementData.DEATH_DATA = {
        CFM_DEAD_DATE: '',
        CFM_DEAD_TYPE: '',
        CFM_ICD_CODE: '',
        CFM_ICD_NAME: '',
        CFM_HOSP_CODE: '',
        CFM_HOSP_NAME: '',
        CFM_PRO_NAME: '',
        CFM_DOC_NAME: '',
        CFM_PROV_NO: '',
        CFM_PROV_DATE: '',
        CFM_DEAD_RESN1A: '',
        CFM_DEAD_RESN1B: '',
        CFM_DEAD_RESN1C: '',
        CFM_DEAD_RESN1D: '',
        CFM_DEAD_RESN2: '',
        CFM_DEAD_ADDR1: '',
        CFM_DEAD_ADDR2: '',
        CFM_DEAD_ADDR3: '',
        CFM_FULL_CNCR: '',
        CFM_EMP_ACC: ''
      };
    }

    if (!applyStore.highSettlementData?.FULLDISB_DATA) {
      applyStore.highSettlementData.FULLDISB_DATA = {
        CFM_FULL_CON: '',
        CFM_DISB_CAT: '',
        CFM_DISB_CAT_NAME: ''
      };
    }
  };

  const emitEvent = props.data.emitEvents;
  const onSubmit = () => {
    if (!validation()) {
      return;
    }
    emitEvent.updateValue(checkedClaimCats.value);
    emitEvent.updateText(checkedClaimCatNames.value);
    if(checkedClaimCats.value.indexOf('K') >= 0){
      handleCheckFullDisb();
    }
    props.close();
  };
</script>
<style lang="scss"></style>
