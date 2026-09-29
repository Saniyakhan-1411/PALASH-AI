/**
 * PALASH AI - Shared Types & Schemas
 * Smart India Hackathon Problem Statement 26042
 * Mother Tongue-Based Primary Education (Government of Jharkhand)
 */

export type LanguageCode = 'hin_Deva' | 'sat_Olck' | 'sat_Deva' | 'hoc_Deva' | 'unr_Deva';

export interface LanguageInfo {
  code: LanguageCode;
  name: string;
  nativeName: string;
  script: string;
  region: string;
  supported: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  role: 'teacher' | 'headmaster' | 'admin' | 'student';
  schoolId: string;
  schoolName: string;
  district: string;
  block: string;
  assignedClasses: number[];
  primaryLanguage: LanguageCode;
  motherTongue: LanguageCode;
}

export interface LearningOutcome {
  code: string; // e.g. "M3.1" or "EVS-3.4"
  nipunCode: string; // e.g. "NIPUN-JH-C3-EVS-04"
  description: string;
  descriptionHindi?: string;
  descriptionVernacular?: string;
  domain: 'Foundational Literacy' | 'Foundational Numeracy' | 'Environmental Awareness' | 'Socio-Emotional';
}

export interface Lesson {
  id: string;
  classNumber: number;
  subject: string;
  subjectHindi: string;
  chapterNumber: number;
  chapterName: string;
  chapterNameHindi: string;
  topic: string;
  topicHindi: string;
  context?: string;
  learningOutcomes: LearningOutcome[];
  suggestedActivities: string[];
  keyVocabulary: {
    hindi: string;
    santaliOlChiki: string;
    santaliDevanagari: string;
    meaning: string;
  }[];
  isDownloadedOffline?: boolean;
}

export interface TranslationLatencyBreakdown {
  asrMs: number;
  mtMs: number;
  ttsMs: number;
  totalLatencyMs: number;
  timestamp: string;
  targetUnder3sAchieved: boolean;
}

export interface TranslationResponse {
  sourceText: string;
  sourceLang: LanguageCode;
  targetLang: LanguageCode;
  translatedText: string; // Ol Chiki or target script
  transliteration?: string; // Devanagari / phonetic
  pedagogicalContext?: string;
  audioBase64?: string;
  latency: TranslationLatencyBreakdown;
  cached?: boolean;
}

export interface WorksheetQuestion {
  id: string;
  questionNumber: number;
  questionHindi: string;
  questionSantali: string;
  questionSantaliDeva?: string;
  type: 'short_answer' | 'fill_in_the_blank' | 'drawing_prompt' | 'matching';
  activityPromptHindi?: string;
  activityPromptSantali?: string;
  visualPromptDescription?: string;
  sampleAnswerHindi: string;
  sampleAnswerSantali: string;
}

export interface BilingualWorksheet {
  id: string;
  title: string;
  titleHindi: string;
  titleSantali: string;
  classNumber: number;
  subject: string;
  topic: string;
  nipunOutcomeCode: string;
  difficulty: 'basic' | 'medium' | 'advanced';
  instructionsHindi: string;
  instructionsSantali: string;
  questions: WorksheetQuestion[];
  createdAt: string;
  generatedBy: string;
  synced: boolean;
}

export interface Flashcard {
  id: string;
  topic: string;
  classNumber?: number;
  hindiWord: string;
  santaliWordOlChiki: string;
  santaliWordDeva: string;
  englishMeaning: string;
  exampleSentenceHindi: string;
  exampleSentenceSantali: string;
  iconName: string; // Lucide icon
  visualPrompt: string;
  imageUrl?: string; // Real educational photo or high-fidelity visual
  learningOutcomeCode: string;
  audioBase64?: string;
}

export interface QuizQuestion {
  id: string;
  type: 'mcq' | 'true_false' | 'matching';
  questionHindi: string;
  questionSantali: string;
  optionsHindi: string[];
  optionsSantali: string[];
  correctAnswerIndex: number;
  explanationHindi: string;
  explanationSantali: string;
  visualHint?: string;
  learningOutcomeCode: string;
}

export interface Quiz {
  id: string;
  titleHindi: string;
  titleSantali: string;
  classNumber: number;
  subject: string;
  topic: string;
  difficulty: 'basic' | 'medium' | 'advanced';
  learningOutcomeCode: string;
  questions: QuizQuestion[];
  createdAt: string;
  synced: boolean;
}

export interface StudentQuizAttempt {
  id: string;
  quizId: string;
  studentId: string;
  studentName: string;
  classNumber: number;
  subject: string;
  topic: string;
  learningOutcomeCode: string;
  answers: {
    questionId: string;
    selectedOptionIndex: number;
    isCorrect: boolean;
  }[];
  score: number;
  totalQuestions: number;
  percentage: number;
  timeSpentSeconds: number;
  completedAt: string;
  isOffline: boolean;
  synced: boolean;
}

export interface ConceptGapAnalysis {
  learningOutcomeCode: string;
  topicName: string;
  totalQuestionsAttempted: number;
  correctCount: number;
  accuracyRate: number; // 0 to 100
  weaknessSeverity: 'high' | 'medium' | 'low';
  identifiedGapsHindi: string;
  identifiedGapsSantali: string;
  recommendedPedagogyHindi: string;
  recommendedPedagogySantali: string;
  lastAssessed: string;
}

export interface StudentProgressRecord {
  studentId: string;
  studentName: string;
  classNumber: number;
  totalQuizzesTaken: number;
  averageScore: number;
  totalQuestionsAttempted: number;
  correctAnswers: number;
  incorrectAnswers: number;
  completedLessons: string[];
  conceptGaps: ConceptGapAnalysis[];
  strongConcepts: string[];
  weakConcepts: string[];
  lastActive: string;
}

export interface SyncQueueItem {
  id: string;
  actionType: 'QUIZ_SUBMIT' | 'SAVE_WORKSHEET' | 'LOG_TRANSLATION' | 'LESSON_PROGRESS';
  payload: any;
  createdAt: string;
  retryCount: number;
  status: 'pending' | 'syncing' | 'synced' | 'failed';
  errorMessage?: string;
}

export type QuizAttempt = {
  id: string;
  studentId: string;
  quizId: string;
  topic: string;
  learningOutcomeCode: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  answers: Record<number, number> | any;
  isOffline: boolean;
  completedAt: string;
};

export type StudentProgress = {
  totalQuestionsAttempted: number;
  overallAccuracy: number;
  totalCorrect: number;
  totalIncorrect?: number;
  completedLessons?: string[];
  conceptGaps?: ConceptGapAnalysis[];
};

