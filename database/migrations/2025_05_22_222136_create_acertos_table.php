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
            $table->bigIncrements('id_acerto');
            $table->unsignedBigInteger('id_mensageiro')->index('acertos_id_mensageiro_foreign');
            $table->unsignedBigInteger('id_usuario')->index('acertos_id_usuario_foreign');
            $table->decimal('valor_recebido', 10)->default(0);
            $table->decimal('pagamento', 10)->default(0);
            $table->decimal('gasolina', 10)->default(0);
            $table->decimal('alimentacao', 10)->default(0);
            $table->decimal('outros', 10)->default(0);
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
