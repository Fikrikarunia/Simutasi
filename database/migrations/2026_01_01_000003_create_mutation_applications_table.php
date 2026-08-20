<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mutation_applications', function (Blueprint $table) {
            $table->id();
            $table->string('registration_number')->unique();
            $table->enum('type', ['Masuk', 'Keluar']);
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
            
            $table->foreignId('school_origin_id')->nullable()->constrained('schools')->onDelete('set null');
            $table->string('school_origin_name');
            
            $table->foreignId('school_destination_id')->nullable()->constrained('schools')->onDelete('set null');
            $table->string('school_destination_name');
            
            $table->string('destination_class');
            $table->text('reason')->nullable();
            
            $table->enum('status', ['Diajukan', 'Dikembalikan', 'Diverifikasi', 'Surat Diproses', 'Selesai'])->default('Diajukan');
            $table->text('rejection_note')->nullable();
            
            $table->foreignId('operator_user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('verifier_user_id')->nullable()->constrained('users')->onDelete('set null');
            
            $table->timestamp('submitted_at')->useCurrent();
            $table->timestamp('verified_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mutation_applications');
    }
};
