const languageSelector = (language, languages) => {
  let lang;
  switch (language) {
    case 'en_GB':
      lang = languages.en_GB;
      break;
    case 'en_US':
      lang = languages.en_US;
      break;
    case 'zh_CH':
      lang = languages.zh_CH;
      break;
    default:
      lang = languages.en_GB;
  }
  return lang;
};

const languageMerger = (base, extension) => {
  let lang = Object.assign({}, ...base);
  const extensionKeys = Object.keys(extension);

  extensionKeys.forEach(key => {
    if (key in base) {
      lang[key] = extension[key];
    }
  });

  return lang;
};

export { languageSelector, languageMerger };
