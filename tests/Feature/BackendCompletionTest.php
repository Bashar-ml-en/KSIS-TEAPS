<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Teacher;
use App\Models\Department;
use App\Models\Contract;
use App\Models\SystemConfiguration;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BackendCompletionTest extends TestCase
{
    // use RefreshDatabase; // Commented out to avoid wiping existing seeded data if env is not testing

    protected $hrAdmin;
    protected $principal;
    protected $teacher;
    protected $department;

    protected function setUp(): void
    {
        parent::setUp();

        // Create users if they don't exist (using existing seeded users if possible)
        $this->hrAdmin = User::where('email', 'hr@ksis.edu.my')->first();
        if (!$this->hrAdmin) {
            $this->hrAdmin = User::factory()->create(['role' => 'hr_admin', 'email' => 'hr@ksis.edu.my']);
        }

        $this->principal = User::where('email', 'principal@ksis.edu.my')->first();
        if (!$this->principal) {
            $this->principal = User::factory()->create(['role' => 'principal', 'email' => 'principal@ksis.edu.my']);
        }

        $this->teacher = User::where('role', 'teacher')->first();
        if (!$this->teacher) {
            $this->teacher = User::factory()->create(['role' => 'teacher']);
            $this->department = Department::first() ?? Department::factory()->create();
            Teacher::factory()->create([
                'user_id' => $this->teacher->id,
                'department_id' => $this->department->id
            ]);
        }
    }

    /**
     * Priority 3: Configuration Service Tests
     */
    public function test_hr_admin_can_update_configuration()
    {
        $payload = [
            'value' => ['test_setting' => 'enabled'],
            'description' => 'Test configuration update'
        ];

        $response = $this->actingAs($this->hrAdmin)
            ->postJson('/api/config/test_config', $payload);

        $response->assertStatus(200)
            ->assertJsonPath('config.key', 'test_config')
            ->assertJsonPath('config.version', 1);
            
        // Verify it's in the database
        $this->assertDatabaseHas('system_configurations', [
            'key' => 'test_config',
            'version' => 1
        ]);
    }

    public function test_teacher_cannot_update_configuration()
    {
        $payload = ['value' => ['test' => 'fail']];

        $response = $this->actingAs($this->teacher)
            ->postJson('/api/config/test_config', $payload);

        $response->assertStatus(403); // Forbidden
    }

    /**
     * Priority 4: HR Reports Tests
     */
    public function test_hr_admin_can_generate_school_report()
    {
        $response = $this->actingAs($this->hrAdmin)
            ->getJson('/api/reports/school?year=' . now()->year);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'type',
                'year',
                'statistics' => ['total_teachers', 'average_score'],
                'rating_distribution'
            ]);
    }

    public function test_hr_admin_can_export_report_csv()
    {
        $response = $this->actingAs($this->hrAdmin)
            ->get('/api/reports/export?type=school');

        $response->assertStatus(200);
        $this->assertEquals('text/csv; charset=UTF-8', $response->headers->get('Content-Type'));
    }

    /**
     * Priority 5: Contract Management Tests
     */
    public function test_hr_admin_can_create_contract()
    {
        $teacherRecord = Teacher::where('user_id', $this->teacher->id)->first();

        $payload = [
            'teacher_id' => $teacherRecord->id,
            'start_date' => now()->format('Y-m-d'),
            'end_date' => now()->addYear()->format('Y-m-d'),
            'type' => 'contract',
            'status' => 'active',
            'notes' => 'Test contract'
        ];

        $response = $this->actingAs($this->hrAdmin)
            ->postJson('/api/contracts', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('contract.teacher_id', $teacherRecord->id);

        $this->assertDatabaseHas('contracts', [
            'teacher_id' => $teacherRecord->id,
            'type' => 'contract'
        ]);
    }

    public function test_principal_can_view_contracts()
    {
        $response = $this->actingAs($this->principal)
            ->getJson('/api/contracts');

        $response->assertStatus(200);
    }

    /**
     * Priority 5: Engagement Dashboard Tests
     */
    public function test_teacher_can_view_engagement_metrics()
    {
        $response = $this->actingAs($this->teacher)
            ->getJson('/api/engagement/metrics');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'teacher_id',
                'metrics' => ['kpis_created', 'cpe_hours', 'observations_count'],
                'engagement_score',
                'rating'
            ]);
    }
}
