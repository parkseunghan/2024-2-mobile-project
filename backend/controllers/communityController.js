const Post = require('../models/Post');
const Comment = require('../models/Comment');
const { uploadToStorage } = require('../utils/storage');
const User = require('../models/User');

exports.getPosts = async (req, res) => {
    try {
        const { category, page = 1 } = req.query;
        const userId = req.user?.id || null;
        
        const posts = await Post.findAll(category, parseInt(page), 10, userId);
        
        res.json({ posts });
    } catch (error) {
        console.error('게시글 목록 조회 에러:', error);
        res.status(500).json({ 
            message: '게시글 목록을 불러오는데 실패했습니다.'
        });
    }
};

exports.getPost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);
        
        if (!post) {
            return res.status(404).json({ 
                success: false,
                message: '게시글을 찾을 수 없습니다.' 
            });
        }

        const comments = await Comment.findByPostId(id);
        const isLiked = req.user ? await Post.isLikedByUser(id, req.user.id) : false;

        const responseData = {
            id: post.id,
            title: post.title,
            content: post.content,
            category: post.category,
            media_url: post.media_url,
            created_at: post.created_at,
            author: {
                id: post.user_id,
                username: post.author_name
            },
            like_count: post.like_count || 0,
            comment_count: post.comment_count || 0,
            isLiked,
            comments
        };

        res.json({
            success: true,
            post: responseData
        });
    } catch (error) {
        console.error('게시글 조회 에러:', error);
        res.status(500).json({ 
            success: false,
            message: '게시글을 불러오는데 실패했습니다.' 
        });
    }
};

exports.createPost = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: '로그인이 필요합니다.' });
        }

        console.log('Request body:', req.body);
        console.log('Request file:', req.file);

        const { title, content, category } = req.body;
        
        if (!title?.trim()) {
            return res.status(400).json({ message: '제목을 입력해주세요.' });
        }
        if (!content?.trim()) {
            return res.status(400).json({ message: '내용을 입력해주세요.' });
        }

        const defaultCategory = '일반';
        const finalCategory = category?.trim() || defaultCategory;

        let mediaUrl = null;
        if (req.file) {
            try {
                mediaUrl = await uploadToStorage(req.file);
            } catch (uploadError) {
                console.error('파일 업로드 에러:', uploadError);
                return res.status(500).json({ message: '파일 업로드에 실패했습니다.' });
            }
        }

        console.log('Creating post with data:', {
            userId: req.user.id,
            title: title.trim(),
            content: content.trim(),
            category: finalCategory,
            mediaUrl,
        });

        const postId = await Post.create(req.user.id, {
            title: title.trim(),
            content: content.trim(),
            category: finalCategory,
            mediaUrl
        });

        const post = await Post.findById(postId);
        
        if (!post) {
            throw new Error('게시글 생성 후 조회 실패');
        }

        try {
            await User.updateUserScore(req.user.id, 10, '게시글 작성');
        } catch (scoreError) {
            console.error('점수 업데이트 에러:', scoreError);
        }

        res.status(201).json({ 
            success: true,
            message: '게시글이 작성되었습니다.',
            post 
        });
    } catch (error) {
        console.error('게시글 작성 에러:', error);
        res.status(500).json({ 
            success: false,
            message: error.message || '게시글 작성에 실패했습니다.',
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

exports.updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        let mediaUrl = null;

        if (req.file) {
            mediaUrl = await uploadToStorage(req.file);
        }

        const success = await Post.update(id, req.user.id, {
            title,
            content,
            mediaUrl
        });

        if (!success) {
            return res.status(404).json({ message: '게시글을 찾을 수 없거나 수정 권한이 없습니다.' });
        }

        const post = await Post.findById(id);
        res.json({ post });
    } catch (error) {
        console.error('게시글 수정 에러:', error);
        res.status(500).json({ message: '게시글 수정에 실패했습니다.' });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const success = await Post.delete(id, req.user.id);

        if (!success) {
            return res.status(404).json({ message: '게시글을 찾을 수 없거나 삭제 권한이 없습니다.' });
        }

        res.json({ message: '게시글이 삭제되었습니다.' });
    } catch (error) {
        console.error('게시글 삭제 에러:', error);
        res.status(500).json({ message: '게시글 삭제에 실패했습니다.' });
    }
};

exports.toggleLike = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: '로그인이 필요합니다.' });
        }

        const { id } = req.params;
        const isLiked = await Post.toggleLike(id, req.user.id);
        const post = await Post.findById(id);
        
        res.json({ 
            isLiked,
            likeCount: post.like_count
        });
    } catch (error) {
        console.error('좋아요 토글 에러:', error);
        res.status(500).json({ message: '좋아요 처리에 실패했습니다.' });
    }
};

exports.createComment = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: '로그인이 필요합니다.' });
        }

        const { id } = req.params;
        const { content } = req.body;

        if (!content || !content.trim()) {
            return res.status(400).json({ message: '댓글 내용을 입력해주세요.' });
        }

        const commentId = await Comment.create(id, req.user.id, content);
        const comments = await Comment.findByPostId(id);

        res.status(201).json({ comments });
    } catch (error) {
        console.error('댓글 작성 에러:', error);
        res.status(500).json({ message: '댓글 작성에 실패했습니다.' });
    }
};