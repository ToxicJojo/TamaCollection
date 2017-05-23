const assert = require('assert');
const util = require('../app/js/util');

const TEST_USER_ID = 'cLuP4gcoz8RuleAz26qia0IR6kR2';

describe('Util', () => {
  describe('#cycleObjectProperties()', () => {
    it('should go through all poperties ', (done) => {
      const testObj = {
        name: 'test',
        age: 42,
      };

      util.cycleObjectProperties(testObj, (key, value) => {
        done();
      });
    });
  });
});
