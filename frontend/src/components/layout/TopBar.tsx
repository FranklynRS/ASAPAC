import React, { useState, useEffect, useRef } from 'react';
import './TopBar.scss';
import { AuthService } from '../../services/auth';
import userDefaultIcon from '../../assets/usuario.png';
import ConfiguracoesUserModal from '../../pages/ConfiguracoesUserModal';

const TopBar: React.FC = () => {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setCurrentUser(AuthService.getUser());

        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowUserMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await AuthService.logout();
        window.location.reload();
    };

    const handleUserUpdateSuccess = () => {
        setCurrentUser(AuthService.getUser());
    };

    return (
        <>
            <div className="top-user-bar">
                <div className="user-info-container" ref={menuRef}>
                    <div 
                        className="user-trigger" 
                        onClick={() => setShowUserMenu(!showUserMenu)}
                    >
                        <span className="user-name">
                           {currentUser?.nome_usuario || 'Usuário'}
                        </span>
                        <img 
                            src={currentUser?.foto_usuario ? `http://127.0.0.1:8000/${currentUser.foto_usuario}` : userDefaultIcon} 
                            alt="User" 
                            className="user-avatar" 
                        />
                    </div>

                    {showUserMenu && (
                        <div className="user-dropdown">
                            <button onClick={() => { setIsConfigModalOpen(true); setShowUserMenu(false); }}>
                                Configurações
                            </button>
                            <button onClick={handleLogout} className="logout-option">
                                Sair
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <ConfiguracoesUserModal 
                isOpen={isConfigModalOpen} 
                onClose={() => setIsConfigModalOpen(false)} 
                onUserUpdated={handleUserUpdateSuccess}
            />
        </>
    );
};

export default TopBar;