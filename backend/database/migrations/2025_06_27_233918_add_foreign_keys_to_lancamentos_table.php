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
        Schema::table('lancamentos', function (Blueprint $table) {
            $table->foreign(['id_categoria'])->references(['id_categoria'])->on('categorias')->onUpdate('restrict')->onDelete('cascade');
            $table->foreign(['id_mes'])->references(['id_mes'])->on('meses')->onUpdate('restrict')->onDelete('cascade');
            $table->foreign(['id_usuario'])->references(['id_usuario'])->on('usuarios')->onUpdate('restrict')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('lancamentos', function (Blueprint $table) {
            $table->dropForeign('lancamentos_id_categoria_foreign');
            $table->dropForeign('lancamentos_id_mes_foreign');
            $table->dropForeign('lancamentos_id_usuario_foreign');
        });
    }
};
