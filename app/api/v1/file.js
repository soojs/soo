const co = require('co');
const oss = require('ali-oss');
const path = require('path');
const config = require('config');
const busboy = require('async-busboy');

const { getApiResult } = require('../../lib/helper');

function checkFiles() {
  return true;
}

function getDir() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = d.getMonth() + 1;
  const mmStr = (mm < 10 ? '0' : '') + mm;
  const dd = d.getDate();
  const ddStr = (dd < 10 ? '0' : '') + dd;
  return `${yyyy}${mmStr}${ddStr}`;
}

const {
  region, bucket, accessKeyId, accessKeySecret,
} = config.get('aliyun.oss');
// 阿里云oss客户端
const client = oss({
  region,
  bucket,
  accessKeyId,
  accessKeySecret,
});

function upload2aliyun(stream) {
  return co(function* upload() {
    client.useBucket(config.get('aliyun.oss.bucket'));
    const r = yield client.putStream(`${getDir()}/${path.basename(stream.filename)}`, stream);
    return r;
  });
}

exports.upload = async (ctx) => {
  if (ctx.method !== 'POST' && !ctx.request.is('multipart/*')) {
    ctx.throw(403);
  }
  const { files, fields } = await busboy(ctx.req);
  if (checkFiles(fields)) {
    const r = await Promise.all(files.map(upload2aliyun));
    ctx.body = getApiResult(r);
  } else {
    ctx.body = getApiResult('error', 403);
  }
};
