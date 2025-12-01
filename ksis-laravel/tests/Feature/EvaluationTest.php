<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Teacher;
use App\Models\Evaluation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EvaluationTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_view_evaluations()
    {
        $user = User::factory()->create(['role' => 'hr_admin']);
        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeaders(['Authorization' => 'Bearer ' . $token])
            ->getJson('/api/evaluations');

        $response->assertStatus(200);
    }

    public function test_unauthenticated_user_cannot_view_evaluations()
    {
        $response = $this->getJson('/api/evaluations');

        $response->assertStatus(401);
    }

    public function test_teacher_can_view_own_evaluations()
    {
        $user = User::factory()->create(['role' => 'teacher']);
        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeaders(['Authorization' => 'Bearer ' . $token])
            ->getJson('/api/evaluations');

        $response->assertStatus(200);
    }
}
