export const languages = navigator.languages ||
    ([...new Set([(navigator as any).userLanguage, navigator.language, (navigator as any).browserLanguage, (navigator as any).systemLanguage]
      .filter(l => l !== void 0))]);
