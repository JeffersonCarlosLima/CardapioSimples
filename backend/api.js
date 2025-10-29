const express = require('express');
const fs = require('fs/promises');
const path = require('path');

const app = express();
const PORT = 3000;

const DATA_PATH = path.join(__dirname, 'data.json');
const USERS_PATH = path.join(__dirname, 'users.json');

app.use(express.json());

// Usuário/senha fixos para autenticar operações de login/registro
const MASTER_USER = 'apimaster'; // Altere conforme desejar
const MASTER_PASS = 'supersegredo'; // Altere conforme desejar

/**
 * Middleware de autenticação para /login e /register
 * Usa HTTP Basic Auth com usuário/senha fixos
 */
function authMiddleware(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Basic ')) {
        return res.status(401).json({ error: 'Authorization header ausente ou inválido.' });
    }
    const base64 = auth.split(' ')[1];
    const credentials = Buffer.from(base64, 'base64').toString().split(':');
    const [username, password] = credentials;
    if (username !== MASTER_USER || password !== MASTER_PASS) {
        return res.status(401).json({ error: 'Credenciais administrativas inválidas.' });
    }
    next();
}

/**
 * Função para ler dados do cardápio
 */
async function readData() {
    try {
        const content = await fs.readFile(DATA_PATH, 'utf-8');
        return JSON.parse(content);
    } catch (err) {
        if (err.code === 'ENOENT') {
            await fs.writeFile(DATA_PATH, '{}', 'utf-8');
            return {};
        }
        throw err;
    }
}

/**
 * Função para gravar dados no cardápio
 */
async function writeData(data) {
    await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

/**
 * Função para ler usuários cadastrados
 */
async function readUsers() {
    try {
        const content = await fs.readFile(USERS_PATH, 'utf-8');
        return JSON.parse(content);
    } catch (err) {
        if (err.code === 'ENOENT') {
            await fs.writeFile(USERS_PATH, '[]', 'utf-8');
            return [];
        }
        throw err;
    }
}

/**
 * Função para gravar/atualizar lista de usuários
 */
async function writeUsers(users) {
    await fs.writeFile(USERS_PATH, JSON.stringify(users, null, 2), 'utf-8');
}

/**
 * Todas as rotas do sistema (exceto login/register) NÃO exigem autenticação administrativa.
 * Apenas /login e /register exigem autenticação básica (usuário MASTER).
 */

/**
 * GET /produtos/:categoria
 * Lista todos os produtos de uma categoria
 */
app.get('/produtos/:categoria', async (req, res) => {
    try {
        const categoria = req.params.categoria;
        const data = await readData();
        if (!data[categoria]) {
            return res.status(404).json({ error: `Categoria '${categoria}' não encontrada.` });
        }
        res.json(data[categoria]);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao ler produtos.' });
    }
});

/**
 * POST /produtos/:categoria
 * Adiciona produto a uma categoria
 */
app.post('/produtos/:categoria', async (req, res) => {
    try {
        const categoria = req.params.categoria;
        const novoProduto = req.body;
        if (!novoProduto.id || !novoProduto.name || !novoProduto.dsc || !novoProduto.price || !novoProduto.img) {
            return res.status(400).json({ error: 'Campos obrigatórios: id, name, dsc, price, img.' });
        }
        const data = await readData();
        if (!data[categoria]) {
            data[categoria] = [];
        }
        data[categoria].push(novoProduto);
        await writeData(data);
        res.status(201).json(novoProduto);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao adicionar produto.' });
    }
});

/**
 * GET /categorias
 * Retorna todas as categorias cadastradas
 */
app.get('/categorias', async (req, res) => {
    try {
        const data = await readData();
        const categorias = Object.keys(data);
        res.json(categorias);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao listar categorias.' });
    }
});

/**
 * POST /register
 * Cria novo usuário - apenas se autenticado por HTTP Basic
 */
app.post('/register', authMiddleware, async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Usuário e senha são obrigatórios.' });
        }
        let users = await readUsers();
        if (users.find(u => u.username === username)) {
            return res.status(409).json({ error: 'Usuário já existe.' });
        }
        users.push({ username, password });
        await writeUsers(users);
        res.status(201).json({ message: 'Usuário registrado com sucesso.' });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao registrar usuário.' });
    }
});

/**
 * POST /login
 * Login de usuário - apenas se autenticado por HTTP Basic
 */
app.post('/login', authMiddleware, async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Usuário e senha são obrigatórios.' });
        }
        const users = await readUsers();
        const user = users.find(u => u.username === username && u.password === password);
        if (!user) {
            return res.status(401).json({ error: 'Usuário ou senha inválidos.' });
        }
        res.json({ message: 'Login realizado com sucesso.' });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao fazer login.' });
    }
});

// Inicializa a API
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
