import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .nlp_engine import analyze_text
from .serializers import sentiment_result_to_dict


def health(request):
    return JsonResponse({"status": "OK", "service": "KSIS-NLP - Evaluation and Performance System"})

# ...existing code...
def root(request):
    return health(request)
# ...existing code...
@csrf_exempt
def analyze_feedback(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=405)

    try:
        data = json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    text = data.get("text", "")
    if not text:
        return JsonResponse({"error": "Text is required"}, status=400)

    result = analyze_text(text)
    return JsonResponse(sentiment_result_to_dict(result))
