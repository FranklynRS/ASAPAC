<?php

namespace App\Http\Controllers;

use App\Models\Acerto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AcertoController extends Controller
{
    /* Lista todos os acertos. (GET /api/acertos) */
    public function index()
    {
        $acertos = Acerto::with(['mensageiro'])->get();
        return response()->json($acertos);
    }

    /* Cria um novo acerto. (POST /api/acertos) */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), $this->getValidationRules());

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Erro na validação dos dados',
                'errors' => $validator->errors()
            ], 422);
        }

        $acerto = Acerto::create($validator->validated());

        return response()->json($acerto->load(['mensageiro']), 201);
    }

    /* Exibe um acerto específico. (GET /api/acertos/{acerto})*/
    public function show(Acerto $acerto)
    {
        return response()->json($acerto->load(['mensageiro']));
    }

    /* Atualiza um acerto existente. (PUT /api/acertos/{acerto})*/
    public function update(Request $request, Acerto $acerto)
    {
        $validator = Validator::make($request->all(), $this->getValidationRules());

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Erro na validação dos dados',
                'errors' => $validator->errors()
            ], 422);
        }

        $acerto->update($validator->validated());

        return response()->json($acerto->load(['mensageiro']));
    }

    /* Exclui um acerto. (DELETE /api/acertos/{acerto}) */
    public function destroy(Acerto $acerto)
    {
        $acerto->delete();
        return response()->json(null, 204);
    }

    /* Regras de validação centralizadas e corrigidas. */
    private function getValidationRules(): array
    {
        return [
            'id_usuario' => 'required|integer|exists:usuarios,id_usuario',
            'id_mensageiro' => 'required|integer|exists:mensageiros,id_mensageiro',
            'valor_recebido' => 'required|numeric|min:0',
            'pagamento' => 'required|numeric|min:0',
            'gasolina' => 'required|numeric|min:0',
            'alimentacao' => 'required|numeric|min:0',
            'outros' => 'required|numeric|min:0',
        ];
    }
}
