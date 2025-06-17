<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mensageiro extends Model
{
    protected $table = 'mensageiros';

    protected $primaryKey = 'id_mensageiro';

    protected $fillable = ['nome_mensageiro', 'telefone', 'codigo_mensageiro', 'status'];

    public $timestamps = false;

}
