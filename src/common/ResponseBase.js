const {RESPONSE_FIELD} = require('./ResponseConst');
const {StatusCodes} = require('http-status-codes');

class ResponseBase {

    constructor(data, requestData) {
        this.secure = false;

        this.data = data;

        this.requestData = requestData;
    }

    setResponseCode(responseCode) {
        for (const key in responseCode) {
            this.data[key] = responseCode[key];
        }
    }

    getResponseCode(){
        return this.getDataValue(RESPONSE_FIELD.CODE);
    }

    isSuccess () {
        return this.getResponseCode() === StatusCodes.OK;
    }

    setData(data){
        this.data = data;
    }

    setDataValue(key, value){
        this.data[key] = value;
    }

    getData(){
        return this.data;
    }

    getDataValue(key){

        if(this.data.hasOwnProperty(key) === true) {
            return this.data[key];
        }
        return null;
    }

    setSecure() {
        this.secure = true;
    }

    getSecure(){
        return this.secure;
    }

    getRequestData(){
        return this.requestData;
    }
}

module.exports = ResponseBase;