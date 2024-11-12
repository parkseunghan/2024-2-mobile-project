import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { typography } from '@app/_styles/typography';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BoardScreen from './BoardScreen';
import CreatePostScreen from './CreatePostScreen';
import PostDetailScreen from './PostDetailScreen';
import FavoritesScreen from './FavoritesScreen';

const Stack = createNativeStackNavigator();

export default function CommunityScreen() {
    return (

        <Stack.Navigator>
            <Stack.Screen
                name="Board"
                component={BoardScreen}
                options={{ title: '꿀팁 공유 게시판' }}
            />
            <Stack.Screen
                name="CreatePost"
                component={CreatePostScreen}
                options={{ title: '게시물 작성' }}
            />
            <Stack.Screen
                name="PostDetail"
                component={PostDetailScreen}
                options={{ title: '게시물 내용' }}
            />
            <Stack.Screen
                name="Favorites"
                component={FavoritesScreen} // 즐겨찾기 화면 추가
                options={{ title: '즐겨찾기' }}
            />
        </Stack.Navigator>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
        padding: spacing.xl,
    },
    text: {
        ...typography.body,
        color: colors.text.secondary,
    },
}); 