<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class Usuario extends Authenticatable implements JWTSubject
{
    protected $table = 'usuarios'; // tabela no banco
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

    // Retorna o identificador único para o JWT (normalmente a PK).
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    //  Retorna claims customizados (se quiser adicionar infos extras ao token).

    public function getJWTCustomClaims()
    {
        return [];
    }
}