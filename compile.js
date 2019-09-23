const fs = require('fs');

const { hex, b } = require('./opcode.js');
const { compile } = require('./compiler.js');
const file = process.argv.slice(-1)[0];
const source = fs.readFileSync(file, 'utf-8');
const bytes = compile(source);
console.log(bytes.map(_ => b(_, 8)).join('\n'));
console.log(bytes.map(_ => hex(_)).join(' '));
