<?php

namespace App\Http\Controllers;

use App\Models\Calendario;
use App\Models\Comentario;
use App\Models\Evento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    public function store(Request $request, Evento $evento)
    {
        // $evento->load('calendario');
        // $this->authorize('view', $evento);

        $request->validate([
            'contenido' => 'required|string',
        ]);

        $comentario = $evento->comentarios()->create([
            'contenido' => $request->contenido,
            'user_id' => Auth::id(),
        ]);

        return response()->json($comentario->load('user'))->withHeaders(['X-Inertia' => false]);
    }

    public function update(Request $request, Evento $evento, Comentario $comentario)
    {
        $this->authorize('update', $comentario);

        $request->validate([
            'contenido' => 'required|string',
        ]);

        $comentario->update($request->only('contenido'));

        return response()->json($comentario)->withHeaders(['X-Inertia' => false]);
    }

    public function destroy(Evento $evento, Comentario $comentario)
    {
        $this->authorize('delete', $comentario);

        $comentario->delete();

        return response()->json(['message' => 'Comentario eliminado'])->withHeaders(['X-Inertia' => false]);
    }
}
