const {StatusCodes} = require('http-status-codes');

const RESPONSE_FIELD = {
    CODE : 'code',
    MSG : 'message',
    DATA : 'data',

    ROWS : 'rows',
    TOTAL : 'total',
    PAGE : 'page',
};

const RESPONSE_CODE = {
    SUCCESS             : { [RESPONSE_FIELD.CODE] : StatusCodes.OK , [RESPONSE_FIELD.MSG] : 'Success' },
    CONTACT_ADMIN       : { [RESPONSE_FIELD.CODE] : StatusCodes.INTERNAL_SERVER_ERROR , [RESPONSE_FIELD.MSG] : 'Please contact the administrator' },

    REQUIRED_FIELD      : { [RESPONSE_FIELD.CODE] : StatusCodes.BAD_REQUEST  , [RESPONSE_FIELD.MSG] : 'Please fill the required field' },
    FORBIDDEN           : { [RESPONSE_FIELD.CODE] : StatusCodes.FORBIDDEN    , [RESPONSE_FIELD.MSG] : 'Invalid authentication'},
    NO_TOKEN            : { [RESPONSE_FIELD.CODE] : StatusCodes.BAD_REQUEST  , [RESPONSE_FIELD.MSG] : 'No Token' },
    TOKEN_EXPIRED       : { [RESPONSE_FIELD.CODE] : StatusCodes.UNAUTHORIZED , [RESPONSE_FIELD.MSG] : 'TokenExpiredError: jwt expired' },
    INVALID_TOKEN       : { [RESPONSE_FIELD.CODE] : StatusCodes.UNAUTHORIZED , [RESPONSE_FIELD.MSG] : 'Invalid Token' },
    VERIFY_TOKEN_FAIL   : { [RESPONSE_FIELD.CODE] : StatusCodes.UNAUTHORIZED , [RESPONSE_FIELD.MSG] : 'Verify Token fail' },

    WRONG_ACCOUNT     : { [RESPONSE_FIELD.CODE] : StatusCodes.UNAUTHORIZED  , [RESPONSE_FIELD.MSG] : 'The account is incorrect' },
    WRONG_PASSWORD    : { [RESPONSE_FIELD.CODE] : StatusCodes.UNAUTHORIZED  , [RESPONSE_FIELD.MSG] : 'The current password is incorrect' },

    ID_DUPLICATE      : { [RESPONSE_FIELD.CODE] : StatusCodes.CONFLICT      , [RESPONSE_FIELD.MSG] : 'The user ID is duplicated' },

    NO_DATA           : { [RESPONSE_FIELD.CODE] : StatusCodes.NO_CONTENT     , [RESPONSE_FIELD.MSG] : 'No data' },

    DB_ERROR          : { [RESPONSE_FIELD.CODE] : StatusCodes.INTERNAL_SERVER_ERROR , [RESPONSE_FIELD.MSG] : 'Database processing Error' },
    
    FILE_ERROR      : { [RESPONSE_FIELD.CODE] : StatusCodes.BAD_REQUEST  , [RESPONSE_FIELD.MSG] : 'File not uploaded' },
}

module.exports = {
    RESPONSE_FIELD : RESPONSE_FIELD,
    RESPONSE_CODE : RESPONSE_CODE,
};