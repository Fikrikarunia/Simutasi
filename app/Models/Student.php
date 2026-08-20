<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'nisn',
        'nis',
        'name',
        'gender',
        'birth_place',
        'birth_date',
        'current_class',
    ];

    public function mutationApplications()
    {
        return $this->hasMany(MutationApplication::class);
    }
}
