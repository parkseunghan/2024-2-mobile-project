// app/screens/SettingScreen.js
import React from 'react'; // React 라이브러리 임포트
import { View, Text, Button } from 'react-native'; // 뷰, 텍스트, 버튼 컴포넌트 임포트


const SettingScreen = ({ navigation }) => {
    return (
        <View >

            <Text >설정 화면</Text>
            <Text >설정 1</Text>
            <Text >설정 2</Text>

            <Button title="관리" onPress={() => {
                navigation.navigate('Admin');
            }} />
        </View>
    );
};

export default SettingScreen; // SettingScreen 컴as포넌트 내보내기
