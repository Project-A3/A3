import { useModalStore } from '../stores/modal';

export default function useModal() {
  const modalStore = useModalStore();
  const $m = {
    /**
     * 開啟Modal
    {
      component: '',
      id:'',
      data: {},
    }
     * @param {Component} component 要開啟的Modal body component
     * @param {Object} id modal ID
     * @param {Object} data 要帶進Modal的資料
     */
    show({ component, id, data }) {
      modalStore.show({ component, id, data });
    },
    hide() {
      modalStore.hide();
    },
    minify(title) {
      modalStore.minify(title);
    }
  };

  return {
    $m
  };
}

/**
 * Modal Template Example
  <template>
    <Modal>
      <template v-slot:title></template>
      <template v-slot:content></template>
      <template v-slot:buttons>
        <button class="button is-light" @click="props.close">取消</button>
        <button class="button is-primary">確認</button>
      </template>
    </Modal>
  </template>
  <script setup>
    import Modal from '~/components/Modal.vue';
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
  </script>
  <style lang="scss"></style>
 */
