# ASAPAC Login - Sistema de Autenticação

Sistema de login desenvolvido em React com TypeScript, Material UI e SCSS.

## 🚀 Tecnologias Utilizadas

- **React 18** - Biblioteca principal
- **TypeScript** - Tipagem estática
- **Material UI 5** - Componentes e tema
- **SCSS** - Estilos avançados
- **Webpack 5** - Build e desenvolvimento
- **Custom Hooks** - Gerenciamento de formulários

## 📋 Funcionalidades

- ✅ **Interface responsiva** - Funciona em mobile, tablet e desktop
- ✅ **Validação em tempo real** - Email e senha validados
- ✅ **Componentes reutilizáveis** - Input e Button customizados
- ✅ **Estados de loading** - Feedback visual durante envio
- ✅ **Mensagens de erro/sucesso** - Alerts informativos
- ✅ **Tema personalizado** - Cores da identidade ASAPAC
- ✅ **TypeScript completo** - Tipagem em todo o projeto

## 🎨 Design

O layout segue fielmente o design fornecido:
- **Lado esquerdo**: Logo ASAPAC com gradient azul
- **Lado direito**: Formulário de login limpo e moderno
- **Responsivo**: Adapta-se perfeitamente a qualquer tela

## 🚀 Como executar

### Desenvolvimento
```bash
npm run dev
```
Abre em: http://localhost:3000

### Build para produção
```bash
npm run build
```

### Verificação de tipos
```bash
npm run type-check
```

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── ui/              # Componentes reutilizáveis
│   │   ├── Input.tsx
│   │   ├── Button.tsx
│   │   └── index.ts
│   └── forms/           # Formulários específicos
│       └── LoginForm.tsx
├── pages/               # Páginas da aplicação
│   └── LoginPage.tsx
├── styles/              # Estilos globais e tema
│   ├── theme.ts
│   ├── variables.scss
│   └── global.scss
├── utils/               # Utilitários e hooks
│   ├── validation.ts
│   └── useForm.ts
├── types/               # Definições TypeScript
│   ├── form.ts
│   └── assets.d.ts
└── assets/              # Imagens e recursos
    ├── login.png
    └── logoasapac.png
```

## 🧪 Testando Validações

### Email válido:
- Digite qualquer email no formato: `usuario@dominio.com`

### Testando erro de login:
- Use o email: `error@test.com` para simular erro de autenticação

### Validações implementadas:
- **Email**: Formato válido obrigatório
- **Senha**: Mínimo 6 caracteres com pelo menos uma letra
- **Campos obrigatórios**: Validação em tempo real
- **Feedback visual**: Bordas vermelhas e mensagens de erro

## 📱 Responsividade

- **Mobile (< 768px)**: Layout vertical com logo no topo
- **Tablet (768px - 1024px)**: Layout adaptado
- **Desktop (> 1024px)**: Layout lado a lado original

## 🎯 Próximos Passos Sugeridos

1. **Integração com API real** - Substituir simulação
2. **Autenticação JWT** - Implementar tokens
3. **Recuperação de senha** - Tela e fluxo completo
4. **Testes unitários** - Jest + Testing Library
5. **Acessibilidade** - ARIA labels e navegação por teclado
6. **PWA** - Transformar em Progressive Web App

## 👨‍💻 Desenvolvido para aprendizado

Este projeto foi criado como exemplo educacional, demonstrando:
- Arquitetura React moderna e escalável
- Padrões de desenvolvimento TypeScript
- Componentes reutilizáveis e bem organizados
- Validação robusta de formulários
- Design responsivo e acessível