// Exportando funções para o escopo global
window.obterCategorias = obterCategorias;
window.obterProdutos = obterProdutos;

// URL da API em produção
const API_URL = 'https://api-cardapio-taupe.vercel.app';

// Configuração padrão para fetch
const fetchConfig = {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    mode: 'cors'
};

// Função para tratamento de resposta da API
async function handleApiResponse(response, context) {
    if (!response.ok) {
        const error = new Error(`${context}: ${response.status} - ${response.statusText}`);
        error.status = response.status;
        throw error;
    }
    return await response.json();
}

// Função para obter categorias
async function obterCategorias() {
    try {
        const response = await fetch(`${API_URL}/categorias`, fetchConfig);
        const data = await handleApiResponse(response, 'Erro ao carregar categorias');
        return data;
    } catch (erro) {
        console.error('Falha ao obter categorias:', erro);
        if (erro.status === 404) {
            return [];
        }
        throw new Error(`Não foi possível carregar as categorias: ${erro.message}`);
    }
}

// Função para obter produtos de uma categoria específica
async function obterProdutos(categoria) {
    if (!categoria) {
        console.error('Categoria não especificada');
        return [];
    }

    try {
        const url = `${API_URL}/produtos/${encodeURIComponent(categoria)}`;
        const response = await fetch(url, fetchConfig);
        const data = await handleApiResponse(response, `Erro ao carregar produtos da categoria ${categoria}`);
        return data;
    } catch (erro) {
        console.error(`Falha ao obter produtos da categoria "${categoria}":`, erro);
        if (erro.status === 404) {
            return [];
        }
        throw new Error(`Não foi possível carregar os produtos: ${erro.message}`);
    }
}