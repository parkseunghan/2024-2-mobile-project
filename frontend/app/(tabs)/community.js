import { Stack } from 'expo-router';
import { Header } from '@app/_components/common/Header';
import CommunityScreen from '@app/_screens/CommunityScreen';

export default function Community() {
    return (
        <>
            <Stack.Screen
                options={{
                    header: () => <Header title="커뮤니티" />,
                }}
            />
            <CommunityScreen />
        </>
    );
} 