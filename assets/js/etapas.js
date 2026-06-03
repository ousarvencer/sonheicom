const ETAPAS_DATA = {
    pessoas: [
        "Mãe", "Pai", "Filho(a)", "Irmã", "Avó", "Avô",
        "Namorado(a)", "Ex", "Chefe", "Amigo(a)", "Amigo(a) de infância",
        "Estranho", "Pessoa falecida", "Eu mesmo",
        "Criança desconhecida", "Figura desconhecida",
        "Anjo / Entidade", "Demônio / Presença sombria",
        "Versão de mim mesmo", "Pessoa famosa",
        "Figura religiosa", "Velho(a) sábio(a)"
    ],
    animais: [
        "Cobra", "Cachorro", "Gato", "Cavalo", "Peixe",
        "Aranha", "Coelho", "Pássaro", "Abelha", "Touro",
        "Leão", "Rato", "Sapo", "Crocodilo", "Borboleta",
        "Lobo", "Águia", "Coruja", "Tubarão", "Elefante",
        "Dragão", "Unicórnio", "Fênix", "Sereia",
        "Lobisomem", "Criatura das trevas", "Animal gigante"
    ],
    lugares: [
        "Mar", "Casa", "Igreja", "Hospital", "Escola",
        "Floresta", "Cemitério", "Festa", "Rua", "Montanha",
        "Lugar desconhecido", "Casa da infância",
        "Praia", "Trabalho", "Quarto", "Prisão", "Ponte", "Aeroporto",
        "Céu / Paraíso", "Inferno", "Caverna",
        "Ruínas antigas", "Castelo", "Labirinto", "Lugar que não existe"
    ],
    situacoes: [
        "Queda", "Voar", "Perseguição", "Briga", "Traição",
        "Abandono", "Sexo", "Casamento", "Morte", "Gravidez",
        "Acidente", "Estar nu",
        "Estar perdido", "Perder algo importante", "Afogamento",
        "Encontrar dinheiro", "Ser traído", "Chegar atrasado",
        "Ressurreição", "Viagem no tempo", "Mundo paralelo",
        "Fim do mundo", "Ser observado", "Transformação do corpo",
        "Falar com mortos"
    ],
    objetos: [
        "Dinheiro", "Chave", "Espelho", "Celular", "Faca",
        "Sangue", "Porta", "Vela", "Anel", "Arma", "Carro", "Dente",
        "Relógio", "Escada", "Livro", "Água", "Fogo", "Cruz", "Ponte",
        "Cristal", "Poção", "Portal", "Caveira",
        "Altar", "Pergaminho", "Talismã"
    ]
};

function renderGrid(containerId, items, multiple = true) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    items.forEach(item => {
        const card = document.createElement('div');
        const naipes = ['♠', '♥', '♦', '♣'];
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
            btn.textContent = temSelecionado ? 'PRÓXIMO →' : 'PULAR →';
            btn.classList.toggle('ativo', temSelecionado);
            updateButtons();
        };
        container.appendChild(card);
    });
}

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
