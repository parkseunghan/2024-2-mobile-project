// app/screens/SettingScreen.js
import React from 'react'; // React 라이브러리 임포트
import { View, Text, Button } from 'react-native'; // 뷰, 텍스트, 버튼 컴포넌트 임포트


const SettingScreen = ({ navigation }) => {
    return (
        <View >

            <Text >설정 화면</Text>
            <Text >설정 1</Text>
            <Text >설정 2</Text>

            <Button title="저장" onPress={() => {
                // 로그아웃 처리 로직 추가
                // 예: 사용자 세션 삭제 후 로그인 화면으로 이동
                navigation.navigate('Login'); // 로그인 화면으로 이동
            }} />
        </View>
    );
};

export default SettingScreen; // SettingScreen 컴as포넌트 내보내기
