import { Slot } from 'expo-router';
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
                    <Slot />
                </PostProvider>
            </SearchProvider>
        </AuthProvider>
    );
} 