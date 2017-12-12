const bcrypt = require('bcrypt');
const Const = require('../common/const');
const ServiceError = require('../common/ServiceError');
const models = require('../models');

exports.create = async (user) => {
  const existed = await this.getByUsername(user.username);
  if (existed) {
    throw new ServiceError(Const.ERROR.USER_EXIST, 'User existed');
  }
  const encryptedPassword = await bcrypt.hash(user.password, Const.SALT_ROUNDS);
  const created = await models.User.create({
    username: user.username,
    password: encryptedPassword,
    salt: '',
    nickname: user.nickname || user.username,
    roles: user.roles || Const.ROLES.ANONY,
    createBy: user.createBy,
    createAt: Date.now(),
  });
  return created === null ? null : created.get({ plain: true });
};

exports.getByUsername = async (username) => {
  const existed = await models.User.findOne({
    where: { username },
    attributes: ['id', 'username', 'nickname', 'createAt', 'updateAt'],
  });
  return existed === null ? null : existed.get({ plain: true });
};

exports.updatePassword = async (username, oldPlainPassword, newPlainPassword) => {
  const existed = await models.User.findOne({
    where: { username },
  });
  if (existed === null) {
    throw new ServiceError(Const.ERROR.USER_NOT_FOUND, 'User not found');
  }
  const res = await bcrypt.compare(oldPlainPassword, existed.password);
  if (res) {
    const encryptedPassword = await bcrypt.hash(newPlainPassword, Const.SALT_ROUNDS);
    existed.password = encryptedPassword;
    const updated = await existed.save();
    const user = updated.get({ plain: true });
    delete user.salt;
    delete user.password;
    return user;
  }
  return null;
};

exports.checkPassword = async (username, plainPassword) => {
  const existed = await models.User.findOne({
    where: { username },
  });
  if (existed === null) {
    throw new ServiceError(Const.ERROR.USER_NOT_FOUND, 'User not found');
  }
  const res = await bcrypt.compare(plainPassword, existed.password);
  if (res) {
    const user = existed.get({ plain: true });
    delete user.salt;
    delete user.password;
    return user;
  }

  return null;
};
