# Product Requirements Document (PRD)

## Project Name

SnapRead – Mobile Web app that converts uploaded documents (.pdf, .docx) into swipeable flash‑card decks optimised for comprehension and retention on small screens.

---

## 1 | Problem Statement

Heavy, scroll‑based documents are hard to read on phones—especially for time‑poor and neurodivergent users (e.g. ADHD). Users abandon or skim, losing value. We need a consumption‑first experience that surfaces content in bite‑sized, focus‑friendly units.

---

## 2 | Goals & Success Metrics (MVP)

| Objective             | KPI                                          | Target (90‑day post‑GA)            |
|----------------------|----------------------------------------------|------------------------------------|
| Increase completion   | % pages (or cards) consumed per session      | **+30 pp vs. mobile PDF baseline** |
| Improve comprehension | Correct answers in post‑read 3‑question quiz | **≥ 15 % lift**                    |
| Retention             | Weekly active readers                        | **35 % WAU/MAU**                   |
| Conversion            | Docs successfully converted → decks          | **70 % of uploads**                |

---

## 3 | Personas

1. **Commuter Learner (CL):** reads reports on transit; wants quick, resumable chunks.
2. **ADHD Professional (AP):** struggles with long texts; needs focus mode & custom pacing.
3. **Student Sprinter (SS):** uploads lecture slides to revise via spaced flashcards.

---

## 4 | User Stories (MVP)

1. *As CL*, I upload a PDF and within 30 sec get a deck of cards so I can start reading on the bus.
2. *As AP*, I toggle dark mode and enlarge text to stay focused.
3. *As SS*, I bookmark tricky cards and review them later.
4. *As any user*, I can resume reading where I left off across devices.

---

## 5 | In‑Scope (MVP)

- Upload from **local device only** (drag‑and‑drop or standard file picker).
- Serverless doc‑processing pipeline: extract → smart chunk (≈100–150 words) → headline generation → optional image pull (unsplash) → deck JSON.
- Swipeable card UI: horizontal swipe, progress bar, per‑card notes/bookmark, settings panel.
- Typography default: **Lexend Deca, 16 px, lh 1.4**; user‑adjustable font size & theme (light, dark, sepia).
- Responsive PWA shell (≤ 600 px width focus).
- Basic spaced‑repetition revisit prompt (“Study again tomorrow?”).

### VNext (out‑of‑scope for MVP)

- OCR for scanned PDFs.
- AI summaries per section.
- Auto‑quiz generation.
- Collaborative decks sharing / comments.

---

## 6 | Functional Requirements (MVP)

1. **Upload & Import**
   - F1.1 Accept .pdf & .docx ≤ 20 MB.
   - F1.2 Virus scan & MIME validation.
2. **Processing Service**
   - F2.1 Extract plain text & images (libreoffice → HTML for docx; pdf.js for pdf).
   - F2.2 Chunk text by semantic boundaries (headings, sentences) targeting 120 words avg.
   - F2.3 Generate card headline (first heading or GPT‑powered summariser fallback ≤ 60 char).
   - F2.4 Store deck JSON (cards[], metadata) in Firestore.
3. **Deck Viewer (PWA)**
   - F3.1 Display one card per viewport; horizontal swipe advance; reverse swipe returns.
   - F3.2 Progress UI (X / N cards, thin bar top).
   - F3.3 Tap to reveal note panel (highlight, bookmark).
   - F3.4 Settings: font size slider (14–22 px), theme toggle, auto‑advance (off/5/10 s).
   - F3.5 Resume state via localStorage & user account sync.
4. **Account & Storage**
   - F4.1 **Empty State & Onboarding**  
     - Display an illustrated hero graphic plus concise value prop: “Turn any document into swipe‑friendly flashcards.”  
     - Offer **“Try a Sample”** button that loads a curated sample deck so users can experience the reading flow with zero friction.  
     - Surface subtle social proof (usage count or testimonial) to build trust.  
   - F4.2 **First‑Upload Call‑to‑Action**  
     - Primary CTA: **“Upload your first file”** supporting drag‑and‑drop and file‑picker (PDF/DOCX).  
     - Microcopy emphasises privacy: “Conversion happens in‑memory; your file is never stored.”  
     - If user hesitates > 8 s, nudge with pulsing halo animation around CTA.
