import { Stack } from 'expo-router';
import { Header } from '@app/_components/common/Header';
import ProfileScreen from '@app/_screens/ProfileScreen';

export default function Profile() {
    return (
        <>
            <Stack.Screen
                options={{
                    header: () => <Header title="프로필" />,
                }}
            />
            <ProfileScreen />
        </>
    );
} 