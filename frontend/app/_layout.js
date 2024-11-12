import { Slot } from 'expo-router';
import { AuthProvider } from '@app/_context/AuthContext';
import { SearchProvider } from '@app/_context/SearchContext';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
    return (
        <AuthProvider>
            <SearchProvider>
                <StatusBar style="dark" />
                <Slot />
            </SearchProvider>
        </AuthProvider>
    );
} 