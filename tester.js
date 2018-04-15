const { inspect } = require('util');
const { parser, tokenizer } = require('./src');

const i = (...values) =>
  console.log(
    inspect(...values, {
      colors: true,
      depth: null,
    })
  );

const code = `
  hello(1, 2, 3)
  there()
`;

console.log('program code:\n\n' + code + '\n');

const tokens = tokenizer(code);
i(tokens);

const ast = parser(tokens);
i(ast);
