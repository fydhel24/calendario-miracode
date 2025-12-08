<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class EventoUsuario extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'evento_usuario';

    protected $fillable = [
        'evento_id',
        'user_id',
        'rol',
    ];
}
