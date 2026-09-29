import React, { useState, useEffect, useRef } from 'react';
import {
  Layers,
  Volume2,
  Sparkles,
  RefreshCw,
  Search,
  BookOpen,
  Leaf,
  Sun,
  Droplets,
  Trees,
  Flower2,
  Sprout,
  Apple,
  Mic,
  MicOff,
  GraduationCap,
  Image as ImageIcon,
  CheckCircle2,
  SlidersHorizontal,
  Globe,
} from 'lucide-react';
import { Flashcard, LanguageCode } from '../types';
import { CURRICULUM_LESSONS } from '../data/curriculum';
import { speakText, playAudioChime, transliterateOlChiki, getIndianVoice } from '../utils/audioSynth';
import { translateVernacularText } from '../utils/vernacularEngine';
import { offlineStorage } from '../services/offlineStorage';
import { useLanguage } from '../context/LanguageContext';

export const FlashcardsView: React.FC = () => {
  const { currentLanguage, setLanguage, vernacularMeta } = useLanguage();
  // Class & Generation Controls
  const [selectedClass, setSelectedClass] = useState<number>(3);
  const [selectedTopic, setSelectedTopic] = useState<string>('पौधे, प्रकृति और जल (Plants & Water)');
  const [cardCount, setCardCount] = useState<number>(6);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [playingId, setPlayingId] = useState<string | null>(null);

  // Search Voice Translation States
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTranslation, setSearchTranslation] = useState<{
    query: string;
    olChiki: string;
    deva: string;
  } | null>(null);
  const [isSearchingVoice, setIsSearchingVoice] = useState(false);
  const [isSearchMicRecording, setIsSearchMicRecording] = useState(false);
  const searchRecognitionRef = useRef<any>(null);

  // Class options for Jharkhand NIPUN Bharat Primary
  const CLASS_OPTIONS = [
    { num: 1, label: 'कक्षा 1 (Class 1)', desc: 'बुनियादी शब्द, पशु-पक्षी, रंग' },
    { num: 2, label: 'कक्षा 2 (Class 2)', desc: 'हमारा परिवार, गाँव, घर, रिश्ते' },
    { num: 3, label: 'कक्षा 3 (Class 3)', desc: 'पर्यावरण, पौधे, मिट्टी, जल' },
    { num: 4, label: 'कक्षा 4 (Class 4)', desc: 'वन, नदियाँ, मौसम, समुदाय' },
    { num: 5, label: 'कक्षा 5 (Class 5)', desc: 'संस्कृति, धरोहर, शिल्प, विज्ञान' },
  ];

  // Popular topic suggestions by class
  const CLASS_TOPIC_SUGGESTIONS: Record<number, string[]> = {
    1: ['पालतू और जंगली जानवर (Animals)', 'पक्षी और उनकी आवाज़ें (Birds)', 'हमारे फल और फूल (Fruits & Flowers)', 'रंग और आकार (Colors & Shapes)'],
    2: ['मेरा परिवार और गाँव (Family & Village)', 'घर और दैनिक वस्तुएं (Home Objects)', 'साप्ताहिक हाट व फल (Market & Food)', 'सफाई और स्वास्थ्य (Hygiene)'],
    3: ['पौधों को पानी और धूप (Plants & Sunlight)', 'झारखण्ड के पेड़ (Trees of Jharkhand)', 'जल संरक्षण (Water Conservation)', 'मिट्टी और बीज (Soil & Seeds)'],
    4: ['वन और नदियाँ (Forests & Rivers)', 'मौसम और ऋतुएँ (Weather & Seasons)', 'हमारे खाद्य पदार्थ (Food & Crops)', 'पहाड़ और प्राकृतिक संपदा (Nature)'],
    5: ['संथाली पर्व व सोहराय (Tribal Festivals)', 'पारंपरिक वाद्ययंत्र (Traditional Music)', 'गाँव की कला और शिल्प (Folk Art & Crafts)', 'प्रकृति व वन संरक्षण (Ecology)'],
  };

  useEffect(() => {
    // Check if we have saved flashcards for current class
    const saved = offlineStorage.getSavedFlashcards();
    if (saved.length > 0) {
      setFlashcards(saved);
    } else {
      handleGenerateCards(selectedClass, selectedTopic, cardCount);
    }
  }, []);

  // Web Speech recognition for search term voice capture
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'hi-IN'; // Indian locale speech recognition

      rec.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        if (text) {
          setSearchTerm(text);
          handleSearchTranslate(text);
        }
        setIsSearchMicRecording(false);
      };

      rec.onerror = () => setIsSearchMicRecording(false);
      rec.onend = () => setIsSearchMicRecording(false);
      searchRecognitionRef.current = rec;
    }
  }, []);

  const toggleSearchMic = () => {
    if (isSearchMicRecording) {
      searchRecognitionRef.current?.stop();
      setIsSearchMicRecording(false);
    } else {
      try {
        playAudioChime(440);
        searchRecognitionRef.current?.start();
        setIsSearchMicRecording(true);
      } catch (e) {
        console.warn('Search mic error:', e);
      }
    }
  };

  const handleSearchTranslate = async (termToTranslate?: string) => {
    const term = (termToTranslate || searchTerm).trim();
    if (!term) {
      setSearchTranslation(null);
      return;
    }

    setIsSearchingVoice(true);

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: term,
          sourceLang: 'hin_Deva',
          targetLang: currentLanguage,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSearchTranslation({
          query: term,
          olChiki: data.translatedText,
          deva: data.transliteration || (currentLanguage === 'sat_Olck' ? transliterateOlChiki(data.translatedText) : data.translatedText),
        });
        // Auto synthesize in authentic Indian accent
        await speakText(data.transliteration || data.translatedText, 'hi-IN');
      } else {
        const vResult = translateVernacularText({
          text: term,
          sourceLang: 'hin_Deva',
          targetLang: currentLanguage,
        });
        setSearchTranslation({
          query: term,
          olChiki: vResult.translatedText,
          deva: vResult.transliteration || vResult.translatedText,
        });
        await speakText(vResult.transliteration || vResult.translatedText, 'hi-IN');
      }
    } catch {
      const vResult = translateVernacularText({
        text: term,
        sourceLang: 'hin_Deva',
        targetLang: currentLanguage,
      });
      setSearchTranslation({
        query: term,
        olChiki: vResult.translatedText,
        deva: vResult.transliteration || vResult.translatedText,
      });
      await speakText(vResult.transliteration || vResult.translatedText, 'hi-IN');
    } finally {
      setIsSearchingVoice(false);
    }
  };

  const handleGenerateCards = async (cls = selectedClass, top = selectedTopic, cnt = cardCount) => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/flashcards/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classNumber: cls,
          topic: top,
          count: cnt,
        }),
      });

      if (!res.ok) throw new Error('Flashcard generation API failed');

      const data = await res.json();
      const generatedCards: Flashcard[] = (data.flashcards || []).map((c: Flashcard) => ({
        ...c,
        imageUrl: '',
      }));

      setFlashcards(generatedCards);
      offlineStorage.saveFlashcards(generatedCards);
      playAudioChime(660);
    } catch (e: any) {
      console.warn('Using curriculum fallback without images:', e);
      // Retrieve lessons for this class
      const matchingLessons = CURRICULUM_LESSONS.filter((l) => l.classNumber === cls);
      const activeLesson = matchingLessons.find((l) => l.topic.toLowerCase().includes(top.toLowerCase())) || matchingLessons[0] || CURRICULUM_LESSONS[0];

      let vocabPool = [...activeLesson.keyVocabulary];
      matchingLessons.forEach((l) => {
        if (l.id !== activeLesson.id) vocabPool.push(...l.keyVocabulary);
      });
      if (vocabPool.length < cnt) {
        CURRICULUM_LESSONS.forEach((l) => vocabPool.push(...l.keyVocabulary));
      }

      const fallbackCards: Flashcard[] = vocabPool.slice(0, cnt).map((v, i) => {
        return {
          id: `fc-c${cls}-${i}-${Date.now()}`,
          topic: top,
          classNumber: cls,
          hindiWord: v.hindi,
          santaliWordOlChiki: v.santaliOlChiki,
          santaliWordDeva: v.santaliDevanagari,
          englishMeaning: v.meaning,
          exampleSentenceHindi: `${v.hindi} कक्षा ${cls} के बच्चों के लिए महत्वपूर्ण है।`,
          exampleSentenceSantali: `${v.santaliOlChiki} ᱫᱚ ᱟᱹᱰᱤ ᱞᱟᱹᱠᱛᱤᱜ ᱠᱟᱱᱟ᱾`,
          iconName: 'BookOpen',
          visualPrompt: v.meaning,
          imageUrl: '',
          learningOutcomeCode: activeLesson.learningOutcomes[0]?.code || `EVS-${cls}.1`,
        };
      });

      setFlashcards(fallbackCards);
      offlineStorage.saveFlashcards(fallbackCards);
      playAudioChime(520);
    } finally {
      setIsGenerating(false);
    }
  };

  // Play Vernacular Audio in Authentic Indian Accent
  const handlePlaySantaliAudio = async (card: Flashcard, spokenText?: string) => {
    setPlayingId(`${card.id}-sat`);
    playAudioChime(587.33); // D5 chime
    try {
      const textToSpeak = spokenText || card.santaliWordDeva || transliterateOlChiki(card.santaliWordOlChiki);
      await speakText(textToSpeak, 'hi-IN');
    } finally {
      setPlayingId(null);
    }
  };

  // Play Hindi Audio in Authentic Indian Accent
  const handlePlayHindiAudio = async (card: Flashcard) => {
    setPlayingId(`${card.id}-hin`);
    playAudioChime(493.88); // B4 chime
    try {
      await speakText(card.hindiWord, 'hi-IN');
    } finally {
      setPlayingId(null);
    }
  };

  const renderCardIcon = (iconName?: string) => {
    switch (iconName?.toLowerCase()) {
      case 'sun':
        return <Sun className="w-5 h-5 text-amber-500" />;
      case 'droplets':
        return <Droplets className="w-5 h-5 text-sky-500" />;
      case 'trees':
      case 'treepine':
        return <Trees className="w-5 h-5 text-emerald-600" />;
      case 'flower2':
      case 'flower':
        return <Flower2 className="w-5 h-5 text-rose-500" />;
      case 'sprout':
        return <Sprout className="w-5 h-5 text-lime-600" />;
      case 'apple':
        return <Apple className="w-5 h-5 text-red-500" />;
      case 'bookopen':
        return <BookOpen className="w-5 h-5 text-indigo-500" />;
      default:
        return <Leaf className="w-5 h-5 text-emerald-500" />;
    }
  };

  // Filter flashcards by search term if provided
  const filteredCards = searchTerm.trim()
    ? flashcards.filter(
        (c) =>
          c.hindiWord.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.santaliWordDeva.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.santaliWordOlChiki.includes(searchTerm) ||
          c.englishMeaning.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : flashcards;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Banner with Indian Accent Badge */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-red-950 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-stone-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <div className="inline-flex items-center space-x-2 bg-red-600/30 px-3 py-1 rounded-full text-xs font-bold text-red-300 border border-red-500/30">
              <Layers className="w-3.5 h-3.5" />
              <span>सचित्र द्विभाषी फ़्लैशकार्ड (Photo Flashcards)</span>
            </div>
            <div className="inline-flex items-center space-x-1.5 bg-emerald-950/60 px-2.5 py-1 rounded-full text-[11px] font-semibold text-emerald-300 border border-emerald-500/30">
              <Volume2 className="w-3 h-3 text-emerald-400" />
              <span>भारतीय उच्चारण सक्रिय (Indian Accent Audio)</span>
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            कक्षावार सचित्र द्विभाषी फ़्लैशकार्ड
          </h2>
          <p className="text-xs text-stone-300 mt-1 max-w-xl leading-relaxed">
            कक्षा 1 से 5 का चयन करें, एकाधिक फ़्लैशकार्ड जनरेट करें। प्रत्येक कार्ड पर वास्तविक शैक्षिक फ़ोटो, {vernacularMeta.hindiName} ({vernacularMeta.script}) एवं शुद्ध भारतीय उच्चारण में ऑडियो उपलब्ध है।
          </p>
        </div>

        <button
          onClick={() => handleGenerateCards(selectedClass, selectedTopic, cardCount)}
          disabled={isGenerating}
          className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-red-700 hover:bg-red-800 text-white text-xs font-bold shadow-md transition-all cursor-pointer disabled:opacity-50 shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? 'फ़्लैशकार्ड बन रहे हैं...' : `${cardCount} फ़्लैशकार्ड जनरेट करें`}</span>
        </button>
      </div>

      {/* 0. Translation Process Quick Switcher (Hindi to Ho, Santhali, Mundari, etc.) */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
          <div className="flex items-center space-x-2">
            <Globe className="w-5 h-5 text-red-700 shrink-0" />
            <h3 className="text-sm font-black text-stone-900 uppercase tracking-wider">
              अनुवाद प्रक्रिया चुनें (Select Translation Process):
            </h3>
          </div>
          <div className="text-xs font-bold text-stone-600">
            सक्रिय माध्यम: <span className="text-red-700 font-extrabold">{vernacularMeta.name}</span> ({vernacularMeta.script})
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { code: 'sat_Olck', label: 'हिन्दी ➔ संथाली (Ol Chiki)', short: 'संथाली (Ol Chiki)' },
            { code: 'sat_Deva', label: 'हिन्दी ➔ संथाली (Devanagari)', short: 'संथाली (देवनागरी)' },
            { code: 'hoc_Deva', label: 'हिन्दी ➔ हो (Ho)', short: 'हो (Ho)' },
            { code: 'unr_Deva', label: 'हिन्दी ➔ मुण्डारी (Mundari)', short: 'मुण्डारी (Mundari)' },
            { code: 'kru_Deva', label: 'हिन्दी ➔ कुड़ुख (Kurukh)', short: 'कुड़ुख (Kurukh)' },
            { code: 'khar_Deva', label: 'हिन्दी ➔ खड़िया (Kharia)', short: 'खड़िया (Kharia)' },
          ].map((item) => {
            const isSelected = currentLanguage === item.code;
            return (
              <button
                key={item.code}
                type="button"
                onClick={() => setLanguage(item.code as LanguageCode)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-red-700 text-white shadow-sm ring-2 ring-red-300'
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

      {/* Class Selection & Generation Controls Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-5 h-5 text-red-700" />
            <h3 className="text-sm font-black text-stone-900 uppercase tracking-wider">
              1. कक्षा चुनें (Select Class)
            </h3>
          </div>
          <span className="text-xs font-bold text-stone-500">
            कक्षा {selectedClass} चयनित
          </span>
        </div>

        {/* Class Buttons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {CLASS_OPTIONS.map((cls) => {
            const isSelected = selectedClass === cls.num;
            return (
              <button
                key={cls.num}
                type="button"
                onClick={() => {
                  setSelectedClass(cls.num);
                  const firstTopic = CLASS_TOPIC_SUGGESTIONS[cls.num][0];
                  setSelectedTopic(firstTopic);
                  handleGenerateCards(cls.num, firstTopic, cardCount);
                }}
                className={`flex flex-col text-left p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-red-700 bg-red-50/70 shadow-sm ring-2 ring-red-200'
                    : 'border-stone-200 bg-stone-50 hover:bg-white hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`text-sm font-black ${isSelected ? 'text-red-900' : 'text-stone-800'}`}>
                    {cls.label}
                  </span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-red-700 shrink-0" />}
                </div>
                <span className="text-[10px] text-stone-500 mt-1 line-clamp-2 leading-tight">
                  {cls.desc}
                </span>
              </button>
            );
          })}
        </div>

        {/* Topic & Count Selector */}
        <div className="pt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold text-stone-700 flex items-center space-x-1.5">
              <span>विषय / पाठ (Topic)</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {(CLASS_TOPIC_SUGGESTIONS[selectedClass] || []).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setSelectedTopic(t);
                    handleGenerateCards(selectedClass, t, cardCount);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedTopic === t
                      ? 'bg-red-700 text-white shadow-sm'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-700 flex items-center justify-between">
              <span>कार्डों की संख्या (Count)</span>
              <span className="text-red-700 font-black">{cardCount} कार्ड</span>
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[4, 6, 8, 12].map((cnt) => (
                <button
                  key={cnt}
                  type="button"
                  onClick={() => {
                    setCardCount(cnt);
                    handleGenerateCards(selectedClass, selectedTopic, cnt);
                  }}
                  className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    cardCount === cnt
                      ? 'bg-stone-900 text-white shadow-sm'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {cnt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Search Voice Translation Bar */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (!e.target.value.trim()) setSearchTranslation(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearchTranslate(searchTerm);
              }}
              placeholder="शब्द खोजें (उदा. पानी, पेड़, गाय, किताब, आम) — स्वतः सचित्र अनुवाद व भारतीय उच्चारण सुनाई देगा..."
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl border-2 border-stone-200 focus:border-red-600 focus:ring-2 focus:ring-red-500 text-sm font-medium"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={toggleSearchMic}
              type="button"
              className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl font-bold text-xs transition-all cursor-pointer ${
                isSearchMicRecording
                  ? 'bg-red-600 text-white animate-pulse ring-4 ring-red-200'
                  : 'bg-stone-900 text-white hover:bg-stone-800'
              }`}
            >
              {isSearchMicRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-red-400" />}
              <span>{isSearchMicRecording ? 'सुनना रोकें' : 'माइक से खोजें'}</span>
            </button>

            <button
              onClick={() => handleSearchTranslate(searchTerm)}
              disabled={isSearchingVoice || !searchTerm.trim()}
              className="px-5 py-2.5 rounded-2xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs shadow-sm cursor-pointer disabled:opacity-50 transition-all"
            >
              {isSearchingVoice ? 'अनुवाद हो रहा...' : 'शब्दावली अनुवाद'}
            </button>
          </div>
        </div>

        {/* Search Translation Result Card (No Images) */}
        {searchTranslation && (
          <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fadeIn">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-2xl bg-amber-200/80 text-amber-900 border border-amber-300">
                <Sparkles className="w-5 h-5 text-amber-800" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block mb-0.5">
                  लाइव {vernacularMeta.hindiName} अनुवाद:
                </span>
                <div className="flex items-baseline space-x-3 flex-wrap">
                  <span className="text-2xl font-black text-red-950 font-serif">
                    {searchTranslation.olChiki}
                  </span>
                  <span className="text-sm font-bold text-stone-700">
                    ({searchTranslation.deva})
                  </span>
                  <span className="text-xs text-stone-500 font-medium">
                    = {searchTranslation.query}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => speakText(searchTranslation.deva || searchTranslation.olChiki, 'hi-IN')}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-amber-200 hover:bg-amber-300 text-amber-950 text-xs font-bold transition-all border border-amber-400 cursor-pointer shadow-xs"
              >
                <Volume2 className="w-3.5 h-3.5 text-red-700" />
                <span>🔊 {vernacularMeta.hindiName} उच्चारण</span>
              </button>

              <button
                onClick={() => speakText(searchTranslation.query, 'hi-IN')}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-900 text-xs font-bold transition-all border border-stone-300 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5 text-stone-700" />
                <span>🔊 हिन्दी उच्चारण</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center space-x-2 text-xs text-stone-600">
          <span className="font-bold text-stone-900">
            {filteredCards.length} फ़्लैशकार्ड उपलब्ध
          </span>
          <span>•</span>
          <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-md font-bold text-[10px]">
            कक्षा {selectedClass}
          </span>
          <span>•</span>
          <span className="truncate max-w-xs">{selectedTopic}</span>
        </div>
        <div className="text-[11px] text-stone-500 flex items-center space-x-1">
          <span>भारतीय लहजे में आवाज़</span>
        </div>
      </div>

      {/* Multiple Flashcards Grid with Photos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCards.map((card, index) => {
          const isVernacularPlaying = playingId === `${card.id}-sat`;
          const isHindiPlaying = playingId === `${card.id}-hin`;

          // Dynamic translation for this card based on selected translation process / language
          const wordTrans = translateVernacularText({
            text: card.hindiWord,
            sourceLang: 'hin_Deva',
            targetLang: currentLanguage,
          });

          const sentenceTrans = translateVernacularText({
            text: card.exampleSentenceHindi,
            sourceLang: 'hin_Deva',
            targetLang: currentLanguage,
          });

          // Determine target language word and phonetic guide
          let displayTargetWord = wordTrans.translatedText;
          let displayPhonetic = wordTrans.transliteration;
          let displaySentence = sentenceTrans.translatedText;

          if (currentLanguage === 'sat_Olck') {
            displayTargetWord = wordTrans.translatedText || card.santaliWordOlChiki;
            displayPhonetic = wordTrans.transliteration || card.santaliWordDeva;
            displaySentence = sentenceTrans.translatedText || card.exampleSentenceSantali;
          } else if (currentLanguage === 'sat_Deva') {
            displayTargetWord = wordTrans.transliteration || card.santaliWordDeva || wordTrans.translatedText;
            displayPhonetic = card.santaliWordOlChiki ? `Ol Chiki: ${card.santaliWordOlChiki}` : '';
            displaySentence = sentenceTrans.translatedText || sentenceTrans.transliteration;
          } else if (currentLanguage === 'hoc_Deva') {
            displayTargetWord = wordTrans.translatedText;
            displayPhonetic = wordTrans.transliteration ? `उच्चारण: ${wordTrans.transliteration}` : `हो भाषा (${vernacularMeta.script})`;
            displaySentence = sentenceTrans.translatedText;
          } else if (currentLanguage === 'unr_Deva') {
            displayTargetWord = wordTrans.translatedText;
            displayPhonetic = wordTrans.transliteration ? `उच्चारण: ${wordTrans.transliteration}` : `मुण्डारी भाषा (${vernacularMeta.script})`;
            displaySentence = sentenceTrans.translatedText;
          } else {
            displayTargetWord = wordTrans.translatedText;
            displayPhonetic = wordTrans.transliteration || wordTrans.translatedText;
            displaySentence = sentenceTrans.translatedText;
          }

          return (
            <div
              key={card.id}
              className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              {/* Card Header (Clean & Text-First, No Images) */}
              <div className="p-4 bg-gradient-to-r from-amber-50 to-stone-50 border-b border-stone-200 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2.5 rounded-xl bg-amber-100 text-amber-900 border border-amber-200">
                    {renderCardIcon(card.iconName)}
                  </div>
                  <div>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-stone-200 text-stone-700 font-mono">
                      कार्ड #{index + 1}
                    </span>
                    <h4 className="text-sm font-black text-stone-900 mt-0.5">
                      {card.hindiWord}
                    </h4>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-red-100 text-red-800 border border-red-200">
                    कक्षा {card.classNumber || selectedClass}
                  </span>
                  <span className="text-[10px] font-bold text-amber-800">
                    {vernacularMeta.name}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                {/* Vernacular Language Word and Script */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-amber-900 uppercase tracking-widest block">
                      {vernacularMeta.name} ({vernacularMeta.script}):
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200">
                      शब्दावली #{index + 1}
                    </span>
                  </div>
                  <div className="text-2xl font-black text-red-950 font-serif leading-tight">
                    {displayTargetWord}
                  </div>
                  {displayPhonetic && (
                    <div className="text-xs font-bold text-stone-700">
                      {displayPhonetic.startsWith('Ol') || displayPhonetic.startsWith('उच्चारण') || displayPhonetic.includes('भाषा')
                        ? displayPhonetic
                        : `उच्चारण (देवनागरी): ${displayPhonetic}`}
                    </div>
                  )}
                </div>

                {/* Hindi & English Meaning */}
                <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200 space-y-0.5">
                  <div className="text-xs font-bold text-stone-900">
                    हिन्दी: <span className="text-red-800 text-sm font-black">{card.hindiWord}</span>
                  </div>
                  <div className="text-[11px] text-stone-500 font-medium">
                    English: {card.englishMeaning}
                  </div>
                </div>

                {/* Example Sentences */}
                <div className="text-xs text-stone-600 space-y-1 bg-amber-50/50 p-3 rounded-2xl border border-amber-100">
                  <span className="text-[10px] font-bold text-amber-900 block">
                    {vernacularMeta.name} उदाहरण वाक्य:
                  </span>
                  <div className="font-serif font-bold text-stone-800 text-[13px]">
                    {displaySentence}
                  </div>
                  <div className="text-[11px] text-stone-500">
                    हिन्दी: {card.exampleSentenceHindi}
                  </div>
                </div>

                {/* Dual Indian Accent Audio Buttons */}
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handlePlaySantaliAudio(card, displayPhonetic || displayTargetWord)}
                    disabled={isVernacularPlaying}
                    className="flex-1 flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-bold border border-amber-300 transition-colors cursor-pointer shadow-xs"
                  >
                    <Volume2
                      className={`w-3.5 h-3.5 ${
                        isVernacularPlaying ? 'animate-bounce text-red-600' : 'text-amber-800'
                      }`}
                    />
                    <span>{isVernacularPlaying ? `${vernacularMeta.hindiName}...` : `🔊 ${vernacularMeta.hindiName}`}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePlayHindiAudio(card)}
                    disabled={isHindiPlaying}
                    className="flex-1 flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold border border-stone-200 transition-colors cursor-pointer"
                  >
                    <Volume2
                      className={`w-3.5 h-3.5 ${
                        isHindiPlaying ? 'animate-bounce text-red-600' : 'text-stone-600'
                      }`}
                    />
                    <span>{isHindiPlaying ? 'हिन्दी...' : '🔊 हिन्दी'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
