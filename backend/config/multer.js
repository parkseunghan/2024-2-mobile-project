const multer = require('multer');
const path = require('path');
const fs = require('fs');

// uploads 디렉토리가 없으면 생성
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // 원본 파일명에서 특수문자 제거
    const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9가-힣._-]/g, '');
    // 타임스탬프 + 원본파일명으로 저장
    const filename = `${Date.now()}-${sanitizedFilename}`;
    cb(null, filename);
  }
});

const fileFilter = (req, file, cb) => {
  // 허용할 파일 형식 정의
  const allowedMimeTypes = [
    // 이미지
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    // 동영상
    'video/mp4',
    'video/webm',
    'video/quicktime'  // .mov
  ];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('지원하지 않는 파일 형식입니다. (이미지 또는 동영상 파일만 업로드 가능)'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB로 제한 상향
    files: 1 // 한 번에 하나의 파일만
  },
  fileFilter: fileFilter
});

module.exports = upload; 