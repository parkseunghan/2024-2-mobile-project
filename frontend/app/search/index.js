import { Stack } from 'expo-router';
import SearchScreen from '@app/_screens/SearchScreen';
import { Header } from '@app/_components/common/Header';

export default function Search() {
    return (
        <>
            <Stack.Screen
                options={{
                    header: () => (
                        <Header
                            title="검색"
                            showBackButton={true}
                        />
                    ),
                }}
            />
            <SearchScreen />
        </>
    );
} 