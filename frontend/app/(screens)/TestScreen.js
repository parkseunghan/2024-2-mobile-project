import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TestScreen = () => {
    const [users, setUsers] = useState([]);

    // 서버로부터 users 데이터를 가져오는 함수
    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/users'); // 백엔드 API 요청
            setUsers(response.data); // 데이터 상태로 저장
        } catch (error) {
            console.error('데이터 가져오기 실패: ', error);
        }
    };

    // 컴포넌트가 처음 렌더링될 때 데이터 요청
    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div>
            <h1>사용자 목록</h1>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        {user.username} - Role: {user.role} {/* 사용자 이름과 역할 출력 */}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TestScreen;
