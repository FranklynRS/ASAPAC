<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UsuarioController extends Controller
{    
    // Cadastro
    public function store(Request $request)
    {
        $data = $request->validate([
            'nome_usuario' => 'required|string',
            'email_usuario' => 'required|email|unique:usuarios,email_usuario',
            'senha_usuario' => 'required|string|min:6',
        ]);

        $data['senha_usuario'] = bcrypt($data['senha_usuario']);

        $usuario = Usuario::create($data);

        return response()->json(['message' => 'Usuário criado com sucesso', 'usuario' => $usuario], 201);
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

        $data = $request->validate([
            'nome_usuario' => 'sometimes|required|string',
            'email_usuario' => 'sometimes|required|email|unique:usuarios,email_usuario,'.$usuario->id_usuario.',id_usuario',
            'senha_usuario' => 'sometimes|required|string|min:6',
        ]);

        if (isset($data['senha_usuario'])) {
            $data['senha_usuario'] = bcrypt($data['senha_usuario']);
        }

        $usuario->update($data);

        return response()->json(['message' => 'Usuário atualizado com sucesso', 'usuario' => $usuario]);
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