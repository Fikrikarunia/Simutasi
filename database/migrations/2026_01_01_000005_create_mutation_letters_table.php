<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mutation_letters', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mutation_application_id')->constrained('mutation_applications')->onDelete('cascade');
            $table->string('letter_number')->unique();
            $table->string('qr_code_hash')->unique();
            $table->string('signed_by_name')->default('Popi Siti Ichsanniaty, S.Pd., M.Pd');
            $table->string('signed_by_nip')->default('197711142009012001');
            $table->string('signed_by_position')->default('Kepala Bidang Pembinaan SD / Ub. Analis Sub Koordinasi Kesiswaan SD');
            $table->timestamp('issued_at')->useCurrent();
            $table->string('pdf_path')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mutation_letters');
    }
};
