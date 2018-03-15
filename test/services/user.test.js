const assert = require('power-assert');
const helper = require('../../app/lib/helper');
const Const = require('../../app/common/const');
const { UserService } = require('../../app/services');

describe('test/api/user.test.js', () => {
  const tempUsername = 'temp';
  const tempPassword = '123qwe';

  before(async () => {
    this.cache = {};
    // 插入一个备用数据
    await UserService.create({
      username: tempUsername,
      password: tempPassword,
    });
  });
  after(async () => {
    delete this.cache;
    // 删除插入的备用数据
    await UserService.remove(tempUsername);
  });

  describe('#getByUsername', async () => {
    it(`should return a user named ${tempUsername}`, async () => {
      const existed = await UserService.getByUsername(tempUsername);
      assert(existed.id > 0);
      assert(existed.username === tempUsername);
    });
  });

  describe('#updatePassword', async () => {
    const newPlainPassword = 'a123456';

    after(async () => {
      // 还原密码
      await UserService
        .updatePassword(tempUsername, newPlainPassword, tempPassword);
    });

    // 更新密码
    it(`should return the updated ${tempUsername}'s data`, async () => {
      const updated = await UserService
        .updatePassword(tempUsername, tempPassword, newPlainPassword);
      assert(updated.id > 0);
      assert(updated.username === tempUsername);
    });
    // 不存在的用户名
    it('should throw a ServiceError for unexisted user', async () => {
      try {
        const updated = await UserService
          .updatePassword('unexisetedUsername', tempPassword, newPlainPassword);
        assert(updated.id > 0);
      } catch (e) {
        assert(e.code === Const.ERROR.USER_NOT_FOUND);
      }
    });
    // 错误的原始密码
    it('should throw a ServiceError for wrong pasasword', async () => {
      try {
        const updated = await UserService
          .updatePassword(tempUsername, tempPassword, newPlainPassword);
        assert(updated.id > 0);
      } catch (e) {
        assert(e.code === Const.ERROR.USER_AUTH_FAIL);
      }
    });
  });

  describe('#checkPassword', () => {
    // 返回用户信息，不包含加密盐和密码字段
    it('should return the existed user exclude `salt` and `password` fields', async () => {
      const existed = await UserService.checkPassword(tempUsername, tempPassword);
      assert(existed.id > 0);
      assert(existed.username === tempUsername);
      assert(existed.salt === undefined);
      assert(existed.password === undefined);
    });
    // 不存在的用户名
    it('should throw a ServiceError for unexisted user', async () => {
      try {
        const updated = await UserService
          .checkPassword('unexisetedUsername', tempPassword);
        assert(updated.id > 0);
      } catch (e) {
        assert(e.code === Const.ERROR.USER_NOT_FOUND);
      }
    });
    // 错误的原始密码
    it('should throw a ServiceError for wrong pasasword', async () => {
      try {
        const updated = await UserService
          .checkPassword(tempUsername, 'wraongPassword');
        assert(updated.id > 0);
      } catch (e) {
        assert(e.code === Const.ERROR.USER_AUTH_FAIL);
      }
    });
  });

  describe('#create', () => {
    const user = {
      username: `linh-${helper.randId()}`,
      password: `123qwe-${helper.randId()}`,
    };

    after(async () => {
      await UserService.remove(user.username);
    });

    it('should create user and return the created data', async () => {
      const created = await UserService.create(user);
      assert(created.id > 0);
      assert(created.username === user.username);
      assert(created.password !== user.password);
      assert(created.roles === Const.ROLES.ANONY);
    });
    it('should throw a ServiceError for existed username', async () => {
      try {
        const created = await UserService.create(user);
        assert(created.id > 0);
      } catch (e) {
        assert(e.code === Const.ERROR.USER_EXIST);
      }
    });
  });
});
