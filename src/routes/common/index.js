const express = require('express');
const router = express.Router();

const commonRouter = require('./commonRouter');

router.use('/common', commonRouter);

module.exports = router;