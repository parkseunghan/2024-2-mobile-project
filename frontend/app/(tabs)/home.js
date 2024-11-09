import { Stack } from 'expo-router';
import { Header } from '@app/_components/common/Header';
import MainScreen from '@app/_screens/MainScreen';

export default function Home() {
    return (
        <>
            
            <Stack.Screen
                options={{
                    header: () => <Header title="홈" />,
                }}
            />
            <MainScreen />
        </>
    );
} 