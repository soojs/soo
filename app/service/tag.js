const _ = require('lodash');
const model = require('../model');

const { Op } = model.client;
/**
 * 分页获取tag列表
 * @param {object} param0 分页参数：`{plimit: 10, poffset: 0}`
 * @param {boolean} includeCount 是否统计每个tag所包含的post总数
 */
exports.getTags = async (
  { plimit, poffset },
  includeCount = false,
) => {
  const options = {
    limit: Math.min(plimit || 50, 50),
    offset: Math.max(poffset || 0, 0),
  };
  if (includeCount) {
    // TODO 统计总数
  }
  const list = await model.Tag.findAll(options);
  return list;
};
/**
 * 分页获取可读的tag列表(即有关联的post)
 * @param {object} param0 分页参数：`{plimit: 10, poffset: 0}`
 * @param {boolean} includeCount 是否统计每个tag所包含的post总数
 */
exports.getReadableTags = async ({ plimit, poffset }) => {
  const list = await model.TagPost.findAll({
    limit: Math.min(plimit || 50, 50),
    offset: Math.max(poffset || 0, 0),
    group: ['tagId'],
    attributes: [
      'tagId',
      [model.client.fn('COUNT', 'tagId'), 'count'],
    ],
    having: model.client.literal('count(1) > 0'),
  });
  const ids = [];
  const map = {};
  _.each(list, (item) => {
    ids.push(item.id);
    map[item.id] = item.count;
  });
  const tags = await model.Tag.findAll({
    where: {
      id: { [Op.in]: ids },
    },
  });
  _.each(tags, (tag) => {
    tag.count = map[tag.id]; // eslint-disable-line no-param-reassign
  });
  return list;
};

/**
 * 批量删除某个tag与post的对应关系（不做删除标签对象动作，由外部操作）
 * @param {string} tagId
 */
// eslint-disable-next-line no-underscore-dangle
exports._batchDeleteByTagId = async (tagId) => {
  const result = await model.TagPost.destroy({
    where: {
      tagId: { [Op.eq]: tagId },
    },
  });
  return result;
};

/**
 * 批量删除某个post对应的标签（只删除关联关系，并不删除标签对象）
 * @param {string} postId
 */
// eslint-disable-next-line no-underscore-dangle
exports._batchDeleteByPostId = async (postId) => {
  const result = await model.TagPost.destroy({
    where: {
      postId: { [Op.eq]: postId },
    },
  });
  return result;
  // const existed = await model.TagPost.findAll({
  //   where: { postId },
  //   // include: [{
  //   //   model: model.Tag,
  //   //   as: 'tag',
  //   // }],
  // });
  // if (existed && existed.length > 0) {
  //   const tagIds = _.map(existed, item => item.tagId);
  //   await model.Tag.destroy({
  //     where: { id: { [Op.in]: tagIds } },
  //   });
  // }
};

// eslint-disable-next-line no-underscore-dangle
exports._batchCreate = async (postId, tags) => {
  const values = _.map(tags, item => ({
    name: item,
  }));
  await model.Tag.bulkCreate(values, {
    updateOnDuplicate: ['name'], // only supported by mysql
  });
  // how egg pain!
  const savedTags = await model.Tag.findAll({
    where: {
      name: { [Op.in]: tags },
    },
  });
  const tagPosts = _.map(savedTags, item => ({
    tagId: item.id,
    postId,
  }));
  await this._batchDeleteByPostId(postId);
  const result = await model.TagPost.bulkCreate(tagPosts);
  return result;
};

exports.batchCreate = async ({ postId, tags }) => {
  if (!postId || !tags || !tags.length) {
    return [];
  }
  const result = await model.client.transaction(() => this._batchCreate(postId, tags));
  return result;
};
