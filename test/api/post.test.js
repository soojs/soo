// const assert = require('power-assert');
// const request = require('supertest');
// const app = require('../../bin/www');
// const helper = require('../../lib/helper');

// describe('test/api/post.test.js', () => {
//   before(() => {
//     this.agent = request.agent(app);
//   });
//   after(() => {
//   });

//   describe('GET /', () => {
//     it('should status 200 and get the body', async () => {
//       const result = await this.agent
//         .get('/api/v1/post/')
//         .set('Accept', 'application/json')
//         .expect(200);
//       assert(result !== null);
//       assert(result.body !== null);
//       assert(result.body.code === 0);
//       assert(result.body.data !== null);
//     });
//   });
//   describe('POST /', () => {
//     it('should create post and return the created data', async () => {
//       const post = {
//         title: `您好啊，title-${helper.randId()}`,
//         content: `这是测试，content-${helper.randId()}`,
//       };
//       const result = await this.agent
//         .post('/api/v1/post/')
//         .set('Accept', 'application/json')
//         .send(post)
//         .expect('Content-Type', /json/)
//         .expect(200);
//       assert(result !== null);
//       assert(result.body !== null);

//       const { code, data } = result.body;
//       assert(code === 0);
//       assert(data != null);
//       assert(data.id > 0);
//       assert(data.title === post.title);
//     });
//   });
// });
