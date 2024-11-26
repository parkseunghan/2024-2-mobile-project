import React from 'react';
import { Tabs } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { Platform, View, Text } from 'react-native';

export default function TabsLayout() {
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
                name="(community)"
                options={{
                    title: '커뮤니티',
                    tabBarIcon: ({ color, focused }) => renderTabBarIcon('users', color, '커뮤니티', focused),
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

