const app = require('./app');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
