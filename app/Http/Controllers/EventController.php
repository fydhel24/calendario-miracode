<?php

namespace App\Http\Controllers;

use App\Models\Calendario;
use App\Models\Evento;
use App\Models\EventoUsuario;
use App\Models\User;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class EventController extends Controller
{
    use AuthorizesRequests;
    public function store(Request $request, Calendario $calendario)
    {
        $this->authorize('createEvent', $calendario);

        $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'ubicacion' => 'nullable|string',
            'prioridad' => 'nullable|string',
            'color' => 'nullable|string',
            'emoji' => 'nullable|string',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'nullable|date|after_or_equal:fecha_inicio',
        ]);

        $evento = $calendario->eventos()->create([
            'titulo' => $request->titulo,
            'descripcion' => $request->descripcion,
            'ubicacion' => $request->ubicacion,
            'prioridad' => $request->prioridad,
            'color' => $request->color,
            'emoji' => $request->emoji,
            'fecha_inicio' => $request->fecha_inicio,
            'fecha_fin' => $request->fecha_fin,
            'user_id' => Auth::id(),
        ]);

        // Invite selected users
        if ($request->filled('users') && is_array($request->users)) {
            foreach ($request->users as $userId) {
                EventoUsuario::create([
                    'evento_id' => $evento->id,
                    'user_id' => $userId,
                    'rol' => 'invitado',
                ]);
            }
        }

        return response()->json($evento->load('user', 'usuarios', 'calendario'))->withHeaders(['X-Inertia' => false]);
    }

    public function update(Request $request, Evento $evento)
    {
        $this->authorize('update', $evento);

        $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'ubicacion' => 'nullable|string',
            'prioridad' => 'nullable|string',
            'color' => 'nullable|string',
            'emoji' => 'nullable|string',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'nullable|date|after_or_equal:fecha_inicio',
            'users' => 'nullable|array',
            'users.*' => 'exists:users,id',
        ]);

        $evento->update($request->only([
            'titulo',
            'descripcion',
            'ubicacion',
            'prioridad',
            'color',
            'emoji',
            'fecha_inicio',
            'fecha_fin'
        ]));

        return response()->json($evento->load('user', 'calendario'))->withHeaders(['X-Inertia' => false]);
    }

    public function destroy(Evento $evento)
    {
        $this->authorize('delete', $evento);

        $evento->delete();

        return response()->json(['message' => 'Evento eliminado'])->withHeaders(['X-Inertia' => false]);
    }

    public function removeUser(Evento $evento, User $user)
    {
        $this->authorize('update', $evento);

        EventoUsuario::where('evento_id', $evento->id)->where('user_id', $user->id)->delete();

        return response()->json(['message' => 'Usuario removido del evento'])->withHeaders(['X-Inertia' => false]);
    }

    public function addUser(Request $request, Evento $evento)
    {
        $this->authorize('update', $evento);

        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $user = User::find($request->user_id);

        if ($evento->usuarios()->where('user_id', $user->id)->exists()) {
            return response()->json(['error' => 'El usuario ya está invitado al evento.'], 422);
        }

        EventoUsuario::create([
            'evento_id' => $evento->id,
            'user_id' => $user->id,
            'rol' => 'invitado',
        ]);

        return response()->json(['message' => 'Usuario agregado al evento.'])->withHeaders(['X-Inertia' => false]);
    }
}
