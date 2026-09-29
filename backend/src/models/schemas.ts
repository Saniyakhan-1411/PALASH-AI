/**
 * PALASH AI - MongoDB Atlas Mongoose Schemas
 * Jharkhand Mother Tongue-Based Primary Education
 * Contains the 16 core collections with indexing for low-resource environments.
 */

export const MongoDBSchemas = {
  User: {
    name: 'User',
    fields: {
      teacherId: { type: 'String', unique: true, index: true },
      name: { type: 'String', required: true },
      role: { type: 'String', enum: ['teacher', 'headmaster', 'admin'], default: 'teacher' },
      schoolId: { type: 'String', required: true, index: true },
      district: { type: 'String', required: true },
      block: { type: 'String', required: true },
      assignedClasses: [{ type: 'Number' }],
      motherTongue: { type: 'String', default: 'sat_Olck' },
      phone: { type: 'String' },
      passwordHash: { type: 'String', required: true },
    },
    indexes: [{ schoolId: 1, district: 1 }],
  },

  School: {
    name: 'School',
    fields: {
      schoolId: { type: 'String', unique: true, index: true },
      name: { type: 'String', required: true },
      district: { type: 'String', required: true },
      block: { type: 'String', required: true },
      totalStudents: { type: 'Number', default: 0 },
      hasSolarPower: { type: 'Boolean', default: false },
      hasInternetAccess: { type: 'Boolean', default: false },
    },
    indexes: [{ district: 1, block: 1 }],
  },

  Curriculum: {
    name: 'Curriculum',
    fields: {
      curriculumId: { type: 'String', unique: true, index: true },
      classNumber: { type: 'Number', required: true, index: true },
      subject: { type: 'String', required: true },
      stateCouncil: { type: 'String', default: 'JCERT Jharkhand' },
      academicYear: { type: 'String', default: '2024-2025' },
      alignedFramework: { type: 'String', default: 'NIPUN Bharat' },
    },
  },

  Lesson: {
    name: 'Lesson',
    fields: {
      lessonId: { type: 'String', unique: true, index: true },
      classNumber: { type: 'Number', index: true },
      subject: { type: 'String' },
      chapterNumber: { type: 'Number' },
      topic: { type: 'String' },
      topicHindi: { type: 'String' },
      learningOutcomes: [{ code: 'String', nipunCode: 'String', description: 'String' }],
      keyVocabulary: [{ hindi: 'String', santaliOlChiki: 'String', santaliDevanagari: 'String' }],
    },
    indexes: [{ classNumber: 1, subject: 1 }],
  },

  Worksheet: {
    name: 'Worksheet',
    fields: {
      worksheetId: { type: 'String', unique: true, index: true },
      teacherId: { type: 'String', index: true },
      classNumber: { type: 'Number' },
      subject: { type: 'String' },
      topic: { type: 'String' },
      nipunOutcomeCode: { type: 'String' },
      questions: [{ questionHindi: 'String', questionSantali: 'String', sampleAnswerHindi: 'String' }],
      createdAt: { type: 'Date', default: 'Date.now' },
    },
  },

  Flashcard: {
    name: 'Flashcard',
    fields: {
      cardId: { type: 'String', unique: true, index: true },
      topic: { type: 'String', index: true },
      hindiWord: { type: 'String', required: true },
      santaliWordOlChiki: { type: 'String', required: true },
      santaliWordDeva: { type: 'String' },
      englishMeaning: { type: 'String' },
      learningOutcomeCode: { type: 'String' },
    },
  },

  Quiz: {
    name: 'Quiz',
    fields: {
      quizId: { type: 'String', unique: true, index: true },
      classNumber: { type: 'Number', index: true },
      subject: { type: 'String' },
      topic: { type: 'String' },
      learningOutcomeCode: { type: 'String' },
      questions: [
        {
          questionHindi: 'String',
          questionSantali: 'String',
          optionsHindi: ['String'],
          optionsSantali: ['String'],
          correctAnswerIndex: 'Number',
        },
      ],
      createdAt: { type: 'Date', default: 'Date.now' },
    },
  },

  QuizAttempt: {
    name: 'QuizAttempt',
    fields: {
      attemptId: { type: 'String', unique: true, index: true },
      studentId: { type: 'String', index: true },
      quizId: { type: 'String', index: true },
      score: { type: 'Number' },
      totalQuestions: { type: 'Number' },
      percentage: { type: 'Number' },
      isOffline: { type: 'Boolean', default: false },
      completedAt: { type: 'Date', default: 'Date.now' },
      syncedAt: { type: 'Date' },
    },
    indexes: [{ studentId: 1, completedAt: -1 }],
  },

  StudentProgress: {
    name: 'StudentProgress',
    fields: {
      studentId: { type: 'String', unique: true, index: true },
      studentName: { type: 'String' },
      classNumber: { type: 'Number' },
      totalQuizzesTaken: { type: 'Number' },
      averageScore: { type: 'Number' },
      strongConcepts: [{ type: 'String' }],
      weakConcepts: [{ type: 'String' }],
      lastUpdated: { type: 'Date', default: 'Date.now' },
    },
  },

  ConceptGap: {
    name: 'ConceptGap',
    fields: {
      studentId: { type: 'String', index: true },
      learningOutcomeCode: { type: 'String', index: true },
      topicName: { type: 'String' },
      accuracyRate: { type: 'Number' },
      weaknessSeverity: { type: 'String', enum: ['high', 'medium', 'low'] },
      identifiedGapsHindi: { type: 'String' },
      identifiedGapsSantali: { type: 'String' },
      recommendedPedagogyHindi: { type: 'String' },
      recommendedPedagogySantali: { type: 'String' },
      lastAssessed: { type: 'Date', default: 'Date.now' },
    },
    indexes: [{ studentId: 1, learningOutcomeCode: 1 }],
  },

  TranslationRequest: {
    name: 'TranslationRequest',
    fields: {
      requestId: { type: 'String', unique: true, index: true },
      sourceText: { type: 'String', required: true },
      sourceLang: { type: 'String', default: 'hin_Deva' },
      targetLang: { type: 'String', default: 'sat_Olck' },
      translatedText: { type: 'String' },
      transliteration: { type: 'String' },
      asrLatencyMs: { type: 'Number' },
      mtLatencyMs: { type: 'Number' },
      totalLatencyMs: { type: 'Number' },
      timestamp: { type: 'Date', default: 'Date.now' },
    },
  },

  VoiceSession: {
    name: 'VoiceSession',
    fields: {
      sessionId: { type: 'String', unique: true, index: true },
      teacherId: { type: 'String', index: true },
      classNumber: { type: 'Number' },
      lessonId: { type: 'String' },
      durationSeconds: { type: 'Number' },
      totalUtterances: { type: 'Number' },
      averageLatencyMs: { type: 'Number' },
      startedAt: { type: 'Date', default: 'Date.now' },
    },
  },

  SyncRecord: {
    name: 'SyncRecord',
    fields: {
      syncId: { type: 'String', unique: true, index: true },
      deviceId: { type: 'String', index: true },
      actionType: { type: 'String' },
      payload: { type: 'Object' },
      clientTimestamp: { type: 'Date' },
      serverReceivedAt: { type: 'Date', default: 'Date.now' },
      status: { type: 'String', enum: ['synced', 'conflict', 'failed'] },
    },
    indexes: [{ deviceId: 1, serverReceivedAt: -1 }],
  },
};
