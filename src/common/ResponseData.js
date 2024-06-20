const ResponseBase = require('./ResponseBase');
const {RESPONSE_FIELD } = require('./ResponseConst');
const {StatusCodes} = require('http-status-codes');

class ResponseData extends ResponseBase {

    constructor(requestData = null, code = StatusCodes.OK){

        super({
            [RESPONSE_FIELD.CODE] : code,
        }, requestData);

    }
}

module.exports = ResponseData;