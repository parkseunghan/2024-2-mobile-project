const Post = require('../models/Post');
const Comment = require('../models/Comment');
const { uploadToStorage } = require('../utils/storage');

exports.getPosts = async (req, res) => {
    try {
        const { category, page = 1 } = req.query;
        const posts = await Post.findAll(category, parseInt(page));
        
        if (req.user) {
            for (let post of posts) {
                post.isLiked = await Post.isLikedByUser(post.id, req.user.id);
            }
        }
        
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

        res.json({
            success: true,
            post: {
                ...post,
                isLiked,
                comments
            }
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

        const title = req.body.title;
        const content = req.body.content;
        const category = req.body.category;
        
        if (!title || !title.trim()) {
            return res.status(400).json({ message: '제목을 입력해주세요.' });
        }
        if (!content || !content.trim()) {
            return res.status(400).json({ message: '내용을 입력해주세요.' });
        }
        if (!category || !category.trim()) {
            return res.status(400).json({ message: '카테고리를 선택해주세요.' });
        }

        let mediaUrl = null;
        if (req.file) {
            mediaUrl = await uploadToStorage(req.file);
        }

        console.log('Creating post with data:', {
            userId: req.user.id,
            title,
            content,
            category,
            mediaUrl,
            file: req.file
        });

        const postId = await Post.create(req.user.id, {
            title: title.trim(),
            content: content.trim(),
            category: category.trim(),
            mediaUrl
        });

        const post = await Post.findById(postId);
        res.status(201).json({ post });
    } catch (error) {
        console.error('게시글 작성 에러:', error);
        res.status(500).json({ message: '게시글 작성에 실패했습니다.' });
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