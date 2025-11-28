from .nlp_engine import SentimentResult


def sentiment_result_to_dict(result: SentimentResult) -> dict:
    return {
        "sentiment": result.sentiment,
        "score": result.score,
        "keywords": result.keywords,
    }
