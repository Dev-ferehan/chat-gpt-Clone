import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();
const db=mysql.createPool({
    port:process.env.PORT || 8889,
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
})



export default db;
