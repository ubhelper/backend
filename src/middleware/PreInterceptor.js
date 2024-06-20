const {HTTP_REQUEST} = require('../common/Constant');

const { RequestAuthPass } = require('../common/RequestAuthPass');

const {getPayload} = require('../lib/jwt');
const {DATA_FIELD_NAME} = require('../common/Constant');
const {StatusCodes} = require('http-status-codes');
const {RESPONSE_FIELD} = require('../common/ResponseConst');


const PreInterceptor = async (req, res, next) => {

    if(req.originalUrl.startsWith('/api-docs')) {
        return next();
    }

    if(req.originalUrl.startsWith('/v2')) {
        return next();
    }

    if(req.originalUrl.startsWith('/v1')) {
        let parts = req.originalUrl.split('/');
        if (parts.length <= 0) {
            return next();
        } else {
            const required = ['update-profile', 'employee-personal-info', 'add-vote', 'update-resume', 'get-votes', 'change-password'];
            if (!required.includes(parts[parts.length - 1])) {
                return next();
            } else {
                const responseData = getPayload(req);
                if(responseData.getResponseCode() === StatusCodes.OK) {
                    const payload = responseData.getDataValue('payload');
                    req['payload'] = payload;
                    return next();
                    
                } else {
                    const data = responseData.getData();
            
                    if(data.hasOwnProperty(RESPONSE_FIELD.CODE)){
                        res.status(data[RESPONSE_FIELD.CODE]);
                        delete data[RESPONSE_FIELD.CODE];
                    }
            
                    return res.send(data);
                }
            }
        }
    }

    if(RequestAuthPass.some(api => req.method === api[HTTP_REQUEST.METHOD] && req.originalUrl === api[HTTP_REQUEST.URL])){
        return next();
    }

    let parts = req.originalUrl.split('/');
    const required = ['login', 'get-list'];
    if (parts.length <= 0 || required.includes(parts[parts.length - 1])) {
        return next();
    }


    const responseData = getPayload(req);

    if(responseData.getResponseCode() === StatusCodes.OK){
        const payload = responseData.getDataValue('payload');

        req['payload'] = payload;
        return next();
    } else {
        const data = responseData.getData();

        if(data.hasOwnProperty(RESPONSE_FIELD.CODE)){
            res.status(data[RESPONSE_FIELD.CODE]);
            delete data[RESPONSE_FIELD.CODE];
        }

        res.send(data);
    }
};

module.exports = PreInterceptor;