<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Categoria;

class CategoriaController extends Controller
{
    public function index()
    {
        return Categoria::with('usuario')->get();
    }

public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [ 
            'nome_categoria' => 'required|string|max:40',
            'descricao' => 'nullable|string|max:200',
            'tipo' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'erro na validação',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();
        $user = auth('api')->user(); 

        if ($user) {
            $data['id_usuario'] = $user->id_usuario;
        }

        $categoria = Categoria::create($data);

        return response()->json($categoria, 201);
    }

    public function update(Request $request, Categoria $categoria)
    {
        $validator = Validator::make($request->all(), [
            'nome_categoria' => 'required|string|max:40',
            'descricao' => 'nullable|string|max:200',
            'tipo' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'erro na validação',
                'errors' => $validator->errors()
            ], 422);
        }

        $categoria->update($validator->validated());

        return response()->json($categoria, 200);
    }

    public function show($id)
    {
        $categoria = Categoria::with('usuario')->findOrFail($id);
        return response()->json($categoria);
    }
}