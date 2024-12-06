import { Stack } from 'expo-router';
import PostDetailScreen from '@app/_screens/community/PostDetailScreen';
import { Header } from '@app/_components/common/Header';

export default function PostDetail() {
    return (
        <>
            <Stack.Screen
                options={{
                    header: () => (
                        <Header
                            title="게시글"
                            showBackButton={true}
                            hideSearchBar={true}
                        />
                    ),
                    headerShown: true
                }}
            />
            <PostDetailScreen />
        </>
    );
} 