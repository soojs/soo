const _ = require('lodash');
const bcrypt = require('bcrypt');
const config = require('config');

const { Result, UserEnum } = require('../enum');
const ServiceError = require('../common/ServiceError');
const model = require('../model');

const SALT_ROUNDS = config.get('security.passwordSaltRounds');

exports.create = async (user) => {
  const existed = await this.getByUsername(user.username);
  if (existed) {
    throw new ServiceError(Result.Failure.USER_CONFLICT, 'User existed');
  }
  const encryptedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);
  const created = await model.User.create({
    username: user.username,
    password: encryptedPassword,
    salt: '',
    nickname: user.nickname || user.username,
    roles: user.roles || UserEnum.Role.ANONY,
    createBy: user.createBy,
    createAt: _.now(),
  });
  return created;
};

exports.getByUsername = async (username) => {
  const existed = await model.User.findOne({
    where: { username },
    attributes: ['id', 'username', 'nickname', 'createAt', 'updateAt'],
  });
  return existed;
};

exports.updatePassword = async (username, oldPlainPassword, newPlainPassword) => {
  const existed = await model.User.findOne({
    where: { username },
  });
  if (existed === null) {
    throw new ServiceError(Result.Failure.USER_NOT_FOUND, 'User not found');
  }
  const res = await bcrypt.compare(oldPlainPassword, existed.password);
  if (!res) {
    throw new ServiceError(Result.Failure.USER_AUTH_FAIL, 'User auth fail');
  }
  const encryptedPassword = await bcrypt.hash(newPlainPassword, SALT_ROUNDS);
  existed.password = encryptedPassword;
  const updated = await existed.save();
  const user = updated.get({ plain: true });
  delete user.salt;
  delete user.password;
  return user;
};

exports.checkPassword = async (username, plainPassword) => {
  const existed = await model.User.findOne({
    where: { username },
  });
  if (existed === null) {
    throw new ServiceError(Result.Failure.USER_NOT_FOUND, 'User not found');
  }
  const res = await bcrypt.compare(plainPassword, existed.password);
  if (!res) {
    throw new ServiceError(Result.Failure.USER_AUTH_FAIL, 'User auth fail');
  }
  const user = existed.get({ plain: true });
  delete user.salt;
  delete user.password;
  return user;
};
/**
 * 根据用户名删除用户帐户
 * @param {string} username - 用户名
 * @return {number} 删除的数量
 */
exports.remove = async (username) => {
  const deleted = await model.User.destroy({
    where: { username },
  });
  return deleted;
};

exports.getUsers = async (
  { plimit, poffset },
  filters = { status: UserEnum.Status.NORMAL },
) => {
  const options = {
    limit: Math.min(plimit || 10, 10),
    offset: Math.max(poffset || 0, 0),
    include: [],
    attributes: [
      'id', 'username', 'nickname', 'roles',
      'status', 'createAt', 'createBy', 'updateAt', 'updateBy',
    ],
  };
  if (filters) {
    options.where = {};
    if (filters.status) {
      options.where.status = filters.status;
    }
  }
  const page = await model.User.findAndCountAll(options);
  return page;
};
