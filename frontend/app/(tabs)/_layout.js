import React from 'react';
import { Tabs } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: colors.background,
                    height: 60,
                    paddingBottom: spacing.sm,
                    paddingTop: spacing.xs,
                    borderTopColor: colors.border,
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.text.secondary,
            }}
        >
            <Tabs.Screen
                name="(home)"
                options={{
                    title: '홈',
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome5 name="home" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="(community)"
                options={{
                    title: '커뮤니티',
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome5 name="users" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="(setting)"
                options={{
                    title: '설정',
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome5 name="cog" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}

