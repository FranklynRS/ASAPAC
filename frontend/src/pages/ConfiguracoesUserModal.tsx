import React, { useState, useEffect } from 'react';
import './ConfiguracoesUserModal.scss';
import { AuthService } from '../services/auth';
import userPlaceholder from '../assets/usuario.png';
import { API_BASE_URL } from '../services/api';

interface ConfiguracoesUserModalProps {
	isOpen: boolean;
	onClose: () => void;
	onUserUpdated: () => void;
}

const ConfiguracoesUserModal: React.FC<ConfiguracoesUserModalProps> = ({ isOpen, onClose, onUserUpdated }) => {
	const [user, setUser] = useState<any>(null);
	const [nome, setNome] = useState('');
	const [email, setEmail] = useState('');
	const [foto, setFoto] = useState<File | null>(null);
	const [preview, setPreview] = useState<string>('');

	useEffect(() => {
		if (isOpen) {
			const currentUser = AuthService.getUser();
			if (currentUser) {
				setUser(currentUser);
				setNome(currentUser.nome_usuario);
				setEmail(currentUser.email_usuario);

				if (currentUser.foto_usuario) {
					setPreview(`http://127.0.0.1:8000/${currentUser.foto_usuario}`);
				} else {
					setPreview('');
				}
			}
		}
	}, [isOpen]);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			setFoto(file);
			setPreview(URL.createObjectURL(file));
		}
	};

	const handleSave = async () => {
		try {
			const formData = new FormData();
			formData.append('nome_usuario', nome);
			formData.append('email_usuario', email);

			if (foto) formData.append('foto', foto);

			formData.append('_method', 'PUT');

			const token = AuthService.getToken();

			const response = await fetch(`${API_BASE_URL}/usuarios/${user.id_usuario}`, {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${token}`
				},
				body: formData
			});

			if (response.ok) {
				const data = await response.json();

				AuthService.setUser(data.usuario);

				onUserUpdated();
				onClose();
				alert('Perfil atualizado com sucesso!');
			} else {
				const errorData = await response.json();
				console.error(errorData);
				alert('Erro ao atualizar perfil. Verifique os dados.');
			}
		} catch (error) {
			console.error(error);
			alert('Erro de conexão.');
		}
	};

	if (!isOpen) return null;

	return (
		<div className="modal-overlay">
			<div className="modal-content-config">
				<button className="modal-close-btn-config" onClick={onClose}>&times;</button>
				<h2>Configurações do Usuário</h2>

				<div className="form-group-photo">
					<img src={preview || userPlaceholder} alt="Preview" className="photo-preview" />
					<label htmlFor="foto-upload" className="btn-upload">Alterar Foto</label>
					<input id="foto-upload" type="file" onChange={handleFileChange} hidden accept="image/*" />
				</div>

				<div className="form-group">
					<label>Nome</label>
					<input type="text" value={nome} onChange={e => setNome(e.target.value)} />
				</div>
				<div className="form-group">
					<label>Email</label>
					<input type="email" value={email} onChange={e => setEmail(e.target.value)} />
				</div>
				<div className="modal-actions">
					<button onClick={onClose} className="btn-cancel">Cancelar</button>
					<button onClick={handleSave} className="btn-save">Salvar</button>
				</div>
			</div>
		</div>
	);
};

export default ConfiguracoesUserModal;