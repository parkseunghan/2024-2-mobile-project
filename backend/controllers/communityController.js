const Post = require('../models/Post'); // 게시글 모델을 불러옴.
const Comment = require('../models/Comment'); // 댓글 모델을 불러옴.
const db = require('../config/database'); // 데이터베이스 설정을 불러옴.

/**
 * 게시글 및 댓글 관련 기능을 처리하는 컨트롤러
 */

exports.getPosts = async (req, res) => {
    try {
        const { page = 1, category, search } = req.query; // 요청 쿼리에서 페이지, 카테고리, 검색어 추출
        const userId = req.user?.id; // 사용자 ID
        const limit = 10; // 페이지당 게시글 수

        const posts = await Post.findAll(
            category === '전체' ? null : category, // 카테고리에 따라 게시글 조회
            parseInt(page), // 페이지 번호
            limit, // 페이지당 게시글 수
            userId // 사용자 ID
        );

        const totalCount = await Post.getTotalCount(category === '전체' ? null : category); // 전체 게시글 수 조회
        const totalPages = Math.ceil(totalCount / limit); // 총 페이지 수 계산

        res.json({ 
            posts, // 게시글 목록 반환
            nextPage: page < totalPages ? parseInt(page) + 1 : null, // 다음 페이지 번호
            totalPages // 총 페이지 수
        });
    } catch (error) {
        console.error('게시글 목록 조회 에러:', error); // 에러 로그 출력
        res.status(500).json({ message: '게시글 목록을 불러오는데 실패했습니다.' }); // 에러 메시지 반환
    }
};

exports.getPostDetail = async (req, res) => {
    try {
        const { postId } = req.params; // 요청 매개변수에서 게시글 ID 추출
        const userId = req.user?.id; // 사용자 ID
        
        const post = await Post.findById(postId, userId); // 게시글 상세 조회
        
        if (!post) {
            return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' }); // 게시글이 없을 경우 에러 메시지 반환
        }

        // 응답 데이터 구조 확인을 위한 로깅
        console.log('Sending post data:', post); // 게시글 데이터 로깅
        
        res.json(post); // 게시글 데이터 반환
    } catch (error) {
        console.error('게시글 상세 조회 에러:', error); // 에러 로그 출력
        res.status(500).json({ message: '게시글을 불러오는데 실패했습니다.' }); // 에러 메시지 반환
    }
};

exports.createPost = async (req, res) => {
    try {
        const { title, content, category = 'general', media_url = null } = req.body; // 요청 본체에서 데이터 추출
        const userId = req.user?.id; // 사용자 ID

        if (!userId) {
            return res.status(401).json({ message: '로그인이 필요합니다.' }); // 인증되지 않은 경우 에러 메시지 반환
        }

        const post = await Post.create({ // 게시글 생성
            title,
            content,
            userId,
            category,
            media_url
        });

        const postDetail = await Post.findById(post.id); // 생성된 게시글 상세 조회

        res.status(201).json({ 
            message: '게시글이 작성되었습니다.', // 성공 메시지
            post: postDetail // 생성된 게시글 데이터 반환
        });
    } catch (error) {
        console.error('게시글 작성 에러:', error); // 에러 로그 출력
        res.status(error.status || 500).json({ 
            message: error.message || '게시글 작성에 실패했습니다.' // 에러 메시지 반환
        });
    }
};

exports.updatePost = async (req, res) => {
    try {
        const { postId } = req.params; // 요청 매개변수에서 게시글 ID 추출
        const { title, content } = req.body; // 요청 본체에서 제목과 내용 추출
        const userId = req.user.id; // 사용자 ID

        const post = await Post.findById(postId); // 게시글 조회
        
        if (!post) {
            return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' }); // 게시글이 없을 경우 에러 메시지 반환
        }

        if (post.userId !== userId) {
            return res.status(403).json({ message: '게시글을 수정할 권한이 없습니다.' }); // 권한이 없을 경우 에러 메시지 반환
        }

        await Post.update(postId, { title, content }); // 게시글 수정

        res.json({ message: '게시글이 수정되었습니다.' }); // 성공 메시지 반환
    } catch (error) {
        console.error('게시글 수정 에러:', error); // 에러 로그 출력
        res.status(500).json({ message: '게시글 수정에 실패했습니다.' }); // 에러 메시지 반환
    }
};

exports.deletePost = async (req, res) => {
    try {
        const { postId } = req.params; // 요청 매개변수에서 게시글 ID 추출
        const userId = req.user.id; // 사용자 ID

        const post = await Post.findById(postId); // 게시글 조회
        
        if (!post) {
            return res.status(404).json({ message: '게시글을 찾 수 없습니다.' }); // 게시글이 없을 경우 에러 메시지 반환
        }

        if (post.userId !== userId) {
            return res.status(403).json({ message: '게시글을 삭제할 권한이 없습니다.' }); // 권한이 없을 경우 에러 메시지 반환
        }

        await Post.delete(postId); // 게시글 삭제

        res.json({ message: '게시글이 삭제되었습니다.' }); // 성공 메시지 반환
    } catch (error) {
        console.error('게시글 삭제 에러:', error); // 에러 로그 출력
        res.status(500).json({ message: '게시글 삭제에 실패했습니다.' }); // 에러 메시지 반환
    }
};

