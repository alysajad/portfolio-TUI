import fs from 'node:fs';

const text = fs.readFileSync('src/ascii/profile.txt', 'utf8');
const lines = text.split('\n').filter(l => l.trim().length > 0);

const out = [];

for (let y = 0; y < lines.length; y += 2) {
  let row = '';
  const line = lines[y];
  for (let x = 0; x < line.length; x += 2) {
    row += line[x];
  }
  out.push(row);
}

fs.writeFileSync('src/ascii/profile_small.txt', out.join('\n'));
console.log('Downscaled to:', out[0].length, 'x', out.length);
