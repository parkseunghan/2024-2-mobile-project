import { Stack } from 'expo-router';
import CreatePostScreen from '@app/_screens/community/CreatePostScreen';
import { Header } from '@app/_components/common/Header';

export default function CreatePost() {
    return (
        <>
            <Stack.Screen
                options={{
                    header: () => (
                        <Header
                            title="게시글 작성"
                            showBackButton={true}
                        />
                    ),
                }}
            />
            <CreatePostScreen />
        </>
    );
} 