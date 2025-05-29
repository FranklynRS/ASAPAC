<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\MensageiroController;

Route::get('mensageiros/ativos', [MensageiroController::class, 'getAtivos']);

Route::apiResource('mensageiros', MensageiroController::class)
    ->except(['destroy']);