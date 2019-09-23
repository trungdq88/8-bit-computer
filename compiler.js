const { INS_CODE, hex } = require('./opcode.js');

exports.parse = function compile(source) {
  return source
    .trim()
    .split(/[\n\r]/)
    .map(line => {
      const [command, param] = line.trim().split(' ');

      if (command === '') {
        return [];
      }

      if (param === undefined) {
        return [Number(command)];
      }

      return [command, Number(param)];
    });
};

exports.compile = function(source) {
  const parsed = exports.parse(source);
  var s = [];

  for (let i = 0; i < parsed.length; i++) {
    let line = '';
    if (parsed[i].length == 1) {
      line = parsed[i][0];
    } else {
      const [instruction, parameter = 0] = parsed[i];
      const opCode = INS_CODE[instruction];
      line = (opCode << 4) | parameter;
    }
    // console.log(b(line, 8));
    s.push(line);
  }
  return s;
};
