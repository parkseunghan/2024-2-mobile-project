const path = require('path');
const fs = require('fs').promises;

exports.uploadToStorage = async (file) => {
    try {
        const uploadsDir = path.join(__dirname, '../uploads');
        const filename = `${Date.now()}-${file.originalname}`;
        const filepath = path.join(uploadsDir, filename);
        
        await fs.writeFile(filepath, file.buffer);
        
        return `/uploads/${filename}`;
    } catch (error) {
        console.error('파일 업로드 에러:', error);
        throw new Error('파일 업로드에 실패했습니다.');
    }
}; 