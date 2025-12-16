<?php

namespace App\Providers;

use App\Actions\Fortify\CreateNewUser;
use App\Actions\Fortify\ResetUserPassword;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use Laravel\Fortify\Fortify;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class FortifyServiceProvider extends ServiceProvider
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
        $this->configureActions();
        $this->configureViews();
        $this->configureRateLimiting();

        //  Personalización del login
        Fortify::authenticateUsing(function (Request $request) {
            $email = $request->email;
            $password = $request->password;

            // 1. Intentar autenticar localmente
            $user = User::where('email', $email)->first();

            if ($user && Hash::check($password, $user->password)) {
                return $user; // Login local exitoso
            }

            // 2. Si falla, intentar con la API externa
            try {
                $response = Http::withHeaders([
                    'Accept' => 'application/json',
                ])->timeout(10)->post('https://admusproductions.com/api/auth/login', [
                    'email' => $email,
                    'password' => $password,
                ]);

                // Si la API responde con éxito (ej. código 200)
                if ($response->successful()) {
                    $remoteUser = $response->json();

                    // 3. ¿Ya existe en local? (por si ya se creó antes)
                    $user = User::where('email', $email)->first();

                    if (! $user) {
                        // Crear usuario nuevo en local
                        $user = User::create([
                            'name' => $remoteUser['name'] ?? 'Usuario Externo',
                            'email' => $email,
                            'password' => Hash::make($password), // opcional: podrías usar un hash aleatorio si no quieres guardar el pass
                            // Añade otros campos que necesites: role, company_id, etc.
                        ]);
                    }

                    return $user; // Login vía API + creación local
                }
            } catch (\Exception $e) {
                // Loguear error si es necesario
                \Log::warning('Error al conectar con API externa', [
                    'email' => $email,
                    'error' => $e->getMessage(),
                ]);
            }

            // Credenciales inválidas (ni local ni en API)
            return null;
        });
    }

    /**
     * Configure Fortify actions.
     */
    private function configureActions(): void
    {
        Fortify::resetUserPasswordsUsing(ResetUserPassword::class);
        Fortify::createUsersUsing(CreateNewUser::class);
    }

    /**
     * Configure Fortify views.
     */
    private function configureViews(): void
    {
        Fortify::loginView(fn(Request $request) => Inertia::render('auth/login', [
            'canResetPassword' => Features::enabled(Features::resetPasswords()),
            'canRegister' => Features::enabled(Features::registration()),
            'status' => $request->session()->get('status'),
        ]));

        Fortify::resetPasswordView(fn(Request $request) => Inertia::render('auth/reset-password', [
            'email' => $request->email,
            'token' => $request->route('token'),
        ]));

        Fortify::requestPasswordResetLinkView(fn(Request $request) => Inertia::render('auth/forgot-password', [
            'status' => $request->session()->get('status'),
        ]));

        Fortify::verifyEmailView(fn(Request $request) => Inertia::render('auth/verify-email', [
            'status' => $request->session()->get('status'),
        ]));

        Fortify::registerView(fn() => Inertia::render('auth/register'));

        Fortify::twoFactorChallengeView(fn() => Inertia::render('auth/two-factor-challenge'));

        Fortify::confirmPasswordView(fn() => Inertia::render('auth/confirm-password'));
    }

    /**
     * Configure rate limiting.
     */
    private function configureRateLimiting(): void
    {
        RateLimiter::for('two-factor', function (Request $request) {
            return Limit::perMinute(5)->by($request->session()->get('login.id'));
        });

        RateLimiter::for('login', function (Request $request) {
            $throttleKey = Str::transliterate(Str::lower($request->input(Fortify::username())) . '|' . $request->ip());

            return Limit::perMinute(5)->by($throttleKey);
        });
    }
}
