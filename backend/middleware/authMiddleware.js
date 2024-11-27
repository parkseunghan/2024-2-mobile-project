const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT 인증 미들웨어
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

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
      console.error('Token verification error:', err);
      return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ message: '서버 에러가 발생했습니다.' });
  }
};

module.exports = {
  authenticateToken
}; 