<?php

namespace App\Policies;

use App\Models\Calendario;
use App\Models\User;

class CalendarioPolicy
{
    public function view(User $user, Calendario $calendario): bool
    {
        return $calendario->users()->where('user_id', $user->id)->exists();
    }

    public function update(User $user, Calendario $calendario): bool
    {
        $pivot = $calendario->users()->where('user_id', $user->id)->first();
        return $pivot && $pivot->pivot->tipo_user === 'owner';
    }

    public function delete(User $user, Calendario $calendario): bool
    {
        $pivot = $calendario->users()->where('user_id', $user->id)->first();
        return $pivot && $pivot->pivot->tipo_user === 'owner';
    }

    public function invite(User $user, Calendario $calendario): bool
    {
        $pivot = $calendario->users()->where('user_id', $user->id)->first();
        return $pivot && $pivot->pivot->tipo_user === 'owner';
    }

    public function manageUsers(User $user, Calendario $calendario): bool
    {
        $pivot = $calendario->users()->where('user_id', $user->id)->first();
        return $pivot && $pivot->pivot->tipo_user === 'owner';
    }

    public function createEvent(User $user, Calendario $calendario): bool
    {
        $pivot = $calendario->users()->where('user_id', $user->id)->first();
        return $pivot && in_array($pivot->pivot->tipo_user, ['owner', 'editor']);
    }
}
