// ============================================================
// app.js — orquestração geral
// Responsabilidade: fetch dos JSONs, controle de etapas visíveis,
// localStorage, compartilhamento. Sem dados de etapa nenhuma.
// ============================================================

// ─── ESTADO GLOBAL ────────────────────────────────────────────

let SIMBOLOS = [];

window.currentUserData = {
    nome: "",
    nascimento: "",
    trilha: "",
    selecoes: {},
    detalhes: {}
};

// ─── HELPERS GLOBAIS ──────────────────────────────────────────
function normalizar(str) {
    if (!str) return '';
    return str.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9_]/g, '_')
        .replace(/_+/g, '_')
        .trim();
}

// ─── INICIALIZAÇÃO ────────────────────────────────────────────
// Carrega os cinco JSONs de símbolos separados e une em memória

document.addEventListener('DOMContentLoaded', () => {
    const arquivos = [
        './data/simbolos/animais.json',
        './data/simbolos/pessoas.json',
        './data/simbolos/lugares.json',
        './data/simbolos/situacoes.json',
        './data/simbolos/objetos.json'
    ];

    Promise.all(arquivos.map(url => fetch(url).then(r => r.json())))
        .then(resultados => {
            SIMBOLOS = resultados.flatMap(json => Object.values(json));
            initApp();
        })
        .catch(err => {
            console.error('Erro ao carregar simbolos:', err);
        });
});

function initApp() {
    checkSavedLeitura();
    setupEtapa1();
}

// ─── LOCALSTORAGE ─────────────────────────────────────────────

function checkSavedLeitura() {
    const saved = localStorage.getItem('ultima_leitura');
    if (saved) {
        const data = JSON.parse(saved);
        const banner = document.getElementById('saved-banner');
        if (banner) {
            banner.querySelector('.date').textContent = data.data;
            banner.classList.remove('hidden');
        }
    }
}

function salvarLeitura() {
    const leitura = {
        data: new Date().toLocaleDateString('pt-BR'),
        usuario: currentUserData.nome,
        trilha: currentUserData.trilha
    };
    localStorage.setItem('ultima_leitura', JSON.stringify(leitura));
    alert('Leitura salva com sucesso!');
}

// ─── ETAPA 1 ──────────────────────────────────────────────────

function setupEtapa1() {
    const btnEntrar = document.getElementById('btn-entrar');
    const inputNome = document.getElementById('input-nome');
    const trilhaCards = document.querySelectorAll('#trilha-selector .trilha-card');

    inputNome.addEventListener('input', updateButtons);

    trilhaCards.forEach(card => {
        card.addEventListener('click', (e) => {
            const target = e.target.closest('.trilha-card');
            if (!target) return;
            trilhaCards.forEach(c => c.classList.remove('selected'));
            target.classList.add('selected');
            currentUserData.trilha = target.dataset.trilha;
            updateButtons();
        });
    });

    btnEntrar.onclick = () => {
        currentUserData.nome = inputNome.value.trim();
        const dia = document.getElementById('nasc-dia')?.value || '';
        const mes = document.getElementById('nasc-mes')?.value || '';
        const ano = document.getElementById('nasc-ano')?.value || '';
        currentUserData.nascimento = (dia && mes && ano) ? `${dia}/${mes}/${ano}` : '';
        showEtapa(2);
        startSubEtapas();
    };
}

function updateButtons() {
    const btnEntrar = document.getElementById('btn-entrar');
    const inputNome = document.getElementById('input-nome');
    if (btnEntrar) {
        btnEntrar.disabled = !(inputNome.value.trim().length > 0 && currentUserData.trilha);
    }
}

// ─── CONTROLE DE ETAPAS VISÍVEIS ─────────────────────────────

function showEtapa(num) {
    document.querySelectorAll('.etapa').forEach(e => e.classList.add('hidden'));
    document.getElementById(`etapa-${num}`).classList.remove('hidden');
    window.scrollTo(0, 0);
}

// ─── RESULTADO ────────────────────────────────────────────────

function revelarOraculo() {
    showEtapa(4);
    const crystalBall = document.getElementById('crystal-ball-overlay');
    crystalBall.classList.remove('hidden');

    const messages = [
        "lendo seus símbolos...",
        "consultando os astros...",
        "sua leitura está pronta"
    ];
    let mIdx = 0;
    const interval = setInterval(() => {
        mIdx++;
        if (mIdx < messages.length) {
            document.getElementById('loading-text').textContent = messages[mIdx];
        } else {
            clearInterval(interval);
            crystalBall.classList.add('hidden');
            renderResultados();
        }
    }, 1500);
}

