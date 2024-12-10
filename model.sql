use board;

-- 사용자 등급 테이블 추가
CREATE TABLE user_ranks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,     -- 등급명 (Bronze, Silver, Gold, Platinum, Diamondm, Master,God)
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
  FOREIGN KEY (current_rank_id) REFERENCES user_ranks(id),
  last_login_at TIMESTAMP NULL DEFAULT NULL
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
    summary_text TEXT NOT NULL,          -- ��약 텍스트
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

-- 사용자 점수 테이블
CREATE TABLE user_scores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    total_score INT DEFAULT 0,              -- 총 점수
    post_score INT DEFAULT 0,               -- 게시글 작성 점수
    comment_score INT DEFAULT 0,            -- 댓글 작성 점수
    received_like_score INT DEFAULT 0,      -- 받은 좋아요 점수
    received_comment_score INT DEFAULT 0,    -- 받은 댓글 점수
    view_score INT DEFAULT 0,               -- 조회수 점수
    total_posts INT DEFAULT 0,              -- 총 게시글 수
    total_comments INT DEFAULT 0,           -- 총 댓글 수
    total_received_likes INT DEFAULT 0,     -- 받은 총 좋아요 수
    total_received_comments INT DEFAULT 0,  -- 받은 총 댓글 수
    total_views INT DEFAULT 0,              -- 총 조회수
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 점수 설정 테이블
CREATE TABLE score_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    activity_type VARCHAR(50) NOT NULL UNIQUE,  -- 활동 유형
    points INT NOT NULL,                        -- 점수
    max_points_per_item INT default NULL comment '항목당 최대 점수 (NULL인 경우 제한 없음)',
    description TEXT,                           -- 설명
    updated_by INT,                             -- 수정한 관리자
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (updated_by) REFERENCES users(id)
);

-- 기본 점수 설정 추가
INSERT INTO score_settings 
(activity_type, points, max_points_per_item, description) 
VALUES 
('post_creation', 10, NULL, '게시물 작성'),
('comment_creation', 5, NULL, '댓글 작성'),
('received_like', 2, NULL, '받은 좋아요'),
('received_comment', 3, NULL, '받은 댓글'),
('view_count', 1, 10, '조회수 1회당(게시물당 최대 10점)');

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
INSERT INTO user_ranks (name, min_score, max_score, color) 
VALUES 
('Bronze', 0, 999, '#CD7F32'),
('Silver', 1000, 4999, '#C0C0C0'),
('Gold', 5000, 49999, '#FFD700'),
('Platinum', 50000, 999999, '#b2d1d0'),
('Diamond', 1000000, 9999999, '#B9F2FF'),
('Master', 10000000, 99999999, '#6A0FAD'),
('God', 100000000, 2147483647, '#C72C41');

-- 테스트 계정 생성 (비밀번호는 'superuser!1'로 해시화)
INSERT INTO users (username, email, password, role, current_rank_id)
VALUES 
('god', 'god', '$2b$10$3Cl2A2TtIzdPLLuy/3.wluT3Hrg0/lG9Lq2kKUAXtkAUHM.U6ni1a', 'god', 
 (SELECT id FROM user_ranks WHERE name = 'God')),
 ('admin', 'admin', '$2b$10$3Cl2A2TtIzdPLLuy/3.wluT3Hrg0/lG9Lq2kKUAXtkAUHM.U6ni1a', 'admin', 
 (SELECT id FROM user_ranks WHERE name = 'Master')),
 ('user1', 'user1', '$2b$10$KAdw5SESnXiXhMrqkFu4j.h.qWg58W7eQMEDZyXurCHWmbKbulueu', 'user', 
 (SELECT id FROM user_ranks WHERE name = 'Diamond')),
 ('user2', 'user2', '$2b$10$KAdw5SESnXiXhMrqkFu4j.h.qWg58W7eQMEDZyXurCHWmbKbulueu', 'user', 
 (SELECT id FROM user_ranks WHERE name = 'Platinum')),
 ('user3', 'user3', '$2b$10$KAdw5SESnXiXhMrqkFu4j.h.qWg58W7eQMEDZyXurCHWmbKbulueu', 'user', 
 (SELECT id FROM user_ranks WHERE name = 'Gold')),
 ('user4', 'user4', '$2b$10$KAdw5SESnXiXhMrqkFu4j.h.qWg58W7eQMEDZyXurCHWmbKbulueu', 'user', 
 (SELECT id FROM user_ranks WHERE name = 'Silver')),
 ('user5', 'user5', '$2b$10$KAdw5SESnXiXhMrqkFu4j.h.qWg58W7eQMEDZyXurCHWmbKbulueu', 'user', 
 (SELECT id FROM user_ranks WHERE name = 'Bronze'));

 
 -- Bronze, Silver, Gold, Platinum, Diamond
 

