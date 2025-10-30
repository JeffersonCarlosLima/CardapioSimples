// Inicialização do cardápio
document.addEventListener('DOMContentLoaded', async () => {
    await inicializarCardapio();
});

// Templates do cardápio
const templates = {
    loading: `
        <div class="text-center my-4">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Carregando...</span>
            </div>
        </div>
    `,
    erro: (mensagem) => `
        <div class="alert alert-danger text-center" role="alert">
            ${mensagem}
        </div>
    `,
    item: `
        <div class="card-item" id="\${id}">
            <div class="img-produto">
                <img src="\${img}" alt="\${name}" loading="lazy"/>
            </div>
            <div class="dados-produto">
                <p class="title-produto">
                    <b>\${name}</b>
                </p>
                <p class="description">\${description}</p>
                <p class="price-produto">
                    <b>R$ \${price}</b>
                </p>
            </div>
        </div>
    `
};

// Função principal de inicialização
async function inicializarCardapio() {
    const containerMenu = document.querySelector('.container-menu');
    const itensCardapio = document.getElementById('itensCardapio');

    try {
        // Mostrar loading
        itensCardapio.innerHTML = templates.loading;

        // Carregar categorias
        const categorias = await obterCategorias();
        if (!categorias.length) {
            throw new Error('Nenhuma categoria disponível');
        }

        // Carregar produtos da primeira categoria
        await carregarProdutos(categorias[0]);

    } catch (erro) {
        console.error('Erro ao inicializar cardápio:', erro);
        itensCardapio.innerHTML = templates.erro('Erro ao carregar o cardápio. Por favor, tente novamente.');
    }
}

// Função para carregar produtos
async function carregarProdutos(categoria) {
    const itensCardapio = document.getElementById('itensCardapio');
    
    try {
        // Mostrar loading
        itensCardapio.innerHTML = templates.loading;

        // Atualizar botão ativo
        document.querySelectorAll('.container-menu a').forEach(a => {
            a.classList.remove('active');
        });
        document.getElementById(`menu-${categoria}`).classList.add('active');

        // Carregar produtos
        const produtos = await obterProdutos(categoria);
        
        if (!produtos.length) {
            itensCardapio.innerHTML = templates.erro('Nenhum produto encontrado nesta categoria.');
            return;
        }

        // Renderizar produtos com fade
        itensCardapio.style.opacity = '0';
        itensCardapio.innerHTML = produtos.map(produto => 
            templates.item
                .replace(/\${img}/g, produto.img)
                .replace(/\${name}/g, produto.name)
                .replace(/\${description}/g, produto.dsc)
                .replace(/\${id}/g, produto.id)
                .replace(/\${price}/g, produto.price.toFixed(2).replace('.', ','))
        ).join('');

        // Fade in
        setTimeout(() => {
            itensCardapio.style.opacity = '1';
        }, 100);

    } catch (erro) {
        console.error('Erro ao carregar produtos:', erro);
        itensCardapio.innerHTML = templates.erro('Erro ao carregar produtos. Por favor, tente novamente.');
    }
}

// Objeto global do cardápio
const cardapio = {
    metodos: {
        obterItensCardapio: carregarProdutos
    }
};