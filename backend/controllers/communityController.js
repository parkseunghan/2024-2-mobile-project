const Post = require('../models/Post');
const Comment = require('../models/Comment');
const db = require('../config/database');

exports.getPosts = async (req, res) => {
    try {
        const { page = 1, category, search } = req.query;
        const userId = req.user?.id;
        const limit = 10;

        const posts = await Post.findAll(
            category === '전체' ? null : category,
            parseInt(page),
            limit,
            userId
        );

        const totalCount = await Post.getTotalCount(category === '전체' ? null : category);
        const totalPages = Math.ceil(totalCount / limit);

        res.json({ 
            posts,
            nextPage: page < totalPages ? parseInt(page) + 1 : null,
            totalPages
        });
    } catch (error) {
        console.error('게시글 목록 조회 에러:', error);
        res.status(500).json({ message: '게시글 목록을 불러오는데 실패했습니다.' });
    }
};

exports.getPostDetail = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user?.id;
        
        const post = await Post.findById(postId, userId);
        
        if (!post) {
            return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
        }

        // 응답 데이터 구조 확인을 위한 로깅
        console.log('Sending post data:', post);
        
        res.json(post);
    } catch (error) {
        console.error('게시글 상세 조회 에러:', error);
        res.status(500).json({ message: '게시글을 불러오는데 실패했습니다.' });
    }
};

exports.createPost = async (req, res) => {
    try {
        const { title, content, category = 'general', media_url = null } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: '로그인이 필요합니다.' });
        }

        const post = await Post.create({
            title,
            content,
            userId,
            category,
            media_url
        });

        const postDetail = await Post.findById(post.id);

        res.status(201).json({ 
            message: '게시글이 작성되었습니다.',
            post: postDetail
        });
    } catch (error) {
        console.error('게시글 작성 에러:', error);
        res.status(error.status || 500).json({ 
            message: error.message || '게시글 작성에 실��습니다.' 
        });
    }
};

exports.updatePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { title, content } = req.body;
        const userId = req.user.id;

        const post = await Post.findById(postId);
        
        if (!post) {
            return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
        }

        if (post.userId !== userId) {
            return res.status(403).json({ message: '게시글을 수정할 권한이 없습니다.' });
        }

        await Post.update(postId, { title, content });

        res.json({ message: '게시글이 수정되었습니다.' });
    } catch (error) {
        console.error('게시글 수정 에러:', error);
        res.status(500).json({ message: '게시글 수정에 실패했습니다.' });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user.id;

        const post = await Post.findById(postId);
        
        if (!post) {
            return res.status(404).json({ message: '게시글을 찾 수 없습니다.' });
        }

        if (post.userId !== userId) {
            return res.status(403).json({ message: '게시글을 삭제할 권한이 없니다.' });
        }

        await Post.delete(postId);

        res.json({ message: '게시글이 삭제되었습니다.' });
    } catch (error) {
        console.error('게시글 삭제 에러:', error);
        res.status(500).json({ message: '게시글 삭제에 실패했습니다.' });
    }
};

exports.createComment = async (req, res) => {
    try {
        console.log('Creating comment - Request:', {
            body: req.body,
            params: req.params,
            user: req.user
        });

        const { postId } = req.params;
        const { content } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: '로그인이 필요합니다.' });
        }

        if (!content?.trim()) {
            return res.status(400).json({ message: '댓글 내용을 입력해주세요.' });
        }

        const comment = await Comment.create({
            postId: parseInt(postId),
            userId,
            content
        });

        console.log('Created comment:', comment);

        res.status(201).json({ 
            message: '댓글이 작성되었습니다.',
            comment 
        });
    } catch (error) {
        console.error('댓글 작성 에러:', error);
        res.status(500).json({ message: '댓글 작성에 실패했습니다.' });
    }
};

exports.deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.user.id;

        const comment = await Comment.findById(commentId);
        
        if (!comment) {
            return res.status(404).json({ message: '댓글을 찾을 수 없습니다.' });
        }

        if (comment.userId !== userId) {
            return res.status(403).json({ message: '댓글을 삭제할 권한이 없습니다.' });
        }

        await Comment.delete(commentId);

        res.json({ message: '댓글이 삭제되었습니다.' });
    } catch (error) {
        console.error('댓글 삭제 에러:', error);
        res.status(500).json({ message: '댓글 삭제에 실패했습니다.' });
    }
};

exports.vote = async (req, res) => {
    try {
        const { postId, optionId } = req.params;
        const userId = req.user.id;

        // 이미 투표했는지 확인
        const [existing] = await db.query(
            'SELECT 1 FROM poll_votes WHERE post_id = ? AND user_id = ?',
            [postId, userId]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: '이미 투표하셨습니다.' });
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

            await connection.commit();
            res.json({ message: '투표가 완료되었습니다.' });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('투 처리 에러:', error);
        res.status(500).json({ message: '투표 처리에 실패했습니다.' });
    }
};

exports.toggleLike = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: '로그인이 필요합니다.' });
        }

        const result = await Post.toggleLike(postId, userId);
        res.json(result);
    } catch (error) {
        console.error('좋아요 토글 에러:', error);
        res.status(500).json({ message: '좋아요 처리에 실패했습니다.' });
    }
};

exports.incrementViewCount = async (req, res) => {
    try {
        const { postId } = req.params;
        
        await Post.incrementViewCount(postId);
        
        // 업데이트된 조회수 반환
        const [[{ view_count }]] = await db.query(
            'SELECT view_count FROM posts WHERE id = ?',
            [postId]
        );
        
        res.json({ view_count });
    } catch (error) {
        console.error('조회수 증가 에러:', error);
        res.status(500).json({ message: '조회수 증가에 실패했습니다.' });
    }
};

exports.getLikedPosts = async (req, res) => {
    try {
        console.log('Getting liked posts for user:', req.user);
        const userId = req.user?.id;

        if (!userId) {
            console.log('No user ID found');
            return res.status(401).json({ message: '로그인이 필요합니다.' });
        }

        console.log('Fetching liked posts from database...');
        const posts = await Post.findLikedByUserId(userId);
        console.log('Found liked posts:', posts);
        
        res.json({ posts });
    } catch (error) {
        console.error('좋아요한 게시글 조회 에러:', error);
        res.status(500).json({ message: '좋아요한 게시글을 불러오는데 실패했습니다.' });
    }
};