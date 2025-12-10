<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Rule;
use Tymon\JWTAuth\Facades\JWTAuth;

class UsuarioController extends Controller
{
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
            $token = JWTAuth::fromUser($usuario);

            return response()->json([
                'message' => 'Usuário criado com sucesso',
                'usuario' => $usuario,
                'token'   => $token
            ], 201);

        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        }
    }

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

        $token = JWTAuth::fromUser($usuario);

        return response()->json([
            'message' => 'Login realizado com sucesso',
            'usuario' => $usuario,
            'token' => $token,
        ]);
    }

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
                'senha_usuario' => 'sometimes|nullable|string|min:6',
                'foto' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048', 
            ], $mensagens);

            if ($request->hasFile('foto') && $request->file('foto')->isValid()) {
                
                if ($usuario->foto_usuario && file_exists(public_path($usuario->foto_usuario))) {
                    unlink(public_path($usuario->foto_usuario));
                }

                $imageName = time() . '.' . $request->foto->extension();
                $request->foto->move(public_path('uploads/usuarios'), $imageName);
                
                $usuario->foto_usuario = 'uploads/usuarios/' . $imageName;
            }

            if (isset($data['nome_usuario'])) $usuario->nome_usuario = $data['nome_usuario'];
            if (isset($data['email_usuario'])) $usuario->email_usuario = $data['email_usuario'];
            if (!empty($data['senha_usuario'])) {
                $usuario->senha_usuario = bcrypt($data['senha_usuario']);
            }

            $usuario->save();

            return response()->json(['message' => 'Usuário atualizado com sucesso', 'usuario' => $usuario]);

        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        }
    }

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

    public function me()
    {
        return response()->json(auth()->user());
    }

    public function logout()
    {
        auth()->logout();
        return response()->json(['message' => 'Logout realizado com sucesso']);
    }

    public function refresh()
    {
        return response()->json([
            'token' => auth()->refresh()
        ]);
    }
}