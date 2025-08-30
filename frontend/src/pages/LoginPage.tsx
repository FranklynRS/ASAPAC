import React, { useState } from 'react';
import Container from '../components/layout/Container';
import LeftSection from '../components/layout/LeftSection';
import RightSection from '../components/layout/RightSection';
import Title from '../components/ui/Title';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Link from '../components/ui/Link';
import Logo from '../components/ui/Logo';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    try {
      await login({
        email_usuario: email,
        senha_usuario: password
      });
      
      console.log('Login realizado com sucesso!');
      // Aqui redirecionaria para dashboard (quando existir)
      alert('Login realizado com sucesso!');
      
    } catch (err: any) {
      // NUNCA reload - só mostra erro
      setError(err.message || 'Email ou senha incorretos');
      console.error('Erro de login:', err);
    }
  };

  return (
    <Container>
      <LeftSection>
        <Logo />
      </LeftSection>
      
      <RightSection>
        <Title variant="primary">Bem-vindo de volta!</Title>
        <Title variant="secondary">Faça login para continuar</Title>
        
        {error && (
          <div className="error-message" style={{color: 'red', marginBottom: '1rem'}}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
          
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            showPasswordToggle={true}
            onTogglePassword={() => setShowPassword(!showPassword)}
            disabled={isLoading}
          />
          
          <Button 
            type="submit" 
            variant="primary"
            loading={isLoading}
            disabled={isLoading || !email || !password}
          >
            Entrar
          </Button>
        </form>
        
        <Link>Esqueceu sua senha? Clique aqui!</Link>
      </RightSection>
    </Container>
  );
};

export default LoginPage;