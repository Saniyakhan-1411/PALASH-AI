import React, { useState } from 'react';
import { BookOpen, CheckCircle, Volume2, Sparkles, Award } from 'lucide-react';
import { CURRICULUM_LESSONS } from '../data/curriculum';
import { speakText, playAudioChime } from '../utils/audioSynth';
import { useLanguage } from '../context/LanguageContext';
import { translateVernacularText } from '../utils/vernacularEngine';

export const CurriculumBrowser: React.FC = () => {
  const { currentLanguage, vernacularMeta } = useLanguage();
  const [selectedClass, setSelectedClass] = useState<number>(3);
  const [selectedLessonId, setSelectedLessonId] = useState<string>(CURRICULUM_LESSONS[0].id);

  const filteredLessons = CURRICULUM_LESSONS.filter((l) => l.classNumber === selectedClass);
  const activeLesson =
    filteredLessons.find((l) => l.id === selectedLessonId) || filteredLessons[0] || CURRICULUM_LESSONS[0];

  const handlePlayWord = (word: string) => {
    playAudioChime(520);
    speakText(word, 'hi-IN');
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Title */}
      <div className="bg-gradient-to-r from-stone-900 to-red-950 text-white rounded-2xl p-6 shadow-md">
        <div className="inline-flex items-center space-x-1.5 bg-red-900/60 px-3 py-1 rounded-full text-xs font-semibold text-amber-300 mb-2 border border-amber-400/20">
          <BookOpen className="w-3.5 h-3.5" />
          <span>JCERT Jharkhand & NIPUN Bharat Aligned Syllabus</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight">
          राज्य प्राथमिक पाठ्यक्रम (State Primary Curriculum & Vocabulary)
        </h2>
        <p className="text-xs text-stone-300 mt-1 max-w-2xl">
          कक्षा 1 से 5 हेतु झारखण्ड शैक्षिक अनुसंधान एवं प्रशिक्षण परिषद (JCERT) द्वारा निर्धारित पाठ्यपुस्तकें और मातृभाषा शब्दावली।
        </p>
      </div>

      {/* Class Selector Tabs */}
      <div className="flex space-x-2 border-b border-stone-200 pb-2 overflow-x-auto">
        {[1, 2, 3, 4, 5].map((cls) => (
          <button
            key={cls}
            onClick={() => {
              setSelectedClass(cls);
              const firstInClass = CURRICULUM_LESSONS.find((l) => l.classNumber === cls);
              if (firstInClass) setSelectedLessonId(firstInClass.id);
            }}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap ${
              selectedClass === cls
                ? 'bg-red-700 text-white shadow-sm'
                : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
            }`}
          >
            कक्षा {cls} (Class {cls})
          </button>
        ))}
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Lessons List in selected class */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
            कक्षा {selectedClass} के पाठ (Lessons):
          </span>
          {filteredLessons.map((les) => (
            <div
              key={les.id}
              onClick={() => setSelectedLessonId(les.id)}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer space-y-1.5 ${
                activeLesson.id === les.id
                  ? 'border-red-600 bg-red-50/50 shadow-sm'
                  : 'border-stone-200 bg-white hover:border-stone-300'
              }`}
            >
              <div className="text-[11px] font-bold text-red-700">{les.subjectHindi}</div>
              <h4 className="font-bold text-stone-900 text-sm">{les.chapterNameHindi}</h4>
              <p className="text-xs text-stone-500 line-clamp-1">{les.topicHindi}</p>
            </div>
          ))}
        </div>

        {/* Selected Lesson Details & NIPUN Outcomes */}
        <div className="md:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
            <div className="border-b border-stone-100 pb-3">
              <span className="text-xs font-bold text-red-700 uppercase">
                {activeLesson.subjectHindi} • अध्याय {activeLesson.chapterNumber}
              </span>
              <h3 className="text-xl font-black text-stone-900 mt-1">
                {activeLesson.chapterNameHindi} ({activeLesson.topicHindi})
              </h3>
              <p className="text-xs text-stone-600 mt-1">{activeLesson.context}</p>
            </div>

            {/* NIPUN Outcomes */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-600" />
                NIPUN Bharat अधिगम प्रतिफल (Learning Outcomes):
              </span>
              <div className="space-y-2">
                {activeLesson.learningOutcomes.map((out) => (
                  <div
                    key={out.code}
                    className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold font-mono text-[11px] text-amber-900 mr-2">
                        [{out.nipunCode}]
                      </span>
                      <span>{out.descriptionHindi}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Vocabulary Table */}
            <div className="pt-2 space-y-3">
              <span className="text-xs font-bold text-stone-700 block">
                मूल द्विभाषी शब्दावली (Key Vocabulary • हिन्दी ➔ {vernacularMeta.hindiName}):
              </span>
              <div className="overflow-x-auto rounded-xl border border-stone-200">
                <table className="w-full text-xs text-left">
                  <thead className="bg-stone-50 text-stone-600 font-bold border-b border-stone-200">
                    <tr>
                      <th className="p-2.5">हिन्दी</th>
                      <th className="p-2.5">{vernacularMeta.name} ({vernacularMeta.script})</th>
                      <th className="p-2.5">उच्चारण (Phonetic)</th>
                      <th className="p-2.5">अर्थ</th>
                      <th className="p-2.5 text-center">ध्वनि</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {activeLesson.keyVocabulary.map((v, idx) => {
                      const vTrans = translateVernacularText({
                        text: v.hindi,
                        sourceLang: 'hin_Deva',
                        targetLang: currentLanguage,
                      });
                      const isOlChiki = currentLanguage === 'sat_Olck';
                      const wordPrimary = isOlChiki ? v.santaliOlChiki : (vTrans.translatedText || v.santaliDevanagari || v.hindi);
                      const wordPhonetic = isOlChiki ? v.santaliDevanagari : (vTrans.transliteration || vTrans.translatedText);

                      return (
                        <tr key={idx} className="hover:bg-stone-50">
                          <td className="p-2.5 font-bold text-stone-900">{v.hindi}</td>
                          <td className="p-2.5 font-bold text-red-950 font-serif text-base">
                            {wordPrimary}
                          </td>
                          <td className="p-2.5 text-stone-600 italic">{wordPhonetic}</td>
                          <td className="p-2.5 text-stone-500">{v.meaning}</td>
                          <td className="p-2.5 text-center">
                            <button
                              onClick={() => handlePlayWord(wordPhonetic || wordPrimary)}
                              className="p-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 cursor-pointer"
                              title="उच्चारण सुनें"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
