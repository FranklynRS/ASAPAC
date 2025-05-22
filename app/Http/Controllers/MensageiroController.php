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
        return Mensageiro::all();
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

    public function show(Mensageiro $mensageiro)
    {
        return $mensageiro;
    }

    public function update(Request $request, Mensageiro $mensageiro)
    {
        //
    }

    public function destroy(Mensageiro $mensageiro)
    {
        
    }

    public function getAtivos()
    {
        $mensageirosAtivos = Mensageiro::where('ativo', true)->get();
        return response()->json($mensageirosAtivos);

    }
}
