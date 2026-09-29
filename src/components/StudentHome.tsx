import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Volume2,
  Sparkles,
  Award,
  Layers,
  CheckSquare,
  Mic,
  Image as ImageIcon,
  Radio,
  Play,
  Pause,
  Star,
  Flame,
  ArrowRight,
  FileText,
  CheckCircle2,
  Clock,
  ExternalLink,
  Settings,
} from 'lucide-react';
import { AuthUser } from './LoginModal';
import { classStore, StudentProfile, ClassAssessmentFeedItem } from '../data/classStore';
import { speakText, stopSpeaking, playAudioChime } from '../utils/audioSynth';
import { useLanguage } from '../context/LanguageContext';
import { translateVernacularText } from '../utils/vernacularEngine';

interface StudentHomeProps {
  user: AuthUser;
  onNavigate: (screen: string) => void;
}

export const StudentHome: React.FC<StudentHomeProps> = ({ user, onNavigate }) => {
  const { currentLanguage, vernacularMeta } = useLanguage();
  const [isPlayingStory, setIsPlayingStory] = useState(false);
  const [isPlayingWelcome, setIsPlayingWelcome] = useState(false);
  const [playingItemId, setPlayingItemId] = useState<string | null>(null);
  const studentClass = (user.classNumber || 1) as 1 | 2 | 3 | 4 | 5;

  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [classFeed, setClassFeed] = useState<ClassAssessmentFeedItem[]>([]);
  const [completionNotice, setCompletionNotice] = useState<string | null>(null);

  // Sync with classStore
  useEffect(() => {
    let profile = classStore.getStudentById(user.id);
    if (!profile && user.emailOrMobile) {
      profile = classStore.getStudentByEmail(user.emailOrMobile);
    }
    if (!profile) {
      const classStudents = classStore.getStudentsByClass(studentClass);
      profile = classStudents[0] || null;
    }
    setStudentProfile(profile);

    // Strictly fetch assessments assigned to this student's class (1 to 5)
    const feed = classStore.getFeedByClass(studentClass);
    setClassFeed(feed);
  }, [user, studentClass]);

  // Handle instant completion of a worksheet
  const handleCompleteWorksheet = (item: ClassAssessmentFeedItem) => {
    if (!studentProfile) return;
    const score = Math.floor(Math.random() * 15) + 85; // 85-100
    classStore.recordStudentWorksheetCompletion(
      studentProfile.id,
      item.id,
      item.title,
      item.subject,
      score,
      'शानदार प्रयास! सभी प्रश्नों के उत्तर सही हैं।',
      'ᱟᱹᱰᱤ ᱱᱟᱯᱟᱭ! ᱡᱚᱛᱚ ᱠᱩᱠᱞᱤ ᱨᱮᱱᱟᱜ ᱛᱮᱞᱟ ᱴᱷᱤᱠ ᱜᱮᱭᱟ᱾'
    );

    // Refresh profile
    const updated = classStore.getStudentById(studentProfile.id);
    setStudentProfile(updated ? { ...updated } : null);
    setCompletionNotice(`बधाई! कार्यपत्रक "${item.title}" पूर्ण हो गया। अंक: ${score}/100!`);
    setTimeout(() => setCompletionNotice(null), 4000);
  };

  const studentModules = [
    {
      id: 'worksheets',
      title: `कक्षा ${studentClass} कार्यपत्रक (My Worksheets)`,
      subtitle: 'शिक्षक द्वारा दिए गए कार्यपत्रक हल करें व अंक देखें',
      icon: FileText,
      gradient: 'from-emerald-600 to-teal-700',
      tag: 'द्विभाषी अभ्यास',
    },
    {
      id: 'quiz',
      title: `कक्षा ${studentClass} प्रश्नोत्तरी (My Quiz)`,
      subtitle: `कक्षा ${studentClass} का द्विभाषी टेस्ट दें व अंक जीतें`,
      icon: CheckSquare,
      gradient: 'from-indigo-600 to-blue-700',
      tag: `कक्षा ${studentClass}`,
    },
    {
      id: 'see-and-learn',
      title: 'देखो और सीखो (See & Learn)',
      subtitle: `सचित्र ${vernacularMeta.hindiName} व हिन्दी शब्दावली`,
      icon: ImageIcon,
      gradient: 'from-amber-600 to-red-600',
      tag: 'चित्र + ऑडियो',
    },
    {
      id: 'pronunciation',
      title: 'उच्चारण कोच (Speech Coach)',
      subtitle: `${vernacularMeta.hindiName} व हिन्दी बोलना सीखें`,
      icon: Mic,
      gradient: 'from-emerald-600 to-teal-700',
      tag: 'माइक अभ्यास',
    },
    {
      id: 'flashcards',
      title: 'शब्दावली फ़्लैशकार्ड (Flashcards)',
      subtitle: 'पेड़-पौधे और प्रकृति अभ्यास कार्ड',
      icon: Layers,
      gradient: 'from-purple-600 to-pink-700',
      tag: 'अभ्यास कार्ड',
    },
    {
      id: 'classroom',
      title: 'कक्षा प्रसारण (Live Broadcast)',
      subtitle: `शिक्षक की बात ${vernacularMeta.hindiName} में लाइव सुनें`,
      icon: Radio,
      gradient: 'from-rose-600 to-red-700',
      tag: 'लाइव ऑडियो',
    },
    {
      id: 'progress',
      title: 'मेरी सीखने की यात्रा (Progress)',
      subtitle: 'अंक, बैज और NIPUN अधिगम रिपोर्ट',
      icon: Award,
      gradient: 'from-orange-600 to-amber-700',
      tag: 'प्रगति रिपोर्ट',
    },
    {
      id: 'settings',
      title: 'मेरी सेटिंग्स व लॉगआउट (Settings)',
      subtitle: 'डार्क/लाइट थीम, आवाज़ गति व खाता प्रबंधन',
      icon: Settings,
      gradient: 'from-slate-600 to-stone-700',
      tag: 'सेटिंग्स',
    },
  ];

  const [playingWord, setPlayingWord] = useState<string | null>(null);

  // Curated Visual Flashcards & See-and-Learn items for Student Dashboard
  const visualShowcaseItems = [
    { hindi: 'साल का पेड़ (सखुआ)', topic: 'पेड़ और प्रकृति' },
    { hindi: 'पलाश का फूल', topic: 'फूल' },
    { hindi: 'महुआ का पेड़', topic: 'पेड़' },
    { hindi: 'पानी (जल)', topic: 'जल और नदी' },
    { hindi: 'मोर', topic: 'पक्षी' },
    { hindi: 'हाथी', topic: 'जानवर' },
  ];

  const handlePlayStory = async () => {
    if (isPlayingStory) {
      stopSpeaking();
      setIsPlayingStory(false);
      return;
    }

    setIsPlayingStory(true);
    playAudioChime(523.25);
    const cleanStory = vernacularMeta.treeWaterStoryText;
    try {
      await speakText(cleanStory, 'hi-IN');
    } finally {
      setIsPlayingStory(false);
    }
  };

  const handlePlayWord = async (word: string, label: string) => {
    setPlayingWord(label);
    playAudioChime(440);
    try {
      await speakText(word, 'hi-IN');
    } finally {
      setPlayingWord(null);
    }
  };

  const handlePlayWelcomeGreeting = async () => {
    if (isPlayingWelcome) {
      stopSpeaking();
      setIsPlayingWelcome(false);
      return;
    }
    setIsPlayingWelcome(true);
    playAudioChime(523.25);
    const welcomeText = `${vernacularMeta.greeting} ${user.name}! कक्षा ${studentClass} के विद्यार्थी पोर्टल में आपका स्वागत है। अपनी मातृभाषा ${vernacularMeta.hindiName} और हिन्दी में आज के अभ्यास हल करें और नए सितारे जीतें।`;
    try {
      await speakText(welcomeText, 'hi-IN');
    } finally {
      setIsPlayingWelcome(false);
    }
  };

  const handlePlayFeedItem = async (item: ClassAssessmentFeedItem) => {
    if (playingItemId === item.id) {
      stopSpeaking();
      setPlayingItemId(null);
      return;
    }
    setPlayingItemId(item.id);
    playAudioChime(440);
    const textToSpeak = `${item.title}। विषय: ${item.subject}। ${item.description}`;
    try {
      await speakText(textToSpeak, 'hi-IN');
    } finally {
      setPlayingItemId(null);
    }
  };

  const performance = studentProfile?.overallPerformance || {
    grade: 'A',
    averageScore: 85,
    quizzesCompleted: 2,
    worksheetsCompleted: 1,
    attendanceRate: 95,
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Student Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg border border-emerald-500/20 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 px-3 py-1 rounded-full text-xs font-bold text-emerald-300 border border-emerald-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>विद्यार्थी पोर्टल • कक्षा {studentClass} (Class {studentClass} Isolated Portal)</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            {vernacularMeta.greeting}, {user.name}!
          </h2>

          <p className="text-sm text-emerald-100 leading-relaxed">
            कक्षा <strong>{studentClass}</strong> • {user.schoolName || 'राजकीय उत्क्रमित प्राथमिक विद्यालय, शिकारीपाड़ा'}। मातृभाषा {vernacularMeta.hindiName} (<strong>{vernacularMeta.nativeName}</strong>) और हिन्दी में आपकी कक्षा के कार्य नीचे दिए गए हैं।
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handlePlayWelcomeGreeting}
              id="student-play-welcome-btn"
              className="bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center space-x-2 shadow cursor-pointer transition-all"
            >
              {isPlayingWelcome ? (
                <>
                  <Pause className="w-3.5 h-3.5 animate-pulse" />
                  <span>रोकें (Stop)</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>🔊 स्वागत संदेश सुनें (Hindi Voice)</span>
                </>
              )}
            </button>

            <div className="bg-emerald-950/80 border border-emerald-700 px-3 py-1.5 rounded-xl text-xs flex items-center space-x-2">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="font-bold text-stone-200">
                ग्रेड: {performance.grade} ({performance.averageScore}%)
              </span>
            </div>
            <div className="bg-emerald-950/80 border border-emerald-700 px-3 py-1.5 rounded-xl text-xs flex items-center space-x-2">
              <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
              <span className="font-bold text-stone-200">
                क्विज़: {performance.quizzesCompleted} पूर्ण • कार्यपत्रक: {performance.worksheetsCompleted}
              </span>
            </div>
          </div>
        </div>

        {/* Decorative Vernacular Watermark */}
        <div className="absolute right-4 -bottom-8 text-[120px] font-black text-white/5 select-none pointer-events-none font-serif">
          {vernacularMeta.symbol}
        </div>
      </div>

      {completionNotice && (
        <div className="p-4 rounded-2xl bg-emerald-900 border border-emerald-600 text-emerald-100 text-xs font-bold flex items-center space-x-2 shadow-md animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
          <span>{completionNotice}</span>
        </div>
      )}

      {/* ======================================================= */}
      {/* STRICTLY CLASS-SPECIFIC ASSESSMENTS FEED (CLASS 1-5) */}
      {/* ======================================================= */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span>कक्षा {studentClass} के कार्य (Class {studentClass} Assigned Feed)</span>
            </span>
            <h3 className="text-lg font-black text-stone-900">
              मेरे शिक्षक द्वारा दिए गए अभ्यास पत्र व प्रश्नोत्तरी
            </h3>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 self-start sm:self-auto">
            {classFeed.length} मूल्यांकन उपलब्ध
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {classFeed.length === 0 ? (
            <p className="text-xs text-stone-400 py-6 col-span-2 text-center">
              कक्षा {studentClass} के लिए अभी कोई नया मूल्यांकन लंबित नहीं है।
            </p>
          ) : (
            classFeed.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-stone-50 border border-stone-200 hover:border-emerald-500 transition-all flex flex-col justify-between space-y-3 group"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        item.type === 'quiz'
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {item.type === 'quiz' ? 'प्रश्नोत्तरी (Quiz)' : 'कार्यपत्रक (Worksheet)'}
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">{item.publishedAt}</span>
                  </div>

                  <h4 className="text-sm font-bold text-stone-900 group-hover:text-emerald-700 transition-colors">
                    {item.title}
                  </h4>
                  {item.titleSantali && (
                    <p className="text-xs font-serif text-amber-900 font-medium">
                      {item.titleSantali}
                    </p>
                  )}
                  <p className="text-xs text-stone-500 leading-normal">{item.description}</p>
                </div>

                <div className="pt-2 border-t border-stone-200 flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-semibold text-stone-600">
                      विषय: {item.subject}
                    </span>
                    <button
                      type="button"
                      onClick={() => handlePlayFeedItem(item)}
                      id={`play-feed-item-${item.id}`}
                      className={`px-2 py-1 rounded-lg border text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                        playingItemId === item.id
                          ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs animate-pulse'
                          : 'bg-white hover:bg-emerald-50 text-stone-700 hover:text-emerald-900 border-stone-200'
                      }`}
                      title="विवरण सुनें"
                    >
                      <Volume2 className={`w-3 h-3 ${playingItemId === item.id ? 'text-white' : 'text-emerald-600'}`} />
                      <span>{playingItemId === item.id ? 'रोकें' : 'सुनें'}</span>
                    </button>
                  </div>

                  {item.type === 'quiz' ? (
                    <button
                      onClick={() => onNavigate('quiz')}
                      id={`start-class-quiz-${item.id}`}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1"
                    >
                      <span>क्विज़ शुरू करें</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => onNavigate('worksheets')}
                      id={`complete-worksheet-${item.id}`}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1"
                    >
                      <span>हल करें / सबमिट</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ======================================================= */}
      {/* VOCABULARY SHOWCASE: SEE & LEARN & FLASHCARDS PRACTICE */}
      {/* ======================================================= */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-700 uppercase tracking-wider">
              <Layers className="w-4 h-4 text-amber-600" />
              <span>'देखो और सीखो' एवं फ़्लैशकार्ड शब्दावली अभ्यास (Vocabulary Practice)</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-stone-900 mt-0.5">
              कक्षा {studentClass} शब्दावली कार्ड (Flashcards & Vocabulary)
            </h3>
            <p className="text-xs text-stone-500">
              कार्ड पर क्लिक करें और शुद्ध भारतीय उच्चारण में {vernacularMeta.hindiName} ({vernacularMeta.script}) व हिन्दी वाचन सुनें
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('see-and-learn')}
              id="student-open-see-and-learn-btn"
              className="px-3.5 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>देखो और सीखो</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('flashcards')}
              id="student-open-flashcards-btn"
              className="px-3.5 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>फ़्लैशकार्ड खोलें</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Gallery Cards Grid (Clean & Text-First, No Images) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {visualShowcaseItems.map((item, idx) => {
            const vTrans = translateVernacularText({
              text: item.hindi,
              sourceLang: 'hin_Deva',
              targetLang: currentLanguage,
            });

            return (
              <div
                key={idx}
                className="bg-stone-50 rounded-2xl p-3 border border-stone-200 hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between group space-y-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-mono">
                      #{idx + 1}
                    </span>
                    <span className="text-[10px] font-bold text-stone-400 truncate max-w-[50%]">
                      {item.topic}
                    </span>
                  </div>
                  <h4 className="text-xs font-black text-stone-900 pt-1 truncate">
                    {item.hindi}
                  </h4>
                  <div className="font-serif font-black text-sm text-amber-950 pt-0.5 truncate">
                    {vTrans.translatedText}
                  </div>
                  <div className="text-[10px] text-stone-600 font-medium truncate">
                    {vTrans.transliteration}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handlePlayWord(
                      vTrans.transliteration || vTrans.translatedText,
                      `${item.hindi}: ${vTrans.translatedText}`
                    )
                  }
                  className={`w-full py-1.5 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1 border transition-colors cursor-pointer ${
                    playingWord === `${item.hindi}: ${vTrans.translatedText}`
                      ? 'bg-amber-700 text-white border-amber-800 animate-pulse'
                      : 'bg-white hover:bg-amber-50 text-stone-700 border-stone-200 shadow-xs'
                  }`}
                >
                  <Volume2 className="w-3 h-3 text-amber-700" />
                  <span>उच्चारण सुनें</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Primary Learning Tiles */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <span>सीखने के अन्य मजेदार साधन (Learning Activities):</span>
          </h3>
          <span className="text-xs text-stone-500">कक्षा {studentClass} • संथाली एवं हिन्दी</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {studentModules.map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.id}
                id={`student-module-${mod.id}`}
                onClick={() => onNavigate(mod.id)}
                className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs hover:shadow-md hover:border-emerald-400 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${mod.gradient} text-white shadow-sm`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                    {mod.tag}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-stone-900 group-hover:text-emerald-700 transition-colors">
                    {mod.title}
                  </h4>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                    {mod.subtitle}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                  <span>शुरू करें</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Vernacular Audio Story Section */}
      <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-xl">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-900">
            <BookOpen className="w-3.5 h-3.5 text-amber-700" />
            <span>आज की पर्यावरण लोक-कथा (Today's Vernacular Story)</span>
          </div>
          <h4 className="text-lg font-bold text-stone-900">
            {vernacularMeta.treeWaterStoryTitle} ({vernacularMeta.treeWaterStorySubtitle})
          </h4>
          <p className="text-xs text-stone-600 leading-relaxed">
            झारखण्ड के साल और महुआ के पेड़ बच्चों को सिखाते हैं कि बारिश का पानी कैसे धरती में समाता है और हम सभी को जीवन देता है।
          </p>
        </div>

        <button
          onClick={handlePlayStory}
          id="student-play-story-btn"
          className="flex items-center space-x-2 px-5 py-3 rounded-xl font-bold text-xs bg-amber-700 hover:bg-amber-800 text-white shadow transition-all cursor-pointer shrink-0"
        >
          {isPlayingStory ? (
            <>
              <Pause className="w-4 h-4 animate-pulse" />
              <span>कहानी रोकें (Stop Story)</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span>🔊 कहानी सुनें ({vernacularMeta.hindiName} + हिन्दी)</span>
            </>
          )}
        </button>
      </div>

      {/* Interactive Voice & Pronunciation Practice Bar for Students */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Volume2 className="w-4 h-4 text-emerald-600" />
            <h4 className="text-sm font-bold text-stone-900">
              शुद्ध {vernacularMeta.hindiName} व हिन्दी उच्चारण अभ्यास:
            </h4>
          </div>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            भारतीय हिन्दी आवाज़ सक्रिय
          </span>
        </div>

        <p className="text-xs text-stone-500">
          किसी भी शब्द पर टैप करें और शुद्ध भारतीय हिन्दी लहजे में उसकी ध्वनि सुनें:
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          {vernacularMeta.practiceWords.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handlePlayWord(item.word, item.label)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                playingWord === item.label
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm animate-pulse'
                  : 'bg-stone-50 hover:bg-emerald-50 text-stone-800 hover:text-emerald-900 border-stone-200 hover:border-emerald-300'
              }`}
            >
              <Volume2 className={`w-3.5 h-3.5 ${playingWord === item.label ? 'text-white' : 'text-emerald-600'}`} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
