<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MutationLetter extends Model
{
    use HasFactory;

    protected $fillable = [
        'mutation_application_id',
        'letter_number',
        'qr_code_hash',
        'signed_by_name',
        'signed_by_nip',
        'signed_by_position',
        'issued_at',
        'pdf_path',
    ];

    protected $casts = [
        'issued_at' => 'datetime',
    ];

    public function mutationApplication()
    {
        return $this->belongsTo(MutationApplication::class);
    }
}
