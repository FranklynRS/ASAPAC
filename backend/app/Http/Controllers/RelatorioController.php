<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\Mes;
use App\Models\Lancamento;
use App\Models\Acerto;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class RelatorioController extends Controller
{
    public function emitirRelatorio($id_mes)
    {
        try {
            $mes = Mes::findOrFail($id_mes);
        } catch (ModelNotFoundException $e) {
            return response()->json(['erro' => 'Mês não encontrado.'], 404);
        }

        $categoriasReport = [
            'DOAÇÕES RECEBIDAS' => ['entrada' => 0, 'saida' => 0],
            'RIFAS VENDIDAS' => ['entrada' => 0, 'saida' => 0],
            'OUTRAS ENTRADAS' => ['entrada' => 0, 'saida' => 0],
            'ESTORNOS SAÍDAS DE MÉS ANTERIOR' => ['entrada' => 0, 'saida' => 0],
            'ESTORNOS ENTRADAS DE MÉS ANTERIOR' => ['entrada' => 0, 'saida' => 0],
            'REMESSA RECEBIDA' => ['entrada' => 0, 'saida' => 0],
            'REMESSAS ENVIADAS' => ['entrada' => 0, 'saida' => 0],
            'DEPÓSITOS JUDICIAIS' => ['entrada' => 0, 'saida' => 0],
            'ALIMENTAÇÃO- MENSAGEIROS' => ['entrada' => 0, 'saida' => 0],
            'GASOLINA - MENSAGEIROS' => ['entrada' => 0, 'saida' => 0],
            'HOSPEDAGEM - MENSAGEIROS' => ['entrada' => 0, 'saida' => 0],
            'OUTROS CUSTOS - MENSAGEIROS' => ['entrada' => 0, 'saida' => 0],
            'ALUGUEL' => ['entrada' => 0, 'saida' => 0],
            'ÁGUA, ENERGIA ELÉTRICA' => ['entrada' => 0, 'saida' => 0],
            'TELEFONIA E INTERNET' => ['entrada' => 0, 'saida' => 0],
            'CORREIOS E CARTÓRIOS' => ['entrada' => 0, 'saida' => 0],
            'ALIMENTAÇÃO ESCRITÓRIO' => ['entrada' => 0, 'saida' => 0],
            'GASOLINA ESCRITÓRIO' => ['entrada' => 0, 'saida' => 0],
            'MATERIAL ESCRITÓRIO' => ['entrada' => 0, 'saida' => 0],
            'SERVIÇOS GRÁFICOS' => ['entrada' => 0, 'saida' => 0],
            'CÓPIAS E REPRODUÇÕES' => ['entrada' => 0, 'saida' => 0],
            'MATERIAL LIMPEZA' => ['entrada' => 0, 'saida' => 0],
            'PADARIA E SUPERMERCADO' => ['entrada' => 0, 'saida' => 0],
            'TRANSPORTE E LOCOMOÇÃO ADMINIST.' => ['entrada' => 0, 'saida' => 0],
            'MÓVEIS E UTENSÍLIOS' => ['entrada' => 0, 'saida' => 0],
            'MANUTENÇÃO DE VEÍCULOS ADMINIST.' => ['entrada' => 0, 'saida' => 0],
            'DESPESAS DE VIAGEM - ADMINISTRATIVAS' => ['entrada' => 0, 'saida' => 0],
            'OUTRAS DESPESAS ADMINISTRATIVAS' => ['entrada' => 0, 'saida' => 0],
            'CONTABILIDADE' => ['entrada' => 0, 'saida' => 0],
            'JURÍDICO' => ['entrada' => 0, 'saida' => 0],
            'OUTROS SERVIÇOS POR PESSOA FÍSICA' => ['entrada' => 0, 'saida' => 0],
            'OUTROS SERVIÇOS POR EMPRESAS' => ['entrada' => 0, 'saida' => 0],
            'SALÁRIOS' => ['entrada' => 0, 'saida' => 0],
            'FÉRIAS' => ['entrada' => 0, 'saida' => 0],
            'ADIANTAMENTOS' => ['entrada' => 0, 'saida' => 0],
            'RESCISÃO' => ['entrada' => 0, 'saida' => 0],
            'EXAMES MÉDICOS' => ['entrada' => 0, 'saida' => 0],
            'OUTROS CUSTOS COM FUNCIONARIOS' => ['entrada' => 0, 'saida' => 0],
            'MEDICAMENTOS' => ['entrada' => 0, 'saida' => 0],
            'PROFISSIONAIS CONTRATADOS' => ['entrada' => 0, 'saida' => 0],
            'MATERIAL DE HIGIENE' => ['entrada' => 0, 'saida' => 0],
            'RECREAÇÃO E ENTRETENIMENTO' => ['entrada' => 0, 'saida' => 0],
            'ALIMENTAÇÃO' => ['entrada' => 0, 'saida' => 0],
            'OUTROS CUSTOS COM SOCIAL' => ['entrada' => 0, 'saida' => 0],
            'DARF IMPOSTO DE RENDA' => ['entrada' => 0, 'saida' => 0],
            'DARF PIS' => ['entrada' => 0, 'saida' => 0],
            'MULTAS E ANUIDADES' => ['entrada' => 0, 'saida' => 0],
            'GUIA DO SINDICATO DE CLASSE' => ['entrada' => 0, 'saida' => 0],
            'OUTRAS MULTAS E TAXAS' => ['entrada' => 0, 'saida' => 0],
            'AJUDA DE CUSTO/MANUTENÇÃO' => ['entrada' => 0, 'saida' => 0],
            'DIESEL' => ['entrada' => 0, 'saida' => 0],
            'VALES' => ['entrada' => 0, 'saida' => 0],
            'CHEQUES' => ['entrada' => 0, 'saida' => 0],
        ];

        $lancamentosMes = Lancamento::where('id_mes', $id_mes)->with('categoria')->get();
        $acertosMes = Acerto::where('mes_id', $id_mes)->get();
        
        foreach ($lancamentosMes as $lancamento) {
            if ($lancamento->categoria) {
                $nomeCategoriaDB = strtoupper(
                    str_replace(' ', '', 
                        str_replace('-', '', 
                            iconv('UTF-8', 'ASCII//TRANSLIT', $lancamento->categoria->nome_categoria)
                        )
                    )
                );

                $categoriaDoRelatorio = '';
                if (strpos($nomeCategoriaDB, 'DOACAO') !== false || strpos($nomeCategoriaDB, 'RECEBIMENTO') !== false) {
                    $categoriaDoRelatorio = 'DOAÇÕES RECEBIDAS';
                } else {
                    $categoriaDoRelatorio = strtoupper($lancamento->categoria->nome_categoria);
                }

                if (array_key_exists($categoriaDoRelatorio, $categoriasReport)) {
                    if ($lancamento->categoria->tipo == 1) { // Entrada
                        $categoriasReport[$categoriaDoRelatorio]['entrada'] += (float) $lancamento->valor;
                    } else { // Saída
                        $categoriasReport[$categoriaDoRelatorio]['saida'] += (float) abs($lancamento->valor);
                    }
                }
            }
        }
        
        foreach ($acertosMes as $acerto) {
            if ($acerto->valor_recebido > 0) {
                $categoriasReport['DOAÇÕES RECEBIDAS']['entrada'] += (float) $acerto->valor_recebido;
            }

            $categoriasReport['REMESSAS ENVIADAS']['saida'] += (float) $acerto->pagamento;
            $categoriasReport['ALIMENTAÇÃO- MENSAGEIROS']['saida'] += (float) $acerto->alimentacao;
            $categoriasReport['GASOLINA - MENSAGEIROS']['saida'] += (float) $acerto->gasolina;
            $categoriasReport['HOSPEDAGEM - MENSAGEIROS']['saida'] += (float) $acerto->hotel;
            $categoriasReport['OUTROS CUSTOS - MENSAGEIROS']['saida'] += (float) $acerto->outros;
        }

        $pdf = Pdf::loadView('relatorios.template', compact('mes', 'categoriasReport'));
        return $pdf->download('relatorio_mensal_' . $mes->nome_mes . '.pdf');
    }
}