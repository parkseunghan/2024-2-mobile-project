import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './(screens)/LoginScreen';
import SignupScreen from './(screens)/SignupScreen';
import WelcomeScreen from './(screens)/WelcomeScreen';

const Stack = createNativeStackNavigator();

const App = () => {
    return (

        <Stack.Navigator initialRouteName="Welcome">
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
        </Stack.Navigator>

    );
};

export default App;
