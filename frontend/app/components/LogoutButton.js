import React from 'react';
import axios from 'axios';

const LogoutButton = () => {
    const handleLogout = async () => {
        try {
            console.log('로그아웃 요청 전'); // 요청 전 로그

            // 로그아웃 요청
            const response = await axios.post('http://localhost:5000/api/auth/logout', {}, {
                withCredentials: true, // 쿠키를 포함한 요청을 허용
            });

            console.log('로그아웃 요청 응답:', response.data); // 요청 응답 로그

            // 로그아웃 성공 시 처리 (예: 메인 페이지로 리다이렉트)
            window.location.href = '/'; // 메인 페이지로 리다이렉트
        } catch (error) {
            console.error('로그아웃 실패:', error); // 오류 로그
            if (error.response) {
                console.error('서버 응답:', error.response.data); // 서버 응답 로그
            } else if (error.request) {
                console.error('요청이 전송되었지만 응답이 없음:', error.request); // 요청 로그
            } else {
                console.error('오류 발생:', error.message); // 일반 오류 로그
            }
        }
    };

    return (
        <button onClick={handleLogout}>
            로그아웃
        </button>
    );
};

export default LogoutButton;
