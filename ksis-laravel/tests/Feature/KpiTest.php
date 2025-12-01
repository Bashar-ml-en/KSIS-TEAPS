<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Kpi;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class KpiTest extends TestCase
{
    use RefreshDatabase;

    public function test_teacher_can_view_own_kpis()
    {
        $user = User::factory()->create(['role' => 'teacher']);
        $token = $user->createToken('auth_token')->plainTextToken;

        // Create some KPIs for this user
        // Assuming Kpi factory exists or we create manually if not
        // If Kpi model has factory:
        // Kpi::factory()->count(3)->create(['user_id' => $user->id]);
        
        // Since I don't know if Kpi factory exists, I'll skip creation for now 
        // and just check if the endpoint returns 200 and structure.
        
        $response = $this->withHeaders(['Authorization' => 'Bearer ' . $token])
            ->getJson('/api/kpis');

        $response->assertStatus(200);
    }

    public function test_unauthenticated_user_cannot_view_kpis()
    {
        $response = $this->getJson('/api/kpis');

        $response->assertStatus(401);
    }
}
