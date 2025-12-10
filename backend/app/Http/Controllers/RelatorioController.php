<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Mes; 
use App\Models\Lancamento; 
use App\Models\Acerto; 
use Carbon\Carbon;

class RelatorioController extends Controller
{
    private $mesesTraduzidos = [
        1 => 'JANEIRO', 2 => 'FEVEREIRO', 3 => 'MARÇO', 4 => 'ABRIL',
        5 => 'MAIO', 6 => 'JUNHO', 7 => 'JULHO', 8 => 'AGOSTO',
        9 => 'SETEMBRO', 10 => 'OUTUBRO', 11 => 'NOVEMBRO', 12 => 'DEZEMBRO'
    ];

    public function emitirRelatorio($id_mes)
    {
        $mes = Mes::findOrFail($id_mes); 
        
        try {
            $dt = Carbon::createFromFormat('Y-m', $mes->ano_mes); 
            $nomeMes = $this->mesesTraduzidos[$dt->format('n')];
            $ano = $dt->format('Y');
            $tituloMes = ucfirst(strtolower($nomeMes)) . '/' . $ano; 
        } catch (\Exception $e) {
            $tituloMes = $mes->ano_mes; 
        }

        $recebimentos = Lancamento::where('id_mes', $id_mes)
                                    ->whereHas('categoria', fn ($q) => $q->where('tipo', 1))
                                    ->with('categoria') 
                                    ->get();

        $pagamentos = Lancamento::where('id_mes', $id_mes)
                                    ->whereHas('categoria', fn ($q) => $q->where('tipo', 0))
                                    ->with('categoria') 
                                    ->get();
        
        $acertos = Acerto::where('mes_id', $id_mes)
                            ->with('mensageiro') 
                            ->get()
                            ->filter(fn ($acerto) => $acerto->mensageiro !== null); 

        $totalRecebimentos = $recebimentos->sum('valor') + $acertos->sum('valor_recebido');
        
        $totalPagamentosAcertos = $acertos->sum(function ($acerto) {
             return $acerto->pagamento + $acerto->gasolina + $acerto->hotel + $acerto->alimentacao + $acerto->outros;
        });

        $totalPagamentosGeral = $pagamentos->sum('valor') + $totalPagamentosAcertos;
        
        $saldoFinal = $totalRecebimentos - $totalPagamentosGeral;

        return view('relatorios.mensal', [
            'tituloMes' => $tituloMes, 
            'recebimentos' => $recebimentos,
            'pagamentos' => $pagamentos,
            'acertos' => $acertos,
            'saldoFinal' => $saldoFinal, 
            'totalRecebimentos' => $totalRecebimentos, 
            'totalPagamentos' => $totalPagamentosGeral, 
        ]);
    }

    public function emitirRelatorio2($id_mes)
    {
        $mes = Mes::findOrFail($id_mes);

        try {
            $dt = Carbon::createFromFormat('Y-m', $mes->ano_mes);
            
            $tituloMes = $this->mesesTraduzidos[$dt->format('n')];
            $ano = $dt->format('Y');
            // ---------------------------------

        } catch (\Exception $e) {
            $tituloMes = $mes->ano_mes;
            $ano = '';
        }

        $receitas = Lancamento::where('id_mes', $id_mes)
            ->whereHas('categoria', fn ($q) => $q->where('tipo', 1))
            ->with('categoria')
            ->get()
            ->groupBy(function($item) {
                return $item->categoria->nome_categoria;
            })
            ->map(function ($items, $key) {
                return [
                    'nome' => $key,
                    'total' => $items->sum('valor')
                ];
            })->values();

        $despesas = Lancamento::where('id_mes', $id_mes)
            ->whereHas('categoria', fn ($q) => $q->where('tipo', 0))
            ->with('categoria')
            ->get()
            ->groupBy(function($item) {
                return $item->categoria->nome_categoria;
            })
            ->map(function ($items, $key) {
                return [
                    'nome' => $key,
                    'total' => $items->sum('valor')
                ];
            })->values();

        $acertos = Acerto::where('mes_id', $id_mes)->get();
        
        $totalAcertosRecebido = $acertos->sum('valor_recebido');
        
        $totalAcertosPago = $acertos->sum(function ($acerto) {
             return $acerto->pagamento + $acerto->gasolina + $acerto->hotel + $acerto->alimentacao + $acerto->outros;
        });

        $totalEntradas = $receitas->sum('total') + $totalAcertosRecebido;
        $totalSaidas = $despesas->sum('total') + $totalAcertosPago;
        $saldoFinal = $totalEntradas - $totalSaidas;

        return view('relatorios.mensal2', [
            'tituloMes' => $tituloMes,
            'ano' => $ano,
            'receitas' => $receitas,
            'despesas' => $despesas,
            'totalAcertosRecebido' => $totalAcertosRecebido,
            'totalAcertosPago' => $totalAcertosPago,
            'totalEntradas' => $totalEntradas,
            'totalSaidas' => $totalSaidas,
            'saldoFinal' => $saldoFinal
        ]);
    }
}