import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Sparkles,
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Volume2,
  BookOpen,
} from 'lucide-react';
import { Quiz, QuizAttempt } from '../types';
import { CURRICULUM_LESSONS, MOCK_STUDENT } from '../data/curriculum';
import { speakText, playAudioChime } from '../utils/audioSynth';
import { offlineStorage } from '../services/offlineStorage';
import { classStore } from '../data/classStore';

interface QuizRunnerProps {
  currentUser?: any;
}

export const QuizRunner: React.FC<QuizRunnerProps> = ({ currentUser }) => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [attemptResult, setAttemptResult] = useState<QuizAttempt | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeLessonId, setActiveLessonId] = useState<string>(CURRICULUM_LESSONS[0].id);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const studentName = currentUser?.name || 'बासंती हेम्ब्रम (Basanti Hembram)';
  const studentId = currentUser?.id || 'STU-JH-2024-001';
  const classNumber = currentUser?.classNumber || 3;
  const rollNo = currentUser?.rollNo || 7;

  const activeLesson = CURRICULUM_LESSONS.find((l) => l.id === activeLessonId) || CURRICULUM_LESSONS[0];

  useEffect(() => {
    loadOrGenerateQuiz();
  }, [activeLessonId]);

  const loadOrGenerateQuiz = async () => {
    setIsLoading(true);
    setIsSubmitted(false);
    setSelectedAnswers({});
    setAttemptResult(null);

    try {
      const response = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classNumber: activeLesson.classNumber,
          topic: activeLesson.topicHindi,
          learningOutcomeCode: activeLesson.learningOutcomes[0]?.code || 'EVS-3.2',
          count: 4,
        }),
      });

      if (!response.ok) throw new Error('Failed to generate quiz');

      const data = await response.json();
      setQuiz(data.quiz);
    } catch (e: any) {
      console.warn('Network issue, generating local quiz fallback:', e);
      // Construct fallback from lesson
      const localQuiz: Quiz = {
        id: `qz-off-${Date.now()}`,
        titleHindi: 'पौधों को पानी और धूप की आवश्यकता',
        titleSantali: 'ᱫᱟᱨᱮ ᱞᱟᱹᱜᱤᱫ ᱫᱟᱜ ᱟᱨ ᱥᱤᱛᱩᱝ ᱨᱮᱱᱟᱜ ᱞᱟᱹᱠᱛᱤ',
        classNumber: activeLesson.classNumber,
        subject: activeLesson.subjectHindi,
        topic: activeLesson.topicHindi,
        difficulty: 'basic',
        learningOutcomeCode: activeLesson.learningOutcomes[0]?.code || 'EVS-3.2',
        synced: false,
        questions: [
          {
            id: 'q1',
            type: 'mcq',
            learningOutcomeCode: 'EVS-3.2',
            questionHindi: 'पौधों को जीवित रहने के लिए मुख्य रूप से क्या चाहिए?',
            questionSantali: 'ᱫᱟᱨᱮ ᱡᱤᱣᱤᱫ ᱛᱟᱦᱮᱸᱱ ᱞᱟᱹᱜᱤᱫ ᱪᱮᱫ ᱞᱟᱹᱠᱛᱤᱜ-ᱟ?',
            optionsHindi: ['पानी और धूप (Water & Sunlight)', 'प्लास्टिक', 'सिर्फ अंधेरा', 'पत्थर'],
            optionsSantali: ['ᱫᱟᱜ ᱟᱨ ᱥᱤᱛᱩᱝ', 'ᱯᱞᱟᱥᱴᱤᱠ', 'ᱧᱩᱛ', 'ᱫᱷᱤᱨᱤ'],
            correctAnswerIndex: 0,
            explanationHindi: 'पौधे प्रकाश संश्लेषण और पानी के बिना जीवित नहीं रह सकते।',
            explanationSantali: 'ᱫᱟᱨᱮ ᱫᱟᱜ ᱟᱨ ᱥᱤᱛᱩᱝ ᱵᱮᱜᱚᱨ ᱵᱟᱝ ᱵᱟᱧᱪᱟᱣᱜ-ᱟ᱾',
          },
          {
            id: 'q2',
            type: 'mcq',
            learningOutcomeCode: 'EVS-3.2',
            questionHindi: 'पेड़ का कौन सा भाग जमीन के अंदर से पानी सोखता है?',
            questionSantali: 'ᱫᱟᱨᱮ ᱨᱮᱱᱟᱜ ᱚᱠᱟ ᱦᱟᱹᱴᱤᱧ ᱦᱟᱥᱟ ᱠᱷᱚᱱ ᱫᱟᱜ ᱮ ᱚᱨ-ᱟ?',
            optionsHindi: ['जड़ (Roots)', 'पत्तियां', 'फूल', 'फल'],
            optionsSantali: ['ᱨᱮᱦᱮᱫ (Roots)', 'ᱥᱟᱠᱟᱢ', 'ᱵᱟᱦᱟ', 'ᱡᱚ'],
            correctAnswerIndex: 0,
            explanationHindi: 'जड़ें मिट्टी से पानी और खनिज लवण सोखती हैं।',
            explanationSantali: 'ᱨᱮᱦᱮᱫ ᱦᱟᱥᱟ ᱠᱷᱚᱱ ᱫᱟᱜ ᱟᱨ ᱡᱚᱢᱟᱜ ᱮ ᱚᱨ-ᱟ᱾',
          },
          {
            id: 'q3',
            type: 'mcq',
            learningOutcomeCode: 'EVS-3.2',
            questionHindi: 'पेड़ की हरी पत्तियां धूप में क्या बनाती हैं?',
            questionSantali: 'ᱫᱟᱨᱮ ᱨᱮᱱᱟᱜ ᱦᱟᱹᱨᱭᱟᱹᱲ ᱥᱟᱠᱟᱢ ᱥᱤᱛᱩᱝ ᱨᱮ ᱪᱮᱫ ᱮ ᱵᱮᱱᱟᱣ-ᱟ?',
            optionsHindi: ['भोजन (Food for plant)', 'धुआं', 'पत्थर', 'प्लास्टिक'],
            optionsSantali: ['ᱡᱚᱢᱟᱜ (Food)', 'ᱫᱷᱩᱶᱟᱹ', 'ᱫᱷᱤᱨᱤ', 'ᱯᱞᱟᱥᱴᱤᱠ'],
            correctAnswerIndex: 0,
            explanationHindi: 'पत्तियां सूर्य के प्रकाश में पौधे के लिए भोजन बनाती हैं।',
            explanationSantali: 'ᱥᱟᱠᱟᱢ ᱥᱤᱛᱩᱝ ᱨᱮ ᱫᱟᱨᱮ ᱞᱟᱹᱜᱤᱫ ᱡᱚᱢᱟᱜ ᱮ ᱵᱮᱱᱟᱣ-ᱟ᱾',
          },
          {
            id: 'q4',
            type: 'mcq',
            learningOutcomeCode: 'EVS-3.2',
            questionHindi: 'झारखण्ड के जंगलों का मुख्य राज्य वृक्ष कौन सा है?',
            questionSantali: 'ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱨᱮᱱᱟᱜ ᱢᱩᱬᱩᱛ ᱵᱤᱨ ᱫᱟᱨᱮ ᱚᱠᱟ ᱠᱟᱱᱟ?',
            optionsHindi: ['साल / सखुआ (Sal Tree)', 'कैक्टस', 'नारियल', 'चीड़'],
            optionsSantali: ['ᱥᱟᱨᱡᱚᱢ ᱫᱟᱨᱮ (Sal)', 'ᱠᱮᱠᱴᱟᱥ', 'ᱱᱟᱹᱨᱠᱚᱲ', 'ᱪᱤᱲ'],
            correctAnswerIndex: 0,
            explanationHindi: 'साल (सखुआ) झारखण्ड का प्रमुख वृक्ष है जिसकी पूजा सरहुल पर्व में होती है।',
            explanationSantali: 'ᱥᱟᱨᱡᱚᱢ ᱫᱟᱨᱮ ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱨᱮᱱᱟᱜ ᱢᱩᱬᱩᱛ ᱫᱟᱨᱮ ᱠᱟᱱᱟ᱾',
          },
        ],
        createdAt: new Date().toISOString(),
      };
      setQuiz(localQuiz);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOption = (questionIndex: number, optionIndex: number) => {
    if (isSubmitted) return;
    playAudioChime(480);
    setSelectedAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handleSubmit = async () => {
    if (!quiz) return;

    let score = 0;
    quiz.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswerIndex) {
        score++;
      }
    });

    const total = quiz.questions.length;
    const percentage = Math.round((score / total) * 100);

    const attempt: QuizAttempt = {
      id: `att-${Date.now()}`,
      studentId: studentId,
      quizId: quiz.id,
      topic: quiz.topic,
      learningOutcomeCode: quiz.learningOutcomeCode,
      score,
      totalQuestions: total,
      percentage,
      answers: selectedAnswers,
      isOffline: !offlineStorage.isOnline(),
      completedAt: new Date().toISOString(),
    };

    setIsSubmitted(true);
    setAttemptResult(attempt);
    playAudioChime(score >= 3 ? 660 : 350);

    // Persist via offlineStorage which updates the sync queue and recalculated concept gaps!
    offlineStorage.saveQuizAttempt(attempt);

    // Persist in classStore for class-specific performance tracking
    classStore.recordStudentQuizCompletion(studentId, quiz.id, score, total);

    // If online, also notify backend
    if (offlineStorage.isOnline()) {
      try {
        await fetch('/api/quiz/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentId: MOCK_STUDENT.id,
            quizId: quiz.id,
            answers: selectedAnswers,
            score,
            totalQuestions: total,
            topic: quiz.topic,
            learningOutcomeCode: quiz.learningOutcomeCode,
          }),
        });
      } catch (e) {
        console.warn('Backend submit failed, attempt queued in local offline store:', e);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Title */}
      <div className="bg-gradient-to-r from-red-800 to-amber-900 text-white rounded-2xl p-6 shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 bg-red-950/70 px-3 py-1 rounded-full text-xs font-semibold text-amber-300 mb-2 border border-amber-400/20">
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Real Student Evaluation & Concept Gap Trigger</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            द्विभाषी प्रश्नोत्तरी (Bilingual Classroom Quiz)
          </h2>
          <p className="text-xs text-stone-300 mt-0.5">
            छात्र: <strong>{studentName}</strong> • कक्षा: {classNumber} • रोल नं: {rollNo}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={activeLessonId}
            onChange={(e) => setActiveLessonId(e.target.value)}
            className="p-2 rounded-xl bg-stone-900 border border-stone-700 text-xs font-semibold text-amber-300 focus:outline-none"
          >
            {CURRICULUM_LESSONS.map((l) => (
              <option key={l.id} value={l.id}>
                Class {l.classNumber}: {l.chapterNameHindi}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="bg-white rounded-2xl p-12 text-center space-y-3 border border-stone-200">
          <div className="w-8 h-8 rounded-full border-4 border-red-600 border-t-transparent animate-spin mx-auto"></div>
          <p className="text-sm font-semibold text-stone-700">
            पलाश एआई द्विभाषी प्रश्नोत्तरी तैयार कर रहा है...
          </p>
        </div>
      )}

      {/* Quiz questions */}
      {!isLoading && quiz && (
        <div className="space-y-6">
          {quiz.questions.map((q, qIndex) => {
            const isAnswered = selectedAnswers[qIndex] !== undefined;
            const isCorrect = selectedAnswers[qIndex] === q.correctAnswerIndex;

            return (
              <div
                key={q.id || qIndex}
                className={`bg-white rounded-2xl p-6 border-2 transition-all shadow-sm space-y-4 ${
                  isSubmitted
                    ? isCorrect
                      ? 'border-emerald-500 bg-emerald-50/20'
                      : 'border-red-500 bg-red-50/20'
                    : 'border-stone-200'
                }`}
              >
                {/* Question title */}
                <div className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-xl bg-stone-900 text-white font-bold flex items-center justify-center text-sm shrink-0">
                    {qIndex + 1}
                  </span>
                  <div className="space-y-1 flex-1">
                    <h3 className="text-base font-bold text-stone-900">{q.questionHindi}</h3>
                    <p className="text-lg font-bold text-red-900 font-serif leading-snug">
                      {q.questionSantali}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => speakText(q.questionHindi, 'hi-IN')}
                      className="px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold border border-stone-200 flex items-center space-x-1 transition-colors cursor-pointer"
                      title="हिन्दी में प्रश्न सुनें"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-stone-700" />
                      <span>हिन्दी</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => speakText(q.questionSantali, 'hi-IN')}
                      className="px-2.5 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-bold border border-amber-300 flex items-center space-x-1 transition-colors cursor-pointer"
                      title="संथाली में प्रश्न सुनें"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-red-700" />
                      <span>संथाली</span>
                    </button>
                  </div>
                </div>

                {/* Multiple choice options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {q.optionsHindi.map((optHindi, optIndex) => {
                    const optSantali = q.optionsSantali[optIndex] || '';
                    const isSelected = selectedAnswers[qIndex] === optIndex;
                    const isActualCorrect = q.correctAnswerIndex === optIndex;

                    let btnStyle = 'bg-stone-50 border-stone-200 text-stone-800 hover:bg-stone-100';
                    if (isSubmitted) {
                      if (isActualCorrect) {
                        btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold';
                      } else if (isSelected && !isActualCorrect) {
                        btnStyle = 'bg-red-100 border-red-500 text-red-950';
                      }
                    } else if (isSelected) {
                      btnStyle = 'bg-red-50 border-red-600 text-red-950 ring-2 ring-red-600';
                    }

                    return (
                      <button
                        key={optIndex}
                        onClick={() => handleSelectOption(qIndex, optIndex)}
                        disabled={isSubmitted}
                        className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-2.5 ${btnStyle}`}
                      >
                        <span className="w-5 h-5 rounded-full border border-stone-400 text-xs flex items-center justify-center shrink-0 font-bold">
                          {String.fromCharCode(65 + optIndex)}
                        </span>
                        <div className="flex-1">
                          <div className="text-sm font-semibold">{optHindi}</div>
                          <div className="text-xs text-red-900 font-serif">{optSantali}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Post-submission explanation */}
                {isSubmitted && (
                  <div
                    className={`p-4 rounded-xl text-xs space-y-1 border ${
                      isCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-red-50 border-red-200 text-red-950'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold flex items-center gap-1.5">
                        {isCorrect ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>सही उत्तर! (Correct Answer)</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 text-red-600" />
                            <span>
                              गलत उत्तर। सही विकल्प: {String.fromCharCode(65 + q.correctAnswerIndex)}
                            </span>
                          </>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          speakText(
                            `${isCorrect ? 'सही उत्तर!' : 'गलत उत्तर।'} ${q.explanationHindi}`,
                            'hi-IN'
                          )
                        }
                        className="px-2.5 py-1 rounded-lg bg-stone-900 text-white text-[11px] font-bold flex items-center space-x-1 cursor-pointer hover:bg-stone-800 transition-colors shadow-xs"
                      >
                        <Volume2 className="w-3 h-3 text-amber-300" />
                        <span>🔊 व्याख्या सुनें</span>
                      </button>
                    </div>
                    <p className="text-stone-800">{q.explanationHindi}</p>
                    <p className="text-red-900 font-serif">{q.explanationSantali}</p>
                  </div>
                )}
              </div>
            );
          })}

          {/* Action Footer */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            {!isSubmitted ? (
              <>
                <div className="text-xs text-stone-500">
                  कुल प्रश्न: <strong>{quiz.questions.length}</strong> • हल किए गए:{' '}
                  <strong>{Object.keys(selectedAnswers).length}</strong>
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={Object.keys(selectedAnswers).length === 0}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-sm shadow-md transition-all disabled:opacity-50"
                >
                  उत्तर जमा करें (Submit Quiz)
                </button>
              </>
            ) : (
              attemptResult && (
                <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center">
                      <Award className="w-6 h-6 text-amber-700" />
                    </div>
                    <div>
                      <h4 className="font-black text-stone-900 text-base">
                        प्राप्त प्राप्तांक: {attemptResult.score} / {attemptResult.totalQuestions} ({attemptResult.percentage}%)
                      </h4>
                      <p className="text-xs text-stone-500">
                        {attemptResult.percentage >= 70
                          ? 'उत्कृष्ट! अवधारणा स्पष्ट है।'
                          : 'गैप विश्लेषण में सुधार हेतु दर्ज किया गया।'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={loadOrGenerateQuiz}
                    className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all shadow-sm"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>नया टेस्ट लें (New Quiz)</span>
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};
