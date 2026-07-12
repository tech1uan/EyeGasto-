import 'dotenv/config'
import mysql from 'mysql2/promise';


const pool =  mysql.createPool({
 host:process.env.DB_HOST,
 port:process.env.DB_PORT,
 user:process.env.DB_USERNAME,
 password:process.env.DB_PASSWORD,
 database:process.env.DB_DATABASE,
 waitForConnections: true,
    connectionLimit: 2,
    maxIdle: 2,
    idleTimeout: 60000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

export default pool;

