<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class KpiRequestTest extends TestCase
{
    use RefreshDatabase;

    public function test_principal_can_view_kpi_requests()
    {
        $user = User::factory()->create(['role' => 'principal']);
        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeaders(['Authorization' => 'Bearer ' . $token])
            ->getJson('/api/kpi-requests');

        $response->assertStatus(200);
    }

    public function test_hr_admin_can_view_kpi_requests()
    {
        $user = User::factory()->create(['role' => 'hr_admin']);
        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeaders(['Authorization' => 'Bearer ' . $token])
            ->getJson('/api/kpi-requests');

        $response->assertStatus(200);
    }

    public function test_unauthenticated_user_cannot_view_kpi_requests()
    {
        $response = $this->getJson('/api/kpi-requests');

        $response->assertStatus(401);
    }
}
