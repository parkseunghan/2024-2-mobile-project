import { Stack } from 'expo-router';
import { colors } from '@app/_styles/colors';
import { Header } from '@app/_components/common/Header';

export default function SearchLayout() {
    return (
        <Stack
            screenOptions={{
                header: () => (
                    <Header
                        showBackButton={true}
                        isSearchPage={true}
                    />
                ),
                headerStyle: {
                    backgroundColor: colors.background,
                },
                headerTintColor: colors.text.primary,
            }}
        />
    );
} 