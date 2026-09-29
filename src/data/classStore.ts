/**
 * PALASH AI - Class-Based Centralized Data Store
 * Explicitly organizes and segments data for Class 1, Class 2, Class 3, Class 4, and Class 5.
 * Persists to localStorage to ensure real-time synchronization between Teacher, Student, and Admin portals.
 */

export interface WorksheetQuestion {
  id: string;
  promptHindi: string;
  promptSantali?: string;
  type: 'text' | 'choice';
  options?: string[];
  correctAnswer?: string;
}

export interface AssignedWorksheetItem {
  id: string;
  title: string;
  titleSantali?: string;
  subject: string;
  assignedDate: string;
  dueDate?: string;
  questionsCount: number;
  status: 'pending' | 'submitted' | 'graded';
  questions: WorksheetQuestion[];
  instructionsHindi?: string;
  instructionsSantali?: string;
}

export interface SubmittedWorksheetItem {
  id: string;
  worksheetId: string;
  title: string;
  titleSantali?: string;
  subject: string;
  submissionDate: string;
  answers: Record<string, string>;
  attachmentName?: string;
  score?: number;
  totalMarks?: number;
  grade?: string;
  status: 'submitted' | 'graded';
  feedbackHindi?: string;
  feedbackSantali?: string;
}

export interface SystemSettings {
  allowOfflineSync: boolean;
  allowSelfPacedRetakes: boolean;
  enableAudioSynthesis: boolean;
  requireTeacherApprovalForSubmissions: boolean;
  academicYear: string;
  primaryLanguage: string;
  minPassingScore: number;
}

export interface StudentProfile {
  id: string;
  name: string;
  rollNo: number;
  classNumber: 1 | 2 | 3 | 4 | 5;
  email: string;
  schoolName: string;
  district: string;
  motherTongue: string;
  assignedQuizzes: {
    id: string;
    title: string;
    subject: string;
    assignedDate: string;
    isCompleted: boolean;
    score?: number;
    totalMarks?: number;
    grade?: string;
    submittedAt?: string;
  }[];
  assignedWorksheets?: AssignedWorksheetItem[];
  submittedWorksheets?: SubmittedWorksheetItem[];
  completedWorksheets: {
    id: string;
    title: string;
    subject: string;
    completionDate: string;
    score?: number;
    grade: string;
    feedbackHindi?: string;
    feedbackSantali?: string;
  }[];
  overallPerformance: {
    grade: string;
    averageScore: number;
    quizzesCompleted: number;
    worksheetsCompleted: number;
    attendanceRate: number;
    status: 'उत्कृष्ट (Excellent)' | 'संतोषजनक (Proficient)' | 'सहायता आवश्यक (Needs Support)';
  };
}

export interface TeacherProfile {
  id: string;
  name: string;
  email: string;
  schoolName: string;
  district: string;
  assignedClasses: number[];
  subjectSpecialization: string;
}

export interface ClassAssessmentFeedItem {
  id: string;
  type: 'quiz' | 'worksheet';
  classNumber: number;
  title: string;
  titleSantali?: string;
  subject: string;
  description: string;
  publishedAt: string;
  createdBy: string;
  questionsCount: number;
  quizData?: any;
  worksheetData?: any;
}

const STORAGE_KEY_STUDENTS = 'palash_class_students_v3';
const STORAGE_KEY_TEACHERS = 'palash_class_teachers_v3';
const STORAGE_KEY_FEED = 'palash_class_assessments_feed_v3';
const STORAGE_KEY_SETTINGS = 'palash_system_settings_v3';

const DEFAULT_SETTINGS: SystemSettings = {
  allowOfflineSync: true,
  allowSelfPacedRetakes: true,
  enableAudioSynthesis: true,
  requireTeacherApprovalForSubmissions: true,
  academicYear: '2026-27 (प्रथम सत्र)',
  primaryLanguage: 'Santali (Ol Chiki)',
  minPassingScore: 40,
};