exports.createComment = async (req, res) => {
    try {
        console.log('Creating comment - Request:', {
            body: req.body,
            params: req.params,
            user: req.user // 요청 본체, 매개변수 및 사용자 정보 로깅
        });

        const { postId } = req.params; // 요청 매개변수에서 게시글 ID 추출
        const { content } = req.body; // 요청 본체에서 댓글 내용 추출
        const userId = req.user?.id; // 사용자 ID

        if (!userId) {
            return res.status
            return res.status(401).json({ message: '로그인이 필요합니다.' }); // 인증되지 않은 경우 에러 메시지 반환
        }

        if (!content?.trim()) {
            return res.status(400).json({ message: '댓글 내용을 입력해주세요.' }); // 내용이 없는 경우 에러 메시지 반환
        }

        const comment = await Comment.create({ // 댓글 생성
            postId: parseInt(postId), // 게시글 ID
            userId, // 사용자 ID
            content // 댓글 내용
        });

        console.log('Created comment:', comment); // 생성된 댓글 로깅

        res.status(201).json({ 
            message: '댓글이 작성되었습니다.', // 성공 메시지
            comment // 생성된 댓글 데이터 반환
        });
    } catch (error) {
        console.error('댓글 작성 에러:', error); // 에러 로그 출력
        res.status(500).json({ message: '댓글 작성에 실패했습니다.' }); // 에러 메시지 반환
    }
};

exports.deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params; // 요청 매개변수에서 댓글 ID 추출
        const userId = req.user.id; // 사용자 ID

        const comment = await Comment.findById(commentId); // 댓글 조회
        
        if (!comment) {
            return res.status(404).json({ message: '댓글을 찾을 수 없습니다.' }); // 댓글이 없을 경우 에러 메시지 반환
        }

        if (comment.userId !== userId) {
            return res.status(403).json({ message: '댓글을 삭제할 권한이 없습니다.' }); // 권한이 없을 경우 에러 메시지 반환
        }

        await Comment.delete(commentId); // 댓글 삭제

        res.json({ message: '댓글이 삭제되었습니다.' }); // 성공 메시지 반환
    } catch (error) {
        console.error('댓글 삭제 에러:', error); // 에러 로그 출력
        res.status(500).json({ message: '댓글 삭제에 실패했습니다.' }); // 에러 메시지 반환
    }
};

exports.vote = async (req, res) => {
    try {
        const { postId, optionId } = req.params; // 요청 매개변수에서 게시글 ID와 옵션 ID 추출
        const userId = req.user.id; // 사용자 ID

        // 이미 투표했는지 확인
        const [existing] = await db.query(
            'SELECT 1 FROM poll_votes WHERE post_id = ? AND user_id = ?',
            [postId, userId]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: '이미 투표하셨습니다.' }); // 이미 투표한 경우 에러 메시지 반환
        }

        // 트랜잭션 시작
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            // 투표 기록
            await connection.query(
                'INSERT INTO poll_votes (post_id, option_id, user_id) VALUES (?, ?, ?)',
                [postId, optionId, userId]
            );

            // 투표 수 증가
            await connection.query(
                'UPDATE poll_options SET votes = votes + 1 WHERE id = ?',
                [optionId]
            );

            await connection.commit(); // 트랜잭션 커밋
            res.json({ message: '투표가 완료되었습니다.' }); // 성공 메시지 반환
        } catch (error) {
            await connection.rollback(); // 트랜잭션 롤백
            throw error; // 에러 발생
        } finally {
            connection.release(); // 연결 해제
        }
    } catch (error) {
        console.error('투표 처리 에러:', error); // 에러 로그 출력
        res.status(500).json({ message: '투표 처리에 실패했습니다.' }); // 에러 메시지 반환
    }
};

exports.toggleLike = async (req, res) => {
    try {
        const { postId } = req.params; // 요청 매개변수에서 게시글 ID 추출
        const userId = req.user?.id; // 사용자 ID

        if (!userId) {
            return res.status(401).json({ message: '로그인이 필요합니다.' }); // 인증되지 않은 경우 에러 메시지 반환
        }

        const result = await Post.toggleLike(postId, userId); // 좋아요 토글
        res.json(result); // 결과 반환
    } catch (error) {
        console.error('좋아요 토글 에러:', error); // 에러 로그 출력
        res.status(500).json({ message: '좋아요 처리에 실패했습니다.' }); // 에러 메시지 반환
    }
};

exports.incrementViewCount = async (req, res) => {
    try {
        const { postId } = req.params; // 요청 매개변수에서 게시글 ID 추출
        
        await Post.incrementViewCount(postId); // 조회수 증가
        
        // 업데이트된 조회수 반환
        const [[{ view_count }]] = await db.query(
            'SELECT view_count FROM posts WHERE id = ?',
            [postId]
        );
        
        res.json({ view_count }); // 조회수 반환
    } catch (error) {
        console.error('조회수 증가 에러:', error); // 에러 로그 출력
        res.status(500).json({ message: '조회수 증가에 실패했습니다.' }); // 에러 메시지 반환
    }
};

exports.getLikedPosts = async (req, res) => {
    try {
        console.log('Getting liked posts for user:', req.user); // 사용자 정보 로깅
        const userId = req.user?.id; // 사용자 ID

        if (!userId) {
            console.log('No user ID found'); // 사용자 ID가 없을 경우 로깅
            return res.status(401).json({ message: '로그인이 필요합니다.' }); // 인증되지 않은 경우 에러 메시지 반환
        }

        console.log('Fetching liked posts from database...'); // 좋아요한 게시글 조회 로깅
        const posts = await Post.findLikedByUserId(userId); // 좋아요한 게시글 조회
        console.log('Found liked posts:', posts); // 조회된 게시글 로깅
        
        res.json({ posts }); // 좋아요한 게시글 목록 반환
    } catch (error) {
        console.error('좋아요한 게시글 조회 에러:', error); // 에러 로그 출력
        res.status(500).json({ message: '좋아요한 게시글을 불러오는데 실패했습니다.' }); // 에러 메시지 반환
    }
};
