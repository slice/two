/* eslint-disable callback-return */
const { TokenizerError } = require('./errors');

const R = {
  NUMBERS: /[0-9]/,
  WHITESPACE: /\s/,
  IDENTIFIER: /[A-Za-z?!_@#$%^&*]/,
};

const ids = {
  '(': 'paren',
  ')': 'paren',
  ',': 'comma',
};

module.exports = tokenizer;
function tokenizer(input) {
  let current = 0;
  let tokens = [];

  while (current < input.length) {
    let char = input[current];

    if (char === '(' || char === ')') {
      tokens.push({
        type: 'paren',
        value: char,
      });
      current++;
      continue;
    }

    if (char in ids) {
      tokens.push({
        type: ids[char],
        value: char,
      });
      current++;
      continue;
    }

    if (R.WHITESPACE.test(char)) {
      current++;
      continue;
    }

    if (R.NUMBERS.test(char)) {
      let value = '';

      while (R.NUMBERS.test(char)) {
        value += char;
        char = input[++current];
      }

      tokens.push({ type: 'number', value });
      continue;
    }

    if (char === '"') {
      let value = '';
      char = input[++current];
      while (char !== '"') {
        value += char;
        char = input[++current];
      }
      char = input[++current];
      tokens.push({ type: 'string', value });
      continue;
    }

    if (R.IDENTIFIER.test(char)) {
      let value = '';
      while (R.IDENTIFIER.test(char)) {
        value += char;
        char = input[++current];
      }

      tokens.push({ type: 'name', value });
      continue;
    }

    throw new TokenizerError(`I don't know what to do with "${char}".`);
  }

  return tokens;
}
