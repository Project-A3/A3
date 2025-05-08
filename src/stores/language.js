import { defineStore } from 'pinia';
import { loadAllTranslatedLanguage } from '../modules/cathay-language';

export const useLanguageStore = defineStore('language', {
  state: () => ({ language: '', languages: {} }),
  getters: {
    text: (state) => {
      switch (state.language) {
        case 'vi_VN':
          return 'VN';
        case 'zh_TW':
          return 'TW';
        case 'en_US':
          return 'EN';
        default:
          return state.language;
      }
    }
  },
  actions: {
    async switchLanguage(language) {
      console.log(language);
      if (language !== this.language) {
        this.language = language;
        this.languages = await loadAllTranslatedLanguage(this.language);
      }
    },
    translate(code) {
      return this.languages[code] ?? `[${this.language}] ${code}`;
    }
  }
});
