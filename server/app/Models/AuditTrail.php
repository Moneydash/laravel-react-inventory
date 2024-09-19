<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class AuditTrail extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'audit_trail';

    protected $fillable = [
        'user_id',
        'action',
        'description'
    ];

    public function user() {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
