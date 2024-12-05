use board;

-- 사용자 등급 테이블 추가
CREATE TABLE user_ranks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,     -- 등급명 (Bronze, Silver, Gold, Platinum, Diamond)
    min_score INT NOT NULL,               -- 등급 최소 점수
    max_score INT NOT NULL,               -- 등급 최대 점수
    color VARCHAR(7) NOT NULL,            -- 등급 색상 코드
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin', 'god') DEFAULT 'user', -- 권한
  is_active BOOLEAN DEFAULT true,            -- 활동 여부
  bio TEXT,                                    -- 자기소개  
  avatar VARCHAR(255),                         -- 프로필 이미지
  current_rank_id INT default 1,                          -- 현재 등급 ID
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (current_rank_id) REFERENCES user_ranks(id)
);

CREATE TABLE search_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    query VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_created (user_id, created_at DESC)
);

CREATE TABLE search_statistics ( -- 다듬기
  id INT AUTO_INCREMENT PRIMARY KEY,
  query VARCHAR(255) NOT NULL,
  search_count INT DEFAULT 1,
  last_searched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_query (query),
  INDEX idx_last_searched (last_searched_at)
);

-- posts 테이블 생성
CREATE TABLE posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,  -- 카테고리
    media_url VARCHAR(255),         -- 미디어 파일 경로
    is_deleted BOOLEAN DEFAULT false, -- 삭제 여부
    is_notice BOOLEAN DEFAULT false, -- 공지사항 여부
    is_hidden BOOLEAN DEFAULT false, -- 숨김 여부
    last_comment_at TIMESTAMP,       -- 최근 댓글 시간
    view_count INT DEFAULT 0,        -- 조회수
    score INT DEFAULT 0,            -- 게시글 점수
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);


-- 게시글 좋아요 테이블
CREATE TABLE post_likes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_like (post_id, user_id)
);

-- comments 테이블 생성
CREATE TABLE comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    user_id INT NOT NULL,  
    parent_id INT NULL,             -- 대댓글 지원
    depth INT DEFAULT 0,            -- 댓글 깊이
    content TEXT NOT NULL,
    is_deleted BOOLEAN DEFAULT false, -- 삭제 여부
    like_count INT DEFAULT 0,        -- 좋아요 수
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (parent_id) REFERENCES comments(id)
);


CREATE TABLE video_summaries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    video_id VARCHAR(255) NOT NULL UNIQUE, -- 비디오 ID
    summary_text TEXT NOT NULL,          -- 요약 텍스트
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_video_id (video_id)
);


-- 게시글 카테고리 테이블 추가
CREATE TABLE post_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 댓글 좋아요 테이블 추가
CREATE TABLE comment_likes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    comment_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (comment_id) REFERENCES comments(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE KEY unique_comment_like (comment_id, user_id)
);

-- 투표 옵션 테이블
CREATE TABLE poll_options (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    text VARCHAR(200) NOT NULL,
    votes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

-- 투표 기록 테이블
CREATE TABLE poll_votes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    option_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (option_id) REFERENCES poll_options(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_vote (post_id, user_id)
);

-- 사용자 활동 로그 테이블 추가
CREATE TABLE user_activity_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    activity_type ENUM('post', 'comment', 'like', 'bookmark', 'report') NOT NULL,
    target_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 사용자 점수 테이블 추가
CREATE TABLE user_scores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    score INT DEFAULT 0,                  -- 현재 점수
    total_posts INT DEFAULT 0,            -- 총 게시글 수
    total_comments INT DEFAULT 0,         -- 총 댓글 수
    total_likes_received INT DEFAULT 0,   -- 받은 좋아요 수
    total_view_counts INT DEFAULT 0,      -- 전체 게시글 조회수 합계
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 점수 이력 테이블 추가
CREATE TABLE score_histories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    score_change INT NOT NULL,            -- 점수 변동량
    reason VARCHAR(50) NOT NULL,          -- 점수 변동 사유
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 관리자 활동 로그 테이블 추가
CREATE TABLE admin_activity_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    admin_id INT NOT NULL,
    activity_type ENUM('user_manage', 'post_manage', 'category_manage', 'admin_manage') NOT NULL,
    action VARCHAR(50) NOT NULL,           -- 수행한 작업 (create, update, delete 등)
    target_type VARCHAR(50) NOT NULL,      -- 대상 타입 (user, post, category 등)
    target_id INT NOT NULL,                -- 대상 ID
    details TEXT,                          -- 작업 세부 내용
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES users(id)
);

CREATE TABLE visits (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    page VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 기본 등급 데이터 추가
INSERT INTO user_ranks (name, min_score, max_score, color) VALUES 
('Bronze', 0, 99, '#CD7F32'),
('Silver', 100, 499, '#C0C0C0'),
('Gold', 500, 999, '#FFD700'),
('Platinum', 1000, 4999, '#E5E4E2'),
('Diamond', 5000, 999999, '#B9F2FF');

-- 테스트 계정 생성 (비밀번호는 'superuser!1'로 해시화)
INSERT INTO users (username, email, password, role, current_rank_id)
VALUES 
('god', 'god', '$2b$10$3Cl2A2TtIzdPLLuy/3.wluT3Hrg0/lG9Lq2kKUAXtkAUHM.U6ni1a', 'god', 
 (SELECT id FROM user_ranks WHERE name = 'Diamond'));

-- god 계정의 초기 점수 설정
INSERT INTO user_scores (user_id, score)
SELECT id, 5000
FROM users
WHERE email = 'god';


CREATE INDEX idx_visits_created_at ON visits(created_at);
CREATE INDEX idx_visits_user_id ON visits(user_id); 

-- 모든 테이블 삭제 (필요시 주석 해제하여 사용)
-- SET FOREIGN_KEY_CHECKS = 0;
-- DROP TABLE IF EXISTS
--     admin_activity_logs,
--     user_activity_logs,
--     comment_likes,
--     post_likes,
--     score_histories,
--     user_scores,
--     comments,
--     posts,
--     video_summaries,
--     search_statistics,
--     search_history,
--     post_categories,
--     users,
--     user_ranks,
--     visits,
--     poll_options,
--     poll_votes; 
-- SET FOREIGN_KEY_CHECKS = 1;