function renderResultados() {
    const resultsContainer = document.getElementById('resultados');
    resultsContainer.innerHTML = '';
    if (!SIMBOLOS || SIMBOLOS.length === 0) {
        resultsContainer.innerHTML = '<p style="text-align:center;opacity:.6">Erro ao carregar os dados. Recarregue a página.</p>';
        return;
    }

    // ── SÍMBOLO PRINCIPAL ─────────────────────────────────────
    // Corrige o bug: busca por slug E por simbolo, case-insensitive
    const allSelected = Object.values(currentUserData.selecoes).flat().filter(Boolean);
    if (allSelected.length === 0) {
        resultsContainer.innerHTML = '<p style="text-align:center;opacity:.6">Nenhum símbolo selecionado. Volte e escolha ao menos um elemento do seu sonho.</p>';
        return;
    }

    // Busca TODOS os símbolos selecionados, não só o primeiro
    const simbolosEncontrados = SIMBOLOS.filter(s =>
        allSelected.some(sel => {
            const selNorm = normalizar(sel);
            return selNorm === normalizar(s.simbolo) ||
                   selNorm === normalizar(s.slug) ||
                   (s.sinonimos || []).some(sin => normalizar(sin) === selNorm);
        })
    );

    // Fallback se nenhum símbolo for encontrado
        const simbolosUsados = simbolosEncontrados.length > 0
        ? simbolosEncontrados
        : [SIMBOLOS.find(s => s.jogo_bicho) || SIMBOLOS[0]];

    const mainSymbolData = simbolosUsados[0];
    const status = calcularStatus(currentUserData, mainSymbolData);
    const secoes = generateInterpretation(currentUserData, simbolosUsados);
    const trilha = (currentUserData.trilha || 'significado').toLowerCase();

    // ── CARTÃO DE SORTE ───────────────────────────────────────
    const numeros = generateLuckyNumbers(currentUserData.nome);

    // Rank de todos os símbolos com jogo do bicho
    const bichoLinhas = simbolosUsados
        .filter(s => s.jogo_bicho && s.jogo_bicho.animal !== 'Sorte')
        .map(s => `
            <div class="sorte-simbolo">
                <div class="sorte-simbolo-nome">◆ ${s.simbolo.toUpperCase()}</div>
                <div class="sorte-linha">
                    <span class="sorte-label">ANIMAL</span>
                    <span class="sorte-valor">${s.jogo_bicho.animal} — Grupo ${s.jogo_bicho.grupo}</span>
                </div>
                <div class="sorte-linha">
                    <span class="sorte-label">DEZENAS</span>
                    <span class="sorte-valor">${s.jogo_bicho.dezenas.join(' · ')}</span>
                </div>
                <div class="sorte-linha">
                    <span class="sorte-label">MILHAR</span>
                    <span class="sorte-valor">${s.jogo_bicho.milhar_sugerido}</span>
                </div>
            </div>
            <div class="sorte-separador">───</div>
        `).join('');

const htmlSorte = `
    <div class="sorte-bloco">
        ${bichoLinhas || '<div class="sorte-linha"><span class="sorte-valor">Consulte os astros novamente.</span></div>'}
        <div class="sorte-linha sorte-numeros-linha">
            <span class="sorte-label">SEUS NÚMEROS</span>
            <span class="sorte-valor sorte-numeros">${numeros.join(' — ')}</span>
        </div>
    </div>`;

    // ── MONTA CARTÕES NA ORDEM DA TRILHA ─────────────────────
    // secoes = array de { titulo, texto } retornado pelo leitura.js
    // Injeta cartão de sorte após seção 1, barras RPG na seção COMO VOCÊ ESTÁ

    const cartoes = [];

    secoes.forEach((secao, index) => {
        if (!secao.texto || !secao.texto.trim()) return;

        // Seção COMO VOCÊ ESTÁ recebe as barras RPG
        if (secao.titulo === 'COMO VOCÊ ESTÁ') {
            cartoes.push({
                titulo: secao.titulo,
                html: `<p>${secao.texto.replace(/\n\n/g, '</p><p>')}</p>`
            });
            return;
        }

        cartoes.push({
            titulo: secao.titulo,
            html: `<p>${secao.texto.replace(/\n\n/g, '</p><p>')}</p>`
        });

        // Injeta cartão de sorte após o primeiro cartão (mensagem central)
        if (index === 0) {
            cartoes.push({
                titulo: trilha === 'sorte' ? 'SUA SORTE EM DESTAQUE' : 'ANIMAL E NÚMEROS DA SORTE',
                html: htmlSorte,
                sorte: true
            });
        }
    });

    // ── RENDERIZA ─────────────────────────────────────────────
    cartoes.forEach((cartao, index) => {
        const div = document.createElement('div');
        div.className = `result-block fade-in-block${cartao.sorte ? ' result-block--sorte' : ''}`;
        div.style.animationDelay = `${index * 1.2}s`;
        div.innerHTML = `<h3>◆ ${cartao.titulo}</h3>${cartao.html}`;
        resultsContainer.appendChild(div);
    });

    document.getElementById('footer-actions').classList.remove('hidden');
}

// ─── COMPARTILHAMENTO ─────────────────────────────────────────

function compartilharZap() {
    const text = `Acabei de consultar o Oráculo em sonheicom.com.br!\nMinha trilha foi *${currentUserData.trilha}* e os astros revelaram meus símbolos. Confira o seu também!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
}
