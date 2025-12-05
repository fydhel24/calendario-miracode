<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Evento extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'eventos';

    protected $fillable = [
        'titulo',
        'descripcion',
        'ubicacion',
        'prioridad',
        'color',
        'fecha_inicio',
        'fecha_fin',
        'user_id',
        'calendario_id',
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
