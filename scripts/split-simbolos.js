/**
 * split-simbolos.js — SonheiCom
 * Fraciona data/simbolos/<categoria>.json em data/simbolos/<categoria>/<slug>.json
 * (1 arquivo por símbolo). Não gera nem altera conteúdo — só reorganiza.
 *
 * Uso:
 *   node scripts/split-simbolos.js animais
 *   node scripts/split-simbolos.js pessoas
 *   node scripts/split-simbolos.js lugares
 *   node scripts/split-simbolos.js objetos
 *   node scripts/split-simbolos.js situacoes
 *   node scripts/split-simbolos.js --todos      (roda os 5 de uma vez)
 *
 * O arquivo original (ex: animais.json) NÃO é apagado — fica intacto como
 * backup até você confirmar que a pasta nova está correta e fazer o commit.
 */

const fs = require('fs');
const path = require('path');

const SIMBOLOS_DIR = path.resolve(__dirname, '../data/simbolos');
const CATEGORIAS = ['animais', 'pessoas', 'lugares', 'objetos', 'situacoes'];

function slugify(str) {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Mesma lógica de leitura flexível usada em gerar-paginas.js, pra garantir
// que o split extrai exatamente os mesmos símbolos que o gerador já lê hoje.
function extrairSimbolos(data) {
  if (Array.isArray(data)) return data;
  const values = Object.values(data);
  if (values.length > 0 && values[0] && typeof values[0] === 'object' && values[0].simbolo) {
    return values;
  }
  return values.flatMap(v => {
    if (Array.isArray(v)) return v;
    if (v && typeof v === 'object') return Object.values(v);
    return [];
  });
}

function splitCategoria(categoria) {
  const arquivoOrigem = path.join(SIMBOLOS_DIR, `${categoria}.json`);
  const pastaDestino = path.join(SIMBOLOS_DIR, categoria);

  if (!fs.existsSync(arquivoOrigem)) {
    console.log(`⚠ ${categoria}.json não encontrado em data/simbolos/ — pulando.`);
    return;
  }

  const raw = fs.readFileSync(arquivoOrigem, 'utf8');
  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    console.error(`✗ Erro ao parsear ${categoria}.json:`, e.message);
    return;
  }

  const simbolos = extrairSimbolos(data).filter(s => s && s.simbolo);

  if (!fs.existsSync(pastaDestino)) {
    fs.mkdirSync(pastaDestino, { recursive: true });
  }

  let escritos = 0;
  let pulados = 0;
  const slugsUsados = new Set();

  for (const s of simbolos) {
    const slug = s.slug || slugify(s.simbolo);
    if (slugsUsados.has(slug)) {
      console.warn(`  ⚠ slug duplicado "${slug}" (${s.simbolo}) — sobrescrevendo o anterior.`);
    }
    slugsUsados.add(slug);

    const destino = path.join(pastaDestino, `${slug}.json`);
    fs.writeFileSync(destino, JSON.stringify(s, null, 2), 'utf8');
    escritos++;
  }

  console.log(`✓ ${categoria}: ${escritos} arquivo(s) gerado(s) em data/simbolos/${categoria}/`);
  if (pulados > 0) console.log(`  (${pulados} símbolo(s) sem campo "simbolo" foram ignorados)`);
}

function main() {
  const arg = process.argv[2];

  if (!arg) {
    console.log('Uso: node scripts/split-simbolos.js <animais|pessoas|lugares|objetos|situacoes|--todos>');
    process.exit(1);
  }

  if (arg === '--todos') {
    CATEGORIAS.forEach(splitCategoria);
  } else if (CATEGORIAS.includes(arg)) {
    splitCategoria(arg);
  } else {
    console.error(`✗ Categoria desconhecida: "${arg}". Use uma de: ${CATEGORIAS.join(', ')} ou --todos`);
    process.exit(1);
  }

  console.log('\nPróximo passo: confira 2-3 arquivos gerados manualmente, depois rode');
  console.log('node scripts/gerar-paginas.js pra confirmar que as páginas continuam saindo iguais.');
}

main();
