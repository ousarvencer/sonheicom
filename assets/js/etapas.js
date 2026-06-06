// ============================================================
// etapas.js — dados e renderização de todas as etapas
// Responsabilidade: ETAPAS_DATA, PERGUNTAS, renderGrid,
// navegação entre sub-etapas e perguntas, hora do despertar
// ============================================================

// ─── DADOS DAS ETAPAS ────────────────────────────────────────

const ETAPAS_DATA = {
    pessoas: [
        "Mãe", "Pai", "Filho(a)", "Irmã", "Avó", "Avô",
        "Namorado(a)", "Ex", "Chefe", "Amigo(a)", "Amigo(a) de infância",
        "Estranho", "Pessoa falecida", "Eu mesmo",
        "Criança desconhecida", "Figura desconhecida",
        "Anjo / Entidade", "Demônio / Presença sombria",
        "Versão de mim mesmo", "Pessoa famosa",
        "Figura religiosa", "Velho(a) sábio(a)",
        "Bebê", "Desafeto / inimigo", "Gêmeo / sósia",
        "Médico", "Policial"
    ],
    animais: [
        "Cobra", "Cachorro", "Gato", "Cavalo", "Peixe",
        "Aranha", "Coelho", "Pássaro", "Abelha", "Touro",
        "Leão", "Rato", "Sapo", "Crocodilo", "Borboleta",
        "Lobo", "Águia", "Coruja", "Tubarão", "Elefante",
        "Dragão", "Unicórnio", "Fênix", "Sereia",
        "Lobisomem", "Criatura das trevas", "Animal gigante", 
        "Barata", "Pomba", "Gato preto"
    ],
    lugares: [
        "Mar", "Casa", "Igreja", "Hospital", "Escola",
        "Floresta", "Cemitério", "Festa", "Rua", "Montanha",
        "Lugar desconhecido", "Casa da infância",
        "Praia", "Trabalho", "Quarto", "Prisão", "Ponte", "Aeroporto",
        "Céu / Paraíso", "Inferno", "Caverna",
        "Ruínas antigas", "Castelo", "Labirinto", "Lugar que não existe",
        "Prédio alto", "Túnel", "Subterrâneo", "Deserto",
        "Espaço sideral", "Favela", "Shopping", "Banco / agência"
    ],
    situacoes: [
        "Queda", "Voar", "Perseguição", "Briga", "Traição",
        "Abandono", "Sexo", "Casamento", "Morte", "Gravidez",
        "Acidente", "Estar nu",
        "Estar perdido", "Perder algo importante", "Afogamento",
        "Encontrar dinheiro", "Ser traído", "Chegar atrasado",
        "Ressurreição", "Viagem no tempo", "Mundo paralelo",
        "Fim do mundo", "Ser observado", "Transformação do corpo",
        "Falar com mortos",
        "Ser roubado", "Ser assaltado", "Dentes caindo",
        "Carro descontrolado", "Avião caindo", "Naufrágio",
        "Paralisia", "Sufocamento", "Ser preso injustamente",
        "Trair alguém", "Reprovar em prova", "Passar em prova",
        "Perder emprego", "Conseguir emprego", "Perder dinheiro",
        "Ganhar dinheiro", "Discussão violenta", "Reconciliação",
        "Separação", "Velório / funeral", "Renascer"
    ],
    objetos: [
        "Dinheiro", "Chave", "Espelho", "Celular", "Faca",
        "Sangue", "Porta", "Vela", "Anel", "Arma", "Carro", "Dente",
        "Relógio", "Escada", "Livro", "Água", "Fogo", "Cruz", "Ponte",
        "Cristal", "Poção", "Portal", "Caveira",
        "Altar", "Pergaminho", "Talismã",
        "Chuva", "Tempestade", "Luz intensa", "Escuridão total",
        "Número", "Documento / contrato"
    ]
};

// ─── PERGUNTAS DA ETAPA 3 ─────────────────────────────────────
// Ordem: emoção → período → cor → cenário → despertar → memória → amor → finanças → hora
// Removida: cor_dominante (9 cores)
// Adicionada: cenario (claro/nebuloso/ameaçador/pacífico)
// Hora expandida para 48 opções (00h00 a 23h30)

