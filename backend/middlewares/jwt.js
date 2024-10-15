const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    // 쿠키에서 JWT 토큰 추출
    const token = req.cookies.authToken;

    // 토큰이 없으면 인증 실패
    if (!token) {
        return res.status(401).json({ message: '로그인이 필요합니다.' });
    }

    // JWT 검증
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
        }

        // 요청 객체에 사용자 정보를 추가
        req.user = user;
        next(); // 다음 미들웨어로 진행
    });
};

module.exports = authenticateToken;
