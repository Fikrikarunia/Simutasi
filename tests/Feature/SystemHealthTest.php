<?php

namespace Tests\Feature;

use App\Models\AuditTrail;
use App\Models\MutationApplication;
use App\Models\MutationLetter;
use App\Models\School;
use App\Models\Student;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class SystemHealthTest extends TestCase
{
    use RefreshDatabase;

    protected $adminUser;
    protected $operatorUser;
    protected $school;

    protected function setUp(): void
    {
        parent::setUp();

        $this->school = School::create([
            'npsn' => '20227510',
            'name' => 'SD ADVENT PARONGPONG',
            'address' => 'Jl. Kolonel Masturi, Parongpong',
            'kecamatan' => 'Parongpong',
            'jenjang' => 'SD',
        ]);

        $this->adminUser = User::create([
            'name' => 'Admin Dinas Pendidikan',
            'email' => 'admin@disdik.kbb.go.id',
            'password' => Hash::make('password'),
            'role' => 'admin_dinas',
            'school_id' => null,
        ]);

        $this->operatorUser = User::create([
            'name' => 'Operator SD Advent',
            'email' => 'operator.20227510@sekolah.id',
            'password' => Hash::make('password'),
            'role' => 'operator_sekolah',
            'school_id' => $this->school->id,
        ]);
    }

    public function test_landing_page_loads_successfully(): void
    {
        $response = $this->get('/');
        $response->assertStatus(200);
    }

    public function test_login_page_renders_successfully(): void
    {
        $response = $this->get('/login');
        $response->assertStatus(200);
    }

    public function test_login_with_admin_email(): void
    {
        $response = $this->post('/login', [
            'email' => 'admin@disdik.kbb.go.id',
            'password' => 'password',
        ]);

        $response->assertRedirect('/dashboard');
        $this->assertAuthenticatedAs($this->adminUser);
    }

    public function test_login_with_operator_npsn(): void
    {
        $response = $this->post('/login', [
            'email' => '20227510',
            'password' => 'password',
        ]);

        $response->assertRedirect('/dashboard');
        $this->assertAuthenticatedAs($this->operatorUser);
    }

    public function test_login_with_operator_email(): void
    {
        $response = $this->post('/login', [
            'email' => 'operator.20227510@sekolah.id',
            'password' => 'password',
        ]);

        $response->assertRedirect('/dashboard');
        $this->assertAuthenticatedAs($this->operatorUser);
    }

    public function test_login_fails_with_invalid_credentials(): void
    {
        $response = $this->post('/login', [
            'email' => '20227510',
            'password' => 'wrongpassword',
        ]);

        $response->assertSessionHasErrors('email');
        $this->assertGuest();
    }

    public function test_logout_works(): void
    {
        $this->actingAs($this->adminUser);
        $response = $this->post('/logout');

        $response->assertRedirect('/login');
        $this->assertGuest();
    }

    public function test_guest_cannot_access_dashboard(): void
    {
        $response = $this->get('/dashboard');
        $response->assertRedirect('/login');
    }

    public function test_admin_and_operator_can_access_dashboard(): void
    {
        $response = $this->actingAs($this->adminUser)->get('/dashboard');
        $response->assertStatus(200);

        $response = $this->actingAs($this->operatorUser)->get('/dashboard');
        $response->assertStatus(200);
    }

    public function test_mutation_pages_for_operator(): void
    {
        $response = $this->actingAs($this->operatorUser)->get('/mutation');
        $response->assertStatus(200);

        $response = $this->actingAs($this->operatorUser)->get('/mutation/create');
        $response->assertStatus(200);
    }

    public function test_mutation_submission_and_flow(): void
    {
        Storage::fake('local');

        $payload = [
            'type' => 'Keluar',
            'destination_region' => 'luar',
            'destination_city' => 'Kota Bandung',
            'nisn' => '1234567890',
            'name' => 'Budi Pratama',
            'destination_class' => 'Kelas 5',
            'school_origin_name' => 'SD ADVENT PARONGPONG',
            'school_origin_npsn' => '20227510',
            'school_destination_name' => 'SDN 1 KOTA BANDUNG',
            'school_destination_npsn' => '20299999',
            'reason' => 'Pindah domisili orang tua',
            'surat_pindah' => UploadedFile::fake()->create('surat.pdf', 500, 'application/pdf'),
            'rapor' => UploadedFile::fake()->create('rapor.pdf', 500, 'application/pdf'),
            'kk' => UploadedFile::fake()->create('kk.jpg', 500, 'image/jpeg'),
        ];

        $response = $this->actingAs($this->operatorUser)->post('/mutation', $payload);
        $response->assertRedirect('/dashboard');

        $app = MutationApplication::first();
        $this->assertNotNull($app);
        $this->assertEquals('1234567890', $app->student->nisn);
        $this->assertEquals('Diajukan', $app->status);

        // Show page
        $showResponse = $this->actingAs($this->operatorUser)->get("/mutation/{$app->id}");
        $showResponse->assertStatus(200);

        // Check Status Public API
        $apiResponse = $this->postJson('/api/check-status', [
            'query' => $app->registration_number,
        ]);
        $apiResponse->assertStatus(200)
            ->assertJson(['found' => true]);

        // Admin verification
        $verifyResponse = $this->actingAs($this->adminUser)->post("/mutation/{$app->id}/verify", [
            'action' => 'setujui',
            'notes' => 'Dokumen lengkap',
            'documents' => [],
        ]);
        $verifyResponse->assertRedirect();
        $this->assertEquals('Diverifikasi', $app->fresh()->status);

        // Issue letter
        $issueResponse = $this->actingAs($this->adminUser)->post("/mutation/{$app->id}/issue-letter", [
            'signed_by_name' => 'Pejabat Disdik',
            'signed_by_nip' => '198001012005011001',
            'signed_by_position' => 'Kabid SD',
        ]);
        $issueResponse->assertRedirect();
        $this->assertEquals('Selesai', $app->fresh()->status);

        // Verify letter model created
        $letter = MutationLetter::where('mutation_application_id', $app->id)->first();
        $this->assertNotNull($letter);

        // Public verification page using QR Hash
        $verifyPublic = $this->get("/verify-letter/{$letter->qr_code_hash}");
        $verifyPublic->assertStatus(200);

        // Preview letter (PDF)
        $previewResponse = $this->actingAs($this->adminUser)->get("/mutation/{$app->id}/preview-letter");
        $previewResponse->assertStatus(200);

        // Download letter (PDF)
        $downloadResponse = $this->actingAs($this->adminUser)->get("/mutation/{$app->id}/download-letter");
        $downloadResponse->assertStatus(200);

        // Document view
        $doc = $app->documents()->first();
        if ($doc) {
            $docViewResponse = $this->actingAs($this->operatorUser)->get("/document/{$doc->id}/view");
            $docViewResponse->assertStatus(200);
        }
    }

    public function test_mutation_search_and_filter(): void
    {
        $response = $this->actingAs($this->adminUser)->get('/mutation?search=Budi&type=Keluar');
        $response->assertStatus(200);
    }
}

