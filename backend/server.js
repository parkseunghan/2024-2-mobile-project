const express = require('express'); // Express 모듈
const cors = require('cors'); // CORS 모듈
const dotenv = require('dotenv'); // 환경변수 모듈

const authRouter = require('./routes/auth'); // 인증 라우트


dotenv.config(); // 환경변수 파일 로드
const app = express(); // Express 앱 초기화
const PORT = process.env.PORT || 5000;

app.use(express.json()); // JSON 요청 처리
app.use(cors()); // CORS를 활성화


// 라우터 등록
app.use('/api/auth', authRouter); // 인증 관련 API



app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}/ 에서 서버 실행 중.`);
});
