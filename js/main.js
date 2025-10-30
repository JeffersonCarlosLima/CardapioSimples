const $ = (s) => document.querySelector(s);

const API_URL = 'http://localhost:3000';

async function fetchJson(url) {
    const r = await fetch(url, { cache: 'no-cache' });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
}

function setStatus(t, err = false) {
    const el = $('#status');
    el.textContent = t;
    el.classList.toggle('text-danger', err);
}

function renderCategorias(list) {
    if (!Array.isArray(list) || list.length === 0) {
        $('#categorias').innerHTML = '<div class="text-muted">Nenhuma categoria encontrada.</div>';
        return;
    }
    $('#categorias').innerHTML = list.map((c, index) => 
        `<button class="btn btn-outline-primary btn-sm me-2 mb-2 ${index === 0 ? 'active' : ''}" data-cat="${c}">${c}</button>`
    ).join('');
}

function renderProdutos(list) {
    if (!Array.isArray(list) || list.length === 0) {
        $('#produtos').innerHTML = '<div class="text-muted">Nenhum produto para esta categoria.</div>';
        return;
    }
    $('#produtos').innerHTML = list.map(p => `
        <div class="d-flex align-items-start gap-3 mb-3">
            <img src="${p.img}" alt="${p.name}" style="width:80px;height:80px;object-fit:cover;border-radius:8px;">
            <div>
                <div class="fw-semibold">${p.name}</div>
                <div class="text-muted small">${p.dsc || ''}</div>
                <div class="fw-bold">R$ ${Number(p.price).toFixed(2).replace('.', ',')}</div>
            </div>
        </div>
    `).join('');
}

async function loadCategorias() {
    try {
        const data = await fetchJson(`${API_URL}/categorias`);
        renderCategorias(data);
        if (data && data.length > 0) {
            // Carrega automaticamente a primeira categoria
            loadProdutos(data[0]);
        }
    } catch (e) {
        console.error('Erro ao carregar categorias:', e);
        renderCategorias([]);
    }
}

async function loadProdutos(cat) {
    try {
        const data = await fetchJson(`${API_URL}/produtos/${encodeURIComponent(cat)}`);
        renderProdutos(data);
    } catch (e) {
        console.error('Erro ao carregar produtos:', e);
        renderProdutos([]);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Carrega categorias automaticamente ao iniciar
    loadCategorias();

    // Adiciona listener para os botões de categoria
    $('#categorias').addEventListener('click', (e) => {
        const btn = e.target.closest('[data-cat]');
        if (!btn) return;
        loadProdutos(btn.dataset.cat);
        
        // Atualiza visual do botão ativo
        document.querySelectorAll('[data-cat]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});


