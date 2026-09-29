import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LanguageCode, LanguageInfo } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/curriculum';

export interface VernacularMeta {
  code: LanguageCode;
  name: string;
  hindiName: string;
  nativeName: string;
  script: string;
  symbol: string;
  greeting: string;
  treeWaterStoryTitle: string;
  treeWaterStorySubtitle: string;
  treeWaterStoryText: string;
  praisePhrase: string;
  worksheetPhrase: string;
  quizPhrase: string;
  greetingPhrase: string;
  bookPhrase: string;
  practiceWords: Array<{ word: string; label: string; meaning: string }>;
}

export const VERNACULAR_META_MAP: Record<LanguageCode, VernacularMeta> = {
  sat_Olck: {
    code: 'sat_Olck',
    name: 'Santali (Ol Chiki)',
    hindiName: 'संथाली',
    nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ (ᱚᱞ ᱪᱤᱠᱤ)',
    script: 'Ol Chiki',
    symbol: 'ᱚ',
    greeting: 'ᱡᱚᱦᱟᱨ',
    treeWaterStoryTitle: 'ᱫᱟᱨᱮ ᱟᱨ ᱫᱟᱜ',
    treeWaterStorySubtitle: 'पेड़ और पानी की सीख',
    treeWaterStoryText:
      'एक बार एक छोटा सा पौधा था। उसने सूरज से कहा: मुझे धूप और रोशनी दो। उसने बादल से कहा: मुझे मीठा जल दो। तब पौधा बड़ा होकर एक सुंदर साल का पेड़ बन गया। दारे आर दाग दो आबोवाग जीवी काना, यानी पेड़ और पानी ही हमारा सच्चा जीवन हैं।',
    praisePhrase: 'ᱟᱹᱰᱤ ᱱᱟᱯᱟᱭ! ᱡᱚᱛᱚ ᱠᱩᱠᱞᱤ ᱨᱮᱱᱟᱜ ᱛᱮᱞᱟ ᱴᱷᱤᱠ ᱜᱮᱭᱟ᱾',
    worksheetPhrase: 'ᱪᱟᱱᱟᱪ ᱠᱟᱹᱢᱤ ᱥᱟᱠᱟᱢ',
    quizPhrase: 'ᱪᱟᱱᱟᱪ ᱠᱩᱠᱞᱤ ᱨᱩᱯ',
    greetingPhrase: 'ᱡᱚᱦᱟᱨ ᱜᱤᱫᱽᱨᱟᱹ ᱠᱚ! (नमस्ते बच्चों!)',
    bookPhrase: 'ᱟᱯᱱᱟᱨᱟᱜ ᱯᱩᱛᱷᱤ ᱡᱷᱤᱡᱽ ᱯᱮ (अपनी किताब खोलें)',
    practiceWords: [
      { word: 'नमस्ते, आप कैसे हैं?', label: 'ᱡᱚᱦᱟᱨ (नमस्ते)', meaning: 'जोहार' },
      { word: 'पेड़ हमारे जीवन के लिए बहुत जरूरी हैं।', label: 'ᱫᱟᱨᱮ (पेड़)', meaning: 'दारे' },
      { word: 'जल ही जीवन है, पानी बचाओ।', label: 'ᱫᱟᱜ (पानी)', meaning: 'दाग / दाः' },
      { word: 'हरा पत्ता सूरज से भोजन बनाता है।', label: 'ᱥᱟᱠᱟᱢ (पत्ता)', meaning: 'साकाम' },
      { word: 'माँ और पिताजी का सम्मान करो।', label: 'ᱟᱭᱳ-ᱵᱟᱵᱟ (माता-पिता)', meaning: 'आयो-बाबा' },
      { word: 'सभी बच्चे मिलकर स्कूल जा रहे हैं।', label: 'ᱟᱥᱲᱟ (स्कूल)', meaning: 'आसड़ा' },
      { word: 'अपनी किताब ध्यान से पढ़ो।', label: 'ᱯᱩᱛᱷᱤ (किताब)', meaning: 'पुथी' },
      { word: 'गाय हमें मीठा दूध देती है।', label: 'ᱜᱟᱹᱭ (गाय)', meaning: 'गई' },
    ],
  },
  sat_Deva: {
    code: 'sat_Deva',
    name: 'Santali (Devanagari)',
    hindiName: 'संथाली (देवनागरी)',
    nativeName: 'संथाली (देवनागरी)',
    script: 'Devanagari',
    symbol: 'सं',
    greeting: 'जोहार',
    treeWaterStoryTitle: 'दारे आर दाग',
    treeWaterStorySubtitle: 'पेड़ और पानी की सीख',
    treeWaterStoryText:
      'एक बार एक छोटा सा पौधा था। उसने सूरज से कहा: मुझे धूप और रोशनी दो। उसने बादल से कहा: मुझे मीठा जल दो। तब पौधा बड़ा होकर एक सुंदर साल का पेड़ बन गया। दारे आर दाग दो आबोवाग जीवी काना, यानी पेड़ और पानी ही हमारा सच्चा जीवन हैं।',
    praisePhrase: 'आडी नापाय! जोतो कुक्ली रेनाग तेला ठीक गेया।',
    worksheetPhrase: 'चानाच कामी साकाम',
    quizPhrase: 'चानाच कुक्ली रूप',
    greetingPhrase: 'जोहार गिदरा को! (नमस्ते बच्चों!)',
    bookPhrase: 'आपणाराग पुथी झिज पे (अपनी किताब खोलें)',
    practiceWords: [
      { word: 'नमस्ते, आप कैसे हैं?', label: 'जोहार (नमस्ते)', meaning: 'जोहार' },
      { word: 'पेड़ हमारे जीवन के लिए बहुत जरूरी हैं।', label: 'दारे (पेड़)', meaning: 'दारे' },
      { word: 'जल ही जीवन है, पानी बचाओ।', label: 'दाग (पानी)', meaning: 'दाग / दाः' },
      { word: 'हरा पत्ता सूरज से भोजन बनाता है।', label: 'साकाम (पत्ता)', meaning: 'साकाम' },
      { word: 'माँ और पिताजी का सम्मान करो।', label: 'आयो-बाबा (माता-पिता)', meaning: 'आयो-बाबा' },
      { word: 'सभी बच्चे मिलकर स्कूल जा रहे हैं।', label: 'आसड़ा (स्कूल)', meaning: 'आसड़ा' },
      { word: 'अपनी किताब ध्यान से पढ़ो।', label: 'पुथी (किताब)', meaning: 'पुथी' },
      { word: 'गाय हमें मीठा दूध देती है।', label: 'गई (गाय)', meaning: 'गई' },
    ],
  },
  hoc_Deva: {
    code: 'hoc_Deva',
    name: 'Ho',
    hindiName: 'हो',
    nativeName: 'हो (वारंग क्षिति/देवनागरी)',
    script: 'Warang Chiti / Devanagari',
    symbol: 'हो',
    greeting: 'जोहार',
    treeWaterStoryTitle: 'दारु आर दाः',
    treeWaterStorySubtitle: 'पेड़ और पानी की सीख (हो भाषा)',
    treeWaterStoryText:
      'एक बार एक छोटा सा पौधा था। उसने सिंगी (सूरज) से कहा: मुझे धूप और रोशनी दो। उसने बादल से कहा: मुझे मीठा दाः (जल) दो। तब पौधा बड़ा होकर एक सुंदर दारु (पेड़) बन गया। दारु आर दाः दो आबोवाग जीविद ताना, यानी पेड़ और पानी ही हमारा सच्चा जीवन हैं।',
    praisePhrase: 'एशुकुर बुगिन्! जोतो कुली रेयाः तेरा ठीक मेनाः।',
    worksheetPhrase: 'क्लास कामी साकाम',
    quizPhrase: 'क्लास कुली रूप',
    greetingPhrase: 'जोहार होन को! (नमस्ते बच्चों!)',
    bookPhrase: 'अपेयाः पुथी उडुं पे (अपनी किताब खोलें)',
    practiceWords: [
      { word: 'नमस्ते, आप कैसे हैं?', label: 'जोहार (नमस्ते)', meaning: 'जोहार' },
      { word: 'पेड़ हमारे जीवन के लिए बहुत जरूरी हैं।', label: 'दारु (पेड़)', meaning: 'दारु' },
      { word: 'जल ही जीवन है, पानी बचाओ।', label: 'दाः (पानी)', meaning: 'दाः' },
      { word: 'हरा पत्ता सूरज से भोजन बनाता है।', label: 'साकाम (पत्ता)', meaning: 'साकाम' },
      { word: 'माँ और पिताजी का सम्मान करो।', label: 'एंगा-आपा (माता-पिता)', meaning: 'एंगा-आपा' },
      { word: 'सभी बच्चे मिलकर स्कूल जा रहे हैं।', label: 'इसकुल (स्कूल)', meaning: 'इसकुल' },
      { word: 'अपनी किताब ध्यान से पढ़ो।', label: 'पुथी (किताब)', meaning: 'पुथी' },
      { word: 'गाय हमें मीठा दूध देती है।', label: 'उरीः (गाय)', meaning: 'उरीः' },
    ],
  },
  unr_Deva: {
    code: 'unr_Deva',
    name: 'Mundari',
    hindiName: 'मुंडारी',
    nativeName: 'मुंडारी (देवनागरी)',
    script: 'Mundari Bani / Devanagari',
    symbol: 'मुं',
    greeting: 'जोहार',
    treeWaterStoryTitle: 'दारु आर दाः',
    treeWaterStorySubtitle: 'पेड़ और पानी की सीख (मुंडारी भाषा)',
    treeWaterStoryText:
      'एक बार एक छोटा सा पौधा था। उसने सिंगी (सूरज) से कहा: मुझे धूप और रोशनी दो। उसने बादल से कहा: मुझे मीठा दाः (जल) दो। तब पौधा बड़ा होकर एक सुंदर दारु (पेड़) बन गया। दारु आर दाः दो आबोवाग जीविद काना, यानी पेड़ और पानी ही हमारा सच्चा जीवन हैं।',
    praisePhrase: 'एशुकुर बुगिन्! जोतो कुली रेयाः तेरा ठीक मेनाः।',
    worksheetPhrase: 'क्लास कामी साकाम',
    quizPhrase: 'क्लास कुली रूप',
    greetingPhrase: 'जोहार हुन को! (नमस्ते बच्चों!)',
    bookPhrase: 'अपेयाः पुथी उडुं पे (अपनी किताब खोलें)',
    practiceWords: [
      { word: 'नमस्ते, आप कैसे हैं?', label: 'जोहार (नमस्ते)', meaning: 'जोहार' },
      { word: 'पेड़ हमारे जीवन के लिए बहुत जरूरी हैं।', label: 'दारु (पेड़)', meaning: 'दारु' },
      { word: 'जल ही जीवन है, पानी बचाओ।', label: 'दाः (पानी)', meaning: 'दाः' },
      { word: 'हरा पत्ता सूरज से भोजन बनाता है।', label: 'साकाम (पत्ता)', meaning: 'साकाम' },
      { word: 'माँ और पिताजी का सम्मान करो।', label: 'एंगा-आपा (माता-पिता)', meaning: 'एंगा-आपा' },
      { word: 'सभी बच्चे मिलकर स्कूल जा रहे हैं।', label: 'इसकुल (स्कूल)', meaning: 'इसकुल' },
      { word: 'अपनी किताब ध्यान से पढ़ो।', label: 'पुथी (किताब)', meaning: 'पुथी' },
      { word: 'गाय हमें मीठा दूध देती है।', label: 'उरीः (गाय)', meaning: 'उरीः' },
    ],
  },
  hin_Deva: {
    code: 'hin_Deva',
    name: 'Hindi',
    hindiName: 'हिन्दी',
    nativeName: 'हिन्दी',
    script: 'Devanagari',
    symbol: 'हि',
    greeting: 'नमस्ते',
    treeWaterStoryTitle: 'पेड़ और पानी',
    treeWaterStorySubtitle: 'पेड़ और पानी की सीख (हिन्दी)',
    treeWaterStoryText:
      'एक बार एक छोटा सा पौधा था। उसने सूरज से कहा: मुझे धूप और रोशनी दो। उसने बादल से कहा: मुझे मीठा जल दो। तब पौधा बड़ा होकर एक सुंदर साल का पेड़ बन गया। पेड़ और पानी ही हमारा सच्चा जीवन हैं।',
    praisePhrase: 'शानदार प्रयास! सभी प्रश्नों के उत्तर सही हैं।',
    worksheetPhrase: 'कक्षा कार्यपत्रक',
    quizPhrase: 'कक्षा प्रश्नोत्तरी',
    greetingPhrase: 'नमस्ते बच्चों!',
    bookPhrase: 'अपनी किताब खोलें',
    practiceWords: [
      { word: 'नमस्ते, आप कैसे हैं?', label: 'नमस्ते', meaning: 'नमस्ते' },
      { word: 'पेड़ हमारे जीवन के लिए बहुत जरूरी हैं।', label: 'पेड़ (Tree)', meaning: 'पेड़' },
      { word: 'जल ही जीवन है, पानी बचाओ।', label: 'पानी (Water)', meaning: 'पानी' },
      { word: 'हरा पत्ता सूरज से भोजन बनाता है।', label: 'पत्ता (Leaf)', meaning: 'पत्ता' },
      { word: 'माँ और पिताजी का सम्मान करो।', label: 'माता-पिता (Parents)', meaning: 'माता-पिता' },
      { word: 'सभी बच्चे मिलकर स्कूल जा रहे हैं।', label: 'स्कूल (School)', meaning: 'स्कूल' },
      { word: 'अपनी किताब ध्यान से पढ़ो।', label: 'किताब (Book)', meaning: 'किताब' },
      { word: 'गाय हमें मीठा दूध देती है।', label: 'गाय (Cow)', meaning: 'गाय' },
    ],
  },
};

