<template>
  <ModalWrapper id="disabilityQuery" class="fix-height">
    <Modal>
      <template v-slot:title>失能程度查詢</template>
      <template v-slot:content>
        <div class="modal-table">
          <table class="table is-striped-odd is-fullwidth mt-0">
            <thead class="is-sticky">
              <tr class="">
                <th class="has-text-centered has-border-right">失能<br />程度</th>
                <th class="has-text-centered">一表<br />等級</th>
                <th class="has-text-centered has-border-right">一表<br />比例</th>
                <th class="has-text-centered">二表<br />等級</th>
                <th class="has-text-centered has-border-right">二表<br />比例</th>
                <th class="has-text-centered">三表<br />等級</th>
                <th class="has-text-centered has-border-right">三表<br />比例</th>
                <th class="has-text-centered">四表<br />等級</th>
                <th class="has-text-centered has-border-right">四表<br />比例</th>
                <th class="has-text-centered">五表<br />等級</th>
                <th class="has-text-centered has-border-right">五表<br />比例</th>
                <th class="has-text-centered">六表<br />等級</th>
                <th class="has-text-centered has-border-right">六表<br />比例</th>
                <th class="has-text-centered">七表<br />等級</th>
                <th class="has-text-centered has-border-right">七表<br />比例</th>
                <th class="ver-middle pl-4">失能程度描述</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="disbItem in disbTableData" :key="disbItem.DISB_RANK">
                <td class="has-text-centered has-border-right w-5">{{ disbItem.DISB_RANK }}</td>
                <td class="has-text-centered">
                  <a href="#" :class="{ level: disbItem.TB1 === 'Y' }" @click.stop.prevent="onClickLink(disbItem.TB1, '1', disbItem)">
                    {{ disbItem.SHOW_TB1_GRADE ? disbItem.SHOW_TB1_GRADE : '-' }}
                  </a>
                </td>
                <td class="has-text-centered has-border-right">{{ disbItem.SHOW_TB1_RATE ? disbItem.SHOW_TB1_RATE : '-' }}</td>
                <td class="has-text-centered">
                  <a href="#" :class="{ level: disbItem.TB2 === 'Y' }" @click.stop.prevent="onClickLink(disbItem.TB2, '2', disbItem)">
                    {{ disbItem.SHOW_TB2_GRADE ? disbItem.SHOW_TB2_GRADE : '-' }}
                  </a>
                </td>
                <td class="has-text-centered has-border-right">{{ disbItem.SHOW_TB2_RATE ? disbItem.SHOW_TB2_RATE : '-' }}</td>
                <td class="has-text-centered">
                  <a href="#" :class="{ level: disbItem.TB3 === 'Y' }" @click.stop.prevent="onClickLink(disbItem.TB3, '3', disbItem)">
                    {{ disbItem.SHOW_TB3_GRADE ? disbItem.SHOW_TB3_GRADE : '-' }}
                  </a>
                </td>
                <td class="has-text-centered has-border-right">{{ disbItem.SHOW_TB3_RATE ? disbItem.SHOW_TB3_RATE : '-' }}</td>
                <td class="has-text-centered">
                  <a href="#" :class="{ level: disbItem.TB4 === 'Y' }" @click.stop.prevent="onClickLink(disbItem.TB4, '4', disbItem)">
                    {{ disbItem.SHOW_TB4_GRADE ? disbItem.SHOW_TB4_GRADE : '-' }}
                  </a>
                </td>
                <td class="has-text-centered has-border-right">{{ disbItem.SHOW_TB4_RATE ? disbItem.SHOW_TB4_RATE : '-' }}</td>
                <td class="has-text-centered">
                  <a href="#" :class="{ level: disbItem.TB5 === 'Y' }" @click.stop.prevent="onClickLink(disbItem.TB5, '5', disbItem)">
                    {{ disbItem.SHOW_TB5_GRADE ? disbItem.SHOW_TB5_GRADE : '-' }}
                  </a>
                </td>
                <td class="has-text-centered has-border-right">{{ disbItem.SHOW_TB5_RATE ? disbItem.SHOW_TB5_RATE : '-' }}</td>
                <td class="has-text-centered">
                  <a href="#" :class="{ level: disbItem.TB6 === 'Y' }" @click.stop.prevent="onClickLink(disbItem.TB6, '6', disbItem)">
                    {{ disbItem.SHOW_TB6_GRADE ? disbItem.SHOW_TB6_GRADE : '-' }}
                  </a>
                </td>
                <td class="has-text-centered has-border-right">{{ disbItem.SHOW_TB6_RATE ? disbItem.SHOW_TB6_RATE : '-' }}</td>
                <td class="has-text-centered">
                  <a href="#" :class="{ level: disbItem.TB7 === 'Y' }" @click.stop.prevent="onClickLink(disbItem.TB7, '7', disbItem)">
                    {{ disbItem.SHOW_TB7_GRADE ? disbItem.SHOW_TB7_GRADE : '-' }}
                  </a>
                </td>
                <td class="has-text-centered has-border-right">{{ disbItem.SHOW_TB7_RATE ? disbItem.SHOW_TB7_RATE : '-' }}</td>
                <td class="w-23 pl-4 description">
                  {{ disbItem.DISB_DISC }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
      <template v-slot:buttons><button class="button is-light" @click="props.close">取消</button></template>
    </Modal>
  </ModalWrapper>
</template>
<script setup>
  import Modal from '~/components/Modal.vue';
  import { useAccountingStore } from '~/stores/accounting';
  import ModalWrapper from '~/components/ModalWrapper.vue';
  import useSwal from '~/composables/useSwal';

  const { $swal } = useSwal();
  const accountingStore = useAccountingStore();
  const props = defineProps({
    data: {
      type: Object,
      required: false,
      default: {}
    },
    close: {
      type: Function,
      required: false,
      default: () => console.log('close modal!')
    }
  });

  const disbTableData = ref([]);

  try {
    accountingStore.showLoading();
    disbTableData.value = await accountingStore.getDisbTable();
  } catch (e) {
    $swal.fail(e);
  } finally {
    accountingStore.hideLoading();
  }

  const emit = defineEmits(['onClickLink']);
  const onClickLink = (isLink, level, item) => {
    if (isLink === 'Y') {
      emit('onClickLink', {
        SHOW_RANK: item.DISB_RANK,
        SHOW_GRADE_TABLE: level,
        SHOW_GRADE: item[`SHOW_TB${level}_GRADE`],
        SHOW_RATE: item[`SHOW_TB${level}_RATE`],
        DISB_DISC: item.DISB_DISC
      });
      props.close();
    }
  };
</script>
<style lang="scss"></style>
