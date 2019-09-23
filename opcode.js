var INS_CODE = {
  LDA: 0,
  ADD: 1,
  OUT: 2,
  JMP: 4,
  JC: 5,
  JZ: 6,
  SUB: 7,
  LDI: 8,
  STA: 9,
  HLT: 15,
};

var OP = {
  HA: 0b10000000000000000,
  MI: 0b01000000000000000,
  RO: 0b00100000000000000,
  RI: 0b00010000000000000,
  II: 0b00001000000000000,
  IO: 0b00000100000000000,
  CE: 0b00000010000000000,
  CO: 0b00000001000000000,
  JU: 0b00000000100000000,
  AI: 0b00000000010000000,
  AO: 0b00000000001000000,
  SO: 0b00000000000100000,
  BI: 0b00000000000010000,
  BO: 0b00000000000001000,
  OI: 0b00000000000000100,
  SU: 0b00000000000000010,
  FI: 0b00000000000000001,
};

var template = [OP.CO | OP.MI, OP.RO | OP.II | OP.CE];

var INS = {
  LDA: [...template, OP.IO | OP.MI, OP.RO | OP.AI],
  ADD: [...template, OP.IO | OP.MI, OP.RO | OP.BI, OP.SO | OP.AI | OP.FI],
  SUB: [
    ...template,
    OP.IO | OP.MI,
    OP.RO | OP.BI,
    OP.SO | OP.AI | OP.SU | OP.FI,
  ],
  OUT: [...template, OP.AO | OP.OI],
  HLT: [...template, OP.HA],
  JMP: [...template, OP.IO | OP.JU],
  JC: [...template],
  JZ: [...template],
  LDI: [...template, OP.IO | OP.AI],
  STA: [...template, OP.IO | OP.MI, OP.AO | OP.RI],
};

MICROOPT_COUNT = Object.keys(OP).length;

function b(x, n) {
  return x.toString(2).padStart(n, '0');
}

function hex(x, n = 0) {
  return x.toString(16).padStart(n, '0');
}

var data = {};

Object.keys(INS).forEach(instruction => {
  const steps = INS[instruction];
  steps.forEach((step, index) => {
    for (let x = 0; x < 2 ** 2; x++) {
      address = (((INS_CODE[instruction] << 3) | index) << 2) | x;
      data[address] = step;
      // console.log(b(address, 9), b(step, MICROOPT_COUNT));
    }
  });
});

// Jump Carry + Jump Zero
data[(((INS_CODE.JC << 3) | 2) << 2) | 2] = OP.IO | OP.JU;
//    |instruction    |step 2 (3 bit)  10 (carry bit on, zero bit off)
//                     step 0 and step 1 are from template
data[(((INS_CODE.JC << 3) | 2) << 2) | 3] = OP.IO | OP.JU;
//    |instruction    |step 2 (3 bit)  11 (carry bit on, zero bit on)

data[(((INS_CODE.JZ << 3) | 2) << 2) | 1] = OP.IO | OP.JU;
//    |instruction    |step 2 (3 bit)  01 (carry bit off, zero bit on)
//                     step 0 and step 1 are from template
data[(((INS_CODE.JZ << 3) | 2) << 2) | 3] = OP.IO | OP.JU;
//    |instruction    |step 2 (3 bit)  11 (carry bit on, zero bit on)

function buildOpcodeROM() {
  var s = '';

  for (let i = 0; i < 2 ** 9; i++) {
    s += hex(data[i] || 0, 5) + ' ';
    if ((i + 1) % 8 == 0) {
      s += '\n';
    }
  }

  return s.trim();
}

exports.INS_CODE = INS_CODE;
exports.b = b;
exports.hex = hex;
exports.buildOpcodeROM = buildOpcodeROM;
