const { getLogger } = require('../lib/logger');
const Logger = getLogger({ title: 'user controller' });
const JWT = require('../lib/jwt');
const Utils = require('../lib/utils');
const bcrypt = require('bcrypt');

const multer = require('multer');
const path = require('path');

const PayloadData = require('../common/PayloadData');

const RequestData = require('../common/RequestData');
const ResponseData = require('../common/ResponseData');

const { DB_FIELD_NAME } = require('../common/Constant');
const { RESPONSE_CODE, RESPONSE_FIELD } = require('../common/ResponseConst');

const UserModel = require('../model/UserModel');
// const EmployeeModel = require('../model/EmployeeModel');
const FileModel = require('../model/FileModel');

const xl = require('excel4node');
const wb = new xl.Workbook();

const login = async (req, res) => { 

    let   requestData     =  new RequestData(req);
    let   responseData    =  new ResponseData(requestData);
  
    try {
        const fieldList = [
            DB_FIELD_NAME.PHONE,
            DB_FIELD_NAME.PASSWORD,
        ];

        if (!requestData.hasAllMandatoryFields(fieldList)) {
            return responseData.setResponseCode(RESPONSE_CODE.REQUIRED_FIELD);
        }
  
        if (!requestData.isConnected()) {
            await requestData.start(true);
        }
  
        let userInfo = await UserModel.selectUser(requestData, requestData.getBodyValue(DB_FIELD_NAME.PHONE));

        let password = requestData.getBodyValue(DB_FIELD_NAME.PASSWORD);

        if (userInfo == null) {
            return responseData.setResponseCode(RESPONSE_CODE.WRONG_ACCOUNT);
        }
  
        const dbPassword  = userInfo[DB_FIELD_NAME.PASSWORD];
        const salt        = userInfo[DB_FIELD_NAME.SALT];
        password = await bcrypt.hash(password, salt);

        if(password !== dbPassword) {
            return  responseData.setResponseCode(RESPONSE_CODE.WRONG_PASSWORD);
        }
  
        let payload = new PayloadData();
        payload.loadObject(userInfo);
        const payloadObject = payload.getObject();
        const token = JWT.getJWTToken(payloadObject);
        userInfo['token'] = token;
        delete userInfo.password;
        delete userInfo.salt;
        responseData.setDataValue(RESPONSE_FIELD.DATA, userInfo);
    }
    catch (e) {
      Logger.error(e.stack);
      await requestData.error();
      responseData.setResponseCode(RESPONSE_CODE.CONTACT_ADMIN);
    }
    finally {
      await requestData.end(responseData.isSuccess());
      res.send(responseData);
    }
  };

  const register = async (req, res) => {
    let   requestData     =  new RequestData(req);
    let   responseData    =  new ResponseData(requestData);

    try {
      
      const fieldList = [
        DB_FIELD_NAME.FIRST_NAME,
        DB_FIELD_NAME.LAST_NAME,
        DB_FIELD_NAME.PHONE,
        DB_FIELD_NAME.EMAIL,
        DB_FIELD_NAME.REGISTER,
        DB_FIELD_NAME.GENDER,
        DB_FIELD_NAME.PASSWORD,
        DB_FIELD_NAME.ROLE_ID
      ];

      if (!requestData.hasAllMandatoryFields(fieldList)) {
        return responseData.setResponseCode(RESPONSE_CODE.REQUIRED_FIELD);
      }

      if (!requestData.isConnected()) {
            await requestData.start(true);
      }

      let userInfo = await UserModel.insertUser(requestData);
      
      if ( userInfo.status == 'existed') {
        responseData.setResponseCode(RESPONSE_CODE.ID_DUPLICATE);
      } else {
        responseData.setResponseCode(RESPONSE_CODE.SUCCESS);
      }
    } catch (e) {
      Logger.error(e.stack);
      await requestData.error();
      responseData.setResponseCode(RESPONSE_CODE.CONTACT_ADMIN);
    }
    finally {
      await requestData.end(responseData.isSuccess());
      res.send(responseData);
    }
  }

  const updateProfile = async (req, res) => {
    let requestData = new RequestData(req);
    let responseData = new ResponseData(requestData);

    try {
      if (requestData.payload.userID) {

        
        let fileResult = {};
        if(req.file) {
          if (!requestData.isConnected()) {
            await requestData.start(true);
          }
          requestData.setBodyValue('file', req.file);
          fileResult = await FileModel.insertFile(requestData);
          
          if(!fileResult){
              responseData.setResponseCode(RESPONSE_CODE.FILE_ERROR);
          } 

          requestData.setBodyValue(DB_FIELD_NAME.FILE_SEQ, fileResult[0].insertId);
          requestData.setBodyValue(DB_FIELD_NAME.USER_ID, requestData.payload.userID);
        }

        const profileResult = await UserModel.updateProfile(requestData);
        
        if ( profileResult.status == 'success') {
          responseData.setResponseCode(RESPONSE_CODE.SUCCESS);
          responseData.setDataValue(RESPONSE_FIELD.DATA, { profile: fileResult[0].insertId});
        }

      } else {
        await requestData.error();
        responseData.setResponseCode(RESPONSE_CODE.CONTACT_ADMIN);
      }
    } catch (e) {
      Logger.debug(e);
      await requestData.error();
      responseData.setResponseCode(RESPONSE_CODE.CONTACT_ADMIN);
    } finally {
        await requestData.end(responseData.isSuccess());
        res.send(responseData);
    }
  }















































  const updatePhoto = async (req, res) => {
    let   requestData     =  new RequestData(req);
    let   responseData    =  new ResponseData(requestData);

    try {
      if (req.file) {
        const data = JSON.parse(requestData.body.data);
          let fileResult = {};
          if (!requestData.isConnected()) {
          await requestData.start(true);
        }

        if (!requestData.isConnected()) {
          await requestData.start(true);
        }

        requestData.setBodyValue('file', req.file);
        fileResult = await FileModel.insertFile(requestData);

        if(!fileResult){
          responseData.setResponseCode(RESPONSE_CODE.FILE_ERROR);
        }

        requestData.setBodyValue('fileSeq', fileResult[0].insertId);
        requestData.setBodyValue('seq', data.seq);
        requestData.setBodyValue('photo', data.file_seq);

        const FileResult = await UserModel.updatePhoto(requestData);
        if (FileResult) {
            responseData.setResponseCode(RESPONSE_CODE.SUCCESS);
            responseData.setDataValue(RESPONSE_FIELD.DATA, fileResult[0].insertId);
        }
      }

    } catch (e) {
      console.log(e);
      Logger.error(e.stack);
      await requestData.error();
      responseData.setResponseCode(RESPONSE_CODE.CONTACT_ADMIN);
    }
    finally {
      await requestData.end(responseData.isSuccess());
      res.send(responseData);
    }
  }

  const changeStatusResume = async (req, res) => {
    let   requestData     =  new RequestData(req);
    let   responseData    =  new ResponseData(requestData);
    try {
      const fieldList = [
        'change', 'resume'
      ];

      if (!requestData.hasAllMandatoryFields(fieldList)) {
        return responseData.setResponseCode(RESPONSE_CODE.REQUIRED_FIELD);
      }
      if (!requestData.isConnected()) {
            await requestData.start(true);
      }
      let info = await EmployeeModel.updateStatusCareer(requestData);

      if (info.status == 'success') {
        responseData.setResponseCode(RESPONSE_CODE.SUCCESS);
      }
    } catch (e) {
      Logger.error(e.stack);
      await requestData.error();
      responseData.setResponseCode(RESPONSE_CODE.CONTACT_ADMIN);
    }
    finally {
      await requestData.end(responseData.isSuccess());
      res.send(responseData);
    }
  }


  // employee begin

  const empLogin = async (req, res) => {
    let   requestData     =  new RequestData(req);
    let   responseData    =  new ResponseData(requestData);

    try {
      const fieldList = [
        'email',
        'password'
      ];

      if (!requestData.hasAllMandatoryFields(fieldList)) {
        return responseData.setResponseCode(RESPONSE_CODE.REQUIRED_FIELD);
      }

      if (!requestData.isConnected()) {
            await requestData.start(true);
        }
      
      let employeeInfo = await EmployeeModel.selectEmployee(requestData, requestData.getBodyValue(fieldList[0]));
      
      if (!employeeInfo || employeeInfo.length <= 0 ) {
        return responseData.setResponseCode(RESPONSE_CODE.FORBIDDEN);
      }

      const dbPassword  = employeeInfo['password'];
      const salt        = employeeInfo['salt'];
      let password = await bcrypt.hash(requestData.getBodyValue(fieldList[1]), salt);

      // if(!await bcrypt.compare(password, dbPassword)) {
      if(password !== dbPassword) {
        return  responseData.setResponseCode(RESPONSE_CODE.FORBIDDEN);
      }


      let payload = new PayloadData();
      payload.loadObject(employeeInfo);
  
      const payloadObject = payload.getObject();
      const token = JWT.getJWTToken(payloadObject);
      employeeInfo['token'] = token;
      delete employeeInfo.password;
      delete employeeInfo.salt;


      responseData.setDataValue(RESPONSE_FIELD.DATA, employeeInfo);

    } catch (e) {
      Logger.error(e.stack);
      await requestData.error();
      responseData.setResponseCode(RESPONSE_CODE.CONTACT_ADMIN);
    }
    finally {
      await requestData.end(responseData.isSuccess());
      res.send(responseData);
    }
  }
  
  const createResume = async (req, res) => {
    let   requestData     =  new RequestData(req);
    let   responseData    =  new ResponseData(requestData);

    try {

      const fieldList = [ 'resume' ];
      if (!requestData.hasAllMandatoryFields(fieldList)) {
        return responseData.setResponseCode(RESPONSE_CODE.REQUIRED_FIELD);
      }

      if (!requestData.isConnected()) {
            await requestData.start(true);
        }
      const careerInfo = await EmployeeModel.addCareer(requestData);
      
      if ( careerInfo.status == 'success') {
        responseData.setResponseCode(RESPONSE_CODE.SUCCESS);
      }
    } catch (e) {
      Logger.error(e.stack);
      await requestData.error();
      responseData.setResponseCode(RESPONSE_CODE.CONTACT_ADMIN);
    } finally {
      await requestData.end(responseData.isSuccess());
      res.send(responseData);
    }
  }

  const addVote = async (req, res) => {
    let   requestData     =  new RequestData(req);
    let   responseData    =  new ResponseData(requestData);
    try {
      const fieldList = [ 'newVote' ];
      if (!requestData.hasAllMandatoryFields(fieldList)) {
        return responseData.setResponseCode(RESPONSE_CODE.REQUIRED_FIELD);
      }

      if (requestData.payload.seq) {
        if (!requestData.isConnected()) {
            await requestData.start(true);
        }
        const voteInfo = await EmployeeModel.insertVote(requestData);

        if ( voteInfo.status == 'success') {
          responseData.setResponseCode(RESPONSE_CODE.SUCCESS);
        }

      } else {
        await requestData.error();
        responseData.setResponseCode(RESPONSE_CODE.CONTACT_ADMIN);
      }

    } catch (e) {
      Logger.error(e.stack);
      await requestData.error();
      responseData.setResponseCode(RESPONSE_CODE.CONTACT_ADMIN);
    } finally {
      await requestData.end(responseData.isSuccess());
      res.send(responseData);
    }
  }

  const selectVotes = async (req, res) => {
    let   requestData     =  new RequestData(req);
    let   responseData    =  new ResponseData(requestData);
    try {
      if (requestData.payload.seq) {
        if (!requestData.isConnected()) {
            await requestData.start(true);
        }

        const voteInfo = await EmployeeModel.selectVotes(requestData);
        if ( voteInfo.status == 'success') {
          responseData.setResponseCode(RESPONSE_CODE.SUCCESS);
          responseData.setDataValue(RESPONSE_FIELD.DATA, voteInfo.data);
        }

      } else if(requestData.payload.userID) {
        if (!requestData.isConnected()) {
          await requestData.start(true);
        }

        const voteInfo = await EmployeeModel.selectVotes(requestData, 'admin');

        if ( voteInfo.status == 'success') {
          responseData.setResponseCode(RESPONSE_CODE.SUCCESS);
          responseData.setDataValue(RESPONSE_FIELD.DATA, voteInfo.data);
        }
      } else {
        await requestData.error();
        responseData.setResponseCode(RESPONSE_CODE.CONTACT_ADMIN);
      }
    } catch (e) {
      Logger.error(e.stack);
      await requestData.error();
      responseData.setResponseCode(RESPONSE_CODE.CONTACT_ADMIN);
    } finally {
      await requestData.end(responseData.isSuccess());
      res.send(responseData);
    }
  }

  const updateCareer = async (req, res) => {
    let   requestData     =  new RequestData(req);
    let   responseData    =  new ResponseData(requestData);

    try {
      const fieldList = [ 'resume' ];
      if (!requestData.hasAllMandatoryFields(fieldList)) {
        return responseData.setResponseCode(RESPONSE_CODE.REQUIRED_FIELD);
      }

      if (!requestData.isConnected()) {
            await requestData.start(true);
        }
      const careerInfo = await EmployeeModel.updateCareer(requestData);

      if ( careerInfo.status == 'success') {
        responseData.setResponseCode(RESPONSE_CODE.SUCCESS);
      }

    } catch (e) {
      Logger.error(e.stack);
      await requestData.error();
      responseData.setResponseCode(RESPONSE_CODE.CONTACT_ADMIN);
    } finally {
      await requestData.end(responseData.isSuccess());
      res.send(responseData);
    }
  }

  

  const empPersonalInfo = async (req, res) => {
    let requestData = new RequestData(req);
    let responseData = new ResponseData(requestData);

    try {
      if (requestData.payload.seq) {
        if (!requestData.isConnected()) {
            await requestData.start(true);
        }
        const per = await EmployeeModel.selectEmployeePersonal(requestData, requestData.payload.seq);

        if (per == null) {
          return responseData.setResponseCode(RESPONSE_CODE.WRONG_ACCOUNT);
        } else {
          responseData.setResponseCode(RESPONSE_CODE.SUCCESS);
          responseData.setDataValue(RESPONSE_FIELD.DATA, per);
        }
      }
    } catch (e) {
      Logger.debug(e);
      await requestData.error();
      responseData.setResponseCode(RESPONSE_CODE.CONTACT_ADMIN);
    } finally {
        await requestData.end(responseData.isSuccess());
        res.send(responseData);
    }
  }

  const getProfessions = async (req, res) => {
    let requestData = new RequestData(req);
    let responseData = new ResponseData(requestData);
    try {
      if (!requestData.isConnected()) {
            await requestData.start(true);
        }
      const prof = await EmployeeModel.getProfessions(requestData);

      if (prof.status == 'success') {
        responseData.setResponseCode(RESPONSE_CODE.SUCCESS);
        responseData.setDataValue(RESPONSE_FIELD.DATA, prof.data);
      } else {
        return responseData.setResponseCode(RESPONSE_CODE.WRONG_ACCOUNT);
      }
    } catch (e) {
      Logger.debug(e);
      await requestData.error();
      responseData.setResponseCode(RESPONSE_CODE.CONTACT_ADMIN);
    } finally {
        await requestData.end(responseData.isSuccess());
        res.send(responseData);
    }
  }

  const updateProfession = async (req, res) => {
    let requestData = new RequestData(req);
    let responseData = new ResponseData(requestData);

    try {
      const fieldList = [ 'seq', 'pro_name', 'pro_name_ko' ];
      if (!requestData.hasAllMandatoryFields(fieldList)) {
        return responseData.setResponseCode(RESPONSE_CODE.REQUIRED_FIELD);
      }

      if (!requestData.isConnected()) {
            await requestData.start(true);
        }
      const result = await UserModel.updateProfession(requestData);

      if (result) {
        responseData.setResponseCode(RESPONSE_CODE.SUCCESS);
      } else {
        responseData.setResponseCode(RESPONSE_CODE.CONTACT_ADMIN);
      }

    } catch (e) {
      Logger.debug(e);
      await requestData.error();
      responseData.setResponseCode(RESPONSE_CODE.CONTACT_ADMIN);
    } finally {
        await requestData.end(responseData.isSuccess());
        res.send(responseData);
    }
  }

  const addProfession = async (req, res) => {
    let requestData = new RequestData(req);
    let responseData = new ResponseData(requestData);

    try {
      const fieldList = [ 'pro_name', 'ko_name' ];
      if (!requestData.hasAllMandatoryFields(fieldList)) {
        return responseData.setResponseCode(RESPONSE_CODE.REQUIRED_FIELD);
      }

      if (!requestData.isConnected()) {
            await requestData.start(true);
        }
      const result = await UserModel.addProfession(requestData);
      if (result) {
        responseData.setResponseCode(RESPONSE_CODE.SUCCESS);
      } else {
        responseData.setResponseCode(RESPONSE_CODE.CONTACT_ADMIN);
      }

    } catch (e) {
      console.log(e);
      Logger.debug(e);
      await requestData.error();
      responseData.setResponseCode(RESPONSE_CODE.CONTACT_ADMIN);
    } finally {
        await requestData.end(responseData.isSuccess());
        res.send(responseData);
    }
  }

  const deleteProfession = async (req, res) => {
    let requestData = new RequestData(req);
    let responseData = new ResponseData(requestData);

    try {
      const fieldList = [ 'seq' ];
      if (!requestData.hasAllMandatoryFields(fieldList)) {
        return responseData.setResponseCode(RESPONSE_CODE.REQUIRED_FIELD);
      }

      if (!requestData.isConnected()) {
            await requestData.start(true);
        }
      const result = await UserModel.deleteProf(requestData);
      if (result) {
        responseData.setResponseCode(RESPONSE_CODE.SUCCESS);
      } else {
        responseData.setResponseCode(RESPONSE_CODE.DB_ERROR);
      }
    } catch (e) {
      Logger.debug(e);
      await requestData.error();
      responseData.setResponseCode(RESPONSE_CODE.CONTACT_ADMIN);
    } finally {
        await requestData.end(responseData.isSuccess());
        res.send(responseData);
    }
  }

  const getAllEmployee = async (req, res) => {
    let requestData = new RequestData(req);
    let responseData = new ResponseData(requestData);
    try {
      if (!requestData.isConnected()) {
            await requestData.start(true);
        }
      const result = await UserModel.getEmployees(requestData, true);
      if (result) {
        responseData.setResponseCode(RESPONSE_CODE.SUCCESS);
        responseData.setDataValue(RESPONSE_FIELD.DATA, result);
      } else {
        responseData.setResponseCode(RESPONSE_CODE.DB_ERROR);
      }
    } catch (e) {
      Logger.debug(e);
      await requestData.error();
      responseData.setResponseCode(RESPONSE_CODE.CONTACT_ADMIN);
    } finally {
        await requestData.end(responseData.isSuccess());
        res.send(responseData);
    }
  }

  const getEmployees = async (req, res) => {
    let requestData = new RequestData(req);
    let responseData = new ResponseData(requestData);
    try {
      if (!requestData.isConnected()) {
            await requestData.start(true);
        }
      const result = await UserModel.getEmployees(requestData);
      if (result) {
        responseData.setResponseCode(RESPONSE_CODE.SUCCESS);
        responseData.setDataValue(RESPONSE_FIELD.DATA, result);
      } else {
        responseData.setResponseCode(RESPONSE_CODE.DB_ERROR);
      }
    } catch (e) {
      Logger.debug(e);
      await requestData.error();
      responseData.setResponseCode(RESPONSE_CODE.CONTACT_ADMIN);
    } finally {
        await requestData.end(responseData.isSuccess());
        res.send(responseData);
    }
  }

  const recoverEmployee = async (req, res) => {
    let requestData = new RequestData(req);
    let responseData = new ResponseData(requestData);

    try { 
      const fieldList = [ 'seq' ];
      if (!requestData.hasAllMandatoryFields(fieldList)) {
        return responseData.setResponseCode(RESPONSE_CODE.REQUIRED_FIELD);
      }

      if (!requestData.isConnected()) {
            await requestData.start(true);
        }
      const result = await UserModel.recoverEmployee(requestData);
      if (result) {
        responseData.setResponseCode(RESPONSE_CODE.SUCCESS);
      } else {
        responseData.setResponseCode(RESPONSE_CODE.DB_ERROR);
      }

    } catch (e) {
      Logger.debug(e);
      await requestData.error();
      responseData.setResponseCode(RESPONSE_CODE.CONTACT_ADMIN);
    } finally {
        await requestData.end(responseData.isSuccess());
        res.send(responseData);
    }
  }

  const deleteEmployee = async (req, res) => {
    let requestData = new RequestData(req);
    let responseData = new ResponseData(requestData);

    try { 
      const fieldList = [ 'seq' ];
      if (!requestData.hasAllMandatoryFields(fieldList)) {
        return responseData.setResponseCode(RESPONSE_CODE.REQUIRED_FIELD);
      }

      if (!requestData.isConnected()) {
            await requestData.start(true);
        }
      const result = await UserModel.deleteEmployee(requestData);
      if (result) {
        responseData.setResponseCode(RESPONSE_CODE.SUCCESS);
      } else {
        responseData.setResponseCode(RESPONSE_CODE.DB_ERROR);
      }

    } catch (e) {
      Logger.debug(e);
      await requestData.error();
      responseData.setResponseCode(RESPONSE_CODE.CONTACT_ADMIN);
    } finally {
        await requestData.end(responseData.isSuccess());
        res.send(responseData);
    }
  }

  const updateEmployee = async (req, res) => {
    let requestData = new RequestData(req);
    let responseData = new ResponseData(requestData);

    try {
      const fieldList = [ 'info' ];
      if (!requestData.hasAllMandatoryFields(fieldList)) {
        return responseData.setResponseCode(RESPONSE_CODE.REQUIRED_FIELD);
      }

      if (!requestData.isConnected()) {
            await requestData.start(true);
        }
      const result = await UserModel.updateEmployee(requestData);

      if (result) {
        responseData.setResponseCode(RESPONSE_CODE.SUCCESS);
      } else {
        responseData.setResponseCode(RESPONSE_CODE.DB_ERROR);
      }
    } catch (e) {
      Logger.debug(e);
      await requestData.error();
      responseData.setResponseCode(RESPONSE_CODE.CONTACT_ADMIN);
    } finally {
        await requestData.end(responseData.isSuccess());
        res.send(responseData);
    }
  }


  const forgotPassEmp = async (req, res) => {
    let requestData = new RequestData(req);
    let responseData = new ResponseData(requestData);

    try {
      const fieldList = [ 'email' ];
      if (!requestData.hasAllMandatoryFields(fieldList)) {
        return responseData.setResponseCode(RESPONSE_CODE.REQUIRED_FIELD);
      }

      if (!requestData.isConnected()) {
        await requestData.start(true);
      }
    
      const result = await UserModel.forgotPassEmp(requestData);
      if (result === 401) {
        responseData.setResponseCode(RESPONSE_CODE.NO_DATA);
      }
      else if (result) {
        responseData.setResponseCode(RESPONSE_CODE.SUCCESS);
      } else {
        responseData.setResponseCode(RESPONSE_CODE.DB_ERROR);
      }

    } catch (e) {
      Logger.debug(e);
      await requestData.error();
      responseData.setResponseCode(RESPONSE_CODE.CONTACT_ADMIN);
    } finally {
        await requestData.end(responseData.isSuccess());
        res.send(responseData);
    }
  }

  const changeCurrentPassword = async (req, res) => {
    let requestData = new RequestData(req);
    let responseData = new ResponseData(requestData);

    try {
      const fieldList = [ 'current', 'created', 'repeated' ];
      if (!requestData.hasAllMandatoryFields(fieldList)) {
        return responseData.setResponseCode(RESPONSE_CODE.REQUIRED_FIELD);
      }

      if (!requestData.isConnected()) {
        await requestData.start(true);
      }

      const result = await UserModel.checkEmployee(requestData);
      if (result === 401) {
        responseData.setResponseCode(RESPONSE_CODE.NO_DATA);
      }
      else if (result) {
        responseData.setResponseCode(RESPONSE_CODE.SUCCESS);
      } else {
        responseData.setResponseCode(RESPONSE_CODE.DB_ERROR);
      }

    } catch (e) {
      console.log(e);
      Logger.debug(e);
      await requestData.error();
      responseData.setResponseCode(RESPONSE_CODE.CONTACT_ADMIN);
    } finally {
        await requestData.end(responseData.isSuccess());
        res.send(responseData);
    }
  }

  const updateFeedback = async (req, res) => {
    let requestData = new RequestData(req);
    let responseData = new ResponseData(requestData);

    try {
      const fieldList = [ 'seq', 'status' ];
      if (!requestData.hasAllMandatoryFields(fieldList)) {
        return responseData.setResponseCode(RESPONSE_CODE.REQUIRED_FIELD);
      }

      if (!requestData.isConnected()) {
        await requestData.start(true);
      }

      const result = await UserModel.updateFeedback(requestData);

      if (result) {
        responseData.setResponseCode(RESPONSE_CODE.SUCCESS);
      } else {
        responseData.setResponseCode(RESPONSE_CODE.DB_ERROR);
      }

    } catch (e) {
      console.log(e);
      Logger.debug(e);
      await requestData.error();
      responseData.setResponseCode(RESPONSE_CODE.CONTACT_ADMIN);
    } finally {
        await requestData.end(responseData.isSuccess());
        res.send(responseData);
    }
  }

  module.exports = {
    login,
    register,
    updateProfile,


    empLogin,
    createResume,
    empPersonalInfo,
    updateCareer,
    addVote,
    selectVotes,
    getProfessions,
    changeStatusResume,
    updateProfession,
    addProfession,
    deleteProfession,
    getEmployees,
    deleteEmployee,
    updateEmployee,
    updatePhoto,
    forgotPassEmp,
    changeCurrentPassword,
    updateFeedback,
    getAllEmployee,
    recoverEmployee
  };