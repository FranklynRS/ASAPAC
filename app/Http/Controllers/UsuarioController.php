<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Rule;

class UsuarioController extends Controller
{    
    // Cadastro
public function store(Request $request)
    {
        try {
            $mensagens = [
                'email_usuario.email' => 'Formato de e-mail inválido.',
                'email_usuario.unique' => 'Este e-mail já está em uso.',
            ];

            $data = $request->validate([
                'nome_usuario' => 'required|string',
                'email_usuario' => 'required|email|unique:usuarios,email_usuario',
                'senha_usuario' => 'required|string|min:6',
            ], $mensagens);

            $data['senha_usuario'] = bcrypt($data['senha_usuario']);
            $usuario = Usuario::create($data);

            return response()->json(['message' => 'Usuário criado com sucesso', 'usuario' => $usuario], 201);

        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        }
    }

    // Login
    public function login(Request $request)
    {
        $data = $request->validate([
            'email_usuario' => 'required|email',
            'senha_usuario' => 'required|string',
        ]);

        $usuario = Usuario::where('email_usuario', $data['email_usuario'])->first();

        if (!$usuario || !Hash::check($data['senha_usuario'], $usuario->senha_usuario)) {
            return response()->json(['message' => 'Credenciais inválidas'], 401);
        }

        return response()->json(['message' => 'Login realizado com sucesso', 'usuario' => $usuario]);
    }

    // Edição
    
    public function update(Request $request, $id)
    {
        $usuario = Usuario::findOrFail($id);

        try {
            $mensagens = [
                'email_usuario.email' => 'Formato de e-mail inválido.',
                'email_usuario.unique' => 'Este e-mail já está em uso.',
            ];

            $data = $request->validate([
                'nome_usuario' => 'sometimes|required|string',
                'email_usuario' => [
                    'sometimes',
                    'required',
                    'email',
                    Rule::unique('usuarios', 'email_usuario')->ignore($usuario->id_usuario, 'id_usuario'),
                ],
                'senha_usuario' => 'sometimes|required|string|min:6',
            ], $mensagens);

            if (isset($data['senha_usuario'])) {
                $data['senha_usuario'] = bcrypt($data['senha_usuario']);
            }

            $usuario->update($data);

            return response()->json(['message' => 'Usuário atualizado com sucesso', 'usuario' => $usuario]);

        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        }
    }

    // Pesquisa
    public function index(Request $request)
    {
        $query = Usuario::query();

        if ($request->has('nome_usuario')) {
            $query->where('nome_usuario', 'like', '%'.$request->query('nome_usuario').'%');
        }

        if ($request->has('email_usuario')) {
            $query->where('email_usuario', 'like', '%'.$request->query('email_usuario').'%');
        }

        $usuarios = $query->get();

        return response()->json($usuarios);
    }
}