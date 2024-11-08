export default {
  expo: {
    // ... 다른 설정들
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api'
    }
  }
}; 