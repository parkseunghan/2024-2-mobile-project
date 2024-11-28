import { useMemo } from "react"
import { Stack } from "expo-router"
import { Header } from '@app/_components/common/Header';

/**
 * 탭 내부 레이아웃 컴포넌트
 * - 홈, 커뮤니티, 설정 탭의 공통 레이아웃 관리
 * - 각 화면별 헤더 설정
 * 
 * @param {string} segment - 현재 활성화된 세그먼트
 */
const Layout = ({ segment }) => {
    // 현재 세그먼트에 따른 루트 스크린 설정
    const rootScreen = useMemo(() => {
        switch (segment) {
            case '(home)':
                return <Stack.Screen name="home" options={{
                    header: () => <Header />,
                    title: 'home'
                }} />
            case '(ranking)':
                return <Stack.Screen name="ranking" options={{
                    header: () => <Header />,
                    title: 'ranking'
                }} />
            case '(community)':
                return <Stack.Screen name="community" options={{
                    header: () => <Header />,
                    title: 'community'
                }} />
            case '(event)':
                return <Stack.Screen name="event" options={{
                    header: () => <Header />,
                    title: 'event'
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