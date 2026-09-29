# PALASH AI - REST & WebSocket API Specification

## 1. Authentication
### `POST /api/auth/login`
- **Body**: `{ "username": "सुमन मुर्मू", "role": "teacher" }`
- **Response**: `{ "token": "palash_jwt_...", "user": { ... } }`

## 2. Curriculum & Lessons
### `GET /api/curriculum`
- Returns state curriculum, supported languages (Hindi, Santali Ol Chiki, Santali Devanagari, Ho, Mundari).

### `GET /api/lessons?class=3&subject=EVS`
- Returns lessons aligned with NIPUN Bharat learning outcomes and key bilingual vocabulary.

## 3. Real Neural Translation
### `POST /api/translate`
- **Body**:
  ```json
  {
    "text": "बच्चों, पौधों को पानी क्यों चाहिए?",
    "sourceLang": "hin_Deva",
    "targetLang": "sat_Olck"
  }
  ```
- **Response**:
  ```json
  {
    "sourceText": "बच्चों, पौधों को पानी क्यों चाहिए?",
    "translatedText": "ᱫᱟᱨᱮ ᱡᱤᱣᱤᱫ ᱛᱟᱦᱮᱸᱱ ᱞᱟᱹᱜᱤᱫ ᱫᱟᱜ ᱟᱹᱰᱤ ᱞᱟᱹᱠᱛᱤᱜ-ᱟ᱾",
    "transliteration": "दारे जीविद ताहेन लागिद दाग आडी लाकतिग-आ",
    "latency": {
      "asrMs": 120,
      "mtMs": 480,
      "ttsMs": 40,
      "totalLatencyMs": 640,
      "targetUnder3sAchieved": true
    }
  }
  ```

## 4. Bilingual Worksheets
### `POST /api/worksheet/generate`
- **Body**:
  ```json
  {
    "classNumber": 3,
    "subject": "Environmental Studies",
    "topic": "Needs of Living Plants",
    "nipunOutcomeCode": "EVS-3.2",
    "difficulty": "basic",
    "count": 4
  }
  ```
- Generates dynamic bilingual printable worksheets with Ol Chiki Unicode and sample solutions.

## 5. Visual Flashcards
### `POST /api/flashcards/generate`
- **Body**: `{ "topic": "Plants and Nature", "lessonId": "les-jh-c3-evs-01" }`
- Returns 6 bilingual flashcards with audio trigger, Ol Chiki text, and visual icons.

## 6. Quizzes & Assessments
### `POST /api/quiz/generate`
- Generates 4 bilingual questions with authentic distractors and explanation.

### `POST /api/quiz/submit`
- Submits answers, computes exact score, updates local progress and cloud database.

## 7. Offline Sync Queue
### `POST /api/sync`
- **Body**: `{ "items": [ { "id": "sync-1", "actionType": "QUIZ_SUBMIT", "payload": { ... } } ] }`
- Synchronizes queued offline activities to MongoDB Atlas.

### `GET /api/sync/status`
- Reports MongoDB Atlas synchronization state.
