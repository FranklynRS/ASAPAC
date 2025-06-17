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
        'tipo' // booleano: 1 = entrada, 0 = saída
    ];

    public $timestamps = false;

    // Relacionamento com lançamentos
    public function lancamentos()
    {
        return $this->hasMany(Lancamento::class, 'id_categoria', 'id_categoria');
    }
}
