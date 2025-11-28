<?php

namespace App\Http\Controllers;

use App\Models\Mes;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class MesController extends Controller
{
    public function index() { return response()->json(Mes::all()); }
    public function show($id) { return response()->json(Mes::findOrFail($id)); }
    
    public function store(Request $request) {
        $validator = Validator::make($request->all(), Mes::rules());
        if ($validator->fails()) return response()->json(['errors' => $validator->errors()], 422);
        return response()->json(Mes::create($validator->validated()), 201);
    }

    public function update(Request $request, $id) {
        $mes = Mes::findOrFail($id);
        $validator = Validator::make($request->all(), Mes::rules($id));
        if ($validator->fails()) return response()->json(['errors' => $validator->errors()], 422);
        $mes->update($validator->validated());
        return response()->json($mes);
    }

    public function getMesesComSaldos()
    {
        $meses = Mes::with(['lancamentos.categoria', 'acertos'])->get()->map(function ($mes) {
            
            $receita = 0;
            $despesa = 0;

            foreach ($mes->lancamentos as $lanc) {
                if ($lanc->categoria) {
                    if ($lanc->categoria->tipo == 1) {
                        $receita += (float)$lanc->valor;
                    } else {
                        $despesa += (float)$lanc->valor;
                    }
                }
            }

            foreach ($mes->acertos as $acerto) {
                $receita += (float)$acerto->valor_recebido;
                
                $gastoAcerto = (float)$acerto->pagamento + 
                               (float)$acerto->gasolina + 
                               (float)$acerto->hotel + 
                               (float)$acerto->alimentacao + 
                               (float)$acerto->outros;
                $despesa += $gastoAcerto;
            }

            $saldoFinal = $receita - $despesa;
            $status = $saldoFinal >= 0 ? 'positivo' : 'negativo';

            setlocale(LC_TIME, 'pt_BR', 'pt_BR.utf-8', 'portuguese');
            try {
                $dt = Carbon::createFromFormat('Y-m', $mes->ano_mes);
                $nomeFormatado = ucfirst($dt->translatedFormat('F/Y'));
            } catch (\Exception $e) {
                $nomeFormatado = $mes->ano_mes;
            }

            return [
                'id_mes' => $mes->id_mes,
                'ano_mes' => $mes->ano_mes,
                'nome' => $nomeFormatado, 
                
                'saldo' => round($saldoFinal, 2), 
                
                'status' => $status
            ];
        })->sortByDesc('ano_mes')->values();

        return response()->json($meses);
    }
}