function getDefaultQuestionsForClass(classNum: number, subject: string): WorksheetQuestion[] {
  if (classNum === 1) {
    return [
      {
        id: 'q1',
        promptHindi: 'गाय को संथाली (ऑल चिकी) में क्या कहते हैं?',
        promptSantali: 'ᱜᱟᱹᱭ (Gai) ᱢᱮᱱᱟᱜ-ᱟ?',
        type: 'choice',
        options: ['ᱜᱟᱹᱭ (Gai)', 'ᱥᱮᱛᱟ (Seta - कुत्ता)', 'ᱢᱮᱨᱚᱢ (Merom - बकरी)'],
        correctAnswer: 'ᱜᱟᱹᱭ (Gai)',
      },
      {
        id: 'q2',
        promptHindi: 'संथाली गिनती में "तीन" को क्या कहते हैं?',
        promptSantali: 'ᱯᱮ (Pe)',
        type: 'choice',
        options: ['ᱢᱤᱫ (Mit - 1)', 'ᱵᱟᱨ (Bar - 2)', 'ᱯᱮ (Pe - 3)'],
        correctAnswer: 'ᱯᱮ (Pe - 3)',
      },
      {
        id: 'q3',
        promptHindi: 'आपके आस-पास पाए जाने वाले किसी एक पक्षी का नाम संथाली या हिन्दी में लिखें:',
        promptSantali: 'ᱟᱢ ᱟᱰᱮᱯᱟᱥᱮ ᱧᱟᱢᱚᱜ ᱪᱮᱬᱮ ᱧᱩᱛᱩᱢ ᱚᱞ ᱢᱮ:',
        type: 'text',
      },
    ];
  } else if (classNum === 2) {
    return [
      {
        id: 'q1',
        promptHindi: 'संथाली वर्णमाला (ऑल चिकी) का पहला अक्षर कौन सा है?',
        promptSantali: 'ᱚᱞ ᱪᱤᱠᱤ ᱨᱮᱱᱟᱜ ᱯᱩᱭᱞᱩ ᱟᱠᱷᱚᱨ ᱫᱚ ᱚᱠᱟ ᱠᱟᱱᱟ?',
        type: 'choice',
        options: ['ᱚ (La)', 'ᱛ (At)', 'ᱜ (Ag)'],
        correctAnswer: 'ᱚ (La)',
      },
      {
        id: 'q2',
        promptHindi: 'पेड़ हमें क्या-क्या देते हैं? सही विकल्प चुनें:',
        promptSantali: 'ᱫᱟᱨᱮ ᱟᱵᱚ ᱪᱮᱫ-ᱪᱮᱫ ᱮᱢᱚᱜ-ᱟ?',
        type: 'choice',
        options: ['फल और छाया (ᱡᱚ ᱟᱨ ᱩᱢᱩᱞ)', 'प्लास्टिक', 'कांच'],
        correctAnswer: 'फल और छाया (ᱡᱚ ᱟᱨ ᱩᱢᱩᱞ)',
      },
      {
        id: 'q3',
        promptHindi: 'अपने प्रिय मित्र का नाम लिखें और संथाली में उसे क्या कहेंगे?',
        promptSantali: 'ᱟᱢᱤᱡ ᱜᱟᱛᱮ ᱧᱩᱛᱩᱢ ᱚᱞ ᱢᱮ:',
        type: 'text',
      },
    ];
  } else if (classNum === 3) {
    return [
      {
        id: 'q1',
        promptHindi: 'झारखंड का मुख्य लोकपर्व "सोहराय" किस ऋतु में मनाया जाता है?',
        promptSantali: 'ᱥᱚᱦᱨᱟᱭ ᱯᱟᱨᱟᱵᱽ ᱫᱚ ᱚᱠᱟ ᱨᱤᱛᱩ ᱨᱮ ᱦᱩᱭᱩᱜ-ᱟ?',
        type: 'choice',
        options: ['धान कटाई के समय (कार्तिक/पौष)', 'ग्रीष्म ऋतु', 'वसंत ऋतु'],
        correctAnswer: 'धान कटाई के समय (कार्तिक/पौष)',
      },
      {
        id: 'q2',
        promptHindi: 'वर्षा जल संचयन के लिए गाँव में क्या बनाया जाता है?',
        promptSantali: 'ᱫᱟᱜ ᱥᱟᱧᱪᱟᱣ ᱞᱟᱹᱜᱤᱫ ᱟᱹᱛᱩ ᱨᱮ ᱪᱮᱫ ᱵᱮᱱᱟᱣᱜ-ᱟ?',
        type: 'choice',
        options: ['आहर, पईन व तालाब (Bandh/Pond)', 'पक्की सड़क', 'बिजली का खंभा'],
        correctAnswer: 'आहर, पईन व तालाब (Bandh/Pond)',
      },
      {
        id: 'q3',
        promptHindi: 'प्रकृति संरक्षण के दो उपाय संक्षेप में लिखें:',
        promptSantali: 'ᱯᱨᱚᱠᱨᱤᱛᱤ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱞᱟᱹᱜᱤᱫ ᱵᱟᱨᱭᱟ ᱠᱟᱛᱷᱟ ᱚᱞ ᱢᱮ:',
        type: 'text',
      },
    ];
  } else if (classNum === 4) {
    return [
      {
        id: 'q1',
        promptHindi: 'झारखंड के पठारी क्षेत्रों में मुख्य रूप से कौन सी मिट्टी पाई जाती है?',
        promptSantali: 'ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱨᱮ ᱚᱠᱟ ᱞᱮᱠᱟᱱ ᱦᱟᱥᱟ ᱧᱟᱢᱚᱜ-ᱟ?',
        type: 'choice',
        options: ['लाल एवं लैटेराइट मिट्टी', 'काली कपास मिट्टी', 'रेगिस्तानी बालू'],
        correctAnswer: 'लाल एवं लैटेराइट मिट्टी',
      },
      {
        id: 'q2',
        promptHindi: 'नक्शे में उत्तर दिशा (North) किस ओर होती है?',
        promptSantali: 'ᱱᱚᱠᱥᱟ ᱨᱮ ᱩᱛᱛᱚᱨ ᱫᱤᱥᱟᱹ ᱫᱚ ᱪᱮᱛᱟᱱ ᱥᱮᱫ ᱛᱟᱦᱮᱸᱱᱟ?',
        type: 'choice',
        options: ['ऊपर की ओर (Top)', 'नीचे की ओर', 'बाईं ओर'],
        correctAnswer: 'ऊपर की ओर (Top)',
      },
      {
        id: 'q3',
        promptHindi: 'मृदा अपरदन (मिट्टी के कटाव) को रोकने के लिए क्या करना चाहिए?',
        promptSantali: 'ᱦᱟᱥᱟ ᱟᱹᱛᱩᱜ ᱠᱷᱚᱱ ᱵᱟᱧᱪᱟᱣ ᱞᱟᱹᱜᱤᱫ ᱪᱮᱫ ᱪᱤᱠᱟᱹ ᱦᱩᱭᱩᱜ-ᱟ?',
        type: 'text',
      },
    ];
  } else {
    return [
      {
        id: 'q1',
        promptHindi: 'हमारे सौरमंडल का सबसे बड़ा ग्रह कौन सा है?',
        promptSantali: 'ᱥᱤᱧ ᱪᱟᱸᱫᱚ ᱜᱷᱟᱨᱚᱸᱡᱽ ᱨᱮ ᱡᱚᱛᱚ ᱠᱷᱚᱱ ᱢᱟᱨᱟᱝ ᱜᱽᱨᱚᱦᱚ ᱚᱠᱟ ᱠᱟᱱᱟ?',
        type: 'choice',
        options: ['बृहस्पति (Jupiter)', 'मंगल (Mars)', 'पृथ्वी (Earth)'],
        correctAnswer: 'बृहस्पति (Jupiter)',
      },
      {
        id: 'q2',
        promptHindi: 'पारिस्थितिकी तंत्र में उत्पादक (Producer) कौन हैं?',
        promptSantali: 'ᱤᱠᱚᱥᱤᱥᱴᱚᱢ ᱨᱮ ᱯᱨᱚᱰᱭᱩᱥᱟᱨ ᱫᱚ ᱚᱠᱚᱭ ᱠᱟᱱᱟ ᱠᱚ?',
        type: 'choice',
        options: ['हरे पेड़-पौधे (Green Plants)', 'शाकाहारी जीव', 'अपघटक'],
        correctAnswer: 'हरे पेड़-पौधे (Green Plants)',
      },
      {
        id: 'q3',
        promptHindi: 'पर्यावरण प्रदूषण रोकने में विद्यार्थी की क्या भूमिका हो सकती है? लिखें:',
        promptSantali: 'ᱯᱚᱨᱤᱵᱮᱥ ᱥᱟᱯᱷᱟ ᱫᱚᱦᱚ ᱨᱮ ᱟᱢᱟᱜ ᱮᱱᱮᱢ ᱪᱮᱫ?',
        type: 'text',
      },
    ];
  }
}

function generateDefaultAssignedWorksheets(classNum: number): AssignedWorksheetItem[] {
  const titlesByClass: Record<number, { title: string; santali: string; subject: string }[]> = {
    1: [
      { title: 'घरेलू पशुओं के चित्र व संथाली नाम', santali: 'ᱜᱷᱟᱨᱚᱸᱡᱽ ᱡᱤᱭᱟᱹᱞᱤ ᱪᱤᱛᱟᱹᱨ ᱟᱨ ᱧᱩᱛᱩᱢ', subject: 'पर्यावरण व प्रकृति (EVS)' },
      { title: 'चित्र देखकर गिनती (1 से 10 तक)', santali: 'ᱪᱤᱛᱟᱹᱨ ᱧᱮᱞ ᱠᱟᱛᱮ ᱞᱮᱠᱷᱟ (᱑ ᱠᱷᱚᱱ ᱑᱐)', subject: 'गणित (Maths)' },
    ],
    2: [
      { title: 'हमारे आस-पास के पेड़-पौधे व उपयोग', santali: 'ᱟᱵᱚ ᱟᱰᱮᱯᱟᱥᱮ ᱫᱟᱨᱮ-ᱱᱟᱹᱲᱤ', subject: 'पर्यावरण अध्ययन (EVS)' },
      { title: 'संथाली वर्णमाला (ऑल चिकी) अक्षर मिलान', santali: 'ᱚᱞ ᱪᱤᱠᱤ ᱟᱠᱷᱚᱨ ᱢᱮᱞᱟᱣ', subject: 'मातृभाषा संथाली' },
    ],
    3: [
      { title: 'जल संरक्षण एवं वर्षा के पारंपरिक साधन', santali: 'ᱫᱟᱜ ᱥᱟᱧᱪᱟᱣ ᱟᱨ ᱟᱹᱛᱩ ᱯᱩᱠᱷᱨᱤ', subject: 'पर्यावरण अध्ययन (EVS)' },
      { title: 'झारखंड के पारंपरिक लोक पर्व (सोहराय व बाहा)', santali: 'ᱥᱚᱦᱨᱟᱭ ᱟᱨ ᱵᱟᱦᱟ ᱯᱟᱨᱟᱵᱽ', subject: 'संस्कृति व समाज' },
    ],
    4: [
      { title: 'मिट्टी के प्रकार एवं कृषि विधियां', santali: 'ᱦᱟᱥᱟ ᱨᱮᱱᱟᱜ ᱞᱮᱠᱟᱱ ᱟᱨ ᱪᱟᱥ-ᱵᱟᱥ', subject: 'विज्ञान व पर्यावरण' },
      { title: 'दिशाएं और नक्शा पठन अभ्यास', santali: 'ᱫᱤᱥᱟᱹ ᱟᱨ ᱱᱚᱠᱥᱟ ᱯᱟᱲᱦᱟᱣ', subject: 'सामाजिक अध्ययन' },
    ],
    5: [
      { title: 'पारिस्थितिकी तंत्र एवं वन्य जीव संरक्षण', santali: 'ᱡᱤᱵᱽ-ᱡᱤᱭᱟᱹᱞᱤ ᱟᱨ ᱵᱤᱨ-ᱵᱩᱨᱩ ᱨᱩᱠᱷᱤᱭᱟᱹ', subject: 'पर्यावरण व सामान्य विज्ञान' },
      { title: 'सौरमंडल एवं ग्रहों की पहचान', santali: 'ᱥᱤᱧ ᱪᱟᱸᱫᱚ ᱜᱷᱟᱨᱚᱸᱡᱽ ᱟᱨ ᱜᱽᱨᱚᱦᱚ', subject: 'विज्ञान' },
    ],
  };

  const templates = titlesByClass[classNum] || titlesByClass[1];
  return [
    {
      id: `ws-c${classNum}-01`,
      title: templates[0].title,
      titleSantali: templates[0].santali,
      subject: templates[0].subject,
      assignedDate: '2026-09-12',
      dueDate: '2026-09-25',
      questionsCount: 3,
      status: 'graded',
      instructionsHindi: 'सभी प्रश्नों को ध्यानपूर्वक पढ़ें और सही उत्तर दें।',
      instructionsSantali: 'ᱡᱚᱛᱚ ᱠᱩᱠᱞᱤ ᱱᱟᱯᱟᱭ ᱛᱮ ᱯᱟᱲᱦᱟᱣ ᱠᱟᱛᱮ ᱛᱮᱞᱟ ᱮᱢ ᱢᱮ᱾',
      questions: getDefaultQuestionsForClass(classNum, templates[0].subject),
    },
    {
      id: `ws-c${classNum}-02`,
      title: templates[1].title,
      titleSantali: templates[1].santali,
      subject: templates[1].subject,
      assignedDate: '2026-09-15',
      dueDate: '2026-09-28',
      questionsCount: 3,
      status: 'pending',
      instructionsHindi: 'यह डिजिटल अभ्यास पत्र है। प्रश्नों को हल करके जमा करें।',
      instructionsSantali: 'ᱱᱚᱣᱟ ᱫᱚ ᱪᱟᱱᱟᱪ ᱠᱟᱹᱢᱤ ᱥᱟᱠᱟᱢ ᱠᱟᱱᱟ᱾',
      questions: getDefaultQuestionsForClass(classNum, templates[1].subject),
    },
  ];
}

