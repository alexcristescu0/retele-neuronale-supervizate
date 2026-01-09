import * as tf from '@tensorflow/tfjs';

export function genereazaDateCercuri(numarPuncte, zgomot) {
    const date = [];
    const radius = 5;

    for (let i = 0; i < numarPuncte; i++) {
        const unghi = Math.random() * Math.PI * 2;
        const distanta = Math.random() * radius;

        
        date.push({
            x: Math.cos(unghi) * distanta + (Math.random() - 0.5) * zgomot * 2,
            y: Math.sin(unghi) * distanta + (Math.random() - 0.5) * zgomot * 2,
            label: 1
        });

        
        date.push({
            x: Math.cos(unghi) * (distanta + 3) + (Math.random() - 0.5) * zgomot * 2,
            y: Math.sin(unghi) * (distanta + 3) + (Math.random() - 0.5) * zgomot * 2,
            label: 0
        });
    }

    return date;
}

export function genereazaDateXOR(numarPuncte, zgomot) {
    const date = [];

    for (let i = 0; i < numarPuncte; i++) {
        
        if (Math.random() > 0.5) {
            date.push({
                x: -4 + Math.random() * 2 + (Math.random() - 0.5) * zgomot * 2,
                y: -4 + Math.random() * 2 + (Math.random() - 0.5) * zgomot * 2,
                label: 1
            });
            date.push({
                x: 2 + Math.random() * 2 + (Math.random() - 0.5) * zgomot * 2,
                y: 2 + Math.random() * 2 + (Math.random() - 0.5) * zgomot * 2,
                label: 1
            });
        }
        
        else {
            date.push({
                x: 2 + Math.random() * 2 + (Math.random() - 0.5) * zgomot * 2,
                y: -4 + Math.random() * 2 + (Math.random() - 0.5) * zgomot * 2,
                label: 0
            });
            date.push({
                x: -4 + Math.random() * 2 + (Math.random() - 0.5) * zgomot * 2,
                y: 2 + Math.random() * 2 + (Math.random() - 0.5) * zgomot * 2,
                label: 0
            });
        }
    }

    return date;
}

export function genereazaDateRegresie(numarPuncte, zgomot) {
    const date = [];
    const panta = 2;
    const intercept = 1;

    for (let i = 0; i < numarPuncte; i++) {
        const x = (Math.random() - 0.5) * 10;
        const y = panta * x + intercept + (Math.random() - 0.5) * zgomot * 5;

        
        const label = y > (panta * x + intercept) ? 1 : 0;

        date.push({ x, y, label });
    }

    return date;
}

export function genereaza3Cercuri(numarPuncte, zgomot) {
    const date = [];
    const raze = [2, 4, 6];

    for (let i = 0; i < numarPuncte; i++) {
        for (let j = 0; j < 3; j++) {
            const unghi = Math.random() * Math.PI * 2;
            const raza = raze[j] + (Math.random() - 0.5) * zgomot * 2;

            date.push({
                x: Math.cos(unghi) * raza + (Math.random() - 0.5) * zgomot,
                y: Math.sin(unghi) * raza + (Math.random() - 0.5) * zgomot,
                label: j % 2 
            });
        }
    }
    return date;
}

export function genereazaSpirale(numarPuncte, zgomot) {
    const date = [];
    const spirale = 2;

    for (let i = 0; i < numarPuncte; i++) {
        for (let s = 0; s < spirale; s++) {
            const t = Math.random() * Math.PI * 4;
            const r = t * 0.5 + (Math.random() - 0.5) * zgomot * 3;

            date.push({
                x: Math.cos(t + s * Math.PI) * r + (Math.random() - 0.5) * zgomot,
                y: Math.sin(t + s * Math.PI) * r + (Math.random() - 0.5) * zgomot,
                label: s % 2 
            });
        }
    }
    return date;
}

export function genereazaGrid(numarPuncte, zgomot) {
    const date = [];
    const gridSize = Math.floor(Math.sqrt(numarPuncte));

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const x = (i / gridSize) * 8 - 4;
            const y = (j / gridSize) * 8 - 4;

            
            const label = (i % 2 === 0 && j % 2 === 0) || (i % 2 === 1 && j % 2 === 1) ? 1 : 0;

            date.push({
                x: x + (Math.random() - 0.5) * zgomot * 2,
                y: y + (Math.random() - 0.5) * zgomot * 2,
                label
            });
        }
    }
    return date;
}

export function genereazaDateComplexe(numarPuncte, zgomot, tip) {
    switch (tip) {
        case 'cercuri':
            return genereazaDateCercuri(numarPuncte, zgomot);
        case 'xor':
            return genereazaDateXOR(numarPuncte, zgomot);
        case 'regresie':
            return genereazaDateRegresie(numarPuncte, zgomot);
        case '3-cercuri':
            return genereaza3Cercuri(numarPuncte, zgomot);
        case 'spirale':
            return genereazaSpirale(numarPuncte, zgomot);
        case 'grid':
            return genereazaGrid(numarPuncte, zgomot);
        default:
            return genereazaDateCercuri(numarPuncte, zgomot);
    }
}