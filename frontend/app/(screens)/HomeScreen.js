// app/screens/HomeScreen.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CategoryScreen from './CategoryScreen';


const Stack = createNativeStackNavigator();

const HomeScreen = () => {
    return (

        <Stack.Navigator>
            <Stack.Screen
                name="Category"
                component={CategoryScreen}
                options={{ title: '카테고리' }}
            />
        </Stack.Navigator>

    );
};

export default HomeScreen;
