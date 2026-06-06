// ============================================================
// leitura.js — geração do resultado personalizado
// Responsabilidade: cruzar símbolo + trilha + contextos +
// fase da lua + signo + numerologia + barras de status
// ============================================================

// ─── FETCH DOS JSONs DE APOIO ─────────────────────────────────

let LEITURA_DATA = {};

(async function carregarJsonsApoio() {
    const arquivos = {
        emocoes:          './data/emocoes.json',
        trilhas:          './data/trilhas.json',
        situacaoAmor:     './data/situacao-amor.json',
        situacaoFinancas: './data/situacao-financas.json',
        cenarios:         './data/cenarios.json',
        periodos:         './data/periodos.json',
        memoria:          './data/memoria.json',
        fasesLua:         './data/fases-lua.json',
        estadoDespertar:  './data/estado-despertar.json',
        recorrencia:      './data/recorrencia.json',
        signos:           './data/signos.json',
        numerologiaCaminho: './data/numerologia-caminho.json'
    };

    const entries = Object.entries(arquivos);
    const resultados = await Promise.allSettled(
        entries.map(([, url]) => fetch(url).then(r => r.json()))
    );

    resultados.forEach((res, i) => {
        const key = entries[i][0];
        if (res.status === 'fulfilled') {
            LEITURA_DATA[key] = res.value;
        } else {
            console.warn(`leitura.js: falha ao carregar ${entries[i][1]}`);
            LEITURA_DATA[key] = {};
        }
    });
})();

// ─── HELPERS ─────────────────────────────────────────────────

// Busca mensagem_direta ou mensagem em um objeto de apoio
function getMensagem(obj, contextoSimbolo) {
    if (!obj) return null;
    const partes = [
        obj.mensagem_direta,
        obj.combinacao_simbolo && contextoSimbolo
            ? `${obj.combinacao_simbolo} (${contextoSimbolo})`
            : obj.combinacao_simbolo,
        obj.descricao_sonho,
        obj.significado_psicologico,
        obj.impacto_leitura,
        obj.mensagem
    ].filter(Boolean);
    return partes.length ? partes.join('\n\n') : null;
}

// Busca campo dentro de simbolo.contextos com fallback silencioso
function getContexto(simbolo, campo) {
    return (simbolo.contextos && simbolo.contextos[campo]) || null;
}

// Busca dentro de simbolo.leituras ou simbolo.leitures (typo nos JSONs)
function getLeitura(simbolo, campo) {
    const base = simbolo.leituras || simbolo.leitures || {};
    return base[campo] || null;
}

// Normaliza string para chave de JSON (minúsculo, sem acento, sem espaço)
function val(campo) {
    return Array.isArray(campo) ? campo[0] : campo || '';
}

function normalizar(str) {
    if (!str) return '';
    return str.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9_]/g, '_')
        .replace(/_+/g, '_')
        .trim();
}

// ─── SIGNO ───────────────────────────────────────────────────

function calcularSigno(nascimento) {
    if (!nascimento) return null;
    // nascimento esperado: "DD/MM/AAAA" ou "AAAA-MM-DD"
    let dia, mes;
    if (nascimento.includes('/')) {
        [dia, mes] = nascimento.split('/').map(Number);
    } else {
        const partes = nascimento.split('-');
        mes = Number(partes[1]);
        dia = Number(partes[2]);
    }
    if (!dia || !mes) return null;

    const signos = [
        { nome: 'Capricórnio', fim: [1, 19] },
        { nome: 'Aquário',     fim: [2, 18] },
        { nome: 'Peixes',      fim: [3, 20] },
        { nome: 'Áries',       fim: [4, 19] },
        { nome: 'Touro',       fim: [5, 20] },
        { nome: 'Gêmeos',      fim: [6, 20] },
        { nome: 'Câncer',      fim: [7, 22] },
        { nome: 'Leão',        fim: [8, 22] },
        { nome: 'Virgem',      fim: [9, 22] },
        { nome: 'Libra',       fim: [10, 22] },
        { nome: 'Escorpião',   fim: [11, 21] },
        { nome: 'Sagitário',   fim: [12, 21] },
        { nome: 'Capricórnio', fim: [12, 31] }
    ];

    for (const s of signos) {
        if (mes < s.fim[0] || (mes === s.fim[0] && dia <= s.fim[1])) {
            return s.nome;
        }
    }
    return 'Capricórnio';
}

