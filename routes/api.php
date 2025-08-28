<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\MensageiroController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\MesController;
use App\Http\Controllers\AcertoController; 
use App\Http\Controllers\LancamentoController;
use App\Http\Controllers\RelatorioController;

Route::get('mensageiros/ativos', [MensageiroController::class, 'getAtivos']);
Route::apiResource('mensageiros', MensageiroController::class)
    ->except(['destroy']);

Route::get('/categorias', [CategoriaController::class, 'index']);
Route::get('/categorias/{id}', [CategoriaController::class, 'show']);
Route::post('/categorias', [CategoriaController::class, 'store']);
Route::put('/categorias/{categoria}', [CategoriaController::class, 'update']);

Route::post('/usuarios', [UsuarioController::class, 'store']);
Route::post('/usuarios/login', [UsuarioController::class, 'login']);
Route::put('/usuarios/{id}', [UsuarioController::class, 'update']);
Route::get('/usuarios', [UsuarioController::class, 'index']);

Route::apiResource('lancamentos', LancamentoController::class);
Route::put('/lancamentos', [LancamentoController::class, 'update']);

Route::apiResource('meses', MesController::class)
    ->except(['destroy']);

Route::get('/relatorios/{id_mes}', [RelatorioController::class, 'show']);
 
Route::apiResource('acertos', AcertoController::class);

Route::group(['middleware' => 'auth:api'], function () {
    Route::get('me', [AutenticacaoController::class, 'me']);
});