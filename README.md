# 🌱 PALASH AI

### AI-Powered Vernacular Pedagogy and Real-Time Translation for Mother-Tongue-Based Primary Education

> **Learn in the language you understand. Teach in the language you know.**

PALASH AI is a multilingual AI education platform designed to help primary-school teachers teach students in their **mother tongue**, especially in multilingual and low-connectivity classrooms.

It connects existing educational content with **AI translation, speech processing, bilingual learning materials, offline learning, and teacher insights**.

The platform is designed for classrooms where a teacher may know Hindi or English while students understand a regional or tribal language better.

---

## 🎯 The Problem

Language can become a barrier to learning.

In many multilingual classrooms:

- Teachers are trained mainly in Hindi or English.
- Students may understand concepts better in their mother tongue.
- Educational content is not always available in local languages.
- Teachers may not have the time or resources to translate every lesson.
- Internet connectivity can be limited in rural and tribal areas.
- Teachers have limited tools to identify where students are struggling.

This creates a simple but important problem:

> **The teacher knows the subject, but the language of instruction may not be the language in which every child learns best.**

PALASH AI is designed to reduce this gap.

---

# 💡 Our Solution

PALASH AI turns existing educational content into a **multilingual, voice-enabled learning experience**.

### Teacher

**Select → Speak → Translate → Teach → Assess → Improve**

### Student

**Listen → Understand → Practice → Respond → Learn**

A teacher can select a class, subject, and target language, then use PALASH AI to translate learning content and classroom instructions into a supported mother tongue.

The platform also supports learning activities, worksheets, quizzes, progress tracking, and offline learning.

---

# 🌍 Supported Language Direction

### Current prototype focus

**Hindi → Santhali**

### Architecture designed for expansion

- Hindi → Ho
- Hindi → Mundari
- Hindi → Santhali
- English → supported regional languages
- Additional Indian languages can be added through the language engine

The architecture separates language resources from the core application so that new languages can be added without rebuilding the complete platform.

---

# 🚀 What Makes PALASH AI Different

PALASH AI is not designed as a simple translation app.

It is a **complete multilingual AI education ecosystem** connecting:

**Education Content + Translation + Voice + Practice + Analytics + Offline Learning**

### Four core pillars

| Pillar | What PALASH AI provides |
|---|---|
| 📚 Learn | Mother-tongue learning, lessons, audio and offline access |
| 🌐 Translate | AI translation, speech-to-text, text-to-speech and voice translation |
| ✏️ Practice | Worksheets, quizzes, flashcards and learning activities |
| 📊 Empower | Teacher dashboard, learning insights and AI-assisted support |

---

# ⭐ Key Features

## 1. AI-Powered Translation

Convert educational content from Hindi/English into supported mother-tongue languages.

**Flow:**

```text
Source Content
      ↓
AI Translation
      ↓
Language Processing
      ↓
Target Language Text
      ↓
Target Language Audio
---

## 🏗️ System Architecture

```
┌──────────────────┐     ┌──────────────────────┐     ┌──────────────┐
│  Mobile App      │     │  Teacher Web Dashboard│     │  Admin Panel │
│  (React Native)  │     │  (React + Vite)       │     │  (React+Vite)│
└────────┬─────────┘     └──────────┬───────────┘     └──────┬───────┘
         │                          │                         │
         └──────────────────────────▼─────────────────────────┘
                          Backend API (Node.js + Express.js)
                    ┌──────────────────────────────────────────┐
                    │  RESTful APIs │ Socket.IO │ Auth & RBAC  │
                    │  File & Media Handling │ Sync Manager    │
                    └──────────────────┬───────────────────────┘
                                       │
                    ┌──────────────────▼───────────────────────┐
                    │         AI Service (Python FastAPI)       │
                    │  Speech-to-Text │ Translation Engine      │
                    │  Text-to-Speech │ LLM/NLP Services        │
                    └──────────────────┬───────────────────────┘
                                       │
                    ┌──────────────────▼───────────────────────┐
                    │         MongoDB Atlas (Database)          │
                    │  Users, Lessons, Translations, Quizzes,  │
                    │  Progress, Feedback, Language Bank        │
                    └──────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend — Mobile
