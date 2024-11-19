import { Stack, useRouter } from 'expo-router';
import { colors } from '@app/_styles/colors';
import { Header } from '@app/_components/common/Header';

export default function ProfileLayout() {
    const router = useRouter();
    return (
        <Stack
            screenOptions={{
                header: ({ navigation }) => (
                    <Header
                        onPress={() => router.push('/(tabs)/home')}
                    />
                ),
                headerStyle: {
                    backgroundColor: colors.background,
                },
                headerTintColor: colors.text.primary,
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        />
    );
} 