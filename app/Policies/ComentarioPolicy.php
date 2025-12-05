<?php

namespace App\Policies;

use App\Models\Comentario;
use App\Models\User;

class ComentarioPolicy
{
    public function update(User $user, Comentario $comentario): bool
    {
        return $comentario->user_id === $user->id;
    }

    public function delete(User $user, Comentario $comentario): bool
    {
        return $comentario->user_id === $user->id;
    }
}
