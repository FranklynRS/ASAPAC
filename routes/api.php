<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\MensageiroController;

Route::apiResource('mensageiros', MensageiroController::class)
    ->except(['destroy']);


Route::get('/mensageiros/ativos', [MensageiroController::class, 'getAtivos']);