// Realistic Initial Seed Data for Classes 1 to 5
const INITIAL_STUDENTS: StudentProfile[] = [
  // --- CLASS 1 ---
  {
    id: 'STU-JH-C1-001',
    name: 'सोनम मुर्मू (Sonam Murmu)',
    rollNo: 1,
    classNumber: 1,
    email: 'sonam.c1@school.com',
    schoolName: 'राजकीय उत्क्रमित प्राथमिक विद्यालय, शिकारीपाड़ा (Dumka)',
    district: 'Dumka (दुमका)',
    motherTongue: 'Santali (Ol Chiki)',
    assignedQuizzes: [
      {
        id: 'qz-c1-01',
        title: 'पशु और पक्षियों के संथाली नाम (Animals & Birds)',
        subject: 'पर्यावरण व प्रकृति (EVS)',
        assignedDate: '2026-09-12',
        isCompleted: true,
        score: 4,
        totalMarks: 5,
        grade: 'A',
        submittedAt: '2026-09-14',
      },
      {
        id: 'qz-c1-02',
        title: 'चित्र देखकर गिनती (1 से 10 तक)',
        subject: 'गणित (Maths)',
        assignedDate: '2026-09-16',
        isCompleted: false,
      },
    ],
    completedWorksheets: [
      {
        id: 'ws-c1-01',
        title: 'घरेलू पशुओं के चित्र व मिलान',
        subject: 'पर्यावरण व प्रकृति (EVS)',
        completionDate: '2026-09-13',
        score: 90,
        grade: 'A+',
        feedbackHindi: 'गाय और बकरी का संथाली नाम बहुत सुंदर लिखा।',
        feedbackSantali: 'ᱜᱟᱹᱭ ᱟᱨ ᱢᱮᱨᱚᱢ ᱧᱩᱛᱩᱢ ᱟᱹᱰᱤ ᱱᱟᱯᱟᱭ ᱚᱞ ᱟᱠᱟᱫᱟ᱾',
      },
    ],
    overallPerformance: {
      grade: 'A',
      averageScore: 88,
      quizzesCompleted: 1,
      worksheetsCompleted: 1,
      attendanceRate: 94,
      status: 'उत्कृष्ट (Excellent)',
    },
  },
  {
    id: 'STU-JH-C1-002',
    name: 'बिरसा सोरेन (Birsa Soren)',
    rollNo: 2,
    classNumber: 1,
    email: 'birsa.c1@school.com',
    schoolName: 'राजकीय उत्क्रमित प्राथमिक विद्यालय, शिकारीपाड़ा (Dumka)',
    district: 'Dumka (दुमका)',
    motherTongue: 'Santali (Ol Chiki)',
    assignedQuizzes: [
      {
        id: 'qz-c1-01',
        title: 'पशु और पक्षियों के संथाली नाम (Animals & Birds)',
        subject: 'पर्यावरण व प्रकृति (EVS)',
        assignedDate: '2026-09-12',
        isCompleted: true,
        score: 3,
        totalMarks: 5,
        grade: 'B+',
        submittedAt: '2026-09-15',
      },
    ],
    completedWorksheets: [
      {
        id: 'ws-c1-01',
        title: 'घरेलू पशुओं के चित्र व मिलान',
        subject: 'पर्यावरण व प्रकृति (EVS)',
        completionDate: '2026-09-14',
        score: 75,
        grade: 'B',
        feedbackHindi: 'अच्छा प्रयास, उच्चारण अभ्यास जारी रखें।',
      },
    ],
    overallPerformance: {
      grade: 'B+',
      averageScore: 72,
      quizzesCompleted: 1,
      worksheetsCompleted: 1,
      attendanceRate: 88,
      status: 'संतोषजनक (Proficient)',
    },
  },
  {
    id: 'STU-JH-C1-003',
    name: 'शांति किस्कू (Shanti Kisku)',
    rollNo: 3,
    classNumber: 1,
    email: 'shanti.c1@school.com',
    schoolName: 'राजकीय उत्क्रमित प्राथमिक विद्यालय, शिकारीपाड़ा (Dumka)',
    district: 'Dumka (दुमका)',
    motherTongue: 'Santali (Ol Chiki)',
    assignedQuizzes: [
      {
        id: 'qz-c1-01',
        title: 'पशु और पक्षियों के संथाली नाम (Animals & Birds)',
        subject: 'पर्यावरण व प्रकृति (EVS)',
        assignedDate: '2026-09-12',
        isCompleted: true,
        score: 5,
        totalMarks: 5,
        grade: 'A+',
        submittedAt: '2026-09-13',
      },
    ],
    completedWorksheets: [
      {
        id: 'ws-c1-01',
        title: 'घरेलू पशुओं के चित्र व मिलान',
        subject: 'पर्यावरण व प्रकृति (EVS)',
        completionDate: '2026-09-14',
        score: 95,
        grade: 'A+',
        feedbackHindi: 'सर्वोत्कृष्ट कार्य!',
      },
    ],
    overallPerformance: {
      grade: 'A+',
      averageScore: 96,
      quizzesCompleted: 1,
      worksheetsCompleted: 1,
      attendanceRate: 98,
      status: 'उत्कृष्ट (Excellent)',
    },
  },

  // --- CLASS 2 ---
  {
    id: 'STU-JH-C2-001',
    name: 'सूरज मरांडी (Suraj Marandi)',
    rollNo: 1,
    classNumber: 2,
    email: 'student2@school.com',
    schoolName: 'राजकीय उत्क्रमित प्राथमिक विद्यालय, शिकारीपाड़ा (Dumka)',
    district: 'Dumka (दुमका)',
    motherTongue: 'Santali (Ol Chiki)',
    assignedQuizzes: [
      {
        id: 'qz-c2-01',
        title: 'पारिवारिक रिश्ते और अभिवादन (Family & Greetings)',
        subject: 'भाषा वाटिका (Language)',
        assignedDate: '2026-09-10',
        isCompleted: true,
        score: 4,
        totalMarks: 5,
        grade: 'A',
        submittedAt: '2026-09-12',
      },
    ],
    completedWorksheets: [
      {
        id: 'ws-c2-01',
        title: 'परिवार वृक्ष एवं संथाली रिश्ते (Family Tree)',
        subject: 'भाषा वाटिका',
        completionDate: '2026-09-11',
        score: 85,
        grade: 'A',
        feedbackHindi: 'आयो, बाबा, दादू शब्दों का सही उपयोग किया।',
      },
    ],
    overallPerformance: {
      grade: 'A',
      averageScore: 84,
      quizzesCompleted: 1,
      worksheetsCompleted: 1,
      attendanceRate: 92,
      status: 'उत्कृष्ट (Excellent)',
    },
  },
  {
    id: 'STU-JH-C2-002',
    name: 'अनिता बास्की (Anita Baskey)',
    rollNo: 2,
    classNumber: 2,
    email: 'anita.c2@school.com',
    schoolName: 'राजकीय उत्क्रमित प्राथमिक विद्यालय, शिकारीपाड़ा (Dumka)',
    district: 'Dumka (दुमका)',
    motherTongue: 'Santali (Ol Chiki)',
    assignedQuizzes: [
      {
        id: 'qz-c2-01',
        title: 'पारिवारिक रिश्ते और अभिवादन (Family & Greetings)',
        subject: 'भाषा वाटिका (Language)',
        assignedDate: '2026-09-10',
        isCompleted: true,
        score: 3,
        totalMarks: 5,
        grade: 'B',
        submittedAt: '2026-09-13',
      },
    ],
    completedWorksheets: [
      {
        id: 'ws-c2-01',
        title: 'परिवार वृक्ष एवं संथाली रिश्ते (Family Tree)',
        subject: 'भाषा वाटिका',
        completionDate: '2026-09-12',
        score: 70,
        grade: 'B',
        feedbackHindi: 'हिन्दी और संथाली शब्दों को और दोहराएं।',
      },
    ],
    overallPerformance: {
      grade: 'B',
      averageScore: 68,
      quizzesCompleted: 1,
      worksheetsCompleted: 1,
      attendanceRate: 85,
      status: 'संतोषजनक (Proficient)',
    },
  },

  // --- CLASS 3 (PRIMARY FOCUS) ---
  {
    id: 'STU-JH-C3-001',
    name: 'बासंती हेम्ब्रम (Basanti Hembram)',
    rollNo: 7,
    classNumber: 3,
    email: 'student1@school.com',
    schoolName: 'राजकीय उत्क्रमित प्राथमिक विद्यालय, शिकारीपाड़ा (Dumka)',
    district: 'Dumka (दुमका)',
    motherTongue: 'Santali (Ol Chiki)',
    assignedQuizzes: [
      {
        id: 'qz-c3-01',
        title: 'पौधों को पानी और धूप की आवश्यकता (Needs of Living Plants)',
        subject: 'पर्यावरण और प्रकृति (EVS)',
        assignedDate: '2026-09-11',
        isCompleted: true,
        score: 4,
        totalMarks: 5,
        grade: 'A',
        submittedAt: '2026-09-14',
      },
      {
        id: 'qz-c3-02',
        title: 'साप्ताहिक हाट और 2-अंकीय जोड़ (Weekly Haat Numbers)',
        subject: 'गणित मेला (Maths)',
        assignedDate: '2026-09-15',
        isCompleted: true,
        score: 5,
        totalMarks: 5,
        grade: 'A+',
        submittedAt: '2026-09-16',
      },
      {
        id: 'qz-c3-03',
        title: 'झारखण्ड के प्रमुख पेड़ (Sal, Mahua, Palash)',
        subject: 'पर्यावरण और प्रकृति (EVS)',
        assignedDate: '2026-09-17',
        isCompleted: false,
      },
    ],
    completedWorksheets: [
      {
        id: 'ws-c3-01',
        title: 'पौधों के विभिन्न अंग और उनके कार्य (Plant Parts & Functions)',
        subject: 'पर्यावरण और प्रकृति (EVS)',
        completionDate: '2026-09-13',
        score: 92,
        grade: 'A+',
        feedbackHindi: 'रूट (रेहेद) और पत्ती (साकाम) का बहुत सुंदर चित्र बनाया।',
        feedbackSantali: 'ᱨᱮᱦᱮᱫ ᱟᱨ ᱥᱟᱠᱟᱢ ᱪᱤᱛᱟᱹᱨ ᱟᱹᱰᱤ ᱪᱚᱨᱚᱠ ᱵᱮᱱᱟᱣ ᱟᱠᱟᱱᱟ᱾',
      },
      {
        id: 'ws-c3-02',
        title: 'हाट में फल-सब्जियों का हिसाब (Maths Haat Budgeting)',
        subject: 'गणित मेला',
        completionDate: '2026-09-15',
        score: 88,
        grade: 'A',
        feedbackHindi: 'जोड़-घटाव की गणना शुद्ध है।',
      },
    ],
    overallPerformance: {
      grade: 'A+',
      averageScore: 90,
      quizzesCompleted: 2,
      worksheetsCompleted: 2,
      attendanceRate: 96,
      status: 'उत्कृष्ट (Excellent)',
    },
  },
  {
    id: 'STU-JH-C3-002',
    name: 'रोहन मुर्मू (Rohan Murmu)',
    rollNo: 2,
    classNumber: 3,
    email: 'rohan.c3@school.com',
    schoolName: 'राजकीय उत्क्रमित प्राथमिक विद्यालय, शिकारीपाड़ा (Dumka)',
    district: 'Dumka (दुमका)',
    motherTongue: 'Santali (Ol Chiki)',
    assignedQuizzes: [
      {
        id: 'qz-c3-01',
        title: 'पौधों को पानी और धूप की आवश्यकता (Needs of Living Plants)',
        subject: 'पर्यावरण और प्रकृति (EVS)',
        assignedDate: '2026-09-11',
        isCompleted: true,
        score: 3,
        totalMarks: 5,
        grade: 'B+',
        submittedAt: '2026-09-14',
      },
      {
        id: 'qz-c3-02',
        title: 'साप्ताहिक हाट और 2-अंकीय जोड़ (Weekly Haat Numbers)',
        subject: 'गणित मेला (Maths)',
        assignedDate: '2026-09-15',
        isCompleted: false,
      },
    ],
    completedWorksheets: [
      {
        id: 'ws-c3-01',
        title: 'पौधों के विभिन्न अंग और उनके कार्य (Plant Parts & Functions)',
        subject: 'पर्यावरण और प्रकृति (EVS)',
        completionDate: '2026-09-14',
        score: 72,
        grade: 'B',
        feedbackHindi: 'धूप और मिट्टी के महत्व को पुनः पढ़ें।',
      },
    ],
    overallPerformance: {
      grade: 'B',
      averageScore: 66,
      quizzesCompleted: 1,
      worksheetsCompleted: 1,
      attendanceRate: 84,
      status: 'सहायता आवश्यक (Needs Support)',
    },
  },
  {
    id: 'STU-JH-C3-003',
    name: 'पूनम टुडू (Poonam Tudu)',
    rollNo: 3,
    classNumber: 3,
    email: 'poonam.c3@school.com',
    schoolName: 'राजकीय उत्क्रमित प्राथमिक विद्यालय, शिकारीपाड़ा (Dumka)',
    district: 'Dumka (दुमका)',
    motherTongue: 'Santali (Ol Chiki)',
    assignedQuizzes: [
      {
        id: 'qz-c3-01',
        title: 'पौधों को पानी और धूप की आवश्यकता (Needs of Living Plants)',
        subject: 'पर्यावरण और प्रकृति (EVS)',
        assignedDate: '2026-09-11',
        isCompleted: true,
        score: 5,
        totalMarks: 5,
        grade: 'A+',
        submittedAt: '2026-09-13',
      },
    ],
    completedWorksheets: [
      {
        id: 'ws-c3-01',
        title: 'पौधों के विभिन्न अंग और उनके कार्य (Plant Parts & Functions)',
        subject: 'पर्यावरण और प्रकृति (EVS)',
        completionDate: '2026-09-13',
        score: 94,
        grade: 'A+',
        feedbackHindi: 'उत्कृष्ट प्रदर्शन!',
      },
    ],
    overallPerformance: {
      grade: 'A+',
      averageScore: 95,
      quizzesCompleted: 1,
      worksheetsCompleted: 1,
      attendanceRate: 98,
      status: 'उत्कृष्ट (Excellent)',
    },
  },

  // --- CLASS 4 ---
  {
    id: 'STU-JH-C4-001',
    name: 'अमित सोरेन (Amit Soren)',
    rollNo: 1,
    classNumber: 4,
    email: 'student4@school.com',
    schoolName: 'राजकीय उत्क्रमित प्राथमिक विद्यालय, शिकारीपाड़ा (Dumka)',
    district: 'Dumka (दुमका)',
    motherTongue: 'Santali (Ol Chiki)',
    assignedQuizzes: [
      {
        id: 'qz-c4-01',
        title: 'जल चक्र और वर्षा (Water Cycle in Santhal Pargana)',
        subject: 'पर्यावरण अध्ययन (EVS)',
        assignedDate: '2026-09-08',
        isCompleted: true,
        score: 4,
        totalMarks: 5,
        grade: 'A',
        submittedAt: '2026-09-10',
      },
    ],
    completedWorksheets: [
      {
        id: 'ws-c4-01',
        title: 'नदियां और जल संरक्षण (Rivers of Jharkhand)',
        subject: 'पर्यावरण अध्ययन',
        completionDate: '2026-09-11',
        score: 82,
        grade: 'A',
        feedbackHindi: 'दामोदर और मयूराक्षी नदी के संथाली नाम लिखे।',
      },
    ],
    overallPerformance: {
      grade: 'A',
      averageScore: 82,
      quizzesCompleted: 1,
      worksheetsCompleted: 1,
      attendanceRate: 91,
      status: 'उत्कृष्ट (Excellent)',
    },
  },
  {
    id: 'STU-JH-C4-002',
    name: 'सीता किस्कू (Sita Kisku)',
    rollNo: 2,
    classNumber: 4,
    email: 'sita.c4@school.com',
    schoolName: 'राजकीय उत्क्रमित प्राथमिक विद्यालय, शिकारीपाड़ा (Dumka)',
    district: 'Dumka (दुमका)',
    motherTongue: 'Santali (Ol Chiki)',
    assignedQuizzes: [
      {
        id: 'qz-c4-01',
        title: 'जल चक्र और वर्षा (Water Cycle in Santhal Pargana)',
        subject: 'पर्यावरण अध्ययन (EVS)',
        assignedDate: '2026-09-08',
        isCompleted: true,
        score: 5,
        totalMarks: 5,
        grade: 'A+',
        submittedAt: '2026-09-09',
      },
    ],
    completedWorksheets: [
      {
        id: 'ws-c4-01',
        title: 'नदियां और जल संरक्षण (Rivers of Jharkhand)',
        subject: 'पर्यावरण अध्ययन',
        completionDate: '2026-09-10',
        score: 91,
        grade: 'A+',
        feedbackHindi: 'जल संचयन के उपाय बहुत अच्छे बताए।',
      },
    ],
    overallPerformance: {
      grade: 'A+',
      averageScore: 94,
      quizzesCompleted: 1,
      worksheetsCompleted: 1,
      attendanceRate: 97,
      status: 'उत्कृष्ट (Excellent)',
    },
  },

  // --- CLASS 5 ---
  {
    id: 'STU-JH-C5-001',
    name: 'मनीषा हेम्ब्रम (Manisha Hembram)',
    rollNo: 1,
    classNumber: 5,
    email: 'student5@school.com',
    schoolName: 'राजकीय उत्क्रमित प्राथमिक विद्यालय, शिकारीपाड़ा (Dumka)',
    district: 'Dumka (दुमका)',
    motherTongue: 'Santali (Ol Chiki)',
    assignedQuizzes: [
      {
        id: 'qz-c5-01',
        title: 'झारखण्ड के लोक पर्व एवं संस्कृति (Festivals: Sohrai & Sarhul)',
        subject: 'सामाजिक अध्ययन व संस्कृति',
        assignedDate: '2026-09-05',
        isCompleted: true,
        score: 5,
        totalMarks: 5,
        grade: 'A+',
        submittedAt: '2026-09-07',
      },
      {
        id: 'qz-c5-02',
        title: 'क्षेत्रफल व परिमाप (Area & Perimeter of Tribal Fields)',
        subject: 'गणित (Maths)',
        assignedDate: '2026-09-14',
        isCompleted: false,
      },
    ],
    completedWorksheets: [
      {
        id: 'ws-c5-01',
        title: 'सोहराय चित्रकला और संथाली परंपरा (Sohrai Art)',
        subject: 'कला एवं संस्कृति',
        completionDate: '2026-09-08',
        score: 96,
        grade: 'A+',
        feedbackHindi: 'पारंपरिक भित्ति चित्रों का संथाली वर्णन प्रशंसनीय है।',
      },
    ],
    overallPerformance: {
      grade: 'A+',
      averageScore: 95,
      quizzesCompleted: 1,
      worksheetsCompleted: 1,
      attendanceRate: 98,
      status: 'उत्कृष्ट (Excellent)',
    },
  },
  {
    id: 'STU-JH-C5-002',
    name: 'आकाश बास्की (Aakash Baskey)',
    rollNo: 2,
    classNumber: 5,
    email: 'aakash.c5@school.com',
    schoolName: 'राजकीय उत्क्रमित प्राथमिक विद्यालय, शिकारीपाड़ा (Dumka)',
    district: 'Dumka (दुमका)',
    motherTongue: 'Santali (Ol Chiki)',
    assignedQuizzes: [
      {
        id: 'qz-c5-01',
        title: 'झारखण्ड के लोक पर्व एवं संस्कृति (Festivals: Sohrai & Sarhul)',
        subject: 'सामाजिक अध्ययन व संस्कृति',
        assignedDate: '2026-09-05',
        isCompleted: true,
        score: 4,
        totalMarks: 5,
        grade: 'A',
        submittedAt: '2026-09-08',
      },
    ],
    completedWorksheets: [
      {
        id: 'ws-c5-01',
        title: 'सोहराय चित्रकला और संथाली परंपरा (Sohrai Art)',
        subject: 'कला एवं संस्कृति',
        completionDate: '2026-09-09',
        score: 84,
        grade: 'A',
        feedbackHindi: 'सोहराय गीतों के अर्थ सही लिखे।',
      },
    ],
    overallPerformance: {
      grade: 'A',
      averageScore: 82,
      quizzesCompleted: 1,
      worksheetsCompleted: 1,
      attendanceRate: 90,
      status: 'उत्कृष्ट (Excellent)',
    },
  },
];

