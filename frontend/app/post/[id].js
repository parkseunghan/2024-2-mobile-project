import { Stack } from 'expo-router';
import PostDetailScreen from '@app/_screens/PostDetailScreen';
import { Header } from '@app/_components/common/Header';

export default function PostDetail() {
    return (
        <>
            <Stack.Screen
                options={{
                    header: () => (
                        <Header
                            title="게시글 상세"
                            showBackButton={true}
                            hideSearchBar={true}
                        />
                    ),
                }}
            />
            <PostDetailScreen />
        </>
    );
} 