| Tool | Purpose |
|------|---------|
| React Native (Expo) | Cross-platform mobile app |
| Redux Toolkit | State management |
| React Navigation | In-app navigation |
| Expo SQLite | Offline local database |

### Frontend — Web
| Tool | Purpose |
|------|---------|
| React + Vite | Fast web dashboard |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| shadcn/ui | Component library |
| Recharts | Analytics charts |

### Backend
| Tool | Purpose |
|------|---------|
| Node.js + Express.js | API server |
| TypeScript | Type safety |
| Socket.IO | Real-time communication |
| JWT Auth | Authentication |
| Multer | File uploads |
| Swagger | API documentation |

### AI Service
| Tool | Purpose |
|------|---------|
| Python + FastAPI | AI microservice |
| Pydantic | Data validation |
| Uvicorn | ASGI server |

### Database & Storage
| Tool | Purpose |
|------|---------|
| MongoDB Atlas | Primary database |
| Mongoose ODM | Database modeling |
| Firebase Cloud | Push notifications |
| Cloudinary | Media storage |

### AI/ML & Language Services
| Service | Purpose |
|---------|---------|
| Bhashini / AI4Bharat | ASR, TTS, Translation (Indian languages) |
| Whisper / Indic ASR | Speech recognition |
| Coqui TTS / Indic TTS | Voice synthesis |
| NLP & LLM (Gemini / Mistral / LLaMA) | Worksheets, Quiz, Gap Analysis |
| Custom Models | Ho, Mundari, Santhali support |

### DevOps & Tools
| Tool | Purpose |
|------|---------|
| Git & GitHub | Version control |
| Docker | Containerization |
| CI/CD (GitHub Actions) | Automated deployment |
| NGINX | Reverse proxy |
| Sentry | Error monitoring |
| Postman | API testing |

---

## 🌐 Language Engine Support

PALASH AI supports three tribal languages natively:

| Language | ASR | TTS | Translation |
|----------|-----|-----|-------------|
| **Ho** | ✅ | ✅ | ✅ (Hindi → Ho) |
| **Mundari** | ✅ | ✅ | ✅ (Hindi → Mundari) |
| **Santhali** | ✅ | ✅ | ✅ (Hindi → Santhali) |

---

## 📱 User Flow

```
1. Onboarding → Select Role (Teacher / Student)
2. Login / Register → JWT Authentication
3. Select Class & Language (Hindi → Ho / Mundari / Santhali)
4. Home Dashboard → Lessons, Activities, Progress
5. Start Learning → Voice / Text / Image input
6. AI Processing → ASR → Translation → TTS
7. Learning Activities → Worksheet / Flashcard / Quiz
8. Progress Tracking → Scores, Badges, Streaks
9. Offline Mode → Learn without internet
10. Sync When Online → Upload progress & data
11. Teacher Dashboard → Reports, Analytics, Learning Gaps
```

---

## 📦 All Features & Modules

### Core Modules (Mandatory)
| # | Module |
|---|--------|
| 1 | User & Role Management |
| 2 | Language & Class Selection |
| 3 | Curriculum Library |
| 4 | AI Translation (Text) |
| 5 | Speech-to-Text (ASR) |
| 6 | Text-to-Speech (TTS) |
| 7 | Real-Time Voice Translation |
| 8 | Worksheet Generator |
| 9 | Flashcard Generator |
| 10 | Quiz & Assessment |
| 11 | Offline Mode & Local Storage |
| 12 | Teacher & Admin Dashboard |

