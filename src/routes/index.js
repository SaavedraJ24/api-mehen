const express = require('express');
const viewsRouter = require('./views.router');
const apiRouter = require('./api');

const router = express.Router();
router.use('/', viewsRouter);
router.use('/api', apiRouter);
module.exports = router;
