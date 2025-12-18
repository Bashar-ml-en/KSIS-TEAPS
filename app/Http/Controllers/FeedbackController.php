<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class FeedbackController extends Controller
{
    /**
     * Display a listing of feedback
     */
    public function index(Request $request)
    {
        $query = Feedback::with(['evaluation', 'teacher', 'feedbackBy']);

        // Filter by teacher
        if ($request->has('teacher_id')) {
            $query->where('teacher_id', $request->teacher_id);
        }

        // Filter by evaluation
        if ($request->has('evaluation_id')) {
            $query->where('evaluation_id', $request->evaluation_id);
        }

        // Filter by type
        if ($request->has('feedback_type')) {
            $query->where('feedback_type', $request->feedback_type);
        }

        // Filter by sentiment
        if ($request->has('sentiment_label')) {
            $query->where('sentiment_label', $request->sentiment_label);
        }

        // Filter by analysis status
        if ($request->has('is_analyzed')) {
            $query->where('is_analyzed', $request->boolean('is_analyzed'));
        }

        $feedback = $query->latest()->paginate($request->get('per_page', 15));

        return response()->json($feedback);
    }

    /**
     * Store newly created feedback
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'evaluation_id' => 'nullable|exists:evaluations,id',
            'teacher_id' => 'required|exists:teachers,id',
            'feedback_type' => 'required|in:principal,hr',
            'feedback_by' => 'required|exists:users,id',
            'feedback_text' => 'required|string',
        ]);

        $feedback = Feedback::create(array_merge($validated, [
            'is_analyzed' => false,
        ]));

        // Trigger NLP analysis asynchronously
        // In production, this should be a queued job
        try {
            $this->analyzeWithNLP($feedback);
        } catch (\Exception $e) {
            // Log error but don't fail the request
            \Log::error('NLP analysis failed: ' . $e->getMessage());
        }

        return response()->json([
            'message' => 'Feedback created successfully',
            'feedback' => $feedback->load(['evaluation', 'teacher', 'feedbackBy']),
        ], 201);
    }

    /**
     * Display the specified feedback
     */
    public function show($id)
    {
        $feedback = Feedback::with(['evaluation', 'teacher', 'feedbackBy'])->findOrFail($id);

        return response()->json($feedback);
    }

    /**
     * Analyze feedback with NLP service
     */
    public function analyze($id)
    {
        $feedback = Feedback::findOrFail($id);

        try {
            $this->analyzeWithNLP($feedback);

            return response()->json([
                'message' => 'Feedback analyzed successfully',
                'feedback' => $feedback->fresh(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'NLP analysis failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Call Django NLP service for analysis
     */
    /**
     * Call Local Sentiment Service for analysis
     */
    private function analyzeWithNLP(Feedback $feedback)
    {
        $sentimentService = new \App\Services\SentimentService();
        $result = $sentimentService->analyze($feedback->feedback_text);

        $feedback->update([
            'sentiment_score' => $result['score'] ?? 0,
            'sentiment_label' => $result['sentiment'] ?? 'neutral',
            'keywords' => $result['keywords'] ?? [],
            'topics' => $result['topics'] ?? [],
            'entities' => $result['entities'] ?? [],
            'is_analyzed' => true,
            'analyzed_at' => now(),
        ]);
        
        // Log the analysis for system auditing
        // We can check if AuditService is bound or instantiate it if needed, 
        // but for now this is internal logic.
    }
}
