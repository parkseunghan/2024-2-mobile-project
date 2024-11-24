const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const { uploadToStorage } = require('../utils/storage');

exports.getProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.json({ profile: null });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.json({ profile: null });
    }

    res.json({
      profile: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    console.error('프로필 조회 에러:', error);
    res.status(500).json({ message: '프로필 조회에 실패했습니다.' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: '인증이 필요합니다.' });
    }

    const { username } = req.body;
    let avatarUrl = null;

    if (req.file) {
      avatarUrl = await uploadToStorage(req.file);
    }

    const updateData = {
      ...(username && { username }),
      ...(avatarUrl && { avatar: avatarUrl })
    };

    if (username) {
      const existingUser = await User.findByUsername(username);
      if (existingUser && existingUser.id !== req.user.id) {
        return res.status(400).json({ message: '이미 사용 중인 사용자 이름입니다.' });
      }
    }

    const success = await User.updateProfile(req.user.id, updateData);
    if (!success) {
      return res.status(400).json({ message: '프로필 업데이트에 실패했습니다.' });
    }

    const updatedUser = await User.findById(req.user.id);
    res.json({
      message: '프로필이 업데이트되었습니다.',
      profile: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        createdAt: updatedUser.created_at
      }
    });
  } catch (error) {
    console.error('프로필 업데이트 에러:', error);
    res.status(500).json({ message: '프로필 업데이트에 실패했습니다.' });
  }
};

exports.getUserPosts = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: '인증이 필요합니다.' });
    }

    const posts = await Post.findByUserId(req.user.id);
    res.json({ posts });
  } catch (error) {
    console.error('게시글 조회 에러:', error);
    res.status(500).json({ message: '게시글 조회에 실패했습니다.' });
  }
};

exports.getUserComments = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: '인증이 필요합니다.' });
    }

    const comments = await Comment.findByUserId(req.user.id);
    
    const formattedComments = comments.map(comment => ({
      id: comment.id,
      content: comment.content,
      post_id: comment.post_id,
      created_at: comment.created_at,
      post_title: comment.post_title,
      author_name: comment.author_name
    }));

    res.json({ comments: formattedComments });
  } catch (error) {
    console.error('댓글 조회 에러:', error);
    res.status(500).json({ message: '댓글 조회에 실패했습니다.' });
  }
};

exports.getLikedPosts = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: '인증이 필요합니다.' });
    }

    const posts = await Post.findLikedByUserId(req.user.id);
    res.json({ posts });
  } catch (error) {
    console.error('좋아요 게시글 조회 에러:', error);
    res.status(500).json({ message: '좋아요 게시글 조회에 실패했습니다.' });
  }
}; 