<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('mutation_applications', function (Blueprint $table) {
            if (!Schema::hasColumn('mutation_applications', 'school_origin_npsn')) {
                $table->string('school_origin_npsn')->nullable()->after('school_origin_name');
            }
            if (!Schema::hasColumn('mutation_applications', 'school_destination_npsn')) {
                $table->string('school_destination_npsn')->nullable()->after('school_destination_name');
            }
        });
    }

    public function down(): void
    {
        Schema::table('mutation_applications', function (Blueprint $table) {
            if (Schema::hasColumn('mutation_applications', 'school_origin_npsn')) {
                $table->dropColumn('school_origin_npsn');
            }
            if (Schema::hasColumn('mutation_applications', 'school_destination_npsn')) {
                $table->dropColumn('school_destination_npsn');
            }
        });
    }
};