5. **Analytics**
   - F5.1 Log upload success, conversion time, card views, completion, dwell per card.

---

## 6.1 | Enhanced Interaction Controls (MVP Update)

### 6.1.1 Card‑Count Slider

- **Default cards/deck**: 20 cards (≈ 2.5 min read).  
- **Option A: “Less”**: condenses content into 10 cards.  
- **Option B: “More”**: expands into 40+ finer-grained cards.  
- **Rationale**: Better pacing control than font size tweaks; matches working-memory science.  
- **Slider location**: Settings panel.  
- Changing setting triggers re‑chunking in frontend or server.

### 6.1.2 Dive Deeper Button

- Expands card into a modal or flips to show fuller context paragraph(s) + images.  
- User returns to flow easily.

### 6.1.3 Jump to Source Button

- Jumps to original file location (with highlight) based on stored byte offset or page index.  
- Opens embedded viewer if doc is <10 MB; otherwise, stream surrounding pages.

### 6.1.4 Ask AI Button

- Sends current, previous, and next card context to AI for Q&A.  
- Answers shown inline in a modal/drawer; fallback link to Jump to Source if uncertain.

### 6.1.5 Font Size Handling

- Removes granular font-size slider from UI.  
- Honors OS-level scaling + simple “Large Text” toggle (+2px).  
- Reduces settings clutter while maintaining accessibility.

---

## 7 | Non‑Functional Requirements

- **Perf:** First card interactive ≤ 4 s on 3G; next card < 100 ms swipe latency.
- **Security & Privacy:** docs deleted from server after 24 h or on user delete; HTTPS only.
- **Accessibility:** WCAG 2.2 AA; keyboard nav; aria‑labels; high‑contrast theme.
- **Scalability:** Handle 5k concurrent conversions; autoscale Cloud Functions.

---

## 8 | Design Principles

1. **Focus first:** one idea, zero clutter per card.
2. **Readable defaults:** Lexend Deca 16 px, line‑height 1.4, 40–60 char/line.
3. **Delightful motion:** subtle card slide (200 ms) with easing; respects OS‑level ‘reduce motion’.
4. **Progress motivates:** show deck length early; celebrate completion with confetti burst.

---

## 9 | Metrics & Instrumentation

- Google Analytics (GA4) + BigQuery export.
- Events: `upload_start`, `upload_success`, `deck_generated`, `card_swiped`, `deck_complete`.
- A/B test: cards vs. scroll PDF for comprehension lift (target ≥15% lift at p ≤ 0.05).

---

## 10 | Dependencies & Risks

- Text extraction accuracy (tables, math).
- AI summariser latency/cost.
- File privacy in AI contexts → need for regional data safeguards.
- Webfont load times → preload Lexend locally.

---

## 11 | Milestones (Tentative)

| Phase | Deliverable                       | Owner  | Date   |
|-------|-----------------------------------|--------|--------|
| 0     | Tech spike: pdf.js extraction POC | Eng    | Wk 1   |
| 1     | Processing API (doc → JSON)       | Eng    | Wk 4   |
| 2     | Deck viewer MVP + settings        | Eng/UI | Wk 6   |
| 3     | Closed alpha (20 users)           | PM     | Wk 8   |
| 4     | Beta + telemetry                  | Eng    | Wk 10  |
| 5     | Public GA                         | PM     | Wk 14  |

---

## 12 | Open Questions

1. Will we support multi‑language chunking Day 1?
2. How will we price or limit heavy usage (rate‑limit?)
3. Should per‑deck spaced repetition be adaptive or fixed intervals?

---

## 13 | Appendix

- Font licence: Lexend Deca (SIL OFL).
- Research summary & citations available in separate doc.
