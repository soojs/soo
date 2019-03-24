const log4js = require('log4js');

const { levels } = log4js;
const DEFAULT_FORMAT = ':remote-addr - -' +
  ' ":method :url HTTP/:http-version"' +
  ' :status :content-length ":referrer"' +
  ' ":user-agent"';

/**
 * Adds custom {token, replacement} objects to defaults,
 * overwriting the defaults if any tokens clash
 *
 * @param  {IncomingMessage} req
 * @param  {ServerResponse} res
 * @param  {Array} customTokens
 *    [{ token: string-or-regexp, replacement: string-or-replace-function }]
 * @return {Array}
 */
function assembleTokens(ctx, customTokens) {
  const arrayUniqueTokens = (array) => {
    const a = array.concat();
    for (let i = 0; i < a.length; i += 1) {
      for (let j = i + 1; j < a.length; j += 1) {
        // not === because token can be regexp object
        /* eslint eqeqeq:0 */
        if (a[i].token == a[j].token) {
          // eslint-disable-next-line no-plusplus
          a.splice(j--, 1);
        }
      }
    }
    return a;
  };

  /* eslint-disable no-underscore-dangle */
  const defaultTokens = [];
  defaultTokens.push({ token: ':url', replacement: ctx.originalUrl });
  defaultTokens.push({ token: ':protocol', replacement: ctx.protocol });
  defaultTokens.push({ token: ':hostname', replacement: ctx.hostname });
  defaultTokens.push({ token: ':method', replacement: ctx.method });
  defaultTokens.push({
    token: ':status',
    replacement: ctx.response.status || ctx.response.__statusCode || ctx.res.statusCode,
  });
  defaultTokens.push({ token: ':response-time', replacement: ctx.response.responseTime });
  defaultTokens.push({ token: ':date', replacement: new Date().toUTCString() });
  defaultTokens.push({ token: ':referrer', replacement: ctx.headers.referer || '' });
  defaultTokens.push({
    token: ':http-version',
    replacement: `${ctx.req.httpVersionMajor}.${ctx.req.httpVersionMinor}`,
  });
  defaultTokens.push({
    token: ':remote-addr',
    replacement: ctx.headers['x-forwarded-for'] || ctx.ip || ctx.ips
      || (ctx.socket && (ctx.socket.remoteAddress
        || (ctx.socket.socket && ctx.socket.socket.remoteAddress))),
  });
  defaultTokens.push({ token: ':user-agent', replacement: ctx.headers['user-agent'] });
  defaultTokens.push({
    token: ':content-length',
    replacement: (ctx.response._headers && ctx.response._headers['content-length']) ||
      (ctx.response.__headers && ctx.response.__headers['Content-Length']) ||
      ctx.response.length || '-',
  });
  defaultTokens.push({
    token: /:req\[([^\]]+)]/g,
    replacement: function r(_, field) {
      return ctx.headers[field.toLowerCase()];
    },
  });
  defaultTokens.push({
    token: /:res\[([^\]]+)]/g,
    replacement: function r(_, field) {
      return ctx.response._headers
        ? (ctx.response._headers[field.toLowerCase()] || ctx.response.__headers[field])
        : (ctx.response.__headers && ctx.response.__headers[field]);
    },
  });

  const tokens = customTokens.map((token) => {
    if (token.content && typeof token.content === 'function') {
      // eslint-disable-next-line no-param-reassign
      token.replacement = token.content(ctx);
    }
    return token;
  });
  return arrayUniqueTokens(tokens.concat(defaultTokens));
}

