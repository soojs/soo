/**
 * 文档格式
 * @type {Enum}
 */
const Format = Object.freeze({
  MARKDOWN: 0,
  HTML: 1,
});

/**
 * 文档状态
 * @type {Enum}
 */
const Status = Object.freeze({
  DRAFT: 0,
  RELEASE: 1,
});

module.exports = { Format, Status };
