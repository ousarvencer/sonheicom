function getMoonPhase(date) {
    const lp = 2551443; 
    const now = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 20, 35, 0);
    const new_moon = new Date(1970, 0, 7, 20, 35, 0);
    const phase = ((now.getTime() - new_moon.getTime()) / 1000) % lp;
    const res = Math.floor(phase / (24 * 3600)) + 1;
    
    if (res <= 1 || res >= 29) return { name: "Nova",      description: "Início de ciclo. Intenções plantadas agora germinam no escuro." };
    if (res < 7)               return { name: "Crescente", description: "Energia em expansão. O que você iniciou começa a tomar forma." };
    if (res < 14)              return { name: "Crescente", description: "Força crescente. Momento de agir e avançar com determinação." };
    if (res < 15)              return { name: "Cheia",     description: "Plenitude e revelação. O que estava oculto vem à luz esta noite." };
    if (res < 22)              return { name: "Minguante", description: "Tempo de soltar. Libere o que não serve mais ao seu caminho." };
    return                            { name: "Minguante", description: "Recolhimento e encerramento. O ciclo se prepara para renascer." };
}

analise o arquivo e veja se pode tornar mais profissional ]
