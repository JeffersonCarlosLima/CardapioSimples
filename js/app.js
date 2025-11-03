// Inicialização do cardápio
document.addEventListener('DOMContentLoaded', function() {
    // A inicialização agora é feita pelo método do objeto
    cardapio.metodos.inicializar();
});

// Objeto principal do cardápio
const cardapio = {
    
    // 1. Local para armazenar todos os dados da API
    dadosCompletos: {},

    // Templates
    templates: {
        item: `
            <div class="card-item" id="\${id}">
                <img src="\${img}" alt="\${name}" loading="lazy"/>
                <div class="card-item-content">
                    <h3 class="card-item-title">\${name}</h3>
                    <p class="card-item-desc">\${description}</p>
                    <div class="card-item-price">R$ \${price}</div>
                </div>
            </div>
        `
    },

    // Métodos
    metodos: {

        // 2. NOVA FUNÇÃO: Chamada apenas uma vez no carregamento da página
        inicializar: async () => {
            const containerMenu = document.querySelector('.container-menu');
            const containerItens = document.getElementById('itensCardapio');
            
            // Mostrar loading inicial
            containerItens.innerHTML = '<div class="text-center"><div class="spinner-border" role="status"><span class="visually-hidden">Carregando...</span></div></div>';
            containerMenu.innerHTML = ''; // Limpa botões estáticos (se houver)

            try {
                // 3. FAZ O FETCH ÚNICO
                const data = await obterCardapioCompleto(); // Função da sua 'api.js'
                
                if (!data || Object.keys(data).length === 0) {
                    containerItens.innerHTML = '<p class="text-center">Nenhum produto encontrado no cardápio.</p>';
                    return;
                }

                // 4. ARMAZENA OS DADOS LOCALMENTE
                cardapio.dadosCompletos = data;
                
                const categorias = Object.keys(data);

                // 5. GERA OS BOTÕES DE CATEGORIA DINAMICAMENTE
                categorias.forEach(categoria => {
                    const link = document.createElement('a');
                    link.href = "#";
                    link.id = `menu-${categoria}`; // ID usado pela sua lógica de 'active'
                    link.textContent = categoria;
                    
                    // Adiciona o evento de clique que agora é síncrono
                    link.onclick = (e) => {
                        e.preventDefault();
                        // Chama a função de RENDERIZAR (sem fetch)
                        cardapio.metodos.renderizarProdutosDaCategoria(categoria);
                    };
                    containerMenu.appendChild(link);
                });

                // 6. Renderiza os produtos da primeira categoria
                if (categorias.length > 0) {
                    cardapio.metodos.renderizarProdutosDaCategoria(categorias[0]);
                }
                
                // Mostrar notificação offline (lógica que você já tinha)
                if (window.mostrarNotificacaoOffline) {
                    window.mostrarNotificacaoOffline();
                }

            } catch (erro) {
                console.error('Erro na inicialização:', erro);
                containerItens.innerHTML = '<p class="text-center text-danger">Erro ao carregar o cardápio. Tente novamente.</p>';
                if (window.mostrarNotificacaoOffline) {
                    window.mostrarNotificacaoOffline();
                }
            }
        },

        // 7. FUNÇÃO REFEITA: Agora é SÍNCRONA. Não faz mais fetch.
        // (Renomeei de 'obterItensCardapio' para 'renderizarProdutosDaCategoria')
        renderizarProdutosDaCategoria: (categoria) => {
            
            // Não há mais spinner ou try/catch, pois é instantâneo
            
            // 8. Puxa os produtos dos DADOS LOCAIS
            const produtos = cardapio.dadosCompletos[categoria];
            
            // Atualizar botão ativo (lógica que você já tinha)
            document.querySelectorAll('.container-menu a').forEach(a => a.classList.remove('active'));
            const menuButton = document.getElementById(`menu-${categoria}`);
            if (menuButton) {
                menuButton.classList.add('active');
            }

            // Renderizar produtos
            const container = document.getElementById('itensCardapio');
            if (produtos && produtos.length > 0) {
                let html = '';
                produtos.forEach(produto => {
                    // Corrigi uma pequena inconsistência no seu template
                    // (Template usava ${description}, mas o replace usava produto.dsc)
                    html += cardapio.templates.item
                        .replace(/\${img}/g, produto.img || '') // Usando (produto.img || '') para evitar 'undefined'
                        .replace(/\${name}/g, produto.name || 'Nome indisponível')
                        .replace(/\${description}/g, produto.dsc || '') // Assumindo que 'dsc' é a descrição
                        .replace(/\${id}/g, produto.id)
                        .replace(/\${price}/g, produto.price.toFixed(2).replace('.', ','));
                });
                
                // Animação de fade (lógica que você já tinha)
                container.style.opacity = '0';
                container.innerHTML = html;
                
                setTimeout(() => {
                    container.style.opacity = '1';
                }, 50); // Reduzi o tempo para a transição parecer mais rápida

            } else {
                container.innerHTML = '<p class="text-center">Nenhum produto encontrado nesta categoria.</p>';
            }
        }
    }
};