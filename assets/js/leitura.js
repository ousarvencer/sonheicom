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
function getMensagem(obj) {
    if (!obj) return null;
    return obj.mensagem_direta || obj.mensagem || null;
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

    // Emoção
    const emocao = (userData.detalhes?.emocao?.[0] || '').toLowerCase();
    if (['paz', 'alegria'].includes(emocao)) mente += 20;
    if (['medo', 'angústia', 'angustia', 'raiva'].includes(emocao)) mente -= 15;
    if (emocao === 'alegria') amor += 15;
    if (['raiva', 'angústia', 'angustia'].includes(emocao)) amor -= 10;

    // Situação amor
    const situAmor = (userData.detalhes?.amor?.[0] || '').toLowerCase();
    if (situAmor === 'bem') amor += 25;
    if (situAmor === 'mais ou menos') amor += 5;
    if (situAmor === 'mal') amor -= 20;

    // Situação finanças
    const situFin = (userData.detalhes?.financas?.[0] || '').toLowerCase();
    if (situFin === 'tranquilo') financas += 30;
    if (situFin === 'apertado') financas -= 10;
    if (situFin === 'crítico' || situFin === 'critico') financas -= 25;

    // Trilha amplifica o campo correspondente
    const trilha = (userData.trilha || '').toLowerCase();
    if (trilha === 'mente') mente += 15;
    if (trilha === 'amor') amor += 15;
    if (trilha === 'sorte') financas += 15;

    // Despertar
    const despertar = userData.detalhes?.despertar || [];
    if (despertar.some(d => ['LEVEZA', 'SENSAÇÃO DE PAZ'].includes(d))) mente += 10;
    if (despertar.some(d => ['SUOR FRIO', 'CORAÇÃO ACELERADO', 'PESO NO PEITO'].includes(d))) mente -= 10;

    // Clamp 0-100
    return {
        mente:    Math.min(100, Math.max(5, mente)),
        amor:     Math.min(100, Math.max(5, amor)),
        financas: Math.min(100, Math.max(5, financas))
    };
}

// ─── GERAÇÃO DA INTERPRETAÇÃO ─────────────────────────────────

