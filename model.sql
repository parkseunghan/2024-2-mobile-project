use board;

-- 사용자 등급 테이블 추가
CREATE TABLE user_ranks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,     -- 등급명 (Bronze, Silver, Gold, Platinum)
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
  role ENUM('user', 'admin') DEFAULT 'user', -- 권한
  is_active BOOLEAN DEFAULT true,            -- 활동 여부
  bio TEXT,                                    -- 자기소개  
  avatar VARCHAR(255),                         -- 프로필 이미지
  current_rank_id INT,                          -- 현재 등급 ID
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (current_rank_id) REFERENCES user_ranks(id)
);



CREATE TABLE search_history (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  query VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
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


-- post_likes 테이블 생성
CREATE TABLE post_likes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE KEY unique_post_like (post_id, user_id)
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
    name VARCHAR(50) NOT NULL UNIQUE, -- 카테고리 이름
    description TEXT,                 -- 설명
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

-- 게시글 북마크 테이블 추가
CREATE TABLE post_bookmarks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE KEY unique_post_bookmark (post_id, user_id)
);

-- 게시글 신고 테이블 추가
CREATE TABLE post_reports (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    reason TEXT NOT NULL,
    status ENUM('pending', 'resolved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    FOREIGN KEY (post_id) REFERENCES posts(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 댓글 신고 테이블 추가
CREATE TABLE comment_reports (
    id INT PRIMARY KEY AUTO_INCREMENT,
    comment_id INT NOT NULL,
    user_id INT NOT NULL,
    reason TEXT NOT NULL,
    status ENUM('pending', 'resolved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    FOREIGN KEY (comment_id) REFERENCES comments(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
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

-- 기본 등급 데이터 추가
INSERT INTO user_ranks (name, min_score, max_score, color) VALUES 
('Bronze', 0, 99, '#CD7F32'),
('Silver', 100, 499, '#C0C0C0'),
('Gold', 500, 999, '#FFD700'),
('Platinum', 1000, 999999, '#E5E4E2');

-- 기본 카테고리 데이터 추가
INSERT INTO post_categories (name, description) VALUES
('상품 리뷰', '제품 및 서비스 리뷰'),
('취미', '취미 및 여가 활동'),
('건강·운동', '건강 관리 및 운동 정보'),
('맛집', '맛집 추천 및 리뷰'),
('여행', '여행 정보 및 후기'),
('슈퍼전대', '슈퍼전대 관련 정보');


-- 기본 관리자 데이터 추가
INSERT INTO users (username, email, password, role)
VALUES ('admin', 'admin', '$2b$10$aZp98KThXZz6Q4OheflmB.MCzWuf9lOnNrqjCHySl8dvJ6MkjVNYS', 'admin');



DROP TABLE IF EXISTS
    users,
    user_ranks,
    user_scores,
    score_histories,
    post_categories,
    video_summaries,
    search_history,
    search_statistics,
    posts,
    post_likes,
    comments,
    post_bookmarks,
    post_reports,
    comment_reports,
    user_activity_logs;