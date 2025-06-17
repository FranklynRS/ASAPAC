<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MensageiroController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\MesController;

// Rotas para Mensageiros
Route::get('mensageiros/ativos', [MensageiroController::class, 'getAtivos']);
Route::apiResource('mensageiros', MensageiroController::class)
    ->except(['destroy']);

// Rotas para Categorias
Route::get('/categorias', [CategoriaController::class, 'index']);
Route::post('/categorias', [CategoriaController::class, 'store']);
Route::put('/categorias/{categoria}', [CategoriaController::class, 'update']);

// Rotas para Usuários
Route::post('/usuarios', [UsuarioController::class, 'store']);
Route::post('/usuarios/login', [UsuarioController::class, 'login']);
Route::put('/usuarios/{id}', [UsuarioController::class, 'update']);
Route::get('/usuarios', [UsuarioController::class, 'index']);
Route::get('/usuarios/{id}', [UsuarioController::class, 'index']);

// Rotas para Meses (Sua implementação)
Route::apiResource('meses', MesController::class)
    ->except(['destroy']); 