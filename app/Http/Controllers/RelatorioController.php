<?php

namespace App\Http\Controllers;

use App\Models\Lancamento;
use App\Models\Acerto;
use App\Models\Mes;
use Illuminate\Http\Request;

class RelatorioController extends Controller
{
    public function show($id_mes)
    {
        // Verifica se o mês existe
        $mes = Mes::with('lancamentos.categoria', 'lancamentos.usuario')
                  ->find($id_mes);

        if (!$mes) {
            return response()->json(['erro' => 'Mês não encontrado'], 404);
        }

        // LANÇAMENTOS (RECEITAS)
        $lancamentos = Lancamento::with('categoria', 'usuario')
            ->where('id_mes', $id_mes)
            ->get();

        $totalReceitas = $lancamentos->sum('valor');

        $dadosLancamentos = $lancamentos->map(function ($l) {
            return [
                'descricao'     => $l->descricao,
                'valor'         => $l->valor,
                'data'          => $l->data_lancamento,
                'nome_categoria'=> $l->categoria->nome_categoria ?? null,
                'nome_usuario'  => $l->usuario->nome_usuario ?? null,
            ];
        });

        // ACERTOS (DESPESAS)
        $acertos = Acerto::with('usuario')
            ->whereHas('usuario', function ($query) use ($id_mes) {
                $query->whereIn('id_usuario', function ($sub) use ($id_mes) {
                    $sub->select('id_usuario')->from('lancamentos')->where('id_mes', $id_mes);
                });
            })
            ->get();

        // Somando despesas por tipo
        $totalDespesas = [
            'pagamento'    => $acertos->sum('pagamento'),
            'gasolina'     => $acertos->sum('gasolina'),
            'alimentacao'  => $acertos->sum('alimentacao'),
            'outros'       => $acertos->sum('outros'),
        ];

        $somaDespesas = array_sum($totalDespesas);
        $saldo = $totalReceitas - $somaDespesas;

        return response()->json([
            'ano_mes'           => $mes->ano_mes,
            'total_receitas'    => round($totalReceitas, 2),
            'total_despesas'    => array_map(fn($v) => round($v, 2), $totalDespesas),
            'saldo'             => round($saldo, 2),
            'lancamentos'       => $dadosLancamentos,
        ], 200);
    }
}