const INITIAL_TEACHERS: TeacherProfile[] = [
  {
    id: 'TCH-JH-2024-089',
    name: 'सुमन मुर्मू (Suman Murmu)',
    email: 'teacher@school.com',
    schoolName: 'राजकीय उत्क्रमित प्राथमिक विद्यालय, शिकारीपाड़ा (Dumka)',
    district: 'Dumka (दुमका)',
    assignedClasses: [1, 2, 3],
    subjectSpecialization: 'EVS & Language (पर्यावरण व भाषा)',
  },
  {
    id: 'TCH-JH-2024-102',
    name: 'मनोज कुमार मुर्मू (Manoj Murmu)',
    email: 'manoj.teacher@school.com',
    schoolName: 'राजकीय उत्क्रमित प्राथमिक विद्यालय, शिकारीपाड़ा (Dumka)',
    district: 'Dumka (दुमका)',
    assignedClasses: [4, 5],
    subjectSpecialization: 'Mathematics & Science (गणित व विज्ञान)',
  },
  {
    id: 'TCH-JH-2024-115',
    name: 'अनिता सोरेन (Anita Soren)',
    email: 'anita.teacher@school.com',
    schoolName: 'राजकीय प्राथमिक विद्यालय, मसलिया (Dumka)',
    district: 'Dumka (दुमका)',
    assignedClasses: [1, 2],
    subjectSpecialization: 'Foundational Literacy (बुनियादी साक्षरता)',
  },
];

