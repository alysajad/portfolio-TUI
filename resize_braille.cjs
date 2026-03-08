const fs = require('fs');

const brailleStr = fs.readFileSync('./src/ascii/raw_braille.txt', 'utf8').replace(/\r/g, '').split('\n').filter(Boolean);

const offsets = [
    [0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1], [3, 0], [3, 1]
];

const width = brailleStr[0].length * 2;
const height = brailleStr.length * 4;
const grid = Array.from({ length: height }, () => Array(width).fill(0));

for (let r = 0; r < brailleStr.length; r++) {
    for (let c = 0; c < brailleStr[r].length; c++) {
        const char = brailleStr[r].charCodeAt(c);
        if (char >= 0x2800 && char <= 0x28ff) {
            const val = char - 0x2800;
            for (let b = 0; b < 8; b++) {
                if ((val & (1 << b)) !== 0) {
                    const dr = offsets[b][0];
                    const dc = offsets[b][1];
                    grid[r * 4 + dr][c * 2 + dc] = 1;
                }
            }
        }
    }
}

const targetCols = 38;
const targetWidth = targetCols * 2;
const scale = targetWidth / width;
const targetHeight = Math.floor(height * scale);
const targetRows = Math.floor(targetHeight / 4);
const outGrid = Array.from({ length: targetHeight }, () => Array(targetWidth).fill(0));

for (let r = 0; r < targetHeight; r++) {
    for (let c = 0; c < targetWidth; c++) {
        const origR = Math.min(Math.floor(r / scale), height - 1);
        const origC = Math.min(Math.floor(c / scale), width - 1);
        outGrid[r][c] = grid[origR][origC];
    }
}

let outStr = '';
for (let r = 0; r < targetRows; r++) {
    let line = '';
    for (let c = 0; c < targetCols; c++) {
        let val = 0;
        for (let b = 0; b < 8; b++) {
            const dr = offsets[b][0];
            const dc = offsets[b][1];
            if (outGrid[r * 4 + dr] && outGrid[r * 4 + dr][c * 2 + dc]) {
                val |= (1 << b);
            }
        }
        line += String.fromCharCode(0x2800 + val);
    }
    outStr += line + '\n';
}

fs.writeFileSync('./src/ascii/profile.txt', outStr.trimRight() + '\n');
console.log('Done converting! Scaled from ' + brailleStr[0].length + 'x' + brailleStr.length + ' to ' + targetCols + 'x' + targetRows);
