// config/cors.js
const cors = require('cors');

const corsOptions = {
    origin: process.env.CORS_ORIGIN || 'http://localhost:8081', // 클라이언트 도메인 설정
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // 쿠키를 포함한 요청을 허용
};

module.exports = cors(corsOptions);
