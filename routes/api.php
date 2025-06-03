<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\MensageiroController;

Route::get('mensageiros/ativos', [MensageiroController::class, 'getAtivos']);

Route::apiResource('mensageiros', MensageiroController::class)
    ->except(['destroy']);

use App\Http\Controllers\CategoriaController;

Route::get('/categorias', [CategoriaController::class, 'index']);
Route::post('/categorias', [CategoriaController::class, 'store']);
<<<<<<< HEAD
Route::put('/categorias/{categoria}', [CategoriaController::class, 'update']);

use App\Http\Controllers\UsuarioController;

Route::post('/usuarios', [UsuarioController::class, 'store']);
Route::post('/usuarios/login', [UsuarioController::class, 'login']);
Route::put('/usuarios/{id}', [UsuarioController::class, 'update']);
Route::get('/usuarios', [UsuarioController::class, 'index']);
Route::get('/usuarios/{id}', [UsuarioController::class, 'index']);
=======
Route::put('/categorias/{categoria}', [CategoriaController::class, 'update']);
>>>>>>> 2822553ab786d9289601242ca9f6fc310b35332f
