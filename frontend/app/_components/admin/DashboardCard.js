import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { typography } from '@app/_styles/typography';

export function DashboardCard({ title, value, icon, color }) {
    return (
        <View style={[styles.container, { borderLeftColor: color }]}>
            <FontAwesome5 
                name={icon} 
                size={24} 
                color={color}
                style={styles.icon}
            />
            <Text style={styles.value}>{value}</Text>
            <Text style={styles.title}>{title}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '48%',
        backgroundColor: colors.white,
        borderRadius: 8,
        padding: spacing.md,
        marginBottom: spacing.md,
        borderLeftWidth: 4,
        shadowColor: colors.shadow,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    icon: {
        marginBottom: spacing.sm,
    },
    value: {
        ...typography.h2,
        marginBottom: spacing.xs,
    },
    title: {
        ...typography.caption,
        color: colors.text.secondary,
    },
}); 