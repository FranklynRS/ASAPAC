import React, { useState } from 'react';
import { Input, Button } from '../ui';
import { EyeIcon, EyeOffIcon } from '../ui/Icons';
import { useForm } from '../../utils/useForm';
import { emailValidation, passwordValidation } from '../../utils/validation';
import './LoginForm.scss';

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const { formData, isSubmitting, updateField, touchField, handleSubmit } = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validationRules: {
      email: emailValidation,
      password: passwordValidation,
    },
    onSubmit: async (values) => {
      setSubmitError(null);
      setSubmitSuccess(false);
      
      try {
        // Simular chamada de API
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simular possível erro de autenticação
        if (values.email === 'error@test.com') {
          throw new Error('Email ou senha incorretos');
        }
        
        console.log('Login realizado com sucesso:', values);
        setSubmitSuccess(true);
      } catch (error) {
        setSubmitError(error instanceof Error ? error.message : 'Erro ao fazer login');
      }
    },
  });

  const handleInputChange = (field: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateField(field, event.target.value);
    setSubmitError(null); // Limpar erro ao digitar
  };

  const handleInputBlur = (field: string) => () => {
    touchField(field);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h1 className="form-title">
          Bem-vindo de volta!
        </h1>
        
        <p className="form-subtitle">
          Faça login para continuar
        </p>
      </div>

      {/* Alertas de erro/sucesso */}
      {submitError && (
        <div className="alert alert-error">
          {submitError}
        </div>
      )}
      
      {submitSuccess && (
        <div className="alert alert-success">
          Login realizado com sucesso!
        </div>
      )}

      <div className="form-fields">
        <Input
          type="email"
          value={formData.email.value}
          onChange={handleInputChange('email')}
          onBlur={handleInputBlur('email')}
          placeholder="Digite seu email"
          error={formData.email.touched && !!formData.email.error}
          helperText={formData.email.touched ? formData.email.error || undefined : undefined}
          required
        />

        <Input
          type={showPassword ? 'text' : 'password'}
          value={formData.password.value}
          onChange={handleInputChange('password')}
          onBlur={handleInputBlur('password')}
          placeholder="Digite sua senha"
          icon={
            showPassword ? 
            <EyeOffIcon color="#94A3B8" onClick={togglePasswordVisibility} /> :
            <EyeIcon color="#94A3B8" onClick={togglePasswordVisibility} />
          }
          iconPosition="end"
          error={formData.password.touched && !!formData.password.error}
          helperText={formData.password.touched ? formData.password.error || undefined : undefined}
          required
        />

        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={isSubmitting}
        >
          Entrar
        </Button>
      </div>

      <div className="form-footer">
        <a 
          href="#" 
          className="forgot-password-link"
        >
          Esqueceu sua senha? Clique aqui!
        </a>
      </div>
    </form>
  );
};

export default LoginForm;