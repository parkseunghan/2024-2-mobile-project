const UserModel = require('../models/Users');

class UserController {
    // 사용자 목록 조회 (Read)
    static async getUsers(req, res) {
        try {
            const users = await UserModel.getAllUsers();
            res.json(users);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch users' });
        }
    }

    // 사용자 조회 (Read by ID)
    static async getUserById(req, res) {
        const { id } = req.params;
        try {
            const user = await UserModel.getUserById(id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch user' });
        }
    }

    // 사용자 수정 (Update)
    static async updateUser(req, res) {
        const { id } = req.params;
        const { username, email, password } = req.body;

        try {
            const result = await UserModel.updateUser(id, username, email, password);
            if (result.affectedRows === 0) {
                return res.status(500).json({ error: 'Failed to update user' });
            }
            res.json({ message: 'User updated successfully' });
        } catch (err) {
            res.status(500).json({ error: 'Update failed' });
        }
    }

    // 사용자 삭제 (Delete)
    static async deleteUser(req, res) {
        const { id } = req.params;
        try {
            const result = await UserModel.deleteUser(id);
            if (result.affectedRows === 0) {
                return res.status(500).json({ error: 'Failed to delete user' });
            }
            res.json({ message: 'User deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: 'Delete failed' });
        }
    }
}

module.exports = UserController;
