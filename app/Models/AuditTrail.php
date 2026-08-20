<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AuditTrail extends Model
{
    use HasFactory;

    protected $fillable = [
        'mutation_application_id',
        'user_id',
        'action',
        'status_before',
        'status_after',
        'description',
        'ip_address',
    ];

    public function mutationApplication()
    {
        return $this->belongsTo(MutationApplication::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
