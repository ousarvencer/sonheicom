let SIMBOLOS = [];
let currentUserData = {
    nome: "",
    nascimento: "",
    trilha: "",
    selecoes: {},
    detalhes: {}
};

document.addEventListener('DOMContentLoaded', () => {
    fetch('./data/index.json')
        .then(response => response.json())
        .then(data => {
            SIMBOLOS = data.simbolos;
            initApp();
        });
});

function initApp() {
    checkSavedLeitura();
    setupEtapa1();
}

function checkSavedLeitura() {
    const saved = localStorage.getItem('ultima_leitura');
    if (saved) {
        const data = JSON.parse(saved);
        const banner = document.getElementById('saved-banner');
        banner.querySelector('.date').textContent = data.data;
        banner.classList.remove('hidden');
    }
}

function setupEtapa1() {
    const btnEntrar = document.getElementById('btn-entrar');
    const inputNome = document.getElementById('input-nome');
    const trilhaCards = document.querySelectorAll('#trilha-selector .card');

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
        currentUserData.nome = inputNome.value;
        showEtapa(2);
        startSubEtapas();
    };
}

function updateButtons() {
    const btnEntrar = document.getElementById('btn-entrar');
    const inputNome = document.getElementById('input-nome');
    if (btnEntrar) {
        btnEntrar.disabled = !(inputNome.value.length > 0 && currentUserData.trilha);
    }
}

function showEtapa(num) {
    document.querySelectorAll('.etapa').forEach(e => e.classList.add('hidden'));
    document.getElementById(`etapa-${num}`).classList.remove('hidden');
    window.scrollTo(0, 0);
}

let currentSubEtapa = 0;
const subEtapas = ['pessoas', 'animais', 'lugares', 'situacoes', 'objetos'];

function startSubEtapas() {
    renderSubEtapa();
}

const SUBTITULOS = {
    pessoas: 'quem estava no seu sonho?',
    animais: 'alguma criatura cruzou seu caminho?',
    lugares: 'onde você estava?',
    situacoes: 'o que aconteceu?',
    objetos: 'o que você viu ou tocou?'
};

function renderSubEtapa() {
    const key = subEtapas[currentSubEtapa];
    const progressBar = document.getElementById('progress-bar');
    progressBar.style.width = `${((currentSubEtapa + 1) / 5) * 100}%`;

    document.getElementById('sub-etapa-title').textContent = key.toUpperCase();
    document.getElementById('sub-etapa-subtitulo').textContent = SUBTITULOS[key];
    document.getElementById('btn-proximo').textContent = 'PULAR →';
    renderGrid('grid-sub-etapa', ETAPAS_DATA[key]);
}

function nextSubEtapa() {
    const selected = Array.from(document.querySelectorAll('#grid-sub-etapa .selected')).map(c => c.textContent);
    currentUserData.selecoes[subEtapas[currentSubEtapa]] = selected;
    currentSubEtapa++;
    if (currentSubEtapa < subEtapas.length) {
        renderSubEtapa();
    } else {
        showEtapa(3);
        startEtapa3();
    }
}

const PERGUNTAS = [
    {
        key: 'emocao',
        titulo: 'SOBRE O SONHO',
        subtitulo: 'como você se sentiu?',
        opcoes: ['MEDO','ALEGRIA','ANGÚSTIA','CONFUSÃO','NOSTALGIA','EUFORIA'],
        multiplo: false
    },
    {
        key: 'periodo',
        titulo: 'O CENÁRIO',
        subtitulo: 'era dia ou noite no sonho?',
        opcoes: ['DIA','NOITE','NÃO LEMBRO'],
        multiplo: false
    },
    {
        key: 'cor_sonho',
        titulo: 'AS CORES',
        subtitulo: 'o sonho era colorido?',
        opcoes: ['COLORIDO','PRETO E BRANCO','NÃO LEMBRO'],
        multiplo: false
    },
    {
        key: 'cor_dominante',
        titulo: 'AS CORES',
        subtitulo: 'que cor mais apareceu?',
        opcoes: ['PRETO','BRANCO','VERMELHO','ROXO','DOURADO','AZUL','VERDE','AMARELO','NÃO LEMBRO'],
        multiplo: false
    },
    {
        key: 'despertar',
        titulo: 'O DESPERTAR',
        subtitulo: 'como você acordou?',
        opcoes: ['SUOR FRIO','CORAÇÃO ACELERADO','CHORANDO','SENSAÇÃO DE PAZ','PESO NO PEITO','LEVEZA'],
        multiplo: true
    },
    {
        key: 'recorrente',
        titulo: 'A MEMÓRIA',
        subtitulo: 'já sonhou com isso antes?',
        opcoes: ['SIM','NÃO','NÃO LEMBRO'],
        multiplo: false
    },
    {
        key: 'amor',
        titulo: 'SOBRE VOCÊ HOJE',
        subtitulo: 'como está o amor?',
        opcoes: ['BEM','MAIS OU MENOS','MAL'],
        multiplo: false
    },
    {
        key: 'financas',
        titulo: 'SOBRE VOCÊ HOJE',
        subtitulo: 'como estão as finanças?',
        opcoes: ['TRANQUILO','APERTADO','CRÍTICO'],
        multiplo: false
    },
    {
        key: 'hora',
        titulo: 'O DESPERTAR',
        subtitulo: 'que horas você acordou?',
        opcoes: [],
        multiplo: false,
        tipo: 'hora'
    }
];

let currentPergunta = 0;
const naipes = ['♠','♥','♦','♣'];

const horasOpcoes = [
    '04h00','04h30','05h00','05h30','06h00','06h30',
    '07h00','07h30','08h00','08h30','09h00','09h30',
    '10h00','10h30','11h00','11h30','12h00'
];
let horaIdx = 0;

