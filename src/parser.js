const { ParserError } = require('./errors');

function expect(currentToken, types) {
  if (Array.isArray(types)) {
    if (!types.includes(currentToken.type)) {
      throw ParserError(
        `Expected current token to be one of: ${types.join(
          ', '
        )}, instead found it to be of type "${currentToken.type}"`
      );
    }
  } else if (currentToken.type !== types) {
    throw ParserError(
      `Expected current token to be of type "${types}", instead found it to be of type "${
        currentToken.type
      }".`
    );
  }
}

module.exports = parser;
function parser(tokens) {
  let current = 0;

  function walk() {
    let token = tokens[current];

    function peek() {
      if (current + 1 > tokens.length - 1) return null;
      return tokens[current + 1];
    }
    const next = peek();

    if (token.type === 'number' || token.type === 'string') {
      current++;
      return token;
    }

    if (token.type === 'brace' && token.value === '{') {
      let node = {
        type: 'block',
        body: [],
      };

      token = [++current]; // skip {

      while (token.type !== 'brace' && token.type !== '}') {
        node.body.push(walk());
        token = tokens[current];
      }

      current++; // skip }
      return node;
    }

    if (token.type === 'name' && next.type === 'assign') {
      let node = {
        type: 'assign',
        name: token.type,
        value: null,
      };

      // skip name and =
      current += 2;
      token = tokens[current];

      node.value = walk();
      return node;
    }

    if (token.type === 'name' && next.type === 'paren') {
      let node = {
        type: 'call',
        name: token.value,
        params: [],
      };

      token = tokens[++current]; // skip name
      token = tokens[++current]; // skip (

      while (token.type !== 'paren' && token.type !== ')') {
        node.params.push(walk());
        token = tokens[current];
        if (token.type === 'comma') token = tokens[++current];
      }

      current++; // skip )
      return node;
    }

    throw new ParserError(`Unexpected token of type "${token.type}".`);
  }

  let ast = {
    type: 'program',
    body: [],
  };

  while (current < tokens.length) ast.body.push(walk());

  return ast;
}
