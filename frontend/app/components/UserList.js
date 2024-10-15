import React, { useEffect, useState } from 'react';
import axios from 'axios'; // axios import
import { fetchUsers, deleteUser } from '../api/api'; // API 함수 import

const UserList = () => {
    const [users, setUsers] = useState([]); // 사용자 목록을 저장할 state

    // 컴포넌트가 처음 렌더링될 때 사용자 목록 로드
    useEffect(() => {
        loadUsers();
    }, []);

    // 사용자 목록을 불러오는 함수
    const loadUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/users'); // API로 사용자 목록 가져오기
            setUsers(response.data); // 받아온 데이터 state에 저장
        } catch (error) {
            console.error('Failed to fetch users', error); // 에러 처리
        }
    };

    // 사용자 삭제 함수
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/users/${id}`); // 사용자 ID를 URL에 포함하여 삭제 요청
            loadUsers(); // 삭제 후 다시 사용자 목록 로드
        } catch (error) {
            console.error('Failed to delete user', error); // 에러 처리
        }
    };

    return (
        <div>
            <h2>User List</h2>
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        {user.username} ({user.email}) - {user.role}
                        <button onClick={() => handleDelete(user.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;
