const API_URL = window.location.hostname.includes('localhost')
  ? 'http://localhost:3000'
  : 'https://api-cardapio-taupe.vercel.app';

// Função para obter categorias do backend
async function obterCategorias() {
    try {
        const resp = await fetch(`${API_URL}/categorias`);
        if (!resp.ok) throw new Error('Erro ao carregar categorias');
        return await resp.json();
    } catch (erro) {
        console.error(erro);
        return [];
    }
}

// Função para obter produtos de uma categoria específica
async function obterProdutos(categoria) {
    try {
        const resp = await fetch(`${API_URL}/produtos/${categoria}`);
        if (!resp.ok) throw new Error('Erro ao carregar produtos');
        return await resp.json();
    } catch (erro) {
        console.error(erro);
        return [];
    }
}