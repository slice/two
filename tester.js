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
{
  this(1, 2, 3)
  thing()
  a = 1
}

object()
nested(call())
`;

console.log('program code:\n\n' + code + '\n');

const tokens = tokenizer(code);
i(tokens);

const ast = parser(tokens);
i(ast);
