<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ClassroomObservationTest extends TestCase
{
    use RefreshDatabase;

    public function test_principal_can_view_classroom_observations()
    {
        $user = User::factory()->create(['role' => 'principal']);
        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeaders(['Authorization' => 'Bearer ' . $token])
            ->getJson('/api/classroom-observations');

        $response->assertStatus(200);
    }

    public function test_hr_admin_can_view_classroom_observations()
    {
        $user = User::factory()->create(['role' => 'hr_admin']);
        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeaders(['Authorization' => 'Bearer ' . $token])
            ->getJson('/api/classroom-observations');

        $response->assertStatus(200);
    }

    public function test_unauthenticated_user_cannot_view_classroom_observations()
    {
        $response = $this->getJson('/api/classroom-observations');

        $response->assertStatus(401);
    }
}
