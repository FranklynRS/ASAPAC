<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório Financeiro - {{ $tituloMes }}</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            color: #333;
            padding: 20px;
            max-width: 1000px;
            margin: 0 auto;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #333;
            padding-bottom: 15px;
            margin-bottom: 30px;
        }
        .header-left {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        .logo {
            width: 70px; 
            height: auto;
            max-height: 70px;
        }
        .header-title h1 {
            margin: 0;
            font-size: 28px;
            color: #000;
            text-transform: uppercase;
        }
        .header-title h2 {
            margin: 2px 0 0 0;
            font-size: 14px;
            font-weight: normal;
            color: #555;
        }
        .header-right {
            text-align: right;
            font-size: 14px;
            color: #666;
        }
        .header-right strong {
            display: block;
            font-size: 16px;
            color: #333;
            margin-bottom: 5px;
        }

        .section {
            margin-bottom: 30px;
            border: 1px solid #ddd;
            border-radius: 8px;
            overflow: hidden;
            break-inside: avoid;
        }
        .section-header {
            padding: 10px 15px;
            color: white;
            font-weight: bold;
            font-size: 18px;
            text-transform: uppercase;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            background: white;
        }
        th, td {
            padding: 10px 15px;
            text-align: left;
            border-bottom: 1px solid #eee;
        }
        th {
            font-weight: 700;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .col-valor {
            text-align: right;
            font-weight: bold;
            font-family: monospace;
        }
        .total-row td {
            border-top: 2px solid;
            font-weight: bold;
            font-size: 14px;
        }


        .recebimentos .section-header { background-color: #388e3c; } 
        .recebimentos th { color: #388e3c; background-color: #e8f5e9; }
        .recebimentos .total-row td { border-color: #388e3c; background-color: #e8f5e9; color: #1b5e20; }

        .pagamentos .section-header { background-color: #d32f2f; } 
        .pagamentos th { color: #d32f2f; background-color: #ffebee; }
        .pagamentos .total-row td { border-color: #d32f2f; background-color: #ffebee; color: #b71c1c; }

        .acertos .section-header { background-color: #1976d2; } 
        .acertos th { color: #1976d2; background-color: #e3f2fd; }
        .acertos .total-row td { border-color: #1976d2; background-color: #e3f2fd; color: #0d47a1; }
        .acertos .col-valor-rec { color: #388e3c; } 
        .acertos .col-valor-pag { color: #d32f2f; } 

        .saldo-final .section-header { 
            background-color: #6c757d; 
            font-size: 20px;
            text-align: center;
        } 
        .saldo-final th { 
            color: #495057; 
            background-color: #e9ecef; 
        }
        .saldo-final .total-row td { 
            border-color: #6c757d; 
            background-color: #e9ecef; 
            color: #495057; 
            font-size: 16px;
        }

        @media print {
            body { 
                padding: 0; 
                max-width: 100%; 
                margin: 0;
            }
            .section { 
                box-shadow: none; 
                border: 1px solid #ddd; 
            }
            .section-header, .recebimentos .total-row, .pagamentos .total-row, .acertos .total-row, .saldo-final .total-row {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
            }
            
            table {
                page-break-after: auto;
            }
            tr {
                page-break-inside: avoid;
                page-break-after: auto;
            }
            thead {
                display: table-header-group;
            }
        }
    </style>
</head>
<body>

    <div class="header">
        <div class="header-left">
            <img src="{{ asset('assets/img/logoasapac.png') }}" alt="Logo ASAPAC" class="logo">
            <div class="header-title">
                <h1>ASAPAC</h1>
                <h2>Relatório Financeiro Mensal do Caixa</h2>
            </div>
        </div>
        <div class="header-right">
            <strong>Filial: Governador Valadares-MG</strong>
            <span>Referência: {{ $tituloMes }}</span>
        </div>
    </div>

    <div class="section recebimentos">
        <div class="section-header">Recebimentos</div>
        <table>
            <thead>
                <tr>
                    <th>Categoria</th>
                    <th class="col-valor">Valor (R$)</th>
                </tr>
            </thead>
            <tbody>
                @forelse($recebimentos as $rec)
                    <tr>
                        <td>{{ $rec->categoria->nome_categoria ?? 'Sem Categoria' }}</td>
                        <td class="col-valor">+ {{ number_format($rec->valor, 2, ',', '.') }}</td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="2">Nenhum lançamento de Recebimento encontrado.</td>
                    </tr>
                @endforelse
                <tr class="total-row">
                    <td><strong>SUBTOTAL LANÇAMENTOS RECEBIDOS</strong></td>
                    <td class="col-valor"><strong>{{ number_format($recebimentos->sum('valor'), 2, ',', '.') }}</strong></td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="section pagamentos">
        <div class="section-header">Pagamentos</div>
        <table>
            <thead>
                <tr>
                    <th>Categoria</th>
                    <th class="col-valor">Valor (R$)</th>
                </tr>
            </thead>
            <tbody>
                @forelse($pagamentos as $pag)
                    <tr>
                        <td>{{ $pag->categoria->nome_categoria ?? 'Sem Categoria' }}</td>
                        <td class="col-valor">- {{ number_format($pag->valor, 2, ',', '.') }}</td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="2">Nenhum lançamento de Pagamento encontrado.</td>
                    </tr>
                @endforelse
                <tr class="total-row">
                    <td><strong>SUBTOTAL LANÇAMENTOS PAGOS</strong></td>
                    <td class="col-valor"><strong>{{ number_format($pagamentos->sum('valor'), 2, ',', '.') }}</strong></td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="section acertos">
        <div class="section-header">Acertos de Mensageiros</div>
        <table>
            <thead>
                <tr>
                    <th>Mensageiro</th>
                    <th class="col-valor">Rec.</th>
                    <th class="col-valor">Pag.</th>
                    <th class="col-valor">Gasolina</th>
                    <th class="col-valor">Hotel</th>
                    <th class="col-valor">Alim.</th>
                    <th class="col-valor">Outros</th>
                </tr>
            </thead>
            <tbody>
                @forelse($acertos as $acerto)
                    <tr>
                        <td>{{ $acerto->mensageiro->nome_mensageiro ?? 'Desconhecido' }}</td>
                        <td class="col-valor col-valor-rec">{{ number_format($acerto->valor_recebido, 2, ',', '.') }}</td>
                        <td class="col-valor col-valor-pag">{{ number_format($acerto->pagamento, 2, ',', '.') }}</td>
                        <td class="col-valor">{{ number_format($acerto->gasolina, 2, ',', '.') }}</td>
                        <td class="col-valor">{{ number_format($acerto->hotel, 2, ',', '.') }}</td>
                        <td class="col-valor">{{ number_format($acerto->alimentacao, 2, ',', '.') }}</td>
                        <td class="col-valor">{{ number_format($acerto->outros, 2, ',', '.') }}</td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="7">Nenhum acerto encontrado para este mês.</td>
                    </tr>
                @endforelse
                <tr class="total-row">
                    <td><strong>SUBTOTAL RECEBIDO VIA ACERTOS</strong></td>
                    <td class="col-valor"><strong>{{ number_format($acertos->sum('valor_recebido'), 2, ',', '.') }}</strong></td>
                    <td class="col-valor" colspan="5"></td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="section saldo-final">
        <div class="section-header">Resumo Financeiro Mensal</div>
        <table>
            <thead>
                <tr>
                    <th>Descrição</th>
                    <th class="col-valor">Valor (R$)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Total Geral de Recebimentos (Lançamentos + Acertos)</td>
                    <td class="col-valor">+ {{ number_format($totalRecebimentos, 2, ',', '.') }}</td>
                </tr>
                <tr>
                    <td>Total Geral de Pagamentos (Lançamentos + Acertos)</td>
                    <td class="col-valor">- {{ number_format($totalPagamentos, 2, ',', '.') }}</td>
                </tr>
                <tr class="total-row">
                    <td><strong>SALDO FINAL DO CAIXA ({{ $tituloMes }})</strong></td>
                    <td class="col-valor">
                        <strong style="color: {{ $saldoFinal >= 0 ? '#1b5e20' : '#b71c1c' }};">
                            {{ $saldoFinal >= 0 ? '+ ' : '- ' }} 
                            {{ number_format(abs($saldoFinal), 2, ',', '.') }}
                        </strong>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <script>
        window.onload = function() {
            setTimeout(() => {
                window.print();
            }, 500); 
        }
    </script>
</body>
</html>