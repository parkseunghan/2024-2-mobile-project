const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

const app = express();

// CORS 설정
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:8081',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Authorization']
}));

// 미들웨어 설정
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 정적 파일 제공
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 라우트 설정
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/community', require('./routes/community'));
app.use('/api/youtube', require('./routes/youtube'));
app.use('/api/search', require('./routes/search'));
app.use('/api/admin', require('./routes/admin'));

// 기본 라우트
app.get('/', (req, res) => {
    res.json({ message: '서버가 정상적으로 실행 중입니다.' });
});

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ 
        message: '서버 에러가 발생했습니다.',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

module.exports = app; 