const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * 인증 관련 미들웨어 모음
 */
class AuthMiddleware {
  /**
   * JWT 토큰을 검증하고 사용자 정보를 요청 객체에 추가합니다.
   * @param {Object} req - Express 요청 객체
   * @param {Object} res - Express 응답 객체
   * @param {Function} next - 다음 미들웨어 함수
   */
  static async authenticateToken(req, res, next) {
    try {
      const token = AuthMiddleware.extractToken(req);

      if (!token) {
        return res.status(401).json({ message: '인증 토큰이 필요합니다.' });
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await AuthMiddleware.validateUser(decoded.id);
        
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
  }

  /**
   * 요청에서 토큰을 추출합니다.
   * @private
   * @param {Object} req - Express 요청 객체
   * @returns {string|null} 추출된 토큰
   */
  static extractToken(req) {
    const authHeader = req.headers.authorization;
    return authHeader && authHeader.split(' ')[1];
  }

  /**
   * 사용자 ID로 사용자를 검증합니다.
   * @private
   * @param {number} userId - 사용자 ID
   * @returns {Promise<Object|null>} 검증된 사용자 정보
   */
  static async validateUser(userId) {
    return await User.findById(userId);
  }

  /**
   * 관리자 권한을 확인합니다.
   * @param {Object} req - Express 요청 객체
   * @param {Object} res - Express 응답 객체
   * @param {Function} next - 다음 미들웨어 함수
   */
  static checkAdmin(req, res, next) {
    if (!req.user) {
      return res.status(401).json({ message: '인증이 필요합니다.' });
    }
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: '관리자 권한이 필요합니다.' });
    }
    
    next();
  }

  /**
   * 특정 역할을 가진 사용자만 접근을 허용합니다.
   * @param {string[]} roles - 허용할 역할 목록
   * @returns {Function} 미들웨어 함수
   */
  static hasRole(roles) {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ message: '인증이 필요합니다.' });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: '접근 권한이 없습니다.' });
      }

      next();
    };
  }
}

module.exports = AuthMiddleware; 