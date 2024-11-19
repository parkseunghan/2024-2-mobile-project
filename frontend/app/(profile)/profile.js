import { Stack, useRouter } from 'expo-router';
import { Header } from '@app/_components/common/Header';
import ProfileScreen from '@app/_screens/ProfileScreen';

export default function Profile() {
    const router = useRouter();
    return (
        <>
            <Stack.Screen
                options={{
                    header: () => (
                        <Header
                            title="프로필"
                            showBackButton={true}
                            onPress={() => router.push('/(tabs)/home')}
                        />
                    ),
                }}
            />
            <ProfileScreen />
        </>
    );
} 