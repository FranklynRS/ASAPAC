<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Categoria extends Model
{
    protected $table = 'categorias'; 
    protected $primaryKey = 'id_categoria';

    protected $fillable = [
        'nome_categoria',
        'descricao',
        'tipo',
        'id_usuario'
    ];

    public $timestamps = true; 

    public function lancamentos()
    {
        return $this->hasMany(Lancamento::class, 'id_categoria', 'id_categoria');
    }

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'id_usuario', 'id_usuario');
    }
}