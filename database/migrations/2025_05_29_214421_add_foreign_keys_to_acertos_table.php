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
        Schema::table('acertos', function (Blueprint $table) {
            $table->foreign(['id_mensageiro'])->references(['id_mensageiro'])->on('mensageiros')->onUpdate('restrict')->onDelete('cascade');
            $table->foreign(['id_usuario'])->references(['id_usuario'])->on('usuarios')->onUpdate('restrict')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('acertos', function (Blueprint $table) {
            $table->dropForeign('acertos_id_mensageiro_foreign');
            $table->dropForeign('acertos_id_usuario_foreign');
        });
    }
};
