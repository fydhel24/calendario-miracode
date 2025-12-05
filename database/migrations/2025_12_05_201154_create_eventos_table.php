<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('eventos', function (Blueprint $table) {
            $table->id();

            $table->text('titulo');
            $table->text('descripcion')->nullable();
            $table->text('ubicacion')->nullable();
            $table->string('prioridad')->nullable();
            $table->string('color')->nullable();

            $table->dateTime('fecha_inicio');
            $table->dateTime('fecha_fin')->nullable();

            $table->foreignId('user_id')
                ->constrained('users')
                ->onDelete('cascade');

            $table->foreignId('calendario_id')
                ->constrained('calendarios')
                ->onDelete('cascade');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('eventos');
    }
};
