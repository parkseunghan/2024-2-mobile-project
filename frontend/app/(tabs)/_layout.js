import React from 'react';
import { Tabs } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';

const TabLayout = () => {
    return (
        <Tabs screenOptions={{ headerShown: false }}>
            <Tabs.Screen
                name="home"
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => <FontAwesome5 name="home" size={size} color={color} />,
                }} />
            <Tabs.Screen
                name="community"
                options={{
                    tabBarIcon: ({ color, size }) => <FontAwesome5 name="comments" size={size} color={color} />
                }} />
            <Tabs.Screen
                name="setting"
                options={{
                    tabBarIcon: ({ color, size }) => <FontAwesome5 name="cog" size={size} color={color} />
                }} />
        </Tabs>
    );
};

export default TabLayout;

