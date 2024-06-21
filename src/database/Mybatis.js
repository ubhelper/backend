const path = require('path');
const mybatisMapper = require('mybatis-mapper');

mybatisMapper.createMapper([
    // path.resolve(__dirname, "mapper/teamMapper.xml"),
    // path.resolve(__dirname, "mapper/projectMapper.xml"),
    path.resolve(__dirname, "mapper/fileMapper.xml"),
    path.resolve(__dirname, "mapper/userMapper.xml"),
    // path.resolve(__dirname, "mapper/siteMapper.xml"),
    // path.resolve(__dirname, "mapper/blogMapper.xml"),
]);

const Query = (nameSpace, sqlID, params) =>{
    return mybatisMapper.getStatement(nameSpace, sqlID, params, {language: 'sql', indent: ' '});
}

module.exports = Query;