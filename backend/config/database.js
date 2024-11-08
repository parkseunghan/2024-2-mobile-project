const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'board',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 데이터베이스 연결 상태 확인
pool.getConnection()
  .then(connection => {
    console.log('데이터베이스 연결 성공!');
    connection.release();
  })
  .catch(err => {
    console.error('데이터베이스 연결 실패:', err.message);
  });

module.exports = pool; 