<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Categoria;

class CategoriaController extends Controller
{

    public function index(Request $request)
    {
        $query = Categoria::with('usuario');

        if ($request->has('nome_categoria')) {
            $query->where('nome_categoria', 'like', '%' . $request->query('nome_categoria') . '%');
        }

        if ($request->has('tipo') && $request->tipo !== null && $request->tipo !== '') {
            $query->where('tipo', $request->tipo);
        }

        if ($request->has('created_by') && $request->created_by) {
            $query->where('id_usuario', $request->created_by);
        }

        if ($request->has('ordem') && $request->ordem === 'antigo') {
            $query->orderBy('id_categoria', 'asc');
        } else {
            $query->orderBy('id_categoria', 'desc');
        }

        return response()->json($query->get());
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