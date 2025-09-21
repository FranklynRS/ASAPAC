<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use Illuminate\Auth\AuthenticationException;

class Handler extends ExceptionHandler
{

    // Lista de tipos de exceções e seus níveis de log.

    protected $levels = [];

 
    // Lista de exceções que não devem ser reportadas.
     
    protected $dontReport = [];

    // Lista de inputs que não devem ser flashados em erros de validação.

    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];


    // Registra callbacks para exceções.

    public function register(): void
    {
        //
    }

    //Tratamento de usuários não autenticados.
    
    protected function unauthenticated($request, AuthenticationException $exception)
    {
        // Se for rota de API ou espera JSON, retorna 401 em JSON
        if ($request->expectsJson() || $request->is('api/*')) {
            return response()->json([
                'message' => 'Não autenticado.'
            ], 401);
        }

        // Para rotas web, mantém comportamento padrão (redireciona)
        return redirect()->guest(route('login'));
    }
}
