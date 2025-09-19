<?php

namespace App\Http\Controllers;

use App\Models\Lancamento;
use App\Models\Categoria; // Importe o model de Categoria
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
        // Regras de validação para o novo tipo de lançamento
        $validated = $request->validate([
            'descricao' => 'required|string|max:255',
            'valor' => 'required|numeric',
            'id_mes' => 'required|integer|exists:meses,id_mes',
            'id_usuario' => 'required|integer|exists:usuarios,id_usuario',
            'tipo' => 'required|integer|in:0,1', // 0 para Pagamento, 1 para Recebimento
        ]);

        // Encontra ou cria a categoria 'Recebimentos' ou 'Pagamentos'
        $categoriaNome = $validated['tipo'] === 1 ? 'Recebimentos' : 'Pagamentos';
        $categoria = Categoria::firstOrCreate(
            ['nome_categoria' => $categoriaNome],
            ['tipo' => $validated['tipo']]
        );

        // Cria o novo lançamento com base nos dados do request e na categoria encontrada
        $lancamento = Lancamento::create([
            'descricao' => $validated['descricao'],
            'valor' => $validated['valor'],
            'id_mes' => $validated['id_mes'],
            'id_usuario' => $validated['id_usuario'],
            'id_categoria' => $categoria->id_categoria, // Usa o ID da categoria
            'data_lancamento' => now(), // Define a data de hoje automaticamente
        ]);
        
        return response()->json($lancamento->load(['categoria']), 201);
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