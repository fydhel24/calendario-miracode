<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserCalendario extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'user_calendarios';

    protected $fillable = [
        'user_id',
        'calendario_id',
        'tipo_user',
    ];

    // Relaciones
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function calendario()
    {
        return $this->belongsTo(Calendario::class);
    }
}
