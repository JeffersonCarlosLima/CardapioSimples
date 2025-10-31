// Estado da aplicação
let isUnloading = false;

// Listener para quando a página estiver sendo descarregada
window.addEventListener('beforeunload', () => {
    isUnloading = true;
});

// Exportando funções para o escopo global
window.obterCategorias = obterCategorias;
window.obterProdutos = obterProdutos;

// URL da API em produção
const API_URL = 'https://api-cardapio-taupe.vercel.app';

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

// Configuração padrão para fetch
const fetchConfig = {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Origin': window.location.origin
    },
    mode: 'cors'
};

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

// Função para obter categorias
async function obterCategorias() {
    try {
        // Não continuar se a página estiver sendo descarregada
        if (isUnloading) return [];
        
        const response = await fetch(`${API_URL}/categorias`, fetchConfig);
        const data = await handleApiResponse(response, 'Erro ao carregar categorias');
        return data;
    } catch (erro) {
        console.warn('Usando dados locais para categorias devido a erro:', erro);
        usandoFallback = true;
        notificarModoOffline();
        return dadosFallback.categorias;
    }
}

// Função para obter produtos de uma categoria específica
async function obterProdutos(categoria) {
    // Não continuar se a página estiver sendo descarregada
    if (isUnloading) return [];

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
        console.warn(`Usando dados locais para categoria ${categoria} devido a erro:`, erro);
        usandoFallback = true;
        notificarModoOffline();
        return dadosFallback.produtos[categoria] || [];
    }
}