// ─── NUMEROLOGIA ─────────────────────────────────────────────

function calcularCaminhoDeVida(nascimento) {
    if (!nascimento) return null;
    const digits = nascimento.replace(/\D/g, '');
    let soma = digits.split('').reduce((acc, d) => acc + Number(d), 0);
    while (soma > 9 && soma !== 11 && soma !== 22 && soma !== 33) {
        soma = String(soma).split('').reduce((acc, d) => acc + Number(d), 0);
    }
    return soma;
}

// ─── BARRAS DE STATUS ─────────────────────────────────────────
// Retorna { mente, amor, financas } de 0 a 100

function calcularStatus(userData, simbolo) {
    let mente = 50, amor = 50, financas = 50;

    // ── ELEMENTO DO SÍMBOLO (peso alto) ──────────────────────
    const elemento = (simbolo.elemento || '').toLowerCase();
    if (elemento === 'água')   { amor += 15; mente += 10; }
    if (elemento === 'fogo')   { financas += 15; mente -= 5; }
    if (elemento === 'terra')  { financas += 10; amor += 5; }
    if (elemento === 'ar')     { mente += 15; }

    // ── NUMEROLOGIA DO SÍMBOLO (peso médio) ──────────────────
    const numSimbolo = simbolo.numerologia?.numero_simbolo || 0;
    if ([2, 6, 9].includes(numSimbolo)) amor += 10;
    if ([1, 8].includes(numSimbolo))    financas += 10;
    if ([7, 11].includes(numSimbolo))   mente += 10;

    // ── FASE DA LUA (peso médio) ──────────────────────────────
    const lua = getMoonPhase(new Date());
    const luaKey = normalizar(lua.name);
    if (luaKey === 'cheia')     { amor += 12; mente += 8; }
    if (luaKey === 'crescente') { financas += 12; mente += 5; }
    if (luaKey === 'nova')      { mente += 10; financas += 5; }
    if (luaKey === 'minguante') { mente += 8; amor -= 5; financas -= 5; }

    // ── EMOÇÃO DO SONHO (peso alto) ───────────────────────────
    const emocao = normalizar(userData.detalhes?.emocao?.[0] || '');
    if (['paz', 'alegria'].includes(emocao))                    { mente += 18; amor += 10; }
    if (['medo', 'angustia', 'raiva'].includes(emocao))         { mente -= 12; amor -= 8; }
    if (emocao === 'alegria')                                     amor += 8;
    if (['raiva', 'angustia'].includes(emocao))                   financas -= 8;

    // ── DESPERTAR (peso médio) ────────────────────────────────
    const despertar = userData.detalhes?.despertar || [];
    const dNorm = despertar.map(d => normalizar(d));
    if (dNorm.some(d => ['leveza', 'sensacao_de_paz'].includes(d)))           { mente += 12; amor += 8; }
    if (dNorm.some(d => ['suor_frio', 'coracao_acelerado', 'peso_no_peito'].includes(d))) { mente -= 10; }
    if (dNorm.includes('chorando'))   { amor -= 8; mente -= 5; }
    if (dNorm.includes('aliviado'))   { mente += 8; amor += 5; }

    // ── RECORRÊNCIA (peso médio) ──────────────────────────────
    const recorrente = normalizar(userData.detalhes?.recorrente?.[0] || '');
    if (recorrente === 'sim') mente -= 10;
    if (recorrente === 'nao') mente += 5;

    // ── PERÍODO DO SONHO (peso leve) ─────────────────────────
    const periodo = normalizar(userData.detalhes?.periodo?.[0] || '');
    if (periodo === 'noite' || periodo === 'madrugada') mente += 5;
    if (periodo === 'dia') financas += 5;

    // ── SITUAÇÃO DECLARADA (peso secundário — 30%) ────────────
    const situAmor = normalizar(userData.detalhes?.amor?.[0] || '');
    if (situAmor === 'bem')           amor += 10;
    if (situAmor === 'mais_ou_menos') amor += 3;
    if (situAmor === 'mal')           amor -= 8;

    const situFin = normalizar(userData.detalhes?.financas?.[0] || '');
    if (situFin === 'tranquilo')             financas += 12;
    if (situFin === 'apertado')              financas -= 5;
    if (situFin === 'critico')               financas -= 10;

    // ── TRILHA AMPLIFICA (peso médio) ────────────────────────
    const trilha = (userData.trilha || '').toLowerCase();
    if (trilha === 'mente')      mente    += 15;
    if (trilha === 'amor')       amor     += 15;
    if (trilha === 'sorte')      financas += 15;
    if (trilha === 'significado') { mente += 5; amor += 5; financas += 5; }

    // ── CLAMP 0-100 ───────────────────────────────────────────
    return {
        mente:    Math.min(100, Math.max(5, mente)),
        amor:     Math.min(100, Math.max(5, amor)),
        financas: Math.min(100, Math.max(5, financas))
    };
}