-- god 계정의 초기 점수 설정
INSERT INTO user_scores (user_id, total_score) 
values
((SELECT id FROM users WHERE email = 'god'), 100000000),
((SELECT id FROM users WHERE email = 'admin'), 10000000),
((SELECT id FROM users WHERE email = 'user1'), 1000000),
((SELECT id FROM users WHERE email = 'user2'), 50000),
((SELECT id FROM users WHERE email = 'user3'), 5000),
((SELECT id FROM users WHERE email = 'user4'), 1000),
((SELECT id FROM users WHERE email = 'user5'), 0);

-- 기본 게시글 카테고리 데이터 추가
INSERT INTO post_categories (name, description, created_by) VALUES
('공부', '공부 꿀팁 게시글', 1),
('요리', '요리 꿀팁 게시글', 1),
('컴퓨터', '컴퓨터 꿀팁 게시글', 1),
('스마트폰', '스마트폰 꿀팁 게시글', 1),
('생활', '생활 꿀팁 게시글', 1),
('운동', '운동 꿀팁 게시글', 1),
('패션', '패션 꿀팁 게시글', 1),
('자동차', '자동차 꿀팁 게시글', 1),
('공지', '공지 게시글', 1),
('이벤트', '이벤트 게시글', 1);

-- 기본 게시글 데이터 추가
INSERT INTO posts (user_id, title, content, category, media_url, is_deleted, is_notice, is_hidden, last_comment_at, view_count, score) VALUES
(1, '효율적인 공부법', '효율적으로 공부하는 방법에 대한 글입니다.', '공부', NULL, false, false, false, NULL, 120, 12),
(2, '맛있는 요리 레시피', '쉽고 맛있는 요리 레시피를 공유합니다.', '요리', NULL, false, false, false, NULL, 80, 8),
(3, '컴퓨터 성능 향상 팁', '컴퓨터 성능을 높이는 팁을 소개합니다.', '컴퓨터', NULL, false, false, false, NULL, 90, 9),
(4, '스마트폰 활용법', '스마트폰을 효율적으로 사용하는 방법입니다.', '스마트폰', NULL, false, false, false, NULL, 150, 15),
(5, '생활 속 꿀팁', '일상에서 유용하게 사용할 수 있는 꿀팁입니다.', '생활', NULL, false, false, false, NULL, 200, 20),
(6, '운동으로 건강 챙기기', '운동을 통해 건강을 유지하는 방법에 대한 글입니다.', '운동', NULL, false, false, false, NULL, 60, 6),
(7, '패션 트렌드 2024', '2024년 패션 트렌드에 대한 논의입니다.', '패션', NULL, false, false, false, NULL, 110, 11),
(1, '자동차 관리 팁', '자동차를 잘 관리하는 방법에 대해 이야기합니다.', '자동차', NULL, false, false, false, NULL, 70, 7),
(1, '🎉 커뮤니티 이용 안내 및 공지사항', '안녕하세요! 이 커뮤니티의 이용 방법과 공지사항에 대해 알려드립니다. 여기에서는 유익한 꿀팁을 서로 공유할 수 있습니다. 불건전한 게시글은 삭제될 수 있습니다.', '공지', NULL, false, false, false, NULL, 999, 0),
(2, '겨울 난방비 절약 꿀팁 5가지', '겨울철 난방비를 줄일 수 있는 꿀팁 5가지를 소개합니다. 첫째, 창문에 단열 필름을 붙이세요. 둘째, 바닥에 카펫을 깔아보세요. 셋째, 외출 시 보일러 온도를 낮추고 외출 모드를 활용하세요. 넷째, 사용하지 않는 방의 문은 닫아두세요. 다섯째, 스마트 플러그로 대기 전력을 차단하세요.', '이벤트', 'https://via.placeholder.com/150', false, false, false, NULL, 45, 0),
(3, '난방비 폭탄 피하는 법', '이번 겨울에는 난방비 폭탄을 피하기 위해 몇 가지 팁을 실천하고 있어요. 저는 보일러의 외출 모드를 적극 활용하고 있습니다. 이 기능을 사용하면 집에 아무도 없을 때 보일러가 자동으로 온도를 낮춰서 에너지 절약이 가능하더라구요!', '이벤트', 'https://via.placeholder.com/150', false, false, false, NULL, 30, 0),
(5, '보일러 절약의 핵심은 문단속!', '문을 열어두면 따뜻한 공기가 쉽게 빠져나가기 때문에, 꼭 문을 닫고 생활하세요! 특히, 사용하지 않는 방의 문을 닫아두면 전체 난방비 절약에 효과적이에요. 간단하지만 효과가 큰 방법입니다.', '이벤트', 'https://via.placeholder.com/150', false, false, false, NULL, 25, 0);

