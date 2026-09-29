import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  AlertTriangle,
  Award,
  CheckCircle2,
  XCircle,
  TrendingUp,
  User,
  BookOpen,
  Calendar,
  Layers,
  Lightbulb,
} from 'lucide-react';
import { ConceptGapAnalysis, QuizAttempt, StudentProgress } from '../types';
import { offlineStorage } from '../services/offlineStorage';
import { MOCK_STUDENT } from '../data/curriculum';

export const ProgressAnalytics: React.FC = () => {
  const [progress, setProgress] = useState<StudentProgress>(offlineStorage.getStudentProgress());
  const [conceptGaps, setConceptGaps] = useState<ConceptGapAnalysis[]>(offlineStorage.getConceptGaps());
  const [attempts, setAttempts] = useState<QuizAttempt[]>(offlineStorage.getQuizAttempts());

  useEffect(() => {
    // Refresh live analytics from local store
    const update = () => {
      setProgress(offlineStorage.getStudentProgress());
      setConceptGaps(offlineStorage.getConceptGaps());
      setAttempts(offlineStorage.getQuizAttempts());
    };

    update();
    const interval = setInterval(update, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-stone-900 to-red-950 text-white rounded-2xl p-6 shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 bg-red-900/60 px-3 py-1 rounded-full text-xs font-semibold text-amber-300 mb-2 border border-amber-400/20">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>NIPUN Bharat Continuous Comprehensive Evaluation (CCE)</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            विद्यार्थी प्रगति एवं अधिगम अंतराल (Student Progress & Gap Analytics)
          </h2>
          <p className="text-xs text-stone-300 mt-1 max-w-2xl">
            विद्यार्थी द्वारा दिए गए वास्तविक टेस्ट के आधार पर गतिशील रूप से गणना किया गया प्रगति चार्ट एवं संथाली शिक्षण सुधार सुझाव।
          </p>
        </div>

        {/* Student Mini ID */}
        <div className="bg-stone-800/90 px-4 py-2.5 rounded-xl border border-stone-700 flex items-center space-x-3 text-xs">
          <div className="w-8 h-8 rounded-full bg-red-700 text-white font-bold flex items-center justify-center">
            {MOCK_STUDENT.name[0]}
          </div>
          <div>
            <div className="font-bold text-stone-100">{MOCK_STUDENT.name}</div>
            <div className="text-stone-400">
              कक्षा {MOCK_STUDENT.classNumber} • रोल: {MOCK_STUDENT.rollNo}
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Key Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
          <span className="text-xs font-semibold text-stone-500 block">कुल प्रश्न हल किए:</span>
          <div className="text-3xl font-black text-stone-900">{progress.totalQuestionsAttempted}</div>
          <span className="text-[11px] text-stone-400">वास्तविक टेस्ट सबमिशन</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
          <span className="text-xs font-semibold text-stone-500 block">सटीकता दर (Accuracy):</span>
          <div className="text-3xl font-black text-red-700">{progress.overallAccuracy}%</div>
          <span className="text-[11px] text-emerald-600 font-semibold">
            {progress.overallAccuracy >= 75 ? 'लक्ष्य प्राप्त' : 'सुधार अपेक्षित'}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
          <span className="text-xs font-semibold text-stone-500 block">सही उत्तर (Correct):</span>
          <div className="text-3xl font-black text-emerald-600">{progress.totalCorrect}</div>
          <span className="text-[11px] text-stone-400">सफलतापूर्वक हल</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
          <span className="text-xs font-semibold text-stone-500 block">पहचाने गए गैप (Concept Gaps):</span>
          <div className="text-3xl font-black text-amber-600">{conceptGaps.length}</div>
          <span className="text-[11px] text-amber-700 font-semibold">अधिगम अंतराल चिन्हित</span>
        </div>
      </div>

      {/* Dynamic Concept Gap Analysis (Mandated Feature) */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-stone-900 text-base">
              स्वचालित अधिगम अंतराल विश्लेषण (Dynamic Concept Gap Analysis):
            </h3>
          </div>
          <span className="text-xs text-stone-500">
            छात्र उत्तरों से रीयल-टाइम में जनरेट
          </span>
        </div>

        {conceptGaps.length === 0 ? (
          <div className="p-8 text-center text-stone-500 text-sm">
            कोई गंभीर अधिगम अंतराल नहीं पाया गया। छात्र का प्रदर्शन उत्कृष्ट है!
          </div>
        ) : (
          <div className="space-y-4">
            {conceptGaps.map((gap, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl border border-amber-200 bg-amber-50/40 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full ${
                        gap.severity === 'high'
                          ? 'bg-red-100 text-red-800 border border-red-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}
                    >
                      {gap.severity === 'high' ? 'गंभीर अंतराल (High Severity)' : 'मध्यम अंतराल'}
                    </span>
                    <h4 className="font-bold text-stone-900 text-sm">
                      {gap.topicName} ({gap.learningOutcomeCode})
                    </h4>
                  </div>
                  <div className="text-xs font-bold text-stone-700">
                    सटीकता दर: <span className="text-red-700">{gap.accuracyRate}%</span>
                  </div>
                </div>

                {/* Identified Misconception */}
                <div className="bg-white p-3 rounded-lg border border-stone-200 text-xs space-y-1">
                  <span className="font-bold text-stone-600 block">पहचाना गया भाषाई/अवधारणात्मक अंतराल:</span>
                  <p className="text-stone-800">{gap.identifiedGapsHindi}</p>
                  <p className="text-red-900 font-serif font-semibold">{gap.identifiedGapsSantali}</p>
                </div>

                {/* Vernacular Pedagogy Recommendation */}
                <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200 text-xs space-y-1 text-emerald-950">
                  <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>शिक्षक हेतु अनुशंसित उपचारात्मक शिक्षण (Vernacular Remedial Pedagogy):</span>
                  </div>
                  <p>{gap.recommendedPedagogyHindi}</p>
                  <p className="font-serif font-semibold">{gap.recommendedPedagogySantali}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Quiz Attempt History */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 border-b border-stone-100 pb-3">
          <BookOpen className="w-5 h-5 text-red-700" />
          <h3 className="font-bold text-stone-900 text-base">
            हाल के टेस्ट परिणाम (Recent Assessment Attempts):
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-stone-50 text-stone-600 font-bold border-b border-stone-200 uppercase">
              <tr>
                <th className="p-3">विषय / पाठ</th>
                <th className="p-3">NIPUN कोड</th>
                <th className="p-3">प्राप्तांक</th>
                <th className="p-3">प्रतिशत</th>
                <th className="p-3">मोड</th>
                <th className="p-3">समय</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {attempts.map((att) => (
                <tr key={att.id} className="hover:bg-stone-50/80">
                  <td className="p-3 font-semibold text-stone-900">{att.topic}</td>
                  <td className="p-3 font-mono text-stone-500">{att.learningOutcomeCode}</td>
                  <td className="p-3 font-bold text-stone-900">
                    {att.score} / {att.totalQuestions}
                  </td>
                  <td className="p-3">
                    <span
                      className={`font-bold px-2 py-0.5 rounded ${
                        att.percentage >= 70
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {att.percentage}%
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        att.isOffline
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {att.isOffline ? '📡 ऑफ़लाइन' : '🌐 ऑनलाइन'}
                    </span>
                  </td>
                  <td className="p-3 text-stone-400">
                    {new Date(att.completedAt).toLocaleTimeString('hi-IN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
