import React from 'react';
import { Tabs } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from '@app/_styles/colors';
import { View, Text, StyleSheet } from 'react-native';


/**
 * 탭 네비게이션 레이아웃 컴포넌트
 * - 하단 탭 바 구성
 * - 각 탭의 아이콘과 레이블 설정
 */
export default function TabsLayout() {
    /**
     * 탭 바 아이콘 렌더링 함수
     * @param {string} name - 아이콘 이름
     * @param {string} color - 아이콘 색상
     * @param {string} label - 탭 레이블
     * @param {boolean} focused - 탭 활성화 여부
     */
    const renderTabBarIcon = (iconName, color, label, focused) => (
        <View style={styles.tabBarItem}>
            <FontAwesome5 name={iconName} size={20} color={color} />
            <Text 
                style={[styles.tabBarLabel, { color }, focused && styles.tabBarLabelFocused]}
                numberOfLines={1}
            >
                {label}
            </Text>
        </View>
    );

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: styles.tabBar, // 여기에 배경색 설정
                tabBarShowLabel: false, // 기본 라벨 숨기기
            }}
        >
            <Tabs.Screen
                name="(home)"
                options={{
                    title: '홈',
                    tabBarIcon: ({ color, focused }) => renderTabBarIcon('home', color, '홈', focused),
                }}
            />
            <Tabs.Screen
                name="post/[id]"
                options={{
                    title: '게시글',
                    href: null,
                }}
            />
            <Tabs.Screen
                name="post/create"
                options={{
                    title: '게시글 작성',
                    href: null,
                }}
            />
            <Tabs.Screen
                name="category/[id]"
                options={{
                    title: '카테고리',
                    href: null,
                }}
            />
            <Tabs.Screen
                name="(ranking)"
                options={{
                    title: '랭킹',
                    tabBarIcon: ({ color, focused }) => renderTabBarIcon('trophy', color, '랭킹', focused),
                }}
            />
            <Tabs.Screen
                name="(community)"
                options={{
                    title: '꿀팁 공유',
                    tabBarIcon: ({ color, focused }) => renderTabBarIcon('users', color, '꿀팁 공유', focused),
                }}
            />
            <Tabs.Screen
                name="(event)"
                options={{
                    title: '이벤트',
                    tabBarIcon: ({ color, focused }) => renderTabBarIcon('calendar', color, '이벤트', focused),
                }}
            />
            <Tabs.Screen
                name="(setting)"
                options={{
                    title: '설정',
                    tabBarIcon: ({ color, focused }) => renderTabBarIcon('cog', color, '설정', focused),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        height: 60,
        paddingBottom: 5,
        paddingTop: 5,
        backgroundColor: colors.background,
    },
    tabBarItem: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabBarLabel: {
        fontSize: 12,
        marginTop: 2,
    },
    tabBarLabelFocused: {
        fontWeight: '600',
    },
});
