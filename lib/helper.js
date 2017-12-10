const marked = require('marked')

/**
 * 摘要生成算法
 * @param {String} content
 * @return {String}
 */
exports.extractSummary = function extractSummary(content) {
    if (!content) {
        return ''
    }
    content = this.markdown2html(content)
    content = content.replace(/<[^>]+>/g, '')
    let size = Math.min(content.length, 300)
    return content.substring(0, size)
}
/**
 * 将markdown转成html
 * @param {String} content
 * @return {String}
 */
exports.markdown2html = function markdown2html(content) {
    if (!content) {
        return ''
    }
    return marked(content)
}