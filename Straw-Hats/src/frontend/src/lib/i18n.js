import en from '../../ai/translations/english.json'
import ne from '../../ai/translations/nepali.json'
import hi from '../../ai/translations/hindi.json'

const translations = { en, ne, hi }

export function useTranslation(lang = 'ne') {
  return (key) => translations[lang]?.[key] || translations.en[key] || key
}
