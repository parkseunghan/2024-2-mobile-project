import React from 'react';
import { Pressable, Text, View } from 'react-native';

export const Button = ({
    title,
    onPress,
    disabled = false,
    style,
    textStyle,
    icon,
}) => {
    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            style={({ pressed }) => [
                style,
                disabled && { opacity: 0.5 },
                pressed && { opacity: 0.8 },
            ]}
        >
            {icon && <View>{icon}</View>}
            <Text style={textStyle}>{title}</Text>
        </Pressable>
    );
}; 