### Additional Unique Modules
| # | Module | Why It Matters |
|---|--------|---------------|
| 13 | AI Learning Gap Detector | Identifies where each student is falling behind |
| 14 | Remedial Learning & Smart Suggestions | Auto-suggests content based on weak areas |
| 15 | Teacher AI Co-pilot | Assists teachers in real time |
| 16 | Pronunciation Coach | Helps students speak correctly |
| 17 | Image-to-Language Learning | Visual learning with AI descriptions |
| 18 | Gamified Learning System | Badges, streaks, and points to keep students engaged |
| 19 | Community Language Knowledge Bank | Crowd-sourced vocabulary and corrections |
| 20 | Human-in-the-Loop Verification | Experts validate AI-generated translations |
| 21 | Smart Low-Bandwidth Mode | Works on slow 2G/3G connections |
| 22 | Classroom Mode (Multi-student) | One device, multiple students |
| 23 | Personalized Learning Path | AI-curated content per student |
| 24 | Advanced Analytics & Impact Reports | School and district-level data |
| 25 | Multi-device Sync & Conflict Resolution | Seamless sync across devices |

---

## 📴 Offline-First Architecture

PALASH AI is built for rural India where internet access is unreliable.

```
ONLINE                    LOCAL DEVICE (SQLite)          OFFLINE
─────────────────────     ─────────────────────────      ──────────────────
Download:                 Cache:                         Access:
• Lessons                 • Lesson Cache                 • Play Lessons
• Translations            • Audio Cache                  • Take Quiz
• Audio Files             • Progress Data                • Save Progress
• Worksheets              • Quiz Results
• Language Resources      • Sync Queue
         │                        │                             │
         └────────────────────────┴─────────────────────────────┘
                                  │
                     SYNC PROCESS (When Online)
                     Upload Pending Data → Server Processing
                     → Download Updates → Sync Complete ✅
```

**Sync Success Rate Target: ≥ 98%**

---

## 🗄️ Database Structure (MongoDB Collections)

```
users          schools        classes        students
lessons        translated_contents  audio_assets  worksheets
flashcards     quizzes        quiz_results   progress
feedback       language_bank  sync_queue     notifications
learning_gaps  remedial_activities  audit_logs  model_versions
```

---

## 🔗 Key API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User Login |
| GET | `/api/lessons` | Get Lesson List |
| POST | `/api/translate` | Text Translation |
| POST | `/api/speech/transcribe` | Speech-to-Text |
| POST | `/api/speech/synthesize` | Text-to-Speech |
| POST | `/api/voice/translate` | Voice Translation |
| POST | `/api/worksheets/generate` | Generate Worksheet |
| POST | `/api/quizzes/generate` | Generate Quiz |
| POST | `/api/progress/sync` | Sync Progress Data |
| GET | `/api/dashboard/teacher` | Teacher Dashboard |
| GET | `/api/learning-gaps` | Get Learning Gaps |
| POST | `/api/language-bank/submit` | Submit New Entry |

Full API documentation available via Swagger at `/api/docs`.

---

## 🔒 Security & Privacy

- JWT Authentication with Role-Based Access Control (RBAC)
- Data encryption in transit (HTTPS/TLS) and at rest
- Input validation and sanitization
- Audit logs and activity tracking
- Minimal child data collection
- Consent & privacy compliance

---

## ⚡ Performance Targets

| Metric | Target |
|--------|--------|
| Translation Response Time | < 3 seconds |
| Voice Latency | < 3 seconds |
| App Launch (Cold Start) | < 4 seconds |
| Offline Content Access | 100% Essential Content |
| Sync Success Rate | ≥ 98% |
| Crash-Free Sessions | ≥ 99% |

---

## 📈 Impact Metrics

- ✅ Improved learning outcomes for tribal language students
- ✅ Increased class participation through mother tongue learning
- ✅ Reduced language barriers for 1st generation school-goers
- ✅ Better teacher efficiency via AI tools and dashboards
- ✅ Scalable multilingual education infrastructure
- ✅ Preservation and digital documentation of tribal languages

---

## 🚀 Deployment

| Layer | Platform |
|-------|----------|
| Mobile App | Android APK — Offline-First |
| Web Dashboard | Vercel / Netlify |
| Backend API | Render / AWS |
| Database | MongoDB Atlas |
| AI Service | Dockerized FastAPI |
| CI/CD | GitHub Actions |

---

## 📁 Project Structure

