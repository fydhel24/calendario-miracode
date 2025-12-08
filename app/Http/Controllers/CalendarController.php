<?php

namespace App\Http\Controllers;

use App\Models\Calendario;
use App\Models\User;
use App\Models\UserCalendario;
use Illuminate\Http\JsonResponse;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CalendarController extends Controller
{
    use AuthorizesRequests;
    public function index()
    {
        $user = Auth::user();
        $calendarios = $user->calendarios()->with('users', 'eventos.user', 'eventos.archivos', 'eventos.comentarios.user')->orderBy('created_at', 'desc')->get();

        $selectedCalendarId = session('selected_calendar_id');
        if ($selectedCalendarId) {
            session()->forget('selected_calendar_id');
        }

        return Inertia::render('dashboard', [
            'calendarios' => $calendarios,
            'selectedCalendarId' => $selectedCalendarId,
        ]);
    }

    public function show(Calendario $calendario)
    {
        $this->authorize('view', $calendario);

        $calendario->load(['users', 'eventos.user', 'eventos.archivos', 'eventos.comentarios.user']);

        return Inertia::render('calendar/show', [
            'calendario' => $calendario,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'template' => 'nullable|string',
            'estado' => 'required|string',
        ]);

        $calendario = Calendario::create($request->only(['nombre', 'descripcion', 'template', 'estado']));

        // Add creator as owner
        $calendario->users()->attach(Auth::id(), ['tipo_user' => 'owner']);

        session(['selected_calendar_id' => $calendario->id]);

        return redirect()->route('dashboard')->with('success', 'Calendario creado exitosamente.');
    }

    public function update(Request $request, Calendario $calendario)
    {
        $this->authorize('update', $calendario);

        $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'template' => 'nullable|string',
            'estado' => 'required|string',
        ]);

        $calendario->update($request->only(['nombre', 'descripcion', 'template', 'estado']));

        return response()->json($calendario->load('users'))->withHeaders(['X-Inertia' => false]);
    }

    public function destroy(Calendario $calendario)
    {
        $this->authorize('delete', $calendario);

        $calendario->delete();

        return redirect()->route('dashboard')->with('success', 'Calendario eliminado.');
    }

    public function invite(Request $request, Calendario $calendario)
    {
        $this->authorize('invite', $calendario);

        $request->validate([
            'user_id' => 'required|exists:users,id',
            'tipo_user' => 'required|in:owner,editor,viewer',
        ]);

        $user = User::find($request->user_id);

        if ($calendario->users()->where('user_id', $user->id)->exists()) {
            return response()->json(['error' => 'El usuario ya está en el calendario.'], 422);
        }

        $calendario->users()->attach($user->id, ['tipo_user' => $request->tipo_user]);

        return response()->json(['message' => 'Usuario agregado al calendario.']);
    }

    public function removeUser(Calendario $calendario, User $user)
    {
        $this->authorize('manageUsers', $calendario);

        if (
            $calendario->users()->where('user_id', $user->id)->wherePivot('tipo_user', 'owner')->exists() &&
            $calendario->users()->wherePivot('tipo_user', 'owner')->count() === 1
        ) {
            return back()->withErrors(['error' => 'No puedes remover al último propietario.']);
        }

        $calendario->users()->detach($user->id);

        return back()->with('success', 'Usuario removido del calendario.');
    }

    public function getUsers(): JsonResponse
    {
        $users = User::select('id', 'name', 'email')->get();

        return response()->json($users);
    }
}
