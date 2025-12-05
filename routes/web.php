<?php

use App\Http\Controllers\CalendarController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\FileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [CalendarController::class, 'index'])->name('dashboard');

    Route::resource('calendarios', CalendarController::class);
    Route::post('calendarios/{calendario}/invite', [CalendarController::class, 'invite'])->name('calendarios.invite');
    Route::delete('calendarios/{calendario}/users/{user}', [CalendarController::class, 'removeUser'])->name('calendarios.removeUser');

    Route::resource('calendarios.eventos', EventController::class)->shallow();
    Route::resource('eventos.comentarios', CommentController::class)->shallow();
    Route::resource('eventos.archivos', FileController::class)->shallow();
});

require __DIR__ . '/settings.php';
