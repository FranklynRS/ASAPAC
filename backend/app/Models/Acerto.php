<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Acerto extends Model
{
    use HasFactory;

    protected $table = 'acertos';
    protected $primaryKey = 'id_acerto';

    public $timestamps = false;

    protected $fillable = [
        'id_mensageiro',
        'id_usuario',
        'valor_recebido',
        'pagamento',
        'gasolina',
        'alimentacao',
        'outros',
        'mes_id',
    ];

    /* Define a relação: um Acerto pertence a um Mensageiro.*/
    public function mensageiro()
    {
        return $this->belongsTo(Mensageiro::class, 'id_mensageiro', 'id_mensageiro');
    }

    /* Define a relação: um Acerto pertence a um Usuario. */
    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'id_usuario', 'id_usuario');
    }
}
