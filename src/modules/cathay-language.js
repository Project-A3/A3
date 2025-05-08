let currentLanguage = import.meta.env.CATHAYLIFE_VITE_Language;
const loadLanguages = (language = currentLanguage) =>
  import(`../assets/languages/${language}.json`).then((result) => {
    return result.default;
  });

const translate = (code) => languages.then((languages) => languages[code] ?? `[${currentLanguage}] ${code}`);

const loadAllTranslatedLanguage = (language = currentLanguage) => {
  if (language !== currentLanguage) {
    currentLanguage = language;
    languages = loadLanguages(language);
  }
  return languages;
};

let languages = loadLanguages();
export { loadAllTranslatedLanguage, translate }; //promise

