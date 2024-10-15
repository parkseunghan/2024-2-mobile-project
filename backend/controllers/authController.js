const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    if (!username || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: '모든 필드를 입력해주세요.' });
    }

    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // if (!emailRegex.test(email)) {
    //     return res.status(400).json({ message: '유효하지 않은 이메일 형식입니다.' });
    // }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: '비밀번호가 일치하지 않습니다.' });
    }

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&#])[a-zA-Z\d@$!%*?&#]{10,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ message: '비밀번호는 최소 10자리이며, 영문, 숫자, 특수문자를 포함해야 합니다.' });
    }

    try {
        const existingEmail = await User.findByEmail(email);
        const existingUsername = await User.findByUsername(username);

        if (existingEmail) {
            return res.status(400).json({ message: '이메일이 이미 사용 중입니다.' });
        }
        if (existingUsername) {
            return res.status(400).json({ message: '사용자 이름이 이미 사용 중입니다.' });
        }

        const userId = await User.create(username, email, password, 'user');
        res.status(201).json({ id: userId, username, email });
    } catch (error) {
        res.status(500).json({ message: '회원가입 실패', error });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: '이메일과 비밀번호를 모두 입력해주세요.' });
    }

    try {
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ message: '이메일 또는 비밀번호가 일치하지 않습니다.' });
        }

        const isMatch = await User.comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: '이메일 또는 비밀번호가 일치하지 않습니다.' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });

        res.cookie('authToken', token, {
            httpOnly: true, // 클라이언트에서 쿠키 접근을 막음
            secure: false, // 로컬 개발 시에는 false
            sameSite: 'Lax', // CSRF 방지를 위한 설정
            maxAge: 60 * 60 * 1000, // 쿠키 유효 기간 1시간
        });

        res.status(200).json({ message: '로그인 성공', user: { id: user.id, username: user.username, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: '로그인 실패', error });
    }
};

exports.logout = (req, res) => {
    // 쿠키 삭제
    res.clearCookie('authToken', {
        httpOnly: true, // 쿠키가 httpOnly로 설정되어 있으므로 동일하게 설정
        secure: false, // 로컬 개발 시에는 false
        sameSite: 'Lax', // SameSite 속성을 동일하게 유지
        path: '/', // 쿠키가 설정된 경로를 정확히 지정
    });

    // connect.sid 쿠키 삭제
    res.clearCookie('connect.sid', {
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
        path: '/',
    });

    // 세션 종료
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: '로그아웃 중 오류가 발생했습니다.' });
        }
        res.status(200).json({ message: '로그아웃 되었습니다.' });
    });
};

exports.checkAuth = (req, res) => {
    if (req.session.userId) {
        return res.status(200).json({ message: '인증됨' });
    }
    return res.status(401).json({ message: '인증되지 않음' });
};