const PERGUNTAS = [
    {
        key: 'emocao',
        titulo: 'SOBRE O SONHO',
        subtitulo: 'como você se sentiu?',
        opcoes: ['MEDO', 'ALEGRIA', 'ANGÚSTIA', 'CONFUSÃO', 'PAZ', 'RAIVA'],
        multiplo: false
    },
    {
        key: 'periodo',
        titulo: 'O CENÁRIO',
        subtitulo: 'era dia ou noite no sonho?',
        opcoes: ['DIA', 'NOITE', 'NÃO LEMBRO'],
        multiplo: false
    },
    {
        key: 'cor_sonho',
        titulo: 'AS CORES',
        subtitulo: 'o sonho era colorido?',
        opcoes: ['COLORIDO', 'PRETO E BRANCO', 'NÃO LEMBRO'],
        multiplo: false
    },
    {
        key: 'cenario',
        titulo: 'O AMBIENTE',
        subtitulo: 'como era o cenário do sonho?',
        opcoes: ['CLARO', 'NEBULOSO', 'AMEAÇADOR', 'PACÍFICO'],
        multiplo: false
    },
    {
        key: 'despertar',
        titulo: 'O DESPERTAR',
        subtitulo: 'como você acordou?',
        opcoes: ['SUOR FRIO', 'CORAÇÃO ACELERADO', 'CHORANDO', 'SENSAÇÃO DE PAZ', 'PESO NO PEITO', 'LEVEZA'],
        multiplo: true
    },
    {
        key: 'recorrente',
        titulo: 'A MEMÓRIA',
        subtitulo: 'já sonhou com isso antes?',
        opcoes: ['SIM', 'NÃO', 'NÃO LEMBRO'],
        multiplo: false
    },
    {
        key: 'memoria',
        titulo: 'A MEMÓRIA',
        subtitulo: 'o quanto você lembra do sonho?',
        opcoes: ['LEMBREI TUDO', 'FRAGMENTOS', 'QUASE NADA'],
        multiplo: false
    },
    {
        key: 'amor',
        titulo: 'SOBRE VOCÊ HOJE',
        subtitulo: 'como está o amor?',
        opcoes: ['BEM', 'MAIS OU MENOS', 'MAL'],
        multiplo: false
    },
    {
        key: 'financas',
        titulo: 'SOBRE VOCÊ HOJE',
        subtitulo: 'como estão as finanças?',
        opcoes: ['TRANQUILO', 'APERTADO', 'CRÍTICO'],
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

// ─── HORA DO DESPERTAR ────────────────────────────────────────
// 48 opções: 00h00 até 23h30 em intervalos de 30 minutos

const horasOpcoes = (() => {
    const horas = [];
    for (let h = 0; h < 24; h++) {
        horas.push(`${String(h).padStart(2, '0')}h00`);
        horas.push(`${String(h).padStart(2, '0')}h30`);
    }
    return horas;
})();

let horaIdx = 0;

function spinHora(dir) {
    horaIdx = (horaIdx + dir + horasOpcoes.length) % horasOpcoes.length;
    document.getElementById('val-hora').textContent = horasOpcoes[horaIdx];
}

// ─── SUB-ETAPAS (Etapa 2) ─────────────────────────────────────

const subEtapas = ['pessoas', 'animais', 'lugares', 'situacoes', 'objetos'];

const SUBTITULOS = {
    pessoas: 'quem estava no seu sonho?',
    animais: 'alguma criatura cruzou seu caminho?',
    lugares: 'onde você estava?',
    situacoes: 'o que aconteceu?',
    objetos: 'o que você viu ou tocou?'
};

let currentSubEtapa = 0;

function startSubEtapas() {
    currentSubEtapa = 0;
    renderSubEtapa();
}

function renderSubEtapa() {
    const key = subEtapas[currentSubEtapa];
    const progressBar = document.getElementById('progress-bar');
    progressBar.style.width = `${((currentSubEtapa + 1) / subEtapas.length) * 100}%`;

    document.getElementById('sub-etapa-title').textContent = key.toUpperCase();
    document.getElementById('sub-etapa-subtitulo').textContent = SUBTITULOS[key];
    document.getElementById('btn-proximo').textContent = 'PULAR →';

    renderGrid('grid-sub-etapa', ETAPAS_DATA[key]);
}

function nextSubEtapa() {
    const selected = Array.from(document.querySelectorAll('#grid-sub-etapa .selected')).map(c => c.textContent.trim());
    window.currentUserData.selecoes[subEtapas[currentSubEtapa]] = selected;
    currentSubEtapa++;
    if (currentSubEtapa < subEtapas.length) {
        renderSubEtapa();
    } else {
        showEtapa(3);
        startEtapa3();
    }
}

// ─── PERGUNTAS (Etapa 3) ──────────────────────────────────────

const naipes = ['♠', '♥', '♦', '♣'];
let currentPergunta = 0;

function startEtapa3() {
    currentPergunta = 0;
    horaIdx = 0;
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
        window.currentUserData.detalhes['hora'] = horasOpcoes[horaIdx];
    } else {
        const selected = Array.from(document.querySelectorAll('#etapa3-grid .selected')).map(c => c.textContent.trim());
        window.currentUserData.detalhes[p.key] = p.multiplo ? selected : (selected[0] || '');
    }

    currentPergunta++;
    if (currentPergunta < PERGUNTAS.length) {
        renderPergunta();
        window.scrollTo(0, 0);
    } else {
        revelarOraculo();
    }
}

// ─── RENDERIZAÇÃO DE GRID ─────────────────────────────────────

function renderGrid(containerId, items, multiple = true) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    items.forEach(item => {
        const card = document.createElement('div');
        const naipe = naipes[Math.floor(Math.random() * naipes.length)];
        card.className = 'card';
        card.textContent = item;
        card.style.setProperty('--naipe', `"${naipe}"`);
        card.onclick = () => {
            if (multiple) {
                card.classList.toggle('selected');
            } else {
                container.querySelectorAll('.card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
            }
            const temSelecionado = container.querySelectorAll('.selected').length > 0;
            const btn = document.getElementById('btn-proximo');
            if (btn) {
                btn.textContent = temSelecionado ? 'PRÓXIMO →' : 'PULAR →';
                btn.classList.toggle('ativo', temSelecionado);
            }
            updateButtons();
        };
        container.appendChild(card);
    });
}

// ─── HELPERS DE SELEÇÃO (usados externamente se necessário) ───

function selecionarUnico(card, grupo) {
    document.querySelectorAll(`[data-group="${grupo}"]`).forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
}

function selecionarMultiplo(card, grupo, max) {
    const selecionados = document.querySelectorAll(`[data-group="${grupo}"].selected`);
    if (card.classList.contains('selected')) {
        card.classList.remove('selected');
    } else if (selecionados.length < max) {
        card.classList.add('selected');
    }
}
