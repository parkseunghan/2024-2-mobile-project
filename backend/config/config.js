const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,
    DB_CHARSET: process.env.DB_CHARSET,
    JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret', // 비밀 키 설정
};
