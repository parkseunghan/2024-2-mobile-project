import React from 'react';
import { Tabs } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { Platform, View, Text } from 'react-native';

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
    const renderTabBarIcon = (name, color, label, focused) => (
        <View style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: 10,
            width: 80,
        }}>
            <FontAwesome5 name={name} size={20} color={color} />
            <Text
                style={{
                    color: color,
                    fontSize: 11,
                    marginTop: 4,
                    textAlign: 'center',
                }}
            >
                {label}
            </Text>
        </View>
    );

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: colors.background,
                    height: 65,
                    paddingVertical: 0,
                    borderTopColor: colors.border,
                },
                tabBarShowLabel: false,
                tabBarItemStyle: {
                    width: 80,
                },
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
                name="(ranking)"
                options={{
                    title: '랭킹',
                    tabBarIcon: ({ color, focused }) => renderTabBarIcon('trophy', color, '랭킹', focused),
                }}
            />
            <Tabs.Screen
                name="(community)"
                options={{
                    title: '커뮤니티',
                    tabBarIcon: ({ color, focused }) => renderTabBarIcon('users', color, '커뮤니티', focused),
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

