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

    protected $casts = [
        'fecha_inicio' => 'datetime',
        'fecha_fin' => 'datetime',
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

    public function archivos()
    {
        return $this->hasMany(Archivo::class);
    }

    public function comentarios()
    {
        return $this->hasMany(Comentario::class);
    }

    public function usuarios()
    {
        return $this->belongsToMany(User::class, 'evento_usuario')->withPivot('rol')->withTimestamps();
    }
}
