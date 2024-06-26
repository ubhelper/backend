const {DB_FIELD_NAME} = require('../common/Constant');

class PayloadData {
    constructor(){
        this.userID = null;
        this.userName = null;
        this.email = null;
    }

    loadObject(payload){
        if(payload.hasOwnProperty(DB_FIELD_NAME.USER_ID)){
            this.userID = payload[DB_FIELD_NAME.USER_ID];
        }

        if(payload.hasOwnProperty(DB_FIELD_NAME.USER_NAME)){
            this.userName = payload[DB_FIELD_NAME.USER_NAME];
        }

        if(payload.hasOwnProperty(DB_FIELD_NAME.EMAIL)){
            this.email = payload[DB_FIELD_NAME.EMAIL];
        }

        // if(payload.hasOwnProperty('seq')){
        //     this.seq = payload['seq'];
        // }
    }

    getObject(){
        const payload = {
            [DB_FIELD_NAME.USER_ID] : this.userID,
            [DB_FIELD_NAME.USER_NAME] : this.userName,
            [DB_FIELD_NAME.EMAIL] : this.email,
            // ['seq'] : this.seq
        };
        return payload;
    }

    getUserID(){
        return this.userID;
    }

    getUserName(){
        return this.userName;
    }
}

module.exports = PayloadData;