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
        // Passamos 'true' para obter as regras de atualização (com 'sometimes').
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
            'alimentacao' => [$rule, 'numeric', 'min:0'],
            'outros' => [$rule, 'numeric', 'min:0'],
        ];
    }
}
