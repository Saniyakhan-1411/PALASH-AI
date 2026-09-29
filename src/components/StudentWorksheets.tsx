import React, { useState, useEffect } from 'react';
import {
  FileText,
  CheckCircle2,
  Clock,
  Award,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Volume2,
  Check,
  Send,
  AlertCircle,
  Sparkles,
  Paperclip,
  Printer,
  ChevronRight,
} from 'lucide-react';
import { AuthUser } from './LoginModal';
import {
  classStore,
  StudentProfile,
  AssignedWorksheetItem,
  SubmittedWorksheetItem,
  WorksheetQuestion,
} from '../data/classStore';
import { speakText } from '../utils/audioSynth';

interface StudentWorksheetsProps {
  user: AuthUser;
  onNavigateHome?: () => void;
}

export const StudentWorksheets: React.FC<StudentWorksheetsProps> = ({
  user,
  onNavigateHome,
}) => {
  const studentClass = (user.classNumber || 1) as 1 | 2 | 3 | 4 | 5;
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'pending' | 'graded'>('pending');

  // Currently active worksheet being solved or inspected
  const [activeWorksheet, setActiveWorksheet] = useState<AssignedWorksheetItem | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<SubmittedWorksheetItem | null>(null);

  // Solving State
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [attachmentName, setAttachmentName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    score: number;
    grade: string;
    feedbackHindi: string;
    feedbackSantali: string;
  } | null>(null);

  // Sync with classStore
  const refreshProfile = () => {
    let profile = classStore.getStudentById(user.id);
    if (!profile && user.emailOrMobile) {
      profile = classStore.getStudentByEmail(user.emailOrMobile);
    }
    if (!profile) {
      const classStudents = classStore.getStudentsByClass(studentClass);
      profile = classStudents[0] || null;
    }
    setStudentProfile(profile ? { ...profile } : null);
  };

  useEffect(() => {
    refreshProfile();
  }, [user, studentClass]);

  const assignedList = studentProfile?.assignedWorksheets || [];
  const pendingWorksheets = assignedList.filter((w) => w.status === 'pending');
  const submittedList = studentProfile?.submittedWorksheets || [];

  const handleStartSolving = (ws: AssignedWorksheetItem) => {
    setActiveWorksheet(ws);
    setSelectedSubmission(null);
    setSubmissionResult(null);
    // Initialize blank answers
    const initAns: Record<string, string> = {};
    ws.questions.forEach((q) => {
      initAns[q.id] = '';
    });
    setAnswers(initAns);
    setAttachmentName('');
  };

  const handleInspectSubmission = (sub: SubmittedWorksheetItem) => {
    setSelectedSubmission(sub);
    setActiveWorksheet(null);
    setSubmissionResult(null);
  };

  const handleSelectChoice = (questionId: string, choice: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: choice }));
  };

  const handleTextChange = (questionId: string, text: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: text }));
  };

  const handleSimulateAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachmentName(e.target.files[0].name);
    }
  };

  const handlePlayVoice = async (text: string) => {
    await speakText(text, 'hi-IN');
  };

  const handleSubmit = () => {
    if (!studentProfile || !activeWorksheet) return;

    // Check if at least one answer is provided
    const answeredCount = Object.values(answers).filter(
      (v) => typeof v === 'string' && v.trim().length > 0
    ).length;
    if (answeredCount === 0 && !attachmentName) {
      alert('कृपया जमा करने से पहले कम से कम एक प्रश्न का उत्तर लिखें या फाइल संलग्न करें।');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = classStore.submitStudentWorksheet(
        studentProfile.id,
        activeWorksheet.id,
        answers,
        attachmentName || undefined
      );

      setSubmissionResult(result);
      refreshProfile();
    } catch (e: any) {
      alert('कार्यपत्रक जमा करने में त्रुटि: ' + e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-stone-900 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 bg-emerald-950/70 px-3 py-1 rounded-full text-xs font-semibold text-emerald-300 mb-2 border border-emerald-400/20">
            <Award className="w-3.5 h-3.5" />
            <span>कक्षा {studentClass} • द्विभाषी अभ्यास एवं मूल्यांकन</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            मेरे अभ्यास कार्यपत्रक (My Worksheets)
          </h2>
          <p className="text-xs text-stone-300 mt-1 max-w-xl leading-relaxed">
            हिन्दी और संथाली (ᱚᱞ ᱪᱤᱠᱤ) में शिक्षक द्वारा दिए गए कार्यपत्रक हल करें, हस्तलिखित कॉपी संलग्न करें और शिक्षक से त्वरित मूल्यांकन प्राप्त करें।
          </p>
        </div>

        {/* Quick Student Stats */}
        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10 shrink-0 text-xs">
          <div className="text-center px-2">
            <span className="text-[10px] text-stone-300 block uppercase font-bold">लंबित</span>
            <span className="text-lg font-black text-amber-300">{pendingWorksheets.length}</span>
          </div>
          <div className="h-7 w-[1px] bg-white/20"></div>
          <div className="text-center px-2">
            <span className="text-[10px] text-stone-300 block uppercase font-bold">जाँचे गए</span>
            <span className="text-lg font-black text-emerald-300">{submittedList.length}</span>
          </div>
          <div className="h-7 w-[1px] bg-white/20"></div>
          <div className="text-center px-2">
            <span className="text-[10px] text-stone-300 block uppercase font-bold">औसत अंक</span>
            <span className="text-lg font-black text-white">
              {studentProfile?.overallPerformance.averageScore || 85}%
            </span>
          </div>
        </div>
      </div>

      {/* Solving View */}
      {activeWorksheet && (
        <div className="bg-white rounded-2xl p-6 border-2 border-emerald-600 shadow-lg space-y-6 animate-fadeIn">
          {/* Top Solver Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
            <button
              onClick={() => {
                setActiveWorksheet(null);
                setSubmissionResult(null);
              }}
              className="flex items-center space-x-1 text-xs font-bold text-stone-600 hover:text-stone-900 cursor-pointer self-start"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>कार्यपत्रक सूची पर वापस जाएँ (Back to List)</span>
            </button>

            <div className="flex items-center space-x-2 text-xs">
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                कक्षा {studentClass}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 font-medium">
                विषय: {activeWorksheet.subject}
              </span>
            </div>
          </div>

          {/* Submission Success Screen */}
          {submissionResult ? (
            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-emerald-900">
                कार्यपत्रक सफलतापूर्वक जमा हो गया! (Submission Received)
              </h3>
              <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
                आपके उत्तर शिक्षक के पोर्टल पर समीक्षा के लिए भेज दिए गए हैं। आपका त्वरित मूल्यांकन नीचे दिया गया है:
              </p>

              <div className="inline-flex items-center gap-6 bg-white px-6 py-3 rounded-xl border border-emerald-200 shadow-xs">
                <div>
                  <span className="text-[11px] text-stone-500 block">प्राप्तांक (Score)</span>
                  <span className="text-2xl font-black text-emerald-700">{submissionResult.score}/100</span>
                </div>
                <div className="h-8 w-[1px] bg-stone-200"></div>
                <div>
                  <span className="text-[11px] text-stone-500 block">ग्रेड (Grade)</span>
                  <span className="text-2xl font-black text-emerald-800">{submissionResult.grade}</span>
                </div>
              </div>

              {/* Vernacular Teacher Feedback */}
              <div className="bg-white p-4 rounded-xl border border-emerald-100 max-w-lg mx-auto text-left space-y-1">
                <span className="text-[11px] font-bold text-stone-500 uppercase block">
                  शिक्षक की टिप्पणी (Teacher's Feedback):
                </span>
                <p className="text-xs font-semibold text-stone-800">{submissionResult.feedbackHindi}</p>
                {submissionResult.feedbackSantali && (
                  <p className="text-xs font-serif text-emerald-900">{submissionResult.feedbackSantali}</p>
                )}
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setActiveWorksheet(null);
                    setSubmissionResult(null);
                    setActiveTab('graded');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold shadow transition-all cursor-pointer"
                >
                  सभी जाँचे गए कार्यपत्रक देखें (View Graded Worksheets) ➔
                </button>
              </div>
            </div>
          ) : (
            /* Active Solving Form */
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-stone-900">{activeWorksheet.title}</h3>
                {activeWorksheet.titleSantali && (
                  <h4 className="text-sm font-serif text-amber-900 mt-0.5">
                    {activeWorksheet.titleSantali}
                  </h4>
                )}
                {activeWorksheet.instructionsHindi && (
                  <p className="text-xs text-stone-600 mt-2 bg-stone-50 p-3 rounded-lg border border-stone-200">
                    <strong>निर्देश:</strong> {activeWorksheet.instructionsHindi}
                  </p>
                )}
              </div>

              {/* Questions List */}
              <div className="space-y-6">
                {activeWorksheet.questions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="p-4 rounded-xl bg-stone-50/80 border border-stone-200 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                          प्रश्न {idx + 1}
                        </span>
                        <p className="text-sm font-bold text-stone-900 pt-1">{q.promptHindi}</p>
                        {q.promptSantali && (
                          <p className="text-xs font-serif text-amber-900">{q.promptSantali}</p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handlePlayVoice(q.promptHindi)}
                        className="p-2 rounded-lg bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 cursor-pointer shrink-0"
                        title="प्रश्न सुनें (Listen)"
                      >
                        <Volume2 className="w-4 h-4 text-emerald-700" />
                      </button>
                    </div>

                    {/* Question Answer Inputs */}
                    {q.type === 'choice' && q.options ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {q.options.map((opt, oIdx) => {
                          const isSelected = answers[q.id] === opt;
                          return (
                            <button
                              key={oIdx}
                              type="button"
                              onClick={() => handleSelectChoice(q.id, opt)}
                              className={`p-3 rounded-xl text-xs text-left border-2 transition-all cursor-pointer flex items-center justify-between ${
                                isSelected
                                  ? 'border-emerald-600 bg-emerald-50 font-bold text-emerald-900'
                                  : 'border-stone-200 bg-white hover:border-stone-300 text-stone-800'
                              }`}
                            >
                              <span>{opt}</span>
                              {isSelected && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="pt-1">
                        <textarea
                          rows={2}
                          value={answers[q.id] || ''}
                          onChange={(e) => handleTextChange(q.id, e.target.value)}
                          placeholder="यहाँ अपना उत्तर संथाली या हिन्दी में लिखें..."
                          className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 bg-white"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Optional Attachment Upload */}
              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-amber-900 block flex items-center gap-1.5">
                    <Paperclip className="w-4 h-4 text-amber-700" />
                    <span>हस्तलिखित कॉपी या चित्र संलग्न करें (Optional):</span>
                  </span>
                  <p className="text-[11px] text-stone-600 mt-0.5">
                    यदि आपने कॉपी में प्रश्न हल किए हैं, तो यहाँ उसकी फोटो संलग्न कर सकते हैं।
                  </p>
                  {attachmentName && (
                    <span className="inline-block mt-1 font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-300">
                      ✓ संलग्न: {attachmentName}
                    </span>
                  )}
                </div>

                <label className="px-3.5 py-2 rounded-xl bg-white hover:bg-stone-50 border border-amber-300 font-bold text-stone-800 cursor-pointer shrink-0 shadow-2xs text-center">
                  <span>फोटो / फ़ाइल चुनें</span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleSimulateAttachment}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setActiveWorksheet(null)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:text-stone-900 text-xs font-bold cursor-pointer"
                >
                  रद्द करें (Cancel)
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                  id="submit-worksheet-btn"
                  className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <span>जमा हो रहा है...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>कार्यपत्रक जमा करें (Submit Worksheet)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Inspected Graded Submission Modal / Detail View */}
      {selectedSubmission && (
        <div className="bg-white rounded-2xl p-6 border-2 border-indigo-600 shadow-lg space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
            <button
              onClick={() => setSelectedSubmission(null)}
              className="flex items-center space-x-1 text-xs font-bold text-stone-600 hover:text-stone-900 cursor-pointer self-start"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>सूची पर वापस जाएँ</span>
            </button>

            <button
              onClick={() => window.print()}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>मुद्रण करें (Print)</span>
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded">
                  जाँचा गया कार्यपत्रक
                </span>
                <h3 className="text-xl font-black text-stone-900 mt-1">{selectedSubmission.title}</h3>
                {selectedSubmission.titleSantali && (
                  <p className="text-xs font-serif text-amber-900">{selectedSubmission.titleSantali}</p>
                )}
                <div className="text-[11px] text-stone-500 mt-1">
                  विषय: {selectedSubmission.subject} • जमा तिथि: {selectedSubmission.submissionDate}
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-right shrink-0">
                <span className="text-[11px] text-stone-500 block">प्राप्त अंक व ग्रेड</span>
                <div className="text-2xl font-black text-emerald-800">
                  {selectedSubmission.score || 88}/100
                  <span className="ml-2 text-sm px-2 py-0.5 rounded bg-emerald-200 text-emerald-900">
                    ग्रेड {selectedSubmission.grade || 'A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Teacher Remarks Box */}
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-1">
              <span className="text-[11px] font-bold text-amber-900 uppercase block flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-700" />
                <span>शिक्षक की टिप्पणी (Teacher's Evaluation Remark):</span>
              </span>
              <p className="text-xs font-semibold text-stone-800">
                {selectedSubmission.feedbackHindi || 'उत्कृष्ट प्रयास! सभी प्रश्नों के उत्तर स्पष्ट हैं।'}
              </p>
              {selectedSubmission.feedbackSantali && (
                <p className="text-xs font-serif text-amber-900">{selectedSubmission.feedbackSantali}</p>
              )}
            </div>

            {/* Submitted Answers Review */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                आपके द्वारा दिए गए उत्तर (Your Submitted Answers):
              </h4>
              <div className="space-y-2">
                {Object.entries(selectedSubmission.answers).map(([key, val], idx) => (
                  <div key={key} className="p-3 rounded-lg bg-stone-50 border border-stone-200 text-xs">
                    <span className="font-bold text-stone-600 block mb-1">उत्तर {idx + 1}:</span>
                    <p className="text-stone-900 font-medium">{val || '(खाली उत्तर)'}</p>
                  </div>
                ))}
              </div>
              {selectedSubmission.attachmentName && (
                <div className="text-xs text-stone-600 pt-1">
                  <strong>संलग्न फाइल:</strong> {selectedSubmission.attachmentName}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tabs Navigation */}
      {!activeWorksheet && !selectedSubmission && (
        <div className="space-y-4">
          <div className="flex border-b border-stone-200">
            <button
              onClick={() => setActiveTab('pending')}
              id="tab-pending-worksheets"
              className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'pending'
                  ? 'border-emerald-600 text-emerald-800'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>हल करने हेतु लंबित ({pendingWorksheets.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('graded')}
              id="tab-graded-worksheets"
              className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'graded'
                  ? 'border-emerald-600 text-emerald-800'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>जाँचे गए व पूर्ण ({submittedList.length})</span>
            </button>
          </div>

          {/* Pending Worksheets Tab Content */}
          {activeTab === 'pending' && (
            <div className="space-y-3">
              {pendingWorksheets.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 border border-stone-200 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="text-base font-bold text-stone-800">बहुत बढ़िया! कोई लंबित कार्यपत्रक नहीं है।</h4>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    आपने कक्षा {studentClass} के सभी कार्यपत्रक पूरे कर लिए हैं। शिक्षक द्वारा नया कार्यपत्रक प्रकाशित होने पर वह यहाँ दिखेगा।
                  </p>
                </div>
              ) : (
                pendingWorksheets.map((ws) => (
                  <div
                    key={ws.id}
                    className="bg-white rounded-2xl p-5 border border-stone-200 hover:border-emerald-500 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 uppercase">
                          लंबित (Pending)
                        </span>
                        <span className="text-xs text-stone-500">विषय: {ws.subject}</span>
                      </div>
                      <h4 className="text-base font-bold text-stone-900">{ws.title}</h4>
                      {ws.titleSantali && (
                        <p className="text-xs font-serif text-amber-900">{ws.titleSantali}</p>
                      )}
                      <div className="flex items-center space-x-4 text-[11px] text-stone-500 pt-1">
                        <span>कुल प्रश्न: {ws.questionsCount || ws.questions.length}</span>
                        {ws.dueDate && <span>अंतिम तिथि: {ws.dueDate}</span>}
                      </div>
                    </div>

                    <button
                      onClick={() => handleStartSolving(ws)}
                      id={`solve-worksheet-${ws.id}`}
                      className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
                    >
                      <span>हल करें व जमा करें</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Graded Worksheets Tab Content */}
          {activeTab === 'graded' && (
            <div className="space-y-3">
              {submittedList.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 border border-stone-200 text-center space-y-2">
                  <FileText className="w-10 h-10 text-stone-400 mx-auto" />
                  <h4 className="text-base font-bold text-stone-800">अभी कोई जाँचा गया कार्यपत्रक नहीं है।</h4>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    लंबित टैब से कार्यपत्रक हल करके जमा करें।
                  </p>
                </div>
              ) : (
                submittedList.map((sub) => (
                  <div
                    key={sub.id}
                    className="bg-white rounded-2xl p-5 border border-stone-200 hover:border-indigo-400 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase">
                          पूर्ण व जाँचा गया (Graded)
                        </span>
                        <span className="text-xs text-stone-500">जमा तिथि: {sub.submissionDate}</span>
                      </div>
                      <h4 className="text-base font-bold text-stone-900">{sub.title}</h4>
                      {sub.titleSantali && (
                        <p className="text-xs font-serif text-amber-900">{sub.titleSantali}</p>
                      )}
                      {sub.feedbackHindi && (
                        <p className="text-xs text-stone-600 bg-stone-50 px-2.5 py-1 rounded mt-1 line-clamp-1 border border-stone-200">
                          <strong>शिक्षक:</strong> {sub.feedbackHindi}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end">
                      <div className="text-right">
                        <div className="text-sm font-black text-emerald-700">
                          {sub.score || 88}/100
                        </div>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                          ग्रेड {sub.grade || 'A'}
                        </span>
                      </div>

                      <button
                        onClick={() => handleInspectSubmission(sub)}
                        id={`inspect-submission-${sub.id}`}
                        className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition-all cursor-pointer flex items-center gap-1"
                      >
                        <span>विवरण देखें</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
