<?php

namespace App\Http\Controllers;

use App\Models\Acerto;
use Illuminate\Http\Request;

class AcertoController extends Controller
{
    public function index()
    {
        $acertos = Acerto::with(['mensageiro'])->get();
        return response()->json($acertos);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate($this->getValidationRules());
        $acerto = Acerto::create($validatedData);
        return response()->json($acerto->load(['mensageiro']), 201);
    }

    public function show(Acerto $acerto)
    {
        return response()->json($acerto->load(['mensageiro']));
    }

    public function update(Request $request, Acerto $acerto)
    {
        $validatedData = $request->validate($this->getValidationRules(true));
        $acerto->update($validatedData);
        return response()->json($acerto->load(['mensageiro']));
    }

    public function destroy($id)
    {
        $acerto = Acerto::findOrFail($id);
        $acerto->delete();
        return response()->json(['message' => 'Acerto excluído com sucesso']);
    }

    private function getValidationRules(bool $isUpdate = false): array
    {
        $rule = $isUpdate ? 'sometimes' : 'required';
        return [
            'id_usuario' => [$rule, 'integer', 'exists:usuarios,id_usuario'],
            'id_mensageiro' => [$rule, 'integer', 'exists:mensageiros,id_mensageiro'],
            'valor_recebido' => [$rule, 'numeric', 'min:0'],
            'pagamento' => [$rule, 'numeric', 'min:0'],
            'gasolina' => [$rule, 'numeric', 'min:0'],
            'hotel' => [$rule, 'numeric', 'min:0'],
            'alimentacao' => [$rule, 'numeric', 'min:0'],
            'outros' => [$rule, 'numeric', 'min:0'],
            'mes_id' => [$rule, 'integer', 'exists:meses,id_mes'],
        ];
    }

    public function getAcertosByMes($idMes)
    {
        $acertos = Acerto::with('mensageiro')
            ->where('mes_id', $idMes)
            ->get()
            ->filter(function($acerto) {
                return $acerto->mensageiro !== null;
            });

        // Mapeia os acertos para garantir que todos os valores sejam floats
        $dadosFormatados = $acertos->map(function($acerto) {
            return [
                'id_acerto' => (int) $acerto->id_acerto,
                'nome_mensageiro' => $acerto->mensageiro->nome_mensageiro,
                'valor_recebido' => (float) $acerto->valor_recebido,
                'pagamento' => (float) $acerto->pagamento,
                'gasolina' => (float) $acerto->gasolina,
                'hotel' => (float) $acerto->hotel,
                'alimentacao' => (float) $acerto->alimentacao,
                'outros' => (float) $acerto->outros,
            ];
        })->values();

        return response()->json($dadosFormatados);
    }
}