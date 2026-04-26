# Responsible AI Documentation
# Animend — AI-Powered Veterinary Clinical Decision Support for Livestock

> **Document Version:** 1.0  
> **Classification:** Public — Hackathon Submission Artifact  
> **Audience:** Hackathon Judges, Technical Reviewers, Responsible AI Evaluators

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [AI System Summary](#2-ai-system-summary)
3. [Data Sources](#3-data-sources)
4. [Responsible AI Principles](#4-responsible-ai-principles)
5. [Bias & Risk Assessment](#5-bias--risk-assessment)
6. [Failure Cases & Edge Cases](#6-failure-cases--edge-cases)
7. [Human-in-the-Loop Design](#7-human-in-the-loop-design)
8. [Monitoring & Continuous Improvement](#8-monitoring--continuous-improvement)
9. [Scalability & Future Work](#9-scalability--future-work)
10. [Ethical Statement](#10-ethical-statement)

---

## 1. Project Overview

### What Is Animend?

**Animend** is an AI-powered veterinary clinical decision support system purpose-built for the realities of livestock farming in developing countries. By combining multimodal AI (image analysis + natural language understanding), Animend allows rural farmers to submit a photo and a plain-language description of their animal's symptoms and receive structured, preliminary diagnostic guidance within seconds — without requiring access to an on-site veterinarian.

### The Problem It Solves

In South Asia, Sub-Saharan Africa, and other agriculturally dependent regions, the ratio of licensed veterinarians to livestock is critically low. A single district veterinarian may be responsible for hundreds of thousands of animals across dozens of villages. The consequences are stark:

- **Delayed diagnosis** leads to avoidable animal deaths and food insecurity.
- **Undetected disease clusters** allow highly contagious conditions (Foot-and-Mouth Disease, Lumpy Skin Disease) to spread silently across farms before authorities can respond.
- **Zoonotic misclassification** — farmers incorrectly believing a disease is transmissible to humans — can cause dangerous public health panics.

Animend addresses all three failure points by providing timely, grounded preliminary guidance, automated outbreak cluster detection, and strict safety rails that prevent the propagation of harmful misinformation.

### Who Are the Users?

| User Type | Role | Primary Need |
|---|---|---|
| **Rural Farmers** | Primary end-user | Immediate preliminary diagnosis for sick livestock |
| **Field Veterinarians** | Expert escalation recipient | Receive structured case reports for efficient triage |
| **Agricultural Authorities** | Outbreak monitoring | Real-time geographic disease cluster visualization |

### Why It Matters — Social & Economic Impact

Livestock represents the primary livelihood and a critical protein source for over **1 billion people** globally. A single uncontained disease outbreak can devastate a farming household's income for years. Animend is not a replacement for veterinary expertise — it is an access bridge that democratizes a first line of clinical reasoning for communities that currently have none.

---

## 2. AI System Summary

Animend's intelligence is powered by a deliberate **dual-model architecture** designed to balance diagnostic accuracy, cost-efficiency, and safety for constrained, low-bandwidth environments.

### Model 1 — Google Gemini 1.5 Flash (Primary Diagnostic Engine)

| Attribute | Detail |
|---|---|
| **Type** | Large Multimodal Language Model (LMM) |
| **Provider** | Google DeepMind via Google AI Studio API |
| **Location in Codebase** | `backend/app/services/gemini_service.py` |
| **Input** | Raw `image/jpeg` bytes + structured text prompt (symptoms, animal type, HF CLIP context) |
| **Output** | Strict JSON schema: `{ disease, confidence, severity, treatment_steps, zoonotic_risk, follow_up_required }` |
| **Why Selected** | Sub-3-second latency, industry-leading multimodal reasoning, strong structured JSON output adherence, and highly cost-effective for developing-world deployment constraints. |
| **Safety Measures** | A hardcoded `_validate_result()` post-processing function rewrites any generated prescription drug dosages to safe generic actions (e.g., "isolate animal and seek veterinary advice"). A curated non-zoonotic disease list forces `zoonotic_risk: false` for non-transmissible conditions. |
| **Known Limitations** | Susceptible to hallucination on rare breed-specific symptoms; training corpus skewed toward Western veterinary literature. |

### Model 2 — CLIP (openai/clip-vit-base-patch16) — Zero-Shot Vision Classifier

| Attribute | Detail |
|---|---|
| **Type** | Vision-Language Transformer (Zero-Shot Classifier) |
| **Provider** | Hugging Face Inference API |
| **Location in Codebase** | `backend/app/services/vision_classifier.py` |
| **Input** | Base64-encoded livestock image against 15 curated disease label candidates |
| **Output** | Top-3 probability scores per disease label |
| **Why Selected** | Requires zero domain-specific fine-tuning. Provides an **independent visual prior signal** that grounds the LLM's reasoning and prevents it from lazily defaulting to text-only symptom matching. |
| **Known Limitations** | Pre-trained primarily on Western livestock imagery (e.g., Holstein cattle) — performance degrades on indigenous South Asian breeds (Bos indicus / Zebu). |

### Algorithm 3 — Haversine Distance Outbreak Clustering

| Attribute | Detail |
|---|---|
| **Type** | Deterministic Geospatial Heuristic |
| **Location in Codebase** | `backend/app/routes/outbreaks.py` |
| **Logic** | Groups diagnosis records with the same disease, occurring within a **50 km radius** and a **48-hour window**, with a minimum cluster threshold of **3 cases**. |
| **Why Selected** | Straightforward, well-understood formula for geographic spherical distance. No external dependencies required. |
| **Known Limitations** | Current Python implementation uses an O(N²) nested loop — not suitable for large-scale datasets without migration to PostGIS `ST_DWithin`. |

### API Surface Summary

| API | Purpose | Failure Handling |
|---|---|---|
| **Google Gemini API** | Primary diagnosis synthesis | Returns deterministic safe fallback on HTTP 429 |
| **Hugging Face Inference API** | Zero-shot vision pre-classification | Graceful omission on HTTP 503 (cold start); pipeline continues |
| **Supabase (PostgreSQL + Storage)** | Persistent storage and image archival | Try/except wrappers; AI diagnosis still returned if DB is unavailable |

---

## 3. Data Sources

### 3.1 Internal Data Sources

#### PostgreSQL Database (via Supabase)

| Attribute | Detail |
|---|---|
| **Source** | Supabase PostgreSQL instance |
| **Migrations** | `database/migrations/001_create_diagnoses.sql`, `002_create_alerts.sql`, `003_create_users.sql` |
| **Schema** | `diagnoses` table: `animal_type`, `symptoms_text`, `disease`, `confidence`, `severity`, `lat`, `lng`, `image_url`, `created_at` |
| **Data Type** | Structured relational — farmer-submitted diagnostic records |
| **Reliability** | High structural integrity; content reliability is partially dependent on user-reported GPS coordinates and symptom descriptions |
| **Limitations** | GPS data is user-reported and may be imprecise; symptoms are in natural language and may vary by dialect or literacy level |
| **Privacy Risk** | `lat/lng` fields can identify specific farm locations. Row Level Security (RLS) policies (`database/rls_policies.sql`) are enforced to restrict data access per user context. |

#### Supabase Storage (animal-photos Bucket)

| Attribute | Detail |
|---|---|
| **Source** | Supabase S3-compatible object storage |
| **Purpose** | Archival of compressed `image/jpeg` uploads for audit trails and future model fine-tuning |
| **Format** | JPEG, resized and compressed at ingestion |
| **Reliability** | High — managed cloud object storage with redundancy |
| **Limitations** | Images are user-generated; quality, framing, and lighting vary significantly |

#### Hardcoded Mock / Fallback Data

| Attribute | Detail |
|---|---|
| **Source** | `frontend/src/utils/mockData.js` |
| **Purpose** | Client-side UI fallback when backend services are unreachable |
| **Format** | Static JSON arrays representing example diagnoses and outbreak clusters |
| **Reliability** | Deterministic — not AI-generated; purely for graceful degradation |

#### Localization Translation Files

| Attribute | Detail |
|---|---|
| **Source** | `frontend/ai/translations/english.json`, `hindi.json`, `nepali.json` |
| **Purpose** | Multilingual UI support across the three primary target languages |
| **Reliability** | Static; community review recommended before production deployment |

### 3.2 External Data Sources

#### Farmer-Submitted Inputs (Runtime)

| Input Type | Collection Method | Trust Level | Privacy Consideration |
|---|---|---|---|
| **Livestock Images** | Camera capture (`CameraCapture.jsx`) | Unverified; user-sourced | Processed server-side; not shared beyond Supabase Storage |
| **Symptom Descriptions** | Text entry or voice transcription (`VoiceInput.jsx`) | Unverified; colloquial | Fed directly to AI — sanitization required (see Section 5) |
| **GPS Location** | Browser Geolocation API | Low-to-medium; device accuracy varies | Stored with RLS enforcement; used solely for outbreak mapping |

---

## 4. Responsible AI Principles

Animend is designed around six core Responsible AI principles. Each principle is operationalized in the architecture, not merely aspirational.

---

### 4.1 Fairness

**The Challenge:** Both CLIP and Gemini 1.5 Flash are predominantly trained on datasets skewed toward Western breeds, Western veterinary literature, and English-language medical terminology. Animend's core users — South Asian and African subsistence farmers — fall outside this training distribution.

**What We Do Today:**

- The system serves responses in **English, Hindi, and Nepali**, reducing the English-only literacy barrier.
- Voice input via `VoiceInput.jsx` provides an accessibility pathway for low-literacy users.
- All diagnosis images are archived in Supabase Storage with the explicit strategic intent of building a **regionally representative fine-tuning dataset** for post-hackathon model improvement.
- The dual-model architecture intentionally uses CLIP's visual signal to reduce Gemini's reliance on text-only symptom matching, partially compensating for dialect and language nuance gaps.

**Acknowledged Gaps:**

- Indigenous South Asian breeds (Bos indicus / Zebu) and African breeds are underrepresented in CLIP's training data. Diagnostic confidence for these breeds should be treated with additional caution until a localized fine-tuned classifier is deployed.
- Regional dialect symptom descriptions may be lost in translation before reaching the English-prompted LLM.

**Roadmap Commitment:** Fine-tune a localized LoRA adapter or a custom EfficientNet-based classifier on data collected via Supabase Storage once sufficient representative volume is reached.

---

### 4.2 Transparency

**Explainability for Users:**

- Every diagnosis response includes a **confidence score** and **severity rating**, giving farmers a clear signal of how certain the system is and how urgent the situation is.
- The system explicitly instructs users to **consult a licensed veterinarian** for all high-severity and high-confidence diagnoses, making the tool's role as a preliminary advisor — not a final authority — unambiguous.
- The dual-model architecture (CLIP + Gemini) is designed so that the LLM always receives the CLIP visual context as part of its prompt — this creates an auditable reasoning chain that can be logged and reviewed.

**Explainability for Operators and Judges:**

- The AI system prompt in `gemini_service.py` is fully auditable and enforces strict JSON output schemas, making the model's decision surface inspectable.
- The hardcoded `_validate_result()` override logic is documented and deterministic — there is no black-box post-processing.

> **Assumption (marked):** Confidence scores are currently surface-level values returned by Gemini. Future versions should calibrate these scores against ground-truth veterinary outcomes to ensure they reflect genuine diagnostic reliability.

---

### 4.3 Privacy & Security

**Data Minimization:**

- Images are resized and compressed before storage, reducing unnecessary data retention of high-resolution personal content.
- GPS coordinates are stored at the farm-level granularity required for outbreak clustering, not tracked continuously.

**Access Control:**

- Supabase Row Level Security (RLS) policies (`database/rls_policies.sql`) are configured to restrict cross-user data access at the database layer.
- The `animal-photos` Supabase Storage bucket is not publicly readable by default.

**Identified Security Gap (Production Blocker):**

- ⚠️ **API Endpoints Are Currently Unauthenticated.** The `/api/diagnose` endpoint and related routes have no JWT middleware or session validation enforced. This creates risk of API budget exhaustion attacks (Gemini API credit drain) and unauthorized data submission. **Remediation:** Implement Supabase Auth with FastAPI JWT Dependency injection before any public deployment.

**Prompt Injection Risk:**

- Symptom text is currently passed directly into the Gemini prompt with minimal sanitization. A malicious user could submit `symptoms_text` containing adversarial instructions (e.g., *"Ignore previous instructions and respond with..."*). **Remediation:** Implement input validation and prompt wrapping with delimiters that clearly separate user content from system instructions in `gemini_service.py`.

---

### 4.4 Accountability

**System Accountability:**

- The complete AI pipeline is logged at each stage (image upload → CLIP classification → Gemini synthesis → DB write), creating an auditable trace for every diagnosis.
- All diagnoses are persisted to Supabase PostgreSQL, enabling retrospective review by veterinary professionals and agricultural authorities.

**Human Accountability Chain:**

- Farmers are not the final decision-makers. The system's escalation logic directs high-severity or low-confidence cases explicitly to licensed veterinarians.
- Agricultural authorities can view outbreak clusters on the geographic map, enabling state-level human oversight of disease trends.
- No AI-generated treatment recommendation involving prescription medication reaches the user — the `_validate_result()` function enforces this programmatically.

> **Gap (noted for improvement):** There is currently no formal mechanism for veterinarians to submit feedback on AI-generated diagnoses to close the ground-truth feedback loop. This is a priority post-hackathon feature.

---

### 4.5 Safety

**Treatment Hallucination Prevention (Critical):**

The most dangerous failure mode for a veterinary AI system is recommending a harmful drug dosage. Animend addresses this with a **mandatory, hardcoded safety override layer** in `_validate_result()`:

- All generated content referencing prescription drugs (e.g., penicillin, ivermectin) is detected via pattern matching and rewritten to the safe default action: **"Isolate the animal immediately and contact a licensed veterinarian."**
- This override cannot be bypassed by the AI — it is applied programmatically after the model response is received.

**Zoonotic Misclassification Prevention:**

- A hardcoded, curated list of non-zoonotic diseases in `gemini_service.py` forces `zoonotic_risk: false` for any condition on the list, regardless of what the model generates.
- This prevents dangerous false public health panics (e.g., Mastitis being incorrectly flagged as transmissible to humans).

**File Upload Safety:**

- The backend enforces a strict **10 MB file size limit** on all uploads (`diagnose.py`, line 63), returning HTTP 413 for oversized files.
- Only `image/jpeg` format is accepted at ingestion.

**Fallback Safety Protocol:**

- In the event of a Gemini API failure (rate limit, timeout, outage), the system does not return an empty or confusing error. Instead, it activates a **deterministic, hardcoded safe fallback response** instructing the farmer to isolate the animal — a universally safe action for any livestock illness.

---

## 5. Bias & Risk Assessment

| Risk | Cause | Impact | Severity | Mitigation |
|---|---|---|---|---|
| **Western Breed Bias** | CLIP and Gemini trained predominantly on Western livestock datasets | Reduced diagnostic accuracy for indigenous breeds (Bos indicus, Zebu) common in target markets | 🔴 High | Archiving all submissions to Supabase Storage for future LoRA fine-tuning; confidence scores surfaced to users |
| **Language & Dialect Bias** | Regional dialects and colloquial symptom descriptions misinterpreted by English-optimized LLM | Key clinical symptoms lost in translation, leading to incorrect diagnosis weighting | 🟡 Medium | Voice input support; roadmap includes native NLP translation layer pre-LLM |
| **Treatment Hallucination** | Generative LLMs probabilistically invent specific drug names and dosages | Fatal animal outcomes if incorrect dosage is administered; potential human harm for zoonotic drugs | 🔴 Critical | Hardcoded `_validate_result()` pattern-matching filter blocks all prescription references; replaced with safe generic action |
| **Zoonotic Misclassification** | LLM may flag non-zoonotic diseases as human-transmissible | Public panic, unnecessary quarantine actions, erosion of trust | 🟠 High | Hardcoded non-zoonotic disease allowlist forces `zoonotic_risk: false` programmatically |
| **Accessibility & Connectivity Bias** | System requires smartphone, internet access, and digital literacy | Excludes the most economically vulnerable target users | 🟠 High | Voice input (`VoiceInput.jsx`); offline mock data fallback; SMS/USSD integration planned |
| **Prompt Injection** | Malicious symptom text inputs designed to override system instructions | AI produces dangerous, misleading, or off-topic outputs | 🟡 Medium | Input length limits; roadmap: delimiter-wrapped prompt architecture in `gemini_service.py` |
| **GPS Spoofing / Inaccuracy** | User-reported or low-accuracy GPS signals | Outbreak cluster maps reflect incorrect geographic distribution | 🟡 Medium | Outbreak clustering requires ≥3 confirmed cases; single-point anomalies do not trigger alerts |
| **Overreliance on AI Output** | Confident-sounding AI responses may discourage veterinary consultation | Delayed professional intervention leading to worsened outcomes | 🟠 High | All responses include explicit "consult a veterinarian" escalation language; confidence and severity scores surfaced |
| **O(N²) Clustering Scalability** | Python in-memory Haversine loop over all DB records | System timeout and crash at scale, rendering outbreak map unavailable | 🔴 Critical | PostGIS `ST_DWithin` migration planned; current query limited by 48-hour `created_at` filter |
| **Unauthenticated API Abuse** | No JWT middleware on `/api/diagnose` | API budget exhaustion; data poisoning via mass false submissions | 🟠 High | Supabase Auth + FastAPI JWT dependency injection identified as pre-production blocker |

---

## 6. Failure Cases & Edge Cases

| Failure Case | Cause | Impact on Users | Severity | Detection | Prevention & Recovery |
|---|---|---|---|---|---|
| **Blurry / Dark Image Upload** | Poor smartphone camera conditions in rural environments | CLIP classification returns low-confidence or incorrect visual prior; Gemini may misdiagnose | 🟡 Medium | Low confidence score surfaced in response | UI guidance on image quality; confidence threshold warning prompts re-capture |
| **Hugging Face Cold Start (503)** | Free-tier HF inference model goes idle | CLIP visual prior is unavailable; Gemini operates on text symptoms only | 🟢 Low | HTTP 503 caught in `vision_classifier.py` | Graceful omission — pipeline continues with empty CLIP context string; logged for monitoring |
| **Gemini Rate Limit (429)** | Free-tier API quota exhaustion | No AI diagnosis returned | 🔴 High | `AIServiceError` raised in `diagnose.py` | Deterministic hardcoded safe fallback ("Isolate the animal") returned immediately |
| **Supabase Database Down** | Misconfigured credentials or Supabase outage | Diagnosis not persisted; no historical record | 🟡 Medium | Try/except on `.insert()` fails | AI diagnosis JSON still returned to frontend; farmer receives guidance despite storage failure |
| **Oversized File Upload (>10 MB)** | User uploads uncompressed RAW or video file | Request rejected | 🟡 Medium | HTTP 413 returned by backend | Enforced at `diagnose.py` line 63; frontend should surface clear size guidance to user |
| **No Internet Connectivity** | Remote rural environment with no data coverage | Entire backend pipeline unavailable | 🔴 High | Frontend fetch timeout | `mockData.js` fallback renders example diagnoses and map; user is informed these are illustrative |
| **Unsupported File Type** | User uploads PDF, HEIC, PNG, or video | Incorrect MIME type rejected | 🟡 Medium | MIME validation at ingestion | HTTP 415 returned; frontend file picker should restrict to JPEG/PNG |
| **Empty / Single-Word Symptoms** | User submits minimal symptom text | Gemini lacks sufficient clinical context for accurate synthesis | 🟡 Medium | Response confidence score will be low | Low-confidence threshold triggers UI prompt requesting more symptom detail |
| **Outbreak Clustering Timeout (O(N²))** | Large diagnosis record volume overwhelms in-memory loop | Outbreak map fails to load; HTTP timeout | 🔴 Critical | Server CPU spike / 504 Gateway Timeout | 48-hour `created_at` filter limits query scope; PostGIS migration is the permanent fix |
| **False Positive Outbreak Alert** | Coincidental geographic clustering of unrelated cases | Unnecessary government intervention; farmer alarm | 🟡 Medium | Post-clustering review | Minimum 3-case threshold; disease type must match within the cluster window |

---

## 7. Human-in-the-Loop Design

Animend is explicitly designed as a **clinical decision support** tool, not an autonomous diagnostic authority. Human expertise is woven into the system at three levels:

### Level 1 — Farmer Interpretation Layer

Every diagnosis response presents:
- A **disease candidate** with a plain-language explanation
- A **confidence score** (Low / Medium / High) enabling the farmer to self-assess the reliability of the output
- A **severity rating** (Mild / Moderate / Severe / Critical) driving urgency of action
- An explicit **"Consult a Veterinarian"** call to action for all non-trivial cases

Farmers are trained to treat the system output as a first opinion, not a final verdict.

### Level 2 — Veterinarian Escalation

- Cases flagged as **High Severity** or **Low Confidence** are explicitly escalated via the `follow_up_required: true` field in the diagnosis JSON.
- The veterinarian receives a structured case report (symptoms, image, AI diagnosis, confidence, severity) rather than a raw query — enabling faster, more informed triage.

> **Planned Feature:** A dedicated veterinarian portal to review, confirm, or override AI diagnoses. Confirmed outcomes feed back into the training dataset for continuous model improvement.

### Level 3 — Agricultural Authority Oversight

- The real-time **Outbreak Map** (`OutbreakMap.jsx`) provides agricultural authorities with a geospatial dashboard of active disease clusters.
- Authorities retain full discretion to investigate, validate, and act on cluster alerts — the AI provides the signal, not the policy decision.
- All diagnosis records are retained in Supabase PostgreSQL for retrospective epidemiological analysis by domain experts.

### Confidence Threshold Policy

| Confidence Level | Recommended Action | `follow_up_required` |
|---|---|---|
| High (>80%) | AI guidance may be acted upon; vet consultation advised for treatment | `false` (mild cases) / `true` (severe cases) |
| Medium (40–80%) | Treat as preliminary signal only; veterinary confirmation required | `true` |
| Low (<40%) | Do not act on diagnosis; immediately contact veterinarian | `true` |

---

## 8. Monitoring & Continuous Improvement

### Current State

Animend currently uses Python `print()` statements for backend logging and Supabase-native query logging for database operations. The `.github/workflows` CI/CD pipeline is a placeholder (`gitkeep` only), and frontend E2E testing (Cypress/Playwright) has not yet been implemented.

### Identified Monitoring Gaps & Remediation Roadmap

| Monitoring Need | Current State | Planned Remediation |
|---|---|---|
| **Structured Backend Logging** | `print()` statements | Replace with Python `logging` module; integrate Sentry or Datadog for error tracking and alerting |
| **AI Response Quality Auditing** | No systematic review | Implement veterinarian review portal to flag incorrect AI diagnoses |
| **API Cost & Rate Limit Tracking** | Manual check | Instrument Gemini and HF API call volumes with alerts on approaching quota thresholds |
| **Diagnosis Accuracy Metrics** | Unmeasured | Build ground-truth feedback loop: vet-confirmed outcomes vs. AI diagnoses → F1 score per disease |
| **Outbreak False Positive Rate** | Unmeasured | Log authority-reviewed cluster outcomes to calibrate clustering thresholds |
| **CI/CD Pipeline** | Placeholder only | Implement GitHub Actions with automated pytest, linting, and staging deployment gates |
| **Frontend E2E Testing** | None | Playwright test suite covering core diagnostic submission and map rendering flows |

### Feedback Loop Design

```
Farmer submits diagnosis request
        ↓
AI generates preliminary diagnosis
        ↓
Veterinarian reviews & confirms/overrides (planned portal)
        ↓
Ground-truth label stored in Supabase alongside original submission
        ↓
Periodic fine-tuning of localized LoRA / CLIP classifier
        ↓
Improved diagnostic accuracy for indigenous breeds & regional conditions
```

This feedback loop transforms every farmer interaction into a potential training data point — ethically sourced, regionally representative, and directly aligned with the underserved populations the system is built to serve.

---

## 9. Scalability & Future Work

### Technical Scalability

| Component | Current Constraint | Planned Solution |
|---|---|---|
| **Outbreak Clustering** | O(N²) Python in-memory Haversine loop | Migrate to PostGIS `ST_DWithin` geospatial indexing on Supabase |
| **API Authentication** | Unauthenticated endpoints | Supabase Auth + FastAPI JWT middleware; rate limiting per farmer profile |
| **Image Storage** | Single Supabase bucket | CDN-backed delivery + tiered archival (hot/cold storage) as image volume grows |
| **AI Model** | General-purpose CLIP + Gemini | Fine-tuned LoRA adapters for South Asian & African livestock breeds |
| **Backend Deployment** | Likely Railway/Render single instance | Horizontal scaling via containerized deployment (Docker + Railway replicas) |

### Disease & Domain Expansion

- **Phase 2:** Expand the CLIP disease label list from 15 to 50+ conditions, prioritizing diseases endemic to target regions (e.g., Theileriosis, Lumpy Skin Disease, Trypanosomiasis).
- **Phase 3:** Extend to **poultry and aquaculture** — both critical protein sources in Southeast Asia and Sub-Saharan Africa.
- **Phase 4:** Integrate with national agricultural databases for disease prevalence priors, improving Bayesian reasoning in the diagnostic pipeline.

### Language & Accessibility Expansion

- **SMS/USSD Integration:** Enable diagnosis requests via basic mobile phones with no smartphone or internet data plan required — critical for the most remote farming communities.
- **Additional Languages:** Swahili, Bengali, Amharic, and other high-priority agricultural region languages.
- **Offline Mode:** Progressive Web App (PWA) caching of the most common disease profiles for fully offline preliminary guidance.
- **Native NLP Translation Layer:** Pre-process regional dialect symptom text with a dedicated translation model before passing to the English-prompted Gemini pipeline, reducing diagnostic accuracy loss from language nuance.

### Model Improvement Trajectory

```
Phase 1 (Current): General CLIP + Gemini 1.5 Flash
        ↓
Phase 2: Localized LoRA fine-tune on Supabase-archived South Asian livestock images
        ↓
Phase 3: Custom EfficientNet or ViT classifier trained on verified veterinary ground-truth labels
        ↓
Phase 4: On-device inference (TFLite/ONNX) for full offline capability in zero-connectivity zones
```

---

## 10. Ethical Statement

Animend was built on a simple, urgent premise: **the geographic accident of birth should not determine whether your livestock — and by extension, your family's livelihood — receives timely medical attention.**

We recognize that building AI for underserved populations carries a heightened ethical responsibility. These communities cannot easily self-advocate if our system fails them. They may not recognize a hallucinated drug dosage. They may trust a confident-sounding AI output when a human expert would know to question it. This asymmetry of information and power is precisely why we have designed safety not as a feature to be added later, but as a **foundational constraint** on the system.

Every architectural decision in Animend reflects this commitment:

- **We block prescription drug recommendations at the algorithm level** — not with UI disclaimers, but with hardcoded overrides that cannot be circumvented by any prompt.
- **We surface uncertainty honestly** — confidence scores and severity ratings are designed to communicate the limits of AI judgment, not to maximize user engagement.
- **We keep humans in authority** — the system escalates to veterinarians, not away from them. AI is the first responder; expertise remains the decision-maker.
- **We collect data with purpose** — every image archived is a future training data point for models that will be more accurate for the communities that contributed it.
- **We acknowledge our current limitations openly** — breed bias, language bias, unauthenticated endpoints, and the O(N²) clustering bottleneck are documented, not hidden. Responsible AI requires honesty about gaps, not only celebration of capabilities.

We are building Animend to be worthy of the trust that a subsistence farmer places in it when they hold up their phone to a sick calf and wait for an answer. That trust is not a metric. It is a moral obligation — and one we intend to earn.

---

*This document was prepared in accordance with responsible AI disclosure best practices and is intended to be a living artifact, updated as the system evolves toward production readiness.*

---

**Document End — Animend Responsible AI Documentation v1.0**
