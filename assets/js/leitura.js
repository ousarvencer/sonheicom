function generateInterpretation(userData, symbols) {
    const mainSymbol = symbols[0] || { simbolo: "Mistério", leituras: { geral: "Seu sonho é complexo e exige reflexão." } };
    const name = userData.nome;
    
    return {
        titulo: "O QUE SEU SONHO DIZ",
        texto: `${name}, seu sonho com ${mainSymbol.simbolo} revela que você está em um momento de transição. ${mainSymbol.leituras.geral}`
    };
}

function getBichoData(symbol) {
    if (symbol && symbol.jogo_bicho) return symbol.jogo_bicho;
    return { grupo: "00", animal: "Sorte", dezenas: ["00"], milhar_sugerido: "0000" };
}
