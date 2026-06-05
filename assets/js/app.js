// ============================================================
// app.js — orquestração geral
// Responsabilidade: fetch dos JSONs, controle de etapas visíveis,
// localStorage, compartilhamento. Sem dados de etapa nenhuma.
// ============================================================

// ─── ESTADO GLOBAL ────────────────────────────────────────────

let SIMBOLOS = [];

let currentUserData = {
    nome: "",
    nascimento: "",
    trilha: "",
    selecoes: {},
    detalhes: {}
};

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
            console.error('Erro ao carregar símbolos:', err);
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
        card.addEventListener('click', () => {
            trilhaCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            currentUserData.trilha = card.dataset.trilha;
            updateButtons();
        });
    });

    btnEntrar.onclick = () => {
        currentUserData.nome = inputNome.value.trim();
        currentUserData.nascimento = document.getElementById('input-nascimento')?.value || '';
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

    // Símbolo principal: primeiro selecionado encontrado nos JSONs
    const allSelected = [].concat(...Object.values(currentUserData.selecoes));
    const mainSymbolData = SIMBOLOS.find(s => allSelected.includes(s.simbolo)) || SIMBOLOS[0];

    // Barras de status calculadas pelo leitura.js
    const status = calcularStatus(currentUserData, mainSymbolData);

    // Fase da lua via lua.js
    const lua = getMoonPhase(new Date());

    const blocks = [
        {
            id: 1,
            title: "O QUE SEU SONHO DIZ",
            content: generateInterpretation(currentUserData, [mainSymbolData]).texto,
            hero: true
        },
        {
            id: 2,
            title: "SEU ANIMAL DA SORTE",
            content: `Animal: ${mainSymbolData.jogo_bicho.animal}<br>
                      Grupo: ${mainSymbolData.jogo_bicho.grupo}<br>
                      Dezenas: ${mainSymbolData.jogo_bicho.dezenas.join(', ')}<br>
                      Milhar: ${mainSymbolData.jogo_bicho.milhar_sugerido}`
        },
        {
            id: 3,
            title: "SEUS NÚMEROS DE HOJE",
            content: `<span style="color:var(--gold-color); font-size:14px;">
                        ${generateLuckyNumbers(currentUserData.nome).join(' - ')}
                      </span>`
        },
        {
            id: 4,
            title: `TRILHA: ${currentUserData.trilha.toUpperCase()}`,
            content: mainSymbolData.leituras[`trilha_${currentUserData.trilha.toLowerCase()}`] || ''
        },
        {
            id: 5,
            title: "COMO VOCÊ ESTÁ",
            content: `
                <div class="rpg-bar-container">
                    <div class="rpg-label">MENTE</div>
                    <div class="rpg-bar-bg">
                        <div class="rpg-bar-fill green" style="width:${status.mente}%"></div>
                    </div>
                </div>
                <div class="rpg-bar-container">
                    <div class="rpg-label">AMOR</div>
                    <div class="rpg-bar-bg">
                        <div class="rpg-bar-fill yellow" style="width:${status.amor}%"></div>
                    </div>
                </div>
                <div class="rpg-bar-container">
                    <div class="rpg-label">FINANÇAS</div>
                    <div class="rpg-bar-bg">
                        <div class="rpg-bar-fill red" style="width:${status.financas}%"></div>
                    </div>
                </div>
            `
        },
        {
            id: 6,
            title: "A LUA ESTA NOITE",
            content: `Fase: ${lua.name} — ${lua.description}`
        }
    ];

    blocks.forEach((block, index) => {
        const div = document.createElement('div');
        div.className = `result-block ${block.hero ? 'result-block--hero' : ''} fade-in-block`;
        div.style.animationDelay = `${index * 1.5}s`;
        div.innerHTML = `<h3>${block.title}</h3><p>${block.content}</p>`;
        resultsContainer.appendChild(div);
    });

    document.getElementById('footer-actions').classList.remove('hidden');
}

// ─── COMPARTILHAMENTO ─────────────────────────────────────────

function compartilharZap() {
    const text = `Acabei de consultar o Oráculo em sonheicom.com.br!\nMinha trilha foi *${currentUserData.trilha}* e os astros revelaram meus símbolos. Confira o seu também!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
}
