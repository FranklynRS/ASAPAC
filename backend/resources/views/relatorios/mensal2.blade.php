<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>Relatório Financeiro Modelo 2</title>
    <style>
        @page {
            size: A4 portrait;
            margin: 10mm;
        }

        html {
            box-sizing: border-box;
        }
        
        *, *:before, *:after {
            box-sizing: inherit;
        }

        body {
            margin: 0;
            padding: 0;
            font-family: 'Arial', sans-serif;
            font-size: 11px;
            color: #000;
            background-color: #525659; 
            display: flex;
            justify-content: center;
            min-height: 100vh;
            padding-top: 20px;
            padding-bottom: 20px;
        }
        
        .container {
            background-color: white;
            width: 210mm;
            min-height: 297mm; 
            border: 2px solid #000; 
            padding: 5px;
            box-shadow: 0 0 15px rgba(0,0,0,0.5); 
            display: flex;
            flex-direction: column;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            border-spacing: 0;
        }
        td, th {
            border: 1px solid #000;
            padding: 3px 5px;
        }

        .header-table {
            text-align: center;
            background-color: #F1F1F1;
            margin-bottom: 2px;
        }
        .header-table td { font-weight: bold; }
        .logo-cell { width: 80px; background-color: #fff; }
        .logo { width: 60px; }
        .title-main { font-size: 14px; text-transform: uppercase; }
        .bg-beige { background-color: #FDF5E6; }
        
        .content-wrapper {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
        }

        .main-table { 
            border-top: none; 
            width: 100%;
        }
        .main-table th {
            background-color: #FDF5E6;
            text-transform: uppercase;
            font-size: 10px;
            padding: 5px;
        }
        
        .col-item { width: 30px; text-align: center; }
        .col-hist { text-align: left; }
        .col-valor { width: 90px; text-align: right; }
        .col-conf { width: 60px; }

        .row-receita { background-color: #EBF1DE; }
        .row-despesa { background-color: #FDE9D9; }
        
        .bottom-section-wrapper {
            width: 100%;
            border: 1px solid #000;
            border-top: none; 
            margin-top: auto; 
        }

        .totals-table td {
            font-weight: bold;
            background-color: #F1F1F1;
            border-top: 2px solid #000;
            border-bottom: 1px solid #000;
        }

        .bottom-split {
            display: flex;
            width: 100%;
        }

        .bottom-left {
            width: 60%;
            border-right: 1px solid #000;
        }

        .bottom-right {
            width: 40%;
            display: flex;
            flex-direction: column;
        }

        .blocos-table { border: none; }
        .blocos-table th {
            background-color: #EBF1DE;
            font-size: 10px;
            font-weight: bold;
            text-align: center;
            border: 1px solid #000;
        }
        .blocos-table td {
            height: 16px;
            border: 1px solid #000;
        }
        .td-label { background-color: #EBF1DE; font-weight: bold; width: 70px; font-size: 10px; }
        .td-de-a { width: 25px; text-align: center; background-color: #F1F1F1; font-size: 10px; font-weight: bold; }

        .saldos-table { border: none; }
        .saldos-table th {
            background-color: #EBF1DE;
            font-size: 10px;
            font-weight: bold;
            text-align: center;
            border: 1px solid #000;
        }
        .saldos-table td {
            text-align: right;
            font-weight: bold;
            border: 1px solid #000;
        }

        .assinaturas-container {
            margin-top: 10px;
            padding: 5px 20px;
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
        }

        .assinatura-block { margin-bottom: 15px; }

        .assinatura-line {
            border-top: 1px solid #000;
            text-align: center;
            font-size: 9px;
            padding-top: 2px;
        }

        .x-mark {
            font-weight: bold; 
            font-size: 10px;
            margin-bottom: 2px;
        }

        .bg-green { background-color: #D8E4BC; }

        @media print {
            body { 
                background-color: white; 
                display: block; 
                padding: 0; 
                margin: 0; 
            }
            .container { 
                width: 100%;
                min-height: auto; 
                box-shadow: none; 
                border: 2px solid #000;
                margin: 0; 
                padding: 0;
            }
            
            .bg-beige { background-color: #FDF5E6 !important; -webkit-print-color-adjust: exact; }
            .bg-green { background-color: #D8E4BC !important; -webkit-print-color-adjust: exact; }
            .row-receita { background-color: #EBF1DE !important; -webkit-print-color-adjust: exact; }
            .row-despesa { background-color: #FDE9D9 !important; -webkit-print-color-adjust: exact; }
            .totals-table td { background-color: #F1F1F1 !important; -webkit-print-color-adjust: exact; }
            .blocos-table th, .td-label, .saldos-table th { background-color: #EBF1DE !important; -webkit-print-color-adjust: exact; }
        }
    </style>
</head>
<body>

<div class="container">
    
    <table class="header-table">
        <tr>
            <td rowspan="2" class="logo-cell">
                <img src="{{ asset('assets/img/logoasapac.png') }}" alt="Logo" class="logo">
            </td>
            <td colspan="4" class="title-main">
                ASSOCIAÇÃO DE AMPARO A PACIENTES COM CÂNCER<br>
                RELATÓRIO FINANCEIRO MENSAL DO CAIXA
            </td>
        </tr>
        <tr class="bg-beige">
            <td width="10%">FILIAL</td>
            <td width="40%">GOVERNADOR VALADARES-MG</td>
            <td width="15%">MÊS/ANO</td>
            <td width="35%">{{ $tituloMes }} / {{ $ano }}</td>
        </tr>
        <tr>
            <td colspan="5" class="bg-beige title-main" style="padding: 5px;">PRESTAÇÃO DE CONTAS MENSAL DO CAIXA</td>
        </tr>
    </table>

    <div class="content-wrapper">
        <table class="main-table">
            <thead>
                <tr>
                    <th class="col-item">ITEM</th>
                    <th class="col-hist">HISTÓRICO</th>
                    <th class="col-valor">ENTRADAS</th>
                    <th class="col-valor">SAÍDAS</th>
                    <th class="col-conf">CONFERÊNCIA</th>
                </tr>
            </thead>
            <tbody>
                @php $itemCount = 1; @endphp

                @foreach($receitas as $rec)
                <tr class="row-receita">
                    <td class="col-item">{{ $itemCount++ }}</td>
                    <td class="col-hist">{{ $rec['nome'] }}</td>
                    <td class="col-valor">{{ number_format($rec['total'], 2, ',', '.') }}</td>
                    <td class="col-valor">0,00</td>
                    <td class="col-conf"></td>
                </tr>
                @endforeach

                @if($totalAcertosRecebido > 0)
                <tr class="row-receita">
                    <td class="col-item">{{ $itemCount++ }}</td>
                    <td class="col-hist">ACERTOS DE MENSAGEIROS (RECEBIMENTOS)</td>
                    <td class="col-valor">{{ number_format($totalAcertosRecebido, 2, ',', '.') }}</td>
                    <td class="col-valor">0,00</td>
                    <td class="col-conf"></td>
                </tr>
                @endif

                @foreach($despesas as $desp)
                <tr class="row-despesa">
                    <td class="col-item">{{ $itemCount++ }}</td>
                    <td class="col-hist">{{ $desp['nome'] }}</td>
                    <td class="col-valor">0,00</td>
                    <td class="col-valor">{{ number_format($desp['total'], 2, ',', '.') }}</td>
                    <td class="col-conf"></td>
                </tr>
                @endforeach

                @if($totalAcertosPago > 0)
                <tr class="row-despesa">
                    <td class="col-item">{{ $itemCount++ }}</td>
                    <td class="col-hist">ACERTOS DE MENSAGEIROS (DESPESAS)</td>
                    <td class="col-valor">0,00</td>
                    <td class="col-valor">{{ number_format($totalAcertosPago, 2, ',', '.') }}</td>
                    <td class="col-conf"></td>
                </tr>
                @endif

                @for($i = 0; $i < (35 - $itemCount); $i++)
                <tr>
                    <td class="col-item">&nbsp;</td>
                    <td class="col-hist"></td>
                    <td class="col-valor"></td>
                    <td class="col-valor"></td>
                    <td class="col-conf"></td>
                </tr>
                @endfor
            </tbody>
        </table>
    </div>

    <div class="bottom-section-wrapper">
        
        <table class="totals-table">
            <tr>
                <td style="text-align: right; padding-right: 10px;">TOTAIS DO MÊS</td>
                <td width="90" style="text-align: right;">{{ number_format($totalEntradas, 2, ',', '.') }}</td>
                <td width="90" style="text-align: right;">{{ number_format($totalSaidas, 2, ',', '.') }}</td>
                <td width="60"></td>
            </tr>
        </table>

        <div class="bottom-split">
            
            <div class="bottom-left">
                <table class="blocos-table">
                    <tr>
                        <th colspan="4">NUMERAÇÃO DOS BLOCOS UTILIZADOS NESTE MÊS</th>
                    </tr>
                    <tr>
                        <td rowspan="2" class="td-label">RECIBOS</td>
                        <td class="td-de-a">DE</td>
                        <td></td>
                        <td class="td-de-a">A</td>
                    </tr>
                    <tr>
                        <td class="td-de-a">DE</td>
                        <td></td>
                        <td class="td-de-a">A</td>
                    </tr>
                    <tr>
                        <td rowspan="2" class="td-label">RIFAS</td>
                        <td class="td-de-a">DE</td>
                        <td></td>
                        <td class="td-de-a">A</td>
                    </tr>
                    <tr>
                        <td class="td-de-a">DE</td>
                        <td></td>
                        <td class="td-de-a">A</td>
                    </tr>
                </table>
            </div>

            <div class="bottom-right">
                <table class="saldos-table">
                    <tr>
                        <th colspan="2">0,00</th>
                        <th colspan="2">0,00</th>
                    </tr>
                    <tr>
                        <th colspan="3" style="text-align: right;">SALDO PERÍODO ANTERIOR</th>
                        <td style="background-color: #fff;">0,00</td>
                    </tr>
                    <tr>
                        <th colspan="3" style="text-align: right;">SALDO ATUAL (FINAL)</th>
                        <td style="background-color: #fff;">{{ number_format($saldoFinal, 2, ',', '.') }}</td>
                    </tr>
                </table>

                <div class="assinaturas-container">
                    
                    <div class="assinatura-block">
                        <div class="x-mark">X</div>
                        <div class="assinatura-line">Representante da Filial</div>
                    </div>
                    
                    <div class="assinatura-block">
                        <div class="x-mark">X</div>
                        <div class="assinatura-line">Representante da Matriz</div>
                    </div>

                </div>
            </div>

        </div>
    </div>

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