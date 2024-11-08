import { Stack } from 'expo-router';
import { Header } from '@app/_components/common/Header';
import HomeScreen from '@app/_screens/HomeScreen';

export default function Home() {
    return (
        <>
            <Stack.Screen
                options={{
                    header: () => <Header title="홈" />,
                }}
            />
            <HomeScreen />
        </>
    );
} 