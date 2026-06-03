# 🔮 SonheiCom

Oráculo digital gratuito que interpreta sonhos com base em sabedoria popular brasileira, numerologia e fases da lua. O visitante informa seu nome, data de nascimento e os elementos do sonho — sem criar conta, sem burocracia — e recebe uma leitura mística personalizada com números da sorte, animal do jogo do bicho, trilha temática e status emocional.

**Site:** [sonheicom.com.br](https://sonheicom.com.br) · **Caráter:** exclusivamente de entretenimento — não incentivamos apostas.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | HTML5, CSS3, JavaScript Vanilla |
| Hospedagem | Cloudflare Pages |
| Fontes | Press Start 2P · VT323 (Google Fonts) |
| Fase da Lua | Cálculo local via algoritmo astronômico |
| Números da Sorte | Gerador determinístico baseado em hash do nome |
| SEO | sitemap.xml gerado via script · robots.txt configurado |

---

## Estrutura de Arquivos

**Páginas**
```
├── index.html                      # Oráculo principal (4 etapas)
├── sobre.html                      # Sobre o projeto
└── politica-de-privacidade.html    # Política de privacidade
```

**CSS**
```
assets/css/
├── base.css          # Variáveis, reset, tipografia e fundo místico animado
├── components.css    # Cards, grids, botões, barras RPG, footer fixo
└── animations.css    # Fade-in, pulse da bola de cristal, estrelas flutuantes
```

**JavaScript**
```
assets/js/
├── app.js      # Orquestração geral, fluxo de etapas, resultados e compartilhamento
├── etapas.js   # Dados das sub-etapas e funções de renderização de grid
├── leitura.js  # Geração da interpretação textual e dados do jogo do bicho
├── lua.js      # Cálculo da fase lunar atual
└── numeros.js  # Gerador determinístico de números da sorte
```

**Dados e Scripts**
```
data/
└── index.json          # Banco de símbolos (slug, sinônimos, categorias, leituras por trilha, jogo do bicho, numerologia, fases da lua, emoções)

scripts/
├── gerar-paginas.js    # Gerador de páginas HTML individuais por símbolo (em implementação)
└── gerar-sitemap.js    # Gerador de sitemap.xml (em implementação)
```

---

## Hospedagem

Projeto hospedado no [Cloudflare Pages](https://pages.cloudflare.com) com deploy automático a cada push na branch principal.

---

## Funcionalidades

### Fluxo do Oráculo (4 etapas)

**Etapa 1 — Identificação**
- Nome do usuário e data de nascimento (usados apenas para cálculo do número pessoal)
- Escolha da trilha temática: Significado · Sorte · Amor · Mente

**Etapa 2 — Elementos do Sonho**
- Seleção de símbolos em 5 sub-etapas com barra de progresso: Pessoas · Animais · Lugares · Situações · Objetos

**Etapa 3 — Contexto do Sonho e do Dia**
- Emoção sentida no sonho, recorrência, período (dia/noite), cor dominante, estado ao acordar
- Situação atual de amor, finanças e hora do despertar

**Etapa 4 — Revelação**
- Animação de bola de cristal durante o carregamento
- Blocos de resultado com fade-in sequencial:
  - Interpretação do sonho (texto personalizado por símbolo e trilha)
  - Animal do jogo do bicho com grupo, dezenas e milhar sugerido
  - Números da sorte do dia (geração determinística por nome + data)
  - Leitura da trilha escolhida
  - Barras RPG de status (Mente · Amor · Finanças)
  - Fase da lua atual

### Recursos Adicionais
- Salvar leitura no navegador via localStorage
- Compartilhar resultado via WhatsApp
- Banner de leitura anterior salva ao revisitar o site

---

## Banco de Símbolos (`data/index.json`)

Cada símbolo possui os seguintes campos:

| Campo | Descrição |
|---|---|
| `simbolo` / `slug` | Nome e identificador único |
| `sinonimos` | Variações do termo para busca |
| `categoria` | Animais · Objetos · Situações · Pessoas · Lugares |
| `jogo_bicho` | Grupo, animal, dezenas e milhar sugerido |
| `numerologia` | Número numerológico do símbolo |
| `leituras` | Texto geral + leitura específica por trilha (significado, sorte, amor, mente) |
| `emocoes` | Afinidade com cada emoção (Alta / Média / Baixa / Nula) |
| `recorrente` | Se é um símbolo tipicamente recorrente |
| `combinacoes_frequentes` | Símbolos que costumam aparecer juntos |
| `fase_lua` | Interpretação do símbolo em cada fase lunar |
| `periodo` | Período predominante do sonho (Dia / Noite) |
| `cor_associada` | Cor ligada ao símbolo |
| `sonho_pb` | Se o símbolo é comum em sonhos preto e branco |
| `estado_despertar` | Estado típico ao acordar após este sonho |

---

## Trilhas Temáticas

`Significado` · `Sorte` · `Amor` · `Mente`

## Categorias de Símbolos

`Animais` · `Objetos` · `Situações` · `Pessoas` · `Lugares`

---

## Privacidade

Nenhum dado pessoal é enviado a servidores externos. Nome e data de nascimento são processados localmente no navegador e salvos apenas via localStorage, a critério do usuário. O site utiliza cookies básicos para experiência do usuário e anúncios via Google AdSense.

---

<p align="center">Desenvolvido com ✨ para quem acredita que cada sonho carrega uma mensagem.</p>
