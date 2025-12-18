<?php

namespace App\Services;

class SentimentService
{
    /**
     * Dictionary of sentiment lexicon.
     * In a real production environment, this would be much larger or loaded from a file/DB.
     */
    protected $lexicon = [
        // Positive (+1 to +4)
        'excellent' => 4, 'outstanding' => 4, 'amazing' => 4, 'perfect' => 4, 'superb' => 4,
        'great' => 3, 'good' => 2, 'impressive' => 3, 'strong' => 2, 'effective' => 2,
        'positive' => 2, 'improve' => 1, 'progress' => 1, 'well' => 1, 'nice' => 1,
        'demonstrated' => 1, 'achieved' => 2, 'success' => 3, 'proficient' => 2,
        
        // Negative (-1 to -4)
        'poor' => -3, 'bad' => -3, 'terrible' => -4, 'awful' => -4, 'failure' => -4,
        'weak' => -2, 'ineffective' => -2, 'negative' => -2, 'warned' => -2,
        'improve' => 0.5, // Context dependent, usually positive intent but implies lack
        'lack' => -2, 'missing' => -1, 'late' => -2, 'unprofessional' => -4,
        'disappointing' => -3, 'concern' => -2, 'issue' => -1, 'problem' => -2,
        'below' => -1, 'failed' => -3,
    ];

    /**
     * Modifiers that change the intensity or polarity of the next word.
     */
    protected $modifiers = [
        'very' => 1.5,
        'extremely' => 2.0,
        'not' => -1.0, // Inversion
        'hardly' => 0.5,
        'slightly' => 0.8,
        'highly' => 1.5,
    ];

    /**
     * Analyze text and return sentiment metrics.
     *
     * @param string $text
     * @return array
     */
    public function analyze(string $text): array
    {
        $words = $this->tokenize($text);
        $score = 0;
        $wordCount = 0;
        $keywords = [];

        for ($i = 0; $i < count($words); $i++) {
            $word = $words[$i];
            $baseScore = $this->lexicon[$word] ?? 0;

            if ($baseScore !== 0) {
                // Check for modifier in previous word
                $modifier = 1.0;
                if ($i > 0 && isset($this->modifiers[$words[$i - 1]])) {
                    $modifier = $this->modifiers[$words[$i - 1]];
                }

                $finalWordScore = $baseScore * $modifier;
                $score += $finalWordScore;
                
                // Track significant keywords
                if (abs($finalWordScore) >= 2) {
                    $keywords[] = $word;
                }
            }
            $wordCount++;
        }

        // Normalize score between -1 and 1
        // Using a sigmoid-like squash function or simple division
        // Let's assume max intensity is around 20 for a paragraph
        $normalizedScore = $wordCount > 0 ? $score / ($wordCount * 2 + 1) : 0; 
        // More sophisticated: $normalizedScore = $score / sqrt($score * $score + 15);
        $normalizedScore = $score / (abs($score) + 15); // Soft sign normalization

        return [
            'score' => round($normalizedScore, 4),
            'sentiment' => $this->getLabel($normalizedScore),
            'keywords' => array_unique($keywords),
            'topics' => [], // Topic modeling requires much more complex Logic/ML
            'entities' => [], // Named Entity Recognition (NER) is complex for regex
        ];
    }

    private function tokenize(string $text): array
    {
        // Simple regex tokenizer: lowercase and remove non-word chars
        $text = strtolower($text);
        preg_match_all('/\b\w+\b/', $text, $matches);
        return $matches[0] ?? [];
    }

    private function getLabel(float $score): string
    {
        if ($score >= 0.05) return 'positive';
        if ($score <= -0.05) return 'negative';
        return 'neutral';
    }
}
