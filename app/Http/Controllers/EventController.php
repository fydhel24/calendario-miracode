<?php

namespace App\Http\Controllers;

use App\Models\Calendario;
use App\Models\Evento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class EventController extends Controller
{
    public function store(Request $request, Calendario $calendario)
    {
        $this->authorize('createEvent', $calendario);

        $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'ubicacion' => 'nullable|string',
            'prioridad' => 'nullable|string',
            'color' => 'nullable|string',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'nullable|date|after_or_equal:fecha_inicio',
        ]);

        $evento = $calendario->eventos()->create([
            'titulo' => $request->titulo,
            'descripcion' => $request->descripcion,
            'ubicacion' => $request->ubicacion,
            'prioridad' => $request->prioridad,
            'color' => $request->color,
            'fecha_inicio' => $request->fecha_inicio,
            'fecha_fin' => $request->fecha_fin,
            'user_id' => Auth::id(),
        ]);

        return back()->with('success', 'Evento creado.');
    }

    public function update(Request $request, Calendario $calendario, Evento $evento)
    {
        $this->authorize('update', $evento);

        $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'ubicacion' => 'nullable|string',
            'prioridad' => 'nullable|string',
            'color' => 'nullable|string',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'nullable|date|after_or_equal:fecha_inicio',
        ]);

        $evento->update($request->only([
            'titulo',
            'descripcion',
            'ubicacion',
            'prioridad',
            'color',
            'fecha_inicio',
            'fecha_fin'
        ]));

        return back()->with('success', 'Evento actualizado.');
    }

    public function destroy(Calendario $calendario, Evento $evento)
    {
        $this->authorize('delete', $evento);

        $evento->delete();

        return back()->with('success', 'Evento eliminado.');
    }
}
