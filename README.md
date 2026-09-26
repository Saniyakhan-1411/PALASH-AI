# PALASH AI — Mother Tongue-Based Multilingual Education Platform

> **Breaking language barriers in primary education through AI-powered voice learning in Ho, Mundari, and Santhali.**

---

## 📌 Problem Statement

Millions of tribal and rural students in India study in schools where the language of instruction is Hindi or English — but their mother tongue is Ho, Mundari, or Santhali. This gap causes:

- High dropout rates in early grades
- Poor concept retention due to language barriers
- Teachers struggling to bridge communication gaps
- Zero access to digital learning tools in native languages

**PALASH AI solves this by bringing AI-powered, voice-first education in the student's own language — even without internet.**

---

## 💡 What is PALASH AI?

PALASH AI is a full-stack, offline-first education platform that allows teachers to deliver lessons and allows students to learn in their mother tongue using:

- 🎙️ **Speech-to-Text (ASR)** — Students answer in their own language
- 🔊 **Text-to-Speech (TTS)** — Lessons are read aloud in Ho / Mundari / Santhali
- 🌐 **Real-Time Voice Translation** — Hindi → Ho / Mundari / Santhali
- 📋 **AI-Generated Worksheets, Quizzes & Flashcards**
- 📴 **Offline Mode** — Works without internet connectivity
- 📊 **Teacher Dashboard** — Track learning gaps and student progress

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

## 🤝 Team

Built with purpose for the students of tribal India.

> *"A child learns best in the language they dream in."*

---

## 📄 License

This project is developed for educational and hackathon purposes.

---

<div align="center">
  <strong>PALASH AI — Empowering every child to learn in their own voice.</strong>
</div>
<img width="1226" height="938" alt="image" src="https://github.com/user-attachments/assets/bb6cf631-5ca4-4a5f-999e-9bf6e581a884" />

