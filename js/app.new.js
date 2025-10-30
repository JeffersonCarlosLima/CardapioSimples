$(document).ready(async function() {
    // Carregar e renderizar o menu de categorias do backend
    const categorias = await obterCategorias();
    if (categorias.length) {
        // Carrega produtos da primeira categoria
        await cardapio.metodos.obterItensCardapio(categorias[0]);
    }
});

// Objeto principal do cardápio
const cardapio = {
    // Propriedade para armazenar os templates
    templates: {
        item: `
            <div class="card-item" id="\${id}">
                <div class="img-produto">
                    <img src="\${img}" alt="\${name}"/>
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

    // Métodos do cardápio
    metodos: {
        // Função para obter e renderizar itens do cardápio
        obterItensCardapio: async (categoria) => {
            try {
                $("#itensCardapio").html('<p class="text-center">Carregando...</p>');
                
                // Buscar produtos da categoria
                const produtos = await obterProdutos(categoria);
                
                // Atualizar botão ativo
                $(".container-menu a").removeClass('active');
                $(`#menu-${categoria}`).addClass('active');

                // Renderizar produtos
                if (produtos && produtos.length > 0) {
                    let html = '';
                    produtos.forEach(produto => {
                        html += cardapio.templates.item
                            .replace(/\${img}/g, produto.img)
                            .replace(/\${name}/g, produto.name)
                            .replace(/\${description}/g, produto.dsc)
                            .replace(/\${id}/g, produto.id)
                            .replace(/\${price}/g, produto.price.toFixed(2).replace('.',","));
                    });
                    $("#itensCardapio").html(html);
                } else {
                    $("#itensCardapio").html('<p class="text-center">Nenhum produto encontrado nesta categoria.</p>');
                }
            } catch (erro) {
                console.error('Erro ao carregar produtos:', erro);
                $("#itensCardapio").html('<p class="text-center text-danger">Erro ao carregar produtos. Tente novamente.</p>');
            }
        }
    }
};