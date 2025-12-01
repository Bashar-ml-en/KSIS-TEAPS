<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DepartmentTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_view_departments()
    {
        $user = User::factory()->create(['role' => 'hr_admin']);
        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeaders(['Authorization' => 'Bearer ' . $token])
            ->getJson('/api/departments');

        $response->assertStatus(200);
    }

    public function test_unauthenticated_user_cannot_view_departments()
    {
        $response = $this->getJson('/api/departments');

        $response->assertStatus(401);
    }
}
