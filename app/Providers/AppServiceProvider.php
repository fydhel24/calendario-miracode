<?php

namespace App\Providers;

use App\Models\Calendario;
use App\Models\Comentario;
use App\Models\Evento;
use App\Policies\CalendarioPolicy;
use App\Policies\ComentarioPolicy;
use App\Policies\EventoPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::policy(Calendario::class, CalendarioPolicy::class);
        Gate::policy(Evento::class, EventoPolicy::class);
        Gate::policy(Comentario::class, ComentarioPolicy::class);
    }
}
