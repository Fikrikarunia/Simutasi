<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApplicationDocument extends Model
{
    use HasFactory;

    protected $fillable = [
        'mutation_application_id',
        'document_type',
        'document_label',
        'file_path',
        'original_name',
        'file_size',
        'file_type',
        'is_valid',
        'notes',
    ];

    protected $casts = [
        'is_valid' => 'boolean',
    ];

    public function mutationApplication()
    {
        return $this->belongsTo(MutationApplication::class);
    }
}
