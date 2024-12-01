const Post = require('../models/Post');
const Comment = require('../models/Comment');

exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.findAll();
        res.json({ posts });
    } catch (error) {
        console.error('게시글 목록 조회 에러:', error);
        res.status(500).json({ message: '게시글 목록을 불러오는데 실패했습니다.' });
    }
};

exports.getPostDetail = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId);
        
        if (!post) {
            return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
        }

        res.json({ post });
    } catch (error) {
        console.error('게시글 상세 조회 에러:', error);
        res.status(500).json({ message: '게시글을 불러오는데 실패했습니다.' });
    }
};

exports.createPost = async (req, res) => {
    try {
        const { title, content, category = 'general' } = req.body;
        const userId = req.user.id;

        const post = await Post.create({
            title,
            content,
            userId,
            category
        });

        res.status(201).json({ 
            message: '게시글이 작성되었습니다.',
            post 
        });
    } catch (error) {
        console.error('게시글 작성 에러:', error);
        res.status(500).json({ message: '게시글 작성에 실패했습니다.' });
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
            return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
        }

        if (post.userId !== userId) {
            return res.status(403).json({ message: '게시글을 삭제할 권한이 없습니다.' });
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
        const { postId } = req.params;
        const { content } = req.body;
        const userId = req.user.id;

        const comment = await Comment.create({
            postId,
            content,
            userId
        });

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