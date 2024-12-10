/*
서버 실행: Express 애플리케이션을 특정 포트에서 실행. 기본적으로 포트 3000에서 실행되며, 환경 변수로 다른 포트를 지정할 수 있음.
환경 변수 로드: dotenv 패키지를 사용하여 .env 파일의 환경 변수를 로드.

연결된 파일
app.js: Express 애플리케이션 인스턴스를 가져옴. app.js에서는 미들웨어 설정, 라우터 등록 등 서버의 주요 설정이 포함됨.
.env 파일: 환경 변수를 정의하는 파일로, 서버의 설정을 관리.
*/

// app.js 파일에서 Express 애플리케이션을 불러옵니다.
const app = require('./app');
// path 모듈을 불러와 파일 경로 작업을 도와줍니다.
const path = require('path');
// .env 파일에서 환경 변수를 로드합니다. .env 파일의 경로를 지정합니다.
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// 포트를 환경 변수에서 가져오거나 기본값으로 3000을 설정합니다.
const PORT = process.env.PORT || 3000;

// 서버를 지정한 포트에서 실행합니다.
app.listen(PORT, () => {
    // 서버가 성공적으로 실행되면 콘솔에 메시지를 출력합니다.
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
