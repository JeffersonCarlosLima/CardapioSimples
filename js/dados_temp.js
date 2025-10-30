// URL da API fixa
const API_URL = 'http://localhost:3000';

// Função para obter categorias
async function obterCategorias() {
    try {
        const resp = await fetch(`${API_URL}/categorias`);
        if (!resp.ok) throw new Error(`Erro ao carregar categorias: ${resp.status}`);
        return await resp.json();
    } catch (erro) {
        console.error('Erro ao carregar categorias:', erro);
        return [];
    }
}

// Função para obter produtos de uma categoria específica
async function obterProdutos(categoria) {
    if (!categoria) return [];
    
    try {
        const resp = await fetch(`${API_URL}/produtos/${categoria}`);
        if (!resp.ok) throw new Error(`Erro ao carregar produtos: ${resp.status}`);
        return await resp.json();
    } catch (erro) {
        console.error(`Erro ao carregar produtos da categoria ${categoria}:`, erro);
        return [];
    }
}