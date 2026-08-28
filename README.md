# 🔮 SonheiCom

Oráculo digital gratuito que interpreta sonhos com base em sabedoria popular brasileira, numerologia e fases da lua. O visitante informa seu nome, data de nascimento e os elementos do sonho — sem criar conta, sem burocracia — e recebe uma leitura mística personalizada com números da sorte, animal do jogo do bicho, trilha temática e status emocional.

**Site:** [sonheicom.com.br](https://sonheicom.com.br) · **Caráter:** exclusivamente de entretenimento — não incentivamos apostas.

> ⚠️ **Status do projeto:** em pausa. Estrutura funcional e publicada, mas em processo de revisão de conteúdo e SEO antes da retomada do desenvolvimento ativo.

---

## Sobre o Projeto

O SonheiCom nasceu com uma proposta diferente dos dicionários de sonhos tradicionais: em vez de uma leitura fixa por símbolo, o usuário monta seu sonho combinando múltiplos elementos (pessoas, animais, lugares, situações, objetos) e contexto (emoção, período, cor, estado ao acordar), recebendo uma interpretação única que cruza todos esses dados — não apenas o significado isolado de um símbolo.

O objetivo é evoluir o produto para algo que ajude o usuário a **entender o sonho de forma mais ampla**, e não apenas consultar um significado pontual.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | HTML5, CSS3, JavaScript Vanilla |
| Hospedagem | Cloudflare Pages (deploy automático a cada push na branch principal) |
| Fontes | Press Start 2P · VT323 (Google Fonts) |
| Fase da Lua | Cálculo local via algoritmo astronômico |
| Números da Sorte | Gerador determinístico baseado em hash do nome |
| SEO | Sitemaps segmentados (`sitemap-index.xml`) · `robots.txt` configurado |
| Dados | JSON estático, segmentado por categoria e por finalidade (dado vs. SEO) |

---

## Estrutura de Arquivos

```
├── index.html                          # Oráculo principal (4 etapas)
├── sobre.html                          # Sobre o projeto
├── politica-de-privacidade.html        # Política de privacidade
├── robots.txt
├── sitemap-index.xml                   # Índice mestre de sitemaps
├── sitemap-principal.xml               # Sitemap das páginas fixas
├── sonhos-sitemap.xml                  # Sitemap das páginas de símbolo geradas
│
├── sonhos/                             # Páginas individuais geradas por símbolo/tema
│
├── assets/
│   ├── css/
│   │   ├── base.css          # Variáveis, reset, tipografia, fundo místico animado
│   │   ├── components.css    # Cards, grids, botões, barras RPG, footer fixo
│   │   └── animations.css    # Fade-in, pulse da bola de cristal, estrelas flutuantes
│   ├── js/
│   │   ├── app.js      # Orquestração geral, fluxo de etapas, resultados e compartilhamento
│   │   ├── etapas.js   # Dados das sub-etapas e funções de renderização de grid
│   │   ├── leitura.js  # Geração da interpretação textual e dados do jogo do bicho
│   │   ├── lua.js      # Cálculo da fase lunar atual
│   │   └── numeros.js  # Gerador determinístico de números da sorte
│   └── sonheicom-favicon.svg
│
├── data/
│   ├── simbolos/                       # Banco de símbolos, segmentado por categoria
│   │                                    # (animais, pessoas, lugares, situações, objetos)
│   ├── cenarios.json                   # Cenários/contextos combinados de sonho
│   ├── cores.json                      # Interpretação por cor dominante do sonho
│   ├── cores-seo.json                  # Metadados de SEO (title/description) para páginas de cor
│   ├── emocoes.json                    # Afinidade e leitura por emoção sentida no sonho
│   ├── estado-despertar.json           # Interpretações por estado ao acordar
│   ├── fases-lua.json                  # Leituras por fase lunar
│   ├── hora-despertar.json             # Interpretação por horário do despertar
│   ├── hora-despertar-seo.json         # Metadados de SEO para páginas de hora do despertar
│   ├── jogo-bicho.json                 # Tabela de grupos, dezenas e milhares do jogo do bicho
│   ├── memoria.json                    # Leituras por nível de recorrência/memória do sonho
│   ├── numerologia-caminho.json        # Número do caminho de vida / numerologia geral
│   ├── numerologia-nomes.json          # Numerologia baseada no nome do usuário
│   ├── numerologia-pessoal.json        # Número pessoal (nome + data de nascimento)
│   ├── periodos.json                   # Leituras por período do sonho (dia/noite)
│   ├── recorrencia.json                # Leituras por frequência do sonho
│   ├── signos.json                     # Cruzamento com signos/astrologia
│   ├── situacao-amor.json              # Leitura por situação amorosa atual
│   ├── situacao-financas.json          # Leitura por situação financeira atual
│   ├── sono.json                       # Dados relacionados à qualidade/tipo de sono
│   └── trilhas.json                    # Definição das trilhas temáticas (Significado, Sorte, Amor, Mente)
│
├── scripts/
│   ├── gerar-paginas.js                # Gera páginas HTML individuais por símbolo/tema (SEO)
│   ├── gerar-sitemap.js                # Gera os arquivos de sitemap a partir dos dados
│   └── split-simbolos.js               # Divide o banco de símbolos original em arquivos por categoria
│
├── _backup.txt
├── backup.bat
└── README.md
```

> Nota: os arquivos com sufixo `-seo` armazenam metadados de indexação (title, meta description etc.) separados dos dados de interpretação, para permitir customizar o SEO de cada página gerada sem misturar com o conteúdo da leitura.

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
  - Interpretação do sonho, combinando todos os elementos selecionados (não apenas um símbolo isolado)
  - Animal do jogo do bicho com grupo, dezenas e milhar sugerido
  - Números da sorte do dia (geração determinística por nome + data)
  - Leitura da trilha escolhida
  - Barras RPG de status (Mente · Amor · Finanças)
  - Fase da lua atual

### Recursos Adicionais
- Salvar leitura no navegador via localStorage
- Compartilhar resultado via WhatsApp
- Banner de leitura anterior salva ao revisitar o site
- Páginas individuais geradas por símbolo/tema para SEO (`/sonhos/`)

---

## Geração de Páginas e SEO

O script `scripts/gerar-paginas.js` cria páginas estáticas individuais (em `sonhos/`) a partir dos dados em `data/`, para permitir indexação por símbolo/tema específico. O script `scripts/gerar-sitemap.js` gera os sitemaps segmentados a partir dessas mesmas páginas.

**Status atual:** as páginas estão publicadas, mas ainda não indexadas de forma consistente pelo Google — provavelmente por baixa diferenciação de conteúdo entre páginas geradas pelo mesmo template. Ver seção de Roadmap.

---

## Privacidade

Nenhum dado pessoal é enviado a servidores externos. Nome e data de nascimento são processados localmente no navegador e salvos apenas via localStorage, a critério do usuário. O site utiliza cookies básicos para experiência do usuário e anúncios via Google AdSense.

---

## Roadmap / Próximos Passos

- [ ] Diagnosticar indexação real via Google Search Console (cobertura, rastreamento, sitemap)
- [ ] Usar `combinacoes_frequentes` dos símbolos para gerar links internos entre páginas relacionadas
- [ ] Aprofundar conteúdo dos símbolos de maior busca antes de expandir a base inteira
- [ ] Variar estrutura de template por categoria de página (não só o texto)
- [ ] Adicionar dados estruturados (schema.org: FAQPage, Article, BreadcrumbList)
- [ ] Criar seção de conteúdo editorial (blog/artigos) para construir autoridade temática
- [ ] Avaliar funcionalidade de diário de sonhos (histórico local de leituras e padrões recorrentes)
- [ ] Revisar página "Sobre" para reforçar sinais de confiança (E-E-A-T)
- [ ] Revisar adequação do conteúdo às políticas do Google AdSense (conteúdo próximo a jogos de azar)

---

<p align="center">Desenvolvido com ✨ para quem acredita que cada sonho carrega uma mensagem.</p>
