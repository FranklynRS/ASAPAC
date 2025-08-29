<?php

namespace App\Http\Controllers;

use App\Models\Mes;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MesController extends Controller
{
    public function index()
    {
        $meses = Mes::all();
        return response()->json($meses);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), Mes::rules());

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Erro na validação',
                'errors' => $validator->errors()
            ], 422);
        }

        $mes = Mes::create($validator->validated());

        return response()->json($mes, 201);
    }

    public function show($id)
    {
        $mes = Mes::findOrFail($id);
        return response()->json($mes);
    }

    public function update(Request $request, $id) 
    {
        $mes = Mes::findOrFail($id);

        $validator = Validator::make($request->all(), Mes::rules($id));

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Erro na validação',
                'errors' => $validator->errors()
            ], 422);
        }

        $mes->update($validator->validated());

        return response()->json($mes);
    }
}