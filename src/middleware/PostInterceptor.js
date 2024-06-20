const { getLogger } = require('../lib/logger');
const Logger = getLogger({ title: 'Post interceptor' });
const {RESPONSE_FIELD} = require('../common/ResponseConst');

const PostInterceptor = async (req, res, next) => {
    const oldSend = res.send;

    res.send = async ( responseData) => {
        console.log(`res.send`);
        console.log(responseData);

        if(typeof responseData !== 'object'){
            res.send = oldSend;
            return res.send(responseData);
        }

        const secure = responseData.getSecure();

        const requestData = responseData.getRequestData();

        const data = responseData.getData();

        if(data.hasOwnProperty(RESPONSE_FIELD.CODE)){
            res.status(data[RESPONSE_FIELD.CODE]);
            delete data[RESPONSE_FIELD.CODE];
        }

        if(requestData) {
            const isConnected = requestData.isConnected();

            if(isConnected === true){
                Logger.error(`No Database released ${req.originalUrl} method ${req.method}`);
                requestData.end(responseData.isSuccess());
            }
        }

        if(secure === true){

        }

        res.send = oldSend;
        return res.send(data);
    }

    next();
};

module.exports = PostInterceptor;