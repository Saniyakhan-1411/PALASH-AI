import React, { useState, useEffect } from 'react';
import {
  FileText,
  Printer,
  Save,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Image as ImageIcon,
  BookOpen,
  ArrowRight,
  Download,
  AlertCircle,
} from 'lucide-react';
import { BilingualWorksheet, LanguageCode } from '../types';
import { CURRICULUM_LESSONS, SUPPORTED_LANGUAGES } from '../data/curriculum';
import { offlineStorage } from '../services/offlineStorage';
import { classStore } from '../data/classStore';

interface WorksheetGeneratorProps {
  currentLanguage: LanguageCode;
}

export const WorksheetGenerator: React.FC<WorksheetGeneratorProps> = ({ currentLanguage }) => {
  const [selectedClass, setSelectedClass] = useState<number>(3);
  const [selectedSubject, setSelectedSubject] = useState<string>('Environmental Studies');
  const [selectedTopic, setSelectedTopic] = useState<string>('पौधों को पानी और धूप की आवश्यकता (Needs of Plants)');
  const [selectedOutcome, setSelectedOutcome] = useState<string>('EVS-3.2 (NIPUN-JH-C3-EVS-02)');
  const [difficulty, setDifficulty] = useState<'basic' | 'medium' | 'advanced'>('basic');
  const [questionCount, setQuestionCount] = useState<number>(4);

  const [isGenerating, setIsGenerating] = useState(false);
  const [worksheet, setWorksheet] = useState<BilingualWorksheet | null>(null);
  const [savedList, setSavedList] = useState<BilingualWorksheet[]>([]);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);

  useEffect(() => {
    setSavedList(offlineStorage.getSavedWorksheets());
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setSaveNotice(null);
    setGenerationError(null);

    try {
      const response = await fetch('/api/worksheet/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classNumber: selectedClass,
          subject: selectedSubject,
          topic: selectedTopic,
          nipunOutcomeCode: selectedOutcome,
          difficulty,
          count: questionCount,
          targetLanguage: currentLanguage,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.details || errJson.error || 'AI worksheet generation failed');
      }

      const data = await response.json();
      if (!data.worksheet) {
        throw new Error('कार्यपत्रक डेटा प्राप्त नहीं हुआ।');
      }
      setWorksheet(data.worksheet);

      // Auto-save to local offline persistent cache & sync queue
      offlineStorage.saveWorksheet(data.worksheet);
      setSavedList(offlineStorage.getSavedWorksheets());

      // Automatically publish to selected class feed in classStore
      classStore.publishAssessmentItem({
        type: 'worksheet',
        classNumber: selectedClass,
        title: data.worksheet.titleHindi || `कक्षा ${selectedClass} द्विभाषी कार्यपत्रक`,
        titleSantali: data.worksheet.titleSantali || `ᱪᱟᱱᱟᱪ ${selectedClass} ᱠᱟᱹᱢᱤ ᱥᱟᱠᱟᱢ`,
        subject: selectedSubject,
        description: `कक्षा ${selectedClass} के लिए द्विभाषी अभ्यास पत्रक (${selectedTopic})`,
        createdBy: 'शिक्षक (Teacher Portal)',
        questionsCount: data.worksheet.questions?.length || questionCount,
        worksheetData: data.worksheet,
      });
    } catch (err: any) {
      console.error('Worksheet error:', err);
      // If offline or error, check if we have an existing cached worksheet
      const saved = offlineStorage.getSavedWorksheets();
      if (saved.length > 0) {
        setWorksheet(saved[0]);
        setSaveNotice('ऑफ़लाइन मोड: पूर्व में सहेजा गया कार्यपत्रक खोला गया।');
      } else {
        setGenerationError('एआई कार्यपत्रक निर्माण में त्रुटि हुई। कृपया पुनः प्रयास करें। (' + (err.message || 'नेटवर्क जांचें') + ')');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleManualSave = () => {
    if (worksheet) {
      offlineStorage.saveWorksheet(worksheet);
      setSavedList(offlineStorage.getSavedWorksheets());
      setSaveNotice('कार्यपत्रक स्थानीय संग्रहण में सहेजा गया और सिंक कतार में जोड़ा गया!');
      setTimeout(() => setSaveNotice(null), 4000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Title banner */}
      <div className="bg-gradient-to-r from-red-800 to-stone-900 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 bg-red-950/70 px-3 py-1 rounded-full text-xs font-semibold text-amber-300 mb-2 border border-amber-400/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>NIPUN Bharat Aligned Bilingual Assessment Tool</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            द्विभाषी कार्यपत्रक जनरेटर (Bilingual Worksheet Generator)
          </h2>
          <p className="text-xs text-stone-300 mt-1 max-w-2xl">
            हिन्दी + संथाली (ᱚᱞ ᱪᱤᱠᱤ) में रीयल-टाइम मुद्रण-योग्य कार्यपत्रक तैयार करें, जिसमें स्थानीय गतिविधियां व प्रश्न शामिल हैं।
          </p>
        </div>

        {worksheet && (
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-white hover:bg-stone-100 text-stone-900 text-xs font-bold shadow transition-all"
            >
              <Printer className="w-4 h-4 text-red-700" />
              <span>प्रिंट / डाउनलोड</span>
            </button>
          </div>
        )}
      </div>

      {/* Generator Configuration Grid */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-5">
        <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-red-600" />
          पाठ्यक्रम चयन एवं विनिर्देश (Curriculum Specifications):
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          {/* Class */}
          <div>
            <label className="font-semibold text-stone-700 block mb-1">कक्षा (Class):</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(Number(e.target.value))}
              className="w-full p-2.5 rounded-lg border border-stone-300 bg-stone-50 font-medium text-stone-800"
            >
              <option value={1}>Class 1 (बालवाटिका / कक्षा 1)</option>
              <option value={2}>Class 2 (कक्षा 2)</option>
              <option value={3}>Class 3 (कक्षा 3 - NIPUN Primary)</option>
              <option value={4}>Class 4 (कक्षा 4)</option>
              <option value={5}>Class 5 (कक्षा 5)</option>
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="font-semibold text-stone-700 block mb-1">विषय (Subject):</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-stone-300 bg-stone-50 font-medium text-stone-800"
            >
              <option value="Environmental Studies">पर्यावरण अध्ययन (EVS)</option>
              <option value="Mathematics">गणित मेला (Mathematics)</option>
              <option value="Language and Literacy">भाषा एवं साक्षरता (Hindi / Santali)</option>
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label className="font-semibold text-stone-700 block mb-1">कठिनाई स्तर (Difficulty):</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              className="w-full p-2.5 rounded-lg border border-stone-300 bg-stone-50 font-medium text-stone-800"
            >
              <option value="basic">सरल / बुनियादी (Basic - NIPUN Foundation)</option>
              <option value="medium">मध्यम (Medium)</option>
              <option value="advanced">उन्नत (Advanced)</option>
            </select>
          </div>

          {/* Topic */}
          <div className="sm:col-span-2">
            <label className="font-semibold text-stone-700 block mb-1">विषय / पाठ (Topic):</label>
            <input
              type="text"
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-stone-300 bg-stone-50 font-medium text-stone-800"
            />
          </div>

          {/* Questions count */}
          <div>
            <label className="font-semibold text-stone-700 block mb-1">प्रश्नों की संख्या (Questions Count):</label>
            <select
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="w-full p-2.5 rounded-lg border border-stone-300 bg-stone-50 font-medium text-stone-800"
            >
              <option value={3}>3 प्रश्न (Small Activity Sheet)</option>
              <option value={4}>4 प्रश्न (Standard Classroom Sheet)</option>
              <option value={6}>6 प्रश्न (Comprehensive Assessment)</option>
            </select>
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-sm shadow-sm transition-all disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>
              {isGenerating ? 'द्विभाषी कार्यपत्रक तैयार हो रहा है...' : '✨ कार्यपत्रक तैयार करें (Generate Worksheet)'}
            </span>
          </button>

          {saveNotice && (
            <div className="text-xs text-emerald-700 font-bold flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" />
              <span>{saveNotice}</span>
            </div>
          )}

          {generationError && (
            <div className="text-xs text-red-700 font-semibold flex items-center gap-1.5 bg-red-50 px-3.5 py-2 rounded-lg border border-red-200 max-w-xl">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{generationError}</span>
            </div>
          )}
        </div>
      </div>

      {/* Generated Worksheet Printable Container */}
      {worksheet && (
        <div className="bg-white rounded-2xl p-6 sm:p-10 border-2 border-stone-300 shadow-lg space-y-8 print:border-none print:shadow-none print:p-0">
          {/* Official Worksheet Header */}
          <div className="border-b-2 border-stone-800 pb-4 text-center space-y-2">
            <div className="text-xs uppercase font-bold tracking-widest text-stone-600">
              झारखण्ड प्राथमिक शिक्षा परिषद • NIPUN BHARAT VERNACULAR PEDAGOGY
            </div>
            <h1 className="text-2xl font-black text-stone-900">{worksheet.titleHindi}</h1>
            <h2 className="text-xl font-bold text-red-900 font-serif">{worksheet.titleSantali}</h2>

            <div className="flex flex-wrap justify-between text-xs font-semibold text-stone-700 pt-2 border-t border-stone-300 mt-3">
              <span>कक्षा: {worksheet.classNumber}</span>
              <span>विषय: {worksheet.subject}</span>
              <span>NIPUN कोड: {worksheet.nipunOutcomeCode}</span>
              <span>दिनांक: {new Date(worksheet.createdAt).toLocaleDateString('hi-IN')}</span>
            </div>

            <div className="flex justify-between text-xs text-stone-500 pt-2">
              <span>विद्यार्थी का नाम: ___________________________</span>
              <span>रोल नंबर: __________</span>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs space-y-1">
            <div className="font-bold text-stone-800">निर्देश (Instructions):</div>
            <p className="text-stone-700">{worksheet.instructionsHindi}</p>
            <p className="text-red-900 font-serif font-semibold">{worksheet.instructionsSantali}</p>
          </div>

          {/* Questions list */}
          <div className="space-y-8">
            {worksheet.questions.map((q, idx) => (
              <div key={q.id || idx} className="space-y-3 pb-6 border-b border-stone-200 last:border-b-0">
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-red-800 text-white font-bold flex items-center justify-center text-sm shrink-0">
                    {idx + 1}
                  </span>
                  <div className="space-y-1.5 flex-1">
                    {/* Hindi Question */}
                    <p className="text-base font-bold text-stone-900">{q.questionHindi}</p>
                    {/* Santali Ol Chiki Question */}
                    <p className="text-lg font-bold text-red-900 font-serif leading-relaxed">
                      {q.questionSantali}
                    </p>
                    {q.questionSantaliDeva && (
                      <p className="text-xs text-stone-500 italic">उच्चारण: {q.questionSantaliDeva}</p>
                    )}
                  </div>
                </div>

                {/* Visual / Activity Prompt */}
                {q.visualPromptDescription && (
                  <div className="ml-10 bg-amber-50/70 p-3 rounded-lg border border-amber-200 text-xs text-amber-950 flex items-center gap-2.5">
                    <ImageIcon className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>
                      <strong className="font-bold">चित्र संकेत / गतिविधि:</strong> {q.visualPromptDescription}
                    </span>
                  </div>
                )}

                {/* Answer space */}
                <div className="ml-10 pt-2">
                  <span className="text-[11px] font-bold text-stone-400 block mb-1">
                    उत्तर (Student Answer Field):
                  </span>
                  <div className="h-16 rounded-lg border border-dashed border-stone-300 bg-stone-50/50 p-2 text-xs text-stone-400">
                    यहाँ अपना उत्तर या चित्र बनाएं (Draw or write here)...
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer actions (hidden in print) */}
          <div className="print:hidden pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-stone-500 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>स्थानीय SQLite और MongoDB Atlas में स्वतः सहेजा गया।</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleManualSave}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-all border border-stone-300"
              >
                <Save className="w-4 h-4 text-stone-600" />
                <span>पुनः सहेजें</span>
              </button>

              <button
                onClick={handlePrint}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-bold shadow transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>प्रिंट / PDF डाउनलोड</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
