const assert = require('power-assert');
const helper = require('../../app/lib/helper');
const Const = require('../../app/common/const');
const { PostService } = require('../../app/services');

describe('test/api/post.test.js', () => {
  const tempPostTitle = '您好啊，title';
  const tempPostContent = '这是**测试**，content';

  before(async () => {
    this.cache = [];
    // 插入一个备用数据
    const created = await PostService.create({
      title: tempPostTitle,
      content: tempPostContent,
    });
    this.cache.push(created);
  });
  after(() => {
    // 删除插入的备用数据
    this.cache.forEach(async (post) => {
      await PostService.remove(post.id);
    });
    delete this.cache;
  });

  describe('#create', () => {
    let tempPostId = 0;

    after(async () => {
      await PostService.remove(tempPostId);
    });

    it('should create post and return the created data', async () => {
      const post = {
        title: `您好啊，title-${helper.randId()}`,
        content: `这是**测试**，content-${helper.randId()}`,
      };
      const created = await PostService.create(post);
      tempPostId = created.id;

      const existed = await PostService.getById(tempPostId);
      assert(existed !== null);
      assert(existed.id > 0);
      assert(existed.title === post.title);
      assert(existed.content === helper.markdown2html(post.content));
    });
  });

  describe('#publish', () => {
    let tempPostId = 0;

    before(async () => {
      const created = await PostService.create({
        title: tempPostTitle,
        content: tempPostContent,
      });
      assert(created.status === Const.POST_STATUS.DRAFT);
      tempPostId = created.id;
    });
    after(async () => {
      await PostService.remove(tempPostId);
    });

    it('should update post and return the updated data with status 1', async () => {
      const updated = await PostService.publish(tempPostId);
      assert(updated.status === Const.POST_STATUS.RELEASE);
    });
  });

  describe('#getPosts', () => {
    it('should return the page data with count and rows field', async () => {
      const page = await PostService.getPosts({ limit: 10, offset: 0 });
      assert(page.count > 0);
      assert(page.rows.length > 0);
    });
  });
});
