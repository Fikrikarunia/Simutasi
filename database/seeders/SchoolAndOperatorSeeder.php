<?php

namespace Database\Seeders;

use App\Models\School;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\File;

class SchoolAndOperatorSeeder extends Seeder
{
    public function run(): void
    {
        $jsonPath = database_path('data/schools_sd_smp.json');
        if (!File::exists($jsonPath)) {
            $this->command->error("File schools_sd_smp.json tidak ditemukan!");
            return;
        }

        $schoolsData = json_decode(File::get($jsonPath), true);
        if (!$schoolsData) {
            $this->command->error("Gagal membaca data sekolah dari JSON!");
            return;
        }

        $this->command->info("Memulai impor " . count($schoolsData) . " data sekolah (SD & SMP) dan pembuatan akun operator...");

        $defaultPassword = Hash::make('password');
        $chunks = array_chunk($schoolsData, 100);

        foreach ($chunks as $chunkIndex => $chunk) {
            DB::transaction(function () use ($chunk, $defaultPassword) {
                foreach ($chunk as $item) {
                    $npsn = trim($item['NPSN'] ?? '');
                    if (!$npsn) continue;

                    $name = trim($item['Nama Satuan Pendidikan'] ?? '');
                    $jenjang = strtoupper(trim($item['Bentuk Pendidikan'] ?? 'SD'));
                    $kecamatan = trim($item['Kecamatan'] ?? '');
                    $desa = trim($item['Desa'] ?? '');
                    $alamat = trim($item['Alamat'] ?? '');

                    $fullAddress = $alamat;
                    if ($desa) {
                        $fullAddress .= ($fullAddress ? ', Desa ' : 'Desa ') . $desa;
                    }
                    if ($kecamatan) {
                        $fullAddress .= ($fullAddress ? ', Kec. ' : 'Kec. ') . $kecamatan;
                    }

                    // 1. Create or Update School
                    $school = School::updateOrCreate(
                        ['npsn' => $npsn],
                        [
                            'name' => $name,
                            'address' => $fullAddress,
                            'kecamatan' => $kecamatan,
                            'jenjang' => $jenjang === 'SMP' ? 'SMP' : 'SD',
                        ]
                    );

                    // 2. Create or Update Operator User
                    $operatorEmail = "operator.{$npsn}@sekolah.id";
                    User::updateOrCreate(
                        ['email' => $operatorEmail],
                        [
                            'name' => "Operator {$name}",
                            'password' => $defaultPassword,
                            'role' => 'operator_sekolah',
                            'school_id' => $school->id,
                        ]
                    );
                }
            });

            $this->command->info("Selesai memproses chunk " . ($chunkIndex + 1) . " dari " . count($chunks));
        }

        $this->command->info("Sukses! Seluruh data sekolah SD & SMP serta akun operator telah berhasil diimpor.");
    }
}
