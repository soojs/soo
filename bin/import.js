#!/usr/bin/env node

const co = require('co');
const fs = require('fs');
const path = require('path');
const yaml = require('yaml-front-matter');

const models = require('../app/models');
const { PostService } = require('../app/services');

const args = process.argv.splice(2);
args.forEach((item) => {
  const target = path.join(__dirname, item);
  fs.readFile(target, { encoding: 'utf-8', flag: 'r' }, (error, result) => {
    if (error) {
      console.error(error); // eslint-disable-line no-console
      return;
    }
    const json = yaml.loadFront(result, 'content');
    co(function* create() {
      const created = yield PostService
        .createPost({
          tags: json.tags,
          desc: json.desc,
          title: json.title,
          content: json.content,
          permalink: json.permalink,
          createAt: json.date,
          createBy: json.author,
        });
      return created;
    }).then((resp) => {
      console.log('导入成功：', resp); // eslint-disable-line no-console
      models.client.close();
    }).catch((err) => {
      console.error('导入失败：', err); // eslint-disable-line no-console
      models.client.close();
    });
  });
});
