const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = express();

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL
    : ['http://localhost:8081'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
// GET:
// /api/auth/me: 현재 사용자 정보 조회
// /api/admin/users: 사용자 목록 조회
// /api/youtube/search: 동영상 검색
// /api/youtube/videos/:videoId: 동영상 상세 정보 조회
// /api/search/history: 검색 기록 조회
// POST:
// /api/auth/signup: 회원가입
// /api/auth/login: 로그인
// /api/auth/logout: 로그아웃
// /api/search/history: 검색 기록 저장
// PUT:
// /api/admin/users/:id/role: 사용자 역할 업데이트
// DELETE:
// /api/admin/users/:id: 사용자 비활성화
// /api/search/history: 전체 검색 기록 삭제
// /api/search/history/:query: 특정 검색어 삭제
// OPTIONS:
// CORS preflight 요청을 처리하기 위해 필요
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Referer'],
  // Content-Type: 요청 본문의 미디어 타입, Authorization: 인증 토큰, Origin: 요청 출처, Referer: 유입 경로 추적
  exposedHeaders: ['Content-Length', 'X-Requested-With']
  // Content-Length: 응답 본문의 길이, X-Requested-With: 요청 출처 추적
}));

app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
}

app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/youtube', require('./routes/youtube'));
app.use('/api/search', require('./routes/search'));

app.get('/', (req, res) => {
  res.json({ message: '서버가 정상적으로 실행 중입니다.' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: '서버 오류가 발생했습니다.' });
});

const PORT = process.env.PORT || 4000; // 디버깅용 4000. 3000으로 해야됨
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
