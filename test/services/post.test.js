const assert = require('power-assert');
const helper = require('../../app/lib/helper');
const Constant = require('../../app/common/Constant');
const { PostService } = require('../../app/service');

describe('test/api/post.test.js', () => {
  const tempPostTitle = '您好啊，title';
  const tempPostContent = '这是**测试**，content';

  before(async () => {
    this.cache = [];
    // 插入一个发布数据
    const published = await PostService.create({
      title: tempPostTitle,
      content: tempPostContent,
      permalink: 'test',
    });
    await PostService.publish(published.id);
    this.cache.push(published);

    // 插入一个未发布数据
    const unpublish = await PostService.create({
      title: tempPostTitle,
      content: tempPostContent,
    });
    this.cache.push(unpublish);
  });
  after(async () => {
    // 删除插入的备用数据
    await Promise.all(this.cache.map(async (post) => {
      await PostService.remove(post.id);
    }));
    delete this.cache;
  });

  describe('#getById', () => {
    it('should return the existed data and has no meta for unpublished data', async () => {
      const tempPostId = this.cache[1].id;

      const post = await PostService.getById(tempPostId);
      assert(post != null);
      assert(post.meta === null);
    });
  });

  describe('#getById', () => {
    it('should return the existed data and increase pageview count', async () => {
      const tempPostId = this.cache[0].id;

      const post1 = await PostService.getById(tempPostId);
      assert(post1 !== null);
      assert(post1.meta !== null);

      const post2 = await PostService.getById(tempPostId);
      assert(post2 !== null);
      assert(post2.meta != null);

      assert(post2.meta.pageview === post1.meta.pageview + 1);
    });
  });

  describe('#getByPermalink', () => {
    it('should return the existed data and increase pageview count', async () => {
      const tempPostPermalink = this.cache[0].permalink;

      const post1 = await PostService.getByPermalink(tempPostPermalink);
      assert(post1 !== null);
      assert(post1.meta !== null);

      const post2 = await PostService.getByPermalink(tempPostPermalink);
      assert(post2 !== null);
      assert(post2.meta != null);

      assert(post2.meta.pageview === post1.meta.pageview + 1);
    });
  });

  describe('#getPosts', () => {
    it('should return the page data with count and rows field', async () => {
      const page = await PostService.getPosts({ limit: 10, offset: 0 });
      assert(page.count > 0);
      assert(page.rows.length > 0);
    });
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

      // assert markdown content
      const post2 = await PostService.getById(tempPostId, Constant.POST_FMT.MARKDOWN);
      assert(post2 !== null);
      assert(post2.title === post.title);
      assert(post2.contents.length > 0);
      assert(post2.contents[0].content === post.content);
    });
  });

  describe('#update', () => {
    const post = {
      title: `您好啊，title-${helper.randId()}`,
      content: `这是**测试**，content-${helper.randId()}`,
    };

    it('should return null if data does not found', async () => {
      const tempPostId = -1;
      const updated = await PostService.update(tempPostId, post);
      assert(updated === null);
    });
    it('should create post and return the created data', async () => {
      const tempPostId = this.cache[0].id;
      const updated = await PostService.update(tempPostId, post);
      assert(updated !== null);

      // assert html content
      const post1 = await PostService.getById(tempPostId);
      assert(post1 !== null);
      assert(post1.title === post.title);
      if (post1.content) {
        assert(post1.content === helper.markdown2html(post.content));
      }

      // assert markdown content
      const post2 = await PostService.getById(tempPostId, Constant.POST_FMT.MARKDOWN);
      assert(post2 !== null);
      assert(post2.title === post.title);
      assert(post2.contents.length > 0);
      assert(post2.contents[0].content === post.content);
    });
  });

  describe('#publish', () => {
    let tempPostId = 0;

    before(async () => {
      const created = await PostService.create({
        title: tempPostTitle,
        content: tempPostContent,
      });
      assert(created.status === Constant.POST_STATUS.DRAFT);
      tempPostId = created.id;
    });
    after(async () => {
      await PostService.remove(tempPostId);
    });

    it('should update post and return the updated data with status 1', async () => {
      const updated = await PostService.publish(tempPostId);
      assert(updated.status === Constant.POST_STATUS.RELEASE);
    });
  });
});
