<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mes extends Model
{
    protected $table = 'meses';
    protected $primaryKey = 'id_mes';
    public $timestamps = false;

    protected $fillable = [ 'ano_mes' ];

    protected $casts = [ 'ano_mes' => 'string' ];

    public static function rules($id = null)
    {
        return [
            'ano_mes' => 'required|string|size:7|unique:meses,ano_mes,'.$id.',id_mes|regex:/^\d{4}-\d{2}$/'
        ];
    }

    public function lancamentos()
    {
        return $this->hasMany(Lancamento::class, 'id_mes', 'id_mes');
    }

    public function acertos()
    {
        return $this->hasMany(Acerto::class, 'mes_id', 'id_mes');
    }
}