function spinHora(dir) {
    horaIdx = (horaIdx + dir + horasOpcoes.length) % horasOpcoes.length;
    document.getElementById('val-hora').textContent = horasOpcoes[horaIdx];
}

function startEtapa3() {
    currentPergunta = 0;
    renderPergunta();
}

function renderPergunta() {
    const p = PERGUNTAS[currentPergunta];
    const total = PERGUNTAS.length;
    const progress = document.getElementById('progress-bar-3');
    progress.style.width = `${((currentPergunta + 1) / total) * 100}%`;

    document.getElementById('etapa3-titulo').textContent = p.titulo;
    document.getElementById('etapa3-subtitulo').textContent = p.subtitulo;

    const grid = document.getElementById('etapa3-grid');
    const horas = document.getElementById('etapa3-horas');
    const btn = document.getElementById('btn-etapa3');

    const isUltima = currentPergunta === total - 1;
    btn.textContent = isUltima ? 'REVELAR MEU ORÁCULO' : 'PRÓXIMO →';

    if (p.tipo === 'hora') {
        grid.classList.add('hidden');
        horas.classList.remove('hidden');
        document.getElementById('val-hora').textContent = horasOpcoes[horaIdx];
    } else {
        horas.classList.add('hidden');
        grid.classList.remove('hidden');
        grid.innerHTML = '';
        p.opcoes.forEach(opcao => {
            const card = document.createElement('div');
            const naipe = naipes[Math.floor(Math.random() * naipes.length)];
            card.className = 'card';
            card.textContent = opcao;
            card.style.setProperty('--naipe', `"${naipe}"`);
            card.onclick = () => {
                if (p.multiplo) {
                    card.classList.toggle('selected');
                } else {
                    grid.querySelectorAll('.card').forEach(c => c.classList.remove('selected'));
                    card.classList.add('selected');
                }
            };
            grid.appendChild(card);
        });
    }
}

function nextPergunta() {
    const p = PERGUNTAS[currentPergunta];
    if (p.tipo === 'hora') {
        currentUserData.detalhes['hora'] = horasOpcoes[horaIdx];
    } else {
        const selected = Array.from(document.querySelectorAll('#etapa3-grid .selected')).map(c => c.textContent);
        currentUserData.detalhes[p.key] = selected;
    }

    currentPergunta++;
    if (currentPergunta < PERGUNTAS.length) {
        renderPergunta();
        window.scrollTo(0, 0);
    } else {
        revelarOraculo();
    }
}

function revelarOraculo() {
    showEtapa(4);
    const crystalBall = document.getElementById('crystal-ball-overlay');
    crystalBall.classList.remove('hidden');
    
    const messages = ["lendo seus simbolos...", "consultando os astros...", "sua leitura esta pronta"];
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
    
    // Encontrar símbolo principal
    const allSelected = [].concat(...Object.values(currentUserData.selecoes));
    const mainSymbolData = SIMBOLOS.find(s => allSelected.includes(s.simbolo)) || SIMBOLOS[0];
    
    const blocks = [
        { id: 1, title: "O QUE SEU SONHO DIZ", content: generateInterpretation(currentUserData, [mainSymbolData]).texto },
        { id: 2, title: "SEU ANIMAL DA SORTE", content: `Animal: ${mainSymbolData.jogo_bicho.animal}<br>Grupo: ${mainSymbolData.jogo_bicho.grupo}<br>Dezenas: ${mainSymbolData.jogo_bicho.dezenas.join(', ')}<br>Milhar: ${mainSymbolData.jogo_bicho.milhar_sugerido}` },
        { id: 3, title: "SEUS NUMEROS DE HOJE", content: `<span style="color:var(--gold-color); font-size:14px;">${generateLuckyNumbers(currentUserData.nome + Date.now()).join(' - ')}</span>` },
        { id: 4, title: `TRILHA: ${currentUserData.trilha.toUpperCase()}`, content: mainSymbolData.leituras[`trilha_${currentUserData.trilha.toLowerCase()}`] },
        { id: 5, title: "COMO VOCE ESTA", content: `
            <div class="rpg-bar-container"><div class="rpg-label">MENTE</div><div class="rpg-bar-bg"><div class="rpg-bar-fill green" style="width:80%"></div></div></div>
            <div class="rpg-bar-container"><div class="rpg-label">AMOR</div><div class="rpg-bar-bg"><div class="rpg-bar-fill yellow" style="width:50%"></div></div></div>
            <div class="rpg-bar-container"><div class="rpg-label">FINANÇAS</div><div class="rpg-bar-bg"><div class="rpg-bar-fill red" style="width:30%"></div></div></div>
        ` },
        { id: 6, title: "A LUA ESTA NOITE", content: `${getMoonPhase(new Date()).icon} Fase: ${getMoonPhase(new Date()).name}` }
    ];

    blocks.forEach((block, index) => {
        const div = document.createElement('div');
        div.className = 'result-block fade-in-block';
        div.style.animationDelay = `${index * 1.5}s`;
        div.innerHTML = `<h3>${block.title}</h3><p>${block.content}</p>`;
        resultsContainer.appendChild(div);
    });

    document.getElementById('footer-actions').classList.remove('hidden');
}

function salvarLeitura() {
    const leitura = {
        data: new Date().toLocaleDateString(),
        usuario: currentUserData.nome,
        trilha: currentUserData.trilha
    };
    localStorage.setItem('ultima_leitura', JSON.stringify(leitura));
    alert('Leitura salva com sucesso!');
}

function compartilharZap() {
    const text = `Meu Oráculo no sonheicom.com.br: ${currentUserData.nome}, minha trilha foi ${currentUserData.trilha}!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
}