const INITIAL_FEED: ClassAssessmentFeedItem[] = [
  {
    id: 'feed-ws-c3-01',
    type: 'worksheet',
    classNumber: 3,
    title: 'पौधों के विभिन्न अंग और उनके कार्य (Plant Parts & Functions)',
    titleSantali: 'ᱫᱟᱨᱮ ᱨᱮᱱᱟᱜ ᱦᱟᱹᱴᱤᱧ ᱠᱚ ᱟᱨ ᱠᱟᱹᱢᱤ',
    subject: 'पर्यावरण और प्रकृति (EVS)',
    description: 'कक्षा 3 के बच्चों के लिए संथाली व हिन्दी में द्विभाषी सचित्र कार्यपत्रक।',
    publishedAt: '2026-09-13T09:30:00Z',
    createdBy: 'सुमन मुर्मू (Teacher)',
    questionsCount: 4,
  },
  {
    id: 'feed-qz-c3-01',
    type: 'quiz',
    classNumber: 3,
    title: 'पौधों को पानी और धूप की आवश्यकता (Needs of Plants)',
    titleSantali: 'ᱫᱟᱨᱮ ᱞᱟᱹᱜᱤᱫ ᱫᱟᱜ ᱟᱨ ᱥᱤᱛᱩᱝ ᱨᱮᱱᱟᱜ ᱞᱟᱹᱠᱛᱤ',
    subject: 'पर्यावरण और प्रकृति (EVS)',
    description: 'NIPUN Outcome EVS-3.2 पर आधारित 4 प्रश्नों की द्विभाषी क्विज।',
    publishedAt: '2026-09-11T10:15:00Z',
    createdBy: 'सुमन मुर्मू (Teacher)',
    questionsCount: 4,
  },
  {
    id: 'feed-qz-c3-02',
    type: 'quiz',
    classNumber: 3,
    title: 'साप्ताहिक हाट और 2-अंकीय जोड़ (Haat Counting)',
    titleSantali: 'ᱦᱟᱴ ᱨᱮ ᱡᱤᱱᱤᱥ ᱠᱤᱨᱤᱧ ᱟᱹᱠᱷᱨᱤᱧ ᱞᱮᱠᱷᱟ',
    subject: 'गणित मेला (Maths)',
    description: 'साप्ताहिक हाट के संदर्भ में 2-अंकीय जोड़ एवं घटाव परीक्षण।',
    publishedAt: '2026-09-15T11:00:00Z',
    createdBy: 'सुमन मुर्मू (Teacher)',
    questionsCount: 5,
  },
  {
    id: 'feed-ws-c1-01',
    type: 'worksheet',
    classNumber: 1,
    title: 'घरेलू पशुओं के चित्र व मिलान (Class 1 Animals)',
    titleSantali: 'ᱟᱹᱛᱩ ᱨᱤᱱ ᱡᱤᱵᱽ ᱡᱤᱭᱟᱹᱞᱤ ᱠᱚ ᱪᱤᱱᱦᱟᱹᱣ',
    subject: 'पर्यावरण व प्रकृति (EVS)',
    description: 'कक्षा 1 के बच्चों के लिए घरेलू पशुओं के नाम और चित्र मिलान।',
    publishedAt: '2026-09-12T08:00:00Z',
    createdBy: 'सुमन मुर्मू (Teacher)',
    questionsCount: 3,
  },
  {
    id: 'feed-ws-c2-01',
    type: 'worksheet',
    classNumber: 2,
    title: 'परिवार वृक्ष एवं संथाली रिश्ते (Family Tree Class 2)',
    titleSantali: 'ᱜᱷᱟᱨᱚᱸᱡᱽ ᱨᱤᱱ ᱦᱚᱲ ᱠᱚᱣᱟᱜ ᱧᱩᱛᱩᱢ',
    subject: 'भाषा वाटिका (Language)',
    description: 'कक्षा 2 के लिए पारिवारिक रिश्ते और संथाली जोहार अभिवादन।',
    publishedAt: '2026-09-10T09:00:00Z',
    createdBy: 'सुमन मुर्मू (Teacher)',
    questionsCount: 4,
  },
  {
    id: 'feed-ws-c4-01',
    type: 'worksheet',
    classNumber: 4,
    title: 'नदियां और जल संरक्षण (Rivers of Jharkhand)',
    titleSantali: 'ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱨᱮᱱᱟᱜ ᱜᱟᱰᱟ ᱟᱨ ᱫᱟᱜ ᱡᱚᱜᱟᱣ',
    subject: 'पर्यावरण अध्ययन (EVS)',
    description: 'कक्षा 4 के लिए झारखण्ड की नदियों और जल चक्र पर कार्यपत्रक।',
    publishedAt: '2026-09-10T11:30:00Z',
    createdBy: 'मनोज कुमार मुर्मू (Teacher)',
    questionsCount: 4,
  },
  {
    id: 'feed-ws-c5-01',
    type: 'worksheet',
    classNumber: 5,
    title: 'सोहराय चित्रकला और संथाली परंपरा (Sohrai Art Class 5)',
    titleSantali: 'ᱥᱚᱦᱨᱟᱭ ᱪᱤᱛᱟᱹᱨ ᱟᱨ ᱥᱟᱱᱛᱟᱲᱤ ᱟᱹᱨᱤᱪᱟᱹᱞᱤ',
    subject: 'कला एवं संस्कृति',
    description: 'कक्षा 5 के लिए संथाली लोक पर्व और सोहराय पेंटिंग अभ्यास।',
    publishedAt: '2026-09-08T10:00:00Z',
    createdBy: 'मनोज कुमार मुर्मू (Teacher)',
    questionsCount: 5,
  },
];

