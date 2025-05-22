<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\MensageiroController;

Route::apiResource('mensageiros', MensageiroController::class);