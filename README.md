## Requisitos para rodar a API

-   PHP >= 8.x
-   Composer
-   MySQL

## Passos para iniciar o projeto

1. Instale as dependências com o Composer:
   `composer install`

2. Copie o arquivo `.env.example` para `.env` e configure com os dados do banco de dados.

3. Gere a chave da aplicação com o comando:
   `php artisan key:generate`

4. Execute as migrations com o comando:
   `php artisan migrate`

5. Inicie o servidor local com o comando:
   `php artisan serve`

A API estará disponível em: `http://127.0.0.1:8000`
