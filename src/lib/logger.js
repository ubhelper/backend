const log4js = require('log4js');

module.exports.getLogger = ({ logLevel, title = 'it-wizard-main' } = {}) => {

    const logger = log4js.getLogger(title);
    
    if (!logLevel) {
        logLevel = (process.env.NODE_ENV !== 'PRODUCTION') ? 'DEBUG' : 'ERROR';
    }
    
    logger.level = logLevel;
    
    return logger;
};