// const mysql = require('mysql');
const mysql   = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectionLimit: process.env.DB_CONNECTION_LIMIT,
    multipleStatements: true,
    typeCast : true
});


const getPoolConnection = async () => {
    const connection = 
        await pool.promise().getConnection(async (err, conn) => {
            if (err) 
                console.log(err);
            else
                console.log(`Connection success`);
        });
    return connection;
  }

module.exports =  {
    getPoolConnection,
    execute: (...params) => pool.execute(...params)
}