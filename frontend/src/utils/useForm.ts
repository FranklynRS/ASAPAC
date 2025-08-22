import { useState, useCallback } from 'react';
import { FormField, ValidationRule } from '../types/form';
import { validateField } from './validation';

interface UseFormProps {
  initialValues: Record<string, string>;
  validationRules: Record<string, ValidationRule>;
  onSubmit: (values: Record<string, string>) => void | Promise<void>;
}

export const useForm = ({ initialValues, validationRules, onSubmit }: UseFormProps) => {
  const [formData, setFormData] = useState<Record<string, FormField>>(() => {
    const initialData: Record<string, FormField> = {};
    Object.keys(initialValues).forEach(key => {
      initialData[key] = {
        value: initialValues[key],
        error: null,
        touched: false,
      };
    });
    return initialData;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateSingleField = useCallback((name: string, value: string) => {
    if (validationRules[name]) {
      return validateField(value, validationRules[name]);
    }
    return null;
  }, [validationRules]);

  const updateField = useCallback((name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: {
        value,
        error: validateSingleField(name, value),
        touched: true,
      },
    }));
  }, [validateSingleField]);

  const touchField = useCallback((name: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        touched: true,
        error: validateSingleField(name, prev[name].value),
      },
    }));
  }, [validateSingleField]);

  const validateAllFields = useCallback(() => {
    const newFormData = { ...formData };
    let isValid = true;

    Object.keys(formData).forEach(name => {
      const error = validateSingleField(name, formData[name].value);
      newFormData[name] = {
        ...newFormData[name],
        error,
        touched: true,
      };
      if (error) isValid = false;
    });

    setFormData(newFormData);
    return isValid;
  }, [formData, validateSingleField]);

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateAllFields()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const values: Record<string, string> = {};
      Object.keys(formData).forEach(key => {
        values[key] = formData[key].value;
      });
      
      await onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateAllFields, onSubmit]);

  const resetForm = useCallback(() => {
    const resetData: Record<string, FormField> = {};
    Object.keys(initialValues).forEach(key => {
      resetData[key] = {
        value: initialValues[key],
        error: null,
        touched: false,
      };
    });
    setFormData(resetData);
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    formData,
    isSubmitting,
    updateField,
    touchField,
    handleSubmit,
    resetForm,
  };
};