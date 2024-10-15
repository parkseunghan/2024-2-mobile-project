const mysql = require('mysql2');
const config = require('../config/config');

// 데이터베이스 연결 풀 생성
const pool = mysql.createPool({
    host: config.DB_HOST,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,
    charset: config.DB_CHARSET,
});

// 연결 확인을 위한 테스트
pool.getConnection((err) => {
    if (err) {
        console.error('데이터베이스 연결 실패:', err);
        throw err; // 에러 발생시 프로그램 종료
    }
    console.log('데이터베이스에 성공적으로 연결되었습니다.');
});

// promise 기반으로 반환
module.exports = pool.promise();
