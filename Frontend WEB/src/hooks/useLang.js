import { useState } from 'react';
import translations from '../data/translations';

export function useLang() {
  const [lang, setLang] = useState('id');
  const t = translations[lang] || translations['id'] || {};
  return { lang, setLang, t };
}

export default useLang;
