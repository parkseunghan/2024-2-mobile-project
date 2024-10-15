const express = require('express'); // Express 모듈
const cors = require('./config/cors'); // CORS 설정
const dotenv = require('dotenv'); // 환경변수 모듈
const cookieParser = require('cookie-parser'); // 쿠키 파서
const session = require('express-session'); // 세션 관리 모듈
const authRouter = require('./routes/auth'); // 인증 라우터
const sessionConfig = require('./config/session'); // 세션 설정 파일 import
const usersRouter = require('./routes/users')

dotenv.config(); // 환경변수 파일 로드

const app = express(); // Express 앱 초기화
const PORT = process.env.PORT || 5000;

// CORS 설정 (옵션으로 설정 가능)

// 미들웨어 설정
app.use(cors); // CORS 활성화
app.use(cookieParser()); // 쿠키 파서 사용
app.use(express.json()); // JSON 요청 처리
app.use(session(sessionConfig)); // 세션 설정 적용

// 라우터 등록
app.use('/api/auth', authRouter); // 인증 관련 API
app.use('/api/users', usersRouter); // 인증 관련 API

// 서버 실행
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}/ 에서 서버 실행 중.`);
});