/**
 * Return RegExp Object about nolog
 *
 * @param  {String|Array} nolog
 * @return {RegExp}
 * @api private
 *
 * syntax
 *  1. String
 *   1.1 "\\.gif"
 *         NOT LOGGING http://example.com/hoge.gif and http://example.com/hoge.gif?fuga
 *         LOGGING http://example.com/hoge.agif
 *   1.2 in "\\.gif|\\.jpg$"
 *         NOT LOGGING http://example.com/hoge.gif and
 *           http://example.com/hoge.gif?fuga and http://example.com/hoge.jpg?fuga
 *         LOGGING http://example.com/hoge.agif,
 *           http://example.com/hoge.ajpg and http://example.com/hoge.jpg?hoge
 *   1.3 in "\\.(gif|jpe?g|png)$"
 *         NOT LOGGING http://example.com/hoge.gif and http://example.com/hoge.jpeg
 *         LOGGING http://example.com/hoge.gif?uid=2 and http://example.com/hoge.jpg?pid=3
 *  2. RegExp
 *   2.1 in /\.(gif|jpe?g|png)$/
 *         SAME AS 1.3
 *  3. Array
 *   3.1 ["\\.jpg$", "\\.png", "\\.gif"]
 *         SAME AS "\\.jpg|\\.png|\\.gif"
 */
function createNoLogCondition(nolog) {
  let regexp = null;

  if (nolog) {
    if (nolog instanceof RegExp) {
      regexp = nolog;
    }

    if (typeof nolog === 'string') {
      regexp = new RegExp(nolog);
    }

    if (Array.isArray(nolog)) {
      // convert to strings
      const regexpsAsStrings = nolog.map(reg => (reg.source ? reg.source : reg));
      regexp = new RegExp(regexpsAsStrings.join('|'));
    }
  }

  return regexp;
}

/**
 * Return formatted log line.
 *
 * @param  {String} str
 * @param  {IncomingMessage} req
 * @param  {ServerResponse} res
 * @return {String}
 * @api private
 */
function format(str, tokens) {
  let r = str;
  for (let i = 0; i < tokens.length; i += 1) {
    r = r.replace(tokens[i].token, tokens[i].replacement);
  }
  return r;
}

function getKoaLogger(logger4js, opts) {
  let options = null;
  if (typeof opts === 'object') {
    options = opts || {};
  } else if (opts) {
    options = { format: opts };
  } else {
    options = {};
  }

  const thisLogger = logger4js;
  let level = levels.getLevel(options.level, levels.INFO);
  const fmt = options.format || DEFAULT_FORMAT;
  const nolog = options.nolog ? createNoLogCondition(options.nolog) : null;

  return async (ctx, next) => {
    // mount safety
    if (ctx.request._logging) {
      await next();
      return;
    }

    // nologs
    if (nolog && nolog.test(ctx.originalUrl)) {
      await next();
      return;
    }

    if (thisLogger.isLevelEnabled(level) || options.level === 'auto') {
      const start = new Date();
      const { writeHead } = ctx.response;

      // flag as logging
      ctx.request._logging = true;

      // proxy for statusCode.
      ctx.response.writeHead = (code, headers) => {
        ctx.response.writeHead = writeHead;
        ctx.response.writeHead(code, headers);
        ctx.response.__statusCode = code;
        ctx.response.__headers = headers || {};

        // status code response level handling
        if (options.level === 'auto') {
          level = levels.INFO;
          if (code >= 300) level = levels.WARN;
          if (code >= 400) level = levels.ERROR;
        } else {
          level = levels.getLevel(options.level, levels.INFO);
        }
      };

      await next();
      // hook on end request to emit the log entry of the HTTP request.
      ctx.response.responseTime = new Date() - start;
      // status code response level handling
      if (ctx.res.statusCode && options.level === 'auto') {
        level = levels.INFO;
        if (ctx.res.statusCode >= 300) level = levels.WARN;
        if (ctx.res.statusCode >= 400) level = levels.ERROR;
      }
      if (thisLogger.isLevelEnabled(level)) {
        const combinedTokens = assembleTokens(ctx, options.tokens || []);
        if (typeof fmt === 'function') {
          const line = fmt(ctx, str => format(str, combinedTokens));
          if (line) thisLogger.log(level, line);
        } else {
          thisLogger.log(level, format(fmt, combinedTokens));
        }
      } else {
        // ensure next gets always called
        await next();
      }
    }
  };
}

module.exports = () => getKoaLogger(log4js.getLogger('http'), { level: 'auto' });
