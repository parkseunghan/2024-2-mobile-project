import { Stack } from 'expo-router';
import { AuthProvider } from '@app/_context/AuthContext';
import { SearchProvider } from '@app/_context/SearchContext';
import { PostProvider } from '@app/_context/PostContext';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
    return (
        <AuthProvider>
            <SearchProvider>
                <PostProvider>
                    <StatusBar style="dark" />
                    <Stack screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="(tabs)" />
                        <Stack.Screen name="(auth)" />
                        <Stack.Screen name="(post)" />
                        <Stack.Screen name="(category)" />
                        <Stack.Screen name="search-results" options={{ headerShown: true }} />
                        <Stack.Screen name="video-detail" options={{ headerShown: true }} />
                        <Stack.Screen name="(admin)" />
                        <Stack.Screen name="index" />
                    </Stack>
                </PostProvider>
            </SearchProvider>
        </AuthProvider>
    );
} 