import 'dotenv/config'
import mysql from 'mysql2/promise';


const pool =  mysql.createPool({
 host:process.env.DB_HOST,
 port:process.env.DB_PORT,
 user:process.env.DB_USERNAME,
 password:process.env.DB_PASSWORD,
 database:process.env.DB_DATABASE
});


export async function createUser(name,password) {
  
  try {
      const [result] = await pool.query(`
       INSERT INTO users(username,password)
       VALUES (?,?)
     `,[name,password]);

     return {
      id:result.insertId,
      username:name,
     }
  } catch (error) {
    throw error
  }
}


export async function getAllUsers() {
  try {
    const [result] = await pool.query(
      `
      SELECT * FROM USERS
      `
    )

    return result;
  } catch (error) {
    throw error
  }
}

