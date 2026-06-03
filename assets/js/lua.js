function getMoonPhase(date) {
    const lp = 2551443; 
    const now = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 20, 35, 0);
    const new_moon = new Date(1970, 0, 7, 20, 35, 0);
    const phase = ((now.getTime() - new_moon.getTime()) / 1000) % lp;
    const res = Math.floor(phase / (24 * 3600)) + 1;
    
    if (res <= 1 || res >= 29) return { name: "Nova", icon: "🌑" };
    if (res < 7) return { name: "Crescente", icon: "🌒" };
    if (res < 14) return { name: "Crescente", icon: "🌓" };
    if (res < 15) return { name: "Cheia", icon: "🌕" };
    if (res < 22) return { name: "Minguante", icon: "🌖" };
    return { name: "Minguante", icon: "🌘" };
}
