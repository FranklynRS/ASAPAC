<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class Usuario extends Authenticatable implements JWTSubject
{
    protected $table = 'usuarios'; 
    protected $primaryKey = 'id_usuario';
    public $timestamps = false;

    protected $fillable = [
        'nome_usuario',
        'foto_usuario',
        'email_usuario',
        'senha_usuario',
    ];

    protected $hidden = [
        'senha_usuario',
    ];


    public function getAuthPassword()
    {
        return $this->senha_usuario;
    }

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }
}