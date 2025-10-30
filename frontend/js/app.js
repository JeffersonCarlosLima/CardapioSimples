$(document).ready(async function() {
    // Carregar e renderizar o menu de categorias do backend
    const categorias = await obterCategorias();
    let menuHtml = '';
    categorias.forEach((cat, idx) => {
        menuHtml += `<a id="menu-${cat}" onclick="obterItensCardapio('${cat}')" class="btn btn-white btn-sm mr-3${idx===0?' active':''}">
            <i class="fas fa-utensils"></i>&nbsp; ${cat.charAt(0).toUpperCase() + cat.slice(1)}
        </a>`;
    });
    $(".container-menu").html(menuHtml);

    // Carrega produtos da primeira categoria
    if (categorias.length) {
        obterItensCardapio(categorias[0]);
    }
});

// Função dinâmica: obtém e renderiza os itens de uma categoria
async function obterItensCardapio(categoria) {
    $("#itensCardapio").html('<p class="text-center">Carregando...</p>');
    const produtos = await obterProdutos(categoria);
    console.log('Produtos recebidos:', produtos);
    $(".container-menu a").removeClass('active');
    $(`#menu-${categoria}`).addClass('active');

    let html = '';
    produtos.forEach(e => {
        let temp = cardapio.templates.item
            .replace(/\${img}/g, e.img)
            .replace(/\${name}/g, e.name)
            .replace(/\${description}/g, e.dsc)
            .replace(/\${id}/g, e.id)
            .replace(/\${price}/g, e.price.toFixed(2).replace('.',","));
        html += temp;
    });
    $("#itensCardapio").html(html);
}

cardapio = {};
cardapio.templates = {
    item: `
            <div class="card-item" id="\${id}">
                <div class="img-produto">
                    <img src="\${img}"/>
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
    `,
};

cardapio.metodos = {
    obterItensCardapio
}

function verificarLarguraDaTela() {
    var elemento = document.getElementById('itensCardapio');
    if (window.innerWidth >= 768) {
      elemento.style.display = 'none'; // Oculta em telas de celular
    } else {
      elemento.style.display = 'block'; // Exibe em telas de computador
    }
  }

window.addEventListener('load', verificarLarguraDaTela);