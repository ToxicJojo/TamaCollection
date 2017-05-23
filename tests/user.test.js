const assert = require('assert');
const userLib = require('../app/js/user');

const TEST_USER_ID = 'cLuP4gcoz8RuleAz26qia0IR6kR2';

describe('UserLib', () => {
  describe('#getUser()', () => {
    it('should return a user ', (done) => {
      userLib.getUser(TEST_USER_ID, (userSnapshot) => {
        const user = userSnapshot.val();

        assert.equal(user.username, 'Test');
        done();
      });
    });
  });
});
