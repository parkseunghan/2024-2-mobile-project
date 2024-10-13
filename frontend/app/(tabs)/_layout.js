import { Tabs } from "expo-router";
import { FontAwesome5 } from '@expo/vector-icons';

export default () => {
    return (
        <Tabs>
            <Tabs.Screen
                name="home"
                options={{
                    tabBarIcon: ({ color, size }) => <FontAwesome5 name="list" size={size} color={color} />
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    tabBarIcon: ({ color, size }) => <FontAwesome5 name="user" size={size} color={color} />
                }}
            />

            <Tabs.Screen
                name="list"
                options={{
                    headerShown: false,
                    tabBarLabel: 'News',
                    tabBarIcon: ({ color, size }) => <FontAwesome5 name="newspaper" size={size} color={color} />
                }}
            />

        </Tabs>
    )
}