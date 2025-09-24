  Guia de Instalação e Execução

  ---
  📋 Sobre o Sistema

  O Sistema ASAPAC é uma aplicação web para gestão financeira de mensageiros, desenvolvida em React + TypeScript no frontend e Laravel no backend.

  ---
  💻 Pré-requisitos

  Software obrigatório:

  - Node.js (versão 16.0 ou superior) - https://nodejs.org/
  - PHP (versão 8.1 ou superior) - https://www.php.net/downloads
  - Composer - https://getcomposer.org/download/
  - MySQL ou XAMPP - https://www.apachefriends.org/

  Verificar se está instalado:

  node --version     # Deve mostrar v16.0.0 ou superior
  npm --version      # Deve mostrar 8.0.0 ou superior
  php --version      # Deve mostrar 8.1.0 ou superior
  composer --version # Deve mostrar versão do Composer

  ---
  📁 Estrutura do Projeto

  asapac/
  ├── frontend/          # Aplicação React
  ├── backend/           # API Laravel
  └── README.md         # Este arquivo

  ---
  🛠️ PASSO 1: Configurar o Backend (Laravel)

  1.1 Navegar para pasta do backend:

  cd backend

  1.2 Instalar dependências PHP:

  composer install

  1.3 Configurar arquivo de ambiente:

  # Copiar arquivo de exemplo
  cp .env.example .env

  # Gerar chave da aplicação
  php artisan key:generate

  1.4 Configurar banco de dados:

  Edite o arquivo .env e configure:
  DB_CONNECTION=mysql
  DB_HOST=127.0.0.1
  DB_PORT=3306
  DB_DATABASE=asapac
  DB_USERNAME=root
  DB_PASSWORD=

  1.5 Criar banco e executar migrações:

  # Criar banco (via MySQL ou phpMyAdmin)
  # CREATE DATABASE asapac;

  # Executar migrações
  php artisan migrate

  # Executar seeders (dados iniciais)
  php artisan db:seed

  1.6 Iniciar servidor Laravel:

  php artisan serve
  ✅ Backend rodando em: http://127.0.0.1:8000

  ---
  ⚛️ PASSO 2: Configurar o Frontend (React)

  2.1 Abrir novo terminal e navegar para frontend:

  cd frontend

  2.2 Instalar dependências Node.js:

  npm install

  2.3 Configurar arquivo de ambiente:

  Crie arquivo .env na pasta frontend:
  REACT_APP_API_URL=http://127.0.0.1:8000/api
  REACT_APP_NAME=Sistema ASAPAC

  2.4 Iniciar servidor React:

  npm start
  ✅ Frontend rodando em: http://localhost:3000

  ---
  🎯 PASSO 3: Acessar o Sistema

  1. Abra seu navegador
  2. Acesse: http://localhost:3000
  3. Use as credenciais padrão:
    - Email: admin@asapac.com
    - Senha: password

  ---
  🔧 Comandos Úteis

  Frontend (React):

  # Instalar dependências
  npm install

  # Rodar em desenvolvimento
  npm start

  # Compilar para produção
  npm run build

  # Executar testes
  npm test

  Backend (Laravel):

  # Instalar dependências
  composer install

  # Rodar servidor
  php artisan serve

  # Limpar cache
  php artisan cache:clear

  # Executar migrações
  php artisan migrate

  # Resetar banco
  php artisan migrate:fresh --seed

  ---
  🌐 URLs do Sistema

  - Frontend: http://localhost:3000
  - Backend API: http://127.0.0.1:8000/api
  - Laravel Admin: http://127.0.0.1:8000

  ---
  ❗ Troubleshooting

  Erro: "npm command not found"

  # Instale o Node.js de: https://nodejs.org/

  Erro: "Port 3000 already in use"

  # Use porta diferente
  npm start -- --port 3001

  Erro: "composer command not found"

  # Instale o Composer de: https://getcomposer.org/

  Erro de conexão com banco:

  # Verifique se MySQL está rodando
  # Verifique credenciais no arquivo .env
  # Certifique-se que o banco 'asapac' existe

  Erro de CORS:

  # Verifique se backend está rodando na porta 8000
  # Verifique arquivo .env do frontend

  Limpar cache completo:

  # Frontend
  rm -rf node_modules package-lock.json
  npm install

  # Backend
  composer dump-autoload
  php artisan cache:clear
  php artisan config:clear

  ---
  📱 Compatibilidade

  Navegadores suportados:

  - ✅ Google Chrome 90+
  - ✅ Mozilla Firefox 88+
  - ✅ Safari 14+
  - ✅ Microsoft Edge 90+
  - ❌ Internet Explorer (não suportado)

  Sistemas operacionais:

  - ✅ Windows 10/11
  - ✅ macOS 10.15+
  - ✅ Linux (Ubuntu 18+)

  ---
  📞 Suporte

  Logs de erro:

  # Frontend - Console do navegador (F12)
  # Backend - arquivo storage/logs/laravel.log

  Verificar se tudo está funcionando:

  1. ✅ Backend responde: http://127.0.0.1:8000/api
  2. ✅ Frontend carrega: http://localhost:3000
  3. ✅ Login funciona com credenciais padrão
  4. ✅ Dashboard carrega sem erros

  ---
  🚀 Execução Rápida (Resumo)

  # Terminal 1 - Backend
  cd backend
  composer install
  cp .env.example .env
  php artisan key:generate
  php artisan migrate --seed
  php artisan serve

  # Terminal 2 - Frontend  
  cd frontend
  npm install
  npm start

  # Acessar: http://localhost:3000
  # Login: admin@asapac.com / password

  ---
  📄 Funcionalidades Disponíveis

  - 🔐 Login/Logout seguro
  - 👥 Gestão de Mensageiros (CRUD)
  - 💰 Controle Financeiro (Receitas/Despesas)
  - 📊 Acertos de Mensageiros
  - 🏷️ Categorias de lançamentos
  - 📅 Gestão por Mês
  - 📄 Relatórios PDF automáticos

  ---
  🎉 Sistema pronto para uso!
