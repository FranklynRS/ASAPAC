<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mes extends Model
{
    protected $table = 'meses';
    protected $primaryKey = 'id_mes';
    public $timestamps = false;

    protected $fillable = [
        'ano_mes'
    ];

    protected $casts = [
        'ano_mes' => 'string'
    ];

    // Validação centralizada
    public static function rules($id = null)
    {
        return [
            'ano_mes' => 'required|string|size:7|unique:meses,ano_mes,'.$id.',id_mes|regex:/^\d{4}-\d{2}$/'
        ];
    }
}