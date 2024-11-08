// API 에러 처리를 위한 유틸리티
// export const handleApiError = (error) => {
//     // API 에러 메시지 표준화
//     // 사용자 친화적인 에러 메시지 반환
//   };

export const handleApiError = (error) => {
  const message = error.response?.data?.message || '오류가 발생했습니다.';
  return { error: true, message };
}; 