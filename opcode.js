console.clear();
var INS_CODE = {
  LDA: 0,
  ADD: 1,
  OUT: 2,
  JMP: 4,
  JC: 5,
  JZ: 6,
  SUB: 7,
  HLT: 15,
};

var OP = {
    H:  parseInt('10000000000000000', 2),
    MI: parseInt('01000000000000000', 2),
    RO: parseInt('00100000000000000', 2),
    RI: parseInt('00010000000000000', 2),
    II: parseInt('00001000000000000', 2),
    IO: parseInt('00000100000000000', 2),
    CE: parseInt('00000010000000000', 2),
    CO: parseInt('00000001000000000', 2),
    J:  parseInt('00000000100000000', 2),
    AI: parseInt('00000000010000000', 2),
    AO: parseInt('00000000001000000', 2),
    SO: parseInt('00000000000100000', 2),
    BI: parseInt('00000000000010000', 2),
    BO: parseInt('00000000000001000', 2),
    OI: parseInt('00000000000000100', 2),
    SU: parseInt('00000000000000010', 2),
    FI: parseInt('00000000000000001', 2),
}

var template = [
    OP.CO | OP.MI,
    OP.RO | OP.II | OP.CE
];

var INS = {
  LDA: [
    ...template,
    OP.IO | OP.MI,
    OP.RO | OP.AI,
  ],
  ADD: [
    ...template,
    OP.IO | OP.MI,
    OP.RO | OP.BI,
    OP.SO | OP.AI | OP.FI,
  ],
  SUB: [
    ...template,
    OP.IO | OP.MI,
    OP.RO | OP.BI,
    OP.SO | OP.AI | OP.SU | OP.FI,
  ],
  OUT: [
    ...template,
    OP.AO | OP.OI
  ],
  HLT: [
    ...template,
    OP.H
  ],
  JMP: [
    ...template,
    OP.IO | OP.J,
  ],
  JC: [
    ...template,
  ],
  JZ: [
    ...template,
  ]
}

MICROOPT_COUNT = Object.keys(OP).length;

function b(x, n) {
  return x.toString(2).padStart(n, '0')
}

function hex(x, n) {
  return x.toString(16).padStart(n, '0')
}

var data = {};

Object.keys(INS).forEach(instruction => {
  const steps = INS[instruction];
  steps.forEach((step, index) => {
    for (let x = 0; x < 2**2; x++) {
      address = ((INS_CODE[instruction] << 3) | index) << 2 | x
      data[address] = step
      console.log(b(address, 9), b(step, MICROOPT_COUNT));
    }
  });
});

// Jump Carry + Jump Zero
data[((INS_CODE.JC     << 3         ) | 2   ) << 2 | 2] = OP.IO | OP.J
//    |instruction    |step 2 (3 bit)               10 (carry bit on, zero bit off)
//                     step 0 and step 1 are from template
data[((INS_CODE.JC     << 3         ) | 2   ) << 2 | 3] = OP.IO | OP.J
//    |instruction    |step 2 (3 bit)               11 (carry bit on, zero bit on)

data[((INS_CODE.JZ     << 3         ) | 2   ) << 2 | 1] = OP.IO | OP.J
//    |instruction    |step 2 (3 bit)               01 (carry bit off, zero bit on)
//                     step 0 and step 1 are from template
data[((INS_CODE.JZ     << 3         ) | 2   ) << 2 | 3] = OP.IO | OP.J
//    |instruction    |step 2 (3 bit)               11 (carry bit on, zero bit on)

var s = '';

for (let i = 0; i < 2**9; i++) {
  s += hex(data[i] || 0, 5) + ' '
  if ((i + 1) % 8 == 0) {
    s += '\n';
  }
}

console.log(s)

var source = [
  /*  0 */  ['OUT', 0],
  /*  1 */  ['ADD', 15],
  /*  2 */  ['JC', 4],
  /*  3 */  ['JMP', 0],
  /*  4 */  ['SUB', 15],
  /*  5 */  ['OUT', 0],
  /*  6 */  ['JZ', 0],
  /*  7 */  [],
  /*  8 */  [],
  /*  9 */  [],
  /* 10 */  [],
  /* 11 */  [],
  /* 12 */  [],
  /* 13 */  [],
  /* 14 */  [],
  /* 15 */  [2]
]

// var source = [
//   #<{(|  0 |)}>#  ['LDA', 15],
//   #<{(|  1 |)}>#  ['ADD', 14],
//   #<{(|  2 |)}>#  ['SUB', 13],
//   #<{(|  3 |)}>#  ['OUT', 0],
//   #<{(|  4 |)}>#  ['HLT', 0],
//   #<{(|  5 |)}>#  [],
//   #<{(|  6 |)}>#  [],
//   #<{(|  7 |)}>#  [],
//   #<{(|  8 |)}>#  [],
//   #<{(|  9 |)}>#  [],
//   #<{(| 10 |)}>#  [],
//   #<{(| 11 |)}>#  [],
//   #<{(| 12 |)}>#  [],
//   #<{(| 13 |)}>#  [7],
//   #<{(| 14 |)}>#  [6],
//   #<{(| 15 |)}>#  [5]
// ]

