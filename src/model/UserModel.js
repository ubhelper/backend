const { getLogger } = require('../lib/logger');
const Logger = getLogger({ title: 'user model' });
// const EmployeeModel = require('./EmployeeModel');
const FileModel = require('./FileModel');
const EmployeeModel=null;
const MailModel = null;
const Query = require('../database/Mybatis');
const path = require('path');
const bcrypt = require('bcrypt');

const { NAMESPACE, DB_RESULT, DB_FIELD_NAME } = require('../common/Constant');

const getSuperAdmin = async (requestData, ) => {
    try {  
      const params = {
        siteSeq : 1
      };
  
      const connection = requestData.getConnection();
  
      const queryString = Query(NAMESPACE.SITE,'selectSiteInfo', params);
  
      const [dataSet] = await connection.query(queryString);
  
      return dataSet[DB_RESULT.ROW_FIRST];
    }
    catch (e) {
      Logger.error(e.stack);
      throw e;
    }
};

const selectUser = async (requestData, ID) => {
    try {
      let userID    = ID ;
  
      const params = {
        [DB_FIELD_NAME.PHONE] :  userID ,
      };
  
      const connection = requestData.getConnection();
  
      const queryString = Query(NAMESPACE.USER,'selectUser', params);
  
      const [dataSet] = await connection.query(queryString);
  
      return dataSet[DB_RESULT.ROW_FIRST];
    }
    catch (e) {
      Logger.error(e.stack);
      throw e;
    }
};

const insertUser = async (requestData) => {

    try {
        const is_exist = await checkUser(requestData);

        if (is_exist) {
          return { status: 'existed' };
        }

        const firstname    = requestData.getBodyValue(DB_FIELD_NAME.FIRST_NAME);
        const lastname    = requestData.getBodyValue(DB_FIELD_NAME.LAST_NAME);
        const phone  = requestData.getBodyValue(DB_FIELD_NAME.PHONE);
        const email = requestData.getBodyValue(DB_FIELD_NAME.EMAIL);
        const register = requestData.getBodyValue(DB_FIELD_NAME.REGISTER);
        const gender = requestData.getBodyValue(DB_FIELD_NAME.GENDER);
        const role = requestData.getBodyValue(DB_FIELD_NAME.ROLE_ID);
        const salt   = await bcrypt.genSalt();
        const password  = await bcrypt.hash(requestData.getBodyValue(DB_FIELD_NAME.PASSWORD), salt);

        const params = {
          [DB_FIELD_NAME.FIRST_NAME]    : firstname,
          [DB_FIELD_NAME.LAST_NAME]     : lastname,
          [DB_FIELD_NAME.PHONE]         : phone,
          [DB_FIELD_NAME.EMAIL]         : email,
          [DB_FIELD_NAME.REGISTER]      : register,
          [DB_FIELD_NAME.GENDER]        : gender,
          [DB_FIELD_NAME.ROLE_ID]       : role,
          [DB_FIELD_NAME.SALT]          : salt,
          [DB_FIELD_NAME.PASSWORD]      : password
        };

        const connection = requestData.getConnection();
        const statement = Query(NAMESPACE.USER,'insertUser', params);
        const res = await connection.query(statement);
        return { status: 'success',  data: res[DB_RESULT.ROW_FIRST][DB_RESULT.AFFECTED_ROWS] === DB_RESULT.ONE};
    }
    catch (e) {
        Logger.error(e.stack);
        throw e;
    }
};

const updateProfile = async (requestData) => {
  const params = {
    [DB_FIELD_NAME.FILE_SEQ] : requestData.getBodyValue(DB_FIELD_NAME.FILE_SEQ) != null ? requestData.getBodyValue(DB_FIELD_NAME.FILE_SEQ) : '',
    [DB_FIELD_NAME.USER_ID]     : requestData.getBodyValue(DB_FIELD_NAME.USER_ID) != null ? requestData.getBodyValue(DB_FIELD_NAME.USER_ID) : ''
  }

  
  try {

    const file = await getUser(requestData);
    if(file) {
      await FileModel.deleteFile(requestData, file.profile);
    }

    const connection = requestData.getConnection();
    const queryString = Query(NAMESPACE.USER, 'updateUserProfile', params);
    
    const res = await connection.query(queryString);
    return { status: 'success',  data: res[DB_RESULT.ROW_FIRST][DB_RESULT.AFFECTED_ROWS] === DB_RESULT.ONE};
  } catch (e) {
    Logger.error(e);
    throw e;
  }
}

