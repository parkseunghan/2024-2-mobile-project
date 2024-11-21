import { useMemo } from "react"
import { Stack } from "expo-router"
import { Header } from '@app/_components/common/Header';

const Layout = ({ segment }) => {
    const rootScreen = useMemo(() => {
        switch (segment) {
            case '(home)':
                return <Stack.Screen name="home" options={{
                    header: () => <Header />,
                    title: 'Home'
                }} />
            case '(community)':
                return <Stack.Screen name="community" options={{
                    header: () => <Header />,
                    title: 'community'
                }} />
            case '(setting)':
                return <Stack.Screen name="setting" options={{
                    header: () => <Header />,
                    title: 'setting'
                }} />
        }
    }, [segment])

    return (
        <Stack
            screenOptions={{
                animation: 'slide_from_right',
            }}
        >
            {rootScreen}
            <Stack.Screen name="profile" options={{ header: () => <Header /> }} />
            <Stack.Screen name="search" options={{ headerShown: false }} />
            <Stack.Screen 
                name="search-results" 
                options={{ 
                    header: () => <Header showBackButton={true} />,
                }} 
            />
            <Stack.Screen 
                name="video-detail" 
                options={{ 
                    header: () => <Header showBackButton={true} />,
                    presentation: 'card',
                }} 
            />
        </Stack>
    )
}

export default Layout