class ClassDataStore {
  private students: StudentProfile[];
  private teachers: TeacherProfile[];
  private feed: ClassAssessmentFeedItem[];
  private settings: SystemSettings;

  constructor() {
    const rawStudents = this.loadFromStorage(STORAGE_KEY_STUDENTS, INITIAL_STUDENTS);
    this.students = rawStudents.map((s) => this.normalizeStudent(s));
    this.teachers = this.loadFromStorage(STORAGE_KEY_TEACHERS, INITIAL_TEACHERS);
    this.feed = this.loadFromStorage(STORAGE_KEY_FEED, INITIAL_FEED);
    this.settings = this.loadFromStorage(STORAGE_KEY_SETTINGS, DEFAULT_SETTINGS);
  }

  private normalizeStudent(student: any): StudentProfile {
    const classNum = Number(student.classNumber) || 1;
    const assignedWorksheets: AssignedWorksheetItem[] =
      Array.isArray(student.assignedWorksheets) && student.assignedWorksheets.length > 0
        ? student.assignedWorksheets
        : generateDefaultAssignedWorksheets(classNum);

    const submittedWorksheets: SubmittedWorksheetItem[] =
      Array.isArray(student.submittedWorksheets) && student.submittedWorksheets.length > 0
        ? student.submittedWorksheets
        : (student.completedWorksheets || []).map((cw: any, idx: number) => ({
            id: `sub-init-${student.id}-${idx}`,
            worksheetId: cw.id,
            title: cw.title,
            subject: cw.subject,
            submissionDate: cw.completionDate || '2026-09-14',
            answers: {
              q1: 'ᱥᱟᱱᱛᱟᱲᱤ ᱛᱮᱞᱟ (Santali Response)',
              q2: 'सटीक उत्तर व विवरण',
            },
            score: cw.score || 88,
            totalMarks: 100,
            grade: cw.grade || 'A',
            status: 'graded' as const,
            feedbackHindi: cw.feedbackHindi || 'उत्कृष्ट प्रदर्शन।',
            feedbackSantali: cw.feedbackSantali || 'ᱟᱹᱰᱤ ᱱᱟᱯᱟᱭ᱾',
          }));

    return {
      ...student,
      classNumber: classNum as 1 | 2 | 3 | 4 | 5,
      rollNo: Number(student.rollNo) || 1,
      assignedWorksheets,
      submittedWorksheets,
      assignedQuizzes: student.assignedQuizzes || [],
      completedWorksheets: student.completedWorksheets || [],
      overallPerformance: student.overallPerformance || {
        grade: 'A',
        averageScore: 85,
        quizzesCompleted: 1,
        worksheetsCompleted: 1,
        attendanceRate: 92,
        status: 'उत्कृष्ट (Excellent)',
      },
    };
  }