const getUser = async ( requestData ) => {
  const seq = requestData.getBodyValue(DB_FIELD_NAME.USER_ID);
  const params = {
    [DB_FIELD_NAME.USER_ID]   : seq
  };

  const connection = requestData.getConnection();
  const statement = Query(NAMESPACE.USER, 'getUser', params);
  const [dataSet] = await connection.query(statement);
  return dataSet[DB_RESULT.ROW_FIRST];
}

const checkUser = async ( requestData ) => {
  const phone = requestData.getBodyValue(DB_FIELD_NAME.PHONE);
  const params = {
    [DB_FIELD_NAME.PHONE]   : phone
  };

  const connection = requestData.getConnection();
  const statement = Query(NAMESPACE.USER, 'checkUser', params);
  const [dataSet] = await connection.query(statement);
  return dataSet[DB_RESULT.ROW_FIRST];
}
























const updateUser = async (requestData, params) => {

    try {
  
      const userID = requestData.getUserID();
      params[DB_FIELD_NAME.USER_ID]= userID;
  
      const connection = requestData.getConnection();
  
      const statement = Query(NAMESPACE.USER,'updateUser', params);
      const res = await connection.query(statement);
  
      return res[DB_RESULT.ROW_FIRST][DB_RESULT.AFFECTED_ROWS] === DB_RESULT.ONE;
    }
    catch (e) {
      Logger.error(e.stack);
      throw e;
    }
};

const deleteUser = async (requestData) => {

    try {
      const userID    = requestData.getUserID();
  
      const connection = requestData.getConnection();
  
      const params = {
        [DB_FIELD_NAME.USER_ID]   : userID,
      };
  
      const statement = Query(NAMESPACE.USER,'deleteUser', params);
      const res = await connection.query(statement);
  
      return res[DB_RESULT.ROW_FIRST][DB_RESULT.AFFECTED_ROWS] === DB_RESULT.ONE;
    }
    catch (e) {
      Logger.error(e.stack);
      throw e;
    }
  };

  const updateProfession = async (requestData) => {
    try {
      const params = {
        seq : requestData.getBodyValue('seq'),
        pro_name : requestData.getBodyValue('pro_name'),
        pro_name_ko : requestData.getBodyValue('pro_name_ko')
      };

      const connection = requestData.getConnection();
  
      const statement = Query(NAMESPACE.USER,'updateProfession', params);
      console.log('=====params======', statement);
      const res = await connection.query(statement);
  
      return res[DB_RESULT.ROW_FIRST][DB_RESULT.AFFECTED_ROWS] === DB_RESULT.ONE;

    } catch (e) {
      Logger.error(e.stack);
      throw e;
    }
  }

  const addProfession = async (requestData) => {
    try {
      const params = {
        pro_name : requestData.getBodyValue('pro_name'),
        ko_name : requestData.getBodyValue('ko_name'),
      };

      const connection = requestData.getConnection();
      const statement = Query(NAMESPACE.USER,'insertProfession', params);
      const res = await connection.query(statement);
      console.log(res, '====sda====');
      return res;
    } catch (e) {
      Logger.error(e.stack);
      throw e;
    }
  }

  const deleteProf = async (requestData) => {
    try {
      const params = {
        seq : requestData.getBodyValue('seq')
      };

      const connection = requestData.getConnection();
      const statement = Query(NAMESPACE.USER,'deleteProfession', params);
      const res = await connection.query(statement);
      return res;
    } catch (e) {
      Logger.error(e.stack);
      throw e;
    }
  }

  const getEmployees = async (requestData, admin = null) => {
    let params = {
      all: null
    };
    if (admin) {
      params.all = true;
    } 
    console.log('======', params);
    const connection = requestData.getConnection();
    const statement = Query(NAMESPACE.USER,'getEmployees', params);
    const [dataSet] = await connection.query(statement);
    return dataSet;
  }

  const deleteEmployee = async (requestData) => {
    const params = {
      seq : requestData.getBodyValue('seq')
    };

    const connection = requestData.getConnection();
    const statement = Query(NAMESPACE.USER,'deleteEmployee', params);
    const res = await connection.query(statement);
    return res;
  }

  const recoverEmployee = async (requestData) => {
    const params = {
      seq : requestData.getBodyValue('seq')
    };

    const connection = requestData.getConnection();
    const statement = Query(NAMESPACE.USER,'recoverEmployee', params);
    const res = await connection.query(statement);
    return res;
  }

  const updateEmployee = async (requestData) => {
    const body = requestData.getBodyValue('info');
    const params = {
      seq: body.seq,
      pro_seq: body.pro_seq,
      team_seq: body.team_seq,
      sort: body.sort,
      levels: body.levels
    };

    const connection = requestData.getConnection();
    const statement = Query(NAMESPACE.USER,'updateEmployee', params);

    console.log(params, '==========', statement);
    const res = await connection.query(statement);
    return res;
  }

  const updatePhoto = async (requestData) => {

    try {
        const params = {
            ['file'] : requestData.getBodyValue('fileSeq') != null ? requestData.getBodyValue('fileSeq') : '',
            ['seq'] : requestData.getBodyValue('seq') != null ? requestData.getBodyValue('seq') : '',
            ['photo'] : requestData.getBodyValue('photo') != null ? requestData.getBodyValue('photo') : ''
        }
    
        await EmployeeModel.removeSingleFile(requestData, params.photo);
        const connection = requestData.getConnection();
        const queryString = Query(NAMESPACE.USER, 'updatePhoto', params);
        console.log('=====', queryString);
        const res = await connection.query(queryString);
        return res;
    } catch (e) {
        Logger.error(e);
        throw e;
    }
}

