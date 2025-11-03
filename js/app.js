// Inicialização do cardápio
document.addEventListener('DOMContentLoaded', function() {
    // A inicialização agora é feita pelo método do objeto
    cardapio.metodos.inicializar();
});

// Objeto principal do cardápio
const cardapio = {
    
    // 1. Local para armazenar todos os dados da API
    dadosCompletos: {},

    // 2. NOVO: Armazena a última categoria vista
    ultimaCategoriaAtiva: null,

    // Templates
    templates: {
        item: `
            <div class="card-item" id="\${id}">
                <img src="\${img}" alt="\${name}" loading="lazy"/>
                
                <div class="card-item-content">
                    <h3 class="card-item-title">\${name}</h3>
                    <p class="card-item-desc">\${description}</p>
                </div>

                <div class="card-item-price">R$ \${price}</div>
            </div>
        `
    },

    // Métodos
    metodos: {

        // Função de inicialização (agora configura a pesquisa)
        inicializar: async () => {
            const containerMenu = document.querySelector('.container-menu');
            const containerItens = document.getElementById('itensCardapio');
            
            containerItens.innerHTML = '<div class="text-center"><div class="spinner-border" role="status"><span class="visually-hidden">Carregando...</span></div></div>';
            containerMenu.innerHTML = ''; 

            try {
                // FAZ O FETCH ÚNICO
                const data = await obterCardapioCompleto(); // Função da sua 'api.js'
                
                if (!data || Object.keys(data).length === 0) {
                    containerItens.innerHTML = '<p class="text-center">Nenhum produto encontrado no cardápio.</p>';
                    return;
                }

                // ARMAZENA OS DADOS LOCALMENTE
                cardapio.dadosCompletos = data;
                
                const categorias = Object.keys(data);

                // GERA OS BOTÕES DE CATEGORIA DINAMICAMENTE
                categorias.forEach(categoria => {
                    const link = document.createElement('a');
                    link.href = "#";
                    link.id = `menu-${categoria}`; 
                    link.textContent = categoria;
                    
                    // ATUALIZADO: Adiciona o evento de clique
                    link.onclick = (e) => {
                        e.preventDefault();
                        // Limpa a pesquisa ao clicar na categoria
                        document.querySelector('.search-bar input').value = ''; 
                        
                        cardapio.metodos.renderizarProdutosDaCategoria(categoria);
                    };
                    containerMenu.appendChild(link);
                });

                // ===============================================
                // === 🚀 NOVA LÓGICA DE PESQUISA 🚀 ===
                // ===============================================
                const searchInput = document.querySelector('.search-bar input');
                searchInput.addEventListener('input', (e) => {
                    cardapio.metodos.filtrarPesquisa(e.target.value);
                });
                // ===============================================

                // Renderiza os produtos da primeira categoria
                if (categorias.length > 0) {
                    cardapio.metodos.renderizarProdutosDaCategoria(categorias[0]);
                }
                
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

        // REESCRITA: Esta função agora gerencia o estado da categoria
        renderizarProdutosDaCategoria: (categoria) => {
            // Armazena como a última categoria ativa
            cardapio.ultimaCategoriaAtiva = categoria;
            
            // Puxa os produtos dos DADOS LOCAIS
            const produtos = cardapio.dadosCompletos[categoria] || [];
            
            // Atualizar botão ativo
            document.querySelectorAll('.container-menu a').forEach(a => a.classList.remove('active'));
            const menuButton = document.getElementById(`menu-${categoria}`);
            if (menuButton) {
                menuButton.classList.add('active');
            }

            // Chama o renderizador de itens
            cardapio.metodos.renderizarItens(produtos, `Nenhum produto encontrado em ${categoria}.`);
        },


        // ===============================================
        // === 🚀 NOVAS FUNÇÕES (Pesquisa e Render) 🚀 ===
        // ===============================================

        /**
         * Filtra os produtos com base no termo de pesquisa.
         * Chamado pelo 'input' da barra de pesquisa.
         */
        filtrarPesquisa: (termo) => {
            const termoBusca = termo.trim().toLowerCase();
            
            // Se a barra de pesquisa for limpa, volta para a última categoria
            if (termoBusca === '') {
                if (cardapio.ultimaCategoriaAtiva) {
                    cardapio.metodos.renderizarProdutosDaCategoria(cardapio.ultimaCategoriaAtiva);
                }
                return; // Sai da função
            }

            let resultados = [];
            
            // Desmarcar todos os botões de categoria (estamos em modo pesquisa)
            document.querySelectorAll('.container-menu a').forEach(a => a.classList.remove('active'));

            // Itera sobre TODAS as categorias e produtos
            for (const categoria in cardapio.dadosCompletos) {
                const produtosFiltrados = cardapio.dadosCompletos[categoria].filter(produto => {
                    // Filtra por nome (name) ou descrição (dsc)
                    const nome = (produto.name || '').toLowerCase();
                    const desc = (produto.dsc || '').toLowerCase(); // 'dsc' é seu campo de descrição
                    
                    return nome.includes(termoBusca) || desc.includes(termoBusca);
                });
                
                // Adiciona os produtos encontrados ao array de resultados
                resultados = resultados.concat(produtosFiltrados);
            }

            // Renderizar os resultados
            cardapio.metodos.renderizarItens(resultados, `Nenhum produto encontrado para "${termo}".`);
        },

        /**
         * Renderiza uma lista de produtos no container.
         * Esta função é genérica e usada tanto pela Categoria quanto pela Pesquisa.
         */
        renderizarItens: (produtos, mensagemVazia) => {
            const container = document.getElementById('itensCardapio');
            
            // Animação de fade out (para a troca)
            container.style.opacity = '0';

            // Aguarda a animação para trocar o conteúdo
            setTimeout(() => {
                if (produtos && produtos.length > 0) {
                    let html = '';
                    produtos.forEach(produto => {
                        html += cardapio.templates.item
                            .replace(/\${img}/g, produto.img || '') 
                            .replace(/\${name}/g, produto.name || 'Nome indisponível')
                            .replace(/\${description}/g, produto.dsc || '') // 'dsc' é seu campo de descrição
                            .replace(/\${id}/g, produto.id)
                            .replace(/\${price}/g, produto.price.toFixed(2).replace('.', ','));
                    });
                    
                    container.innerHTML = html;
                } else {
                    // Mostra a mensagem de "vazio" (seja da categoria ou da pesquisa)
                    container.innerHTML = `<p class="text-center">${mensagemVazia}</p>`;
                }
                
                // Animação de fade in
                container.style.opacity = '1';
            }, 150); // 150ms para a animação de fade
        }
    }
};