const ETAPAS_DATA = {
    pessoas: ["Mãe", "Pai", "Ex", "Filho", "Irmã", "Avó", "Namorado(a)", "Chefe", "Amigo", "Estranho", "Pessoa falecida", "Eu mesmo"],
    animais: ["Cobra", "Cachorro", "Gato", "Cavalo", "Peixe", "Aranha", "Coelho", "Pássaro", "Abelha", "Touro", "Leão", "Rato", "Sapo", "Crocodilo", "Borboleta"],
    lugares: ["Mar", "Casa", "Igreja", "Hospital", "Escola", "Floresta", "Cemitério", "Festa", "Rua", "Montanha", "Lugar desconhecido", "Casa da infância"],
    situacoes: ["Queda", "Voar", "Perseguição", "Briga", "Traição", "Abandono", "Sexo", "Casamento", "Morte", "Gravidez", "Acidente", "Estar nu"],
    objetos: ["Dinheiro", "Chave", "Espelho", "Celular", "Faca", "Sangue", "Porta", "Vela", "Anel", "Arma", "Carro", "Dente"]
};

function renderGrid(containerId, items, multiple = true) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.textContent = item;
        card.onclick = () => {
            if (multiple) {
                card.classList.toggle('selected');
            } else {
                container.querySelectorAll('.card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
            }
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
