const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    // 비밀번호 일치 확인
    if (password !== confirmPassword) {
        return res.status(400).json({ message: '비밀번호가 일치하지 않습니다.' });
    }

    try {
        // 사용자 이름과 이메일 중복 검사
        const existingEmail = await User.findByEmail(email);
        const existingUsername = await User.findByUsername(username);

        if (existingEmail) {
            return res.status(400).json({ message: '이메일이 이미 사용 중입니다.' });
        }
        if (existingUsername) {
            return res.status(400).json({ message: '사용자 이름이 이미 사용 중입니다.' });
        }

        // 비밀번호 해싱
        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = await User.create(username, email, hashedPassword, 'user');
        res.status(201).json({ id: userId, username, email });
    } catch (error) {
        res.status(500).json({ message: '회원가입 실패', error });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ message: '유효하지 않은 이메일 또는 비밀번호' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: '유효하지 않은 이메일 또는 비밀번호' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: '로그인 실패', error });
    }
};
