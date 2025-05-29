<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\MensageiroController;
use App\Http\Controllers\CategoriaController;

Route::get('mensageiros/ativos', [MensageiroController::class, 'getAtivos']);

Route::apiResource('mensageiros', MensageiroController::class)
    ->except(['destroy']);

Route::get('/categorias', [CategoriaController::class, 'index']);
Route::post('/categorias', [CategoriaController::class, 'store']);
Route::put('/categorias/{categoria}', [CategoriaController::class, 'update']);