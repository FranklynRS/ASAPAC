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
        Schema::create('acertos', function (Blueprint $table) {
            $table->id('id_acerto');
            $table->unsignedBigInteger('id_mensageiro');
            $table->unsignedBigInteger('id_usuario');
        
            $table->decimal('valor_recebido', 10, 2)->default(0);
            $table->decimal('pagamento', 10, 2)->default(0);
            $table->decimal('gasolina', 10, 2)->default(0);
            $table->decimal('alimentacao', 10, 2)->default(0);
            $table->decimal('outros', 10, 2)->default(0);
        
            $table->foreign('id_mensageiro')->references('id_mensageiro')->on('mensageiros')->onDelete('cascade');
            $table->foreign('id_usuario')->references('id_usuario')->on('usuarios')->onDelete('cascade');
        });
        
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('acertos');
    }
};
