const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, upload.single('media'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: '파일이 없습니다.' });
        }

        // 파일 URL 생성 (uploads 디렉토리 기준)
        const fileUrl = `/uploads/${req.file.filename}`;
        
        res.json({
            url: fileUrl,
            message: '파일 업로드 성공'
        });
    } catch (error) {
        console.error('파일 업로드 에러:', error);
        res.status(500).json({ message: '파일 업로드에 실패했습니다.' });
    }
});

module.exports = router; 