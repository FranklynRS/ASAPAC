<?php

namespace App\Http\Controllers;

use App\Models\Mensageiro;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MensageiroController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
        'nome_mensageiro' => 'required|string|max:255',
        'telefone' => 'required|string|max:255',
        'codigo_mensageiro' => 'required|string|max:255|unique:mensageiros,codigo_mensageiro',
    ]);
    
    if ($validator->fails()) {
        return response()->json([
            'message' => 'Erro de validação',
            'errors' => $validator->errors()
        ], 422);
    }

    $mensageiro = Mensageiro::create($validator->validated());

    return response()->json($mensageiro, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Mensageiro $mensageiro)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Mensageiro $mensageiro)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Mensageiro $mensageiro)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Mensageiro $mensageiro)
    {
        //
    }
}
