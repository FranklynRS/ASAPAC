<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('meses', function (Blueprint $table) {
            $table->id('id_mes');
            $table->string('ano_mes', 7)->unique();
            $table->timestamps(); // Mantive mas pode remover se seu grupo não usa
        });
    }

    public function down()
    {
        Schema::dropIfExists('meses');
    }
};