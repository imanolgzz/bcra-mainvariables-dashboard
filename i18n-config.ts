export var i18n = {
    defaultLocale: "en",
    locales: ["en", "es"],
  };
  
  export type Locale = (typeof i18n)["locales"][number];