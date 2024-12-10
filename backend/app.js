/*
서버 설정: Express 애플리케이션을 설정하고, CORS, JSON 파싱, 쿠키 파싱 등의 미들웨어를 설정.
파일 업로드 처리: uploads 디렉토리를 생성하고, 해당 디렉토리의 파일을 정적으로 제공.
API 라우트 설정: 다양한 API 경로를 설정하여 각 기능에 맞는 라우터를 연결.
에러 핸들링: 발생한 에러를 처리하여 사용자에게 적절한 에러 메시지를 반환.
연결된 파일
routes 폴더: 다양한 API 경로를 정의한 라우터 파일들이 위치. 각 라우터 파일은 해당 기능을 처리하는 컨트롤러와 연결되어 있다.
예: auth.js, youtube.js, community.js, 등.
uploads 디렉토리: 파일 업로드 시 생성되는 파일들이 저장되는 디렉토리이다.
multer: 파일 업로드를 처리하기 위한 라이브러리이다.
*/

// express 모듈을 불러와 Express 애플리케이션을 생성.
const express = require('express');
// CORS 설정을 위한 cors 모듈을 불러옴.
const cors = require('cors');
// 쿠키를 처리하기 위한 cookie-parser 모듈을 불러옴.
const cookieParser = require('cookie-parser');
// 파일 경로 작업을 위한 path 모듈을 불러옴.
const path = require('path');
// 파일 시스템 작업을 위한 fs 모듈을 불러옴.
const fs = require('fs');
// 파일 업로드를 위한 multer 모듈을 불러옴.
const multer = require('multer');

// Express 애플리케이션 인스턴스를 생성.
const app = express();

// uploads 디렉토리 설정
const uploadsDir = path.resolve(__dirname, 'uploads');
// uploads 디렉토리가 존재하지 않으면 생성.
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// CORS 설정
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:8081', // 허용할 출처
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // 허용할 HTTP 메서드
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'], // 허용할 헤더
    credentials: true, // 쿠키와 자격 증명 허용
    preflightContinue: false, // 프리플라이트 요청 후 계속 여부
    optionsSuccessStatus: 204 // 성공 상태 코드
};

// CORS 미들웨어를 사용.
app.use(cors(corsOptions));
// 모든 OPTIONS 요청에 대해 CORS 설정을 사용.
app.options('*', cors(corsOptions));

// body-parser 설정
app.use(express.json()); // JSON 형식의 body를 파싱
app.use(express.urlencoded({ extended: true })); // URL 인코딩된 body를 파싱
app.use(cookieParser()); // 쿠키 파싱

// 정적 파일 제공 설정
app.use('/uploads', express.static(uploadsDir)); // uploads 디렉토리의 파일을 정적으로 제공

// API 라우트 설정
app.use('/api/auth', require('./routes/auth')); // 인증 관련 API
app.use('/api/youtube', require('./routes/youtube')); // YouTube 관련 API
app.use('/api/community', require('./routes/community')); // 커뮤니티 관련 API
app.use('/api/categories', require('./routes/categoryRoutes')); // 카테고리 관련 API
app.use('/api/search', require('./routes/searchRoutes')); // 검색 관련 API
app.use('/api/admin', require('./routes/admin')); // 관리자 관련 API
app.use('/api/upload', require('./routes/upload')); // 업로드 관련 API
app.use('/api/users', require('./routes/userRoutes')); // 사용자 관련 API

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
    console.error('Error:', err); // 에러를 콘솔에 출력
    
    // multer 에러 처리
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: '파일 크기가 너무 큽니다. (최대 5MB)' }); // 파일 크기 초과 에러 메시지
        }
        return res.status(400).json({ message: '파일 업로드에 실패했습니다.' }); // 기타 multer 에러 메시지
    }

    // 일반 에러 처리
    res.status(500).json({ 
        message: '서버 에러가 발생했습니다.', // 일반 서버 에러 메시지
        error: process.env.NODE_ENV === 'development' ? err.message : undefined // 개발 모드에서만 에러 메시지를 노출
    });
});

// Express 애플리케이션을 모듈로 내보낸다.
module.exports = app;
