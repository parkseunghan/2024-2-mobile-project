const db = require('../database/index'); // Promise 기반 db 모듈을 불러옴
const bcrypt = require('bcrypt');

class UserModel {
    // 모든 사용자 조회
    static async getAllUsers() {
        const query = `SELECT id, username, email, role FROM users`;
        try {
            const [rows] = await db.query(query); // await로 쿼리 실행 결과를 기다림
            return rows;
        } catch (error) {
            throw error; // 오류가 발생하면 예외를 던짐
        }
    }

    // ID로 사용자 조회
    static async getUserById(id) {
        const query = `SELECT id, username, email, role FROM users WHERE id = ?`;
        try {
            const [rows] = await db.query(query, [id]);
            return rows[0]; // 특정 사용자 하나만 반환
        } catch (error) {
            throw error;
        }
    }

    // 사용자 수정
    static async updateUser(id, username, email, password) {
        const hashedPassword = await bcrypt.hash(password, 10); // 비밀번호 해시화
        const query = `UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?`;
        try {
            const [result] = await db.query(query, [username, email, hashedPassword, id]);
            return result;
        } catch (error) {
            throw error;
        }
    }

    // 사용자 삭제
    static async deleteUser(id) {
        const query = `DELETE FROM users WHERE id = ?`;
        try {
            const [result] = await db.query(query, [id]);
            return result;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = UserModel;
