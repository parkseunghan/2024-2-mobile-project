const jwt = require('jsonwebtoken');
const db = require('../config/database');

exports.checkRole = (requiredRole) => async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.authToken;
    
    if (!token) {
      return res.status(401).json({ message: '인증이 필요합니다.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const [rows] = await db.execute(
      'SELECT id, email, role FROM users WHERE id = ?',
      [decoded.id]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    const user = rows[0];

    // 권한 체크 로직
    switch (requiredRole) {
      case 'god':
        if (user.role !== 'god') {
          return res.status(403).json({ message: 'God 권한이 필요합니다.' });
        }
        break;
      case 'admin':
        if (user.role !== 'admin' && user.role !== 'god') {
          return res.status(403).json({ message: '관리자 권한이 필요합니다.' });
        }
        break;
      case 'user':
        // 모든 인증된 사용자 허용
        break;
      default:
        return res.status(403).json({ message: '잘못된 권한입니다.' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: '만료된 토큰입니다.' });
    }
    console.error('인증 미들웨어 에러:', error);
    res.status(500).json({ message: '서버 에러가 발생했습니다.' });
  }
}; 