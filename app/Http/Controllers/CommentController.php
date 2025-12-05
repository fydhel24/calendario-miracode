<?php

namespace App\Http\Controllers;

use App\Models\Calendario;
use App\Models\Comentario;
use App\Models\Evento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    public function store(Request $request, Calendario $calendario, Evento $evento)
    {
        $this->authorize('view', $calendario); // Ensure user can view the calendar

        $request->validate([
            'contenido' => 'required|string',
        ]);

        $comentario = $evento->comentarios()->create([
            'contenido' => $request->contenido,
            'user_id' => Auth::id(),
        ]);

        return back()->with('success', 'Comentario agregado.');
    }

    public function update(Request $request, Calendario $calendario, Evento $evento, Comentario $comentario)
    {
        $this->authorize('update', $comentario);

        $request->validate([
            'contenido' => 'required|string',
        ]);

        $comentario->update($request->only('contenido'));

        return back()->with('success', 'Comentario actualizado.');
    }

    public function destroy(Calendario $calendario, Evento $evento, Comentario $comentario)
    {
        $this->authorize('delete', $comentario);

        $comentario->delete();

        return back()->with('success', 'Comentario eliminado.');
    }
}
