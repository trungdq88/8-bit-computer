const { hex, b } = require('./opcode.js');
const { parse, compile } = require('./compiler.js');

describe('parse', () => {
  it('should be defined', () => {
    expect(parse).toBeTruthy();
  });

  it('should works', () => {
    expect(
      parse(`
LDA 14
ADD 15
JC 5
OUT 0
JMP 1
SUB 15
JZ 1
OUT 0
JMP 5





0
55
    `)
    ).toEqual([
      /*  0 */ ['LDA', 14],
      /*  1 */ ['ADD', 15],
      /*  2 */ ['JC', 5],
      /*  3 */ ['OUT', 0],
      /*  4 */ ['JMP', 1],
      /*  5 */ ['SUB', 15],
      /*  6 */ ['JZ', 1],
      /*  7 */ ['OUT', 0],
      /*  8 */ ['JMP', 5],
      /*  9 */ [],
      /* 10 */ [],
      /* 11 */ [],
      /* 12 */ [],
      /* 13 */ [],
      /* 14 */ [0],
      /* 15 */ [55],
    ]);
  });
});

describe('compile', () => {
  it('should works', () => {
    expect(
      compile(`
LDA 14
ADD 15
JC 5
OUT 0
JMP 1
SUB 15
JZ 1
OUT 0
JMP 5





0
255
    `)
        .map(_ => hex(_))
        .join(' ')
    ).toEqual('e 1f 55 20 41 7f 61 20 45 0 0 0 0 0 0 ff');
  });
});