-- 기본 댓글 데이터 추가
INSERT INTO comments (post_id, user_id, parent_id, depth, content, is_deleted, like_count) VALUES
(1, 2, NULL, 0, '효율적인 공부법, 정말 도움이 됩니다!', false, 5),
(1, 3, NULL, 0, '이 방법은 저도 시도해볼게요!', false, 3),
(2, 1, NULL, 0, '요리 레시피 정말 기대돼요!', false, 4),
(2, 4, NULL, 0, '이 레시피로 요리해볼게요!', false, 2),
(3, 2, NULL, 0, '컴퓨터 성능 팁, 너무 유용합니다!', false, 6),
(3, 5, NULL, 0, '이 팁을 사용해보니 효과가 좋았어요!', false, 1),
(4, 3, NULL, 0, '스마트폰 활용법, 정말 유용하네요!', false, 2),
(4, 6, NULL, 0, '더 많은 팁을 알고 싶어요!', false, 1),
(5, 1, NULL, 0, '생활 꿀팁 감사합니다!', false, 0),
(5, 7, NULL, 0, '이런 정보는 항상 필요해요!', false, 3),
(6, 2, NULL, 0, '정기적으로 운동하는 게 중요하죠!', false, 4),
(6, 6, NULL, 0, '운동 루틴을 공유해주시면 좋겠어요!', false, 2),
(7, 3, NULL, 0, '패션 트렌드에 대해 더 알고 싶어요!', false, 5),
(7, 4, NULL, 0, '2024년 패션 정말 기대됩니다!', false, 3),
(1, 2, NULL, 0, '효율적인 공부법에 대한 좋은 정보입니다!', false, 5),
(1, 3, 1, 1, '저도 이 방법을 사용해봤어요. 효과적이더라고요!', false, 3),
(2, 1, NULL, 0, '요리 레시피가 정말 맛있어 보이네요!', false, 4),
(2, 4, 2, 1, '레시피를 따라 해보겠습니다!', false, 2),
(3, 2, NULL, 0, '컴퓨터 성능 향상 방법 정말 유용합니다!', false, 6),
(4, 3, NULL, 0, '스마트폰 활용법에 대해 더 알고 싶어요.', false, 1),
(5, 1, NULL, 0, '생활 속 꿀팁 감사합니다!', false, 0),
(6, 2, NULL, 0, '운동으로 건강을 챙기는 게 중요하죠!', false, 7),
(7, 3, NULL, 0, '패션 트렌드에 대해 이야기해주셔서 감사합니다!', false, 2);

-- 기본 좋아요 데이터 추가
INSERT INTO post_likes (post_id, user_id) VALUES
(1, 2),(1, 3),(1, 4),(2, 1),(2, 3),(2, 5),(3, 2),(3, 4),(3, 6),(4, 1),(4, 5),(5, 2),(5, 3),(5, 7),(6, 1),(6, 2),(6, 4),(7, 3),(7, 4),(7, 5);



CREATE INDEX idx_visits_created_at ON visits(created_at);
CREATE INDEX idx_visits_user_id ON visits(user_id); 

-- 모든 테이블 삭제 (필요시 주석 해제하여 사용)
-- SET FOREIGN_KEY_CHECKS = 0;
-- DROP TABLE IF EXISTS
-- admin_activity_logs,
-- comment_likes,
-- comments,
-- poll_options,
-- poll_votes,
-- post_categories,
-- post_likes,
-- posts,
-- score_settings,
-- search_history,
-- search_statistics,
-- user_activity_logs,
-- user_ranks,
-- user_scores,
-- users,
-- video_summaries,
-- visits;
-- SET FOREIGN_KEY_CHECKS = 1;




