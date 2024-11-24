const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

const app = express();

// 미들웨어 설정
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:8081',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// uploads 디렉토리 생성 및 static 파일 서빙 설정
const uploadsDir = path.join(__dirname, 'uploads');
const fs = require('fs');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}
app.use('/uploads', express.static(uploadsDir));

// 라우터 설정
const authRouter = require('./routes/auth');
const youtubeRouter = require('./routes/youtube');
const searchRouter = require('./routes/search');
const adminRouter = require('./routes/admin');
const communityRouter = require('./routes/community');

app.use('/api/auth', authRouter);
app.use('/api/youtube', youtubeRouter);
app.use('/api/search', searchRouter);
app.use('/api/admin', adminRouter);
app.use('/api/community', communityRouter);

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: '서버 에러가 발생했습니다.',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

module.exports = app; 