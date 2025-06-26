<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\MensageiroController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\MesController;
use App\Http\Controllers\AcertoController; 

// Rotas para Mensageiros
Route::post('/mensageiros', [MensageiroController::class, 'store']);
Route::get('mensageiros/ativos', [MensageiroController::class, 'getAtivos']);

Route::apiResource('mensageiros', MensageiroController::class)
    ->except(['destroy']);


Route::get('/categorias', [CategoriaController::class, 'index']);
Route::post('/categorias', [CategoriaController::class, 'store']);
Route::put('/categorias/{categoria}', [CategoriaController::class, 'update']);

// Rotas para Usuários
Route::post('/usuarios', [UsuarioController::class, 'store']);
Route::post('/usuarios/login', [UsuarioController::class, 'login']);
Route::put('/usuarios/{id}', [UsuarioController::class, 'update']);
Route::get('/usuarios', [UsuarioController::class, 'index']);


use App\Http\Controllers\LancamentoController;

Route::apiResource('lancamentos', LancamentoController::class);
