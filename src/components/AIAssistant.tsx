import React, { useState } from 'react';
import { Sparkles, Send, Volume2, BookOpen, Lightbulb, User, Bot, HelpCircle } from 'lucide-react';
import { CURRICULUM_LESSONS } from '../data/curriculum';
import { speakText } from '../utils/audioSynth';
import { translateVernacularText } from '../utils/vernacularEngine';
import { useLanguage } from '../context/LanguageContext';

export const AIAssistant: React.FC = () => {
  const { currentLanguage, vernacularMeta } = useLanguage();
  const [selectedLessonId, setSelectedLessonId] = useState(CURRICULUM_LESSONS[0].id);
  const [inputQuery, setInputQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [chatLog, setChatLog] = useState<Array<{
    sender: 'teacher' | 'ai';
    textHindi: string;
    textSantali?: string;
    transliteration?: string;
    pedagogicalTip?: string;
    nipunAlignment?: string;
  }>>([
    {
      sender: 'ai',
      textHindi: `नमस्ते शिक्षक सुमन मुर्मू जी! मैं आपका पलाश एआई शिक्षण सहायक हूँ। आप अपनी कक्षा के किसी भी विषय पर मातृभाषा ${vernacularMeta.hindiName} में अनुवाद, उदाहरण अथवा स्थानीय गतिविधि पूछ सकते हैं।`,
      textSantali: vernacularMeta.greeting === 'ᱡᱚᱦᱟᱨ' ? 'ᱡᱚᱦᱟᱨ ᱢᱟᱪᱮᱛ ᱜᱚᱢᱠᱮ! ᱤᱧ ᱯᱚᱞᱟᱥ ᱮ.ᱟᱭᱤ. ᱜᱚᱲᱚᱭᱤᱡ ᱠᱟᱹᱱᱟᱹᱧ᱾' : `${vernacularMeta.greeting} माचेत गोमके! मैं पलाश एआई सहायक हूँ।`,
      pedagogicalTip: 'प्राथमिक कक्षा में स्थानीय परिवेश (जैसे साल, महुआ, और हाट) के उदाहरणों से बच्चों की रुचि बढ़ती है।',
      nipunAlignment: 'NIPUN Bharat FLN & Environmental Awareness',
    },
  ]);

  const activeLesson = CURRICULUM_LESSONS.find((l) => l.id === selectedLessonId) || CURRICULUM_LESSONS[0];

  const handleSend = async (queryText?: string) => {
    const q = queryText || inputQuery;
    if (!q.trim() || isGenerating) return;

    const teacherMsg = { sender: 'teacher' as const, textHindi: q };
    setChatLog((prev) => [...prev, teacherMsg]);
    setInputQuery('');
    setIsGenerating(true);

    try {
      // Call translate/assistant API
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: q,
          sourceLang: 'hin_Deva',
          targetLang: currentLanguage,
        }),
      });

      const data = await res.json();

      const aiMsg = {
        sender: 'ai' as const,
        textHindi: `कक्षा ${activeLesson.classNumber} के विषय '${activeLesson.topicHindi}' के संदर्भ में: बच्चों को मातृभाषा में समझाते हुए व्यावहारिक गतिविधि कराएं।`,
        textSantali: data.translatedText || 'ᱫᱟᱨᱮ ᱞᱟᱹᱜᱤᱫ ᱫᱟᱜ ᱟᱹᱰᱤ ᱞᱟᱹᱠᱛᱤᱜ-ᱟ᱾',
        transliteration: data.transliteration || 'दारे लागिद दाग आडी लाकतिग-आ',
        pedagogicalTip: `सुझाव: बच्चों को विद्यालय के बगीचे में ले जाकर एक पौधे के पत्ते और मिट्टी को छूने दें। ${vernacularMeta.hindiName} में सामूहिक उच्चारण कराएं।`,
        nipunAlignment: activeLesson.learningOutcomes[0]?.nipunCode || 'NIPUN-JH-C3-EVS-02',
      };

      setChatLog((prev) => [...prev, aiMsg]);

      // Real-time text-to-speech audio synthesis for all AI Copilot answers
      const speechToPlay = data.transliteration || aiMsg.textHindi;
      speakText(speechToPlay, 'hi-IN');
    } catch (e: any) {
      console.warn('AIAssistant translation error, using vernacular engine:', e);
      const vResult = translateVernacularText({
        text: q,
        sourceLang: 'hin_Deva',
        targetLang: currentLanguage,
      });
      const fallbackAiMsg = {
        sender: 'ai' as const,
        textHindi: `कक्षा ${activeLesson.classNumber} के विषय '${activeLesson.topicHindi}' के लिए शिक्षण मार्गदर्शन: बच्चों को व्यावहारिक गतिविधि कराएं।`,
        textSantali: vResult.translatedText,
        transliteration: vResult.transliteration,
        pedagogicalTip: vResult.pedagogicalContext || `सुझाव: ${vernacularMeta.hindiName} में मुख्य शब्दों का बच्चों से सामूहिक उच्चारण कराएं।`,
        nipunAlignment: activeLesson.learningOutcomes[0]?.nipunCode || 'NIPUN-JH-C3-EVS-02',
      };
      setChatLog((prev) => [...prev, fallbackAiMsg]);
      speakText(fallbackAiMsg.transliteration || fallbackAiMsg.textHindi, 'hi-IN');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header card with Curriculum Context */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 text-red-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>NIPUN Bharat Vernacular Pedagogy Assistant</span>
          </div>
          <h2 className="text-xl font-bold text-stone-900">
            एआई शिक्षण सहायक (AI Teaching Assistant)
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            कक्षा के दौरान मातृभाषा में प्रश्न पूछने, समझाने और स्थानीय गतिविधियों की योजना बनाने के लिए।
          </p>
        </div>

        {/* Lesson Context Selector */}
        <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 flex items-center space-x-2 w-full md:w-auto">
          <BookOpen className="w-4 h-4 text-stone-600 shrink-0" />
          <div className="text-xs">
            <span className="text-stone-400 block text-[10px] font-semibold">सक्रिय पाठ संदर्भ (Active Context):</span>
            <select
              value={selectedLessonId}
              onChange={(e) => setSelectedLessonId(e.target.value)}
              className="bg-transparent font-bold text-stone-800 focus:outline-none cursor-pointer"
            >
              {CURRICULUM_LESSONS.map((les) => (
                <option key={les.id} value={les.id}>
                  Class {les.classNumber}: {les.subjectHindi} - {les.chapterNameHindi}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Chat window */}
      <div className="bg-stone-50 rounded-2xl border border-stone-200 p-4 sm:p-6 min-h-[420px] max-h-[550px] overflow-y-auto space-y-4">
        {chatLog.map((msg, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 ${msg.sender === 'teacher' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'ai' && (
              <div className="w-8 h-8 rounded-full bg-red-700 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-2xl rounded-2xl p-4 space-y-2.5 shadow-sm text-sm ${
                msg.sender === 'teacher'
                  ? 'bg-red-700 text-white rounded-tr-none'
                  : 'bg-white text-stone-900 border border-stone-200 rounded-tl-none'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="font-medium leading-relaxed flex-1">{msg.textHindi}</div>
                {msg.sender === 'ai' && (
                  <button
                    onClick={() => speakText(msg.textHindi, 'hi-IN')}
                    className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold shrink-0 transition-colors cursor-pointer"
                    title="उत्तर की आवाज़ सुनें"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-stone-800" />
                  </button>
                )}
              </div>

              {msg.textSantali && (
                <div className="bg-red-50 p-3 rounded-xl border border-red-200 text-red-950 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-red-800 uppercase">
                      {vernacularMeta.name} ({vernacularMeta.hindiName} अनुवाद):
                    </span>
                    <button
                      onClick={() => speakText(msg.transliteration || msg.textSantali!, 'hi-IN')}
                      className="text-xs text-red-700 hover:text-red-900 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" /> उच्चारण
                    </button>
                  </div>
                  <div className="text-xl font-bold font-serif">{msg.textSantali}</div>
                  {msg.transliteration && (
                    <div className="text-xs text-stone-600 font-sans italic">
                      उच्चारण: {msg.transliteration}
                    </div>
                  )}
                </div>
              )}

              {msg.pedagogicalTip && (
                <div className="bg-amber-50/80 p-2.5 rounded-lg border border-amber-200/70 text-xs text-amber-950 flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">कक्षा शिक्षण युक्ति:</span>
                    <span>{msg.pedagogicalTip}</span>
                  </div>
                </div>
              )}

              {msg.nipunAlignment && (
                <div className="text-[10px] text-stone-400 font-semibold text-right">
                  संरेखित: {msg.nipunAlignment}
                </div>
              )}
            </div>

            {msg.sender === 'teacher' && (
              <div className="w-8 h-8 rounded-full bg-stone-800 text-white flex items-center justify-center shrink-0 shadow-sm">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isGenerating && (
          <div className="flex items-center space-x-2 text-xs text-stone-500 italic p-2">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
            <span>पलाश एआई उत्तर एवं {vernacularMeta.hindiName} अनुवाद तैयार कर रहा है...</span>
          </div>
        )}
      </div>

      {/* Suggestion Chips */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs font-semibold text-stone-500 flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5" /> सुझाव प्रश्न:
        </span>
        {[
          'बच्चों, पौधों को पानी क्यों चाहिए?',
          'साप्ताहिक हाट में सब्जियों की गिनती कैसे कराएं?',
          `${vernacularMeta.hindiName} में परिवार के रिश्तों का परिचय कैसे दें?`,
          `झारखण्ड के स्थानीय पेड़ों के ${vernacularMeta.hindiName} नाम क्या हैं?`,
        ].map((s, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(s)}
            className="text-xs bg-white hover:bg-stone-100 text-stone-800 px-3 py-1.5 rounded-lg border border-stone-200 transition-colors shadow-2xs"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input box */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="हिन्दी में प्रश्न लिखें (जैसे: 'बच्चों, पौधों को पानी क्यों चाहिए?')..."
          className="flex-1 p-3.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-red-600 focus:border-red-600 text-sm"
        />
        <button
          onClick={() => handleSend()}
          disabled={!inputQuery.trim() || isGenerating}
          className="px-5 py-3.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-sm flex items-center gap-1.5 shadow-sm disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          <span>भेजें</span>
        </button>
      </div>
    </div>
  );
};
