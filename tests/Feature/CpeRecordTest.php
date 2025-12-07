<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CpeRecordTest extends TestCase
{
    use RefreshDatabase;

    public function test_teacher_can_view_own_cpe_records()
    {
        $user = User::factory()->create(['role' => 'teacher']);
        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeaders(['Authorization' => 'Bearer ' . $token])
            ->getJson('/api/mycpe-records');

        $response->assertStatus(200);
    }

    public function test_unauthenticated_user_cannot_view_cpe_records()
    {
        $response = $this->getJson('/api/mycpe-records');

        $response->assertStatus(401);
    }
}
