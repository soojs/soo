const assert = require('power-assert');
const helper = require('../../app/lib/helper');
const { PostService } = require('../../app/services');

describe('test/api/post.test.js', () => {
  before(() => {
    this.cache = {};
  });
  after(() => {
    delete this.cache;
  });

  describe('#create', () => {
    it('should create post and return the created data', async () => {
      const post = {
        title: `您好啊，title-${helper.randId()}`,
        content: `这是**测试**，content-${helper.randId()}`,
      };
      const created = await PostService.create(post);
      assert(created.id > 0);
      assert(created.title === post.title);
      assert(created.content === helper.markdown2html(post.content));
    });
  });
});
