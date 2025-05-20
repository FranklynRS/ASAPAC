<?php

namespace App\Http\Controllers;

use App\Models\Mensageiro;
use Illuminate\Http\Request;

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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Mensageiro $mensageiro)
    {
        return $mensageiro;
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

    public function getAtivos()
    {
    $mensageirosAtivos = Mensageiro::where('ativo', true)->get();
    return response()->json($mensageirosAtivos);
    }
}
