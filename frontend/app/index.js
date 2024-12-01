import { Redirect } from 'expo-router';
import { useAuth } from '@app/_lib/hooks';
import { View, ActivityIndicator } from 'react-native';
import { colors } from '@app/_styles/colors';

export default function Index() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (!user) {
        return <Redirect href="/(auth)/welcome" />;
    }

    if (user?.role === 'admin') {
        return <Redirect href="/(admin)/dashboard" />;
    }

    return <Redirect href="/(tabs)/home" />;
}