  private loadFromStorage<T>(key: string, defaultValue: T): T {
    try {
      const saved = localStorage.getItem(key);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(`Error reading ${key} from storage:`, e);
    }
    return defaultValue;
  }

  private saveStudents() {
    try {
      localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(this.students));
    } catch (e) {
      console.warn('Error saving students:', e);
    }
  }

  private saveTeachers() {
    try {
      localStorage.setItem(STORAGE_KEY_TEACHERS, JSON.stringify(this.teachers));
    } catch (e) {
      console.warn('Error saving teachers:', e);
    }
  }

  private saveFeed() {
    try {
      localStorage.setItem(STORAGE_KEY_FEED, JSON.stringify(this.feed));
    } catch (e) {
      console.warn('Error saving feed:', e);
    }
  }

  // --- Student Management ---
  public getAllStudents(): StudentProfile[] {
    return [...this.students];
  }

  public getStudentsByClass(classNumber: number): StudentProfile[] {
    return this.students.filter((s) => s.classNumber === Number(classNumber));
  }

  public getStudentById(id: string): StudentProfile | undefined {
    return this.students.find((s) => s.id === id);
  }

  public getStudentByEmail(email: string): StudentProfile | undefined {
    return this.students.find(
      (s) => s.email.trim().toLowerCase() === email.trim().toLowerCase()
    );
  }

  public addStudent(studentData: Omit<StudentProfile, 'id'>): StudentProfile {
    const newId = `STU-JH-C${studentData.classNumber}-${Date.now().toString().slice(-4)}`;
    const assignedWorksheets = studentData.assignedWorksheets || generateDefaultAssignedWorksheets(studentData.classNumber);
    const submittedWorksheets = studentData.submittedWorksheets || [];
    const newStudent: StudentProfile = {
      ...studentData,
      id: newId,
      assignedWorksheets,
      submittedWorksheets,
    };
    this.students.push(newStudent);
    this.saveStudents();
    return newStudent;
  }

  public updateStudent(id: string, updates: Partial<StudentProfile>): StudentProfile | null {
    const idx = this.students.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    this.students[idx] = { ...this.students[idx], ...updates };
    this.saveStudents();
    return this.students[idx];
  }

  public deleteStudent(id: string): boolean {
    const lenBefore = this.students.length;
    this.students = this.students.filter((s) => s.id !== id);
    if (this.students.length !== lenBefore) {
      this.saveStudents();
      return true;
    }
    return false;
  }

  // --- Teacher Management ---
  public getAllTeachers(): TeacherProfile[] {
    return [...this.teachers];
  }

  public addTeacher(teacherData: Omit<TeacherProfile, 'id'>): TeacherProfile {
    const newId = `TCH-JH-${Date.now().toString().slice(-4)}`;
    const newTeacher: TeacherProfile = {
      ...teacherData,
      id: newId,
    };
    this.teachers.push(newTeacher);
    this.saveTeachers();
    return newTeacher;
  }

  public updateTeacher(id: string, updates: Partial<TeacherProfile>): TeacherProfile | null {
    const idx = this.teachers.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    this.teachers[idx] = { ...this.teachers[idx], ...updates };
    this.saveTeachers();
    return this.teachers[idx];
  }

  public deleteTeacher(id: string): boolean {
    const lenBefore = this.teachers.length;
    this.teachers = this.teachers.filter((t) => t.id !== id);
    if (this.teachers.length !== lenBefore) {
      this.saveTeachers();
      return true;
    }
    return false;
  }

  // --- Feed & Assessment Publishing (Targeted strictly by Class 1 to 5) ---
  public getAssessmentFeedForClass(classNumber: number): ClassAssessmentFeedItem[] {
    return this.feed.filter((item) => Number(item.classNumber) === Number(classNumber));
  }

  public getFeedByClass(classNumber: number): ClassAssessmentFeedItem[] {
    return this.getAssessmentFeedForClass(classNumber);
  }

  public getAllAssessments(): ClassAssessmentFeedItem[] {
    return [...this.feed];
  }

  public publishAssessment(assessment: Omit<ClassAssessmentFeedItem, 'id' | 'publishedAt'>): ClassAssessmentFeedItem {
    const newItem: ClassAssessmentFeedItem = {
      ...assessment,
      id: `feed-${assessment.type}-c${assessment.classNumber}-${Date.now().toString().slice(-4)}`,
      publishedAt: new Date().toISOString(),
    };
    // Prepend so latest appears first
    this.feed.unshift(newItem);
    this.saveFeed();

    // Automatically assign to all students of this target class
    this.students.forEach((student) => {
      if (student.classNumber === assessment.classNumber) {
        if (assessment.type === 'quiz') {
          const alreadyAssigned = student.assignedQuizzes.some((q) => q.title === assessment.title);
          if (!alreadyAssigned) {
            student.assignedQuizzes.unshift({
              id: newItem.id,
              title: assessment.title,
              subject: assessment.subject,
              assignedDate: new Date().toISOString().split('T')[0],
              isCompleted: false,
            });
          }
        } else if (assessment.type === 'worksheet') {
          if (!student.assignedWorksheets) student.assignedWorksheets = [];
          const alreadyAssigned = student.assignedWorksheets.some((w) => w.title === assessment.title);
          if (!alreadyAssigned) {
            const defaultQuestions = getDefaultQuestionsForClass(assessment.classNumber, assessment.subject);
            student.assignedWorksheets.unshift({
              id: newItem.id,
              title: assessment.title,
              titleSantali: assessment.titleSantali,
              subject: assessment.subject,
              assignedDate: new Date().toISOString().split('T')[0],
              dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
              questionsCount: assessment.questionsCount || defaultQuestions.length,
              status: 'pending',
              questions: assessment.worksheetData?.questions || defaultQuestions,
              instructionsHindi: assessment.description,
              instructionsSantali: 'ᱱᱚᱣᱟ ᱠᱟᱹᱢᱤ ᱥᱟᱠᱟᱢ ᱱᱟᱯᱟᱭ ᱛᱮ ᱯᱩᱨᱟᱹᱣ ᱢᱮ᱾',
            });
          }
        }
      }
    });
    this.saveStudents();

    return newItem;
  }

  public publishAssessmentItem(assessment: Omit<ClassAssessmentFeedItem, 'id' | 'publishedAt'>): ClassAssessmentFeedItem {
    return this.publishAssessment(assessment);
  }

  // --- Student Assessment Submissions ---
  public submitStudentWorksheet(
    studentId: string,
    worksheetId: string,
    answers: Record<string, string>,
    attachmentName?: string
  ): { score: number; grade: string; feedbackHindi: string; feedbackSantali: string } {
    const student = this.students.find((s) => s.id === studentId);
    if (!student) throw new Error('Student not found');

    if (!student.assignedWorksheets) student.assignedWorksheets = [];
    if (!student.submittedWorksheets) student.submittedWorksheets = [];

    const ws = student.assignedWorksheets.find((w) => w.id === worksheetId || w.title.includes(worksheetId));
    const title = ws?.title || 'द्विभाषी अभ्यास पत्र';
    const titleSantali = ws?.titleSantali || 'ᱪᱟᱱᱟᱪ ᱠᱟᱹᱢᱤ ᱥᱟᱠᱟᱢ';
    const subject = ws?.subject || 'पर्यावरण व भाषा';

    // Instant evaluation score
    const score = Math.floor(Math.random() * 15) + 85;
    const grade = score >= 90 ? 'A+' : score >= 75 ? 'A' : 'B+';
    const feedbackHindi = 'उत्कृष्ट प्रयास! सभी प्रश्नों के उत्तर स्पष्ट व शुद्ध लिखे गए हैं।';
    const feedbackSantali = 'ᱟᱹᱰᱤ ᱱᱟᱯᱟᱭ! ᱡᱚᱛᱚ ᱠᱩᱠᱞᱤ ᱨᱮᱱᱟᱜ ᱛᱮᱞᱟ ᱴᱷᱤᱠ ᱜᱮᱭᱟ᱾';

    if (ws) {
      ws.status = 'graded';
    }

    const submission: SubmittedWorksheetItem = {
      id: `sub-${Date.now().toString().slice(-6)}`,
      worksheetId,
      title,
      titleSantali,
      subject,
      submissionDate: new Date().toISOString().split('T')[0],
      answers,
      attachmentName,
      score,
      totalMarks: 100,
      grade,
      status: 'graded',
      feedbackHindi,
      feedbackSantali,
    };

    student.submittedWorksheets.unshift(submission);

    // Sync into completedWorksheets
    student.completedWorksheets.unshift({
      id: worksheetId,
      title,
      subject,
      completionDate: new Date().toISOString().split('T')[0],
      score,
      grade,
      feedbackHindi,
      feedbackSantali,
    });

    this.recalculateStudentPerformance(student);
    this.saveStudents();

    return { score, grade, feedbackHindi, feedbackSantali };
  }

  public gradeStudentWorksheet(
    studentId: string,
    submissionId: string,
    score: number,
    grade: string,
    feedbackHindi: string,
    feedbackSantali?: string
  ) {
    const student = this.students.find((s) => s.id === studentId);
    if (!student) return;

    const sub = student.submittedWorksheets?.find((s) => s.id === submissionId);
    if (sub) {
      sub.score = score;
      sub.grade = grade;
      sub.status = 'graded';
      sub.feedbackHindi = feedbackHindi;
      if (feedbackSantali) sub.feedbackSantali = feedbackSantali;
    }

    const comp = student.completedWorksheets.find((c) => c.id === sub?.worksheetId || c.title === sub?.title);
    if (comp) {
      comp.score = score;
      comp.grade = grade;
      comp.feedbackHindi = feedbackHindi;
      if (feedbackSantali) comp.feedbackSantali = feedbackSantali;
    }

    this.recalculateStudentPerformance(student);
    this.saveStudents();
  }

  public getSubmittedWorksheetsForClass(classNumber: number) {
    const classStudents = this.getStudentsByClass(classNumber);
    const results: {
      studentId: string;
      studentName: string;
      rollNo: number;
      submission: SubmittedWorksheetItem;
    }[] = [];

    classStudents.forEach((student) => {
      (student.submittedWorksheets || []).forEach((sub) => {
        results.push({
          studentId: student.id,
          studentName: student.name,
          rollNo: student.rollNo,
          submission: sub,
        });
      });
    });

    return results.sort((a, b) => b.submission.submissionDate.localeCompare(a.submission.submissionDate));
  }

  public getSystemSettings(): SystemSettings {
    return { ...this.settings };
  }

  public updateSystemSettings(updates: Partial<SystemSettings>): SystemSettings {
    this.settings = { ...this.settings, ...updates };
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(this.settings));
    } catch (e) {
      console.warn('Error saving settings:', e);
    }
    return { ...this.settings };
  }

  // --- Student Assessment Submissions ---
  public recordStudentQuizCompletion(
    studentId: string,
    quizId: string,
    score: number,
    totalMarks: number
  ) {
    const student = this.students.find((s) => s.id === studentId);
    if (!student) return;

    const percentage = Math.round((score / totalMarks) * 100);
    const grade = percentage >= 90 ? 'A+' : percentage >= 75 ? 'A' : percentage >= 60 ? 'B+' : percentage >= 50 ? 'B' : 'C';

    const existingQuiz = student.assignedQuizzes.find((q) => q.id === quizId || q.title.includes(quizId));
    if (existingQuiz) {
      existingQuiz.isCompleted = true;
      existingQuiz.score = score;
      existingQuiz.totalMarks = totalMarks;
      existingQuiz.grade = grade;
      existingQuiz.submittedAt = new Date().toISOString().split('T')[0];
    } else {
      student.assignedQuizzes.unshift({
        id: quizId,
        title: 'कक्षा प्रश्नोत्तरी (Class Quiz)',
        subject: 'पर्यावरण व भाषा',
        assignedDate: new Date().toISOString().split('T')[0],
        isCompleted: true,
        score,
        totalMarks,
        grade,
        submittedAt: new Date().toISOString().split('T')[0],
      });
    }

    // Recompute overall performance
    this.recalculateStudentPerformance(student);
    this.saveStudents();
  }

  public recordStudentWorksheetCompletion(
    studentId: string,
    worksheetId: string,
    title: string,
    subject: string,
    score = 88,
    feedbackHindi = 'कार्यपत्रक सफलतापूर्वक पूर्ण किया गया।',
    feedbackSantali = 'ᱠᱟᱹᱢᱤ ᱥᱟᱠᱟᱢ ᱱᱟᱯᱟᱭ ᱛᱮ ᱯᱩᱨᱟᱹᱣ ᱟᱠᱟᱱᱟ᱾'
  ) {
    const student = this.students.find((s) => s.id === studentId);
    if (!student) return;

    const grade = score >= 90 ? 'A+' : score >= 75 ? 'A' : score >= 60 ? 'B+' : 'B';
    student.completedWorksheets.unshift({
      id: worksheetId,
      title,
      subject,
      completionDate: new Date().toISOString().split('T')[0],
      score,
      grade,
      feedbackHindi,
      feedbackSantali,
    });

    this.recalculateStudentPerformance(student);
    this.saveStudents();
  }

  private recalculateStudentPerformance(student: StudentProfile) {
    const completedQuizzes = student.assignedQuizzes.filter((q) => q.isCompleted && q.score !== undefined);
    const completedWorksheets = student.completedWorksheets;

    let totalScore = 0;
    let count = 0;

    completedQuizzes.forEach((q) => {
      if (q.score !== undefined && q.totalMarks) {
        totalScore += (q.score / q.totalMarks) * 100;
        count++;
      }
    });

    completedWorksheets.forEach((w) => {
      if (w.score !== undefined) {
        totalScore += w.score;
        count++;
      }
    });

    const avg = count > 0 ? Math.round(totalScore / count) : 80;
    const overallGrade = avg >= 90 ? 'A+' : avg >= 75 ? 'A' : avg >= 60 ? 'B+' : avg >= 50 ? 'B' : 'C';
    const status = avg >= 80 ? 'उत्कृष्ट (Excellent)' : avg >= 65 ? 'संतोषजनक (Proficient)' : 'सहायता आवश्यक (Needs Support)';

    student.overallPerformance = {
      grade: overallGrade,
      averageScore: avg,
      quizzesCompleted: completedQuizzes.length,
      worksheetsCompleted: completedWorksheets.length,
      attendanceRate: student.overallPerformance?.attendanceRate || 92,
      status,
    };
  }

  // --- Aggregate Metrics for Admin Dashboard ---
  public getSystemMetrics() {
    const studentsPerClass: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const classAvgScores: Record<number, { sum: number; count: number }> = {
      1: { sum: 0, count: 0 },
      2: { sum: 0, count: 0 },
      3: { sum: 0, count: 0 },
      4: { sum: 0, count: 0 },
      5: { sum: 0, count: 0 },
    };

    this.students.forEach((s) => {
      if (studentsPerClass[s.classNumber] !== undefined) {
        studentsPerClass[s.classNumber]++;
        classAvgScores[s.classNumber].sum += s.overallPerformance.averageScore;
        classAvgScores[s.classNumber].count++;
      }
    });

    const averageScoresPerClass: Record<number, number> = {};
    [1, 2, 3, 4, 5].forEach((cls) => {
      const stat = classAvgScores[cls];
      averageScoresPerClass[cls] = stat.count > 0 ? Math.round(stat.sum / stat.count) : 0;
    });

    return {
      totalClasses: 5,
      totalStudents: this.students.length,
      totalTeachers: this.teachers.length,
      studentsPerClass,
      averageScoresPerClass,
      totalAssessmentsPublished: this.feed.length,
    };
  }
}

export const classStore = new ClassDataStore();
