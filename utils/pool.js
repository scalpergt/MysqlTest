require('dotenv').config()
const mysql = require('mysql2')

let env = process.env
const pool = mysql.createPool({
    host: env.DB_HOST, 
    port: env.DB_PORT,
    user: env.DB_USER, 
    password: env.DB_PASSWORD,
    waitForConnections: true,
    connectionLimit : 10,
    database: env.DB_SCHEMA 
})
// now get a Promise wrapped instance of that pool
const promisePool = pool.promise()

module.exports = promisePool