// ─── GERAÇÃO DA INTERPRETAÇÃO ─────────────────────────────────

function generateInterpretation(userData, symbols) {
    const simbolo = symbols[0] || {};
    const todosSimbolos = symbols.filter(s => s && s.simbolo);
    const nome = userData.nome || 'Você';
    const detalhes = userData.detalhes || {};
    const trilha = (userData.trilha || 'significado').toLowerCase();

    // ── COLETA DE DADOS ───────────────────────────────────────

    const emocaoKey     = normalizar(val(detalhes.emocao));
    const cenarioKey    = normalizar(val(detalhes.cenario));
    const periodoKey    = normalizar(val(detalhes.periodo));
    const corKey        = normalizar(val(detalhes.cor_sonho));
    const memoriaKey    = normalizar(val(detalhes.memoria));
    const recorrenteKey = normalizar(val(detalhes.recorrente));
    const despertar     = detalhes.despertar || [];
    const situAmorKey   = normalizar(val(detalhes.amor));
    const situFinKey    = normalizar(val(detalhes.financas));

    const lua        = getMoonPhase(new Date());
    const luaKey     = normalizar(lua.name);
    const signoNome  = calcularSigno(userData.nascimento);
    const numCaminho = calcularCaminhoDeVida(userData.nascimento);

    // helpers locais
    const ctx  = (campo) => getContexto(simbolo, campo);
    const leit = (campo) => getLeitura(simbolo, campo);
    const junta = (...partes) => partes.filter(p => p && p.trim()).join('\n\n');

    // ── SEÇÃO 1 — MENSAGEM CENTRAL ────────────────────────────
    // Foco: símbolo + trilha + emoção. Varia por trilha.

    const abertura = simbolo.mensagem_direta
        || `${nome}, seu sonho com ${simbolo.simbolo || 'este símbolo'} carrega uma mensagem do seu inconsciente.`;

    const textoTrilha  = leit(`trilha_${trilha}`) || '';
    const msgTrilhaApoio = getMensagem(LEITURA_DATA.trilhas?.[trilha]) || '';
    const emocaoCtx    = ctx(`com_${emocaoKey}`) || '';
    const msgEmocao = getMensagem(LEITURA_DATA.emocoes?.[emocaoKey], simbolo.simbolo) || '';

    // Mensagens adicionais dos outros símbolos
    const mensagensAdicionais = todosSimbolos.slice(1)
        .map(s => s.mensagem_direta || '')
        .filter(Boolean)
        .join('\n\n');

    const secao1 = {
        titulo: 'A MENSAGEM DA CIGANA',
        texto: junta(abertura, mensagensAdicionais, textoTrilha, msgTrilhaApoio, emocaoCtx, msgEmocao)
    };

    // ── SEÇÃO 2 — PSICOLOGIA E MITOLOGIA ─────────────────────
    // Foco: profundidade interpretativa. Sempre presente.

    const jung   = simbolo.psicologia?.jung || '';
    const freud  = simbolo.psicologia?.freud || '';
    const moderna = simbolo.psicologia?.interpretacao_moderna || '';

    const mitPartes = [];
    if (simbolo.mitologia?.grega)            mitPartes.push(`Grécia: ${simbolo.mitologia.grega}`);
    if (simbolo.mitologia?.indigena_brasileira) mitPartes.push(`Tradição brasileira: ${simbolo.mitologia.indigena_brasileira}`);
    if (simbolo.mitologia?.egipcia)          mitPartes.push(`Egito: ${simbolo.mitologia.egipcia}`);

    const chakra = simbolo.chakra
        ? `Chakra ${simbolo.chakra.nome} (${simbolo.chakra.sanskrito}) — ${simbolo.chakra.significado}`
        : '';

    // Psicologia e mitologia de todos os símbolos
    const psicologiaExtra = todosSimbolos.slice(1).map(s => {
        const partes = [];
        if (s.psicologia?.jung)  partes.push(`${s.simbolo.toUpperCase()} — ${s.psicologia.jung}`);
        if (s.mitologia?.indigena_brasileira) partes.push(`Tradição brasileira: ${s.mitologia.indigena_brasileira}`);
        return partes.join('\n');
    }).filter(Boolean).join('\n\n───\n\n');

    const secao2 = {
        titulo: 'O QUE A PSICOLOGIA DIZ',
        texto: junta(jung, freud, moderna, mitPartes.join('\n'), chakra, psicologiaExtra)
    };

    // ── SEÇÃO 3 — CONTEXTO DO SONHO ──────────────────────────
    // Foco: como o sonho aconteceu. Período, cor, cenário, despertar, memória, recorrência.

    const periodoCtx  = ctx(`de_${periodoKey}`) || '';
    const cenarioCtx  = ctx(`cenario_${cenarioKey}`) || '';
    const msgCenario  = getMensagem(LEITURA_DATA.cenarios?.[cenarioKey]) || '';

    let corCtx = '';
    if (corKey === 'colorido')           corCtx = ctx('sonho_colorido') || '';
    else if (corKey.includes('branco'))  corCtx = ctx('sonho_pb') || '';

    const mapaDespertar = {
        'suor_frio':        'acordou_suor_frio',
        'coracao_acelerado':'acordou_coracao_acelerado',
        'chorando':         'acordou_chorando',
        'sensacao_de_paz':  'acordou_aliviado',
        'peso_no_peito':    'acordou_confuso',
        'leveza':           'acordou_leveza'
    };
    const despertarTextos = despertar
        .map(d => ctx(mapaDespertar[normalizar(d)]))
        .filter(Boolean);
    const msgDespertar = getMensagem(LEITURA_DATA.estadoDespertar?.[normalizar(despertar[0] || '')]) || '';

    const mapaMemoria = {
        'lembrei_tudo': 'lembrou_tudo',
        'fragmentos':   'lembrou_fragmentos',
        'quase_nada':   'nao_lembrava'
    };
    const memoriaCtx  = ctx(mapaMemoria[memoriaKey]) || '';
    const msgMemoria  = getMensagem(LEITURA_DATA.memoria?.[memoriaKey]) || '';

    let recorrenteCtx = '';
    if (recorrenteKey === 'sim') recorrenteCtx = ctx('frequente') || ctx('ja_sonhei') || '';
    if (recorrenteKey === 'nao') recorrenteCtx = ctx('primeira_vez') || '';
    const msgRecorrencia = getMensagem(LEITURA_DATA.recorrencia?.[recorrenteKey]) || '';

    const sonoTexto = simbolo.sono
        ? `${simbolo.sono.fase_tipica} — ${simbolo.sono.significado_sono}`
        : '';

    const secao3 = {
        titulo: 'O CONTEXTO DO SEU SONHO',
        texto: junta(
            periodoCtx, cenarioCtx, msgCenario, corCtx,
            ...despertarTextos, msgDespertar,
            memoriaCtx, msgMemoria,
            recorrenteCtx, msgRecorrencia,
            sonoTexto
        )
    };

    // ── SEÇÃO 4 — ASTROS E NUMEROLOGIA ────────────────────────
    // Foco: lua, signo, caminho de vida, numerologia do símbolo.

    const luaCtxSimbolo = simbolo.fase_lua?.[luaKey] || '';
    const msgLua        = getMensagem(LEITURA_DATA.fasesLua?.[luaKey]) || '';
    const msgSigno      = (signoNome && LEITURA_DATA.signos?.[signoNome]?.sonho) || '';
    const msgNumCaminho = (numCaminho && LEITURA_DATA.numerologiaCaminho?.[String(numCaminho)]?.sonho) || '';
    const numSimbolo    = simbolo.numerologia
        ? `Número do símbolo: ${simbolo.numerologia.numero_simbolo} — ${simbolo.numerologia.significado_numero}`
        : '';

    const secao4 = {
        titulo: 'OS ASTROS DESTA NOITE',
        texto: junta(
            `Lua ${lua.name}: ${lua.description}`,
            luaCtxSimbolo, msgLua,
            signoNome ? `${signoNome}: ${msgSigno}` : '',
            msgNumCaminho,
            numSimbolo
        )
    };

    // ── SEÇÃO 5 — AMOR E FINANÇAS (contexto de vida) ──────────
    // Foco: situação declarada cruzada com o símbolo.

    const dadosAmor = LEITURA_DATA.situacaoAmor?.[situAmorKey];
    const msgSituAmor = dadosAmor
        ? [
            dadosAmor.impacto_leitura,
            dadosAmor.mensagem_adicional
          ].filter(Boolean).join('\n\n')
        : '';

    const dadosFin = LEITURA_DATA.situacaoFinancas?.[situFinKey];
    const msgSituFin = dadosFin
        ? [
            dadosFin.impacto_leitura,
            dadosFin.mensagem_adicional
          ].filter(Boolean).join('\n\n')
        : '';

    const secao5 = {
        titulo: 'COMO VOCÊ ESTÁ',
        texto: junta(msgSituAmor, msgSituFin)
    };

    // ── SEÇÃO 6 — RECOMENDAÇÃO FINAL ─────────────────────────
    // Foco: alerta + ação. Sempre presente.

    const recomendacoesExtra = todosSimbolos.slice(1).map(s =>
        junta(s.alerta || '', s.acao_recomendada || '')
    ).filter(Boolean).join('\n\n───\n\n');

    const secao6 = {
        titulo: 'A RECOMENDAÇÃO',
        texto: junta(
            simbolo.alerta || '',
            simbolo.acao_recomendada || '',
            recomendacoesExtra
        )
    };

    // ── ORDEM POR TRILHA ──────────────────────────────────────

    const ordens = {
        significado: [secao1, secao2, secao3, secao4, secao5, secao6],
        amor:        [secao1, secao5, secao3, secao4, secao2, secao6],
        mente:       [secao1, secao3, secao2, secao4, secao5, secao6],
        sorte:       [secao1, secao4, secao5, secao3, secao2, secao6]
    };

    return ordens[trilha] || ordens.significado;
}

// ─── JOGO DO BICHO ────────────────────────────────────────────

function getBichoData(simbolo) {
    if (simbolo && simbolo.jogo_bicho) return simbolo.jogo_bicho;
    return {
        grupo: '00',
        animal: 'Sorte',
        dezenas: ['00'],
        milhar_sugerido: '0000'
    };
}
