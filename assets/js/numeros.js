function generateLuckyNumbers(seed) {
    const hoje = new Date().toISOString().slice(0, 10);
    seed = seed + hoje;
    // Simple hash deterministic function
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = ((hash << 5) - hash) + seed.charCodeAt(i);
        hash |= 0;
    }

    const numbers = [];
    let currentSeed = Math.abs(hash);
    
    while (numbers.length < 6) {
        currentSeed = (currentSeed * 16807) % 2147483647;
        let num = (currentSeed % 60) + 1;
        if (!numbers.includes(num)) {
            numbers.push(num);
        }
    }
    return numbers.sort((a, b) => a - b);
}
