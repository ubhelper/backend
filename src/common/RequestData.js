const dbConn = require('../database/DataBase');

const { copyObject } = require('../lib/utils');
const Util = require('../lib/utils');

const {PAGING_DEFAULT} = require('./Constant');
const {NUMERIC} = require('./Constant');
const {DATA_FIELD_NAME} = require('./Constant');
const PayloadData = require('./PayloadData');

class RequestData {
    constructor(requestData = {}) {
        this.connection = null;
        this.payload = new PayloadData()
        this.header = null;
        this.body = null;
        this.connected = false;
        this.initData(requestData);
    }

    initData = (data) => {
        if(data.hasOwnProperty(DATA_FIELD_NAME.PAYLOAD)) {
            this.payload.loadObject(data[DATA_FIELD_NAME.PAYLOAD]);
        }

        if(data.hasOwnProperty(DATA_FIELD_NAME.BODY)) {
            this.body = copyObject(data[DATA_FIELD_NAME.BODY]);
        }
    }

    getUserID = () => {
        return this.payload.getUserID();
    }

    getSeq = () => {
        return this.payload.getSeq();
    }

    getBody = () => {
        return this.body;
    }

    setBodyValue = (key, value) => {
        this.body[key] = copyObject(value);
    }

    getBodyValue = (key, defaultValue = null) => {
        if(this.body.hasOwnProperty(key)) {
            return this.body[key];
        }
        return defaultValue;
    }

    isBodyExist = (key) => {
        return this.body.hasOwnProperty(key);
    }

    hasAllMandatoryFields = (fieldList) => {
        let result = true;
        fieldList.forEach(fieldName => {
           if(result)
            result = result && (Util.findProp(this.getBody(), fieldName) != null);
        });
        return result;
    }

    paginate = () => {
        const DFN_PAGE = DATA_FIELD_NAME.PAGE;
        const DFN_SIZE = DATA_FIELD_NAME.PAGE_SIZE;
        const DFN_SKIP = DATA_FIELD_NAME.SKIP;

        const page = Number(this.getBodyValue(DFN_PAGE) || PAGING_DEFAULT[DFN_PAGE]);
        const pageSize = Number(this.getBodyValue(DFN_SIZE) || PAGING_DEFAULT[DFN_SIZE]);
        const pageSkip = pageSize * (page > NUMERIC.ONE ? page - NUMERIC.ONE : NUMERIC.ZERO);

        this.setBodyValue(DFN_SIZE, pageSize);
        this.setBodyValue(DFN_SKIP, pageSkip);
        this.setBodyValue(DFN_PAGE, page);
        return page;
    };

    getConnection = () => {
        return this.connection;
    }

    isConnected = () => {
        return this.connected;
    }

    start = async (transaction = false) => {
        this.transaction = transaction;
        this.connection = transaction;

        this.connection = await dbConn.getPoolConnection();
        this.connected = this.connection !== null ? true : false;

        if(this.transaction === true) {
            await this.beginTransaction();
        }
    }

    end = async (complete = true) => {
        if(this.isConnected() === true) {
            if(this.transaction === true) {
                if(complete === true) {
                    await this.commit();
                } else {
                    await this.rollback();
                }
            } else {
                await this.release();
            }
        }
    }

    error = async () => {
        if(this.transaction === true) {
            await this.rollback();
        }
    }

    beginTransaction = async () => {
        await this.connection.beginTransaction();
    }

    commit = async () => {
        console.log(`commit ------`);
        await this.connection.commit();
        await this.release();
    }

    rollback = async () => {
        console.log(`rollback ------`);
        await this.connection.rollback();
        await this.release();
    }

    release = async () => {
        await this.connection.release();
        this.connected = false;
    }
} 

module.exports = RequestData;