function generateInterpretation(userData, symbols) {
    const simbolo = symbols[0] || {};
    const nome = userData.nome || 'Você';
    const detalhes = userData.detalhes || {};
    const trilha = (userData.trilha || 'significado').toLowerCase();

    const blocos = [];

    // 1. ABERTURA — mensagem_direta ou mensagem do símbolo
    const abertura = simbolo.mensagem_direta || simbolo.mensagem_directa || simbolo.mensagem
        || `${nome}, seu sonho com ${simbolo.simbolo || 'este símbolo'} carrega uma mensagem importante do seu inconsciente.`;
    blocos.push(abertura);

    // 2. TRILHA — leitura específica do símbolo
    const textoTrilha = getLeitura(simbolo, `trilha_${trilha}`);
    if (textoTrilha) blocos.push(textoTrilha);

    // Mensagem da trilha no JSON de apoio
    const dadosTrilha = LEITURA_DATA.trilhas?.[trilha];
    if (dadosTrilha) {
        const msgTrilha = getMensagem(dadosTrilha);
        if (msgTrilha) blocos.push(msgTrilha);
    }

    // 3. EMOÇÃO
    const emocaoKey = normalizar(detalhes.emocao?.[0] || '');
    const emocaoContexto = getContexto(simbolo, `com_${emocaoKey}`);
    if (emocaoContexto) blocos.push(emocaoContexto);

    const dadosEmocao = LEITURA_DATA.emocoes?.[emocaoKey];
    if (dadosEmocao) {
        const msgEmocao = getMensagem(dadosEmocao);
        if (msgEmocao) blocos.push(msgEmocao);
    }

    // 4. CENÁRIO
    const cenarioKey = normalizar(detalhes.cenario?.[0] || '');
    const cenarioContexto = getContexto(simbolo, `cenario_${cenarioKey}`);
    if (cenarioContexto) blocos.push(cenarioContexto);

    const dadosCenario = LEITURA_DATA.cenarios?.[cenarioKey];
    if (dadosCenario) {
        const msgCenario = getMensagem(dadosCenario);
        if (msgCenario) blocos.push(msgCenario);
    }

    // 5. PERÍODO (dia/noite)
    const periodoKey = normalizar(detalhes.periodo?.[0] || '');
    const periodoContexto = getContexto(simbolo, `de_${periodoKey}`);
    if (periodoContexto) blocos.push(periodoContexto);

    // 6. COR DO SONHO
    const corKey = normalizar(detalhes.cor_sonho?.[0] || '');
    if (corKey === 'colorido') {
        const txt = getContexto(simbolo, 'sonho_colorido');
        if (txt) blocos.push(txt);
    } else if (corKey.includes('branco')) {
        const txt = getContexto(simbolo, 'sonho_pb');
        if (txt) blocos.push(txt);
    }

    // 7. ESTADO DO DESPERTAR
    const despertar = detalhes.despertar || [];
    despertar.forEach(d => {
        const dKey = normalizar(d);
        const mapa = {
            'suor_frio':           'acordou_suor_frio',
            'coracao_acelerado':   'acordou_coracao_acelerado',
            'chorando':            'acordou_chorando',
            'sensacao_de_paz':     'acordou_aliviado',
            'peso_no_peito':       'acordou_confuso',
            'leveza':              'acordou_leveza'
        };
        const campo = mapa[dKey];
        if (campo) {
            const txt = getContexto(simbolo, campo);
            if (txt) blocos.push(txt);
        }
    });

    const estadoKey = normalizar(despertar[0] || '');
    const dadosDespertar = LEITURA_DATA.estadoDespertar?.[estadoKey];
    if (dadosDespertar) {
        const msgDespertar = getMensagem(dadosDespertar);
        if (msgDespertar) blocos.push(msgDespertar);
    }

    // 8. MEMÓRIA
    const memoriaKey = normalizar(detalhes.memoria?.[0] || '');
    const mapaMemoria = {
        'lembrei_tudo': 'lembrou_tudo',
        'fragmentos':   'lembrou_fragmentos',
        'quase_nada':   'nao_lembrava'
    };
    const memoriaContexto = getContexto(simbolo, mapaMemoria[memoriaKey]);
    if (memoriaContexto) blocos.push(memoriaContexto);

    const dadosMemoria = LEITURA_DATA.memoria?.[memoriaKey];
    if (dadosMemoria) {
        const msgMemoria = getMensagem(dadosMemoria);
        if (msgMemoria) blocos.push(msgMemoria);
    }

    // 9. RECORRÊNCIA
    const recorrenteKey = normalizar(detalhes.recorrente?.[0] || '');
    let recorrenteContexto = null;
    if (recorrenteKey === 'sim') {
        recorrenteContexto = getContexto(simbolo, 'frequente') || getContexto(simbolo, 'ja_sonhei');
    } else if (recorrenteKey === 'nao') {
        recorrenteContexto = getContexto(simbolo, 'primeira_vez');
    }
    if (recorrenteContexto) blocos.push(recorrenteContexto);

    const dadosRecorrencia = LEITURA_DATA.recorrencia?.[recorrenteKey];
    if (dadosRecorrencia) {
        const msgRec = getMensagem(dadosRecorrencia);
        if (msgRec) blocos.push(msgRec);
    }

    // 10. FASE DA LUA
    const lua = getMoonPhase(new Date());
    const luaKey = normalizar(lua.name);
    const luaContexto = simbolo.fase_lua?.[luaKey];
    if (luaContexto) blocos.push(luaContexto);

    const dadosLua = LEITURA_DATA.fasesLua?.[luaKey];
    if (dadosLua) {
        const msgLua = getMensagem(dadosLua);
        if (msgLua) blocos.push(msgLua);
    }

    // 11. SIGNO
    const signoNome = calcularSigno(userData.nascimento);
    if (signoNome && LEITURA_DATA.signos) {
        const dadosSigno = LEITURA_DATA.signos[signoNome];
        if (dadosSigno?.sonho) blocos.push(dadosSigno.sonho);
    }

    // 12. NUMEROLOGIA — caminho de vida
    const numCaminho = calcularCaminhoDeVida(userData.nascimento);
    if (numCaminho && LEITURA_DATA.numerologiaCaminho) {
        const dadosNum = LEITURA_DATA.numerologiaCaminho[String(numCaminho)];
        if (dadosNum?.sonho) blocos.push(dadosNum.sonho);
    }

    // 13. SITUAÇÃO AMOR
    const situAmorKey = normalizar(detalhes.amor?.[0] || '');
    const dadosSituAmor = LEITURA_DATA.situacaoAmor?.[situAmorKey];
    if (dadosSituAmor) {
        const msgAmor = dadosSituAmor.combinacao_sonho || getMensagem(dadosSituAmor);
        if (msgAmor) blocos.push(msgAmor);
    }

    // 14. SITUAÇÃO FINANÇAS
    const situFinKey = normalizar(detalhes.financas?.[0] || '');
    const dadosSituFin = LEITURA_DATA.situacaoFinancas?.[situFinKey];
    if (dadosSituFin) {
        const msgFin = dadosSituFin.combinacao_sonho || getMensagem(dadosSituFin);
        if (msgFin) blocos.push(msgFin);
    }

    // 15. ALERTA E AÇÃO RECOMENDADA do símbolo
    if (simbolo.alerta) blocos.push(`⚠ ${simbolo.alerta}`);
    if (simbolo.acao_recomendada) blocos.push(`→ ${simbolo.acao_recomendada}`);

    // Une os blocos em parágrafos, ignorando nulos/vazios
    const texto = blocos
        .filter(b => b && b.trim().length > 0)
        .join('\n\n');

    return { titulo: 'O QUE SEU SONHO DIZ', texto };
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
