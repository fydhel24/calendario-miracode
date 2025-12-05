<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Calendario extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'calendarios';

    protected $fillable = [
        'nombre',
        'descripcion',
        'template',
        'estado',
    ];
}
