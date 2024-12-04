const adminMiddleware = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: '인증이 필요합니다.' });
        }
        
        // god 또는 admin 권한 체크
        if (req.user.role !== 'admin' && req.user.role !== 'god') {
            return res.status(403).json({ message: '관리자 권한이 필요합니다.' });
        }
        
        next();
    } catch (error) {
        console.error('관리자 권한 체크 에러:', error);
        res.status(500).json({ message: '서버 에러가 발생했습니다.' });
    }
};

module.exports = adminMiddleware; 