const Pool = require('pg').Pool;
require('dotenv').config();

const PASSWORD = process.env.PASSWORD;
const PORT = process.env.PORT;

const pool = new Pool({
    user : "postgres",
    password : PASSWORD,
    database : "contacts_database",
    host : "localhost",
    port : PORT
});

module.exports = pool;