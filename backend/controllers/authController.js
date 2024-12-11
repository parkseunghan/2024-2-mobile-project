const jwt = require('jsonwebtoken'); // JWT 모듈을 불러옴.
const User = require('../models/User'); // User 모델을 불러옴.

/**
 * 사용자 관련 인증 기능을 제공하는 미들웨어 클래스
 */
exports.signup = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    // 모든 필드가 입력되었는지 확인
    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({ 
        message: '모든 필드를 입력해주세요.' 
      });
    }

    // 비밀번호 일치 여부 확인
    if (password !== confirmPassword) {
      return res.status(400).json({
        message: '비밀번호가 일치하지 않습니다.'
      });
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: '올바른 이메일 형식이 아닙니다.'
      });
    }

    // 비밀번호 형식 검증
    const passwordRegex = /^(?:[A-Za-z\d!@#$%^&*()_+={}\[\]:;"'<>,.?\/~`]{6,})$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: '비밀번호는 최소 6자 이상이어야 하며, 영문, 특수문자, 숫자를 포함해야 합니다.'
      });
    }

    // 이미 사용 중인 이메일인지 확인
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ 
        message: '이미 사용 중인 이메일입니다.' 
      });
    }

    // 사용자 생성
    const user = await User.create({
      username,
      email,
      password,
      role: 'user'
    });

    res.status(201).json({
      message: '회원가입이 완료되었습니다.',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('회원가입 에러:', error);
    res.status(500).json({ 
      message: '회원가입에 실패했습니다.' 
    });
  }
};

/**
 * 사용자 로그인
 * @param {Object} req - 요청 객체
 * @param {Object} res - 응답 객체
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 이메일과 비밀번호가 입력되었는지 확인
    if (!email || !password) {
      return res.status(400).json({ 
        message: '이메일과 비밀번호를 입력해주세요.' 
      });
    }

    // 사용자 조회
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ 
        message: '이메일 또는 비밀번호가 일치하지 않습니다.' 
      });
    }

    // 비밀번호 검증
    const isValid = await User.verifyPassword(password, user.password);
    if (!isValid) {
      return res.status(401).json({ 
        message: '이메일 또는 비밀번호가 일치하지 않습니다.' 
      });
    }

    // JWT 생성
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // 쿠키에 토큰 저장
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.json({
      message: '로그인 성공',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        rank: user.rank_name,
        rankColor: user.rank_color
      }
    });
  } catch (error) {
    console.error('로그인 에러:', error);
    res.status(500).json({ 
      message: '로그인에 실패했습니다.' 
    });
  }
};

/**
 * 사용자 로그아웃
 * @param {Object} req - 요청 객체
 * @param {Object} res - 응답 객체
 */
exports.logout = (req, res) => {
  res.clearCookie('authToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  res.json({ message: '로그아웃되었습니다.' });
};

/**
 * 현재 사용자 정보 조회
 * @param {Object} req - 요청 객체
 * @param {Object} res - 응답 객체
 */
exports.getMe = async (req, res) => {
  try {
    // 인증된 사용자 정보가 있는지 확인
    if (!req.user || !req.user.id) {
      console.log('인증되지 않은 요청');
      return res.status(401).json({ message: '인증되지 않았습니다.' });
    }

    // 사용자 정보 조회
    const user = await User.findById(req.user.id);
    if (!user) {
      console.log('사용자를 찾을 수 없음:', req.user.id);
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    console.log('사용자 정보 조회 성공:', user.id);
    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        rank: user.rank_name,
        rankColor: user.rank_color,
        points: user.points
      }
    });
  } catch (error) {
    console.error('사용자 정보 조회 에러:', error);
    res.status(500).json({ message: '사용자 정보 조회에 실패했습니다.' });
  }
};
