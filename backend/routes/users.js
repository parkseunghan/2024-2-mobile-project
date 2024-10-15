const express = require('express');
const router = express.Router();
const UserController = require('../controllers/usersController');

// 사용자 목록 조회 (Read)
router.get('/', UserController.getUsers);

// 사용자 조회 (Read by ID)
router.get('/:id', UserController.getUserById);

// 사용자 수정 (Update)
router.put('/:id', UserController.updateUser);

// 사용자 삭제 (Delete)
router.delete('/:id', UserController.deleteUser);

module.exports = router;
