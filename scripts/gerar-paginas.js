/**
 * gerar-paginas.js — SonheiCom
 * Gera páginas HTML estáticas para SEO em /sonhos/
 * Uso: node scripts/gerar-paginas.js
 */

const fs   = require('fs');
const path = require('path');

// ── Configuração ──────────────────────────────────────────────
const BASE_URL    = 'https://sonheicom.com.br';
const OUT_DIR     = path.resolve(__dirname, '../sonhos');
const SIMBOLOS_DIR = path.resolve(__dirname, '../data/simbolos');

const AMAZON_LINK = 'https://amzn.to/4vrU5Ge';

// Arquivos de símbolos a processar
const ARQUIVOS_SIMBOLOS = [
  'animais.json',
  'pessoas.json',
  'lugares.json',
  'situacoes.json',
  'objetos.json',
];

// Emoções disponíveis (chaves do objeto emocoes no JSON)
const EMOCOES = ['medo', 'alegria', 'angustia', 'confusao', 'paz', 'raiva'];

// Fases da lua
const FASES_LUA = ['nova', 'crescente', 'cheia', 'minguante'];

// Períodos
const PERIODOS = ['de-noite', 'de-dia'];
const PERIODO_KEY = { 'de-noite': 'de_noite', 'de-dia': 'de_dia' };

// Cenários
const CENARIOS = ['pacifico', 'nebuloso', 'claro', 'ameacador'];
const CENARIO_KEY = {
  'pacifico':   'cenario_pacifico',
  'nebuloso':   'cenario_nebuloso',
  'claro':      'cenario_claro',
  'ameacador':  'cenario_ameacador',
};

// Trilhas
const TRILHAS = ['significado', 'sorte', 'amor', 'mente'];
const TRILHA_KEY = {
  'significado': 'trilha_significado',
  'sorte':       'trilha_sorte',
  'amor':        'trilha_amor',
  'mente':       'trilha_mente',
};

// ── Helpers ───────────────────────────────────────────────────

