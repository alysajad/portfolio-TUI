const fs = require('fs');
let text = fs.readFileSync('src/ascii/profile.txt', 'utf8');

text = text.replace(/♫/g, ' ');

const map = {
  '♦': '#', '◦': '.', '⋆': '*', '√': '/', '≤': '<', '±': '+', '≥': '>', '∏': 'T', '•': 'o',
  '∫': 'S', '∑': 'E', '≠': '=', '×': 'x', '÷': '/', '=': '=', '-': '-', '+': '+', '>': '>', '<': '<',
  '!': '!', 'l': 'l', 'I': 'I', '∇': 'V', '≈': '~', '∂': 'd', '°': 'o', 'i': 'i'
};

text = text.replace(/[♦◦⋆√≤±≥∏•∫∑≠×÷=\-\+><!lIi∇≈∂°]/g, (char) => {
  return map[char] || '#';
});

fs.writeFileSync('src/ascii/profile.txt', text);
console.log('Replaced wide unicode characters with standard ASCII.');
