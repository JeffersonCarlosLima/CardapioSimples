// Controle de requisições
let currentController = null;

// Função para obter um novo AbortController
function getController() {
    if (currentController) {
        currentController.abort(); // Cancela requisição anterior se existir
    }
    currentController = new AbortController();
    return currentController;
}

// Limpar recursos quando a página for fechada
window.addEventListener('pagehide', () => {
    if (currentController) {
        currentController.abort();
    }
}, { capture: true });

// Exportando funções para o escopo global
window.obterCategorias = obterCategorias;
// 🚀 ATUALIZADO: Exportando a nova função
window.obterCardapioCompleto = obterCardapioCompleto;

// URL da API em produção
const API_URL = 'http://localhost:3000';
//const API_URL = 'https://api-cardapio-taupe.vercel.app';

// Função para mostrar mensagem de erro para o usuário
function mostrarErro(mensagem) {
    const notificacao = document.createElement('div');
    notificacao.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #f8d7da;
        color: #721c24;
        padding: 12px 24px;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        z-index: 1000;
        font-size: 14px;
        text-align: center;
    `;
    notificacao.innerHTML = mensagem;
    document.body.appendChild(notificacao);
    
    setTimeout(() => {
        notificacao.style.opacity = '0';
        notificacao.style.transition = 'opacity 0.5s ease';
        setTimeout(() => notificacao.remove(), 500);
    }, 5000);
}

// Função para obter configuração do fetch
// Retorna configuração de fetch. Evita enviar 'Content-Type: application/json' em GET
// para não disparar preflight desnecessário. Para requisições com body, passe method != 'GET'.
function getFetchConfig(method = 'GET') {
    const headers = {
        'Accept': 'application/json'
    };

    if (method && method.toUpperCase() !== 'GET') {
        headers['Content-Type'] = 'application/json';
    }

    return {
        headers,
        mode: 'cors',
        method: method,
        signal: getController().signal
    };
}

// Função para tratamento de resposta da API
async function handleApiResponse(response, context) {
    if (!response.ok) {
        // Tratamento específico para erros comuns
        switch (response.status) {
            case 404:
                throw new Error('Conteúdo não encontrado. Por favor, tente novamente mais tarde.');
            case 403:
                throw new Error('Acesso não autorizado. Entre em contato com o suporte.');
            case 500:
                throw new Error('Erro interno do servidor. Tente novamente mais tarde.');
            case 0:
                throw new Error('Erro de conexão. Verifique sua internet ou se o servidor está disponível.');
            default:
                throw new Error(`${context}: ${response.status} - ${response.statusText}`);
        }
    }
    return await response.json();
}

// ⚠️ NOTA: Esta função agora é REDUNDANTE.
// Você pode obtê-las com Object.keys() do resultado da função obterCardapioCompleto().
// Função para obter categorias
async function obterCategorias() {
    try {
        const response = await fetch(`${API_URL}/categorias`, getFetchConfig());
        const data = await handleApiResponse(response, 'Erro ao carregar categorias');
        return data;
    } catch (erro) {
        console.warn('Erro ao buscar categorias:', erro);
        mostrarErro('Não foi possível carregar as categorias. Verifique sua conexão ou tente novamente mais tarde.');
        // Retornar lista vazia quando a API não estiver disponível
        return [];
    }
}

// ===============================================
// === 🚀 FUNÇÃO ALTERADA/SUBSTITUÍDA 🚀 ===
// ===============================================
// Função para obter o cardápio COMPLETO (todas categorias e produtos)
async function obterCardapioCompleto() {
    try {
        // Chama a nova rota /produtos
        const url = `${API_URL}/produtos`;
        const response = await fetch(url, getFetchConfig());
        const data = await handleApiResponse(response, `Erro ao carregar o cardápio completo`);
        
        // Retorna o objeto inteiro, ex: { Lanches: [...], Bebidas: [...] }
        return data;
    
    } catch (erro) {
        console.warn(`Erro ao buscar o cardápio completo:`, erro);
        mostrarErro('Não foi possível carregar o cardápio. Verifique sua conexão ou tente novamente mais tarde.');
        // Retornar objeto vazio quando a API não estiver disponível
        return {};
    }
}