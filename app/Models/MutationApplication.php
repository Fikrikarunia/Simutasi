<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MutationApplication extends Model
{
    use HasFactory;

    protected $fillable = [
        'registration_number',
        'type',
        'student_id',
        'school_origin_id',
        'school_origin_name',
        'school_origin_npsn',
        'school_destination_id',
        'school_destination_name',
        'school_destination_npsn',
        'destination_class',
        'reason',
        'status',
        'rejection_note',
        'operator_user_id',
        'verifier_user_id',
        'submitted_at',
        'verified_at',
        'completed_at',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
        'verified_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function schoolOrigin()
    {
        return $this->belongsTo(School::class, 'school_origin_id');
    }

    public function schoolDestination()
    {
        return $this->belongsTo(School::class, 'school_destination_id');
    }

    public function operator()
    {
        return $this->belongsTo(User::class, 'operator_user_id');
    }

    public function verifier()
    {
        return $this->belongsTo(User::class, 'verifier_user_id');
    }

    public function documents()
    {
        return $this->hasMany(ApplicationDocument::class);
    }

    public function letter()
    {
        return $this->hasOne(MutationLetter::class);
    }

    public function auditTrails()
    {
        return $this->hasMany(AuditTrail::class)->orderBy('created_at', 'desc');
    }
}
