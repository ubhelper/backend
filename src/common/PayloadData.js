const {DB_FIELD_NAME} = require('../common/Constant');

class PayloadData {
    constructor(){
        this.userID = null;
        this.userName = null;
        this.email = null;
        this.seq = null;
    }

    loadObject(payload){
        if(payload.hasOwnProperty(DB_FIELD_NAME.USER_ID)){
            this.userID = payload[DB_FIELD_NAME.USER_ID];
        }

        if(payload.hasOwnProperty(DB_FIELD_NAME.USER_NAME)){
            this.userName = payload[DB_FIELD_NAME.USER_NAME];
        }

        if(payload.hasOwnProperty('email')){
            this.email = payload['email'];
        }

        if(payload.hasOwnProperty('seq')){
            this.seq = payload['seq'];
        }
    }

    getObject(){
        const payload = {
            [DB_FIELD_NAME.USER_ID] : this.userID,
            [DB_FIELD_NAME.USER_NAME] : this.userName,
            ['email'] : this.email,
            ['seq'] : this.seq
        };
        return payload;
    }

    getUserID(){
        return this.userID;
    }
}

module.exports = PayloadData;