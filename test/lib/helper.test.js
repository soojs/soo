const assert = require('power-assert');
const helper = require('../../lib/helper');

describe('test/lib/help.test.js', () => {
  describe('#getApiResult', () => {
    it('should be object width code and data', () => {
      const data = {
        count: 0,
        rows: [],
      };
      const resp = helper.getApiResult(data);
      assert(resp.code === 0);
      assert(resp.data === data);
    });
  });

  describe('#extractSummary', () => {
    it('should be empty string', () => {
      const resp = helper.extractSummary(null);
      assert(resp === '');
    });
    it('should be simplified string', () => {
      const data = '这个是**测试内容**';
      let resp = helper.extractSummary(data);
      // 居然有换行符号??
      resp = resp.replace(/[\n\r]/g, '');
      assert(resp === '这个是测试内容');
    });
  });

  describe('#markdown2html', () => {
    it('should be empty string', () => {
      const resp = helper.markdown2html(null);
      assert(resp === '');
    });
    it('should be simplified string', () => {
      const data = '这个是**测试内容**';
      let resp = helper.markdown2html(data);
      // 居然有换行符号??
      resp = resp.replace(/[\n\r]/g, '');
      assert(resp === '<p>这个是<strong>测试内容</strong></p>');
    });
  });

  describe('#timeFormat', () => {
    it('should be empty for invalid time', () => {
      const time = new Date(1949, 10, 1).getTime();
      assert(helper.timeFormat(time, 'yyyy-MM-dd') === '');
    });
    it('should be formatted string', () => {
      const time = new Date(2000, 9, 10, 13, 59, 59);
      assert.equal(helper.timeFormat(time, 'yyyy-MM-dd'), '2000-10-10');
      assert.equal(helper.timeFormat(time, 'yyyy-MM-dd HH:mm:ss'), '2000-10-10 13:59:59');
      assert.equal(helper.timeFormat(time, 'yyyy-MM-dd hh:mm:ss'), '2000-10-10 01:59:59');
      assert.equal(helper.timeFormat(time, 'yyyy-MM-dd hh:mm:ss'), '2000-10-10 01:59:59');
    });
  });

  describe('#randId', () => {
    it('should be different numbers', () => {
      const resp = {};
      for (let i = 0, r = null; i < 100; i += 1) {
        r = helper.randId();
        resp[r] = true;
      }
      assert(Object.keys(resp).length === 100);
    });
  });

  describe('#randString', () => {
    it('should be different strings', () => {
      const resp = {};
      for (let i = 0, r = null; i < 100; i += 1) {
        r = helper.randString();
        assert(r.length === 10);
        resp[r] = true;
      }
      assert(Object.keys(resp).length === 100);
    });
  });
});
