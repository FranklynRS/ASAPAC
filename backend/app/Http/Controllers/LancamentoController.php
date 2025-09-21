<?php

namespace App\Http\Controllers;

use App\Models\Lancamento;
use App\Models\Categoria;
use App\Models\Acerto; // Adicione o modelo de Acerto
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Http\Controllers\AcertoController;

class LancamentoController extends Controller
{
    public function index()
    {
        $lancamentos = Lancamento::with('categoria', 'usuario', 'mes')->get();

        return response()->json($lancamentos);
    }

    public function store(Request $request)
    {
        $valor = str_replace(',', '.', $request->valor);
        $request->merge(['valor' => $valor]);

        $validated = $request->validate([
            'descricao' => 'required|string|max:255',
            'valor' => 'required|numeric',
            'id_mes' => 'required|integer|exists:meses,id_mes',
            'id_usuario' => 'required|integer|exists:usuarios,id_usuario',
            'id_categoria' => 'required|integer|exists:categorias,id_categoria',
        ]);

        $lancamento = Lancamento::create([
            'descricao' => $validated['descricao'],
            'valor' => $validated['valor'],
            'id_mes' => $validated['id_mes'],
            'id_usuario' => $validated['id_usuario'],
            'id_categoria' => $validated['id_categoria'],
            'data_lancamento' => now(),
        ]);
        
        return response()->json($lancamento->load(['categoria']), 201);
    }

    public function show($id)
    {
        try {
            $lancamento = Lancamento::findOrFail($id);
        } catch (ModelNotFoundException $e) {
            return response()->json(['erro' => 'Lançamento não encontrado.'], 404);
        }

        return response()->json($lancamento);
    }

    public function update(Request $request, $id)
    {
        try {
            $lancamento = Lancamento::findOrFail($id);
        } catch (ModelNotFoundException $e) {
            return response()->json(['erro' => 'Lançamento não encontrado.'], 404);
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
            return response()->json(['erro' => 'Nenhum lançamento encontrado para este mês.'], 404);
        }

        $dadosFormatados = $lancamentos->map(function($lancamento) {
            return [
                'id_lancamento' => 'lancamento_' . $lancamento->id_lancamento,
                'descricao' => $lancamento->descricao,
                'valor' => (float) $lancamento->valor,
                'categoria' => $lancamento->categoria,
            ];
        });

        return response()->json($dadosFormatados);
    }

    public function getCombinedByMes($idMes)
    {
        $lancamentos = Lancamento::where('id_mes', $idMes)
            ->with('categoria')
            ->get()
            ->map(function ($lancamento) {
                return [
                    'id_lancamento' => 'lancamento_' . $lancamento->id_lancamento,
                    'descricao' => $lancamento->descricao,
                    'valor' => (float) $lancamento->valor,
                    'categoria' => $lancamento->categoria,
                ];
            });

        $acertos = Acerto::with('mensageiro')
            ->where('mes_id', $idMes)
            ->get();
            
        $acertosFormatados = $acertos->flatMap(function($acerto) {
            $items = [];
            
            if ((float) $acerto->valor_recebido > 0) {
                $items[] = [
                    'id_lancamento' => 'acerto_recebido_' . $acerto->id_acerto,
                    'descricao' => 'Acerto de Recebimento do ' . $acerto->mensageiro->nome_mensageiro,
                    'valor' => (float) $acerto->valor_recebido,
                    'categoria' => [
                        'id_categoria' => null,
                        'nome_categoria' => 'Acerto Recebimento',
                        'tipo' => 1,
                    ],
                ];
            }

            $totalPagamentosAcerto = (float) $acerto->pagamento + (float) $acerto->gasolina + (float) $acerto->hotel + (float) $acerto->alimentacao + (float) $acerto->outros;
            if ($totalPagamentosAcerto > 0) {
                $items[] = [
                    'id_lancamento' => 'acerto_pagamento_' . $acerto->id_acerto,
                    'descricao' => 'Acerto de Despesas do ' . $acerto->mensageiro->nome_mensageiro,
                    'valor' => $totalPagamentosAcerto,
                    'categoria' => [
                        'id_categoria' => null,
                        'nome_categoria' => 'Acerto Pagamento',
                        'tipo' => 0,
                    ],
                ];
            }

            return $items;
        });

        $combinado = $lancamentos->merge($acertosFormatados);
        return response()->json($combinado);
    }
}