# PALASH AI - Architecture Overview
**SIH Problem Statement 26042: AI-Powered Vernacular Pedagogy and Real-Time Translation Tool for Mother Tongue-Based Primary Education (Government of Jharkhand)**

## 1. System Vision & Objective
In rural Jharkhand primary schools across Santhal Pargana, Kolhan, and Chotanagpur, a profound linguistic gap exists between Hindi-medium teachers and tribal students whose mother tongue is **Santali (Ol Chiki)**, **Ho**, or **Mundari**. 

**PALASH AI** addresses this challenge through:
1. **Real-Time Voice Translation Pipeline**: Live Hindi ASR → Neural Machine Translation into Santali (sat_Olck) → Santali TTS synthesis under 3 seconds.
2. **NIPUN Bharat Aligned Pedagogy**: Curriculum-grounded bilingual worksheets, visual flashcards, and quizzes.
3. **Offline-First Resilience**: Persistent SQLite / local storage, sync queue, and conflict-safe cloud synchronization with MongoDB Atlas for schools with intermittent electricity and network.
4. **Authentic Learning Analytics & Concept Gap Analysis**: Calculates actual student accuracy per NIPUN learning outcome.

## 2. High-Level Flow
```
Teacher Speaks Hindi (Mic)
         │
         ▼
Audio Capture / Web Audio Stream
         │
         ▼
Speech-to-Text (IndicConformer / Gemini ASR)
         │
         ▼
Hindi Transcript
         │
         ▼
Neural Machine Translation (IndicTrans2 hin_Deva -> sat_Olck)
         │
         ▼
Santali Ol Chiki Text + Devanagari Transliteration
         │
         ▼
Santali Text-to-Speech (IndicTTS)
         │
         ▼
Child Hears Mother Tongue in Classroom (< 3s Latency)
```

## 3. Component Architecture
- **Mobile Client**: React Native + Expo + TypeScript, featuring offline SQLite database, audio capture, and sync queue.
- **Web Applet**: React 19 + Tailwind CSS + Web Audio + IndexedDB/LocalStorage, providing rural teachers with an immediate classroom dashboard.
- **Backend API**: Node.js + Express + TypeScript, implementing REST endpoints, WebSocket for voice streaming, and MongoDB Atlas persistence.
- **AI/NLP Microservice**: Python + FastAPI, integrating AI4Bharat IndicTrans2, IndicConformer, and IndicTTS.