import { translateVernacularText } from '../utils/vernacularEngine';

export interface LanguageContextType {
  currentLanguage: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  languageInfo: LanguageInfo;
  vernacularMeta: VernacularMeta;
  /**
   * Translates or returns the corresponding vernacular text based on the selected language
   */
  getWordForLanguage: (item: {
    santaliOlChiki?: string;
    santaliDeva?: string;
    ho?: string;
    mundari?: string;
    hindi?: string;
  }) => string;
  /**
   * Instant offline vernacular translation helper for any Hindi text
   */
  translateText: (hindiText: string) => { translated: string; transliteration: string };
  /**
   * Dynamically replaces 'संथाली', 'Santali', etc. in any string with the active language
   */
  localizeText: (text: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{
  children: ReactNode;
  initialLanguage?: LanguageCode;
  onLanguageChangeExternal?: (lang: LanguageCode) => void;
}> = ({ children, initialLanguage = 'sat_Olck', onLanguageChangeExternal }) => {
  const [currentLanguage, setCurrentLanguageState] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem('palash_selected_language');
      if (saved && VERNACULAR_META_MAP[saved as LanguageCode]) {
        return saved as LanguageCode;
      }
    } catch {}
    return initialLanguage;
  });

  useEffect(() => {
    if (initialLanguage && initialLanguage !== currentLanguage) {
      setCurrentLanguageState(initialLanguage);
    }
  }, [initialLanguage]);

  const setLanguage = (lang: LanguageCode) => {
    setCurrentLanguageState(lang);
    try {
      localStorage.setItem('palash_selected_language', lang);
    } catch {}
    if (onLanguageChangeExternal) {
      onLanguageChangeExternal(lang);
    }
    // Also dispatch custom event for non-react listeners
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('palash_language_changed', { detail: { language: lang } }));
    }
  };

  const languageInfo =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) || SUPPORTED_LANGUAGES[1];

  const vernacularMeta = VERNACULAR_META_MAP[currentLanguage] || VERNACULAR_META_MAP.sat_Olck;

  const getWordForLanguage = (item: {
    santaliOlChiki?: string;
    santaliDeva?: string;
    ho?: string;
    mundari?: string;
    hindi?: string;
  }): string => {
    if (currentLanguage === 'hoc_Deva' && item.ho) return item.ho;
    if (currentLanguage === 'unr_Deva' && item.mundari) return item.mundari;
    if (currentLanguage === 'sat_Deva' && item.santaliDeva) return item.santaliDeva;
    if (currentLanguage === 'hin_Deva' && item.hindi) return item.hindi;
    return item.santaliOlChiki || item.santaliDeva || item.ho || item.mundari || item.hindi || '';
  };

  const translateText = (hindiText: string): { translated: string; transliteration: string } => {
    if (!hindiText) return { translated: '', transliteration: '' };
    const res = translateVernacularText({
      text: hindiText,
      sourceLang: 'hin_Deva',
      targetLang: currentLanguage,
    });
    return {
      translated: res.translatedText,
      transliteration: res.transliteration || res.translatedText,
    };
  };

  const localizeText = (text: string): string => {
    if (!text) return '';
    const hName = vernacularMeta.hindiName;
    const eName = vernacularMeta.name;
    const sName = vernacularMeta.script;

    let res = text;
    // Replace complex phrases first
    res = res
      .replace(/संथाली \(Ol Chiki\)/gi, `${hName} (${sName})`)
      .replace(/संथाली \(ऑल चिकी\)/gi, `${hName} (${sName})`)
      .replace(/संथाली \(ओल चिकी\)/gi, `${hName} (${sName})`)
      .replace(/संथाली \(देवनागरी\)/gi, `${hName} (${sName})`)
      .replace(/हो \(वारंग क्षिति\/देवनागरी\)/gi, `${hName} (${sName})`)
      .replace(/मुंडारी \(देवनागरी\)/gi, `${hName} (${sName})`)
      .replace(/संथाली \/ Santali/gi, `${hName} / ${eName}`)
      .replace(/Santali \/ संथाली/gi, `${eName} / ${hName}`)
      .replace(/संथाली ऑल चिकी/gi, `${hName} (${sName})`)
      .replace(/संथाली ओल चिकी/gi, `${hName} (${sName})`)
      .replace(/ऑल चिकी/gi, sName)
      .replace(/ओल चिकी/gi, sName)
      .replace(/Ol Chiki/gi, sName)
      .replace(/\(ᱚᱞ ᱪᱤᱠᱤ\)/g, `(${sName})`)
      .replace(/ᱚᱞ ᱪᱤᱠᱤ/g, sName);

    if (currentLanguage !== 'sat_Olck') {
      res = res
        .replace(/संथाली/g, hName)
        .replace(/Santali/g, eName)
        .replace(/ᱥᱟᱱᱛᱟᱲᱤ/g, hName);
    }
    return res;
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        languageInfo,
        vernacularMeta,
        getWordForLanguage,
        translateText,
        localizeText,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    // Graceful fallback if outside provider
    const fallbackMeta = VERNACULAR_META_MAP.sat_Olck;
    return {
      currentLanguage: 'sat_Olck',
      setLanguage: () => {},
      languageInfo: SUPPORTED_LANGUAGES[1],
      vernacularMeta: fallbackMeta,
      getWordForLanguage: (item) => item.santaliOlChiki || item.hindi || '',
      translateText: (t) => ({ translated: t, transliteration: t }),
      localizeText: (t) => t,
    };
  }
  return context;
}
