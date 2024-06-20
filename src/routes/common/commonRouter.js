const express = require('express');
const apicache = require('apicache');
let cache = apicache.middleware;
const router = express.Router();

const controller = require('../../controller/CommonController');

router.get('/download/:fileId?', cache('1 day'), controller.download);

module.exports = router;