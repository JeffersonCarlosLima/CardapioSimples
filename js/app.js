// Inicialização do cardápio
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Carregar categorias iniciais
        const categorias = await obterCategorias();
        if (categorias && categorias.length > 0) {
            // Carregar produtos da primeira categoria
            await cardapio.metodos.obterItensCardapio(categorias[0]);
        }
    } catch (erro) {
        console.error('Erro na inicialização:', erro);
    }
});

// Objeto principal do cardápio
const cardapio = {
    // Templates
    templates: {
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
    },

    // Métodos
    metodos: {
        // Função para obter e renderizar itens do cardápio
        obterItensCardapio: async (categoria) => {
            try {
                // Mostrar loading
                document.getElementById('itensCardapio').innerHTML = '<div class="text-center"><div class="spinner-border" role="status"><span class="visually-hidden">Carregando...</span></div></div>';
                
                // Buscar produtos
                const produtos = await obterProdutos(categoria);
                
                // Atualizar botão ativo
                document.querySelectorAll('.container-menu a').forEach(a => a.classList.remove('active'));
                document.getElementById(`menu-${categoria}`).classList.add('active');

                // Renderizar produtos
                if (produtos && produtos.length > 0) {
                    let html = '';
                    produtos.forEach(produto => {
                        html += cardapio.templates.item
                            .replace(/\${img}/g, produto.img)
                            .replace(/\${name}/g, produto.name)
                            .replace(/\${description}/g, produto.dsc)
                            .replace(/\${id}/g, produto.id)
                            .replace(/\${price}/g, produto.price.toFixed(2).replace('.', ','));
                    });
                    
                    const container = document.getElementById('itensCardapio');
                    container.style.opacity = '0';
                    container.innerHTML = html;
                    
                    // Fade in
                    setTimeout(() => {
                        container.style.opacity = '1';
                    }, 100);
                } else {
                    document.getElementById('itensCardapio').innerHTML = '<p class="text-center">Nenhum produto encontrado nesta categoria.</p>';
                }
            } catch (erro) {
                console.error('Erro ao carregar produtos:', erro);
                document.getElementById('itensCardapio').innerHTML = '<p class="text-center text-danger">Erro ao carregar produtos. Tente novamente.</p>';
            }
        }
    }
};