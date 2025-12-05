<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Archivo extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'archivos';

    protected $fillable = [
        'tipo',
        'url_archivo',
        'evento_id',
    ];

    public function evento()
    {
        return $this->belongsTo(Evento::class);
    }
}
