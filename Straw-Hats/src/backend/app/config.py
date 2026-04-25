"""
Animend Backend — Environment Configuration

Loads all required secrets from .env at import time.
GEMINI_API_KEY must be set — raises ValueError if missing.
SUPABASE keys log warnings only — DB may not be provisioned yet.
"""

import warnings
from dotenv import load_dotenv
import os
from pathlib import Path
os.environ["PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION"] = "python"

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

# ── Required secrets ────────────────────────────────────────────

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY", "")

# ── Optional config ─────────────────────────────────────────────

SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", "")
HF_API_KEY = os.getenv("HF_API_KEY", "")
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

# ── Validation ──────────────────────────────────────────────────

# Gemini is ready — hard fail if missing
if not GEMINI_API_KEY:
    raise ValueError(
        "GEMINI_API_KEY is not set. "
        "Get a free key at https://aistudio.google.com and add it to your .env file."
    )

# Supabase must be provisioned
if not SUPABASE_URL or SUPABASE_URL.startswith("https://your-"):
    raise ValueError(
        "SUPABASE_URL is not configured. "
        "Please provide the actual Supabase Project URL in the .env file."
    )

if not SUPABASE_SERVICE_KEY or SUPABASE_SERVICE_KEY.startswith("your-"):
    raise ValueError(
        "SUPABASE_SERVICE_KEY is not configured. "
        "Please provide the service role key in the .env file."
    )

if not HF_API_KEY or not HF_API_KEY.startswith("hf_"):
    import warnings
    warnings.warn(
        "HF_API_KEY is not set or invalid. "
        "The vision classifier will run in fallback mode. "
        "Get a free key at https://huggingface.co/settings/tokens"
    )

# Flag that routes can check before attempting DB calls
DB_READY = True
