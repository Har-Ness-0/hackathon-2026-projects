"""
Animend Backend — Outbreak Detection Routes

GET /api/outbreaks — Disease surveillance query

Returns [] gracefully when the database is not provisioned yet.
"""

from fastapi import APIRouter, HTTPException
from app.config import SUPABASE_URL, SUPABASE_SERVICE_KEY
from supabase import create_client
from datetime import datetime, timedelta
import math

router = APIRouter()

# ── Supabase client ─────────────────────────────────────────────
db = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# ── Outbreak detection parameters ───────────────────────────────

OUTBREAK_THRESHOLD = 3       # Minimum cases to trigger an alert
OUTBREAK_RADIUS_KM = 50      # Geographic cluster radius
OUTBREAK_WINDOW_HOURS = 48   # Time window for clustering


# ── Haversine distance ──────────────────────────────────────────

def haversine(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """Calculate distance in km between two GPS coordinates."""
    R = 6371  # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(math.radians(lat1))
        * math.cos(math.radians(lat2))
        * math.sin(dlng / 2) ** 2
    )
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


# ── GET /api/outbreaks ──────────────────────────────────────────

@router.get("/outbreaks")
async def get_outbreaks():
    """
    Scan recent diagnoses for geographic clusters of the same disease.
    """
    try:
        since = (datetime.utcnow() - timedelta(hours=OUTBREAK_WINDOW_HOURS)).isoformat()

        result = (
            db.table("diagnoses")
            .select("id,disease,severity,lat,lng,created_at")
            .gte("created_at", since)
            .not_.is_("lat", "null")
            .execute()
        )

        records = result.data or []
    except Exception as e:
        print(f"Supabase outbreak query failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to query database for outbreaks.")

    outbreaks = []
    processed = set()

    for i, rec in enumerate(records):
        if rec["id"] in processed:
            continue

        cluster = [rec]
        for j, other in enumerate(records):
            if i == j or other["id"] in processed:
                continue
            if rec["disease"] == other["disease"]:
                dist = haversine(
                    rec["lat"], rec["lng"],
                    other["lat"], other["lng"],
                )
                if dist <= OUTBREAK_RADIUS_KM:
                    cluster.append(other)

        if len(cluster) >= OUTBREAK_THRESHOLD:
            for r in cluster:
                processed.add(r["id"])

            severity_rank = {"low": 0, "medium": 1, "high": 2, "critical": 3}
            max_severity = max(
                cluster,
                key=lambda c: severity_rank.get(c.get("severity", "medium"), 1),
            )

            outbreaks.append({
                "disease": rec["disease"],
                "count": len(cluster),
                "severity": max_severity["severity"],
                "lat": sum(c["lat"] for c in cluster) / len(cluster),
                "lng": sum(c["lng"] for c in cluster) / len(cluster),
                "region": "Local Area",
            })

    return outbreaks
