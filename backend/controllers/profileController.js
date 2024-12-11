const User = require('../models/User'); // 사용자 모델을 불러옴.
const Post = require('../models/Post'); // 게시글 모델을 불러옴.
const Comment = require('../models/Comment'); // 댓글 모델을 불러옴.
const { uploadToStorage } = require('../utils/storage'); // 파일 업로드 유틸리티를 불러옴.

/**
 * 사용자 프로필 관련 기능을 처리하는 컨트롤러
 */

exports.getProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.json({ profile: null }); // 인증되지 않은 경우 프로필 null 반환
    }

    const user = await User.findById(req.user.id); // 사용자 ID로 사용자 조회
    if (!user) {
      return res.json({ profile: null }); // 사용자가 없을 경우 프로필 null 반환
    }

    res.json({
      profile: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.created_at // 프로필 정보 반환
      }
    });
  } catch (error) {
    console.error('프로필 조회 에러:', error); // 에러 로그 출력
    res.status(500).json({ message: '프로필 조회에 실패했습니다.' }); // 에러 메시지 반환
  }
};

exports.updateProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: '인증이 필요합니다.' }); // 인증되지 않은 경우 에러 메시지 반환
    }

    const { nickname, bio } = req.body; // 요청 본체에서 닉네임과 바이오 추출
    let avatarUrl = null;

    if (req.file) {
      avatarUrl = await uploadToStorage(req.file); // 아바타 이미지 업로드
    }

    const updateData = {
      ...(nickname && { username: nickname }), // 닉네임 업데이트
      ...(bio && { bio }), // 바이오 업데이트
      ...(avatarUrl && { avatar: avatarUrl }) // 아바타 URL 업데이트
    };

    if (nickname) {
      const existingUser = await User.findByUsername(nickname); // 닉네임 중복 체크
      if (existingUser && existingUser.id !== req.user.id) {
        return res.status(400).json({ message: '이미 사용 중인 닉네임입니다.' }); // 중복된 닉네임 에러 메시지
      }
    }

    const success = await User.updateProfile(req.user.id, updateData); // 프로필 업데이트
    if (!success) {
      return res.status(400).json({ message: '프로필 업데이트에 실패했습니다.' }); // 업데이트 실패 에러 메시지
    }

    const updatedUser = await User.findById(req.user.id); // 업데이트된 사용자 정보 조회
    res.json({
      message: '프로필이 업데이트되었습니다.', // 성공 메시지
      profile: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        bio: updatedUser.bio,
        avatar: updatedUser.avatar,
        createdAt: updatedUser.created_at // 업데이트된 프로필 정보 반환
      }
    });
  } catch (error) {
    console.error('프로필 업데이트 에러:', error); // 에러 로그 출력
    res.status(500).json({ message: '프로필 업데이트에 실패했습니다.' }); // 에러 메시지 반환
  }
};

exports.getUserPosts = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: '인증이 필요합니다.' }); // 인증되지 않은 경우 에러 메시지 반환
    }

    const posts = await Post.findByUserId(req.user.id); // 사용자 ID로 게시글 조회
    res.json({ posts }); // 게시글 목록 반환
  } catch (error) {
    console.error('게시글 조회 에러:', error); // 에러 로그 출력
    res.status(500).json({ message: '게시글 조회에 실패했습니다.' }); // 에러 메시지 반환
  }
};

exports.getUserComments = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: '인증이 필요합니다.' }); // 인증되지 않은 경우 에러 메시지 반환
    }

    const comments = await Comment.findByUserId(req.user.id); // 사용자 ID로 댓글 조회
    
    const formattedComments = comments.map(comment => ({
      id: comment.id,
      content: comment.content,
      post_id: comment.post_id,
      created_at: comment.created_at,
      post_title: comment.post_title, // 포스트 제목 추가
      author_name: comment.author_name // 작성자 이름 추가
    }));

    res.json({ comments: formattedComments }); // 포맷된 댓글 목록 반환
  } catch (error) {
    console.error('댓글 조회 에러:', error); // 에러 로그 출력
    res.status(500).json({ message: '댓글 조회에 실패했습니다.' }); // 에러 메시지 반환
  }
};

exports.getLikedPosts = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: '인증이 필요합니다.' }); // 인증되지 않은 경우 에러 메시지 반환
    }

    const posts = await Post.findLikedByUserId(req.user.id); // 사용자 ID로 좋아요한 게시글 조회
    res.json({ posts }); // 좋아요한 게시글 목록 반환
  } catch (error) {
    console.error('좋아요 게시글 조회 에러:', error); // 에러 로그 출력
    res.status(500).json({ message: '좋아요 게시글 조회에 실패했습니다.' }); // 에러 메시지 반환
  }
};