function slugify(str) {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function emoLabel(key) {
  const map = {
    medo: 'Medo', alegria: 'Alegria', angustia: 'Angústia',
    confusao: 'Confusão', paz: 'Paz', raiva: 'Raiva',
  };
  return map[key] || capitalize(key);
}

function faseLabel(key) {
  const map = { nova: 'Lua Nova', crescente: 'Lua Crescente', cheia: 'Lua Cheia', minguante: 'Lua Minguante' };
  return map[key] || capitalize(key);
}

function periodoLabel(key) {
  return key === 'de-noite' ? 'De Noite' : 'De Dia';
}

function cenarioLabel(key) {
  const map = { pacifico: 'Pacífico', nebuloso: 'Nebuloso', claro: 'Claro', ameacador: 'Ameaçador' };
  return map[key] || capitalize(key);
}

function trilhaLabel(key) {
  const map = { significado: 'Significado', sorte: 'Sorte', amor: 'Amor', mente: 'Mente' };
  return map[key] || capitalize(key);
}

// ── Template HTML ─────────────────────────────────────────────

function renderPage({ slug, titulo, descricao, keywords, canonical, conteudo, simboloNome }) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>${titulo} | sonheicom.com.br</title>
  <meta name="description" content="${descricao}">
  <meta name="keywords" content="${keywords}">
  <meta name="robots" content="index, follow">
  <meta name="author" content="sonheicom.com.br">
  <meta property="og:title" content="${titulo}">
  <meta property="og:description" content="${descricao}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${BASE_URL}/sonhos/${slug}">
  <meta property="og:image" content="${BASE_URL}/assets/og-image.jpg">
  <meta property="og:locale" content="pt_BR">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${titulo}">
  <meta name="twitter:description" content="${descricao}">
  <meta name="twitter:image" content="${BASE_URL}/assets/og-image.jpg">
  <link rel="canonical" href="${BASE_URL}/sonhos/${slug}">
  <link rel="icon" type="image/svg+xml" href="/assets/sonheicom-favicon.svg">
  <link rel="stylesheet" href="/assets/css/base.css">
  <link rel="stylesheet" href="/assets/css/components.css">
  <link rel="stylesheet" href="/assets/css/animations.css">
  <style>
    .page-content { max-width: 680px; margin: 0 auto; padding: 0 16px 60px; }
    .page-content h1 { font-family: var(--font-pixel); font-size: 13px; color: var(--gold-color); text-align: center; line-height: 1.8; margin: 32px 0 8px; letter-spacing: 2px; text-transform: uppercase; }
    .page-content .subtitulo { font-family: var(--font-pixel); font-size: 8px; color: var(--text-dim); text-align: center; margin-bottom: 32px; letter-spacing: 1px; }
    .bloco { background: var(--bg-secondary); border: 1px solid var(--border-color); padding: 20px 20px; margin-bottom: 16px; }
    .bloco-titulo { font-family: var(--font-pixel); font-size: 8px; color: var(--gold-color); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px; display: block; }
    .bloco-texto { font-family: var(--font-pixel); font-size: 9px; color: var(--text-color); line-height: 2; text-transform: uppercase; }
    .bloco-texto p { margin-bottom: 10px; }
    .fase-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px; }
    .fase-item { background: var(--bg-primary); border: 1px solid var(--border-color); padding: 12px; }
    .fase-nome { font-family: var(--font-pixel); font-size: 7px; color: var(--gold-color); display: block; margin-bottom: 6px; letter-spacing: 1px; }
    .fase-desc { font-family: var(--font-pixel); font-size: 7px; color: var(--text-dim); line-height: 1.8; text-transform: uppercase; }
    .bicho-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-top: 10px; }
    .bicho-item { background: var(--bg-primary); border: 1px solid var(--border-color); padding: 10px; text-align: center; }
    .bicho-label { font-family: var(--font-pixel); font-size: 7px; color: var(--text-dim); display: block; margin-bottom: 4px; }
    .bicho-val { font-family: var(--font-pixel); font-size: 10px; color: var(--gold-color); }
    .cta-box { background: var(--bg-secondary); border: 2px solid var(--gold-color); padding: 24px 20px; text-align: center; margin: 32px 0; }
    .cta-titulo { font-family: var(--font-pixel); font-size: 9px; color: var(--gold-color); margin-bottom: 12px; line-height: 1.8; display: block; text-transform: uppercase; }
    .cta-sub { font-family: var(--font-pixel); font-size: 7px; color: var(--text-dim); margin-bottom: 20px; display: block; text-transform: uppercase; }
    .cta-btn { font-family: var(--font-pixel); font-size: 9px; background: var(--highlight-color); color: #fff; border: none; padding: 14px 24px; cursor: pointer; text-decoration: none; display: inline-block; }
    .amazon-banner { font-family: var(--font-pixel); background: var(--bg-secondary); border: 2px solid var(--border-color); padding: 15px 24px; display: flex; align-items: center; justify-content: space-between; gap: 16px; position: relative; overflow: hidden; margin: 30px 0; }
    .amazon-banner::before { content: ''; position: absolute; inset: 0; background-image: radial-gradient(1px 1px at 10% 20%, #9b30ff55 0%, transparent 100%), radial-gradient(1px 1px at 80% 80%, #ffd70022 0%, transparent 100%); pointer-events: none; }
    .amazon-banner-left { flex: 1; position: relative; z-index: 1; }
    .amazon-banner-tag { font-size: 7px; color: var(--gold-color); letter-spacing: 2px; margin-bottom: 10px; display: block; }
    .amazon-banner-title { font-size: 11px; color: var(--text-color); line-height: 1.8; margin-bottom: 6px; }
    .amazon-banner-sub { font-size: 7px; color: var(--text-dim); line-height: 1.8; }
    .amazon-banner-icon { font-size: 28px; position: relative; z-index: 1; flex-shrink: 0; }
    .amazon-banner-btn { font-family: var(--font-pixel); font-size: 8px; background: var(--highlight-color); color: #fff; border: none; padding: 12px 16px; cursor: pointer; white-space: nowrap; position: relative; z-index: 1; line-height: 1.6; text-decoration: none; display: inline-block; flex-shrink: 0; }
    .amazon-banner-btn:hover { background: var(--highlight-dim); }
    .breadcrumb { font-family: var(--font-pixel); font-size: 7px; color: var(--text-dim); text-align: center; margin-bottom: 24px; letter-spacing: 1px; text-transform: uppercase; }
    .breadcrumb a { color: var(--gold-color); text-decoration: none; }
    .footer-legal { text-align: center; padding: 20px 0 40px; }
    .footer-legal p { font-family: var(--font-pixel); font-size: 7px; color: var(--text-dim); line-height: 2; text-transform: uppercase; }
    .footer-legal nav { margin-top: 10px; }
    .footer-legal nav a { font-family: var(--font-pixel); font-size: 7px; color: var(--text-dim); text-decoration: none; margin: 0 8px; }
    .favicon-home { display: flex; align-items: center; gap: 8px; text-decoration: none; font-family: var(--font-pixel); font-size: 9px; color: var(--gold-color); margin: 16px 0 8px; }
  </style>
</head>
<body>
  <div class="container">
    <a class="favicon-home" href="/index.html" title="Início">
      <img src="/assets/sonheicom-favicon.svg" width="28" height="28" alt="início">
      <span>sonheicom</span>
    </a>

    <div class="page-content">
      <div class="breadcrumb">
        <a href="/">início</a> · <a href="/sonhos/">sonhos</a> · ${simboloNome.toLowerCase()}
      </div>

      <h1>${titulo}</h1>
      <p class="subtitulo">interpretação · numerologia · jogo do bicho</p>

      ${conteudo}

      <div class="cta-box">
        <span class="cta-titulo">✦ quer uma leitura completa e personalizada? ✦</span>
        <span class="cta-sub">a cigana cruza seus símbolos, emoções e data de nascimento</span>
        <a class="cta-btn" href="/">CONSULTAR A CIGANA →</a>
      </div>

      <div class="amazon-banner">
        <span class="amazon-banner-icon">✦</span>
        <div class="amazon-banner-left">
          <span class="amazon-banner-tag">✦ PATROCINADO ✦</span>
          <p class="amazon-banner-title">Não perca essa oferta.</p>
          <p class="amazon-banner-sub">Os melhores celulares do momento →</p>
        </div>
        <a class="amazon-banner-btn" href="${AMAZON_LINK}" target="_blank" rel="noopener sponsored">VER NA<br>AMAZON</a>
      </div>

      <footer class="footer-legal">
        <p>este site tem caráter exclusivamente de entretenimento — não incentivamos apostas.</p>
        <nav>
          <a href="/sobre.html">sobre</a>
          <span>·</span>
          <a href="/politica-de-privacidade.html">privacidade</a>
        </nav>
      </footer>
    </div>
  </div>

  <canvas id="shooting-stars" style="position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;"></canvas>
  <script>
  (function(){
    const c=document.getElementById('shooting-stars');
    const ctx=c.getContext('2d');
    let W,H,stars=[];
    function resize(){W=c.width=window.innerWidth;H=c.height=window.innerHeight;}
    window.addEventListener('resize',resize);resize();
    function newStar(){const angle=(Math.random()*40+60)*Math.PI/180;const speed=Math.random()*2.5+1.5;return{x:Math.random()*W*1.5-W*0.25,y:-10,vx:Math.cos(angle-Math.PI/2)*speed*(Math.random()>0.5?1:-1),vy:Math.sin(angle)*speed,len:Math.random()*80+40,alpha:Math.random()*0.5+0.3,life:0,maxLife:Math.random()*120+80};}
    for(let i=0;i<6;i++)stars.push(newStar());
    function draw(){ctx.clearRect(0,0,W,H);if(Math.random()<0.025)stars.push(newStar());stars=stars.filter(s=>{s.x+=s.vx;s.y+=s.vy;s.life++;const progress=s.life/s.maxLife;const alpha=s.alpha*(1-progress);const grad=ctx.createLinearGradient(s.x,s.y,s.x-s.vx*(s.len/2),s.y-s.vy*(s.len/2));grad.addColorStop(0,'rgba(255,255,255,'+alpha+')');grad.addColorStop(1,'rgba(255,255,255,0)');ctx.beginPath();ctx.moveTo(s.x,s.y);ctx.lineTo(s.x-s.vx*(s.len/2),s.y-s.vy*(s.len/2));ctx.strokeStyle=grad;ctx.lineWidth=1.2;ctx.stroke();return s.life<s.maxLife&&s.y<H+20;});requestAnimationFrame(draw);}
    draw();
  })();
  </script>
</body>
</html>`;
}

// ── Blocos de conteúdo ────────────────────────────────────────

function blocoTexto(titulo, texto) {
  if (!texto) return '';
  return `
  <div class="bloco">
    <span class="bloco-titulo">${titulo}</span>
    <div class="bloco-texto"><p>${texto}</p></div>
  </div>`;
}

function blocoFasesLua(faseLua) {
  if (!faseLua) return '';
  const itens = FASES_LUA.map(f => `
    <div class="fase-item">
      <span class="fase-nome">☽ ${faseLabel(f)}</span>
      <span class="fase-desc">${faseLua[f] || ''}</span>
    </div>`).join('');
  return `
  <div class="bloco">
    <span class="bloco-titulo">☽ Fases da Lua</span>
    <div class="fase-grid">${itens}</div>
  </div>`;
}

function blocoBicho(jogoBicho, simboloNome) {
  if (!jogoBicho) return '';
  const dezenas = (jogoBicho.dezenas || []).join(' · ');
  return `
  <div class="bloco">
    <span class="bloco-titulo">★ Jogo do Bicho — ${simboloNome}</span>
    <div class="bicho-grid">
      <div class="bicho-item"><span class="bicho-label">Animal</span><span class="bicho-val">${jogoBicho.animal || '—'}</span></div>
      <div class="bicho-item"><span class="bicho-label">Grupo</span><span class="bicho-val">${jogoBicho.grupo || '—'}</span></div>
      <div class="bicho-item"><span class="bicho-label">Dezenas</span><span class="bicho-val">${dezenas || '—'}</span></div>
      <div class="bicho-item"><span class="bicho-label">Milhar Sugerido</span><span class="bicho-val">${jogoBicho.milhar_sugerido || '—'}</span></div>
    </div>
  </div>`;
}

function blocoPsicologia(psicologia) {
  if (!psicologia) return '';
  const jung = psicologia.jung || '';
  const moderna = psicologia.interpretacao_moderna || '';
  return `
  <div class="bloco">
    <span class="bloco-titulo">◆ Psicologia dos Sonhos</span>
    <div class="bloco-texto">
      ${jung ? `<p><strong style="color:var(--gold-color)">Jung:</strong> ${jung}</p>` : ''}
      ${moderna ? `<p><strong style="color:var(--gold-color)">Interpretação Moderna:</strong> ${moderna}</p>` : ''}
    </div>
  </div>`;
}

function blocoMitologia(mitologia) {
  if (!mitologia) return '';
  const entries = Object.entries(mitologia)
    .filter(([k, v]) => v && k !== 'fonte')
    .map(([k, v]) => {
      const labels = { grega: 'Grécia', egipcia: 'Egito', hindu: 'Hindu', indigena_brasileira: 'Brasil Indígena', nordica: 'Nórdica', judaico_crista: 'Judaico-Cristã' };
      return `<p><strong style="color:var(--gold-color)">${labels[k] || capitalize(k)}:</strong> ${v}</p>`;
    }).join('');
  if (!entries) return '';
  return `
  <div class="bloco">
    <span class="bloco-titulo">✦ Mitologia</span>
    <div class="bloco-texto">${entries}</div>
  </div>`;
}

// ── Gerador de conteúdo por tipo de página ────────────────────

function conteudoBase(s) {
  return [
    blocoTexto('✦ O que significa', s.mensagem_direta),
    blocoTexto('◆ Interpretação Geral', s.leitures?.geral),
    blocoTexto('◆ Análise Profunda', s.leitures?.trilha_significado),
    blocoTexto('⚠ Atenção', s.alerta),
    blocoTexto('→ Ação Recomendada', s.acao_recomendada),
    blocoPsicologia(s.psicologia),
    blocoMitologia(s.mitologia),
    blocoFasesLua(s.fase_lua),
    blocoBicho(s.jogo_bicho, s.simbolo),
  ].filter(Boolean).join('');
}

function conteudoEmocao(s, emocao) {
  const textoEmocao = s.emocoes?.[emocao] || '';
  const contextoEmocao = s.contextos?.[`com_${emocao}`] || '';
  return [
    blocoTexto(`✦ ${s.simbolo} com ${emoLabel(emocao)}`, s.mensagem_direta),
    blocoTexto(`◆ Sentir ${emoLabel(emocao)} em Sonhos com ${s.simbolo}`, contextoEmocao || textoEmocao),
    blocoTexto('◆ Interpretação Geral', s.leitures?.geral),
    blocoTexto('⚠ Atenção', s.alerta),
    blocoPsicologia(s.psicologia),
    blocoFasesLua(s.fase_lua),
    blocoBicho(s.jogo_bicho, s.simbolo),
  ].filter(Boolean).join('');
}

function conteudoFaseLua(s, fase) {
  const textoFase = s.fase_lua?.[fase] || '';
  return [
    blocoTexto(`✦ ${s.simbolo} na ${faseLabel(fase)}`, s.mensagem_direta),
    blocoTexto(`☽ ${faseLabel(fase)} — O que isso muda`, textoFase),
    blocoTexto('◆ Interpretação Geral', s.leitures?.geral),
    blocoFasesLua(s.fase_lua),
    blocoPsicologia(s.psicologia),
    blocoBicho(s.jogo_bicho, s.simbolo),
  ].filter(Boolean).join('');
}

function conteudoPeriodo(s, periodo) {
  const key = PERIODO_KEY[periodo];
  const textoPeriodo = s.contextos?.[key] || '';
  return [
    blocoTexto(`✦ Sonhar com ${s.simbolo} ${periodoLabel(periodo)}`, s.mensagem_direta),
    blocoTexto(`◆ ${periodoLabel(periodo)} — Significado`, textoPeriodo),
    blocoTexto('◆ Interpretação Geral', s.leitures?.geral),
    blocoTexto('⚠ Atenção', s.alerta),
    blocoPsicologia(s.psicologia),
    blocoFasesLua(s.fase_lua),
    blocoBicho(s.jogo_bicho, s.simbolo),
  ].filter(Boolean).join('');
}

function conteudoCenario(s, cenario) {
  const key = CENARIO_KEY[cenario];
  const textoCenario = s.contextos?.[key] || '';
  return [
    blocoTexto(`✦ ${s.simbolo} em Cenário ${cenarioLabel(cenario)}`, s.mensagem_direta),
    blocoTexto(`◆ Cenário ${cenarioLabel(cenario)} — O que significa`, textoCenario),
    blocoTexto('◆ Interpretação Geral', s.leitures?.geral),
    blocoTexto('⚠ Atenção', s.alerta),
    blocoPsicologia(s.psicologia),
    blocoFasesLua(s.fase_lua),
    blocoBicho(s.jogo_bicho, s.simbolo),
  ].filter(Boolean).join('');
}

function conteudoTrilha(s, trilha) {
  const key = TRILHA_KEY[trilha];
  const textoTrilha = s.leitures?.[key] || '';
  const trilhaIcons = { significado: '◆', sorte: '★', amor: '♥', mente: '☽' };
  const icon = trilhaIcons[trilha] || '✦';
  return [
    blocoTexto(`${icon} ${s.simbolo} — Trilha ${trilhaLabel(trilha)}`, textoTrilha),
    blocoTexto('✦ Mensagem Principal', s.mensagem_direta),
    blocoTexto('◆ Interpretação Geral', s.leitures?.geral),
    trilha === 'sorte' ? blocoBicho(s.jogo_bicho, s.simbolo) : '',
    trilha === 'mente' ? blocoPsicologia(s.psicologia) : '',
    blocoFasesLua(s.fase_lua),
    trilha !== 'sorte' ? blocoBicho(s.jogo_bicho, s.simbolo) : '',
  ].filter(Boolean).join('');
}

// ── Gera uma página e salva ───────────────────────────────────

function gerarPagina(slug, titulo, descricao, keywords, conteudo, simboloNome) {
  const html = renderPage({ slug, titulo, descricao, keywords, canonical: `${BASE_URL}/sonhos/${slug}`, conteudo, simboloNome });
  const filePath = path.join(OUT_DIR, `${slug}.html`);
  fs.writeFileSync(filePath, html, 'utf8');
}

// ── Loop principal ────────────────────────────────────────────

function processarSimbolo(s) {
  const nome  = s.simbolo;
  const slug  = s.slug || slugify(nome);
  const base  = `sonhar-com-${slug}`;
  const kws   = (s.seo?.palavras_chave || []).join(', ');
  const pages = [];

  // 1. Página base
  gerarPagina(
    base,
    s.seo?.titulo_base || `Sonhar com ${nome} — Significado e Interpretação`,
    s.seo?.descricao_base || `Descubra o que significa sonhar com ${nome}.`,
    kws,
    conteudoBase(s),
    nome
  );
  pages.push(base);

  // 2. + Emoção
  for (const emocao of EMOCOES) {
    if (!s.emocoes?.[emocao] && !s.contextos?.[`com_${emocao}`]) continue;
    const slugPage = `${base}-com-${emocao}`;
    gerarPagina(
      slugPage,
      `Sonhar com ${nome} com ${emoLabel(emocao)} — Significado`,
      `O que significa sonhar com ${nome} e sentir ${emoLabel(emocao).toLowerCase()}? Interpretação completa com psicologia e numerologia.`,
      `sonhar com ${nome.toLowerCase()} com ${emocao}, ${kws}`,
      conteudoEmocao(s, emocao),
      nome
    );
    pages.push(slugPage);
  }

  // 3. + Fase da lua
  for (const fase of FASES_LUA) {
    if (!s.fase_lua?.[fase]) continue;
    const slugPage = `${base}-lua-${fase}`;
    gerarPagina(
      slugPage,
      `Sonhar com ${nome} na ${faseLabel(fase)} — Significado`,
      `O que significa sonhar com ${nome} durante a ${faseLabel(fase).toLowerCase()}? Interpretação esotérica e psicológica completa.`,
      `sonhar com ${nome.toLowerCase()} lua ${fase}, ${kws}`,
      conteudoFaseLua(s, fase),
      nome
    );
    pages.push(slugPage);
  }

  // 4. + Período
  for (const periodo of PERIODOS) {
    const key = PERIODO_KEY[periodo];
    if (!s.contextos?.[key]) continue;
    const slugPage = `${base}-${periodo}`;
    gerarPagina(
      slugPage,
      `Sonhar com ${nome} ${periodoLabel(periodo)} — Significado`,
      `O que significa sonhar com ${nome} ${periodoLabel(periodo).toLowerCase()}? Interpretação completa do horário do sonho.`,
      `sonhar com ${nome.toLowerCase()} ${periodo}, ${kws}`,
      conteudoPeriodo(s, periodo),
      nome
    );
    pages.push(slugPage);
  }

  // 5. + Cenário
  for (const cenario of CENARIOS) {
    const key = CENARIO_KEY[cenario];
    if (!s.contextos?.[key]) continue;
    const slugPage = `${base}-cenario-${cenario}`;
    gerarPagina(
      slugPage,
      `Sonhar com ${nome} em Cenário ${cenarioLabel(cenario)} — Significado`,
      `O que significa sonhar com ${nome} em ambiente ${cenarioLabel(cenario).toLowerCase()}? Interpretação detalhada do cenário onírico.`,
      `sonhar com ${nome.toLowerCase()} cenário ${cenario}, ${kws}`,
      conteudoCenario(s, cenario),
      nome
    );
    pages.push(slugPage);
  }

  // 6. + Trilha
  for (const trilha of TRILHAS) {
    const key = TRILHA_KEY[trilha];
    if (!s.leitures?.[key]) continue;
    const slugPage = `${base}-${trilha}`;
    gerarPagina(
      slugPage,
      `Sonhar com ${nome} — ${trilhaLabel(trilha)} — Interpretação`,
      `Interpretação de sonhar com ${nome} pela trilha de ${trilhaLabel(trilha).toLowerCase()}: ${s.leitures[key]?.slice(0, 100) || ''}.`,
      `sonhar com ${nome.toLowerCase()} ${trilha}, ${kws}`,
      conteudoTrilha(s, trilha),
      nome
    );
    pages.push(slugPage);
  }

  return pages;
}

// ── Entry point ───────────────────────────────────────────────

function main() {
  // Cria pasta /sonhos/ se não existir
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
    console.log('✦ Pasta /sonhos/ criada.');
  }

  let totalPages = 0;
  let totalSimbolos = 0;
  const slugsGerados = [];

  for (const arquivo of ARQUIVOS_SIMBOLOS) {
    const filePath = path.join(SIMBOLOS_DIR, arquivo);
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠ Arquivo não encontrado: ${arquivo}`);
      continue;
    }

    const raw = fs.readFileSync(filePath, 'utf8');
    let data;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      console.error(`✗ Erro ao parsear ${arquivo}:`, e.message);
      continue;
    }

    // Suporte a estruturas:
    // 1. Array: [ { simbolo: "Cobra", ... } ]
    // 2. Objeto direto: { "cobra": { simbolo: "Cobra", ... } }
    // 3. Objeto aninhado: { "animais": { "cobra": { simbolo: "Cobra", ... } } }
    let simbolos = [];
    if (Array.isArray(data)) {
      simbolos = data;
    } else {
      const values = Object.values(data);
      if (values.length > 0 && values[0] && typeof values[0] === 'object' && values[0].simbolo) {
        simbolos = values;
      } else {
        simbolos = values.flatMap(v => {
          if (Array.isArray(v)) return v;
          if (v && typeof v === 'object') return Object.values(v);
          return [];
        });
      }
    }

    console.log(`\n✦ Processando ${arquivo} — ${simbolos.length} símbolos`);

    for (const s of simbolos) {
      if (!s.simbolo) continue;
      try {
        const pages = processarSimbolo(s);
        totalPages += pages.length;
        slugsGerados.push(...pages);
        totalSimbolos++;
        process.stdout.write(`  ✓ ${s.simbolo} (${pages.length} páginas)\n`);
      } catch (e) {
        console.error(`  ✗ Erro em ${s.simbolo}:`, e.message);
      }
    }
  }

  // Gera sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${slugsGerados.map(slug => `  <url>
    <loc>${BASE_URL}/sonhos/${slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')}
</urlset>`;

  const sitemapPath = path.resolve(__dirname, '../sonhos-sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemap, 'utf8');

  console.log(`\n✦ CONCLUÍDO`);
  console.log(`  Símbolos processados : ${totalSimbolos}`);
  console.log(`  Páginas geradas      : ${totalPages}`);
  console.log(`  Sitemap salvo em     : sonhos-sitemap.xml`);
  console.log(`\n  Pasta de saída: /sonhos/`);
  console.log(`  URL base: ${BASE_URL}/sonhos/`);
}

main();
