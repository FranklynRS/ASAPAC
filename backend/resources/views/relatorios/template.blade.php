<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Relatório Mensal ASAPAC</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 10px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            border: 1px solid #000;
            padding: 4px;
            text-align: left;
        }
        th {
            background-color: #d9d9d9;
            text-align: center;
            font-weight: bold;
        }
        .header-section {
            display: table;
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }
        .header-section > div {
            display: table-cell;
            vertical-align: middle;
            text-align: center;
        }
        .logo {
            max-width: 80px;
        }
        .text-center {
            text-align: center;
        }
        .text-right {
            text-align: right;
        }
        .cabecalho-principal {
            font-weight: bold;
            font-size: 14px;
        }
        .cabecalho-subtitulo {
            font-size: 12px;
        }
        .dados-filial-mes {
            text-align: center;
            margin-bottom: 20px;
        }
        .secao-titulo {
            background-color: #f2f2f2;
            text-align: center;
            font-weight: bold;
        }
        .subtitulo-categoria {
            font-weight: bold;
            text-align: center;
        }
    </style>
</head>
<body>

<div class="header-section">
    <div style="width: 25%;">
        <img class="logo" src="{{ public_path('assets/asapaclogo.png') }}" alt="Logo Asapac">
    </div>
    <div style="width: 50%;">
        <div class="cabecalho-principal">ASAPAC</div>
        <div class="cabecalho-subtitulo">Relatório Financeiro Mensal do Caixa</div>
    </div>
    <div style="width: 25%; text-align: right; font-size: 10px;">
        <p>Filial: GOVERNADOR VALADARES-MG</p>
        <p>Mês/Ano: {{ date('F/Y', strtotime($mes->ano_mes)) }}</p>
    </div>
</div>

<table>
    <thead>
        <tr>
            <th style="width: 5%;">ITEM</th>
            <th style="width: 45%;">PRESTAÇÃO DE CONTAS MENSAL DO CAIXA</th>
            <th style="width: 25%;">ENTRADAS</th>
            <th style="width: 25%;">SAÍDAS</th>
        </tr>
    </thead>
    <tbody>
        @php
            $itemNumber = 1;
            $totalEntradas = 0;
            $totalSaidas = 0;
        @endphp
        @foreach($categoriasReport as $catNome => $valores)
            <tr>
                <td class="text-center">{{ $itemNumber++ }}</td>
                <td>{{ $catNome }}</td>
                <td class="text-right">
                    @if ($valores['entrada'] > 0)
                        {{ number_format($valores['entrada'], 2, ',', '.') }}
                        @php $totalEntradas += $valores['entrada']; @endphp
                    @else
                        0,00
                    @endif
                </td>
                <td class="text-right">
                    @if ($valores['saida'] > 0)
                        {{ number_format(abs($valores['saida']), 2, ',', '.') }}
                        @php $totalSaidas += abs($valores['saida']); @endphp
                    @else
                        0,00
                    @endif
                </td>
            </tr>
        @endforeach
        <tr>
            <td colspan="2" class="text-center">TOTAL GERAL</td>
            <td class="text-right">{{ number_format($totalEntradas, 2, ',', '.') }}</td>
            <td class="text-right">{{ number_format($totalSaidas, 2, ',', '.') }}</td>
        </tr>
        <tr>
            <td colspan="2" class="text-center">SALDO FINAL</td>
            <td class="text-right" colspan="2">{{ number_format($totalEntradas - $totalSaidas, 2, ',', '.') }}</td>
        </tr>
    </tbody>
</table>

</body>
</html>