<?php

namespace App\Http\Controllers;

use App\Models\Archivo;
use App\Models\Calendario;
use App\Models\Evento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FileController extends Controller
{
    public function store(Request $request, Calendario $calendario, Evento $evento)
    {
        $this->authorize('view', $calendario);

        $request->validate([
            'file' => 'required|file|max:10240', // 10MB max
            'tipo' => 'required|string',
        ]);

        $file = $request->file('file');
        $path = $file->store('archivos', 'public');

        $archivo = $evento->archivos()->create([
            'tipo' => $request->tipo,
            'url_archivo' => $path,
        ]);

        return back()->with('success', 'Archivo subido.');
    }

    public function destroy(Calendario $calendario, Evento $evento, Archivo $archivo)
    {
        $this->authorize('view', $calendario);

        Storage::disk('public')->delete($archivo->url_archivo);
        $archivo->delete();

        return back()->with('success', 'Archivo eliminado.');
    }
}
