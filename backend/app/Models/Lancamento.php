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

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'id_usuario', 'id_usuario');
    }

    public function mes()
    {
        return $this->belongsTo(Mes::class, 'id_mes', 'id_mes');
    }

    public function categoria()
    {
        return $this->belongsTo(Categoria::class, 'id_categoria', 'id_categoria');
    }
}
