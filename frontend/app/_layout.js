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
                    <Stack>
                        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                        <Stack.Screen name="post" options={{ headerShown: false }} />
                        <Stack.Screen name="search-results" options={{ headerShown: true }} />
                        <Stack.Screen name="video-detail" options={{ headerShown: false }} />
                        <Stack.Screen name="(admin)" options={{ headerShown: false }} />
                    </Stack>
                </PostProvider>
            </SearchProvider>
        </AuthProvider>
    );
} 