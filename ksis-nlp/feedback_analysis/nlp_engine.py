from dataclasses import dataclass
from typing import List

POSITIVE_WORDS = {"good", "great", "excellent", "helpful", "clear", "supportive"}
NEGATIVE_WORDS = {"bad", "poor", "confusing", "late", "unfair", "boring"}


@dataclass
class SentimentResult:
    sentiment: str
    score: float
    keywords: List[str]


def analyze_text(text: str) -> SentimentResult:
    lower = text.lower()
    pos = sum(word in lower for word in POSITIVE_WORDS)
    neg = sum(word in lower for word in NEGATIVE_WORDS)

    if pos > neg:
        sentiment = "positive"
        score = 0.6 + 0.1 * pos
    elif neg > pos:
        sentiment = "negative"
        score = 0.6 + 0.1 * neg
    else:
        sentiment = "neutral"
        score = 0.5

    words = [w.strip(".,!?") for w in lower.split()]
    keywords = sorted(set([w for w in words if len(w) > 4]))[:10]

    return SentimentResult(sentiment=sentiment, score=float(score), keywords=keywords)
