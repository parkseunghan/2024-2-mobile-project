import { Stack } from 'expo-router';
import { Header } from '@app/_components/common/Header';
import SettingScreen from '@app/_screens/SettingScreen';

export default function Profile() {
    return (
        <>
            <Stack.Screen
                options={{
                    header: () => <Header title="설정" />,
                }}
            />
            <SettingScreen />
        </>
    );
} 