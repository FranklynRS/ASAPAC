<?php

namespace App\Http\Controllers;

use App\Models\Lancamento;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;

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
        ], [
            'id_categoria.exists' => 'A categoria informada não existe.',
            'id_usuario.exists'   => 'O usuário informado não existe.',
            'id_mes.exists'       => 'O mês informado ainda não foi cadastrado.'
        ]);

        $lancamento = Lancamento::create($validated);
        return response()->json($lancamento, 201);
    }

    public function show($id)
    {
        try {
            $lancamento = Lancamento::findOrFail($id);

        } catch (ModelNotFoundException $e) {
            return response()->json(
                ['erro' => 'Lançamento não encontrado.'],
                404
            );
        }

        return response()->json($lancamento);
    }

    public function update(Request $request, $id)
    {
        try {
            $lancamento = Lancamento::findOrFail($id);

        } catch (ModelNotFoundException $e) {
            return response()->json(
                ['erro' => 'Lançamento não encontrado.'], 
                404
            );
        }

        $validated = $request->validate([
            'descricao' => 'required|string|max:255',
            'data_lancamento' => 'required|date',
            'id_usuario' => 'required|integer|exists:usuarios,id_usuario',
            'id_mes' => 'required|integer|exists:meses,id_mes',
            'id_categoria' => 'required|integer|exists:categorias,id_categoria',
            'valor' => 'required|numeric'
        ], [
            'id_categoria.exists' => 'A categoria informada não existe.'
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

    public function getByMes($id_mes)
    
    {
    try {
        $lancamentos = Lancamento::where('id_mes', $id_mes)
            ->with('categoria', 'usuario', 'mes')
            ->get();

    } catch (ModelNotFoundException $e) {
        return response()->json(
            ['erro' => 'Nenhum lançamento encontrado para este mês.'],
            404
        );
    }
    return response()->json($lancamentos);
    }
}

