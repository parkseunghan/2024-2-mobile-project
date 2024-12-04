import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { AuthProvider } from '@app/_context/AuthContext';
import { SearchProvider } from '@app/_context/SearchContext';
import { PostProvider } from '@app/_context/PostContext';
import { StatusBar } from 'expo-status-bar';

// Create a client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 60 * 1000, // 1분
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});

export default function RootLayout() {
    return (
        <QueryClientProvider client={queryClient}>
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
        </QueryClientProvider>
    );
} 