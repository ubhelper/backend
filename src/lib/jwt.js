const jwt = require('jsonwebtoken');
const RequestData = require('../common/RequestData');
const ResponseData = require('../common/ResponseData');
const {DATA_FIELD_NAME} = require('../common/Constant');
const {RESPONSE_CODE} = require('../common/ResponseConst');
const { response } = require('express');


const getJWTToken = (payload) => {
    const token = jwt.sign(
        {
            data : payload
        },
        process.env.SECRET_KEY,
        {
            expiresIn : process.env.EXPIRE_MIN,
            issuer : process.env.ISSUER,
        }
    );
    return token;
}

const getPayload = (req) => {
    const requestData = new RequestData(req.headers);
    const responseData = new ResponseData();

    if ( req.headers.hasOwnProperty(DATA_FIELD_NAME.AUTHORIZATION)){
        let authorization = req.headers[DATA_FIELD_NAME.AUTHORIZATION];
    
        const pos = authorization.indexOf(DATA_FIELD_NAME.BEARER);
        if(pos === 0){
          authorization = authorization.substring(DATA_FIELD_NAME.BEARER.length, authorization.length);
        }
        console.log('payload==================', req.headers[DATA_FIELD_NAME.AUTHORIZATION]);
        try {
          const payload = jwt.verify(authorization, process.env.SECRET_KEY);
          responseData.setDataValue(DATA_FIELD_NAME.PAYLOAD, payload[DATA_FIELD_NAME.DATA]);
        }
        catch (error) {
          if (error.message === 'jwt expired') {
            responseData.setResponseCode(RESPONSE_CODE.TOKEN_EXPIRED);
          }
          else if (error.name === 'invalid token') {
            responseData.setResponseCode(RESPONSE_CODE.INVALID_TOKEN)
          }
          else {
            responseData.setResponseCode(RESPONSE_CODE.VERIFY_TOKEN_FAIL);
          }
        }
      } else {
        responseData.setResponseCode(RESPONSE_CODE.NO_TOKEN);
    }
    return responseData;
}

module.exports = {
    getJWTToken,
    getPayload,
};