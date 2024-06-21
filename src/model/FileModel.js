const { getLogger } = require('../lib/logger');
const Logger = getLogger({ title: 'file model' });
const fs = require('fs');

const Query = require('../database/Mybatis');
const path = require('path');

const { NAMESPACE, DB_RESULT, DB_FIELD_NAME } = require('../common/Constant');
const { EXPECTATION_FAILED } = require('http-status-codes');

const baseDir = path.resolve(process.env.UPLOAD_DIR) + '/';

const loadFile = async (requestData, id = null) => {
    let fileId = null;

    if(id  != null) {
        fileId = id ;
    }

    const params = {
        fileId :  fileId,
      };

    try {
        const connection = requestData.getConnection();

        const queryString = Query(NAMESPACE.FILE, 'getFileById', params);

        const [file] = await connection.query(queryString);
        return file;
    } catch (e) {
        Logger.error(e);
        throw e;
    }
}

const DeleteRow = async (requestData, id) => {
    if (!id) {
        return
    }

    const params = {
        fileId :  id,
    };

    try {
        const connection = requestData.getConnection();
        const queryString = Query(NAMESPACE.FILE, 'deleteFileById', params);

        const [file] = await connection.query(queryString);
        return file;
    } catch (e) {
        Logger.error(e);
        throw e;
    }
}


const deleteFile = async (requestData, id) => {
    let file = await loadFile(requestData, id);
    await DeleteRow(requestData, id );

    
    let file_name;
    if (file && file.length > 0) {
      file_name = file[0].file_name;
      if (fs.existsSync(baseDir + file_name)) {
        fs.unlink(baseDir + file_name, (err) => {
          if (err) {
            return;
          }
          return;
        })
      }
    }
  }

const insertFile = async (requestData) => {    
    try {
        let fileName = requestData.getBodyValue('file').filename;
        const originalFileName = requestData.getBodyValue('file').originalname;
        const mimeType = requestData.getBodyValue('file').mimetype;
        const size = requestData.getBodyValue('file').size != null ? requestData.getBodyValue('file').size : 0;
        const fileType = requestData.getBodyValue('file').fieldname;
        const fileExt = path.extname(originalFileName).split('.').pop();
        const downloadUrl = '/files/download/' + fileName + path.extname(originalFileName);

        if(fileName){
            fileName =  fileName.replace(".", "");
        }

        const params = {
            fileName :  fileName,
            originalFileName : originalFileName,
            mimeType : mimeType,
            size : size,
            fileType : fileType,
            downloadUrl : downloadUrl,
            fileExt : fileExt,
        };

        const connection = requestData.getConnection();
        const queryString = Query(NAMESPACE.FILE, 'insert', params);
        const res = await connection.query(queryString);
        return res;
    } catch (e) {
        Logger.error(e.stack);
        throw e;
    }
}

module.exports = {
    loadFile,
    insertFile,
    deleteFile
}