const checkEmployee = async (requestData) => {
  try {
    const seq = requestData.payload.seq;
    const current = requestData.getBodyValue('current');
    const created = requestData.getBodyValue('created');
    const params = {
      ['seq']       : seq,
      ['password']  : null
    }

    const emp = await EmployeeModel.selectEmployee(requestData, null, seq, current);
    if (!emp) {
      return 401;
    }

    let password = await bcrypt.hash(current, emp.salt);
    if (password != emp.password) {
      return 401;
    }

    params.password =  await bcrypt.hash(created, emp.salt);

    const connection = requestData.getConnection();
    const queryString = Query(NAMESPACE.USER, 'updateEmployeePassword', params);
    const res = await connection.query(queryString);
    return res;

  } catch (e) {
    console.log(e);
    Logger.error(e);
    throw e;
  }
} 

const forgotPassEmp = async (requestData) => {
  
  try {
    const email = requestData.getBodyValue('email');

    if (!email) {
      return;
    }
    const emp = await EmployeeModel.selectEmployee(requestData, email);
    if (!emp) {
      return 401;
    }

    const params = {
      seq: emp.seq,
      salt: emp.salt
    };

    const randText = Math.random().toString(36).slice(-8);
    let password = await bcrypt.hash(randText, params.salt);

    params.password = password;

    await MailModel.sendPassword(email, randText);
    const connection = requestData.getConnection();
    const queryString = Query(NAMESPACE.USER, 'updateEmployeePassword', params);
    const res = await connection.query(queryString);
    return res;

  } catch (e) {
    console.log(e);
      Logger.error(e);
      throw e;
  }
}

const updateFeedback = async (requestData) => {
  const params = {
    seq: requestData.getBodyValue('seq'),
    status: requestData.getBodyValue('status')
  };

  const connection = requestData.getConnection();
  const queryString = Query(NAMESPACE.USER, 'updateFeedBack', params);
  const res = await connection.query(queryString);
  return res;
}
  
  module.exports = {
    selectUser,
    insertUser,
    checkUser,
    updateProfile,
    getUser,




    updateUser,
    deleteUser,
    getSuperAdmin,
    updateProfession,
    addProfession,
    deleteProf,
    getEmployees,
    deleteEmployee,
    updateEmployee,
    updatePhoto,
    forgotPassEmp,
    checkEmployee,
    updateFeedback,
    recoverEmployee
  };