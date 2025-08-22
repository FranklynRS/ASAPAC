export interface FormErrors {
  [key: string]: string | null;
}

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
}

export interface FormField {
  value: string;
  error: string | null;
  touched: boolean;
}

export interface LoginFormData {
  email: FormField;
  password: FormField;
}