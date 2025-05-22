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
        Schema::create('lancamentos', function (Blueprint $table) {
            $table->bigIncrements('id_lancamento');
            $table->string('descricao');
            $table->date('data_lancamento');
            $table->unsignedBigInteger('id_usuario')->index('lancamentos_id_usuario_foreign');
            $table->unsignedBigInteger('id_mes')->index('lancamentos_id_mes_foreign');
            $table->unsignedBigInteger('id_categoria')->index('lancamentos_id_categoria_foreign');
            $table->decimal('valor', 10);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lancamentos');
    }
};
