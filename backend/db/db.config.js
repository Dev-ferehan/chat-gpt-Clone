import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();


const db = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: Number(process.env.DB_PORT) || 3306,
  connectTimeout: 20000,
  waitForConnections: true,
  connectionLimit: 10
});

async function testConnection() {
  try {
    console.log("connecting to database");
    const connection = await db.getConnection();
    console.log("MySQL connection created successfully!");
    connection.release();
  } catch (err) {
    console.error("Failed to connect to MySQL:", err.message);
  }
}

testConnection();



async function query(sql, params) {

  const [rows, fields] = await db.execute(sql, params);
  return rows;

}

export default db;