import { ValidationRule } from '../types/form';

export const validateField = (value: string, rules: ValidationRule): string | null => {
  // Required validation
  if (rules.required && !value.trim()) {
    return 'Este campo é obrigatório';
  }

  // Skip other validations if field is empty and not required
  if (!value.trim() && !rules.required) {
    return null;
  }

  // Min length validation
  if (rules.minLength && value.length < rules.minLength) {
    return `Mínimo de ${rules.minLength} caracteres`;
  }

  // Max length validation
  if (rules.maxLength && value.length > rules.maxLength) {
    return `Máximo de ${rules.maxLength} caracteres`;
  }

  // Pattern validation
  if (rules.pattern && !rules.pattern.test(value)) {
    return 'Formato inválido';
  }

  // Custom validation
  if (rules.custom) {
    return rules.custom(value);
  }

  return null;
};

export const emailValidation: ValidationRule = {
  required: true,
  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  custom: (value: string) => {
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Por favor, insira um email válido';
    }
    return null;
  }
};

export const passwordValidation: ValidationRule = {
  required: true,
  minLength: 6,
  custom: (value: string) => {
    if (value && value.length < 6) {
      return 'A senha deve ter pelo menos 6 caracteres';
    }
    if (value && !/(?=.*[a-zA-Z])/.test(value)) {
      return 'A senha deve conter pelo menos uma letra';
    }
    return null;
  }
};

export const validateForm = (formData: any, validationRules: Record<string, ValidationRule>) => {
  const errors: Record<string, string | null> = {};
  let isValid = true;

  Object.keys(validationRules).forEach(field => {
    const error = validateField(formData[field]?.value || '', validationRules[field]);
    errors[field] = error;
    if (error) isValid = false;
  });

  return { errors, isValid };
};