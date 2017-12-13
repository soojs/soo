const assert = require('power-assert');
const helper = require('../../lib/helper');
const { UserService } = require('../../services');

describe('test/api/user.test.js', () => {
  before(() => {
    this.cache = {};
  });
  after(() => {
    delete this.cache;
  });

  describe('#create', () => {
    it('should create user and return the created data', async () => {
      const user = {
        username: `linh-${helper.randId()}`,
        password: `123qwe-${helper.randId()}`,
      };
      const created = await UserService.create(user);
      assert(created.id > 0);
      assert(created.username === user.username);
      assert(created.password !== user.password);
      assert(created.roles === 'anony');
    });
  });
});
