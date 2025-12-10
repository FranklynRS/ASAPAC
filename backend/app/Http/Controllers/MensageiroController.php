<?php

namespace App\Http\Controllers;

use App\Models\Mensageiro;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MensageiroController extends Controller
{

    public function index(Request $request)
    {
        $query = Mensageiro::query();
        if ($request->has('nome_mensageiro')) {
            $query->where('nome_mensageiro', 'like', '%' . $request->query('nome_mensageiro') . '%');
        }

        if ($request->has('status') && $request->status !== null && $request->status !== '') {
            $status = $request->status === 'ativo' ? 1 : 0;
            $query->where('status', $status);
        }

        if ($request->has('created_by') && $request->created_by) {
        }

        if ($request->has('ordem') && $request->ordem === 'antigo') {
            $query->orderBy('id_mensageiro', 'asc');
        } else {
            $query->orderBy('id_mensageiro', 'desc');
        }

        return response()->json($query->get());
    }
    
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nome_mensageiro' => 'required|string|max:40', 
            'telefone' => 'required|string|max:255',
            'codigo_mensageiro' => 'required|string|max:255|unique:mensageiros,codigo_mensageiro',
        ]);
    
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Erro de validação',
                'errors' => $validator->errors()
            ], 422);
        }

        $mensageiro = Mensageiro::create($validator->validated());

        return response()->json($mensageiro, 201);
    }

    public function show(Mensageiro $mensageiro)
    {
        return $mensageiro;
    }

    public function update(Request $request, $id)
    {
        $mensageiro = Mensageiro::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'nome_mensageiro' => 'required|string|max:40',
            'telefone' => 'required|string|max:255',
            'codigo_mensageiro' => 'required|string|max:255|unique:mensageiros,codigo_mensageiro,' . $mensageiro->id_mensageiro . ',id_mensageiro',
            'status' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Erro de validação',
                'errors' => $validator->errors()
            ], 422);
        }

        $mensageiro->update($validator->validated());

        return response()->json($mensageiro, 200);
    }

    public function getAtivos()
    {
        $mensageirosAtivos = Mensageiro::where('status', true)->get();
        return response()->json($mensageirosAtivos);
    }
}