"""
Animend Backend — FastAPI Application Entry Point

Creates the app instance, configures CORS for the Vercel frontend,
and registers all route modules under the /api prefix.

Run locally with:
    uvicorn app.main:app --reload --port 8000
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import diagnose, outbreaks, feedback

app = FastAPI(
    title="Animend API",
    version="1.0.0",
    description="AI-Powered Livestock Disease Detection for the Developing World",
)

# ── CORS — allow requests from the frontend ─────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://animend.vercel.app",   # Production frontend
        "http://localhost:5173",         # Vite dev server
        "http://localhost:3000",         # Fallback dev port
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Register route modules ──────────────────────────────────────

app.include_router(diagnose.router, prefix="/api", tags=["Diagnosis"])
app.include_router(outbreaks.router, prefix="/api", tags=["Outbreaks"])
app.include_router(feedback.router, prefix="/api", tags=["Feedback"])


# ── Health check ─────────────────────────────────────────────────

@app.get("/health", tags=["Health"])
async def health():
    """Health check endpoint for Railway keep-alive pings and monitoring."""
    return {"status": "ok", "version": "1.0.0"}
