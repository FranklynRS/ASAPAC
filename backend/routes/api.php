<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\MensageiroController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\MesController;
use App\Http\Controllers\AcertoController; 
use App\Http\Controllers\LancamentoController;
use App\Http\Controllers\RelatorioController;

// Mensageiros
Route::get('mensageiros/ativos', [MensageiroController::class, 'getAtivos']);
Route::apiResource('mensageiros', MensageiroController::class); 

// Categorias
Route::get('/categorias', [CategoriaController::class, 'index']);
Route::get('/categorias/{id}', [CategoriaController::class, 'show']);
Route::post('/categorias', [CategoriaController::class, 'store']);
Route::put('/categorias/{categoria}', [CategoriaController::class, 'update']);

// Usuários - Registro e Login
Route::post('/usuarios', [UsuarioController::class, 'store']);
Route::post('/usuarios/login', [UsuarioController::class, 'login']);
Route::put('/usuarios/{id}', [UsuarioController::class, 'update']);

// Lançamentos
Route::apiResource('lancamentos', LancamentoController::class);
Route::put('/lancamentos', [LancamentoController::class, 'update']);

// Meses


//Relatorios
Route::get('/relatorios/{id_mes}', [RelatorioController::class, 'show']);
Route::apiResource('acertos', AcertoController::class);

Route::middleware('jwt.auth')->group(function () {

// Usuário autenticado
Route::get('/usuarios/me', [UsuarioController::class, 'me']);
Route::post('/usuarios/logout', [UsuarioController::class, 'logout']);
Route::post('/usuarios/refresh', [UsuarioController::class, 'refresh']);
Route::get('/usuarios', [UsuarioController::class, 'index']);

//Meses
Route::get('/meses-com-saldos', [MesController::class, 'getMesesComSaldos']);
Route::apiResource('meses', MesController::class)
    ->except(['destroy']);
Route::get('/lancamentos/mes/{id_mes}', [LancamentoController::class, 'getByMes']);

// Usuários - CRUD protegido
Route::put('/usuarios/{id}', [UsuarioController::class, 'update']);
Route::get('/usuarios', [UsuarioController::class, 'index']);
});