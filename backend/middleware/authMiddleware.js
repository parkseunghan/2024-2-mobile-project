const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    let token = req.headers.authorization?.split(' ')[1];
    if (!token && req.cookies) {
      token = req.cookies.authToken;
    }
    
    if (!token) {
      console.log('토큰이 없음');
      return res.status(401).json({ message: '인증이 필요합니다.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('토큰 디코드 결과:', decoded);

    const user = await User.findById(decoded.id);
    if (!user) {
      console.log('사용자를 찾을 수 없음:', decoded.id);
      return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
    }

    req.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      rank_name: user.rank_name,
      rank_color: user.rank_color
    };
    
    next();
  } catch (error) {
    console.error('인증 미들웨어 에러:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: '만료된 토큰입니다.' });
    }
    res.status(401).json({ message: '인증에 실패했습니다.' });
  }
};

module.exports = authMiddleware; 