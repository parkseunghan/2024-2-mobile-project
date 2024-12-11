/**
 * 관리자 권한을 확인하는 미들웨어
 * @param {Object} req - 요청 객체
 * @param {Object} res - 응답 객체
 * @param {Function} next - 다음 미들웨어로 이동하는 함수
 */
const adminMiddleware = (req, res, next) => {
    try {
        // 인증된 사용자 정보가 없을 경우
        if (!req.user) {
            return res.status(401).json({ message: '인증이 필요합니다.' }); // 인증 필요 메시지 반환.
        }
        
        // god 또는 admin 권한 체크
        if (req.user.role !== 'admin' && req.user.role !== 'god') { // 사용자의 역할이 admin 또는 god이 아닌 경우
            return res.status(403).json({ message: '관리자 권한이 필요합니다.' }); // 관리자 권한 필요 메시지 반환.
        }
        
        next(); // 다음 미들웨어로 이동.
    } catch (error) {
        console.error('관리자 권한 체크 에러:', error); // 에러 로그 출력.
        res.status(500).json({ message: '서버 에러가 발생했습니다.' }); // 서버 에러 메시지 반환.
    }
};

module.exports = adminMiddleware; // adminMiddleware 모듈을 내보냄.
