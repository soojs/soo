const assert = require('power-assert');

describe('test/hello.js', () => {
  const arr = [1, 2, 3];

  it('power-assert', () => {
    assert(arr[1] === 2);
  });
});
