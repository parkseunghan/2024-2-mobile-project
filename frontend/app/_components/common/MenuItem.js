import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';

export function MenuItem({ icon, label, onPress }) {
    return (
        <Pressable 
            style={({ pressed }) => [
                styles.menuItem,
                pressed && { opacity: 0.7 }
            ]}
            onPress={onPress}
        >
            <FontAwesome5 name={icon} size={16} color={colors.text.primary} />
            <Text style={styles.menuLabel}>{label}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.sm,
        gap: spacing.sm,
    },
    menuLabel: {
        color: colors.text.primary,
        marginLeft: spacing.sm,
    }
}); 