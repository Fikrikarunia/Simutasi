<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\School;
use App\Models\Student;
use App\Models\MutationApplication;
use App\Models\ApplicationDocument;
use App\Models\MutationLetter;
use App\Models\AuditTrail;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Schools
        $sch1 = School::create([
            'npsn' => '20200001',
            'name' => 'SDN 1 Lembang',
            'address' => 'Jl. Raya Lembang No. 45, Lembang',
            'kecamatan' => 'Lembang',
            'jenjang' => 'SD',
        ]);

        $sch2 = School::create([
            'npsn' => '20200002',
            'name' => 'SMPN 2 Ngamprah',
            'address' => 'Jl. Raya Ngamprah No. 12',
            'kecamatan' => 'Ngamprah',
            'jenjang' => 'SMP',
        ]);

        $sch3 = School::create([
            'npsn' => '20200003',
            'name' => 'SMPN 1 Padalarang',
            'address' => 'Jl. Stasion No. 88, Padalarang',
            'kecamatan' => 'Padalarang',
            'jenjang' => 'SMP',
        ]);

        $sch4 = School::create([
            'npsn' => '20200004',
            'name' => 'SD Negeri Bandung Barat',
            'address' => 'Komplek Pemkab Bandung Barat, Cisarua',
            'kecamatan' => 'Cisarua',
            'jenjang' => 'SD',
        ]);

        $sch5 = School::create([
            'npsn' => '20200005',
            'name' => 'SDN Winayamukti',
            'address' => 'Kecamatan Gununghalu',
            'kecamatan' => 'Gununghalu',
            'jenjang' => 'SD',
        ]);

        // 2. Create Users
        $adminDinas = User::create([
            'name' => 'Admin Dinas Pendidikan',
            'email' => 'admin@disdik.kbb.go.id',
            'password' => Hash::make('password'),
            'role' => 'admin_dinas',
            'school_id' => null,
        ]);

        $opBandungBarat = User::create([
            'name' => 'Operator SD Negeri Bandung Barat',
            'email' => 'operator@sdn1bandungbarat.sch.id',
            'password' => Hash::make('password'),
            'role' => 'operator_sekolah',
            'school_id' => $sch4->id,
        ]);

        $opLembang = User::create([
            'name' => 'Operator SDN 1 Lembang',
            'email' => 'operator@sdn1lembang.sch.id',
            'password' => Hash::make('password'),
            'role' => 'operator_sekolah',
            'school_id' => $sch1->id,
        ]);

        User::create([
            'name' => 'Super Administrator System',
            'email' => 'superadmin@disdik.kbb.go.id',
            'password' => Hash::make('password'),
            'role' => 'super_admin',
            'school_id' => null,
        ]);

        // 3. Create Students & Mutation Applications
        
        // App 1: Ahmad Budi Santoso (Diajukan)
        $std1 = Student::create([
            'nisn' => '0123456789',
            'nis' => '1029384',
            'name' => 'Ahmad Budi Santoso',
            'gender' => 'L',
            'birth_place' => 'Bandung',
            'birth_date' => '2015-05-12',
            'current_class' => 'Kelas 4',
        ]);

        $app1 = MutationApplication::create([
            'registration_number' => 'REG-2023-001',
            'type' => 'Masuk',
            'student_id' => $std1->id,
            'school_origin_id' => $sch1->id,
            'school_origin_name' => 'SDN 1 Lembang',
            'school_origin_npsn' => '20200001',
            'school_destination_id' => $sch2->id,
            'school_destination_name' => 'SMPN 2 Ngamprah',
            'school_destination_npsn' => '20200002',
            'destination_class' => 'Kelas 7',
            'reason' => 'Pindah domisili mengikuti orang tua bekerja di Padalarang',
            'status' => 'Diajukan',
            'operator_user_id' => $opLembang->id,
            'submitted_at' => now()->subHours(5),
        ]);

        ApplicationDocument::create([
            'mutation_application_id' => $app1->id,
            'document_type' => 'surat_keterangan_pindah',
            'document_label' => 'Surat Pindah dari Sekolah Asal',
            'file_path' => 'documents/surat_pindah_sample.pdf',
            'original_name' => 'Surat_Pindah_Ahmad.pdf',
            'file_size' => 1258291,
            'file_type' => 'application/pdf',
            'is_valid' => null,
        ]);
        ApplicationDocument::create([
            'mutation_application_id' => $app1->id,
            'document_type' => 'fotokopi_rapor',
            'document_label' => 'Fotokopi Rapor (Legalisir)',
            'file_path' => 'documents/rapor_sample.pdf',
            'original_name' => 'Rapor_Legalisir_Ahmad.pdf',
            'file_size' => 2097152,
            'file_type' => 'application/pdf',
            'is_valid' => null,
        ]);
        ApplicationDocument::create([
            'mutation_application_id' => $app1->id,
            'document_type' => 'kartu_keluarga',
            'document_label' => 'Kartu Keluarga (KK)',
            'file_path' => 'documents/kk_sample.jpg',
            'original_name' => 'KK_Ahmad.jpg',
            'file_size' => 819200,
            'file_type' => 'image/jpeg',
            'is_valid' => null,
        ]);

        AuditTrail::create([
            'mutation_application_id' => $app1->id,
            'user_id' => $opLembang->id,
            'action' => 'Pengajuan Dibuat',
            'status_before' => null,
            'status_after' => 'Diajukan',
            'description' => 'Operator sekolah mengajukan permohonan mutasi masuk untuk Ahmad Budi Santoso.',
            'ip_address' => '127.0.0.1',
            'created_at' => now()->subHours(5),
        ]);

        // App 2: Siti Aminah (Diverifikasi)
        $std2 = Student::create([
            'nisn' => '9876543210',
            'nis' => '1029385',
            'name' => 'Siti Aminah',
            'gender' => 'P',
            'birth_place' => 'Cimahi',
            'birth_date' => '2014-08-20',
            'current_class' => 'Kelas 5',
        ]);

        $app2 = MutationApplication::create([
            'registration_number' => 'REG-2023-002',
            'type' => 'Keluar',
            'student_id' => $std2->id,
            'school_origin_id' => $sch3->id,
            'school_origin_name' => 'SMPN 1 Padalarang',
            'school_origin_npsn' => '20200003',
            'school_destination_id' => null,
            'school_destination_name' => 'Luar Kota Bandung (SMPN 1 Kota Bandung)',
            'school_destination_npsn' => '20299999',
            'destination_class' => 'Kelas 8',
            'reason' => 'Mengikuti orang tua tugas dinas',
            'status' => 'Diverifikasi',
            'operator_user_id' => $opBandungBarat->id,
            'verifier_user_id' => $adminDinas->id,
            'submitted_at' => now()->subDays(1),
            'verified_at' => now()->subHours(2),
        ]);

        ApplicationDocument::create([
            'mutation_application_id' => $app2->id,
            'document_type' => 'surat_keterangan_pindah',
            'document_label' => 'Surat Keterangan Pindah Sekolah',
            'file_path' => 'documents/surat_pindah_siti.pdf',
            'original_name' => 'Surat_Pindah_Siti.pdf',
            'file_size' => 1048576,
            'file_type' => 'application/pdf',
            'is_valid' => true,
        ]);
        ApplicationDocument::create([
            'mutation_application_id' => $app2->id,
            'document_type' => 'fotokopi_rapor',
            'document_label' => 'Fotokopi Rapor Terakhir',
            'file_path' => 'documents/rapor_siti.pdf',
            'original_name' => 'Rapor_Siti.pdf',
            'file_size' => 1843200,
            'file_type' => 'application/pdf',
            'is_valid' => true,
        ]);

        AuditTrail::create([
            'mutation_application_id' => $app2->id,
            'user_id' => $opBandungBarat->id,
            'action' => 'Pengajuan Dibuat',
            'status_before' => null,
            'status_after' => 'Diajukan',
            'description' => 'Operator sekolah mengajukan permohonan mutasi keluar.',
            'ip_address' => '127.0.0.1',
            'created_at' => now()->subDays(1),
        ]);
        AuditTrail::create([
            'mutation_application_id' => $app2->id,
            'user_id' => $adminDinas->id,
            'action' => 'Verifikasi Dokumen',
            'status_before' => 'Diajukan',
            'status_after' => 'Diverifikasi',
            'description' => 'Seluruh dokumen telah diverifikasi lengkap oleh Admin Dinas.',
            'ip_address' => '127.0.0.1',
            'created_at' => now()->subHours(2),
        ]);

        // App 3: Budi Santoso (Dikembalikan)
        $std3 = Student::create([
            'nisn' => '0098765432',
            'nis' => '1029386',
            'name' => 'Budi Santoso',
            'gender' => 'L',
            'birth_place' => 'Jakarta',
            'birth_date' => '2016-01-10',
            'current_class' => 'Kelas 4',
        ]);

        $app3 = MutationApplication::create([
            'registration_number' => 'REG-2023-003',
            'type' => 'Masuk',
            'student_id' => $std3->id,
            'school_origin_id' => null,
            'school_origin_name' => 'SD Negeri 1 Jakarta',
            'school_origin_npsn' => '20100099',
            'school_destination_id' => $sch4->id,
            'school_destination_name' => 'SD Negeri Bandung Barat',
            'school_destination_npsn' => '20200004',
            'destination_class' => 'Kelas 4',
            'reason' => 'Pindah rumah ke Cisarua Bandung Barat',
            'status' => 'Dikembalikan',
            'rejection_note' => 'Fotokopi rapor belum dilegalisir oleh kepala sekolah asal. Mohon diunggah ulang versi stempel basah/legalisir.',
            'operator_user_id' => $opBandungBarat->id,
            'verifier_user_id' => $adminDinas->id,
            'submitted_at' => now()->subDays(2),
        ]);

        ApplicationDocument::create([
            'mutation_application_id' => $app3->id,
            'document_type' => 'fotokopi_rapor',
            'document_label' => 'Fotokopi Rapor (Legalisir)',
            'file_path' => 'documents/rapor_budi.pdf',
            'original_name' => 'Rapor_Budi.pdf',
            'file_size' => 1500000,
            'file_type' => 'application/pdf',
            'is_valid' => false,
            'notes' => 'Stempel legalisir belum ada',
        ]);

        AuditTrail::create([
            'mutation_application_id' => $app3->id,
            'user_id' => $opBandungBarat->id,
            'action' => 'Pengajuan Dibuat',
            'status_before' => null,
            'status_after' => 'Diajukan',
            'description' => 'Operator sekolah mengajukan permohonan mutasi.',
            'ip_address' => '127.0.0.1',
            'created_at' => now()->subDays(2),
        ]);
        AuditTrail::create([
            'mutation_application_id' => $app3->id,
            'user_id' => $adminDinas->id,
            'action' => 'Pengajuan Dikembalikan',
            'status_before' => 'Diajukan',
            'status_after' => 'Dikembalikan',
            'description' => 'Dokumen belum lengkap: Fotokopi rapor belum dilegalisir.',
            'ip_address' => '127.0.0.1',
            'created_at' => now()->subDays(1),
        ]);

        // App 4: Dewi Lestari (Selesai)
        $std4 = Student::create([
            'nisn' => '0144118060',
            'nis' => '1029387',
            'name' => 'Ai Rismawati',
            'gender' => 'P',
            'birth_place' => 'Bandung Barat',
            'birth_date' => '2014-06-06',
            'current_class' => 'V (Lima)',
        ]);

        $app4 = MutationApplication::create([
            'registration_number' => 'REG-2023-004',
            'type' => 'Keluar',
            'student_id' => $std4->id,
            'school_origin_id' => $sch5->id,
            'school_origin_name' => 'SDN Winayamukti Kec. Gununghalu',
            'school_origin_npsn' => '20200005',
            'school_destination_id' => null,
            'school_destination_name' => 'SDN Pamarican 1 Kec. Kasemen Kab. Serang Prov. Banten',
            'school_destination_npsn' => '20600123',
            'destination_class' => 'V (Lima)',
            'reason' => 'Mengikuti orang tua',
            'status' => 'Selesai',
            'operator_user_id' => $opBandungBarat->id,
            'verifier_user_id' => $adminDinas->id,
            'submitted_at' => now()->subDays(5),
            'verified_at' => now()->subDays(4),
            'completed_at' => now()->subDays(3),
        ]);

        $letterHash = Str::random(32);
        MutationLetter::create([
            'mutation_application_id' => $app4->id,
            'letter_number' => '400.3.5.1/79-Bid. SD/2026',
            'qr_code_hash' => $letterHash,
            'signed_by_name' => 'Popi Siti Ichsanniaty, S.Pd., M.Pd',
            'signed_by_nip' => '197711142009012001',
            'signed_by_position' => 'Analis Sub Koordinator Kesiswaan SD',
            'issued_at' => now()->subDays(3),
        ]);

        AuditTrail::create([
            'mutation_application_id' => $app4->id,
            'user_id' => $opBandungBarat->id,
            'action' => 'Pengajuan Dibuat',
            'status_before' => null,
            'status_after' => 'Diajukan',
            'description' => 'Pengajuan mutasi keluar dibuat oleh operator.',
            'ip_address' => '127.0.0.1',
            'created_at' => now()->subDays(5),
        ]);
        AuditTrail::create([
            'mutation_application_id' => $app4->id,
            'user_id' => $adminDinas->id,
            'action' => 'Verifikasi Lengkap',
            'status_before' => 'Diajukan',
            'status_after' => 'Diverifikasi',
            'description' => 'Pemeriksaan kelengkapan berkas disetujui.',
            'ip_address' => '127.0.0.1',
            'created_at' => now()->subDays(4),
        ]);
        AuditTrail::create([
            'mutation_application_id' => $app4->id,
            'user_id' => $adminDinas->id,
            'action' => 'Penerbitan Surat Digital',
            'status_before' => 'Surat Diproses',
            'status_after' => 'Selesai',
            'description' => 'Surat Rekomendasi Mutasi nomor 400.3.5.1/79-Bid. SD/2026 telah diterbitkan dengan QR Code verifikasi.',
            'ip_address' => '127.0.0.1',
            'created_at' => now()->subDays(3),
        ]);
    }
}
