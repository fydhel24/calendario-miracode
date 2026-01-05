<?php

namespace App\Policies;

use App\Models\Evento;
use App\Models\User;

class EventoPolicy
{
    public function view(User $user, Evento $evento): bool
    {
        return $evento->calendario && $evento->calendario->users()->where('user_id', $user->id)->exists();
    }

    public function update(User $user, Evento $evento): bool
    {
        $pivot = $evento->calendario->users()->where('user_id', $user->id)->first();
        return $pivot && in_array($pivot->pivot->tipo_user, ['owner', 'editor']);
    }

    public function delete(User $user, Evento $evento): bool
    {
        $pivot = $evento->calendario->users()->where('user_id', $user->id)->first();
        return $pivot && in_array($pivot->pivot->tipo_user, ['owner', 'editor']);
    }
}
