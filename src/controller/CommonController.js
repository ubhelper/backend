const path = require('path');
const fs = require('fs');
const { getLogger } = require('../lib/logger');
const Logger = getLogger({ title: 'common controller' });

const RequestData = require('../common/RequestData');
const ResponseData = require('../common/ResponseData');
const { RESPONSE_CODE, RESPONSE_FIELD  } = require('../common/ResponseConst');
const Query = require('../database/Mybatis');
const { NAMESPACE, DB_RESULT, DB_FIELD_NAME } = require('../common/Constant');
const fileDir = path.resolve(process.env.UPLOAD_DIR);
const fileUpload = require('../middleware/FileUpload');
const baseDir = path.resolve(process.env.UPLOAD_DIR) + '/';
var axios = require('axios');
const FileModel = require('../model/FileModel');

const upload = async (req, res) => {
    let requestData = new RequestData(req);
    let responseData = new ResponseData(requestData);

    try {
        await fileUpload(req, res, err => {
            if (err instanceof multer.MulterError) {
                responseData.setResponseCode(RESPONSE_CODE.CONTACT_ADMIN);
            }else{
                const result = FileModel.insertFile(requestData);

                if(result){
                    responseData.setDataValue(RESPONSE_FIELD.DATA, res.req.files);
                    responseData.setResponseCode(RESPONSE_CODE.SUCCESS);
                } else {
                    responseData.setResponseCode(RESPONSE_CODE.DB_ERROR);
                }
            }
        });
        
    } catch (e) {
        Logger.debug(e);
        await requestData.error();
        responseData.setResponseCode(RESPONSE_CODE.CONTACT_ADMIN);
    } finally {
        await requestData.end(responseData.isSuccess());
        res.send(responseData);

    }
}

const download = async (req, res) => {
    let requestData = new RequestData(req);
    let responseData = new ResponseData(requestData);

    const directoryPath = baseDir;

    const fileId = req.params.fileId;
    
    if (!requestData.isConnected()) {
        await requestData.start(true);
    }
        
    const file = await FileModel.loadFile(requestData, fileId);
   try {

        if (file.length > 0) {
            if (file[0].file_name) {
                if (fs.existsSync(fileDir + '/' + file[0].file_name)) {
                    const rs = fs.createReadStream(directoryPath + file[0].file_name);
                    res.setHeader("Content-Disposition", "attachment;filename=\"" + file[0].original_file_name +"\"");
                    rs.pipe(res);
                } else {
                    await requestData.error();
                    responseData.setResponseCode(RESPONSE_CODE.NO_DATA);
                    res.send(responseData);
                }
            } else {
                await requestData.error();
                responseData.setResponseCode(RESPONSE_CODE.NO_DATA);
                res.send(responseData);
            }
        } else {
            await requestData.error();
            responseData.setResponseCode(RESPONSE_CODE.NO_DATA);
            res.send(responseData);
        }
     } catch (e) {
        Logger.debug(e);
        await requestData.error();
        responseData.setResponseCode(RESPONSE_CODE.CONTACT_ADMIN);
        res.send(responseData);
     } finally {
        await requestData.end(responseData.isSuccess());
    }
};

module.exports = {
    upload,
    download
};