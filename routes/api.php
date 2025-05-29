<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\MensageiroController;

Route::get('mensageiros/ativos', [MensageiroController::class, 'getAtivos']);

Route::apiResource('mensageiros', MensageiroController::class)
    ->except(['destroy']);

use App\Http\Controllers\CategoriaController;

Route::get('/categorias', [CategoriaController::class, 'index']);
Route::post('/categorias', [CategoriaController::class, 'store']);
Route::put('/categorias/{categoria}', [CategoriaController::class, 'update']);