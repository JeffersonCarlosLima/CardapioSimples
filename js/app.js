// Configurações do cardápio
const cardapioConfig = {
    animationDuration: 600,
    loadingDelay: 300,
    icons: {
        'burgers': 'hamburger',
        'pizzas': 'pizza-slice',
        'churrasco': 'drumstick-bite',
        'steaks': 'bacon',
        'bebidas': 'cocktail',
        'sobremesas': 'ice-cream'
    }
};

// Templates do cardápio
const templates = {
    menuItem: (categoria, isActive = false) => `
        <a id="menu-${categoria}" 
           class="btn btn-white btn-sm mr-3 ${isActive ? 'active' : ''}"
           data-categoria="${categoria}">
            <i class="fas fa-${cardapioConfig.icons[categoria] || 'utensils'}"></i>
            ${capitalize(categoria)}
        </a>
    `,
    
    produtoCard: (produto) => `
        <div class="card-item" id="${produto.id}">
            <div class="img-produto">
                <img src="${produto.img}" alt="${produto.name}" loading="lazy"/>
            </div>
            <div class="dados-produto">
                <h3 class="title-produto">${produto.name}</h3>
                <p class="description">${produto.dsc}</p>
                <p class="price-produto">R$ ${produto.price.toFixed(2).replace('.', ',')}</p>
            </div>
        </div>
    `,

    loading: () => `
        <div class="text-center py-5">
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Carregando...</span>
            </div>
        </div>
    `,

    error: (message) => `
        <div class="alert alert-danger text-center" role="alert">
            <i class="fas fa-exclamation-triangle me-2"></i>
            ${message}
        </div>
    `
};

// Funções utilitárias
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const setState = (state) => {
    const categoriaAtual = state.categoriaAtual;
    history.pushState(state, '', `#${categoriaAtual}`);
    document.querySelectorAll('.container-menu a').forEach(a => 
        a.classList.toggle('active', a.dataset.categoria === categoriaAtual)
    );
};

// Funções principais
async function inicializarCardapio() {
    const containerMenu = document.querySelector('.container-menu');
    const itensCardapio = document.querySelector('#itensCardapio');
    let categoriaInicial = window.location.hash.slice(1) || null;

    try {
        // Carregar categorias
        containerMenu.innerHTML = templates.loading();
        const categorias = await obterCategorias();
        
        if (!categorias.length) {
            throw new Error('Nenhuma categoria disponível');
        }

        // Se não houver categoria na URL ou ela não existir, usar a primeira
        if (!categoriaInicial || !categorias.includes(categoriaInicial)) {
            categoriaInicial = categorias[0];
        }

        // Renderizar menu de categorias
        containerMenu.innerHTML = categorias
            .map(cat => templates.menuItem(cat, cat === categoriaInicial))
            .join('');

        // Configurar eventos
        containerMenu.addEventListener('click', async (e) => {
            const button = e.target.closest('[data-categoria]');
            if (!button) return;

            e.preventDefault();
            const categoria = button.dataset.categoria;
            setState({ categoriaAtual: categoria });
            await carregarProdutos(categoria);
        });

        // Carregar produtos da categoria inicial
        await carregarProdutos(categoriaInicial);

    } catch (erro) {
        console.error('Erro na inicialização:', erro);
        containerMenu.innerHTML = templates.error('Erro ao carregar o cardápio');
    }
}

async function carregarProdutos(categoria) {
    const itensCardapio = document.querySelector('#itensCardapio');
    
    try {
        itensCardapio.innerHTML = templates.loading();
        
        const produtos = await obterProdutos(categoria);
        
        if (!produtos.length) {
            itensCardapio.innerHTML = templates.error('Nenhum produto encontrado nesta categoria');
            return;
        }

        // Fade out
        itensCardapio.style.opacity = '0';
        
        // Atualizar conteúdo
        setTimeout(() => {
            itensCardapio.innerHTML = `
                <div class="cardapio-container">
                    ${produtos.map(produto => templates.produtoCard(produto)).join('')}
                </div>
            `;
            
            // Fade in
            itensCardapio.style.opacity = '1';
        }, cardapioConfig.loadingDelay);

    } catch (erro) {
        console.error('Erro ao carregar produtos:', erro);
        itensCardapio.innerHTML = templates.error('Erro ao carregar produtos. Por favor, tente novamente.');
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', inicializarCardapio);

// Manipulação do histórico
window.addEventListener('popstate', (event) => {
    if (event.state && event.state.categoriaAtual) {
        carregarProdutos(event.state.categoriaAtual);
    }
});