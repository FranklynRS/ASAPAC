<?php

namespace App\Http\Controllers;

use App\Models\Lancamento;
use Illuminate\Http\Request;

class LancamentoController extends Controller
{
    public function index()
    {
        $lancamentos = Lancamento::with('categoria', 'usuario', 'mes')->get();

        return response()->json($lancamentos);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'descricao' => 'required|string|max:255',
            'data_lancamento' => 'required|date',
            'id_usuario' => 'required|integer|exists:usuarios,id_usuario',
            'id_mes' => 'required|integer|exists:meses,id_mes',
            'id_categoria' => 'required|integer|exists:categorias,id_categoria',
            'valor' => 'required|numeric'
        ]);

        $lancamento = Lancamento::create($validated);
        return response()->json($lancamento, 201);
    }

    public function show($id)
    {
        $lancamento = Lancamento::findOrFail($id);
        return response()->json($lancamento);
    }

    public function update(Request $request, $id)
    {
        $lancamento = Lancamento::findOrFail($id);

        $validated = $request->validate([
            'descricao' => 'sometimes|string|max:255',
            'data_lancamento' => 'sometimes|date',
            'id_usuario' => 'required|integer|exists:usuarios,id_usuario',
            'id_mes' => 'required|integer|exists:meses,id_mes',
            'id_categoria' => 'required|integer|exists:categorias,id_categoria',
            'valor' => 'sometimes|numeric'
        ]);

        $lancamento->update($validated);
        return response()->json($lancamento);
    }

    public function destroy($id)
    {
        $lancamento = Lancamento::findOrFail($id);
        $lancamento->delete();

        return response()->json(['message' => 'Lançamento excluído com sucesso']);
    }
}

