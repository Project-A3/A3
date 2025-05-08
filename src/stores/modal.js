import { defineStore } from 'pinia';
import { nextTick } from 'vue';

export const useModalStore = defineStore('modal', {
  state: () => ({
    // 目前Modal ID
    currentId: '',
    // 現在內容是哪個component
    currentModal: '',
    // 有需要傳遞給Modal的資料
    data: {},
    // 顯示開關
    isShow: false,
    // 是否最小化
    isMinify: false,
    // 最小化標題
    minifyTitle: '',
    // 閃
    isFlash: false
  }),
  getters: {},
  actions: {
    show({ component, id, data }) {
      // 有彈窗縮小時不能開啟其他彈窗
      if (this.isMinify) {
        this.flash();
        return;
      }

      // console.log(component);
      this.currentModal = markRaw(component);
      this.currentId = id;
      this.data = { data, close: this.hide };
      this.isShow = true;
      // console.log(this.data);
    },
    hide() {
      this.currentModal = '';
      this.isShow = false;
      this.isMinify = false;
      this.data = {};
      this.currentId = '';
    },
    minify(title) {
      this.isShow = false;
      this.isMinify = true;
      this.minifyTitle = title;
    },
    restoreSize() {
      this.isShow = true;
      this.isMinify = false;
    },
    flash() {
      this.isFlash = true;
      setTimeout(() => {
        this.isFlash = false;
      }, 200);
    }
  }
});
