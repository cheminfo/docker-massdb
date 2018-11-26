'use strict';

const router = require('koa-router')();

router.get('/json/(.*)', async (ctx) => {
  const search = require('./search/json');
  let result = await search(ctx.request.url);
  ctx.body = result;
});

router.get('/jcamp/(.*)', async (ctx) => {
  const search = require('./search/jcamp');
  let result = await search(ctx.request.url);
  ctx.body = result;
});

router.get('/search/mass', async (ctx) => {
  const search = require('./search/mass');
  const result = await search(ctx.request.query);
  ctx.body = result;
});

module.exports = router;
