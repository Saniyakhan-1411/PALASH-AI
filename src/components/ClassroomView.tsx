import React, { useState, useEffect, useRef } from 'react';
import {
  Radio,
  Volume2,
  Mic,
  MicOff,
  Users,
  Send,
  RotateCcw,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Copy,
  Check,
  Globe,
  MessageSquare,
  ArrowRightLeft,
  VolumeX,
} from 'lucide-react';
import { speakText, playAudioChime, transliterateOlChiki } from '../utils/audioSynth';
import { translateVernacularText } from '../utils/vernacularEngine';
import { broadcastService, BroadcastSentence } from '../services/broadcastService';
import { CURRICULUM_LESSONS, SUPPORTED_LANGUAGES } from '../data/curriculum';
import { LanguageCode } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ClassroomViewProps {
  currentUser?: any;
}

export const ClassroomView: React.FC<ClassroomViewProps> = ({ currentUser: propUser }) => {
  const { currentLanguage, vernacularMeta } = useLanguage();
  // Determine user role
  const user = propUser || (() => {
    try {
      const saved = localStorage.getItem('palash_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })();

  const isStudent = user?.role === 'student';

  // Room State
  const [roomCode, setRoomCode] = useState<string>('');
  const [joinedRoom, setJoinedRoom] = useState<boolean>(!isStudent);
  const [inputCode, setInputCode] = useState<string>('');
  const [joinError, setJoinError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Broadcast Content
  const [inputText, setInputText] = useState('बच्चों, पौधों को जीवित रहने के लिए पानी और धूप की आवश्यकता होती है।');
  const [currentOlChiki, setCurrentOlChiki] = useState('ᱫᱟᱨᱮ ᱡᱤᱣᱤᱫ ᱛᱟᱦᱮᱸᱱ ᱞᱟᱹᱜᱤᱫ ᱫᱟᱜ ᱟᱨ ᱥᱤᱛᱩᱝ ᱞᱟᱹᱠᱛᱤᱜ-ᱟ᱾');
  const [currentDevanagari, setCurrentDevanagari] = useState('दारे जीविद ताहेन लागिद दाग आर सितुंग लाकतिग-आ।');
  const [currentHindi, setCurrentHindi] = useState('बच्चों, पौधों को जीवित रहने के लिए पानी और धूप की आवश्यकता होती है।');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isLiveMic, setIsLiveMic] = useState(false);
  const [autoSpeakEnabled, setAutoSpeakEnabled] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>('sat_Olck');

  // Student bidirectional mic state
  const [studentInput, setStudentInput] = useState('');
  const [isStudentRecording, setIsStudentRecording] = useState(false);

  // Live sentences feed
  const [sentenceFeed, setSentenceFeed] = useState<BroadcastSentence[]>([]);

  // Speech Recognition ref
  const recognitionRef = useRef<any>(null);
  const vadTimerRef = useRef<any>(null);

  useEffect(() => {
    if (!isStudent) {
      // Teacher automatically generates or retrieves 6-digit room code
      const code = broadcastService.generateRoomCode();
      setRoomCode(code);
      setSentenceFeed(broadcastService.getRoomHistory(code));
    } else {
      // Student checks if previously connected
      const existing = localStorage.getItem('palash_student_room_code') || broadcastService.getActiveRoomCode();
      if (existing && existing.length === 6) {
        setInputCode(existing);
      }
    }

    // Subscribe to live broadcast sentences
    const unsubscribe = broadcastService.subscribe((sentence) => {
      setSentenceFeed((prev) => [sentence, ...prev.filter((s) => s.id !== sentence.id).slice(0, 30)]);

      // Update the main big board
      setCurrentHindi(sentence.textHindi);
      setCurrentOlChiki(sentence.textSantaliOlChiki);
      setCurrentDevanagari(sentence.transliterationDevanagari);

      // Auto speak for student if enabled
      if (isStudent && autoSpeakEnabled) {
        speakText(sentence.transliterationDevanagari || sentence.textSantaliOlChiki, 'hi-IN');
      }
    });

    return () => {
      unsubscribe();
      if (vadTimerRef.current) clearTimeout(vadTimerRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    };
  }, [isStudent, autoSpeakEnabled]);

  // Set up Speech Recognition with Voice Activity Detection (VAD)
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'hi-IN';

      rec.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript.trim()) {
          if (!isStudent) {
            setInputText(transcript);
            // High sensitivity VAD: auto-broadcast after 1.5s pause
            if (vadTimerRef.current) clearTimeout(vadTimerRef.current);
            vadTimerRef.current = setTimeout(() => {
              if (transcript.trim().length > 2) {
                handleBroadcast(transcript);
              }
            }, 1500);
          } else {
            setStudentInput(transcript);
          }
        }
      };

      rec.onerror = (e: any) => {
        console.warn('Classroom speech recognition error:', e.error);
        setIsLiveMic(false);
        setIsStudentRecording(false);
      };

      rec.onend = () => {
        setIsLiveMic(false);
        setIsStudentRecording(false);
      };

      recognitionRef.current = rec;
    }
  }, [isStudent, roomCode]);

  const toggleLiveMic = () => {
    if (isLiveMic) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      setIsLiveMic(false);
      if (vadTimerRef.current) clearTimeout(vadTimerRef.current);
    } else {
      if (recognitionRef.current) {
        try {
          playAudioChime(440);
          recognitionRef.current.start();
          setIsLiveMic(true);
        } catch (e) {
          console.warn('Mic start failed:', e);
        }
      }
    }
  };

  const handleCopyRoomCode = () => {
    navigator.clipboard?.writeText(roomCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleStudentJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim().length !== 6) {
      setJoinError('कृपया सही ६ अंकों का रूम कोड दर्ज करें (उदा. 742918)');
      return;
    }
    const success = broadcastService.joinRoom(inputCode.trim());
    if (success) {
      setRoomCode(inputCode.trim());
      setJoinedRoom(true);
      setJoinError(null);
      setSentenceFeed(broadcastService.getRoomHistory(inputCode.trim()));
    } else {
      setJoinError('रूम कोड अमान्य है।');
    }
  };

  // Broadcast sentence from Teacher to Student Room
  const handleBroadcast = async (textToBroadcast: string) => {
    const text = textToBroadcast.trim();
    if (!text) return;

    setIsTranslating(true);

    try {
      // Real-time Neural translation to Santali, Ho, or Mundari
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          sourceLang: 'hin_Deva',
          targetLang: selectedLanguage,
        }),
      });

      let olChiki = '';
      let deva = '';

      if (res.ok) {
        const data = await res.json();
        olChiki = data.translatedText;
        deva = data.transliteration || '';
      } else {
        const vResult = translateVernacularText({
          text,
          sourceLang: 'hin_Deva',
          targetLang: selectedLanguage,
        });
        olChiki = vResult.translatedText;
        deva = vResult.transliteration;
      }

      setCurrentHindi(text);
      setCurrentOlChiki(olChiki);
      setCurrentDevanagari(deva);

      // Broadcast to Room
      broadcastService.broadcastSentence({
        roomCode: roomCode || broadcastService.getActiveRoomCode(),
        senderRole: 'teacher',
        senderName: user?.name || 'शिक्षक',
        textHindi: text,
        textSantaliOlChiki: olChiki,
        transliterationDevanagari: deva,
      });

      // Speak in teacher's audio output in Hindi accent
      if (autoSpeakEnabled) {
        speakText(deva || olChiki, 'hi-IN');
      }
    } catch (err) {
      console.warn('Broadcast translation error:', err);
      const vResult = translateVernacularText({
        text,
        sourceLang: 'hin_Deva',
        targetLang: selectedLanguage,
      });
      setCurrentHindi(text);
      setCurrentOlChiki(vResult.translatedText);
      setCurrentDevanagari(vResult.transliteration);

      broadcastService.broadcastSentence({
        roomCode: roomCode || broadcastService.getActiveRoomCode(),
        senderRole: 'teacher',
        senderName: user?.name || 'शिक्षक',
        textHindi: text,
        textSantaliOlChiki: vResult.translatedText,
        transliterationDevanagari: vResult.transliteration,
      });

      if (autoSpeakEnabled) {
        speakText(vResult.transliteration || vResult.translatedText, 'hi-IN');
      }
    } finally {
      setIsTranslating(false);
    }
  };

  // Bidirectional: Student sending question/response in Tribal Language to Teacher
  const handleStudentSend = async () => {
    const text = studentInput.trim();
    if (!text) return;

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          sourceLang: selectedLanguage,
          targetLang: 'hin_Deva',
        }),
      });

      let hindiTranslation = text;
      if (res.ok) {
        const data = await res.json();
        hindiTranslation = data.translatedText;
      } else {
        const vResult = translateVernacularText({
          text,
          sourceLang: selectedLanguage,
          targetLang: 'hin_Deva',
        });
        hindiTranslation = vResult.translatedText;
      }

      broadcastService.broadcastSentence({
        roomCode,
        senderRole: 'student',
        senderName: user?.name || 'विद्यार्थी',
        textHindi: hindiTranslation,
        textSantaliOlChiki: text,
        transliterationDevanagari: text,
      });

      setStudentInput('');
    } catch (e) {
      console.warn('Student broadcast send error, using vernacular engine:', e);
      const vResult = translateVernacularText({
        text,
        sourceLang: selectedLanguage,
        targetLang: 'hin_Deva',
      });

      broadcastService.broadcastSentence({
        roomCode,
        senderRole: 'student',
        senderName: user?.name || 'विद्यार्थी',
        textHindi: vResult.translatedText,
        textSantaliOlChiki: text,
        transliterationDevanagari: text,
      });

      setStudentInput('');
    }
  };

  // If student hasn't joined a room yet, render Join Code Screen
  if (isStudent && !joinedRoom) {
    return (
      <div className="max-w-md mx-auto p-4 sm:p-6 space-y-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xl text-center space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-red-100 text-red-700 flex items-center justify-center mx-auto shadow-inner">
            <Radio className="w-8 h-8 animate-pulse text-red-600" />
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900">
              लाइव कक्षा से जुड़ें (Join Live Classroom)
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              शिक्षक द्वारा दिए गए ६ अंकों का रूम कोड दर्ज करें। शिक्षक के बोलते ही तुरंत {vernacularMeta.hindiName} में वाक्य और आवाज़ सुनाई देगी।
            </p>
          </div>

          <form onSubmit={handleStudentJoin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1 text-left">
                ६ अंकों का रूम कोड (Room Code):
              </label>
              <input
                type="text"
                maxLength={6}
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.replace(/\D/g, ''))}
                placeholder="उदा. 742918"
                className="w-full text-center text-3xl font-mono font-black tracking-widest p-4 rounded-2xl border-2 border-stone-300 focus:border-red-600 focus:ring-2 focus:ring-red-500"
              />
            </div>

            {joinError && (
              <div className="text-xs text-red-600 font-semibold bg-red-50 p-2.5 rounded-xl border border-red-200">
                {joinError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-red-700 hover:bg-red-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>कक्षा में प्रवेश करें (Connect to Room)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-3 border-t border-stone-100 text-[11px] text-stone-400">
            सक्रिय शिक्षक कोड का परीक्षण: <span className="font-mono font-bold text-stone-700">742918</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Banner with Room Code */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-red-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="space-y-1.5 max-w-xl">
          <div className="inline-flex items-center space-x-2 bg-red-600/30 px-3 py-1 rounded-full text-xs font-bold text-red-300 border border-red-500/30">
            <Radio className="w-3.5 h-3.5 animate-pulse text-red-400" />
            <span>
              {isStudent
                ? 'विद्यार्थी लाइव प्रसारण रिसेप्शन (Student Live Feed)'
                : 'लाइव कक्षा ब्रॉडकास्ट (Live Classroom Broadcast & Projector Mode)'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            द्विभाषी लाइव कक्षा मंच (Bilingual Classroom Broadcast)
          </h2>
          <p className="text-xs text-stone-300">
            {isStudent
              ? `शिक्षक के बोलते ही रीयल-टाइम अनुवाद व शुद्ध उच्चारण प्राप्त करें। आप भी ${vernacularMeta.hindiName} में बोलकर प्रश्न पूछ सकते हैं।`
              : `बड़ी स्क्रीन / प्रोजेक्टर के लिए अनुकूलित। शिक्षक हिन्दी में बोलें, कक्षा में ${vernacularMeta.name} (${vernacularMeta.script}) और शुद्ध ऑडियो प्रसारित होगा।`}
          </p>
        </div>

        {/* 6-Digit Room Code Card */}
        <div className="bg-stone-800/90 border-2 border-amber-400/40 p-4 rounded-2xl shadow-lg flex flex-col items-center space-y-1.5 shrink-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
            कक्षा रूम कोड (Room Code)
          </span>
          <div className="flex items-center space-x-3">
            <span className="text-2xl sm:text-3xl font-black font-mono tracking-widest text-white">
              {roomCode || broadcastService.getActiveRoomCode()}
            </span>
            <button
              onClick={handleCopyRoomCode}
              title="कोड कॉपी करें"
              className="p-1.5 rounded-lg bg-stone-700 hover:bg-stone-600 text-stone-200 transition-colors cursor-pointer"
            >
              {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <div className="flex items-center space-x-1.5 text-[11px] text-stone-400">
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isStudent ? 'आप कक्षा से जुड़े हैं' : '२८ विद्यार्थी जुड़े हैं'}</span>
          </div>
        </div>
      </div>

      {/* Giant Projector Screen */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-10 border-2 border-stone-800 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-800 pb-4 gap-3">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <div className="flex items-center space-x-1.5">
              <Globe className="w-4 h-4 text-amber-400" />
              <label htmlFor="classroom-lang-select" className="text-xs font-bold text-stone-300">
                मातृभाषा:
              </label>
              <select
                id="classroom-lang-select"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value as LanguageCode)}
                className="bg-stone-800 border border-stone-700 text-amber-300 text-xs font-bold rounded-xl px-2.5 py-1 focus:ring-2 focus:ring-red-500 cursor-pointer"
              >
                {SUPPORTED_LANGUAGES.filter((l) => l.code !== 'hin_Deva').map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.name} ({l.nativeName})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setAutoSpeakEnabled(!autoSpeakEnabled)}
              className={`flex items-center space-x-1 px-3 py-1 rounded-xl text-xs font-bold border transition-colors ${
                autoSpeakEnabled
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                  : 'bg-stone-800 text-stone-400 border-stone-700'
              }`}
            >
              {autoSpeakEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{autoSpeakEnabled ? 'ऑटो-ऑडियो चालू' : 'ऑटो-ऑडियो बंद'}</span>
            </button>
          </div>
        </div>

        {/* Giant Ol Chiki Script Display */}
        <div className="min-h-[130px] flex items-center justify-center text-center p-4">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-amber-400 font-serif leading-tight tracking-wide drop-shadow-md">
            {currentOlChiki}
          </h1>
        </div>

        {/* Original Hindi & Phonetic Guide Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-stone-800/80 p-4 rounded-2xl border border-stone-700">
            <span className="text-[11px] text-stone-400 font-bold block mb-1">
              मूल हिन्दी वाक्य (Spoken Hindi):
            </span>
            <p className="text-base font-semibold text-stone-200">{currentHindi}</p>
          </div>

          <div className="bg-stone-800/80 p-4 rounded-2xl border border-stone-700 flex items-center justify-between gap-3">
            <div>
              <span className="text-[11px] text-stone-400 font-bold block mb-1">
                देवनागरी उच्चारण मार्गदर्शिका:
              </span>
              <p className="text-base font-semibold text-amber-200">{currentDevanagari}</p>
            </div>

            <button
              onClick={() => speakText(currentDevanagari || currentOlChiki, 'hi-IN')}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow transition-all shrink-0 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>सुनें</span>
            </button>
          </div>
        </div>
      </div>

      {/* Teacher Broadcast Controller (if Teacher) */}
      {!isStudent && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-red-600" />
              शिक्षक प्रसारण नियंत्रण (Teacher Live Voice & Text Input):
            </h3>
            <span className="text-xs text-stone-500">
              {isLiveMic ? '🔴 लाइव वॉइस एक्टिविटी डिटेक्शन (VAD) चालू है' : 'माइक बंद'}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleBroadcast(inputText);
                }}
                placeholder="कक्षा में बोलने वाला वाक्य लिखें या माइक चालू करें..."
                className="w-full px-5 py-3.5 rounded-2xl border-2 border-stone-200 focus:border-red-600 focus:ring-2 focus:ring-red-500 text-base text-stone-900 font-medium"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleLiveMic}
                className={`flex items-center space-x-2 px-5 py-3.5 rounded-2xl font-bold text-sm shadow-sm transition-all ${
                  isLiveMic
                    ? 'bg-red-600 text-white animate-pulse ring-4 ring-red-200'
                    : 'bg-stone-900 hover:bg-stone-800 text-white'
                }`}
              >
                {isLiveMic ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-red-400" />}
                <span>{isLiveMic ? 'लाइव माइक रोकें' : '🎤 लाइव माइक (VAD)'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleBroadcast(inputText)}
                disabled={isTranslating || !inputText.trim()}
                className="flex items-center space-x-2 px-6 py-3.5 rounded-2xl font-bold text-sm bg-red-700 hover:bg-red-800 text-white disabled:opacity-50 shadow-md cursor-pointer transition-all"
              >
                <Send className="w-4 h-4" />
                <span>{isTranslating ? 'प्रसारित हो रहा है...' : 'प्रसारित करें'}</span>
              </button>
            </div>
          </div>

          {/* Quick Classroom Preset Buttons */}
          <div className="pt-2">
            <span className="text-xs font-semibold text-stone-500 block mb-2">
              त्वरित शिक्षण वाक्य (Quick Classroom Presets):
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                'अपनी पर्यावरण की किताब खोलिए।',
                'ध्यान से सुनो और मेरे साथ दोहराओ।',
                'पौधों को पानी कौन देता है?',
                'झारखण्ड का राजकीय वृक्ष साल है।',
                'सभी बच्चे शांत होकर बैठें।',
              ].map((phrase, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputText(phrase);
                    handleBroadcast(phrase);
                  }}
                  className="text-xs px-3.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 transition-colors"
                >
                  {phrase}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Student Bidirectional Interaction Module (if Student) */}
      {isStudent && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              शिक्षक से प्रश्न पूछें (Ask Teacher in Tribal Language):
            </h3>
            <span className="text-xs text-stone-500">द्विभाषी अनुवाद (Tribal ➔ Hindi)</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={studentInput}
              onChange={(e) => setStudentInput(e.target.value)}
              placeholder={`${vernacularMeta.hindiName} या मातृभाषा में प्रश्न लिखें...`}
              className="flex-1 px-4 py-3 rounded-2xl border-2 border-stone-200 focus:border-red-600 text-sm font-medium"
            />

            <button
              onClick={handleStudentSend}
              disabled={!studentInput.trim()}
              className="px-5 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm flex items-center space-x-1.5 justify-center cursor-pointer shadow-sm disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>शिक्षक को भेजें</span>
            </button>
          </div>
        </div>
      )}

      {/* Live Sentences Stream Timeline */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <Radio className="w-4 h-4 text-red-600" />
            कक्षा लाइव सत्र इतिहास (Live Session History):
          </h3>
          <span className="text-xs text-stone-500 font-mono">
            {sentenceFeed.length} वाक्य प्रसारित
          </span>
        </div>

        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
          {sentenceFeed.length === 0 ? (
            <p className="text-xs text-stone-400 py-4 text-center">
              अभी तक कोई वाक्य प्रसारित नहीं हुआ है। शिक्षक के बोलने पर यहाँ रीयल-टाइम अपडेट दिखाई देगा।
            </p>
          ) : (
            sentenceFeed.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all ${
                  item.senderRole === 'student'
                    ? 'bg-emerald-50/60 border-emerald-200'
                    : 'bg-stone-50 border-stone-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.senderRole === 'student'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {item.senderName} ({item.senderRole === 'student' ? 'विद्यार्थी' : 'शिक्षक'})
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>

                  <button
                    onClick={() => speakText(item.transliterationDevanagari || item.textSantaliOlChiki, 'hi-IN')}
                    className="p-1 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-200 transition-colors"
                    title="आवाज़ सुनें"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="font-serif font-bold text-stone-900 text-base">
                  {item.textSantaliOlChiki}
                </div>
                <div className="text-xs text-stone-600 mt-0.5">
                  {item.textHindi}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
