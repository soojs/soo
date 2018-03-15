const marked = require('marked');

/**
 * 封装统一的JSON响应
 * @param {object} data - 返回数据
 * @param {number} code - 响应状态码
 * @return {object} 统一的JSON对象
 */
exports.getApiResult = (data, code = 0) => ({ code, data });

/**
 * 摘要生成算法
 * @param {string} content - 原始内容
 * @return {string} 摘要内容
 */
exports.extractSummary = (content) => {
  if (!content) {
    return '';
  }
  let summary = this.markdown2html(content);
  summary = summary.replace(/<[^>]+>/g, '');

  const size = Math.min(content.length, 300);
  return summary.substring(0, size);
};

/**
 * 将`markdown`转成`html`
 * @param {string} content - 原始`markdown`内容
 * @return {string} 转义的`html`内容
 */
exports.markdown2html = (content) => {
  if (!content) {
    return '';
  }
  return marked(content);
};

/**
 * 时间格式化
 * @param {number} time - 日期的时间戳
 * @param {string} fmt - 格式
 * @return {string} 格式化的字符串
 */
exports.timeFormat = (time, fmt) => {
  const startTime = new Date('1970-01-01 0:0:0').getTime();
  if (time < startTime) {
    return '';
  }
  const date = new Date(time);
  const week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const map = {
    E: week[`${date.getDay()}`],
    y: date.getFullYear(),
    M: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, // 12小时制度
    H: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds(),
    q: Math.floor((date.getMonth() + 3) / 3),
    S: date.getMilliseconds(),
  };

  let formated = fmt;
  Object.keys(map).forEach((key) => {
    formated = formated.replace(new RegExp(`${key}+`, 'g'), ($0) => {
      const value = (key !== 'E') ? `000${map[key]}` : map[key];
      return value.substr(value.length - $0.length >= 0 ? value.length - $0.length : 0);
    });
  });
  return formated;
};

/**
 * 获取随机ID
 * @return {number}
 */
exports.randId = () => Math.floor(Math.random() * 100000000);

const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
/**
 * 获取随机字符串
 * @param {number} length - 随机字符串长度
 * @return {string} 随机字符串
 */
exports.randString = (length = 10) => {
  const result = [];
  for (let i = 0, rnum = 0; i < length; i += 1) {
    rnum = Math.floor(Math.random() * chars.length);
    result.push(chars.charAt(rnum));
  }
  return result.join('');
};
