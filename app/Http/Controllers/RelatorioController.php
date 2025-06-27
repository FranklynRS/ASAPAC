<?php

namespace App\Http\Controllers;

use App\Models\Lancamento;
use App\Models\Acerto;
use App\Models\Mes;

class RelatorioController extends Controller
{
    public function show($id_mes)
    {
        $mes = Mes::with('lancamentos.categoria', 'lancamentos.usuario')->find($id_mes);

        if (!$mes) {
            return response()->json(['erro' => 'Mês não encontrado'], 404);
        }

        // Lançamentos
        $dadosLancamentos = [];
        $totalLancamentos = 0;

        foreach ($mes->lancamentos as $l) {
            $categoriaNome = $l->categoria->nome_categoria ?? 'Desconhecida';
            $tipo = $l->categoria->tipo; // 1 = entrada, 0 = saída
            $valor = floatval($l->valor) * ($tipo == 0 ? -1 : 1);
            $totalLancamentos += $valor;

            $dadosLancamentos[$categoriaNome][] = [
                'descricao'     => $l->descricao,
                'valor'         => $valor,
                'data'          => $l->data_lancamento,
                'nome_usuario'  => $l->usuario->nome_usuario ?? null,
            ];
        }

        // Acertos
        $acertos = Acerto::with('usuario')->get(); // ajuste se quiser filtrar por mês
        $dadosAcertos = [
            'valor_recebido' => [],
            'pagamento'      => [],
            'gasolina'       => [],
            'alimentacao'    => [],
            'outros'         => []
        ];
        $totalAcertos = 0;

        foreach ($acertos as $a) {
            $usuario = $a->usuario->nome_usuario ?? null;

            // Receita
            $valorRecebido = floatval($a->valor_recebido);
            $dadosAcertos['valor_recebido'][] = [
                'valor' => $valorRecebido,
                'nome_usuario' => $usuario
            ];
            $totalAcertos += $valorRecebido;

            // Despesas
            foreach (['pagamento', 'gasolina', 'alimentacao', 'outros'] as $campo) {
                $valor = floatval($a->$campo);
                if ($valor > 0) {
                    $dadosAcertos[$campo][] = [
                        'valor' => -$valor,
                        'nome_usuario' => $usuario
                    ];
                    $totalAcertos -= $valor;
                }
            }
        }

        return response()->json([
            'ano_mes'     => $mes->ano_mes,
            'lancamentos' => $dadosLancamentos,
            'acertos'     => $dadosAcertos,
            'saldo'       => round($totalLancamentos + $totalAcertos, 2)
        ]);
    }
}