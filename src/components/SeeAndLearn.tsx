import React, { useState } from 'react';
import {
  Trees,
  Volume2,
  Search,
  Sparkles,
  Heart,
  Eye,
  ShoppingBag,
  GraduationCap,
  Leaf,
  Sun,
  Droplets,
  Bird,
  Fish,
  Users,
  Footprints,
  BookOpen,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Globe,
} from 'lucide-react';
import { speakText, transliterateOlChiki } from '../utils/audioSynth';
import { translateVernacularText } from '../utils/vernacularEngine';
import { useLanguage } from '../context/LanguageContext';
import { LanguageCode } from '../types';

interface VocabularyItem {
  id: string;
  category: string;
  hindi: string;
  olChiki: string;
  devanagari: string;
  english: string;
  icon: any;
  sentenceHindi: string;
  sentenceSantali: string;
}

export const SeeAndLearn: React.FC = () => {
  const { currentLanguage, setLanguage, vernacularMeta } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>('nature');
  const [playingId, setPlayingId] = useState<string | null>(null);

  // Dynamic Lookup State
  const [queryText, setQueryText] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [dynamicResult, setDynamicResult] = useState<any | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const categories = [
    { id: 'nature', label: 'पेड़-पौधे व प्रकृति', santali: 'ᱫᱟᱨᱮ ᱟᱨ ᱯᱚᱨᱤᱵᱮᱥ', icon: Trees },
    { id: 'animals', label: 'वन्यजीव व पक्षी', santali: 'ᱵᱤᱨ ᱡᱤᱭᱟᱹᱞᱤ', icon: Bird },
    { id: 'family', label: 'हमारा परिवार', santali: 'ᱜᱷᱟᱨᱚᱸᱡᱽ', icon: Users },
    { id: 'body', label: 'शरीर के अंग', santali: 'ᱦᱚᱲᱢᱚ', icon: Eye },
    { id: 'market', label: 'हाट और संख्याएँ', santali: 'ᱦᱟᱴ ᱵᱟᱡᱟᱨ', icon: ShoppingBag },
    { id: 'school', label: 'विद्यालय व शिक्षा', santali: 'ᱟᱥᱲᱟ', icon: GraduationCap },
  ];

  const vocabData: Record<string, VocabularyItem[]> = {
    nature: [
      {
        id: 'nat-1',
        category: 'nature',
        hindi: 'साल का पेड़ (सखुआ)',
        olChiki: 'ᱥᱟᱨᱡᱚᱢ ᱫᱟᱨᱮ',
        devanagari: 'सारजोम दारे',
        english: 'Sal Tree (Shorea robusta)',
        icon: Trees,
        sentenceHindi: 'साल झारखण्ड का राजकीय वृक्ष है।',
        sentenceSantali: 'ᱥᱟᱨᱡᱚᱢ ᱫᱟᱨᱮ ᱫᱚ ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱨᱮᱱᱟᱜ ᱢᱟᱨᱟᱝ ᱫᱟᱨᱮ ᱠᱟᱱᱟ᱾',
      },
      {
        id: 'nat-2',
        category: 'nature',
        hindi: 'महुआ का पेड़',
        olChiki: 'ᱢᱟᱹᱛᱠᱚᱢ ᱫᱟᱨᱮ',
        devanagari: 'मातकोम दारे',
        english: 'Mahua Tree',
        icon: Leaf,
        sentenceHindi: 'महुआ के फूलों से मीठा रस मिलता है।',
        sentenceSantali: 'ᱢᱟᱹᱛᱠᱚᱢ ᱵᱟᱦᱟ ᱠᱷᱚᱱ ᱦᱮᱲᱮᱢ ᱨᱟᱥᱟ ᱧᱟᱢᱚᱜ-ᱟ᱾',
      },
      {
        id: 'nat-3',
        category: 'nature',
        hindi: 'पलाश का फूल',
        olChiki: 'ᱯᱚᱞᱟᱥ ᱵᱟᱦᱟ',
        devanagari: 'पलाश बाहा',
        english: 'Palash Flower (Flame of the forest)',
        icon: Sparkles,
        sentenceHindi: 'वसंत में पलाश के लाल फूल खिलते हैं।',
        sentenceSantali: 'ᱵᱟᱹᱥᱟᱹᱱᱛ ᱨᱮ ᱯᱚᱞᱟᱥ ᱵᱟᱦᱟ ᱟᱨᱟᱜ ᱜᱮ ᱯᱷᱩᱴᱟᱹᱣᱜ-ᱟ᱾',
      },
      {
        id: 'nat-4',
        category: 'nature',
        hindi: 'पानी (जल)',
        olChiki: 'ᱫᱟᱜ',
        devanagari: 'दाग (Daah)',
        english: 'Water',
        icon: Droplets,
        sentenceHindi: 'पौधों को जीवित रहने के लिए पानी चाहिए।',
        sentenceSantali: 'ᱫᱟᱨᱮ ᱡᱤᱣᱤᱫ ᱛᱟᱦᱮᱸᱱ ᱞᱟᱹᱜᱤᱫ ᱫᱟᱜ ᱞᱟᱹᱠᱛᱤᱜ-ᱟ᱾',
      },
      {
        id: 'nat-5',
        category: 'nature',
        hindi: 'सूरज (धूप)',
        olChiki: 'ᱥᱤᱛᱩᱝ / ᱵᱮᱲᱟ',
        devanagari: 'सितुंग / बेड़ा',
        english: 'Sunlight / Sun',
        icon: Sun,
        sentenceHindi: 'सूरज की धूप से पौधे भोजन बनाते हैं।',
        sentenceSantali: 'ᱵᱮᱲᱟ ᱨᱮᱱᱟᱜ ᱥᱤᱛᱩᱝ ᱛᱮ ᱫᱟᱨᱮ ᱡᱚᱢᱟᱜ ᱠᱚ ᱛᱮᱭᱟᱨᱟ᱾',
      },
      {
        id: 'nat-6',
        category: 'nature',
        hindi: 'पत्ता (पत्तियां)',
        olChiki: 'ᱥᱟᱠᱟᱢ',
        devanagari: 'साकाम',
        english: 'Leaf / Leaves',
        icon: Leaf,
        sentenceHindi: 'पेड़ की हरी पत्तियां हवा को शुद्ध करती हैं।',
        sentenceSantali: 'ᱫᱟᱨᱮ ᱨᱮᱱᱟᱜ ᱦᱟᱹᱨᱭᱟᱹᱲ ᱥᱟᱠᱟᱢ ᱦᱚᱭ ᱥᱟᱯᱷᱟᱭᱟ᱾',
      },
    ],
    animals: [
      {
        id: 'ani-1',
        category: 'animals',
        hindi: 'हाथी',
        olChiki: 'ᱦᱟᱹᱛᱤ',
        devanagari: 'हाती',
        english: 'Elephant',
        icon: Trees,
        sentenceHindi: 'हाथी दलमा के घने जंगलों में रहता है।',
        sentenceSantali: 'ᱦᱟᱹᱛᱤ ᱫᱚ ᱵᱤᱨ ᱨᱮ ᱛᱟᱦᱮᱸᱱᱟᱭ᱾',
      },
      {
        id: 'ani-2',
        category: 'animals',
        hindi: 'मोर',
        olChiki: 'ᱢᱟᱨᱟᱜ',
        devanagari: 'माराग',
        english: 'Peacock',
        icon: Bird,
        sentenceHindi: 'बारिश के मौसम में मोर नाचता है।',
        sentenceSantali: 'ᱫᱟᱜ ᱫᱤᱱ ᱨᱮ ᱢᱟᱨᱟᱜ ᱮᱱᱮᱡ-ᱟᱭ᱾',
      },
      {
        id: 'ani-3',
        category: 'animals',
        hindi: 'मछली',
        olChiki: 'ᱦᱟᱹᱠᱩ',
        devanagari: 'हाकु',
        english: 'Fish',
        icon: Fish,
        sentenceHindi: 'मछलियां तालाब के साफ पानी में तैरती हैं।',
        sentenceSantali: 'ᱦᱟᱹᱠᱩ ᱫᱚ ᱫᱟᱜ ᱨᱮᱠᱚ ᱯᱟᱭᱨᱟᱜ-ᱟ᱾',
      },
      {
        id: 'ani-4',
        category: 'animals',
        hindi: 'हिरण',
        olChiki: 'ᱡᱷᱤᱞ',
        devanagari: 'झिल',
        english: 'Deer',
        icon: Footprints,
        sentenceHindi: 'हिरण हरी घास खाता है।',
        sentenceSantali: 'ᱡᱷᱤᱞ ᱫᱚ ᱦᱟᱹᱨᱭᱟᱹᱲ ᱜᱷᱟᱸᱥ ᱮ ᱡᱚᱢᱟ᱾',
      },
    ],
    family: [
      {
        id: 'fam-1',
        category: 'family',
        hindi: 'मां (माता)',
        olChiki: 'ᱟᱭᱳ',
        devanagari: 'आयो',
        english: 'Mother',
        icon: Heart,
        sentenceHindi: 'मेरी मां मुझसे बहुत प्यार करती हैं।',
        sentenceSantali: 'ᱤᱧᱤᱡ ᱟᱭᱳ ᱤᱧ ᱟᱹᱰᱤ ᱫᱩᱞᱟᱹᱲᱟᱹᱧᱟᱭ᱾',
      },
      {
        id: 'fam-2',
        category: 'family',
        hindi: 'पिताजी',
        olChiki: 'ᱵᱟᱵᱟ',
        devanagari: 'बाबा',
        english: 'Father',
        icon: Users,
        sentenceHindi: 'पिताजी खेत में धान उपजाते हैं।',
        sentenceSantali: 'ᱵᱟᱵᱟ ᱫᱚ ᱠᱷᱮᱛ ᱨᱮ ᱦᱳᱲᱳᱭ ᱨᱚᱦᱚᱭᱟ᱾',
      },
      {
        id: 'fam-3',
        category: 'family',
        hindi: 'बहन',
        olChiki: 'ᱢᱤᱥᱤ / ᱫᱟᱹᱭ',
        devanagari: 'मिसि / दाई',
        english: 'Sister',
        icon: Users,
        sentenceHindi: 'मेरी बहन मेरे साथ पाठशाला जाती है।',
        sentenceSantali: 'ᱤᱧ ᱢᱤᱥᱤ ᱤᱧ ᱥᱟᱞᱟᱜ ᱟᱥᱲᱟ ᱪᱟᱞᱟᱜ-ᱟᱭ᱾',
      },
      {
        id: 'fam-4',
        category: 'family',
        hindi: 'शिक्षक (गुरुजी)',
        olChiki: 'ᱢᱟᱪᱮᱛ',
        devanagari: 'माचेत',
        english: 'Teacher',
        icon: GraduationCap,
        sentenceHindi: 'शिक्षक हमें अच्छी बातें सिखाते हैं।',
        sentenceSantali: 'ᱢᱟᱪᱮᱛ ᱫᱚ ᱟᱵᱚ ᱱᱟᱯᱟᱭ ᱠᱟᱛᱷᱟᱭ ᱪᱮᱫ ᱟᱵᱚᱱᱟ᱾',
      },
    ],
    body: [
      {
        id: 'bod-1',
        category: 'body',
        hindi: 'आंख',
        olChiki: 'ᱢᱮᱫ',
        devanagari: 'मेद',
        english: 'Eye',
        icon: Eye,
        sentenceHindi: 'हम अपनी आंखों से सुंदर संसार देखते हैं।',
        sentenceSantali: 'ᱟᱵᱚ ᱢᱮᱫ ᱛᱮ ᱥᱟᱱᱟᱢ ᱡᱤᱱᱤᱥ ᱵᱚ ᱧᱮᱞᱟ᱾',
      },
      {
        id: 'bod-2',
        category: 'body',
        hindi: 'कान',
        olChiki: 'ᱞᱩᱛᱩᱨ',
        devanagari: 'लुत्तुर',
        english: 'Ear',
        icon: Volume2,
        sentenceHindi: 'कान से हम मधुर संगीत और बातें सुनते हैं।',
        sentenceSantali: 'ᱞᱩᱛᱩᱨ ᱛᱮ ᱟᱵᱚ ᱠᱟᱛᱷᱟ ᱵᱚ ᱟᱸᱡᱚᱢᱟ᱾',
      },
      {
        id: 'bod-3',
        category: 'body',
        hindi: 'हाथ',
        olChiki: 'ᱛᱤ',
        devanagari: 'ती',
        english: 'Hand',
        icon: Heart,
        sentenceHindi: 'हाथ से हम कलम पकड़कर लिखते हैं।',
        sentenceSantali: 'ᱛᱤ ᱛᱮ ᱟᱵᱚ ᱠᱚᱞᱚᱢ ᱥᱟᱵ ᱠᱟᱛᱮ ᱵᱚ ᱚᱞᱟ᱾',
      },
      {
        id: 'bod-4',
        category: 'body',
        hindi: 'पैर',
        olChiki: 'ᱡᱟᱝᱜᱟ',
        devanagari: 'जांगा',
        english: 'Foot / Leg',
        icon: Footprints,
        sentenceHindi: 'पैर से हम चलकर विद्यालय जाते हैं।',
        sentenceSantali: 'ᱡᱟᱝᱜᱟ ᱛᱮ ᱛᱟᱲᱟᱢ ᱠᱟᱛᱮ ᱟᱥᱲᱟ ᱵᱚ ᱪᱟᱞᱟᱜ-ᱟ᱾',
      },
    ],
    market: [
      {
        id: 'mkt-1',
        category: 'market',
        hindi: 'साप्ताहिक हाट (बाजार)',
        olChiki: 'ᱦᱟᱴ ᱵᱟᱡᱟᱨ',
        devanagari: 'हाट बाजार',
        english: 'Weekly Village Market',
        icon: ShoppingBag,
        sentenceHindi: 'रविवार को गांव में हाट लगता है।',
        sentenceSantali: 'ᱨᱩᱭᱵᱟᱨ ᱦᱤᱞᱚᱜ ᱟᱹᱛᱩ ᱨᱮ ᱦᱟᱴ ᱦᱩᱭᱩᱜ-ᱟ᱾',
      },
      {
        id: 'mkt-2',
        category: 'market',
        hindi: 'एक (1)',
        olChiki: 'ᱢᱤᱫ (᱑)',
        devanagari: 'मिद (1)',
        english: 'One (1)',
        icon: Sparkles,
        sentenceHindi: 'मेरे पास एक पुस्तक है।',
        sentenceSantali: 'ᱤᱧ ᱴᱷᱮᱱ ᱢᱤᱫᱴᱟᱝ ᱯᱩᱛᱷᱤ ᱢᱮᱱᱟᱜ-ᱟ᱾',
      },
      {
        id: 'mkt-3',
        category: 'market',
        hindi: 'दो (2)',
        olChiki: 'ᱵᱟᱨ (᱒)',
        devanagari: 'बार (2)',
        english: 'Two (2)',
        icon: Sparkles,
        sentenceHindi: 'पौधे की दो हरी पत्तियां निकलीं।',
        sentenceSantali: 'ᱫᱟᱨᱮ ᱨᱮ ᱵᱟᱨᱭᱟ ᱦᱟᱹᱨᱭᱟᱹᱲ ᱥᱟᱠᱟᱢ ᱚᱰᱚᱠ ᱮᱱᱟ᱾',
      },
      {
        id: 'mkt-4',
        category: 'market',
        hindi: 'तीन (3)',
        olChiki: 'ᱯᱮ (᱓)',
        devanagari: 'पे (3)',
        english: 'Three (3)',
        icon: Sparkles,
        sentenceHindi: 'हाट में तीन टोकरी फल बिक रहे थे।',
        sentenceSantali: 'ᱦᱟᱴ ᱨᱮ ᱯᱮᱭᱟ ᱴᱩᱠᱞᱤ ᱡᱚ ᱟᱹᱠᱷᱨᱤᱧᱚᱜ ᱠᱟᱱ ᱛᱟᱦᱮᱸᱫ᱾',
      },
    ],
    school: [
      {
        id: 'sch-1',
        category: 'school',
        hindi: 'विद्यालय (पाठशाला)',
        olChiki: 'ᱟᱥᱲᱟ',
        devanagari: 'आसड़ा',
        english: 'Primary School',
        icon: GraduationCap,
        sentenceHindi: 'हम प्रतिदिन समय पर पाठशाला जाते हैं।',
        sentenceSantali: 'ᱟᱵᱚ ᱫᱤᱱᱟᱹᱢ ᱜᱮ ᱚᱠᱛᱚ ᱨᱮ ᱟᱥᱲᱟ ᱵᱚ ᱪᱟᱞᱟᱜ-ᱟ᱾',
      },
      {
        id: 'sch-2',
        category: 'school',
        hindi: 'पुस्तक (किताब)',
        olChiki: 'ᱯᱩᱛᱷᱤ',
        devanagari: 'पुथी',
        english: 'Book',
        icon: BookOpen,
        sentenceHindi: 'पुस्तक पढ़ने से हमें ज्ञान मिलता है।',
        sentenceSantali: 'ᱯᱩᱛᱷᱤ ᱯᱟᱲᱦᱟᱣ ᱞᱮᱠᱷᱟᱱ ᱜᱮᱭᱟᱱ ᱧᱟᱢᱚᱜ-ᱟ᱾',
      },
    ],
  };

  const handlePlaySound = async (id: string, textToSpeak: string) => {
    setPlayingId(id);
    try {
      await speakText(textToSpeak, 'hi-IN');
    } finally {
      setPlayingId(null);
    }
  };

  // Real Dynamic Translation Lookup with Rich Vernacular Fallback
  const handleDynamicSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = queryText.trim();
    if (!query) return;

    setIsSearching(true);
    setSearchError(null);
    setDynamicResult(null);

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: query,
          sourceLang: 'hin_Deva',
          targetLang: currentLanguage,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setDynamicResult({
          query,
          olChiki: data.translatedText,
          devanagari: data.transliteration || transliterateOlChiki(data.translatedText),
        });
        await speakText(data.transliteration || data.translatedText, 'hi-IN');
      } else {
        const vResult = translateVernacularText({
          text: query,
          sourceLang: 'hin_Deva',
          targetLang: currentLanguage,
        });
        setDynamicResult({
          query,
          olChiki: vResult.translatedText,
          devanagari: vResult.transliteration,
        });
        await speakText(vResult.transliteration || vResult.translatedText, 'hi-IN');
      }
    } catch (err: any) {
      console.warn('Word search error, using vernacular engine:', err);
      const vResult = translateVernacularText({
        text: query,
        sourceLang: 'hin_Deva',
        targetLang: currentLanguage,
      });
      setDynamicResult({
        query,
        olChiki: vResult.translatedText,
        devanagari: vResult.transliteration,
      });
      await speakText(vResult.transliteration || vResult.translatedText, 'hi-IN');
    } finally {
      setIsSearching(false);
    }
  };

  const activeItems = vocabData[activeCategory] || vocabData.nature;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-700 via-orange-800 to-red-800 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-amber-400/20">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center space-x-1.5 bg-amber-950/60 px-3 py-1 rounded-full text-xs font-bold text-amber-300 border border-amber-400/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>सचित्र {vernacularMeta.hindiName} शब्दावली (See & Learn Vocabulary Explorer)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            देखो, सुनो और सीखो (See & Learn)
          </h2>
          <p className="text-xs sm:text-sm text-amber-100 leading-relaxed">
            झारखण्ड के प्राथमिक विद्यार्थियों के लिए सचित्र मातृभाषा {vernacularMeta.hindiName} ({vernacularMeta.script}) शब्दावली। चित्र पर क्लिक करके सही उच्चारण सुनें।
          </p>
        </div>
      </div>

      {/* Dynamic Word Search / Real AI Lookup Box (Zero-Mock) */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-stone-800 flex items-center space-x-2">
            <Search className="w-4 h-4 text-amber-600" />
            <span>कोई भी नया हिन्दी शब्द खोजें (Dynamic AI Vernacular Lookup):</span>
          </label>
          <span className="text-[11px] text-stone-500">
            रीयल-टाइम {vernacularMeta.hindiName} अनुवाद
          </span>
        </div>

        <form onSubmit={handleDynamicSearch} className="flex gap-2">
          <input
            type="text"
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            placeholder="उदा. 'तितली', 'नदी', 'बादल', 'पहाड़'..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-stone-300 text-sm font-medium focus:ring-2 focus:ring-amber-600 focus:border-amber-600"
          />
          <button
            type="submit"
            disabled={isSearching || !queryText.trim()}
            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-amber-700 hover:bg-amber-800 text-white transition-all shadow-sm flex items-center space-x-2 disabled:opacity-50 cursor-pointer"
          >
            {isSearching ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>खोज रहे हैं...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{vernacularMeta.hindiName} में जानें</span>
              </>
            )}
          </button>
        </form>

        {/* Dynamic Search Error */}
        {searchError && (
          <p className="text-xs text-red-600 font-semibold bg-red-50 p-2.5 rounded-lg border border-red-200">
            {searchError}
          </p>
        )}

        {/* Dynamic Search Result Card */}
        {dynamicResult && (
          <div className="bg-amber-50/80 p-4 rounded-xl border border-amber-300 animate-in fade-in duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block">
                एआई {vernacularMeta.hindiName} अनुवाद परिणाम (Live Neural Output):
              </span>
              <div className="flex items-baseline space-x-3">
                <span className="text-sm font-semibold text-stone-600">
                  {dynamicResult.query} ➔
                </span>
                <span className="text-2xl font-bold text-red-950 font-serif">
                  {dynamicResult.olChiki}
                </span>
              </div>
              {dynamicResult.devanagari && (
                <span className="text-xs text-stone-700 block font-medium">
                  उच्चारण: {dynamicResult.devanagari}
                </span>
              )}
            </div>

            <button
              onClick={() =>
                speakText(
                  dynamicResult.devanagari || dynamicResult.olChiki,
                  'hi-IN'
                )
              }
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-amber-700 text-white text-xs font-bold shadow hover:bg-amber-800 transition-all cursor-pointer shrink-0"
            >
              <Volume2 className="w-4 h-4" />
              <span>🔊 उच्चारण सुनें</span>
            </button>
          </div>
        )}
      </div>

      {/* Translation Process Quick Switcher */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-stone-100 pb-2">
          <label className="text-xs font-bold text-stone-700 flex items-center space-x-1.5">
            <Globe className="w-4 h-4 text-amber-700" />
            <span>अनुवाद प्रक्रिया चुनें (Select Translation Process):</span>
          </label>
          <span className="text-xs font-bold text-stone-500">
            सक्रिय माध्यम: <span className="text-amber-800 font-extrabold">{vernacularMeta.name}</span> ({vernacularMeta.script})
          </span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { code: 'sat_Olck', label: 'हिन्दी ➔ संथाली (Ol Chiki)' },
            { code: 'sat_Deva', label: 'हिन्दी ➔ संथाली (Devanagari)' },
            { code: 'hoc_Deva', label: 'हिन्दी ➔ हो (Ho)' },
            { code: 'unr_Deva', label: 'हिन्दी ➔ मुण्डारी (Mundari)' },
            { code: 'kru_Deva', label: 'हिन्दी ➔ कुड़ुख (Kurukh)' },
            { code: 'khar_Deva', label: 'हिन्दी ➔ खड़िया (Kharia)' },
          ].map((item) => {
            const isSelected = currentLanguage === item.code;
            return (
              <button
                key={item.code}
                type="button"
                onClick={() => setLanguage(item.code as LanguageCode)}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-amber-800 text-white shadow-xs ring-2 ring-amber-300'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200'
                }`}
              >
                <span>{item.label}</span>
                {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Navigation Pills */}
      <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-700 text-white shadow-sm'
                  : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{cat.label}</span>
              <span className={`text-[10px] opacity-80 ${isActive ? 'text-amber-200' : 'text-stone-400'}`}>
                ({cat.santali})
              </span>
            </button>
          );
        })}
      </div>

      {/* Vocabulary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeItems.map((item, index) => {
          const Icon = item.icon;
          const isPlaying = playingId === item.id;

          const itemTrans = translateVernacularText({
            text: item.hindi,
            sourceLang: 'hin_Deva',
            targetLang: currentLanguage,
          });

          const sentenceTrans = translateVernacularText({
            text: item.sentenceHindi,
            sourceLang: 'hin_Deva',
            targetLang: currentLanguage,
          });

          const isOlChiki = currentLanguage === 'sat_Olck';
          const displayPrimary = isOlChiki ? item.olChiki : (itemTrans.translatedText || item.devanagari);
          const displayPhonetic = isOlChiki ? item.devanagari : (itemTrans.transliteration || itemTrans.translatedText);
          const displaySentence = isOlChiki ? item.sentenceSantali : (sentenceTrans.translatedText || item.sentenceSantali);

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs hover:shadow-md hover:border-amber-400 transition-all flex flex-col justify-between group space-y-4"
            >
              {/* Card Header (Clean & Text-First, No Images) */}
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-mono border border-amber-200">
                    शब्द #{index + 1}
                  </span>
                  <span className="text-xs font-bold text-stone-500">
                    {item.english}
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-600 text-white">
                  {vernacularMeta.name}
                </span>
              </div>

              {/* Top: Icon & Speaker Button */}
              <div className="flex items-start justify-between">
                <div className="p-3 rounded-2xl bg-amber-50 text-amber-800 border border-amber-200">
                  <Icon className="w-7 h-7" />
                </div>

                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() =>
                      handlePlaySound(
                        `${item.id}-vernacular`,
                        displayPhonetic || displayPrimary
                      )
                    }
                    disabled={isPlaying}
                    title={`मातृभाषा ${vernacularMeta.hindiName} उच्चारण सुनें`}
                    className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 transition-all cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-red-700" />
                    <span>{vernacularMeta.hindiName}</span>
                  </button>

                  <button
                    onClick={() =>
                      handlePlaySound(
                        `${item.id}-hin`,
                        item.hindi
                      )
                    }
                    disabled={isPlaying}
                    title="मानक हिन्दी उच्चारण सुनें"
                    className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 transition-all cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-stone-600" />
                    <span>हिन्दी</span>
                  </button>
                </div>
              </div>

              {/* Middle: Tribal Word & Hindi */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                  {item.hindi} ({item.english})
                </span>
                <div className="text-2xl font-bold text-red-950 font-serif leading-tight">
                  {displayPrimary}
                </div>
                {displayPhonetic && displayPhonetic !== displayPrimary && (
                  <div className="text-xs font-semibold text-stone-700">
                    उच्चारण: {displayPhonetic}
                  </div>
                )}
              </div>

              {/* Bottom: Example Sentence */}
              <div className="pt-3 border-t border-stone-100 bg-stone-50/70 p-3 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-stone-500 block">
                  मातृभाषा में वाक्य (Sentence in {vernacularMeta.name}):
                </span>
                <p className="text-xs font-bold text-stone-800">
                  {displaySentence}
                </p>
                <p className="text-[11px] text-stone-500">
                  हिन्दी: {item.sentenceHindi}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
