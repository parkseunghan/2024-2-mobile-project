import { Stack } from 'expo-router';
import VideoDetailScreen from '@app/_screens/VideoDetailScreen';
import { Header } from '@app/_components/common/Header';

export default function VideoDetail() {
    return (
        <>
            <Stack.Screen
                options={{
                    header: () => (
                        <Header
                            showBackButton={true}
                        />
                    ),
                }}
            />
            <VideoDetailScreen />
        </>
    );
} 