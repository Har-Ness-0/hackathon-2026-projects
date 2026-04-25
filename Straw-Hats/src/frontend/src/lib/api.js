/**
 * Animend Frontend — API Client
 *
 * All requests to the FastAPI backend. Uses real HTTP calls via axios.
 * Every function has error handling so the UI never crashes on network failures.
 */

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  timeout: 60000, // 60s — HF Vision + Gemini dual pipeline
});

/**
 * POST /api/diagnose
 * Sends image + symptoms as multipart/form-data → returns AI diagnosis JSON.
 */
export async function submitDiagnosis({
  image,
  animalType,
  symptoms,
  language,
  lat,
  lng,
}) {
  const form = new FormData();
  form.append("image", image); // File object
  form.append("animal_type", animalType); // livestock type from AnimalSelector
  form.append("symptoms", symptoms); // string
  form.append("language", language || "en"); // 'en'|'ne'|'hi'
  if (lat != null) form.append("lat", String(lat));
  if (lng != null) form.append("lng", String(lng));

  const res = await api.post("/api/diagnose", form, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 60000,
  });
  return res.data; // DiagnosisResponse object
}

/**
 * GET /api/diagnoses
 * Returns all diagnosis records for map rendering. Returns [] on error.
 */
export async function getAllDiagnoses() {
  try {
    const res = await api.get("/api/diagnoses");
    return res.data || [];
  } catch (err) {
    console.warn("[API] getAllDiagnoses failed:", err.message);
    return [];
  }
}

/**
 * GET /api/diagnoses/:id
 * Returns a single diagnosis record.
 */
export async function getDiagnosis(id) {
  const res = await api.get(`/api/diagnoses/${id}`);
  if (res?.data?.not_found) {
    throw new Error("Diagnosis not found");
  }
  return res.data;
}

/**
 * GET /api/outbreaks
 * Returns outbreak alert clusters. Returns [] on error.
 */
export async function getOutbreaks() {
  try {
    const res = await api.get("/api/outbreaks");
    return res.data || [];
  } catch (err) {
    console.warn("[API] getOutbreaks failed:", err.message);
    return [];
  }
}

/**
 * POST /api/feedback
 * Farmer confirms or corrects a diagnosis.
 */
export async function submitFeedback(id, isCorrect, correction) {
  try {
    const res = await api.post("/api/feedback", {
      diagnosis_id: id,
      is_correct: isCorrect,
      correction: correction || null,
    });
    return res.data;
  } catch (err) {
    console.warn("[API] submitFeedback failed:", err.message);
    return { success: false };
  }
}
