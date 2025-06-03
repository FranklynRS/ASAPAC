<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Categoria;

class CategoriaController extends Controller
{
    public function index()
    {
        return Categoria::all();
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nome_categoria' => 'required|string|max:255',
            'descricao' => 'nullable|string',
            'tipo' => 'required|boolean', // 1 = entrada, 0 = saída
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'erro na validação',
                'errors' => $validator->errors()
            ], 422);
        }

        $categoria = Categoria::create($validator->validated());

        return response()->json($categoria, 201);
    }

    public function update(Request $request, Categoria $categoria)
    {
        $validator = Validator::make($request->all(), [
            'nome_categoria' => 'required|string|max:255',
            'descricao' => 'nullable|string',
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
}
