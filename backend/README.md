# Cardápio Simples Backend

Backend simples para gerenciamento de produtos de um cardápio, categorias e autenticação básica de usuários.

## Sumário
- [Introdução](#introdução)
- [Instalação](#instalação)
- [Usuário e senha padrão](#usuário-e-senha-padrão)
- [Rodando o servidor](#rodando-o-servidor)
- [Formato dos arquivos](#formato-dos-arquivos)
  - [users.json](#usersjson)
  - [data.json](#datajson)
- [Rotas da API](#rotas-da-api)
  - [POST /login](#post-login)
  - [POST /register](#post-register)
  - [GET /categorias](#get-categorias)
  - [GET /produtos/:categoria](#get-produtoscategoria)
  - [POST /produtos/:categoria](#post-produtoscategoria)
- [Autorização HTTP Basic](#autorização-http-basic)
- [Como alterar usuário padrão](#como-alterar-usuário-padrão)
- [Próximos passos e sugestões](#próximos-passos-e-sugestões)

---

## Introdução

Este projeto consiste em uma API RESTful backend feita com Node.js + Express. Ela permite:
- Listar e criar usuários (autenticação básica)
- Listar categorias e produtos do cardápio
- Adicionar produtos em categorias

## Instalação
Com Node.js instalado, execute na raiz do projeto:
```bash
npm install
```

## Usuário e senha padrão
Usuário inicial cadastrado em `users.json`:
- **username:** `admin`
- **password:** `senha12345`

Troque assim que possível para maior segurança!

## Rodando o servidor
Execute:
```bash
npm start
```
A API estará disponível em: http://localhost:3000

## Formato dos arquivos

### users.json
Armazena os usuários cadastrados (usuário/senha). Exemplo:
```json
[
  { "username": "admin", "password": "senha12345" }
]
```

### data.json
Estrutura de cardápio. As chaves do objeto são categorias:
```json
{
  "churrasco": [ { /* produto */ } ],
  "burgers": [ { /* produto */ } ],
  // ...
}
```
Produto:
```json
{
  "id": "picanha",
  "name": "Picanha",
  "dsc": "Carne nobre",
  "price": 100,
  "img": "./img/picanha.jpg"
}
```

## Rotas da API

### POST /login
- Autentica um usuário
- Body: `{ "username": "...", "password": "..." }`
- Retorna sucesso se usuário/senha válidos.

### POST /register
- Registra novo usuário
- Body: `{ "username": "...", "password": "..." }`

### Todas as rotas abaixo exigem header Authorization (Basic):
```
Authorization: Basic <base64_de_usuario:senha>
```

### GET /categorias
- Retorna todas as categorias disponíveis.

### GET /produtos/:categoria
- Retorna todos os produtos da categoria informada.
- Exemplo: `/produtos/burgers`

### POST /produtos/:categoria
- Adiciona um novo produto na categoria.
- Body: `{ "id": "produto-id", "name": "Produto", "dsc": "desc...", "price": 123, "img": "..." }`

## Autorização HTTP Basic
Após autenticar via `/login`, para acessar as rotas protegidas (categorias, produtos), é obrigatório enviar o cabeçalho HTTP:
```
Authorization: Basic <base64(username:senha)>
```
Exemplo em javascript:
```js
fetch('/categorias', {
  headers: { 'Authorization': 'Basic ' + btoa('admin:senha12345') }
})
```

## Como alterar usuário padrão
Abra o arquivo `users.json` e troque os valores:
```json
[
  { "username": "novouser", "password": "novasenha" }
]
```

## Próximos passos e sugestões
- Utilizar hash de senha para produção
- Adicionar refresh tokens ou JWT para autenticação mais segura
- Proteger endpoints críticos por perfil/role
- Implementar testes automatizados e logs de acessos
- Validar entrada de dados e tratar arquivos corrompidos

---

## Comentários (autoexplicativo no código)
O arquivo `api.js` está totalmente comentado. Cada função, rota e middleware possui explicação do que faz e como funciona, facilitando novas implementações e manutenções.