// var source = [
//   #<{(|  0 |)}>#  ['LDA', 15],
//   #<{(|  1 |)}>#  ['SUB', 14],
//   #<{(|  2 |)}>#  ['OUT', 0],
//   #<{(|  3 |)}>#  ['HLT', 0],
//   #<{(|  4 |)}>#  [],
//   #<{(|  5 |)}>#  [],
//   #<{(|  6 |)}>#  [],
//   #<{(|  7 |)}>#  [],
//   #<{(|  8 |)}>#  [],
//   #<{(|  9 |)}>#  [],
//   #<{(| 10 |)}>#  [],
//   #<{(| 11 |)}>#  [],
//   #<{(| 12 |)}>#  [],
//   #<{(| 13 |)}>#  [],
//   #<{(| 14 |)}>#  [7],
//   #<{(| 15 |)}>#  [10]
// ]

// var source = [
//   #<{(|  0 |)}>#  ['LDA', 15],
//   #<{(|  1 |)}>#  ['ADD', 15],
//   #<{(|  2 |)}>#  ['OUT', 0],
//   #<{(|  3 |)}>#  ['JC', 7],
//   #<{(|  4 |)}>#  ['JMP', 1],
//   #<{(|  5 |)}>#  [],
//   #<{(|  6 |)}>#  [],
//   #<{(|  7 |)}>#  ['SUB', 15],
//   #<{(|  8 |)}>#  ['OUT', 0],
//   #<{(|  9 |)}>#  ['JZ', 1],
//   #<{(| 10 |)}>#  ['JMP', 7],
//   #<{(| 11 |)}>#  [],
//   #<{(| 12 |)}>#  [],
//   #<{(| 13 |)}>#  [],
//   #<{(| 14 |)}>#  [],
//   #<{(| 15 |)}>#  [5]
// ]

// var source = [
//   #<{(|  0 |)}>#  ['LDA', 15],
//   #<{(|  1 |)}>#  ['SUB', 14],
//   #<{(|  2 |)}>#  ['OUT', 0],
//   #<{(|  3 |)}>#  ['JZ', 7],
//   #<{(|  4 |)}>#  ['JMP', 1],
//   #<{(|  5 |)}>#  [],
//   #<{(|  6 |)}>#  [],
//   #<{(|  7 |)}>#  ['HLT', 0],
//   #<{(|  8 |)}>#  [],
//   #<{(|  9 |)}>#  [],
//   #<{(| 10 |)}>#  [],
//   #<{(| 11 |)}>#  [],
//   #<{(| 12 |)}>#  [],
//   #<{(| 13 |)}>#  [],
//   #<{(| 14 |)}>#  [1],
//   #<{(| 15 |)}>#  [2]
// ]

var source = [
  /*  0 */  ['LDA', 15],
  /*  1 */  ['ADD', 14],
  /*  2 */  ['JC', 5],
  /*  3 */  ['OUT', 0],
  /*  4 */  ['JMP', 1],
  /*  5 */  ['SUB', 14],
  /*  6 */  ['JZ', 1],
  /*  7 */  ['OUT', 0],
  /*  8 */  ['JMP', 5],
  /*  9 */  [],
  /* 10 */  [],
  /* 11 */  [],
  /* 12 */  [],
  /* 13 */  [],
  /* 14 */  [5],
  /* 15 */  [0]
]

var source = [
  /*  0 */  ['LDA', 14],
  /*  1 */  ['ADD', 15],
  /*  2 */  ['JC', 5],
  /*  3 */  ['OUT', 0],
  /*  4 */  ['JMP', 1],
  /*  5 */  ['SUB', 15],
  /*  6 */  ['JZ', 1],
  /*  7 */  ['OUT', 0],
  /*  8 */  ['JMP', 5],
  /*  9 */  [],
  /* 10 */  [],
  /* 11 */  [],
  /* 12 */  [],
  /* 13 */  [],
  /* 14 */  [0],
  /* 15 */  [5]
]

var s = '';

for (let i = 0; i < source.length; i++) {
  let line = '';
  if (source[i].length == 1) {
    line = source[i][0].toString(16)
  } else {
    const [instruction, parameter = 0] = source[i];
    const opCode = INS_CODE[instruction];
    line = (opCode << 4) | parameter
  }
  console.log(b(line, 8));
  s += hex(line) + ' '
}
console.log(s);
