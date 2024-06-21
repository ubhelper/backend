const DB_FIELD_NAME = {
  USER_ID       :     'id',
  PHONE         :     'phone',
  USER_NAME     :     'user_name',
  PASSWORD      :     'password',
  SALT          :     'salt',
  FIRST_NAME    :     'first_name',
  LAST_NAME     :     'last_name',
  EMAIL         :     'email',
  REGISTER      :     'register',
  GENDER        :     'gender',
  ROLE_ID       :     'role_id',
  PROFILE       :     'profile',
  SEQ           :     'seq',
  FILE_SEQ      :     'fileSeq'
};

const DB_RESULT       = {
  ROW_FIRST       :  0   ,             
  AFFECTED_ROWS   : 'affectedRows'  ,
  INSERT_ID       : 'insertId'      ,
  WARNING_STATUS  : 'warningStatus' ,
  ONE             : 1               ,
};

const DB_STATE       = {
    CLOSE        :  0    ,          // Close
    OPEN         :  1    ,          // Open
    LOCK         :  2    ,          // Lock
    DELETE       :  3    ,          // Delete
  
    YES          : 'Y'   ,
    NO           : 'N'   ,
  };
  
const NUMERIC          = {
  ZERO                          : 0   ,
  ONE                           : 1   ,
  TWO                           : 2   ,
};
  
const DATA_FIELD_NAME = {
  AUTHORIZATION       : 'authorization'         ,
  BEARER              : 'Bearer '               ,
  JWT_DECODE          : 'jwtDecode'             ,
  TOKEN               : 'token'                 ,
  PAGE                : 'page'                  ,
  PAGE_SIZE           : 'pageSize'              ,
  SKIP                : 'pageSkip'              ,

  PAYLOAD             : 'payload'               ,
  DATA                : 'data'                  ,
  BODY                : 'body'                  ,
};

const DB_TABLE_NAME = {
  USERS               : 't_users'               ,
  FILES               : 't_file'                ,
  JOBS                : 't_job'                 ,
  JOB_APPLY           : 't_job_apply'           ,
  ROLES               : 't_roles'               ,
  USER_FAV            : 't_user_favorite'       ,
  REVIEW              : 't_user_review'         ,
  USER_VERIFIED       : 't_user_verified'       ,
  USER_WALLET         : 't_user_wallet'         ,
};

const NAMESPACE = {
  USER                :   'userMapper'          ,
  TEAM                :   'teamMapper'          ,
  PROJECT             :   'projectMapper'       ,
  FILE                :   'fileMapper'          ,
  SITE                :   'siteMapper'          ,
  BLOG                :   'blogMapper'          ,
};

const PAGING_DEFAULT = {
  [DATA_FIELD_NAME.PAGE]      : 1 ,
  [DATA_FIELD_NAME.PAGE_SIZE] : 10,
};

const DATE_FORMAT = {
  YYYY_MM_DD          : 'YYYY-MM-DD',
  YYYY_MM_DD_H_MM_SS  : 'YYYY-MM-DD h:mm:ss',
}

const HTTP_REQUEST = {
  METHOD  : 'METHOD'  ,   
  URL     : 'URL'     ,    
};

module.exports = {
  DB_FIELD_NAME      ,
  DATA_FIELD_NAME    ,
  DB_RESULT          ,
  NUMERIC            ,
  DB_STATE           ,
  NAMESPACE          ,
  PAGING_DEFAULT     ,
  DATE_FORMAT        ,
  HTTP_REQUEST       ,
  DB_TABLE_NAME      ,
};