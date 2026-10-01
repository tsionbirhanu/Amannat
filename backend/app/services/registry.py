"""Core registry logic shared by the agency router and the voice router.

Plain functions (no FastAPI dependencies) so routers can import them without
importing each other.
"""
import difflib
import re
from datetime import datetime, timedelta
from typing import List, Optional

from sqlmodel import Session, func, or_, select

from app.models import Agency, Report, utc_now

RECENT_REPORT_WINDOW = timedelta(days=182)  # ~6 months
MIN_MATCH_NAME_LENGTH = 3
FUZZY_MATCH_CUTOFF = 0.85
# Words too common to identify an agency on their own (ignored when fuzzy matching)
GENERIC_NAME_WORDS = {
    "a", "an", "the", "this", "that", "my", "is", "at", "from", "of", "and",
    "agency", "agencies", "employment", "recruitment", "placement", "staffing",
    "services", "company", "co", "llc", "ltd", "plc", "inc",
}


def search_agencies(session: Session, q: str, limit: int = 20, offset: int = 0) -> List[Agency]:
    search_term = q.strip()
    if not search_term:
        return []

    pattern = f"%{search_term}%"
    statement = (
        select(Agency)
        .where(
            or_(
                Agency.name.ilike(pattern),
                Agency.license_no.ilike(pattern),
                Agency.phone.ilike(pattern),
                Agency.location.ilike(pattern),
            )
        )
        .offset(offset)
        .limit(limit)
    )
    return list(session.exec(statement).all())


def get_report_flags(session: Session, agency_id: str, since: Optional[datetime] = None) -> List[dict]:
    """Aggregated report counts per category (FR-2.4: never exposes individual reports)."""
    statement = select(Report.category, func.count(Report.id)).where(Report.agency_id == agency_id)
    if since is not None:
        statement = statement.where(Report.created_at >= since)
    statement = statement.group_by(Report.category)
    return [{"category": cat, "count": count} for cat, count in session.exec(statement).all()]


def _tokens(text: str) -> List[str]:
    return re.findall(r"[a-z0-9]+", text.lower())


def _distinctive(tokens: List[str]) -> List[str]:
    return [t for t in tokens if t not in GENERIC_NAME_WORDS]


def match_agency_by_name(session: Session, text: str) -> Optional[Agency]:
    """Best-effort match of an agency mentioned in free text.

    1. Exact phrase: an agency name appearing in the text on word boundaries
       (longest name wins, so "Bad Agency LLC" beats "Bad Agency").
    2. Fuzzy: compare the distinctive part of each name (generic words like
       "agency" or "this" removed, so "Test Agency" doesn't match "this agency")
       against same-length word windows of the text with difflib.
    """
    agencies = [a for a in session.exec(select(Agency)).all() if len(a.name.strip()) >= MIN_MATCH_NAME_LENGTH]
    if not agencies:
        return None

    text_tokens = _tokens(text)
    padded_text = f" {' '.join(text_tokens)} "
    phrase_hits = [a for a in agencies if _tokens(a.name) and f" {' '.join(_tokens(a.name))} " in padded_text]
    if phrase_hits:
        return max(phrase_hits, key=lambda a: len(a.name))

    words = _distinctive(text_tokens)
    best: Optional[Agency] = None
    best_ratio = FUZZY_MATCH_CUTOFF
    for agency in agencies:
        name_words = _distinctive(_tokens(agency.name))
        name = " ".join(name_words)
        if len(name) < MIN_MATCH_NAME_LENGTH:
            continue
        width = len(name_words)
        for i in range(max(len(words) - width + 1, 1)):
            window = " ".join(words[i:i + width])
            ratio = difflib.SequenceMatcher(None, name, window).ratio()
            if ratio >= best_ratio:
                best, best_ratio = agency, ratio
    return best


def describe_agency_safety(session: Session, agency: Agency) -> str:
    """Human-readable, data-backed summary suitable for text-to-speech."""
    flags = get_report_flags(session, agency.id, since=utc_now() - RECENT_REPORT_WINDOW)
    total = sum(f["count"] for f in flags)
    report_word = "report" if total == 1 else "reports"

    summary = f"{agency.name} is {agency.verification_status} with {total} {report_word} in the last 6 months"
    if flags:
        breakdown = ", ".join(
            f"{f['count']} {f['category'].replace('_', ' ')}"
            for f in sorted(flags, key=lambda f: -f["count"])
        )
        summary += f" ({breakdown})"
    return summary + "."
