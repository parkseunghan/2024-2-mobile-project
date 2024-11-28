const path = require('path');
const fs = require('fs').promises;
const mime = require('mime-types');

exports.uploadToStorage = async (file) => {
    try {
        if (!file) {
            console.log('No file provided');
            return null;
        }

        const uploadsDir = path.resolve(__dirname, '../uploads');
        
        try {
            await fs.access(uploadsDir);
        } catch {
            await fs.mkdir(uploadsDir, { recursive: true });
        }

        // 파일 정보 로깅
        console.log('Uploading file:', {
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            path: file.path
        });

        // 파일 확식 검증
        const allowedMimeTypes = [
            'image/jpeg', 'image/png', 'image/gif', 'image/webp',
            'video/mp4', 'video/webm', 'video/quicktime'
        ];

        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new Error('지원하지 않는 파일 형식입니다.');
        }

        // 파일 확장자 추출
        const extension = mime.extension(file.mimetype);
        if (!extension) {
            throw new Error('파일 확장자를 확인할 수 없습니다.');
        }

        // 원본 파일명에서 특수문자 제거하고 확장자 추가
        const sanitizedFilename = file.originalname
            .replace(/\.[^/.]+$/, '') // 기존 확장자 제거
            .replace(/[^a-zA-Z0-9가-힣._-]/g, ''); // 특수문자 제거
        
        const timestamp = Date.now();
        const filename = `${timestamp}-${sanitizedFilename}.${extension}`;
        const filepath = path.join(uploadsDir, filename);

        // 파일 저장
        if (file.buffer) {
            await fs.writeFile(filepath, file.buffer);
        } else if (file.path) {
            const tempPath = path.resolve(file.path);
            try {
                await fs.copyFile(tempPath, filepath);
                try {
                    await fs.unlink(tempPath);
                } catch (unlinkError) {
                    console.warn('임시 파일 삭제 실패:', unlinkError);
                }
            } catch (err) {
                console.error('파일 복사 에러:', err);
                throw new Error('파일 저장에 실패했습니다.');
            }
        } else {
            throw new Error('유효한 파일 데이터가 없습니다.');
        }

        // 파일 저장 확인
        try {
            await fs.access(filepath);
            console.log('File saved successfully:', filepath);
        } catch (err) {
            throw new Error('파일 저장을 확인할 수 없습니다.');
        }
        
        // 상대 경로 반환
        return `/uploads/${filename}`;
    } catch (error) {
        console.error('파일 업로드 에러:', error);
        throw new Error(`파일 업로드에 실패했습니다: ${error.message}`);
    }
}; 