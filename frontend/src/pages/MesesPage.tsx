import React, { useState, useEffect, useRef } from 'react';
import './MesesPage.scss';
import { MesesService } from '../services/mesesService';
import refreshIcon from '../assets/refresh.png';
import filtroIcon from '../assets/filtro.png';
import { API_BASE_URL } from '../services/api';

interface Mes {
	id: number;
	nome: string;
	valor: number;
	status: 'positivo' | 'negativo';
}

interface FilterState {
	ordem: 'novo' | 'antigo';
	ano: string;
	status: '' | 'positivo' | 'negativo';
}

interface MesesPageProps {
	onLancamentosClick: (mes: { id: number; nome: string }) => void;
}

const MesesPage: React.FC<MesesPageProps> = ({ onLancamentosClick }) => {
	const [searchTerm, setSearchTerm] = useState('');
	const [meses, setMeses] = useState<Mes[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [newMonth, setNewMonth] = useState('');
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [filters, setFilters] = useState<FilterState>({
		ordem: 'novo',
		ano: '',
		status: ''
	});
	const filterRef = useRef<HTMLDivElement>(null);

	const fetchMeses = async () => {
		setIsLoading(true);
		try {
			const data = await MesesService.fetchMesesComSaldos(filters);
			setMeses(data);
			setError(null);
		} catch (err) {
			setError('Erro ao carregar os meses.');
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchMeses();
	}, [filters]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
				setIsFilterOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleCadastrarMes = async () => {
		if (!newMonth) return;
		try {
			await MesesService.cadastrarMes(newMonth);
			setNewMonth('');
			fetchMeses();
		} catch (err) {
			alert('Erro ao cadastrar mês.');
		}
	};

	const handleDownloadReport = (idMes: number) => {
		window.open(`${API_BASE_URL}/relatorio/${idMes}/emitir`, '_blank');
	};
	const handleDownloadReport2 = (idMes: number) => {
		window.open(`${API_BASE_URL}/relatorio/${idMes}/emitir2`, '_blank');
	};

	const removeFilter = (key: keyof FilterState) => {
		setFilters(prev => ({
			...prev,
			[key]: key === 'ordem' ? 'novo' : ''
		}));
	};

	const filteredMonths = meses.filter((month) =>
		month.nome.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<div className="meses-container">
			<div className="meses-controls-row">
				<h2 className="meses-header">Histórico dos Meses</h2>
				<div className="cadastro-mes-container">
					<input type="month" value={newMonth} onChange={(e) => setNewMonth(e.target.value)} />
					<button className="btn-cadastrar-mes" onClick={handleCadastrarMes}>Cadastrar Mês</button>
				</div>
			</div>

			<div className="meses-search-bar-row">
				<div className="search-bar-wrapper">
					<div className="active-filters">
						{filters.ano && (
							<span className="filter-chip">
								Ano: {filters.ano} <span className="chip-remove" onClick={() => removeFilter('ano')}>x</span>
							</span>
						)}
						{filters.status && (
							<span className="filter-chip">
								{filters.status === 'positivo' ? 'Positivos' : 'Negativos'} <span className="chip-remove" onClick={() => removeFilter('status')}>x</span>
							</span>
						)}
						{filters.ordem === 'antigo' && (
							<span className="filter-chip">
								Mais Antigos <span className="chip-remove" onClick={() => removeFilter('ordem')}>x</span>
							</span>
						)}
					</div>

					<input
						type="text"
						placeholder="Pesquisar mês..."
						className="search-input-nofix"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
					<div className="filter-container" ref={filterRef}>
						<button className="btn-filter-icon" onClick={() => setIsFilterOpen(!isFilterOpen)}>
							<img src={filtroIcon} alt="Filtrar" />
						</button>

						{isFilterOpen && (
							<div className="filter-dropdown-menu">
								<div className="filter-section">
									<h3>Ordenação</h3>
									<label>
										<input
											type="radio"
											name="ordem"
											checked={filters.ordem === 'novo'}
											onChange={() => setFilters({ ...filters, ordem: 'novo' })}
										/> Mais Novo (Padrão)
									</label>
									<label>
										<input
											type="radio"
											name="ordem"
											checked={filters.ordem === 'antigo'}
											onChange={() => setFilters({ ...filters, ordem: 'antigo' })}
										/> Mais Antigo
									</label>
								</div>

								<div className="filter-section">
									<h3>Filtrar por Ano</h3>
									<input
										type="number"
										placeholder="Ex: 2024"
										value={filters.ano}
										onChange={(e) => setFilters({ ...filters, ano: e.target.value })}
									/>
								</div>

								<div className="filter-section">
									<h3>Saldo</h3>
									<label>
										<input
											type="radio"
											name="status"
											checked={filters.status === ''}
											onChange={() => setFilters({ ...filters, status: '' })}
										/> Todos
									</label>
									<label>
										<input
											type="radio"
											name="status"
											checked={filters.status === 'positivo'}
											onChange={() => setFilters({ ...filters, status: 'positivo' })}
										/> Apenas Positivo
									</label>
									<label>
										<input
											type="radio"
											name="status"
											checked={filters.status === 'negativo'}
											onChange={() => setFilters({ ...filters, status: 'negativo' })}
										/> Apenas Negativo
									</label>
								</div>
							</div>
						)}
					</div>
				</div>

				<button className="meses-refresh-button" onClick={fetchMeses}>
					<img src={refreshIcon} alt="Atualizar" />
				</button>
			</div>

			<div className="meses-content">
				<div className="meses-table">
					{isLoading ? <p>Carregando...</p> : filteredMonths.map((month) => (
						<div key={month.id} className="meses-row">
							<span className="meses-row__name">{month.nome}</span>
							<div className="meses-row__right">
								<span className={`meses-row__value meses-row__value--${month.status}`}>
									{month.status === 'positivo' ? '▲' : '▼'} R$ {Math.abs(Number(month.valor || 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
								</span>
								<div className="meses-row-buttons">
									<button className="meses-row__button" onClick={() => onLancamentosClick({ id: month.id, nome: month.nome })}>Lançamentos</button>
									<button className="meses-row__button-relatorio" onClick={() => handleDownloadReport(month.id)}>Relatório 1</button>
									<button className="meses-row__button-relatorio-alt" onClick={() => handleDownloadReport2(month.id)}>Relatório 2</button>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default MesesPage;