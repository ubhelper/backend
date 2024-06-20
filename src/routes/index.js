const express   = require('express');
const router    = express.Router();

const client = require('./client');
const admin = require('./admin');
const common = require('./common');

if(process.env.NODE_ENV !== 'production') {
    const morgan = require('morgan');
    router.use(morgan('dev'));
}

router.use('/v1', client);
router.use('/v2', common);
router.use('/a1', admin);

module.exports = router;