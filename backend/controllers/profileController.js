const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const { uploadToStorage } = require('../utils/storage');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    res.json({
      profile: {
        id: user.id,
        username: user.username,
        email: user.email,
        nickname: user.nickname,
        bio: user.bio,
        avatar: user.avatar,
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
    const { nickname, bio } = req.body;
    let avatarUrl = null;

    if (req.file) {
      avatarUrl = await uploadToStorage(req.file);
    }

    const updateData = {
      ...(nickname && { nickname }),
      ...(bio && { bio }),
      ...(avatarUrl && { avatar: avatarUrl })
    };

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
        nickname: updatedUser.nickname,
        bio: updatedUser.bio,
        avatar: updatedUser.avatar
      }
    });
  } catch (error) {
    console.error('프로필 업데이트 에러:', error);
    res.status(500).json({ message: '프로필 업데이트에 실패했습니다.' });
  }
};

exports.getUserPosts = async (req, res) => {
  try {
    const posts = await Post.findByUserId(req.user.id);
    res.json({ posts });
  } catch (error) {
    console.error('게시글 조회 에러:', error);
    res.status(500).json({ message: '게시글 조회에 실패했습니다.' });
  }
};

exports.getUserComments = async (req, res) => {
  try {
    const comments = await Comment.findByUserId(req.user.id);
    res.json({ comments });
  } catch (error) {
    console.error('댓글 조회 에러:', error);
    res.status(500).json({ message: '댓글 조회에 실패했습니다.' });
  }
};

exports.getLikedPosts = async (req, res) => {
  try {
    const posts = await Post.findLikedByUserId(req.user.id);
    res.json({ posts });
  } catch (error) {
    console.error('좋아요 게시글 조회 에러:', error);
    res.status(500).json({ message: '좋아요 게시글 조회에 실패했습니다.' });
  }
}; 