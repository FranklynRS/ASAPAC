<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Mes; 
use App\Models\Lancamento; 
use App\Models\Acerto; 
use Carbon\Carbon;

class RelatorioController extends Controller
{
    /**
     * @param int
     * @return \Illuminate\View\View
     */
    public function emitirRelatorio($id_mes)
    {
        $mes = Mes::findOrFail($id_mes); 
        
        try {
            setlocale(LC_TIME, 'pt_BR', 'pt_BR.utf-8', 'portuguese'); 

            $dt = Carbon::createFromFormat('Y-m', $mes->ano_mes); 
            
            $tituloMes = ucfirst($dt->translatedFormat('F/Y')); 
        } catch (\Exception $e) {
            $tituloMes = $mes->ano_mes; 
        }

        $recebimentos = Lancamento::where('id_mes', $id_mes)
                                    ->whereHas('categoria', fn ($q) => $q->where('tipo', 1))
                                    ->with('categoria') 
                                    ->get();

        $pagamentos = Lancamento::where('id_mes', $id_mes)
                                    ->whereHas('categoria', fn ($q) => $q->where('tipo', 2))
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
}