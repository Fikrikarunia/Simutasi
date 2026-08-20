<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('application_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mutation_application_id')->constrained('mutation_applications')->onDelete('cascade');
            $table->string('document_type'); // e.g. surat_keterangan_pindah, fotokopi_rapor, kartu_keluarga
            $table->string('document_label');
            $table->string('file_path');
            $table->string('original_name');
            $table->integer('file_size');
            $table->string('file_type');
            $table->boolean('is_valid')->nullable(); // null=unverified, true=sesuai, false=tidak sesuai
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('application_documents');
    }
};
