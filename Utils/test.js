const assert = require('assert');
const { passwordValidator, emailValidator } = require('./stringValidator');

function utilsTest() {
  describe('utils', () => {
    it('should return the true when string has@', () => {
      const expectedResult = true;
      const input = 'test@gmail.com';
      const result = emailValidator(input);
      assert.strictEqual(result, expectedResult);
    });
  });
}
module.exports = utilsTest;