```
palash-ai/
├── mobile/                  # React Native (Expo) app
│   └── src/
│       ├── screens/
│       ├── components/
│       ├── store/           # Redux Toolkit
│       └── db/              # Expo SQLite (offline)
├── web/                     # Teacher & Admin dashboards
│   └── src/
│       ├── pages/
│       ├── components/
│       └── charts/
├── backend/                 # Node.js + Express.js API
│   └── src/
│       ├── routes/
│       ├── controllers/
│       ├── models/          # Mongoose schemas
│       └── middleware/
├── ai-service/              # Python FastAPI
│   ├── asr/                 # Speech recognition
│   ├── tts/                 # Voice synthesis
│   ├── translation/         # Language translation engine
│   └── nlp/                 # LLM-based quiz & worksheet generation
└── docs/                    # Architecture diagrams & API docs
```

---

🏆 Why PALASH AI Matters

PALASH AI brings multiple classroom needs into one platform.

Existing Educational Content
             +
      AI Translation
             +
       Voice AI
             +
    Mother-Tongue Learning
             +
       Worksheets
             +
          Quizzes
             +
    Learning Insights
             +
      Offline Learning
             =
        PALASH AI

Instead of giving teachers separate tools for translation, worksheets, quizzes, voice learning, and progress tracking, PALASH AI brings these workflows together.

🌍 Expected Impact

PALASH AI aims to help create classrooms where language is less of a barrier to understanding.

It can help:

Students learn difficult concepts in a familiar language.
Teachers handle multilingual classrooms with less manual translation.
Schools reuse educational content across supported languages.
Teachers identify learning difficulties earlier.
Students continue learning during poor connectivity.
Local languages gain useful digital educational resources.
Mother-tongue-based education becomes easier to support with technology.
🔮 Future Scope

PALASH AI is designed to grow beyond the initial prototype.

Possible future improvements include:

More Indian languages
More regional and tribal language datasets
Improved language-specific AI models
More native-speaker validation
Better low-bandwidth optimization
More classroom analytics
Expanded personalized learning
More educational subjects and grades
Larger language-resource banks
Wider deployment across multilingual schools

The architecture is designed so that new languages and AI models can be added without rebuilding the entire platform.

🛡️ Responsible AI Approach

PALASH AI is designed with the understanding that language technology can make mistakes, especially for languages with limited digital resources.

The platform therefore considers:

Human language review
Translation confidence
Teacher control
Data privacy
Role-based access
Audit logging
Feedback-based improvement

AI assists the teacher. It does not replace the teacher.

📈 Project Vision

Our vision is simple:

Every child should be able to understand what is being taught, regardless of the language spoken at home.

PALASH AI uses AI to connect the language of the teacher, the content, and the student.

             TEACHER
                │
                ↓
        Existing Content
                │
                ↓
             PALASH
                │
       ┌────────┼────────┐
       ↓        ↓        ↓
   Translation  Voice   Practice
       │        │        │
       └────────┼────────┘
                ↓
             STUDENT
                │
                ↓
          Better Learning

## 🤝 Team

Built with purpose for the students of tribal India.

> *"A child learns best in the language they dream in."*

---

## 📄 License

This project is developed for educational and hackathon purposes.

---
PALASH AI
Learn in the language you understand. Teach in the language you know.

Different languages. One classroom. Equal opportunity to learn.


### One thing I would change before you put this on GitHub

Your architecture image is **very useful**, but don't leave it buried in the repository. Put it near the top of the README, immediately after the project introduction.

Use:

```markdown
## 🏗️ System Architecture

![PALASH AI System Architecture](docs/architecture/palash-ai-architecture.png)

Then keep the detailed architecture explanation below it.

Also add a short demo section near the top, before the long technical sections:

## 🎥 See PALASH AI in Action

**Demo:** Hindi → Santhali multilingual teaching workflow

**Flow:**

Teacher speaks → AI understands → Content translated → Santhali audio → Student learns → Worksheet → Quiz → Learning insights → Offline sync

[▶️ Watch the Demo Video](YOUR_YOUTUBE_LINK)

<div align="center">
  <strong>PALASH AI — Empowering every child to learn in their own voice.</strong>
</div>
<img width="1226" height="938" alt="image" src="https://github.com/user-attachments/assets/bb6cf631-5ca4-4a5f-999e-9bf6e581a884" />

