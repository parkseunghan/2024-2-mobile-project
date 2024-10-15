'''
user: 기본 유저
admin: 관리자

active: 현재 활성화된 상태로, 사용자가 볼 수 있는 데이터.
inactive: 비활성 상태로, 사용자가 볼 수 없는 데이터.
deleted: 삭제된 데이터로, 필요시 복구가 가능하도록 남겨둔 데이터.
'''
USE board;

-- 사용자 테이블 생성
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,  -- 유일한 사용자 이름
    email VARCHAR(255) NOT NULL UNIQUE,     -- 유일한 이메일
    password VARCHAR(255) NOT NULL,          -- 해싱된 비밀번호 저장
    role ENUM('user', 'admin') NOT NULL DEFAULT 'user',  -- 'admin' 또는 'user'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


-- 게시글 테이블 생성
CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author_id INT NOT NULL,
    status ENUM('active', 'deleted') DEFAULT 'active',  -- 게시글 상태
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_author_id (author_id)  -- 인덱스 추가
);

-- 댓글 테이블 생성
CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    author_id INT NOT NULL,
    comment TEXT NOT NULL,
    status ENUM('active', 'deleted') DEFAULT 'active',  -- 댓글 상태
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_post_id (post_id),  -- 인덱스 추가
    INDEX idx_author_id (author_id)  -- 인덱스 추가
);

-- 관리자 공지사항 테이블 생성
CREATE TABLE admin_announcements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',  -- 공지사항 상태
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_admin_id (admin_id)  -- 인덱스 추가
);

-- 관리자 로그 테이블 생성
CREATE TABLE admin_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT NOT NULL,  -- 어떤 관리자가 수행했는지
    action VARCHAR(255) NOT NULL,  -- 수행한 행동
    description TEXT,  -- 행동에 대한 자세한 설명
    log_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- 로그 생성 시간
    FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 비밀번호 재설정
CREATE TABLE password_resets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,  -- 비밀번호 리셋을 위한 토큰
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,  -- 토큰 만료 시간
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 사용자 프로필
CREATE TABLE user_profiles (
    user_id INT PRIMARY KEY,
    bio TEXT,  -- 사용자 소개
    profile_picture VARCHAR(255),  -- 프로필 사진 URL
    website VARCHAR(255),  -- 개인 웹사이트 URL
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


-- 게시판 게시글 좋아요
CREATE TABLE post_likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (post_id, user_id)  -- 같은 게시글에 중복된 좋아요 방지
);


-- 댓글 좋아요
CREATE TABLE comment_likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    comment_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (comment_id, user_id)  -- 같은 댓글에 중복된 좋아요 방지
);

-- 사용자 로그
CREATE TABLE user_activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    action VARCHAR(255) NOT NULL,
    log_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


-- DROP TABLE IF EXISTS
--     users,
--     posts,
--     comments,
--     admin_announcements,
--     admin_logs,
--     password_resets,
--     user_profiles,
--     post_likes,
--     comment_likes,
--     user_activity_logs;

