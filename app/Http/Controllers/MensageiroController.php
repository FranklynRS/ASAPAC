<?php

namespace App\Http\Controllers;

use App\Models\Mensageiro;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MensageiroController extends Controller
{
    public function index()
    {
        return Mensageiro::all();
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
        'nome_mensageiro' => 'required|string|max:255',
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

    public function update(Request $request, Mensageiro $mensageiro)
    {
        $validator = Validator::make($request->all(), [
            'nome_mensageiro' => 'required|string|max:255',
            'telefone' => 'required|string|max:255',
            'codigo_mensageiro' => 'required|string|max:255|unique:mensageiros,codigo_mensageiro,' . $mensageiro->id_mensageiro . ',id_mensageiro',
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
        $mensageirosAtivos = Mensageiro::where('ativo', true)->get();
        return response()->json($mensageirosAtivos);
    }
}
