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
        Schema::create('mensageiros', function (Blueprint $table) {
            $table->id('id_mensageiro');
            $table->string('nome_mensageiro');
            $table->string('telefone');
            $table->string('codigo_mensageiro')->nullable();
        });
        
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mensageiros');
    }
};
