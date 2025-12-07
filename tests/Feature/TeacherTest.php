<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TeacherTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_view_teachers_list()
    {
        $user = User::factory()->create(['role' => 'hr_admin']);
        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeaders(['Authorization' => 'Bearer ' . $token])
            ->getJson('/api/teachers');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'email']
                ]
            ]);
    }

    public function test_principal_can_view_teachers_list()
    {
        $user = User::factory()->create(['role' => 'principal']);
        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeaders(['Authorization' => 'Bearer ' . $token])
            ->getJson('/api/teachers');

        $response->assertStatus(200);
    }

    public function test_unauthenticated_user_cannot_view_teachers()
    {
        $response = $this->getJson('/api/teachers');

        $response->assertStatus(401);
    }
}
