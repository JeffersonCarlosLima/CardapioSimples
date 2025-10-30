// Exportando funções para o escopo global
window.obterCategorias = obterCategorias;
window.obterProdutos = obterProdutos;

// Configuração do ambiente
const isLocal = window.location.hostname === 'localhost' || 
                window.location.hostname === '127.0.0.1' ||
                window.location.protocol === 'file:';

// URLs da API
const API_URLS = {
    development: 'http://localhost:3000', // URL da API local
    production: 'https://api-cardapio-taupe.vercel.app'
};

// URL atual baseada no ambiente
const API_URL = isLocal ? API_URLS.development : API_URLS.production;

// Log customizado para debug
const debug = {
    log: (message, data) => {
        if (isLocal) {
            console.log(`[DEBUG] ${message}`, data || '');
        }
    },
    error: (message, error) => {
        console.error(`[ERROR] ${message}`, error);
    }
};

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
    debug.log('Obtendo categorias da API:', API_URL);
    
    try {
        const response = await fetch(`${API_URL}/categorias`, fetchConfig);
        const data = await handleApiResponse(response, 'Erro ao carregar categorias');
        
        debug.log('Categorias obtidas com sucesso:', data);
        return data;
    } catch (erro) {
        debug.error('Falha ao obter categorias', erro);
        if (erro.status === 404) {
            return [];
        }
        throw new Error(`Não foi possível carregar as categorias: ${erro.message}`);
    }
}

// Função para obter produtos de uma categoria específica
async function obterProdutos(categoria) {
    if (!categoria) {
        debug.error('Categoria não especificada');
        return [];
    }

    debug.log(`Obtendo produtos da categoria "${categoria}"`, API_URL);

    // Removido o mock para usar a API real em desenvolvimento
    
    try {
        const url = `${API_URL}/produtos/${encodeURIComponent(categoria)}`;
        const response = await fetch(url, fetchConfig);
        const data = await handleApiResponse(response, `Erro ao carregar produtos da categoria ${categoria}`);
        
        debug.log(`Produtos da categoria "${categoria}" obtidos com sucesso:`, data);
        return data;
    } catch (erro) {
        debug.error(`Falha ao obter produtos da categoria "${categoria}"`, erro);
        if (erro.status === 404) {
            return [];
        }
        throw new Error(`Não foi possível carregar os produtos: ${erro.message}`);
    }
}

// Exportar informações de ambiente para debug
// Dados mockados para desenvolvimento local
function mockProdutos(categoria) {
    const produtos = {
        pizzas: [
            {
                id: 1,
                name: "Pizza Margherita",
                dsc: "Molho de tomate, mussarela, manjericão fresco",
                price: 45.90,
                img: "./img/cardapio/pizzas/margherita.jpg"
            },
            {
                id: 2,
                name: "Pizza Pepperoni",
                dsc: "Molho de tomate, mussarela, pepperoni",
                price: 49.90,
                img: "./img/cardapio/pizzas/pepperoni.jpg"
            }
        ],
        burgers: [
            {
                id: 3,
                name: "Classic Burger",
                dsc: "Hambúrguer artesanal, queijo cheddar, alface, tomate",
                price: 32.90,
                img: "./img/cardapio/burguers/classic.jpg"
            },
            {
                id: 4,
                name: "Cheese Burger",
                dsc: "Hambúrguer artesanal, queijo duplo, cebola caramelizada",
                price: 36.90,
                img: "./img/cardapio/burguers/cheese.jpg"
            }
        ],
        bebidas: [
            {
                id: 5,
                name: "Refrigerante",
                dsc: "Lata 350ml",
                price: 6.90,
                img: "./img/cardapio/bebidas/refri.jpg"
            },
            {
                id: 6,
                name: "Suco Natural",
                dsc: "500ml",
                price: 9.90,
                img: "./img/cardapio/bebidas/suco.jpg"
            }
        ]
    };

    return Promise.resolve(produtos[categoria] || []);
}

// Debug info
if (isLocal) {
    window.debugInfo = {
        environment: isLocal ? 'development' : 'production',
        apiUrl: API_URL,
        isLocal
    };
    debug.log('Ambiente atual:', window.debugInfo);
}