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

    public function getMesesComSaldos(Request $request)
    {
        $mesesTraduzidos = [
            1 => 'Janeiro', 2 => 'Fevereiro', 3 => 'Março', 4 => 'Abril',
            5 => 'Maio', 6 => 'Junho', 7 => 'Julho', 8 => 'Agosto',
            9 => 'Setembro', 10 => 'Outubro', 11 => 'Novembro', 12 => 'Dezembro'
        ];

        $query = Mes::with(['lancamentos.categoria', 'acertos']);

        if ($request->has('ano') && $request->ano) {
            $query->where('ano_mes', 'like', '%' . $request->ano . '%');
        }

        if ($request->has('ordem') && $request->ordem === 'antigo') {
            $query->orderBy('ano_mes', 'asc');
        } else {
            $query->orderBy('ano_mes', 'desc');
        }

        $meses = $query->get()->map(function ($mes) use ($mesesTraduzidos) {
            
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

            try {
                $dt = Carbon::createFromFormat('Y-m', $mes->ano_mes);
                $nomeMes = $mesesTraduzidos[$dt->format('n')];
                $ano = $dt->format('Y');
                $nomeFormatado = $nomeMes . '/' . $ano;
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
        });

        if ($request->has('status') && $request->status) {
            $meses = $meses->filter(function ($mes) use ($request) {
                return $mes['status'] === $request->status;
            });
        }

        return response()->json($meses->values());
    }
}