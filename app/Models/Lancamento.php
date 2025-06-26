<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lancamento extends Model
{
    protected $table = 'lancamentos';
    protected $primaryKey = 'id_lancamento';
    public $timestamps = false;

    protected $fillable = [
        'descricao',
        'data_lancamento',
        'id_usuario',
        'id_mes',
        'id_categoria',
        'valor'
    ];
}
