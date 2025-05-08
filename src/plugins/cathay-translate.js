import { translate, loadAllTranslatedLanguage } from "../modules/cathay-language";

export default {
    install(app, options) {
        app.provide('translate', translate);
        app.provide('loadAllTranslatedLanguage', loadAllTranslatedLanguage);
    }
};