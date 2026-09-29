import React, { useState, useEffect } from 'react';
import {
  Mic,
  FileText,
  Layers,
  CheckSquare,
  BarChart3,
  Sparkles,
  ArrowRight,
  BookOpen,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Users,
  Award,
  GraduationCap,
  PlusCircle,
  Clock,
  Send,
  Radio,
  Image as ImageIcon,
  DownloadCloud,
  Settings,
  Volume2,
  Play,
  Pause,
} from 'lucide-react';
import { CURRICULUM_LESSONS } from '../data/curriculum';
import { classStore, StudentProfile, ClassAssessmentFeedItem } from '../data/classStore';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { translateVernacularText } from '../utils/vernacularEngine';
import { speakText, stopSpeaking, playAudioChime } from '../utils/audioSynth';

interface TeacherHomeProps {
  onNavigate: (screen: string, extraState?: any) => void;
}

export const TeacherHome: React.FC<TeacherHomeProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const { currentLanguage, vernacularMeta, localizeText } = useLanguage();
  const [selectedClass, setSelectedClass] = useState<number>(3);
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [feedItems, setFeedItems] = useState<ClassAssessmentFeedItem[]>([]);
  const [submittedWorksheets, setSubmittedWorksheets] = useState<any[]>([]);
  const [assessmentViewTab, setAssessmentViewTab] = useState<'feed' | 'submissions'>('feed');
  const [publishSuccessNotice, setPublishSuccessNotice] = useState<string | null>(null);

  // Audio Playback State for Teacher Dashboard
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [isPlayingAnnouncement, setIsPlayingAnnouncement] = useState<boolean>(false);

  // Review & Grading Modal State
  const [gradingItem, setGradingItem] = useState<{
    studentId: string;
    studentName: string;
    rollNo: number;
    submission: any;
  } | null>(null);
  const [gradeScore, setGradeScore] = useState<number>(90);
  const [gradeFeedback, setGradeFeedback] = useState<string>('उत्कृष्ट प्रयास! शब्दावली व उत्तर अत्यंत स्पष्ट हैं।');
  const [gradeFeedbackSantali, setGradeFeedbackSantali] = useState<string>(vernacularMeta.praisePhrase);

  // Load students, feed items, and submitted worksheets for selected class
  const reloadClassData = () => {
    const classStudents = classStore.getStudentsByClass(selectedClass);
    const classFeed = classStore.getFeedByClass(selectedClass);
    const classSubs = classStore.getSubmittedWorksheetsForClass(selectedClass);
    setStudents(classStudents);
    setFeedItems(classFeed);
    setSubmittedWorksheets(classSubs);
  };

  useEffect(() => {
    reloadClassData();
  }, [selectedClass]);

  const handleOpenGrading = (sub: any) => {
    setGradingItem(sub);
    setGradeScore(sub.submission.score || 88);
    setGradeFeedback(sub.submission.feedbackHindi || 'उत्कृष्ट प्रयास! उत्तर स्पष्ट व शुद्ध हैं।');
    setGradeFeedbackSantali(sub.submission.feedbackSantali || 'ᱟᱹᱰᱤ ᱱᱟᱯᱟᱭ! ᱡᱚᱛᱚ ᱠᱩᱠᱞᱤ ᱨᱮᱱᱟᱜ ᱛᱮᱞᱟ ᱴᱷᱤᱠ ᱜᱮᱭᱟ᱾');
  };

  const handleSaveGrading = () => {
    if (!gradingItem) return;
    const gradeLetter = gradeScore >= 90 ? 'A+' : gradeScore >= 75 ? 'A' : gradeScore >= 60 ? 'B+' : 'B';
    classStore.gradeStudentWorksheet(
      gradingItem.studentId,
      gradingItem.submission.id,
      gradeScore,
      gradeLetter,
      gradeFeedback,
      gradeFeedbackSantali
    );

    setPublishSuccessNotice(`${gradingItem.studentName} का कार्यपत्रक सफलतापूर्वक जाँचा गया! (ग्रेड: ${gradeLetter}, अंक: ${gradeScore})`);
    setTimeout(() => setPublishSuccessNotice(null), 4000);
    setGradingItem(null);
    reloadClassData();
  };

  const activeLesson = CURRICULUM_LESSONS.find((l) => l.classNumber === selectedClass) || CURRICULUM_LESSONS[0];

  // Authentic Indian Hindi Voice handlers for Teacher Dashboard
  const handlePlayTeacherAnnouncement = async () => {
    if (isPlayingAnnouncement) {
      stopSpeaking();
      setIsPlayingAnnouncement(false);
      return;
    }
    setIsPlayingAnnouncement(true);
    playAudioChime(523.25);
    const announcementText = `जोहार शिक्षक सुमन जी एवं प्यारे बच्चों! कक्षा ${selectedClass} के सभी विद्यार्थी ध्यान दें। आज का विषय है: ${activeLesson.chapterNameHindi}, पाठ: ${activeLesson.topicHindi}। सभी विद्यार्थी अपनी द्विभाषी कार्यपुस्तिका खोलें और मातृभाषा ${vernacularMeta.hindiName} तथा हिन्दी में अभ्यास करें।`;
    try {
      await speakText(announcementText, 'hi-IN');
    } finally {
      setIsPlayingAnnouncement(false);
    }
  };

  const handlePlayVoice = async (id: string, text: string) => {
    if (playingAudioId === id) {
      stopSpeaking();
      setPlayingAudioId(null);
      return;
    }
    setPlayingAudioId(id);
    playAudioChime(440);
    try {
      await speakText(text, 'hi-IN');
    } finally {
      setPlayingAudioId(null);
    }
  };

  // Quick publish assessment for this class directly
  const handleQuickPublish = (type: 'quiz' | 'worksheet') => {
    const assessmentTitle =
      type === 'quiz'
        ? `कक्षा ${selectedClass} अभ्यास प्रश्नोत्तरी (Class ${selectedClass} Practice Quiz)`
        : `कक्षा ${selectedClass} द्विभाषी अभ्यास पत्र (Class ${selectedClass} Worksheet)`;

    const newItem = classStore.publishAssessmentItem({
      type,
      classNumber: selectedClass,
      title: assessmentTitle,
      titleSantali: type === 'quiz' ? `${vernacularMeta.quizPhrase} (कक्षा ${selectedClass})` : `${vernacularMeta.worksheetPhrase} (कक्षा ${selectedClass})`,
      subject: selectedClass <= 2 ? 'मातृभाषा व प्रकृति' : 'पर्यावरण अध्ययन (EVS)',
      description: `शिक्षक द्वारा कक्षा ${selectedClass} के विद्यार्थियों के लिए प्रकाशित नया ${type === 'quiz' ? 'क्विज़' : 'कार्यपत्रक'}।`,
      createdBy: currentUser?.name || 'सुमन मुर्मू (शिक्षक)',
      questionsCount: 5,
    });

    setFeedItems(classStore.getFeedByClass(selectedClass));
    setPublishSuccessNotice(`कक्षा ${selectedClass} के लिए ${type === 'quiz' ? 'क्विज़' : 'कार्यपत्रक'} सफलतापूर्वक प्रकाशित किया गया!`);
    setTimeout(() => setPublishSuccessNotice(null), 4000);
  };

  // Calculate class average
  const avgClassScore =
    students.length > 0
      ? Math.round(students.reduce((acc, s) => acc + s.overallPerformance.averageScore, 0) / students.length)
      : 0;

  // Complete 12 Pedagogical Features matching Pic 1
  const quickActions = [
    {
      id: 'voice',
      title: 'लाइव आवाज़ अनुवाद',
      subtitle: `शिक्षक की हिन्दी आवाज़ ➔ ${vernacularMeta.hindiName} (${vernacularMeta.script}) (Target <3s)`,
      icon: Mic,
      color: 'bg-red-700 hover:bg-red-800 text-white',
      badge: 'Target <3s',
    },
    {
      id: 'classroom',
      title: 'लाइव कक्षा ब्रॉडकास्ट',
      subtitle: `कम बैंडविड्थ ऑडियो व रीयल-टाइम अनुवाद प्रसारण (${vernacularMeta.hindiName})`,
      icon: Radio,
      color: 'bg-rose-700 hover:bg-rose-800 text-white',
      badge: 'Live Audio',
    },
    {
      id: 'see-and-learn',
      title: 'देखो और सीखो',
      subtitle: `सचित्र शब्दावली, ${vernacularMeta.hindiName} व हिन्दी ऑडियो उच्चारण`,
      icon: ImageIcon,
      color: 'bg-amber-600 hover:bg-amber-700 text-white',
      badge: 'Visual Vocab',
    },
    {
      id: 'pronunciation',
      title: 'उच्चारण कोच',
      subtitle: `रीयल-टाइम आवाज़ परीक्षण, ${vernacularMeta.hindiName} व हिन्दी शुद्धता स्कोर`,
      icon: Mic,
      color: 'bg-emerald-700 hover:bg-emerald-800 text-white',
      badge: 'Speech Coach',
    },
    {
      id: 'flashcards',
      title: 'सचित्र फ़्लैशकार्ड',
      subtitle: `मातृभाषा ${vernacularMeta.hindiName} ऑडियो उच्चारण युक्त शब्दावली कार्ड`,
      icon: Layers,
      color: 'bg-stone-800 hover:bg-stone-900 text-white',
      badge: 'Flashcards',
    },
    {
      id: 'quiz',
      title: `कक्षा ${selectedClass} प्रश्नोत्तरी`,
      subtitle: `कक्षा ${selectedClass} के लिए द्विभाषी टेस्ट व त्वरित मूल्यांकन`,
      icon: CheckSquare,
      color: 'bg-indigo-700 hover:bg-indigo-800 text-white',
      badge: `Class ${selectedClass}`,
    },
    {
      id: 'worksheet',
      title: `कक्षा ${selectedClass} द्विभाषी कार्यपत्रक`,
      subtitle: `कक्षा ${selectedClass} के लिए मुद्रण-योग्य व डिजिटल कार्यपत्रक (${vernacularMeta.hindiName} + हिन्दी)`,
      icon: FileText,
      color: 'bg-teal-700 hover:bg-teal-800 text-white',
      badge: `Class ${selectedClass}`,
    },
    {
      id: 'assistant',
      title: 'एआई शिक्षण सहायक',
      subtitle: `मातृभाषा ${vernacularMeta.hindiName} में शिक्षण गतिविधियां व पाठ योजना`,
      icon: Sparkles,
      color: 'bg-amber-700 hover:bg-amber-800 text-white',
      badge: 'AI Copilot',
    },
    {
      id: 'curriculum',
      title: 'राज्य पाठ्यक्रम व NIPUN',
      subtitle: 'झारखण्ड शैक्षिक अनुसंधान परिषद JCERT पाठ योजना',
      icon: BookOpen,
      color: 'bg-blue-700 hover:bg-blue-800 text-white',
      badge: 'JCERT NIPUN',
    },
    {
      id: 'progress',
      title: 'अधिगम अंतराल विश्लेषण',
      subtitle: 'पहचाने गए गैप एवं उपचारात्मक शिक्षण सुझाव',
      icon: BarChart3,
      color: 'bg-purple-700 hover:bg-purple-800 text-white',
      badge: 'Analytics',
    },
    {
      id: 'offline',
      title: 'ऑफ़लाइन डेटा व सिंक',
      subtitle: 'ऑफ़लाइन कैश प्रबंधन व बैकग्राउंड क्लाउड सिंक',
      icon: DownloadCloud,
      color: 'bg-sky-700 hover:bg-sky-800 text-white',
      badge: 'Offline Cache',
    },
    {
      id: 'settings',
      title: 'प्रणाली सेटिंग्स',
      subtitle: 'डार्क/लाइट थीम, भाषा प्राथमिकता व सत्र प्रबंधन',
      icon: Settings,
      color: 'bg-slate-700 hover:bg-slate-800 text-white',
      badge: 'Settings',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Teacher Welcome Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-amber-950 to-red-950 text-white rounded-3xl p-6 sm:p-8 shadow-lg border border-amber-500/20 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 bg-amber-400/20 px-3 py-1 rounded-full text-xs font-bold text-amber-300 border border-amber-400/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>झारखण्ड प्राथमिक शिक्षा परिषद • शिक्षक पोर्टल (TEACHER PORTAL)</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            जोहार, {currentUser?.name || 'शिक्षक'} जी!
          </h2>

          <p className="text-sm text-stone-200 leading-relaxed">
            <strong>{currentUser?.schoolName || 'राजकीय उत्क्रमित प्राथमिक विद्यालय, शिकारीपाड़ा'}</strong>
            {' '}({currentUser?.district || 'दुमका'})। नीचे अपनी सक्रिय कक्षा (Class 1–5) चुनें और कार्यपत्रक, क्विज़ तथा विद्यार्थियों की प्रगति का प्रबंधन करें।
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => onNavigate('voice')}
              id="teacher-start-voice-btn"
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow transition-all cursor-pointer"
            >
              <Mic className="w-4 h-4" />
              <span>लाइव अनुवाद शुरू करें (Live Voice)</span>
            </button>

            <button
              type="button"
              onClick={handlePlayTeacherAnnouncement}
              id="teacher-play-announcement-btn"
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow transition-all cursor-pointer"
            >
              {isPlayingAnnouncement ? (
                <>
                  <Pause className="w-4 h-4 animate-pulse" />
                  <span>उद्घोषणा रोकें (Stop)</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span>🔊 दैनिक कक्षा उद्घोषणा सुनें (Hindi Voice)</span>
                </>
              )}
            </button>

            <button
              onClick={() => onNavigate('curriculum')}
              id="teacher-view-curriculum-btn"
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-amber-300" />
              <span>कक्षा {selectedClass} पाठ्यक्रम देखें</span>
            </button>
          </div>
        </div>

        {/* Decorative Ol Chiki Symbol in watermark */}
        <div className="absolute right-4 -bottom-8 text-[120px] font-black text-white/5 select-none pointer-events-none font-serif">
          ᱯ
        </div>
      </div>

      {/* ======================================================= */}
      {/* CLASS SELECTION BAR (CLASS 1 TO 5) */}
      {/* ======================================================= */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-red-700 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4" />
              <span>सक्रिय कक्षा चयन (Active Target Class)</span>
            </div>
            <h3 className="text-lg font-black text-stone-900">
              कक्षा {selectedClass} का प्रबंधन (Class {selectedClass} Management)
            </h3>
          </div>

          <div className="flex items-center space-x-1.5 bg-stone-100 p-1.5 rounded-xl border border-stone-200">
            {[1, 2, 3, 4, 5].map((cls) => (
              <button
                key={cls}
                id={`teacher-class-tab-${cls}`}
                onClick={() => setSelectedClass(cls)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedClass === cls
                    ? 'bg-red-700 text-white shadow-sm'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-white'
                }`}
              >
                कक्षा {cls}
              </button>
            ))}
          </div>
        </div>

        {/* Class Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-stone-100">
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-[11px] font-bold text-stone-500 block">नामांकित विद्यार्थी</span>
            <span className="text-xl font-black text-stone-900">{students.length}</span>
            <span className="text-[10px] text-stone-400 block">Class {selectedClass}</span>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
            <span className="text-[11px] font-bold text-emerald-800 block">औसत स्कोर (Class Avg)</span>
            <span className="text-xl font-black text-emerald-700">{avgClassScore}%</span>
            <span className="text-[10px] text-emerald-600 block">सक्रिय अधिगम दर</span>
          </div>

          <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200">
            <span className="text-[11px] font-bold text-indigo-800 block">प्रकाशित मूल्यांकन</span>
            <span className="text-xl font-black text-indigo-700">{feedItems.length}</span>
            <span className="text-[10px] text-indigo-600 block">क्विज़ व कार्यपत्रक</span>
          </div>

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
            <span className="text-[11px] font-bold text-amber-800 block">मातृभाषा माध्यम</span>
            <span className="text-sm font-bold text-amber-900 font-serif">ᱥᱟᱱᱛᱟᱲᱤ (Santali)</span>
            <span className="text-[10px] text-amber-700 block">Ol Chiki लिपि सक्षम</span>
          </div>
        </div>
      </div>

      {publishSuccessNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-900 text-emerald-100 text-xs font-bold flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
          <span>{publishSuccessNotice}</span>
        </div>
      )}

      {/* Teacher Classroom Voice & Pronunciation Guide in Authentic Hindi Accent */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50/60 rounded-2xl p-5 border border-amber-200/80 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-amber-700 text-white flex items-center justify-center shrink-0">
              <Volume2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-stone-900">
                शिक्षक कक्षा-निर्देश एवं द्विभाषी उच्चारण गाइड (Teacher Classroom Voice Guide)
              </h4>
              <p className="text-xs text-stone-500">
                कक्षा {selectedClass} के शिक्षण निर्देश एवं शब्दावली शुद्ध भारतीय हिन्दी लहजे में सुनें:
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-amber-900 bg-amber-100/80 px-2.5 py-1 rounded-full border border-amber-300 self-start sm:self-auto flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>भारतीय हिन्दी आवाज़ सक्रिय</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
          {[
            {
              id: 'cmd-greet',
              label: 'कक्षा अभिवादन (Greeting)',
              text: 'जोहार बच्चों! सभी अपनी-अपनी जगह पर बैठें और आज का पाठ ध्यान से समझें।',
              sub: 'जोहार (नमस्ते / प्रणाम)',
            },
            {
              id: 'cmd-book',
              label: 'पुस्तक निर्देश (Open Book)',
              text: `कक्षा ${selectedClass} के सभी विद्यार्थी अपनी पाठ्यपुस्तक का अध्याय ${activeLesson.chapterNumber} निकालें।`,
              sub: 'पुथी (किताब) खोलें',
            },
            {
              id: 'cmd-nature',
              label: `पर्यावरण व ${vernacularMeta.hindiName} सीख`,
              text: 'दारे आर दाग दो आबोवाग जीवी काना, यानी पेड़ और पानी ही हमारा सच्चा जीवन है।',
              sub: 'दारे (पेड़) • दाग (पानी)',
            },
            {
              id: 'cmd-worksheet',
              label: 'कार्यपत्रक निर्देश (Worksheet)',
              text: 'सभी बच्चे अपने द्विभाषी कार्यपत्रक में साफ-साफ अक्षरों में उत्तर लिखें।',
              sub: 'कामी साकाम (कार्यपत्रक)',
            },
            {
              id: 'cmd-praise',
              label: 'विद्यार्थी प्रोत्साहन (Praise)',
              text: 'शाबाश! आपने बहुत सुंदर उत्तर दिया। बहुत अच्छा प्रयास!',
              sub: 'आडी नापाय (बहुत अच्छा)',
            },
            {
              id: 'cmd-quiz',
              label: 'क्विज़ निर्देश (Quiz Prompt)',
              text: 'अब हम 5 प्रश्नों का एक छोटा सा टेस्ट करेंगे। सभी प्रश्न ध्यान से पढ़ें।',
              sub: 'कुक्ली रूप (प्रश्नोत्तरी)',
            },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handlePlayVoice(item.id, item.text)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-1.5 ${
                playingAudioId === item.id
                  ? 'bg-amber-700 text-white border-amber-800 shadow-md ring-2 ring-amber-400'
                  : 'bg-white hover:bg-amber-50/80 border-stone-200 hover:border-amber-400 text-stone-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-bold ${playingAudioId === item.id ? 'text-amber-100' : 'text-amber-800'}`}>
                  {item.label}
                </span>
                <Volume2 className={`w-4 h-4 shrink-0 ${playingAudioId === item.id ? 'text-white animate-pulse' : 'text-amber-700'}`} />
              </div>
              <p className={`text-xs font-medium leading-relaxed ${playingAudioId === item.id ? 'text-white' : 'text-stone-700'}`}>
                "{item.text}"
              </p>
              <span className={`text-[10px] font-semibold pt-1 border-t ${playingAudioId === item.id ? 'border-amber-600 text-amber-200' : 'border-stone-100 text-stone-400'}`}>
                {item.sub}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Action Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
          <span>शिक्षण मॉड्यूल (Pedagogical Modules):</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                id={`quick-action-${item.id}`}
                onClick={() => onNavigate(item.id)}
                className="bg-white p-5 rounded-2xl border-2 border-stone-200 hover:border-red-600 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
              >
                <div className="flex items-start justify-between">
                  <div className={`w-11 h-11 rounded-xl ${item.color} flex items-center justify-center shadow-sm`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {item.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-stone-100 text-stone-800 border border-stone-200">
                      {item.badge}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-stone-900 text-base group-hover:text-red-700 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-stone-500 leading-normal">{item.subtitle}</p>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-red-700">
                  <span>प्रारंभ करें</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ======================================================= */}
      {/* CLASSROOM TEACHING VOCABULARY & FLASHCARDS MODULE */}
      {/* ======================================================= */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-red-700 uppercase tracking-wider">
              <Layers className="w-4 h-4 text-red-700" />
              <span>कक्षा शिक्षण शब्दावली व फ़्लैशकार्ड अभ्यास (Classroom Teaching Aids)</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-stone-900 mt-0.5">
              कक्षा {selectedClass} पाठ्यक्रम शब्दावली कार्ड
            </h3>
            <p className="text-xs text-stone-500">
              कक्षा में बच्चों को {vernacularMeta.hindiName} ({vernacularMeta.script}) एवं हिन्दी में शुद्ध उच्चारण का अभ्यास कराएं
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('see-and-learn')}
              id="teacher-open-see-and-learn-btn"
              className="px-3.5 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>देखो और सीखो खोलें</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('flashcards')}
              id="teacher-open-flashcards-btn"
              className="px-3.5 py-1.5 rounded-xl bg-red-100 hover:bg-red-200 text-red-900 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>फ़्लैशकार्ड खोलें</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Vocabulary Cards Grid (Clean & Text-First, No Images) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {(activeLesson.keyVocabulary.length >= 6
            ? activeLesson.keyVocabulary.slice(0, 6)
            : [
                { hindi: 'साल का पेड़ (सखुआ)', santaliOlChiki: 'ᱥᱟᱨᱡᱚᱢ ᱫᱟᱨᱮ', santaliDevanagari: 'सारजोम दारे' },
                { hindi: 'पलाश का फूल', santaliOlChiki: 'ᱯᱚᱞᱟᱥ ᱵᱟᱦᱟ', santaliDevanagari: 'पलाश बाहा' },
                { hindi: 'महुआ का पेड़', santaliOlChiki: 'ᱢᱟᱹᱛᱠᱚᱢ ᱫᱟᱨᱮ', santaliDevanagari: 'मातकोम दारे' },
                { hindi: 'पानी (जल)', santaliOlChiki: 'ᱫᱟᱜ', santaliDevanagari: 'दाग' },
                { hindi: 'मोर', santaliOlChiki: 'ᱢᱟᱨᱟᱜ', santaliDevanagari: 'माराग' },
                { hindi: 'हाथी', santaliOlChiki: 'ᱦᱟᱹᱛᱤ', santaliDevanagari: 'हाती' },
              ]
          ).map((item, idx) => {
            const vTrans = translateVernacularText({
              text: item.hindi,
              sourceLang: 'hin_Deva',
              targetLang: currentLanguage,
            });

            return (
              <div
                key={idx}
                className="bg-stone-50 rounded-2xl p-3 border border-stone-200 hover:border-red-400 hover:shadow-md transition-all flex flex-col justify-between group space-y-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-red-100 text-red-900 font-mono">
                      #{idx + 1}
                    </span>
                    <span className="text-[10px] font-bold text-amber-800">
                      {vernacularMeta.name}
                    </span>
                  </div>
                  <h4 className="text-xs font-black text-stone-900 pt-1 truncate">
                    {item.hindi}
                  </h4>
                  <div className="font-serif font-black text-sm text-stone-900 pt-0.5 truncate">
                    {vTrans.translatedText}
                  </div>
                  <div className="text-[10px] text-stone-500 font-medium truncate">
                    {vTrans.transliteration}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handlePlayVoice(
                      `t-showcase-${idx}`,
                      `${item.hindi}। ${vernacularMeta.hindiName} में: ${vTrans.transliteration || vTrans.translatedText}`
                    )
                  }
                  className={`w-full py-1.5 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1 border transition-colors cursor-pointer ${
                    playingAudioId === `t-showcase-${idx}`
                      ? 'bg-red-700 text-white border-red-800 animate-pulse'
                      : 'bg-white hover:bg-red-50 text-stone-700 border-stone-200 shadow-xs'
                  }`}
                >
                  <Volume2 className="w-3 h-3 text-red-700" />
                  <span>उच्चारण सुनाएं</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Grid: Enrolled Students & Assessment Feed for Class */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrolled Students Card */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-red-700" />
              <h4 className="font-bold text-stone-900 text-base">
                कक्षा {selectedClass} के विद्यार्थी (Students in Class {selectedClass})
              </h4>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 font-bold">
              {students.length} नामांकित
            </span>
          </div>

          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {students.length === 0 ? (
              <p className="text-xs text-stone-400 text-center py-6">कक्षा {selectedClass} में कोई विद्यार्थी नामांकित नहीं है।</p>
            ) : (
              students.map((student) => (
                <div
                  key={student.id}
                  className="p-3 rounded-xl bg-stone-50 border border-stone-200 hover:border-amber-400 transition-colors flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-stone-900 flex items-center space-x-2">
                      <span className="w-5 h-5 rounded-full bg-stone-200 text-stone-700 font-mono text-[10px] flex items-center justify-center font-bold">
                        {student.rollNo}
                      </span>
                      <span>{student.name}</span>
                    </div>
                    <div className="text-[11px] text-stone-500">{student.email}</div>
                  </div>

                  <div className="text-right space-y-0.5">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        student.overallPerformance.grade === 'A+' || student.overallPerformance.grade === 'A'
                          ? 'bg-emerald-100 text-emerald-800'
                          : student.overallPerformance.grade === 'B+' || student.overallPerformance.grade === 'B'
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      ग्रेड {student.overallPerformance.grade} ({student.overallPerformance.averageScore}%)
                    </span>
                    <div className="text-[10px] text-stone-400">
                      {student.assignedQuizzes.filter((q) => q.isCompleted).length} क्विज़ • {student.completedWorksheets.length} कार्यपत्रक
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Assessment Feed & Submitted Worksheets for Class */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-emerald-700" />
              <div className="flex space-x-2 text-xs">
                <button
                  onClick={() => setAssessmentViewTab('feed')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    assessmentViewTab === 'feed'
                      ? 'bg-emerald-700 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  प्रकाशित फ़ीड ({feedItems.length})
                </button>
                <button
                  onClick={() => setAssessmentViewTab('submissions')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    assessmentViewTab === 'submissions'
                      ? 'bg-emerald-700 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  जमा कार्यपत्रक ({submittedWorksheets.length})
                </button>
              </div>
            </div>

            {/* Quick Publish Buttons */}
            {assessmentViewTab === 'feed' && (
              <div className="flex items-center space-x-1.5">
                <button
                  type="button"
                  id="quick-publish-quiz-btn"
                  onClick={() => handleQuickPublish('quiz')}
                  className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-bold border border-indigo-200 cursor-pointer flex items-center gap-1"
                  title="कक्षा के लिए त्वरित क्विज़ प्रकाशित करें"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>+क्विज़</span>
                </button>
                <button
                  type="button"
                  id="quick-publish-worksheet-btn"
                  onClick={() => handleQuickPublish('worksheet')}
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold border border-emerald-200 cursor-pointer flex items-center gap-1"
                  title="कक्षा के लिए त्वरित कार्यपत्रक प्रकाशित करें"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>+कार्यपत्रक</span>
                </button>
              </div>
            )}
          </div>

          {/* Tab 1: Published Feed */}
          {assessmentViewTab === 'feed' && (
            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {feedItems.length === 0 ? (
                <p className="text-xs text-stone-400 text-center py-6">
                  कक्षा {selectedClass} के लिए अभी कोई मूल्यांकन प्रकाशित नहीं है। ऊपर दिए गए बटन से प्रकाशित करें।
                </p>
              ) : (
                feedItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 hover:border-emerald-300 transition-colors space-y-1.5 text-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase mb-1 ${
                            item.type === 'quiz' ? 'bg-indigo-100 text-indigo-800' : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {item.type === 'quiz' ? 'प्रश्नोत्तरी (Quiz)' : 'कार्यपत्रक (Worksheet)'}
                        </span>
                        <h5 className="font-bold text-stone-900">{item.title}</h5>
                        {item.titleSantali && (
                          <p className="text-[11px] font-serif text-amber-900">{item.titleSantali}</p>
                        )}
                      </div>
                      <span className="text-[10px] text-stone-400 shrink-0">{item.publishedAt}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-stone-100">
                      <span>विषय: {item.subject}</span>
                      <span className="font-semibold text-stone-700">{item.questionsCount} प्रश्न</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Tab 2: Submitted Worksheets for Class */}
          {assessmentViewTab === 'submissions' && (
            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {submittedWorksheets.length === 0 ? (
                <p className="text-xs text-stone-400 text-center py-6">
                  कक्षा {selectedClass} के विद्यार्थियों से अभी कोई कार्यपत्रक जमा नहीं हुआ है।
                </p>
              ) : (
                submittedWorksheets.map((sub, idx) => (
                  <div
                    key={sub.submission.id || idx}
                    className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 hover:border-indigo-300 transition-colors space-y-2 text-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="w-5 h-5 rounded-full bg-stone-200 text-stone-700 font-mono text-[10px] flex items-center justify-center font-bold">
                            {sub.rollNo}
                          </span>
                          <span className="font-bold text-stone-900">{sub.studentName}</span>
                          <span className="text-[10px] text-stone-400">({sub.submission.submissionDate})</span>
                        </div>
                        <h5 className="font-bold text-stone-800 mt-1">{sub.submission.title}</h5>
                        {sub.submission.titleSantali && (
                          <p className="text-[11px] font-serif text-amber-900">{sub.submission.titleSantali}</p>
                        )}
                      </div>

                      <div className="text-right shrink-0">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {sub.submission.score || 88}/100 (ग्रेड {sub.submission.grade || 'A'})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-stone-600 pt-1.5 border-t border-stone-200">
                      <span className="truncate max-w-[200px]">
                        <strong>टिप्पणी:</strong> {sub.submission.feedbackHindi || 'जाँचा गया'}
                      </span>
                      <button
                        onClick={() => handleOpenGrading(sub)}
                        className="px-2.5 py-1 rounded bg-stone-900 hover:bg-stone-800 text-white font-bold text-[10px] cursor-pointer"
                      >
                        समीक्षा / ग्रेड बदलें ➔
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Teacher Grading Review Modal */}
      {gradingItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto border border-stone-200">
            <div className="flex items-start justify-between border-b border-stone-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded">
                  शिक्षक मूल्यांकन एवं ग्रेडिंग
                </span>
                <h3 className="text-base font-bold text-stone-900 mt-1">
                  {gradingItem.studentName} (रोल नं. {gradingItem.rollNo} • कक्षा {selectedClass})
                </h3>
                <p className="text-xs text-stone-500">{gradingItem.submission.title}</p>
              </div>
              <button
                onClick={() => setGradingItem(null)}
                className="text-stone-400 hover:text-stone-600 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Submitted Answers */}
            <div className="space-y-2 bg-stone-50 p-3.5 rounded-xl border border-stone-200 text-xs">
              <span className="font-bold text-stone-700 block">विद्यार्थी द्वारा दिए गए उत्तर:</span>
              {Object.entries(gradingItem.submission.answers || {}).map(([key, val]: any, idx) => (
                <div key={key} className="bg-white p-2.5 rounded border border-stone-200">
                  <span className="font-bold text-stone-500 text-[10px] block">प्रश्न {idx + 1}:</span>
                  <p className="text-stone-900">{val || '(खाली उत्तर)'}</p>
                </div>
              ))}
              {gradingItem.submission.attachmentName && (
                <div className="text-[11px] text-stone-600 pt-1">
                  <strong>संलग्न फाइल:</strong> {gradingItem.submission.attachmentName}
                </div>
              )}
            </div>

            {/* Score & Feedback Inputs */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  प्राप्तांक (Marks out of 100):
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={gradeScore}
                  onChange={(e) => setGradeScore(Number(e.target.value))}
                  className="w-full p-2.5 border border-stone-300 rounded-xl font-mono text-sm focus:border-emerald-600 bg-white"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  शिक्षक टिप्पणी (हिन्दी में):
                </label>
                <input
                  type="text"
                  value={gradeFeedback}
                  onChange={(e) => setGradeFeedback(e.target.value)}
                  className="w-full p-2.5 border border-stone-300 rounded-xl text-xs focus:border-emerald-600 bg-white"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  शिक्षक टिप्पणी ({vernacularMeta.hindiName} - {vernacularMeta.script} में):
                </label>
                <input
                  type="text"
                  value={gradeFeedbackSantali}
                  onChange={(e) => setGradeFeedbackSantali(e.target.value)}
                  className="w-full p-2.5 border border-stone-300 rounded-xl text-xs font-serif focus:border-emerald-600 bg-white"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setGradingItem(null)}
                className="px-4 py-2 rounded-xl text-stone-600 hover:text-stone-900 text-xs font-bold cursor-pointer"
              >
                रद्द करें
              </button>
              <button
                type="button"
                onClick={handleSaveGrading}
                className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow cursor-pointer"
              >
                मूल्यांकन सुरक्षित करें (Save Grade)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Curriculum Outcome Preview */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
          <div>
            <span className="text-xs font-bold uppercase text-red-700">
              कक्षा {selectedClass} • पाठ्यक्रम संदर्भ
            </span>
            <h4 className="text-lg font-black text-stone-900">
              {activeLesson.chapterNameHindi}: {activeLesson.topicHindi}
            </h4>
          </div>
          <button
            onClick={() => onNavigate('worksheet')}
            className="text-xs px-3.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-bold self-start sm:self-auto cursor-pointer"
          >
            इस पाठ का कार्यपत्रक जनरेट करें ➔
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-900 block">NIPUN Bharat अधिगम प्रतिफल:</span>
              <button
                type="button"
                onClick={() =>
                  handlePlayVoice(
                    'nipun-outcome',
                    `कक्षा ${selectedClass} अधिगम प्रतिफल: ${activeLesson.learningOutcomes[0]?.descriptionHindi || ''}`
                  )
                }
                className="px-2 py-1 rounded-lg bg-amber-200/80 hover:bg-amber-300 text-amber-950 font-bold text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                title="प्रतिफल हिन्दी में सुनें"
              >
                <Volume2 className="w-3 h-3 text-amber-900" />
                <span>सुनें</span>
              </button>
            </div>
            <p className="text-stone-700 leading-relaxed">
              <strong>[{activeLesson.learningOutcomes[0]?.nipunCode}]</strong>{' '}
              {activeLesson.learningOutcomes[0]?.descriptionHindi}
            </p>
          </div>

          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-800 block">मातृभाषा शब्दावली (Vocabulary):</span>
              <span className="text-[10px] text-emerald-700 font-bold">🔊 क्लिक करके उच्चारण सुनें</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {activeLesson.keyVocabulary.slice(0, 6).map((v, i) => {
                const vTrans = translateVernacularText({
                  text: v.hindi,
                  sourceLang: 'hin_Deva',
                  targetLang: currentLanguage,
                });
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() =>
                      handlePlayVoice(
                        `vocab-${i}`,
                        `${v.hindi}। ${vernacularMeta.hindiName} में: ${vTrans.transliteration || vTrans.translatedText}`
                      )
                    }
                    className={`px-2.5 py-1 rounded-lg border font-medium text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                      playingAudioId === `vocab-${i}`
                        ? 'bg-red-700 text-white border-red-800 shadow-sm animate-pulse'
                        : 'bg-white hover:bg-amber-50 border-stone-300 text-stone-800 hover:border-amber-400'
                    }`}
                    title={`${v.hindi} का उच्चारण सुनें`}
                  >
                    <Volume2 className={`w-3 h-3 ${playingAudioId === `vocab-${i}` ? 'text-white' : 'text-red-700'}`} />
                    <span>{v.hindi} : <strong className="font-serif">{vTrans.translatedText}</strong></span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
