const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT 인증 미들웨어
const authenticateToken = async (req, res, next) => {
  try {
    // Authorization 헤더 또는 쿠키에서 토큰 확인
    const authHeader = req.headers.authorization;
    const cookieToken = req.cookies.authToken;
    const token = (authHeader && authHeader.split(' ')[1]) || cookieToken;

    if (!token) {
      return res.status(401).json({ message: '인증 토큰이 필요합니다.' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      
      if (!user) {
        return res.status(401).json({ message: '유효하지 않은 사용자입니다.' });
      }

      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ message: '서버 에러가 발생했습니다.' });
  }
};

// 관리자 권한 체크 미들웨어
const isAdmin = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: '인증이 필요합니다.' });
  }
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: '관리자 권한이 필요합니다.' });
  }
  next();
};

module.exports = {
  authenticateToken,
  isAdmin
}; 