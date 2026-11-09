# IELTS Ascend | Premier IELTS Preparation & Examination Simulator

[![Deploy to GitHub Pages](https://github.com/Kvnzky/IELTS-Ascend/actions/workflows/deploy.yml/badge.svg)](https://github.com/Kvnzky/IELTS-Ascend/actions/workflows/deploy.yml)

A production-ready, full-stack, responsive web application that serves as a personal IELTS preparation academy and realistic IELTS examination simulator. Aligned with the assessment criteria of the British Council, IDP: IELTS Australia, and Cambridge English.

- **GitHub Repository**: [https://github.com/Kvnzky/IELTS-Ascend](https://github.com/Kvnzky/IELTS-Ascend)
- **Live Deployment**: [https://kvnzky.github.io/IELTS-Ascend/](https://kvnzky.github.io/IELTS-Ascend/)

---

## 🌟 Key Capabilities & Architecture

### 1. Dual Track Support
- **IELTS Academic**: Higher education, postgraduate programs, and medical/professional registrations.
- **IELTS General Training**: Permanent residency (Canada Express Entry, Australian PR), immigration visas, work permits, and employment.

### 2. Comprehensive 4-Skill Academies
- **Listening Academy**:
  - Playable audio with native English accents (British, Australian, American) and Web Audio chimes.
  - Controls: Play/Pause, speed adjustment (0.75x, 1.0x, 1.25x), scrub progress indicator.
  - All 9 question types: Form completion, multiple choice, table completion, map/plan labelling, sentence completion, short answer.
  - Practice mode vs. Strict Exam Mode (single play enforced).
  - Official raw score out of 40 conversion to 9-Band scale with post-submission transcript review.

- **Reading Academy**:
  - Separate authentic passages for Academic (scientific research, cognitive linguistics) and General Training (community library, workplace DSE regulations).
  - Split-screen passage viewer with paragraph markers (A, B, C...).
  - Interactive multi-color text highlighter (Yellow, Green, Pink).
  - Question Navigator matrix & difficult question bookmarking.
  - Realistic 60-minute countdown timer.
  - Distinct conversion tables for Academic (30/40 = Band 7.0) vs General Training (34/40 = Band 7.0).

- **Writing Studio & AI Evaluator**:
  - **Academic Task 1**: Interactive SVG line charts, bar charts, pie charts, process diagrams with min 150-word count monitor.
  - **General Training Task 1**: Formal, semi-formal, and informal letter templates with bullet point checklist.
  - **Task 2 Essay Workshop**: Opinion, Discuss Both Views, Problem & Solution, Advantages/Disadvantages across 14+ themes.
  - **AI Writing Evaluator**: Rigorous breakdown across official IELTS criteria:
    1. *Task Achievement / Task Response*
    2. *Coherence and Cohesion*
    3. *Lexical Resource* (Academic Word List ratio, formal vs. informal detection)
    4. *Grammatical Range and Accuracy* (subordination clauses, passive voice, punctuation)
  - Side-by-side Band 7.0 vs. Band 9.0 model sample answers with examiner commentaries.
  - Sentence-by-sentence Band 8+ academic enhancement suggestions.

- **Speaking Academy & AI Fluency Engine**:
  - Official 3-Part examiner interview simulation:
    - *Part 1: Introduction & Familiar Topics*
    - *Part 2: Individual Long Turn (Cue Card)* with 60s preparation timer (with warning chimes) and 120s speaking timer.
    - *Part 3: Two-Way Abstract Discussion*
  - Live microphone audio recording via `MediaRecorder` API with user audio playback.
  - Real-time speech-to-text transcription via `SpeechRecognition` with clean manual fallback.
  - AI Fluency analysis: Words Per Minute (WPM), pause/hesitation counter ("um", "like"), advanced vocabulary highlights, and grammatical structure verification.

### 3. Progressive 4-Level Curriculum
- **Level 1: English Foundations**: Sentence construction (SVO), parts of speech, subject-verb agreement.
- **Level 2: Intermediate English**: Conditional sentences, modal verbs, passive voice for process descriptions.
- **Level 3: Advanced English**: Academic hedging, negative inversion for emphasis.
- **Level 4: IELTS Exam Techniques**: The Band 8 Task 1 Overview formula, True/False/Not Given traps.
- Mandatory knowledge assessments with instant rationale: lessons cannot be marked complete without passing!

### 4. Spaced Repetition (SRS) Vocabulary Builder & Grammar Academy
- **Leitner 5-Box SRS Flashcards**: Academic Word List (AWL Sublist 1 & 2), Environment, Technology, and High-Band Collocations.
- 3D flip card animations, native pronunciation audio, phonetic IPA, synonyms, antonyms, and IELTS example sentences.
- **Grammar Academy**: Comparative error spotters ("Avoid" vs. "Band 8+ Standard") with interactive sentence reconstruction quizzes.

### 5. Official Mock Examination Battery
- Timed simulations for both Academic and General Training.
- Authentic IELTS Test Report Form (TRF) generator with CEFR Level C1/C2 equivalence certification.

### 6. Full User Experience & Diagnostics
- **Initial Onboarding Wizard**: Track selection, target overall and individual band goals, previous experience, daily study time.
- **Initial Diagnostic Assessment**: Multi-skill evaluation producing an in-depth Diagnostic Report with identified strengths, weaknesses, grammar issues, vocabulary limits, and personalized priorities.
- **Performance Analytics**: Radar and progress gauges tracking the band delta across all 4 skills.
- **Interactive Study Calendar**: Weekly schedule calibrated to your daily minute commitment with checklist tracking.
- **Gamified Achievements**: Trophies and streak milestone rewards with celebration confetti.
- **Light & Dark Modes**: Accessible color contrast and smooth transitions.

---

## 🚀 Running the Application

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm run preview
```
