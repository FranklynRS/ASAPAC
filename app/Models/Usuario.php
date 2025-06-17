<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;

class Usuario extends Authenticatable
{
    protected $table = 'usuarios'; // confere se sua tabela chama "usuarios"

    protected $primaryKey = 'id_usuario';

    public $timestamps = false;

    protected $fillable = [
        'nome_usuario',
        'email_usuario',
        'senha_usuario',
    ];

    protected $hidden = [
        'senha_usuario',
    ];

    // Para o Auth funcionar com senha customizada:
    public function getAuthPassword()
    {
        return $this->senha_usuario;
    }
}