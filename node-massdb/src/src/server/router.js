'use strict';

const router = require('koa-router')();

router.get('/mass/fromMZ', async (ctx) => {
  const search = require('../search/massFromMZ');
  const result = await search(
    ctx.request.query.mz, ctx.request.query.intensity, ctx.request.query);
  ctx.body = { result };
});

module.exports = router;
