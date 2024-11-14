// Banner.js
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { colors } from '@app/_styles/colors'; // Import your custom colors
import { spacing } from '@app/_styles/spacing';

const Banner = ({ title, subtitle }) => (
    <View style={styles.bannerContainer}>
        <Text style={styles.bannerTitle}>{title}</Text>
        {subtitle && <Text style={styles.bannerSubtitle}>{subtitle}</Text>}
    </View>
);

const styles = StyleSheet.create({
    bannerContainer: {
        backgroundColor: "white", // Change to a new color for the background
        padding: spacing.lg,
        paddingHorizontal: spacing.xl, // Increase horizontal padding
        borderRadius: 12, // Slightly increase the border radius
        margin: spacing.md,
        width: '95%', // Increase the width
        alignSelf: 'center',
        height: 100,
    },
    bannerTitle: {
        color: colors.white, // White text for the title
        fontSize: 24, // Increase font size for the title
        fontWeight: 'bold',
        textAlign: 'center',
    },
    bannerSubtitle: {
        color: colors.lightText, // Use a lighter color for the subtitle
        fontSize: 16, // Increase font size for the subtitle
        textAlign: 'center',
        marginTop: spacing.sm, // Increase top margin
    },
});

export default Banner;
