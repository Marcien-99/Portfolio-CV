import 'server-only'

const dictionaries = {
  fr: () => import('@/dictionaries/fr.json').then((module) => module.default),
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
}

export type Locale = keyof typeof dictionaries

export const getDictionary = async (locale: Locale) => {
  // Fallback to 'fr' if locale is undefined or invalid
  if (!locale || !dictionaries[locale]) {
    return dictionaries.fr()
  }
  return dictionaries[locale]()
}
